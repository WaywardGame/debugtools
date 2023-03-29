import EventEmitter from "event/EventEmitter";
import { IContainer } from "game/item/IItem";
import Item from "game/item/Item";
import { TextContext } from "language/ITranslation";
import Translation from "language/Translation";
import Button, { ButtonType } from "ui/component/Button";
import Component from "ui/component/Component";
import Details from "ui/component/Details";
import { RangeRow } from "ui/component/RangeRow";
import { Bound } from "utilities/Decorators";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import ClearInventory from "../../action/ClearInventory";
import Remove from "../../action/Remove";
import SetDecay from "../../action/SetDecay";
import SetDecayBulk from "../../action/SetDecayBulk";
import SetDurability from "../../action/SetDurability";
import SetDurabilityBulk from "../../action/SetDurabilityBulk";
import { areArraysIdentical } from "../../util/Array";
import AddItemToInventory from "./AddItemToInventory";
import { IInspectInformationSectionEvents } from "./InspectInformationSection";

export enum ContainerClasses {
	ContainedItemDetails = "debug-tools-container-contained-item-details",
	ItemDetails = "debug-tools-container-contained-item-details-item",
}

export default class Container extends Component {

	public static INSTANCE: Container | undefined;

	public static init() {
		return Container.INSTANCE = Container.INSTANCE || new Container();
	}

	public static appendTo(component: Component, host: Component, containerSupplier: () => IContainer | undefined) {
		return Container.init().appendToHost(component, host, containerSupplier);
	}

	public async appendToHost(component: Component, host: Component, containerSupplier: () => IContainer | undefined) {
		this.appendTo(component);
		this.containerSupplier = containerSupplier;
		this.refreshItems();

		await (host as EventEmitter.Host<IInspectInformationSectionEvents>).event.waitFor(["remove", "switchAway"]);
		if (this.containerSupplier === containerSupplier)
			delete this.containerSupplier;
	}

	private readonly wrapperContainedItems: Details;
	private readonly rangeBulkDurability: RangeRow;
	private readonly rangeBulkDecay: RangeRow;
	private containerSupplier?: () => IContainer | undefined;
	private items: number[] = [];

	public constructor() {
		super();

		new AddItemToInventory(this.getContainer).appendTo(this);
		this.wrapperContainedItems = new Details()
			.classes.add(ContainerClasses.ContainedItemDetails)
			.setSummary(summary => summary.setText(translation(DebugToolsTranslation.LabelItemDetails)))
			.appendTo(this);

		new Details()
			.setSummary(summary => summary.setText(translation(DebugToolsTranslation.LabelBulkItemOperations)))
			.append(this.rangeBulkDurability = new RangeRow()
				.classes.add("debug-tools-inspect-human-wrapper-set-durability-bulk")
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelDurability)))
				.editRange(range => range
					.setMax(60)
					.setStep(0.01))
				.setDisplayValue(value => [{ content: `${scale(value)}` }])
				.append(new Button()
					.setText(translation(DebugToolsTranslation.ButtonApply))
					.event.subscribe("activate", this.applyBulkDurability)))
			.append(this.rangeBulkDecay = new RangeRow()
				.classes.add("debug-tools-inspect-human-wrapper-set-decay-bulk")
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelDecay)))
				.editRange(range => range
					.setMax(60)
					.setStep(0.01))
				.setDisplayValue(value => [{ content: `${scale(value)}` }])
				.append(new Button()
					.setText(translation(DebugToolsTranslation.ButtonApply))
					.event.subscribe("activate", this.applyBulkDecay)))
			.append(new Button()
				.setText(translation(DebugToolsTranslation.ButtonClearInventory))
				.setType(ButtonType.Warning)
				.event.subscribe("activate", this.clear))
			.appendTo(this);

		this.event.subscribe("willRemove", this.willRemove);
	}

	public releaseAndRemove() {
		this.event.unsubscribe("willRemove", this.willRemove);
		this.remove();
		if (Container.INSTANCE === this)
			delete Container.INSTANCE;
	}

	public refreshItems() {
		const container = this.containerSupplier?.();
		const itemIds = container?.containedItems.map(item => item.id) ?? [];
		if (areArraysIdentical(itemIds, this.items))
			return;

		this.items = itemIds;
		this.wrapperContainedItems.dump();

		if (!this.items.length)
			return;

		for (const item of container!.containedItems) {
			new ContainerItemDetails(item)
				.appendTo(this.wrapperContainedItems);
		}
	}

	@Bound private willRemove() {
		this.store(this.getScreen()!);
		return false;
	}

	@Bound private getContainer() {
		return this.containerSupplier?.();
	}

	@Bound private clear() {
		const container = this.getContainer();
		if (container) ClearInventory.execute(localPlayer, container);
	}

	@Bound private applyBulkDurability() {
		const container = this.getContainer();
		if (container) SetDurabilityBulk.execute(localPlayer, container, Math.floor(1.2 ** this.rangeBulkDurability.rangeInput.value) - 1);
	}

	@Bound private applyBulkDecay() {
		const container = this.getContainer();
		if (container) SetDecayBulk.execute(localPlayer, container, Math.floor(1.2 ** this.rangeBulkDecay.rangeInput.value) - 1);
	}
}

export class ContainerItemDetails extends Details {

	private readonly itemRef: WeakRef<Item>;

	public get item() {
		return this.itemRef.deref()!;
	}

	public constructor(item: Item) {
		super();
		this.itemRef = new WeakRef(item);

		this.classes.add(ContainerClasses.ItemDetails);
		this.dataset.itemId = `${item.id}`;

		this.setSummary(summary => summary
			.setText(item.getName()
				.inContext(TextContext.Title)
				.passTo(Translation.colorizeImportance("secondary")))
			.setInheritTextTooltip());

		new RangeRow()
			.classes.add("debug-tools-inspect-human-wrapper-set-durability-bulk")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelDurability)))
			.editRange(range => range
				.setMax(unscale(this.item.durabilityMax))
				.setStep(0.01)
				.setRefreshMethod(() => unscale(this.item.durability)))
			.setDisplayValue(value => [{ content: `${scale(value)}` }])
			.event.subscribe("finish", this.applyDurability)
			.appendTo(this);

		if (this.item.canDecay())
			new RangeRow()
				.classes.add("debug-tools-inspect-human-wrapper-set-decay-bulk")
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelDecay)))
				.editRange(range => range
					.setMax(this.item.startingDecay ? unscale(this.item.startingDecay) : 60)
					.setStep(0.01)
					.setRefreshMethod(() => unscale(this.item.decay ?? 0)))
				.setDisplayValue(value => [{ content: `${scale(value)}` }])
				.event.subscribe("finish", this.applyDecay)
				.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.ActionRemove))
			.event.subscribe("activate", () => Remove.execute(localPlayer, item))
			.appendTo(this);

		if (this.item.isContainer())
			new Container().appendToHost(this, this, () => this.item.isContainer() ? this.item : undefined);
	}

	@Bound private applyDurability(_: any, value: number) {
		SetDurability.execute(localPlayer, this.item, scale(value));
	}

	@Bound private applyDecay(_: any, value: number) {
		SetDecay.execute(localPlayer, this.item, scale(value));
	}
}

function scale(value: number) {
	return Math.floor(1.2 ** value) - 1;
}

function unscale(value: number) {
	return Math.ceil(Math.log((value + 1)) / Math.log(1.2) * 100) / 100;
}

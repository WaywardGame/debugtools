import EventEmitter from "event/EventEmitter";
import { IContainer } from "game/item/IItem";
import { TextContext } from "language/ITranslation";
import Translation from "language/Translation";
import Button, { ButtonType } from "ui/component/Button";
import Component from "ui/component/Component";
import Details from "ui/component/Details";
import { RangeRow } from "ui/component/RangeRow";
import { Bound } from "utilities/Decorators";
import ClearInventory from "../../action/ClearInventory";
import Remove from "../../action/Remove";
import SetDurabilityBulk from "../../action/SetDurabilityBulk";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
import AddItemToInventory from "./AddItemToInventory";
import { IInspectInformationSectionEvents } from "./InspectInformationSection";

export default class Container extends Component {

	public static INSTANCE: Container | undefined;

	public static init() {
		return Container.INSTANCE = Container.INSTANCE || new Container();
	}

	public static async appendTo(component: Component, host: Component, containerSupplier: () => IContainer | undefined) {
		const instance = Container.init().appendTo(component);
		instance.containerSupplier = containerSupplier;
		instance.refreshItems();

		await (host as EventEmitter.Host<IInspectInformationSectionEvents>).event.waitFor(["remove", "switchAway"]);
		if (instance.containerSupplier === containerSupplier)
			delete instance.containerSupplier;
	}

	private readonly wrapperContainedItems: Details;
	private readonly rangeBulkDurability: RangeRow;
	private containerSupplier?: () => IContainer | undefined;
	private items: number[] = [];

	public constructor() {
		super();

		new AddItemToInventory(this.getContainer).appendTo(this);
		this.wrapperContainedItems = new Details()
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
				.setDisplayValue(value => [{ content: `${Math.floor(1.2 ** value) - 1}` }])
				.append(new Button()
					.setText(translation(DebugToolsTranslation.ButtonApply))
					.event.subscribe("activate", this.applyBulkDurability)))
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
			new Details()
				.setSummary(summary => summary
					.setText(item.getName()
						.inContext(TextContext.Title)
						.passTo(Translation.colorizeImportance("secondary")))
					.setInheritTextTooltip())
				.append(new Button()
					.setText(translation(DebugToolsTranslation.ActionRemove))
					.event.subscribe("activate", () => Remove.execute(localPlayer, item)))
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
}

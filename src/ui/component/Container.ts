/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { EventBus } from "event/EventBuses";
import EventEmitter from "event/EventEmitter";
import EventManager, { EventHandler } from "event/EventManager";
import { IContainer } from "game/item/IItem";
import Item from "game/item/Item";
import ItemManager from "game/item/ItemManager";
import Tile from "game/tile/Tile";
import { TextContext } from "language/ITranslation";
import Translation from "language/Translation";
import { MiscTranslation } from "language/dictionary/Misc";
import { BlockRow } from "ui/component/BlockRow";
import Button, { ButtonType } from "ui/component/Button";
import Component from "ui/component/Component";
import Details from "ui/component/Details";
import { RangeRow } from "ui/component/RangeRow";
import Text from "ui/component/Text";
import { Bound, Debounce } from "utilities/Decorators";
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
	Paginator = "debug-tools-container-contained-item-details-paginator",
	PaginatorButton = "debug-tools-container-contained-item-details-paginator-button",
	PaginatorPrev = "debug-tools-container-contained-item-details-paginator-button-prev",
	PaginatorNext = "debug-tools-container-contained-item-details-paginator-button-next",
	PaginatorInfo = "debug-tools-container-contained-item-details-paginator-info",
}

const CONTAINER_PAGE_LENGTH = 15;

export default class Container extends Component {

	public static INSTANCE: Container | undefined;

	public static init() {
		if (Container.INSTANCE)
			return Container.INSTANCE;

		const container = Container.INSTANCE = new Container();

		container.event.subscribe("willRemove", container.willRemove);
		return container;
	}

	public static appendTo(component: Component, host: Component, containerSupplier: () => IContainer | undefined) {
		return Container.init().appendToHost(component, host, containerSupplier);
	}

	public static releaseAndRemove() {
		if (!Container.INSTANCE)
			return;

		Container.INSTANCE.event.unsubscribe("willRemove", Container.INSTANCE.willRemove);
		Container.INSTANCE.remove();
		delete Container.INSTANCE;
	}

	public async appendToHost(component: Component, host: Component, containerSupplier: () => IContainer | undefined) {
		this.appendTo(component);
		this.containerSupplier = containerSupplier;
		this.refreshItems();

		EventManager.registerEventBusSubscriber(this);
		await (host as EventEmitter.Host<IInspectInformationSectionEvents>).event.waitFor(["remove", "switchAway"]);
		EventManager.deregisterEventBusSubscriber(this);
		if (this.containerSupplier === containerSupplier)
			delete this.containerSupplier;
	}

	private readonly wrapperContainedItems: Details;
	private readonly rangeBulkDurability: RangeRow;
	private readonly rangeBulkDecay: RangeRow;
	private containerSupplier?: () => IContainer | undefined;
	private items: number[] = [];
	private page = 0;

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
					.setMax(100)
					.setStep(0.01)
					.setMin(-20)
					.setRefreshMethod(() => -20))
				.setDisplayValue(value => value <= -10 ? [{ content: "0" }] : value <= 0 ? [{ content: "1" }]
					: Translation.misc(MiscTranslation.Percent).addArgs(value / 100))
				.append(new Button()
					.setText(translation(DebugToolsTranslation.ButtonApply))
					.event.subscribe("activate", this.applyBulkDurability)))
			.append(this.rangeBulkDecay = new RangeRow()
				.classes.add("debug-tools-inspect-human-wrapper-set-decay-bulk")
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelDecay)))
				.editRange(range => range
					.setMax(100)
					.setStep(0.01)
					.setMin(-20)
					.setRefreshMethod(() => -20))
				.setDisplayValue(value => value <= -10 ? [{ content: "0" }] : value <= 0 ? [{ content: "1" }]
					: Translation.misc(MiscTranslation.Percent).addArgs(value / 100))
				.append(new Button()
					.setText(translation(DebugToolsTranslation.ButtonApply))
					.event.subscribe("activate", this.applyBulkDecay)))
			.append(new Button()
				.setText(translation(DebugToolsTranslation.ButtonClearInventory))
				.setType(ButtonType.Warning)
				.event.subscribe("activate", this.clear))
			.appendTo(this);
	}

	@Debounce(100)
	public refreshItems() {
		const container = this.containerSupplier?.();
		const itemIds = container?.containedItems.map(item => item.id) ?? [];
		if (areArraysIdentical(itemIds, this.items))
			return;

		this.items = itemIds;
		this.changeDisplayedItems();
	}

	private changeDisplayedItems() {
		this.wrapperContainedItems.dump();

		const container = this.containerSupplier?.();
		if (!container || !this.items.length)
			return;

		const totalPages = Math.ceil(this.items.length / CONTAINER_PAGE_LENGTH);
		this.page = this.page < 0 ? totalPages - 1
			: this.page >= totalPages ? 0
				: this.page;

		for (const item of container.containedItems.slice(this.page * CONTAINER_PAGE_LENGTH, this.page * CONTAINER_PAGE_LENGTH + CONTAINER_PAGE_LENGTH)) {
			new ContainerItemDetails(item)
				.appendTo(this.wrapperContainedItems);
		}

		new BlockRow()
			.classes.add(ContainerClasses.Paginator)
			.append(new Button()
				.classes.add(ContainerClasses.PaginatorButton, ContainerClasses.PaginatorPrev)
				.setText(translation(DebugToolsTranslation.ButtonPreviousItems))
				.event.subscribe("activate", () => { this.page--; this.changeDisplayedItems() }))
			.append(new Text()
				.classes.add(ContainerClasses.PaginatorButton, ContainerClasses.PaginatorInfo)
				.classes.add("debug-tools-")
				.setText(translation(DebugToolsTranslation.LabelItems),
					this.page * CONTAINER_PAGE_LENGTH + 1,
					Math.min(this.page * CONTAINER_PAGE_LENGTH + CONTAINER_PAGE_LENGTH, container.containedItems.length),
					container.containedItems.length))
			.append(new Button()
				.classes.add(ContainerClasses.PaginatorButton, ContainerClasses.PaginatorNext)
				.setText(translation(DebugToolsTranslation.ButtonNextItems))
				.event.subscribe("activate", () => { this.page++; this.changeDisplayedItems() }))
			.appendTo(this.wrapperContainedItems);
	}

	@EventHandler(EventBus.ItemManager, "containerItemAdd")
	@EventHandler(EventBus.ItemManager, "containerItemRemove")
	protected onContainerItemChange(itemManager: ItemManager, items: Item[], container?: IContainer, containerTile?: Tile) {
		if (container === this.containerSupplier?.())
			this.refreshItems();
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
		if (container) SetDurabilityBulk.execute(localPlayer, container, this.rangeBulkDurability.rangeInput.value <= -10 ? 0 : this.rangeBulkDurability.rangeInput.value <= 0 ? 1
			: this.rangeBulkDurability.rangeInput.value === 100 ? 0.99999 : this.rangeBulkDurability.rangeInput.value / 100);
	}

	@Bound private applyBulkDecay() {
		const container = this.getContainer();
		if (container) SetDecayBulk.execute(localPlayer, container, this.rangeBulkDecay.rangeInput.value <= -10 ? 0 : this.rangeBulkDecay.rangeInput.value <= 0 ? 1
			: this.rangeBulkDurability.rangeInput.value === 100 ? 0.99999 : this.rangeBulkDecay.rangeInput.value / 100);
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

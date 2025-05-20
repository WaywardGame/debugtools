import { EventBus } from "@wayward/game/event/EventBuses";
import { EventHandler, eventManager } from "@wayward/game/event/EventManager";
import { Quality } from "@wayward/game/game/IObject";
import type { IContainable, IContainer } from "@wayward/game/game/item/IItem";
import Item from "@wayward/game/game/item/Item";
import type ItemManager from "@wayward/game/game/item/ItemManager";
import type Tile from "@wayward/game/game/tile/Tile";
import Dictionary from "@wayward/game/language/Dictionary";
import { TextContext } from "@wayward/game/language/ITranslation";
import Translation from "@wayward/game/language/Translation";
import { MiscTranslation } from "@wayward/game/language/dictionary/Misc";
import { BlockRow } from "@wayward/game/ui/component/BlockRow";
import Button, { ButtonType } from "@wayward/game/ui/component/Button";
import Component from "@wayward/game/ui/component/Component";
import Details from "@wayward/game/ui/component/Details";
import Dropdown from "@wayward/game/ui/component/Dropdown";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import { RangeRow } from "@wayward/game/ui/component/RangeRow";
import Text from "@wayward/game/ui/component/Text";
import Enums from "@wayward/game/utilities/enum/Enums";
import { Bound } from "@wayward/utilities/Decorators";
import { Tuple } from "@wayward/utilities/collection/Tuple";
import type EventEmitter from "@wayward/utilities/event/EventEmitter";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import ClearInventory from "../../action/ClearInventory";
import Remove from "../../action/Remove";
import SetDecay from "../../action/SetDecay";
import SetDecayBulk from "../../action/SetDecayBulk";
import SetDurability from "../../action/SetDurability";
import SetDurabilityBulk from "../../action/SetDurabilityBulk";
import SetQuality from "../../action/SetQuality";
import SetQualityBulk from "../../action/SetQualityBulk";
import { areArraysIdentical } from "../../util/Array";
import AddItemToInventory from "./AddItemToInventory";
import type { IInspectInformationSectionEvents } from "./InspectInformationSection";
import MagicalPropertiesEditor from "./MagicalPropertiesEditor";

export enum ContainerClasses {
	Main = "debug-tools-container",
	ContainedItemDetails = "debug-tools-container-contained-item-details",
	BulkItemActions = "debug-tools-container-contained-item-details-bulk-item-actions",
	ItemDetails = "debug-tools-container-contained-item-details-item",
	Paginator = "debug-tools-container-contained-item-details-paginator",
	PaginatorButton = "debug-tools-container-contained-item-details-paginator-button",
	PaginatorPrev = "debug-tools-container-contained-item-details-paginator-button-prev",
	PaginatorNext = "debug-tools-container-contained-item-details-paginator-button-next",
	PaginatorInfo = "debug-tools-container-contained-item-details-paginator-info",
}

const CONTAINER_PAGE_LENGTH = 15;

export default class Container extends Component {

	public static getFirst(): Container | undefined {
		return Component.get<Container>(`.${ContainerClasses.Main}`);
	}

	public static async appendTo(component: Component, host: Component, containerSupplier: () => IContainer | undefined): Promise<Container> {
		const container = new Container();
		await container.appendToHost(component, host, containerSupplier);
		return container;
	}

	public async appendToHost(component: Component, host: Component, containerSupplier: () => IContainer | undefined): Promise<void> {
		this.appendTo(component);
		this.containerSupplier = containerSupplier;
		this.refreshItems();

		eventManager.registerEventBusSubscriber(this);
		await (host as EventEmitter.Host<IInspectInformationSectionEvents>).event.waitFor(["remove", "switchAway"]);
		eventManager.deregisterEventBusSubscriber(this);
		if (this.containerSupplier === containerSupplier) {
			delete this.containerSupplier;
		}
	}

	private readonly wrapperContainedItems: Details;
	private readonly rangeBulkDurability: RangeRow;
	private readonly rangeBulkDecay: RangeRow;
	private readonly dropdownBulkQuality: Dropdown<Quality>;
	private readonly buttonBulkQualityApply: Button;

	private containerSupplier?: () => IContainer | undefined;
	private items: number[] = [];
	private page = 0;

	public constructor() {
		super();
		this.classes.add(ContainerClasses.Main);

		new AddItemToInventory(this.getContainer).appendTo(this);
		this.wrapperContainedItems = new Details()
			.classes.add(ContainerClasses.ContainedItemDetails)
			.setSummary(summary => summary.setText(translation(DebugToolsTranslation.LabelItemDetails)))
			.event.subscribe("open", this.refreshItems)
			.appendTo(this);

		new Details()
			.classes.add(ContainerClasses.BulkItemActions)
			.setSummary(summary => summary.setText(translation(DebugToolsTranslation.LabelBulkItemOperations)))
			.append(this.rangeBulkDurability = new RangeRow()
				.classes.add("debug-tools-inspect-human-wrapper-set-bulk")
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
				.classes.add("debug-tools-inspect-human-wrapper-set-bulk")
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
			.append(new LabelledRow()
				.classes.add("dropdown-label", "debug-tools-inspect-human-wrapper-set-bulk")
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelQuality)))
				.append(this.dropdownBulkQuality = new Dropdown<Quality>()
					.setRefreshMethod(() => ({
						defaultOption: Quality.Random,
						options: Enums.values(Quality)
							.map(quality => Tuple(quality, Translation.get(Dictionary.Quality, quality).inContext(TextContext.Title)))
							.map(([id, t]) => Tuple(id, (option: Button) => option.setText(t))),
					}))
					.event.subscribe("selection", this.applyBulkQuality))
				.append(this.buttonBulkQualityApply = new Button()
					.setText(translation(DebugToolsTranslation.ButtonApply))
					.event.subscribe("activate", this.applyBulkQuality)))
			.append(new Button()
				.setText(translation(DebugToolsTranslation.ButtonClearInventory))
				.setType(ButtonType.Warning)
				.event.subscribe("activate", this.clear))
			.appendTo(this);
	}

	public showItem(item?: Item): ContainerItemDetails | undefined {
		this.wrapperContainedItems.open();

		const container = this.containerSupplier?.();
		if (!container) {
			return undefined;
		}

		const itemChain: Item[] = [];
		let searchContainer: IContainable | undefined = item;
		while (searchContainer instanceof Item && searchContainer !== container) {
			itemChain.push(searchContainer);
			searchContainer = searchContainer.containedWithin;
		}

		itemChain.reverse();
		item = itemChain[0];

		const page = Math.max(0, item ? this.getPageOf(item) : 0);

		this.page = page;
		return this.changeDisplayedItems(itemChain);
	}

	@Bound public refreshItems(): void {
		const container = this.containerSupplier?.();
		const itemIds = container?.containedItems.map(item => item.id) ?? [];
		if (areArraysIdentical(itemIds, this.items)) {
			return;
		}

		this.changeDisplayedItems();
	}

	private getTotalPages(): number {
		const container = this.containerSupplier?.();
		return Math.ceil((container?.containedItems.length ?? 0) / CONTAINER_PAGE_LENGTH);
	}

	private getPageOf(item: Item): number {
		const container = this.containerSupplier?.();
		if (!container) {
			return -1;
		}

		const index = container.containedItems.indexOf(item);
		if (index === -1) {
			return -1;
		}

		return Math.floor(index / CONTAINER_PAGE_LENGTH);
	}

	private getItemsOfPage(page: number): Item[] {
		const container = this.containerSupplier?.();
		if (!container) {
			return [];
		}

		return container.containedItems.slice(page * CONTAINER_PAGE_LENGTH, page * CONTAINER_PAGE_LENGTH + CONTAINER_PAGE_LENGTH);
	}

	private changeDisplayedItems(itemChain: Item[] = []): ContainerItemDetails | undefined {
		this.wrapperContainedItems.dump();

		if (!this.wrapperContainedItems.isOpen) {
			return;
		}

		const container = this.containerSupplier?.();
		if (!container) {
			return;
		}

		this.items = container.containedItems.map(item => item.id) ?? [];

		const totalPages = this.getTotalPages();
		this.page = this.page < 0 ? totalPages - 1
			: this.page >= totalPages ? 0
				: this.page;

		let result: ContainerItemDetails | undefined;
		for (const item of this.getItemsOfPage(this.page)) {
			new ContainerItemDetails(item)
				.toggleOpen(itemChain.includes(item))
				.schedule(details => result ??= !details.isOpen ? undefined
					: details.container?.showItem(itemChain.last()) ?? details)
				.appendTo(this.wrapperContainedItems);
		}

		result?.magicalPropertiesEditor?.open();

		new BlockRow()
			.classes.add(ContainerClasses.Paginator)
			.append(new Button()
				.classes.add(ContainerClasses.PaginatorButton, ContainerClasses.PaginatorPrev)
				.setText(translation(DebugToolsTranslation.ButtonPreviousItems))
				.event.subscribe("activate", () => {
					this.page--; this.changeDisplayedItems();
				}))
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
				.event.subscribe("activate", () => {
					this.page++; this.changeDisplayedItems();
				}))
			.appendTo(this.wrapperContainedItems);

		return result;
	}

	@EventHandler(EventBus.ItemManager, "containerItemAdd")
	@EventHandler(EventBus.ItemManager, "containerItemRemove")
	protected onContainerItemChange(itemManager: ItemManager, items: Item[], container?: IContainer, containerTile?: Tile): void {
		if (container === this.containerSupplier?.()) {
			this.schedule(100, 1, this.refreshItems);
		}
	}

	@Bound private getContainer(): IContainer | undefined {
		return this.containerSupplier?.();
	}

	@Bound private clear(): void {
		const container = this.getContainer();
		if (container) {
			void ClearInventory.execute(localPlayer, container);
		}
	}

	@Bound private applyBulkDurability(): void {
		const container = this.getContainer();
		if (container) {
			void SetDurabilityBulk.execute(localPlayer, container, this.rangeBulkDurability.rangeInput.value <= -10 ? 0 : this.rangeBulkDurability.rangeInput.value <= 0 ? 1
				: this.rangeBulkDurability.rangeInput.value === 100 ? 0.99999 : this.rangeBulkDurability.rangeInput.value / 100);
		}
	}

	@Bound private applyBulkDecay(): void {
		const container = this.getContainer();
		if (container) {
			void SetDecayBulk.execute(localPlayer, container, this.rangeBulkDecay.rangeInput.value <= -10 ? 0 : this.rangeBulkDecay.rangeInput.value <= 0 ? 1
				: this.rangeBulkDurability.rangeInput.value === 100 ? 0.99999 : this.rangeBulkDecay.rangeInput.value / 100);
		}
	}

	@Bound private applyBulkQuality(): void {
		this.buttonBulkQualityApply.toggle(this.dropdownBulkQuality.selectedOption === Quality.Random);
		const container = this.getContainer();
		if (container && this.dropdownBulkQuality.selectedOption !== undefined) {
			void SetQualityBulk.execute(localPlayer, container, this.dropdownBulkQuality.selectedOption);
		}
	}
}

export class ContainerItemDetails extends Details {

	private readonly itemRef: WeakRef<Item>;

	public get item(): Item {
		return this.itemRef.deref()!;
	}

	public readonly container?: Container;
	public readonly dropdownQuality: Dropdown<Quality>;
	public readonly buttonQualityApply: Button;
	public readonly magicalPropertiesEditor?: MagicalPropertiesEditor;

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

		new LabelledRow()
			.classes.add("dropdown-label", "debug-tools-inspect-human-wrapper-set-bulk")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelQuality)))
			.append(this.dropdownQuality = new Dropdown<Quality>()
				.setRefreshMethod(() => ({
					defaultOption: Quality.Random,
					options: Enums.values(Quality)
						.map(quality => Tuple(quality, Translation.get(Dictionary.Quality, quality).inContext(TextContext.Title)))
						.map(([id, t]) => Tuple(id, (option: Button) => option.setText(t))),
				}))
				.event.subscribe("selection", this.applyQuality))
			.append(this.buttonQualityApply = new Button()
				.setText(translation(DebugToolsTranslation.ButtonApply))
				.event.subscribe("activate", this.applyQuality))
			.appendTo(this);

		new RangeRow()
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelDurability)))
			.editRange(range => range
				.setMax(unscale(this.item.durabilityMaxWithMagical))
				.setStep(0.01)
				.setRefreshMethod(() => unscale(this.item.durability)))
			.setDisplayValue(value => [{ content: `${scale(value)}` }])
			.event.subscribe("finish", this.applyDurability)
			.appendTo(this);

		if (this.item.canDecay()) {
			new RangeRow()
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelDecay)))
				.editRange(range => range
					.setMax(this.item.startingDecay ? unscale(this.item.startingDecay) : 60)
					.setStep(0.01)
					.setRefreshMethod(() => unscale(this.item.getDecayTime() ?? 0)))
				.setDisplayValue(value => [{ content: `${scale(value)}` }])
				.event.subscribe("finish", this.applyDecay)
				.appendTo(this);
		}

		if (this.item.getValidMagicalProperties().length) {
			this.magicalPropertiesEditor = new MagicalPropertiesEditor(item)
				.appendTo(this);
		}

		if (this.item.isContainer()) {
			this.container = new Container()
				.schedule(container => container
					.appendToHost(this, this, () => this.item.isContainer() ? this.item : undefined));
		}

		new Button()
			.setText(translation(DebugToolsTranslation.ActionRemove)
				.addArgs(this.item.getName().inContext(TextContext.Title))
				.addArgs(this.item.island.items.getContainerName(this.item.containedWithin)?.inContext(TextContext.Title)))
			.event.subscribe("activate", () => Remove.execute(localPlayer, item))
			.appendTo(this);
	}

	@Bound private applyDurability(_: any, value: number): void {
		void SetDurability.execute(localPlayer, this.item, scale(value));
	}

	@Bound private applyDecay(_: any, value: number): void {
		void SetDecay.execute(localPlayer, this.item, scale(value));
	}

	@Bound private applyQuality(): void {
		this.buttonQualityApply.toggle(this.dropdownQuality.selectedOption === Quality.Random);
		void SetQuality.execute(localPlayer, this.item, this.dropdownQuality.selectedOption);
	}
}

function scale(value: number): number {
	return Math.floor(1.2 ** value) - 1;
}

function unscale(value: number): number {
	return Math.ceil(Math.log((value + 1)) / Math.log(1.2) * 100) / 100;
}

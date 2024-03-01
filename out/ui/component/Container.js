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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@wayward/game/event/EventBuses", "@wayward/game/event/EventManager", "@wayward/game/game/IObject", "@wayward/game/game/item/Item", "@wayward/game/language/Dictionary", "@wayward/game/language/ITranslation", "@wayward/game/language/Translation", "@wayward/game/language/dictionary/Misc", "@wayward/game/ui/component/BlockRow", "@wayward/game/ui/component/Button", "@wayward/game/ui/component/Component", "@wayward/game/ui/component/Details", "@wayward/game/ui/component/Dropdown", "@wayward/game/ui/component/LabelledRow", "@wayward/game/ui/component/RangeRow", "@wayward/game/ui/component/Text", "@wayward/game/utilities/enum/Enums", "@wayward/utilities/Decorators", "@wayward/utilities/collection/Tuple", "@wayward/utilities/promise/Async", "../../IDebugTools", "../../action/ClearInventory", "../../action/Remove", "../../action/SetDecay", "../../action/SetDecayBulk", "../../action/SetDurability", "../../action/SetDurabilityBulk", "../../action/SetQuality", "../../action/SetQualityBulk", "../../util/Array", "./AddItemToInventory", "./MagicalPropertiesEditor"], function (require, exports, EventBuses_1, EventManager_1, IObject_1, Item_1, Dictionary_1, ITranslation_1, Translation_1, Misc_1, BlockRow_1, Button_1, Component_1, Details_1, Dropdown_1, LabelledRow_1, RangeRow_1, Text_1, Enums_1, Decorators_1, Tuple_1, Async_1, IDebugTools_1, ClearInventory_1, Remove_1, SetDecay_1, SetDecayBulk_1, SetDurability_1, SetDurabilityBulk_1, SetQuality_1, SetQualityBulk_1, Array_1, AddItemToInventory_1, MagicalPropertiesEditor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ContainerItemDetails = exports.ContainerClasses = void 0;
    var ContainerClasses;
    (function (ContainerClasses) {
        ContainerClasses["Main"] = "debug-tools-container";
        ContainerClasses["ContainedItemDetails"] = "debug-tools-container-contained-item-details";
        ContainerClasses["BulkItemActions"] = "debug-tools-container-contained-item-details-bulk-item-actions";
        ContainerClasses["ItemDetails"] = "debug-tools-container-contained-item-details-item";
        ContainerClasses["Paginator"] = "debug-tools-container-contained-item-details-paginator";
        ContainerClasses["PaginatorButton"] = "debug-tools-container-contained-item-details-paginator-button";
        ContainerClasses["PaginatorPrev"] = "debug-tools-container-contained-item-details-paginator-button-prev";
        ContainerClasses["PaginatorNext"] = "debug-tools-container-contained-item-details-paginator-button-next";
        ContainerClasses["PaginatorInfo"] = "debug-tools-container-contained-item-details-paginator-info";
    })(ContainerClasses || (exports.ContainerClasses = ContainerClasses = {}));
    const CONTAINER_PAGE_LENGTH = 15;
    class Container extends Component_1.default {
        static getFirst() {
            return Component_1.default.get(ContainerClasses.Main);
        }
        static async appendTo(component, host, containerSupplier) {
            const container = new Container();
            await container.appendToHost(component, host, containerSupplier);
            return container;
        }
        async appendToHost(component, host, containerSupplier) {
            this.appendTo(component);
            this.containerSupplier = containerSupplier;
            this.refreshItems();
            EventManager_1.eventManager.registerEventBusSubscriber(this);
            await host.event.waitFor(["remove", "switchAway"]);
            EventManager_1.eventManager.deregisterEventBusSubscriber(this);
            if (this.containerSupplier === containerSupplier)
                delete this.containerSupplier;
        }
        constructor() {
            super();
            this.items = [];
            this.page = 0;
            this.classes.add(ContainerClasses.Main);
            new AddItemToInventory_1.default(this.getContainer).appendTo(this);
            this.wrapperContainedItems = new Details_1.default()
                .classes.add(ContainerClasses.ContainedItemDetails)
                .setSummary(summary => summary.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelItemDetails)))
                .event.subscribe("open", this.refreshItems)
                .appendTo(this);
            new Details_1.default()
                .classes.add(ContainerClasses.BulkItemActions)
                .setSummary(summary => summary.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelBulkItemOperations)))
                .append(this.rangeBulkDurability = new RangeRow_1.RangeRow()
                .classes.add("debug-tools-inspect-human-wrapper-set-bulk")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelDurability)))
                .editRange(range => range
                .setMax(100)
                .setStep(0.01)
                .setMin(-20)
                .setRefreshMethod(() => -20))
                .setDisplayValue(value => value <= -10 ? [{ content: "0" }] : value <= 0 ? [{ content: "1" }]
                : Translation_1.default.misc(Misc_1.MiscTranslation.Percent).addArgs(value / 100))
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonApply))
                .event.subscribe("activate", this.applyBulkDurability)))
                .append(this.rangeBulkDecay = new RangeRow_1.RangeRow()
                .classes.add("debug-tools-inspect-human-wrapper-set-bulk")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelDecay)))
                .editRange(range => range
                .setMax(100)
                .setStep(0.01)
                .setMin(-20)
                .setRefreshMethod(() => -20))
                .setDisplayValue(value => value <= -10 ? [{ content: "0" }] : value <= 0 ? [{ content: "1" }]
                : Translation_1.default.misc(Misc_1.MiscTranslation.Percent).addArgs(value / 100))
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonApply))
                .event.subscribe("activate", this.applyBulkDecay)))
                .append(new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label", "debug-tools-inspect-human-wrapper-set-bulk")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelQuality)))
                .append(this.dropdownBulkQuality = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: IObject_1.Quality.Random,
                options: Enums_1.default.values(IObject_1.Quality)
                    .map(quality => (0, Tuple_1.Tuple)(quality, Translation_1.default.get(Dictionary_1.default.Quality, quality).inContext(ITranslation_1.TextContext.Title)))
                    .map(([id, t]) => (0, Tuple_1.Tuple)(id, (option) => option.setText(t))),
            }))
                .event.subscribe("selection", this.applyBulkQuality))
                .append(this.buttonBulkQualityApply = new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonApply))
                .event.subscribe("activate", this.applyBulkQuality)))
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonClearInventory))
                .setType(Button_1.ButtonType.Warning)
                .event.subscribe("activate", this.clear))
                .appendTo(this);
        }
        showItem(item) {
            this.wrapperContainedItems.open();
            const container = this.containerSupplier?.();
            if (!container)
                return undefined;
            const itemChain = [];
            let searchContainer = item;
            while (searchContainer instanceof Item_1.default && searchContainer !== container) {
                itemChain.push(searchContainer);
                searchContainer = searchContainer.containedWithin;
            }
            itemChain.reverse();
            item = itemChain[0];
            const page = Math.max(0, item ? this.getPageOf(item) : 0);
            this.page = page;
            return this.changeDisplayedItems(itemChain);
        }
        refreshItems() {
            const container = this.containerSupplier?.();
            const itemIds = container?.containedItems.map(item => item.id) ?? [];
            if ((0, Array_1.areArraysIdentical)(itemIds, this.items))
                return;
            this.changeDisplayedItems();
        }
        getTotalPages() {
            const container = this.containerSupplier?.();
            return Math.ceil((container?.containedItems.length ?? 0) / CONTAINER_PAGE_LENGTH);
        }
        getPageOf(item) {
            const container = this.containerSupplier?.();
            if (!container)
                return -1;
            const index = container.containedItems.indexOf(item);
            if (index === -1) {
                return -1;
            }
            return Math.floor(index / CONTAINER_PAGE_LENGTH);
        }
        getItemsOfPage(page) {
            const container = this.containerSupplier?.();
            if (!container)
                return [];
            return container.containedItems.slice(page * CONTAINER_PAGE_LENGTH, page * CONTAINER_PAGE_LENGTH + CONTAINER_PAGE_LENGTH);
        }
        changeDisplayedItems(itemChain = []) {
            this.wrapperContainedItems.dump();
            if (!this.wrapperContainedItems.isOpen) {
                return;
            }
            const container = this.containerSupplier?.();
            if (!container)
                return;
            this.items = container.containedItems.map(item => item.id) ?? [];
            const totalPages = this.getTotalPages();
            this.page = this.page < 0 ? totalPages - 1
                : this.page >= totalPages ? 0
                    : this.page;
            let result;
            for (const item of this.getItemsOfPage(this.page)) {
                new ContainerItemDetails(item)
                    .toggleOpen(itemChain.includes(item))
                    .schedule(details => result ??= !details.isOpen ? undefined
                    : details.container?.showItem(itemChain.last()) ?? details)
                    .appendTo(this.wrapperContainedItems);
            }
            result?.magicalPropertiesEditor?.open();
            new BlockRow_1.BlockRow()
                .classes.add(ContainerClasses.Paginator)
                .append(new Button_1.default()
                .classes.add(ContainerClasses.PaginatorButton, ContainerClasses.PaginatorPrev)
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonPreviousItems))
                .event.subscribe("activate", () => { this.page--; this.changeDisplayedItems(); }))
                .append(new Text_1.default()
                .classes.add(ContainerClasses.PaginatorButton, ContainerClasses.PaginatorInfo)
                .classes.add("debug-tools-")
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelItems), this.page * CONTAINER_PAGE_LENGTH + 1, Math.min(this.page * CONTAINER_PAGE_LENGTH + CONTAINER_PAGE_LENGTH, container.containedItems.length), container.containedItems.length))
                .append(new Button_1.default()
                .classes.add(ContainerClasses.PaginatorButton, ContainerClasses.PaginatorNext)
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonNextItems))
                .event.subscribe("activate", () => { this.page++; this.changeDisplayedItems(); }))
                .appendTo(this.wrapperContainedItems);
            return result;
        }
        onContainerItemChange(itemManager, items, container, containerTile) {
            if (container === this.containerSupplier?.())
                (0, Async_1.debounce)(100, true, this.refreshItems);
        }
        getContainer() {
            return this.containerSupplier?.();
        }
        clear() {
            const container = this.getContainer();
            if (container)
                ClearInventory_1.default.execute(localPlayer, container);
        }
        applyBulkDurability() {
            const container = this.getContainer();
            if (container)
                SetDurabilityBulk_1.default.execute(localPlayer, container, this.rangeBulkDurability.rangeInput.value <= -10 ? 0 : this.rangeBulkDurability.rangeInput.value <= 0 ? 1
                    : this.rangeBulkDurability.rangeInput.value === 100 ? 0.99999 : this.rangeBulkDurability.rangeInput.value / 100);
        }
        applyBulkDecay() {
            const container = this.getContainer();
            if (container)
                SetDecayBulk_1.default.execute(localPlayer, container, this.rangeBulkDecay.rangeInput.value <= -10 ? 0 : this.rangeBulkDecay.rangeInput.value <= 0 ? 1
                    : this.rangeBulkDurability.rangeInput.value === 100 ? 0.99999 : this.rangeBulkDecay.rangeInput.value / 100);
        }
        applyBulkQuality() {
            this.buttonBulkQualityApply.toggle(this.dropdownBulkQuality.selectedOption === IObject_1.Quality.Random);
            const container = this.getContainer();
            if (container && this.dropdownBulkQuality.selectedOption !== undefined)
                SetQualityBulk_1.default.execute(localPlayer, container, this.dropdownBulkQuality.selectedOption);
        }
    }
    exports.default = Container;
    __decorate([
        Decorators_1.Bound
    ], Container.prototype, "refreshItems", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.ItemManager, "containerItemAdd"),
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.ItemManager, "containerItemRemove")
    ], Container.prototype, "onContainerItemChange", null);
    __decorate([
        Decorators_1.Bound
    ], Container.prototype, "getContainer", null);
    __decorate([
        Decorators_1.Bound
    ], Container.prototype, "clear", null);
    __decorate([
        Decorators_1.Bound
    ], Container.prototype, "applyBulkDurability", null);
    __decorate([
        Decorators_1.Bound
    ], Container.prototype, "applyBulkDecay", null);
    __decorate([
        Decorators_1.Bound
    ], Container.prototype, "applyBulkQuality", null);
    class ContainerItemDetails extends Details_1.default {
        get item() {
            return this.itemRef.deref();
        }
        constructor(item) {
            super();
            this.itemRef = new WeakRef(item);
            this.classes.add(ContainerClasses.ItemDetails);
            this.dataset.itemId = `${item.id}`;
            this.setSummary(summary => summary
                .setText(item.getName()
                .inContext(ITranslation_1.TextContext.Title)
                .passTo(Translation_1.default.colorizeImportance("secondary")))
                .setInheritTextTooltip());
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label", "debug-tools-inspect-human-wrapper-set-bulk")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelQuality)))
                .append(this.dropdownQuality = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: IObject_1.Quality.Random,
                options: Enums_1.default.values(IObject_1.Quality)
                    .map(quality => (0, Tuple_1.Tuple)(quality, Translation_1.default.get(Dictionary_1.default.Quality, quality).inContext(ITranslation_1.TextContext.Title)))
                    .map(([id, t]) => (0, Tuple_1.Tuple)(id, (option) => option.setText(t))),
            }))
                .event.subscribe("selection", this.applyQuality))
                .append(this.buttonQualityApply = new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonApply))
                .event.subscribe("activate", this.applyQuality))
                .appendTo(this);
            new RangeRow_1.RangeRow()
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelDurability)))
                .editRange(range => range
                .setMax(unscale(this.item.durabilityMax))
                .setStep(0.01)
                .setRefreshMethod(() => unscale(this.item.durability)))
                .setDisplayValue(value => [{ content: `${scale(value)}` }])
                .event.subscribe("finish", this.applyDurability)
                .appendTo(this);
            if (this.item.canDecay())
                new RangeRow_1.RangeRow()
                    .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelDecay)))
                    .editRange(range => range
                    .setMax(this.item.startingDecay ? unscale(this.item.startingDecay) : 60)
                    .setStep(0.01)
                    .setRefreshMethod(() => unscale(this.item.getDecayTime() ?? 0)))
                    .setDisplayValue(value => [{ content: `${scale(value)}` }])
                    .event.subscribe("finish", this.applyDecay)
                    .appendTo(this);
            if (this.item.getValidMagicalProperties().length)
                this.magicalPropertiesEditor = new MagicalPropertiesEditor_1.default(item)
                    .appendTo(this);
            if (this.item.isContainer())
                this.container = new Container()
                    .schedule(container => container
                    .appendToHost(this, this, () => this.item.isContainer() ? this.item : undefined));
            new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionRemove)
                .addArgs(this.item.getName().inContext(ITranslation_1.TextContext.Title))
                .addArgs(this.item.island.items.getContainerName(this.item.containedWithin)?.inContext(ITranslation_1.TextContext.Title)))
                .event.subscribe("activate", () => Remove_1.default.execute(localPlayer, item))
                .appendTo(this);
        }
        applyDurability(_, value) {
            SetDurability_1.default.execute(localPlayer, this.item, scale(value));
        }
        applyDecay(_, value) {
            SetDecay_1.default.execute(localPlayer, this.item, scale(value));
        }
        applyQuality() {
            this.buttonQualityApply.toggle(this.dropdownQuality.selectedOption === IObject_1.Quality.Random);
            SetQuality_1.default.execute(localPlayer, this.item, this.dropdownQuality.selectedOption);
        }
    }
    exports.ContainerItemDetails = ContainerItemDetails;
    __decorate([
        Decorators_1.Bound
    ], ContainerItemDetails.prototype, "applyDurability", null);
    __decorate([
        Decorators_1.Bound
    ], ContainerItemDetails.prototype, "applyDecay", null);
    __decorate([
        Decorators_1.Bound
    ], ContainerItemDetails.prototype, "applyQuality", null);
    function scale(value) {
        return Math.floor(1.2 ** value) - 1;
    }
    function unscale(value) {
        return Math.ceil(Math.log((value + 1)) / Math.log(1.2) * 100) / 100;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9Db250YWluZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7Ozs7Ozs7OztJQXdDSCxJQUFZLGdCQVVYO0lBVkQsV0FBWSxnQkFBZ0I7UUFDM0Isa0RBQThCLENBQUE7UUFDOUIseUZBQXFFLENBQUE7UUFDckUsc0dBQWtGLENBQUE7UUFDbEYscUZBQWlFLENBQUE7UUFDakUsd0ZBQW9FLENBQUE7UUFDcEUscUdBQWlGLENBQUE7UUFDakYsd0dBQW9GLENBQUE7UUFDcEYsd0dBQW9GLENBQUE7UUFDcEYsaUdBQTZFLENBQUE7SUFDOUUsQ0FBQyxFQVZXLGdCQUFnQixnQ0FBaEIsZ0JBQWdCLFFBVTNCO0lBRUQsTUFBTSxxQkFBcUIsR0FBRyxFQUFFLENBQUM7SUFFakMsTUFBcUIsU0FBVSxTQUFRLG1CQUFTO1FBRXhDLE1BQU0sQ0FBQyxRQUFRO1lBQ3JCLE9BQU8sbUJBQVMsQ0FBQyxHQUFHLENBQVksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVNLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQW9CLEVBQUUsSUFBZSxFQUFFLGlCQUErQztZQUNsSCxNQUFNLFNBQVMsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ2xDLE1BQU0sU0FBUyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFDakUsT0FBTyxTQUFTLENBQUM7UUFDbEIsQ0FBQztRQUVNLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBb0IsRUFBRSxJQUFlLEVBQUUsaUJBQStDO1lBQy9HLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO1lBQzNDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVwQiwyQkFBWSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlDLE1BQU8sSUFBNEQsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDNUcsMkJBQVksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoRCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxpQkFBaUI7Z0JBQy9DLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO1FBQ2hDLENBQUM7UUFZRDtZQUNDLEtBQUssRUFBRSxDQUFDO1lBSkQsVUFBSyxHQUFhLEVBQUUsQ0FBQztZQUNyQixTQUFJLEdBQUcsQ0FBQyxDQUFDO1lBSWhCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXhDLElBQUksNEJBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxpQkFBTyxFQUFFO2lCQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDO2lCQUNsRCxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7aUJBQzNGLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUM7aUJBQzFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLGlCQUFPLEVBQUU7aUJBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUM7aUJBQzdDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztpQkFDbEcsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFRLEVBQUU7aUJBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsNENBQTRDLENBQUM7aUJBQ3pELFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7aUJBQ3BGLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUs7aUJBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUM7aUJBQ1gsT0FBTyxDQUFDLElBQUksQ0FBQztpQkFDYixNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQ1gsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztpQkFDN0IsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUM7Z0JBQzVGLENBQUMsQ0FBQyxxQkFBVyxDQUFDLElBQUksQ0FBQyxzQkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7aUJBQ2pFLE1BQU0sQ0FBQyxJQUFJLGdCQUFNLEVBQUU7aUJBQ2xCLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ3ZELEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7aUJBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksbUJBQVEsRUFBRTtpQkFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsQ0FBQztpQkFDekQsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztpQkFDL0UsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSztpQkFDdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDWCxPQUFPLENBQUMsSUFBSSxDQUFDO2lCQUNiLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztpQkFDWCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUM3QixlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQztnQkFDNUYsQ0FBQyxDQUFDLHFCQUFXLENBQUMsSUFBSSxDQUFDLHNCQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQztpQkFDakUsTUFBTSxDQUFDLElBQUksZ0JBQU0sRUFBRTtpQkFDbEIsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDdkQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7aUJBQ3BELE1BQU0sQ0FBQyxJQUFJLHlCQUFXLEVBQUU7aUJBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsNENBQTRDLENBQUM7aUJBQzNFLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7aUJBQ2pGLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxrQkFBUSxFQUFXO2lCQUN4RCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixhQUFhLEVBQUUsaUJBQU8sQ0FBQyxNQUFNO2dCQUM3QixPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxpQkFBTyxDQUFDO3FCQUM1QixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFBLGFBQUssRUFBQyxPQUFPLEVBQUUscUJBQVcsQ0FBQyxHQUFHLENBQUMsb0JBQVUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLDBCQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztxQkFDekcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUEsYUFBSyxFQUFDLEVBQUUsRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3BFLENBQUMsQ0FBQztpQkFDRixLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDckQsTUFBTSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLGdCQUFNLEVBQUU7aUJBQ2hELE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ3ZELEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7aUJBQ3RELE1BQU0sQ0FBQyxJQUFJLGdCQUFNLEVBQUU7aUJBQ2xCLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztpQkFDaEUsT0FBTyxDQUFDLG1CQUFVLENBQUMsT0FBTyxDQUFDO2lCQUMzQixLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3pDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBRU0sUUFBUSxDQUFDLElBQVc7WUFDMUIsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxDQUFDO1lBRWxDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLFNBQVM7Z0JBQ2IsT0FBTyxTQUFTLENBQUM7WUFFbEIsTUFBTSxTQUFTLEdBQVcsRUFBRSxDQUFDO1lBQzdCLElBQUksZUFBZSxHQUE2QixJQUFJLENBQUM7WUFDckQsT0FBTyxlQUFlLFlBQVksY0FBSSxJQUFJLGVBQWUsS0FBSyxTQUFTLEVBQUUsQ0FBQztnQkFDekUsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDaEMsZUFBZSxHQUFHLGVBQWUsQ0FBQyxlQUFlLENBQUM7WUFDbkQsQ0FBQztZQUVELFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwQixJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXBCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFMUQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUVhLFlBQVk7WUFDekIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQztZQUM3QyxNQUFNLE9BQU8sR0FBRyxTQUFTLEVBQUUsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDckUsSUFBSSxJQUFBLDBCQUFrQixFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUMxQyxPQUFPO1lBRVIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDN0IsQ0FBQztRQUVPLGFBQWE7WUFDcEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQztZQUM3QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ25GLENBQUM7UUFFTyxTQUFTLENBQUMsSUFBVTtZQUMzQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDO1lBQzdDLElBQUksQ0FBQyxTQUFTO2dCQUNiLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFFWCxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyRCxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNsQixPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ1gsQ0FBQztZQUVELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcscUJBQXFCLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBRU8sY0FBYyxDQUFDLElBQVk7WUFDbEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQztZQUM3QyxJQUFJLENBQUMsU0FBUztnQkFDYixPQUFPLEVBQUUsQ0FBQztZQUVYLE9BQU8sU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLHFCQUFxQixFQUFFLElBQUksR0FBRyxxQkFBcUIsR0FBRyxxQkFBcUIsQ0FBQyxDQUFDO1FBQzNILENBQUM7UUFFTyxvQkFBb0IsQ0FBQyxZQUFvQixFQUFFO1lBQ2xELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVsQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN4QyxPQUFPO1lBQ1IsQ0FBQztZQUVELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLFNBQVM7Z0JBQ2IsT0FBTztZQUVSLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1lBRWpFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQztnQkFDekMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1QixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUVkLElBQUksTUFBd0MsQ0FBQztZQUM3QyxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ25ELElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDO3FCQUM1QixVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDcEMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUztvQkFDMUQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQztxQkFDM0QsUUFBUSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3hDLENBQUM7WUFFRCxNQUFNLEVBQUUsdUJBQXVCLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFFeEMsSUFBSSxtQkFBUSxFQUFFO2lCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO2lCQUN2QyxNQUFNLENBQUMsSUFBSSxnQkFBTSxFQUFFO2lCQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7aUJBQzdFLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztpQkFDL0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDakYsTUFBTSxDQUFDLElBQUksY0FBSSxFQUFFO2lCQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7aUJBQzdFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO2lCQUMzQixPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFVBQVUsQ0FBQyxFQUNyRCxJQUFJLENBQUMsSUFBSSxHQUFHLHFCQUFxQixHQUFHLENBQUMsRUFDckMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLHFCQUFxQixHQUFHLHFCQUFxQixFQUFFLFNBQVMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQ3BHLFNBQVMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ2xDLE1BQU0sQ0FBQyxJQUFJLGdCQUFNLEVBQUU7aUJBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLGdCQUFnQixDQUFDLGFBQWEsQ0FBQztpQkFDN0UsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztpQkFDM0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDakYsUUFBUSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBRXZDLE9BQU8sTUFBTSxDQUFDO1FBQ2YsQ0FBQztRQUlTLHFCQUFxQixDQUFDLFdBQXdCLEVBQUUsS0FBYSxFQUFFLFNBQXNCLEVBQUUsYUFBb0I7WUFDcEgsSUFBSSxTQUFTLEtBQUssSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUU7Z0JBQzNDLElBQUEsZ0JBQVEsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBRWMsWUFBWTtZQUMxQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUM7UUFDbkMsQ0FBQztRQUVjLEtBQUs7WUFDbkIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3RDLElBQUksU0FBUztnQkFBRSx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDL0QsQ0FBQztRQUVjLG1CQUFtQjtZQUNqQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDdEMsSUFBSSxTQUFTO2dCQUFFLDJCQUFpQixDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekssQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsS0FBSyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNuSCxDQUFDO1FBRWMsY0FBYztZQUM1QixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDdEMsSUFBSSxTQUFTO2dCQUFFLHNCQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFKLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzlHLENBQUM7UUFFYyxnQkFBZ0I7WUFDOUIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsY0FBYyxLQUFLLGlCQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDL0YsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3RDLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLEtBQUssU0FBUztnQkFBRSx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNqSyxDQUFDO0tBQ0Q7SUE3T0QsNEJBNk9DO0lBdkhjO1FBQWIsa0JBQUs7aURBT0w7SUFpRlM7UUFGVCxJQUFBLDJCQUFZLEVBQUMscUJBQVEsQ0FBQyxXQUFXLEVBQUUsa0JBQWtCLENBQUM7UUFDdEQsSUFBQSwyQkFBWSxFQUFDLHFCQUFRLENBQUMsV0FBVyxFQUFFLHFCQUFxQixDQUFDOzBEQUl6RDtJQUVjO1FBQWQsa0JBQUs7aURBRUw7SUFFYztRQUFkLGtCQUFLOzBDQUdMO0lBRWM7UUFBZCxrQkFBSzt3REFJTDtJQUVjO1FBQWQsa0JBQUs7bURBSUw7SUFFYztRQUFkLGtCQUFLO3FEQUlMO0lBR0YsTUFBYSxvQkFBcUIsU0FBUSxpQkFBTztRQUloRCxJQUFXLElBQUk7WUFDZCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFHLENBQUM7UUFDOUIsQ0FBQztRQU9ELFlBQW1CLElBQVU7WUFDNUIsS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBRW5DLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPO2lCQUNoQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtpQkFDckIsU0FBUyxDQUFDLDBCQUFXLENBQUMsS0FBSyxDQUFDO2lCQUM1QixNQUFNLENBQUMscUJBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2lCQUNyRCxxQkFBcUIsRUFBRSxDQUFDLENBQUM7WUFFM0IsSUFBSSx5QkFBVyxFQUFFO2lCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsNENBQTRDLENBQUM7aUJBQzNFLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7aUJBQ2pGLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksa0JBQVEsRUFBVztpQkFDcEQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsYUFBYSxFQUFFLGlCQUFPLENBQUMsTUFBTTtnQkFDN0IsT0FBTyxFQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsaUJBQU8sQ0FBQztxQkFDNUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBQSxhQUFLLEVBQUMsT0FBTyxFQUFFLHFCQUFXLENBQUMsR0FBRyxDQUFDLG9CQUFVLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7cUJBQ3pHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFBLGFBQUssRUFBQyxFQUFFLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwRSxDQUFDLENBQUM7aUJBQ0YsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksZ0JBQU0sRUFBRTtpQkFDNUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDdkQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxtQkFBUSxFQUFFO2lCQUNaLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7aUJBQ3BGLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUs7aUJBQ3ZCLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDeEMsT0FBTyxDQUFDLElBQUksQ0FBQztpQkFDYixnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2lCQUN2RCxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lCQUMxRCxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDO2lCQUMvQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDdkIsSUFBSSxtQkFBUSxFQUFFO3FCQUNaLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7cUJBQy9FLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUs7cUJBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztxQkFDdkUsT0FBTyxDQUFDLElBQUksQ0FBQztxQkFDYixnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNoRSxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUMxRCxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO3FCQUMxQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUMsTUFBTTtnQkFDL0MsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksaUNBQXVCLENBQUMsSUFBSSxDQUFDO3FCQUM5RCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLFNBQVMsRUFBRTtxQkFDOUIsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUztxQkFDOUIsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUVyRixJQUFJLGdCQUFNLEVBQUU7aUJBQ1YsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxZQUFZLENBQUM7aUJBQ3RELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUN6RCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsU0FBUyxDQUFDLDBCQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztpQkFDM0csS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUNwRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQztRQUVjLGVBQWUsQ0FBQyxDQUFNLEVBQUUsS0FBYTtZQUNuRCx1QkFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBRWMsVUFBVSxDQUFDLENBQU0sRUFBRSxLQUFhO1lBQzlDLGtCQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFFYyxZQUFZO1lBQzFCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLEtBQUssaUJBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2RixvQkFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2pGLENBQUM7S0FDRDtJQTVGRCxvREE0RkM7SUFaZTtRQUFkLGtCQUFLOytEQUVMO0lBRWM7UUFBZCxrQkFBSzswREFFTDtJQUVjO1FBQWQsa0JBQUs7NERBR0w7SUFHRixTQUFTLEtBQUssQ0FBQyxLQUFhO1FBQzNCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFhO1FBQzdCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDckUsQ0FBQyJ9
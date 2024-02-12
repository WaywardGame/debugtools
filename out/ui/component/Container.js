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
        static init() {
            if (Container.INSTANCE)
                return Container.INSTANCE;
            const container = Container.INSTANCE = new Container();
            container.event.subscribe("willRemove", container.willRemove);
            return container;
        }
        static appendTo(component, host, containerSupplier) {
            return Container.init().appendToHost(component, host, containerSupplier);
        }
        static releaseAndRemove() {
            if (!Container.INSTANCE)
                return;
            Container.INSTANCE.event.unsubscribe("willRemove", Container.INSTANCE.willRemove);
            Container.INSTANCE.remove();
            delete Container.INSTANCE;
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
            new AddItemToInventory_1.default(this.getContainer).appendTo(this);
            this.wrapperContainedItems = new Details_1.default()
                .classes.add(ContainerClasses.ContainedItemDetails)
                .setSummary(summary => summary.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelItemDetails)))
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
        willRemove() {
            this.store(this.getScreen());
            return false;
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
    ], Container.prototype, "willRemove", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9Db250YWluZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7Ozs7Ozs7OztJQXdDSCxJQUFZLGdCQVNYO0lBVEQsV0FBWSxnQkFBZ0I7UUFDM0IseUZBQXFFLENBQUE7UUFDckUsc0dBQWtGLENBQUE7UUFDbEYscUZBQWlFLENBQUE7UUFDakUsd0ZBQW9FLENBQUE7UUFDcEUscUdBQWlGLENBQUE7UUFDakYsd0dBQW9GLENBQUE7UUFDcEYsd0dBQW9GLENBQUE7UUFDcEYsaUdBQTZFLENBQUE7SUFDOUUsQ0FBQyxFQVRXLGdCQUFnQixnQ0FBaEIsZ0JBQWdCLFFBUzNCO0lBRUQsTUFBTSxxQkFBcUIsR0FBRyxFQUFFLENBQUM7SUFFakMsTUFBcUIsU0FBVSxTQUFRLG1CQUFTO1FBSXhDLE1BQU0sQ0FBQyxJQUFJO1lBQ2pCLElBQUksU0FBUyxDQUFDLFFBQVE7Z0JBQ3JCLE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQztZQUUzQixNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsUUFBUSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7WUFFdkQsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5RCxPQUFPLFNBQVMsQ0FBQztRQUNsQixDQUFDO1FBRU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFvQixFQUFFLElBQWUsRUFBRSxpQkFBK0M7WUFDNUcsT0FBTyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUMxRSxDQUFDO1FBRU0sTUFBTSxDQUFDLGdCQUFnQjtZQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVE7Z0JBQ3RCLE9BQU87WUFFUixTQUFT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
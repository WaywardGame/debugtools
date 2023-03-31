var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventBuses", "event/EventManager", "language/ITranslation", "language/Translation", "language/dictionary/Misc", "ui/component/Button", "ui/component/Component", "ui/component/Details", "ui/component/RangeRow", "utilities/Decorators", "../../IDebugTools", "../../action/ClearInventory", "../../action/Remove", "../../action/SetDecay", "../../action/SetDecayBulk", "../../action/SetDurability", "../../action/SetDurabilityBulk", "../../util/Array", "./AddItemToInventory"], function (require, exports, EventBuses_1, EventManager_1, ITranslation_1, Translation_1, Misc_1, Button_1, Component_1, Details_1, RangeRow_1, Decorators_1, IDebugTools_1, ClearInventory_1, Remove_1, SetDecay_1, SetDecayBulk_1, SetDurability_1, SetDurabilityBulk_1, Array_1, AddItemToInventory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ContainerItemDetails = exports.ContainerClasses = void 0;
    var ContainerClasses;
    (function (ContainerClasses) {
        ContainerClasses["ContainedItemDetails"] = "debug-tools-container-contained-item-details";
        ContainerClasses["ItemDetails"] = "debug-tools-container-contained-item-details-item";
    })(ContainerClasses = exports.ContainerClasses || (exports.ContainerClasses = {}));
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
            EventManager_1.default.registerEventBusSubscriber(this);
            await host.event.waitFor(["remove", "switchAway"]);
            EventManager_1.default.deregisterEventBusSubscriber(this);
            if (this.containerSupplier === containerSupplier)
                delete this.containerSupplier;
        }
        constructor() {
            super();
            this.items = [];
            new AddItemToInventory_1.default(this.getContainer).appendTo(this);
            this.wrapperContainedItems = new Details_1.default()
                .classes.add(ContainerClasses.ContainedItemDetails)
                .setSummary(summary => summary.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelItemDetails)))
                .appendTo(this);
            new Details_1.default()
                .setSummary(summary => summary.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelBulkItemOperations)))
                .append(this.rangeBulkDurability = new RangeRow_1.RangeRow()
                .classes.add("debug-tools-inspect-human-wrapper-set-durability-bulk")
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
                .classes.add("debug-tools-inspect-human-wrapper-set-decay-bulk")
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
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonClearInventory))
                .setType(Button_1.ButtonType.Warning)
                .event.subscribe("activate", this.clear))
                .appendTo(this);
        }
        refreshItems() {
            const container = this.containerSupplier?.();
            const itemIds = container?.containedItems.map(item => item.id) ?? [];
            if ((0, Array_1.areArraysIdentical)(itemIds, this.items))
                return;
            this.items = itemIds;
            this.wrapperContainedItems.dump();
            if (!this.items.length)
                return;
            for (const item of container.containedItems) {
                new ContainerItemDetails(item)
                    .appendTo(this.wrapperContainedItems);
            }
        }
        onContainerItemChange(items, item, container, containerTile) {
            if (container === this.containerSupplier?.())
                this.refreshItems();
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
    }
    __decorate([
        (0, Decorators_1.Debounce)(100)
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
    exports.default = Container;
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
            new RangeRow_1.RangeRow()
                .classes.add("debug-tools-inspect-human-wrapper-set-durability-bulk")
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
                    .classes.add("debug-tools-inspect-human-wrapper-set-decay-bulk")
                    .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelDecay)))
                    .editRange(range => range
                    .setMax(this.item.startingDecay ? unscale(this.item.startingDecay) : 60)
                    .setStep(0.01)
                    .setRefreshMethod(() => unscale(this.item.decay ?? 0)))
                    .setDisplayValue(value => [{ content: `${scale(value)}` }])
                    .event.subscribe("finish", this.applyDecay)
                    .appendTo(this);
            new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionRemove))
                .event.subscribe("activate", () => Remove_1.default.execute(localPlayer, item))
                .appendTo(this);
            if (this.item.isContainer())
                new Container().appendToHost(this, this, () => this.item.isContainer() ? this.item : undefined);
        }
        applyDurability(_, value) {
            SetDurability_1.default.execute(localPlayer, this.item, scale(value));
        }
        applyDecay(_, value) {
            SetDecay_1.default.execute(localPlayer, this.item, scale(value));
        }
    }
    __decorate([
        Decorators_1.Bound
    ], ContainerItemDetails.prototype, "applyDurability", null);
    __decorate([
        Decorators_1.Bound
    ], ContainerItemDetails.prototype, "applyDecay", null);
    exports.ContainerItemDetails = ContainerItemDetails;
    function scale(value) {
        return Math.floor(1.2 ** value) - 1;
    }
    function unscale(value) {
        return Math.ceil(Math.log((value + 1)) / Math.log(1.2) * 100) / 100;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9Db250YWluZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQTBCQSxJQUFZLGdCQUdYO0lBSEQsV0FBWSxnQkFBZ0I7UUFDM0IseUZBQXFFLENBQUE7UUFDckUscUZBQWlFLENBQUE7SUFDbEUsQ0FBQyxFQUhXLGdCQUFnQixHQUFoQix3QkFBZ0IsS0FBaEIsd0JBQWdCLFFBRzNCO0lBRUQsTUFBcUIsU0FBVSxTQUFRLG1CQUFTO1FBSXhDLE1BQU0sQ0FBQyxJQUFJO1lBQ2pCLElBQUksU0FBUyxDQUFDLFFBQVE7Z0JBQ3JCLE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQztZQUUzQixNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsUUFBUSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7WUFFdkQsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5RCxPQUFPLFNBQVMsQ0FBQztRQUNsQixDQUFDO1FBRU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFvQixFQUFFLElBQWUsRUFBRSxpQkFBK0M7WUFDNUcsT0FBTyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUMxRSxDQUFDO1FBRU0sTUFBTSxDQUFDLGdCQUFnQjtZQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVE7Z0JBQ3RCLE9BQU87WUFFUixTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEYsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM1QixPQUFPLFNBQVMsQ0FBQyxRQUFR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
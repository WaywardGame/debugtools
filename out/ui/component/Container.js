var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "language/ITranslation", "language/Translation", "ui/component/Button", "ui/component/Component", "ui/component/Details", "ui/component/RangeRow", "utilities/Decorators", "../../IDebugTools", "../../action/ClearInventory", "../../action/Remove", "../../action/SetDecay", "../../action/SetDecayBulk", "../../action/SetDurability", "../../action/SetDurabilityBulk", "../../util/Array", "./AddItemToInventory"], function (require, exports, ITranslation_1, Translation_1, Button_1, Component_1, Details_1, RangeRow_1, Decorators_1, IDebugTools_1, ClearInventory_1, Remove_1, SetDecay_1, SetDecayBulk_1, SetDurability_1, SetDurabilityBulk_1, Array_1, AddItemToInventory_1) {
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
            return Container.INSTANCE = Container.INSTANCE || new Container();
        }
        static appendTo(component, host, containerSupplier) {
            return Container.init().appendToHost(component, host, containerSupplier);
        }
        async appendToHost(component, host, containerSupplier) {
            this.appendTo(component);
            this.containerSupplier = containerSupplier;
            this.refreshItems();
            await host.event.waitFor(["remove", "switchAway"]);
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
                .setMax(60)
                .setStep(0.01))
                .setDisplayValue(value => [{ content: `${scale(value)}` }])
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonApply))
                .event.subscribe("activate", this.applyBulkDurability)))
                .append(this.rangeBulkDecay = new RangeRow_1.RangeRow()
                .classes.add("debug-tools-inspect-human-wrapper-set-decay-bulk")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelDecay)))
                .editRange(range => range
                .setMax(60)
                .setStep(0.01))
                .setDisplayValue(value => [{ content: `${scale(value)}` }])
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonApply))
                .event.subscribe("activate", this.applyBulkDecay)))
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonClearInventory))
                .setType(Button_1.ButtonType.Warning)
                .event.subscribe("activate", this.clear))
                .appendTo(this);
            this.event.subscribe("willRemove", this.willRemove);
        }
        releaseAndRemove() {
            this.event.unsubscribe("willRemove", this.willRemove);
            this.remove();
            if (Container.INSTANCE === this)
                delete Container.INSTANCE;
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
                SetDurabilityBulk_1.default.execute(localPlayer, container, Math.floor(1.2 ** this.rangeBulkDurability.rangeInput.value) - 1);
        }
        applyBulkDecay() {
            const container = this.getContainer();
            if (container)
                SetDecayBulk_1.default.execute(localPlayer, container, Math.floor(1.2 ** this.rangeBulkDecay.rangeInput.value) - 1);
        }
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9Db250YWluZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQXFCQSxJQUFZLGdCQUdYO0lBSEQsV0FBWSxnQkFBZ0I7UUFDM0IseUZBQXFFLENBQUE7UUFDckUscUZBQWlFLENBQUE7SUFDbEUsQ0FBQyxFQUhXLGdCQUFnQixHQUFoQix3QkFBZ0IsS0FBaEIsd0JBQWdCLFFBRzNCO0lBRUQsTUFBcUIsU0FBVSxTQUFRLG1CQUFTO1FBSXhDLE1BQU0sQ0FBQyxJQUFJO1lBQ2pCLE9BQU8sU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxJQUFJLElBQUksU0FBUyxFQUFFLENBQUM7UUFDbkUsQ0FBQztRQUVNLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBb0IsRUFBRSxJQUFlLEVBQUUsaUJBQStDO1lBQzVHLE9BQU8sU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDMUUsQ0FBQztRQUVNLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBb0IsRUFBRSxJQUFlLEVBQUUsaUJBQStDO1lBQy9HLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO1lBQzNDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVwQixNQUFPLElBQTRELENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQzVHLElBQUksSUFBSSxDQUFDLGlCQUFpQixLQUFLLGlCQUFpQjtnQkFDL0MsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDaEMsQ0FBQztRQVFEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFIRCxVQUFL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
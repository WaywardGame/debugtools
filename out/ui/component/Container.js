var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "language/ITranslation", "language/Translation", "ui/component/Button", "ui/component/Component", "ui/component/Details", "ui/component/RangeRow", "utilities/Decorators", "../../action/ClearInventory", "../../action/Remove", "../../action/SetDurabilityBulk", "../../IDebugTools", "../../util/Array", "./AddItemToInventory"], function (require, exports, ITranslation_1, Translation_1, Button_1, Component_1, Details_1, RangeRow_1, Decorators_1, ClearInventory_1, Remove_1, SetDurabilityBulk_1, IDebugTools_1, Array_1, AddItemToInventory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Container extends Component_1.default {
        constructor() {
            super();
            this.items = [];
            new AddItemToInventory_1.default(this.getContainer).appendTo(this);
            this.wrapperContainedItems = new Details_1.default()
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
                .setDisplayValue(value => [{ content: `${Math.floor(1.2 ** value) - 1}` }])
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonApply))
                .event.subscribe("activate", this.applyBulkDurability)))
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonClearInventory))
                .setType(Button_1.ButtonType.Warning)
                .event.subscribe("activate", this.clear))
                .appendTo(this);
            this.event.subscribe("willRemove", this.willRemove);
        }
        static init() {
            return Container.INSTANCE = Container.INSTANCE || new Container();
        }
        static async appendTo(component, host, containerSupplier) {
            const instance = Container.init().appendTo(component);
            instance.containerSupplier = containerSupplier;
            instance.refreshItems();
            await host.event.waitFor(["remove", "switchAway"]);
            if (instance.containerSupplier === containerSupplier)
                delete instance.containerSupplier;
        }
        releaseAndRemove() {
            this.event.unsubscribe("willRemove", this.willRemove);
            this.remove();
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
                new Details_1.default()
                    .setSummary(summary => summary
                    .setText(item.getName()
                    .inContext(ITranslation_1.TextContext.Title)
                    .passTo(Translation_1.default.colorizeImportance("secondary")))
                    .setInheritTextTooltip())
                    .append(new Button_1.default()
                    .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionRemove))
                    .event.subscribe("activate", () => Remove_1.default.execute(localPlayer, item)))
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
    exports.default = Container;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9Db250YWluZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBaUJBLE1BQXFCLFNBQVUsU0FBUSxtQkFBUztRQXVCL0M7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUhELFVBQUssR0FBYSxFQUFFLENBQUM7WUFLNUIsSUFBSSw0QkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLGlCQUFPLEVBQUU7aUJBQ3hDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztpQkFDM0YsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksaUJBQU8sRUFBRTtpQkFDWCxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7aUJBQ2xHLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBUSxFQUFFO2lCQUMvQyxPQUFPLENBQUMsR0FBRyxDQUFDLHVEQUF1RCxDQUFDO2lCQUNwRSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2lCQUNwRixTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLO2lCQUN2QixNQUFNLENBQUMsRUFBRSxDQUFDO2lCQUNWLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztp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
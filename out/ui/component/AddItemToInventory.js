var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/IObject", "language/Dictionary", "language/Translation", "ui/component/Button", "ui/component/Component", "ui/component/Dropdown", "ui/component/LabelledRow", "ui/component/RangeRow", "ui/component/dropdown/ItemDropdown", "utilities/Decorators", "utilities/collection/Arrays", "utilities/enum/Enums", "../../IDebugTools", "../../action/AddItemToInventory"], function (require, exports, IObject_1, Dictionary_1, Translation_1, Button_1, Component_1, Dropdown_1, LabelledRow_1, RangeRow_1, ItemDropdown_1, Decorators_1, Arrays_1, Enums_1, IDebugTools_1, AddItemToInventory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AddItemToInventory extends Component_1.default {
        constructor(containerSupplier) {
            super();
            this.containerSupplier = containerSupplier;
            AddItemToInventory.itemDropdown ??= new ItemDropdown_1.default("None", [
                ["None", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.None))],
                ["Random", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.MethodRandom))],
                ["All", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.MethodAll))],
            ]);
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelItem)))
                .append(this.dropdownItemType = new ItemDropdown_1.default("None", [
                ["None", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.None))],
                ["Random", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.MethodRandom))],
                ["All", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.MethodAll))],
            ], true)
                .use(AddItemToInventory.itemDropdown)
                .event.subscribe("selection", this.changeItem))
                .appendTo(this);
            this.wrapperAddItem = new Component_1.default()
                .classes.add("debug-tools-inspect-human-wrapper-add-item")
                .hide()
                .append(new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelQuality)))
                .append(this.dropdownItemQuality = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: IObject_1.Quality.Random,
                options: Enums_1.default.values(IObject_1.Quality)
                    .map(quality => (0, Arrays_1.Tuple)(quality, Translation_1.default.get(Dictionary_1.default.Quality, quality)))
                    .map(([id, t]) => (0, Arrays_1.Tuple)(id, (option) => option.setText(t))),
            }))))
                .append(this.rangeItemQuantity = new RangeRow_1.RangeRow()
                .classes.add("debug-tools-dialog-add-item-quantity")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelQuantity)))
                .editRange(range => range
                .setMax(40)
                .setStep(0.01))
                .setDisplayValue(value => [{ content: `${Math.floor(1.2 ** value)}` }]))
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.AddToInventory))
                .event.subscribe("activate", this.addItem))
                .appendTo(this);
        }
        changeItem(_, item) {
            this.wrapperAddItem.toggle(item !== "None");
            this.rangeItemQuantity.toggle(item !== "All");
        }
        addItem() {
            const selection = this.dropdownItemType.selection;
            const container = this.containerSupplier();
            if (!container)
                return;
            AddItemToInventory_1.default.execute(localPlayer, container, selection === "Random" ? AddItemToInventory_1.ADD_ITEM_RANDOM : selection === "All" ? AddItemToInventory_1.ADD_ITEM_ALL : selection, this.dropdownItemQuality.selection, Math.floor(1.2 ** this.rangeItemQuantity.value));
        }
    }
    __decorate([
        Decorators_1.Bound
    ], AddItemToInventory.prototype, "changeItem", null);
    __decorate([
        Decorators_1.Bound
    ], AddItemToInventory.prototype, "addItem", null);
    exports.default = AddItemToInventory;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkSXRlbVRvSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9BZGRJdGVtVG9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBZ0JBLE1BQXFCLGtCQUFtQixTQUFRLG1CQUFTO1FBU3hELFlBQW9DLGlCQUErQztZQUNsRixLQUFLLEVBQUUsQ0FBQztZQUQyQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQThCO1lBR2xGLGtCQUFrQixDQUFDLFlBQVksS0FBSyxJQUFJLHNCQUFZLENBQUMsTUFBTSxFQUFFO2dCQUM1RCxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzNFLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDckYsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2FBQy9FLENBQUMsQ0FBQztZQUVILElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO2lCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2lCQUM5RSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksc0JBQVksQ0FBQyxNQUFNLEVBQUU7Z0JBQ3hELENBQUMsTUFB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
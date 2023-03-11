var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/IObject", "language/Dictionary", "language/Translation", "ui/component/Button", "ui/component/Component", "ui/component/Dropdown", "ui/component/dropdown/ItemDropdown", "ui/component/LabelledRow", "ui/component/RangeRow", "utilities/collection/Arrays", "utilities/Decorators", "utilities/enum/Enums", "../../action/AddItemToInventory", "../../IDebugTools"], function (require, exports, IObject_1, Dictionary_1, Translation_1, Button_1, Component_1, Dropdown_1, ItemDropdown_1, LabelledRow_1, RangeRow_1, Arrays_1, Decorators_1, Enums_1, AddItemToInventory_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AddItemToInventory extends Component_1.default {
        constructor(containerSupplier) {
            super();
            this.containerSupplier = containerSupplier;
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelItem)))
                .append(this.dropdownItemType = new ItemDropdown_1.default("None", [
                ["None", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.None))],
                ["Random", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.MethodRandom))],
                ["All", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.MethodAll))],
            ])
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkSXRlbVRvSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9BZGRJdGVtVG9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBZ0JBLE1BQXFCLGtCQUFtQixTQUFRLG1CQUFTO1FBT3hELFlBQW9DLGlCQUErQztZQUNsRixLQUFLLEVBQUUsQ0FBQztZQUQyQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQThCO1lBR2xGLElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO2lCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2lCQUM5RSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksc0JBQVksQ0FBQyxNQUFNLEVBQUU7Z0JBQ3hELENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDM0UsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNyRixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7YUFDL0UsQ0FBQztpQkFDQSxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQy9DLFFBQVEs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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/IObject", "item/IItem", "language/Translation", "newui/component/Button", "newui/component/Component", "newui/component/Dropdown", "newui/component/dropdown/ItemDropdown", "newui/component/LabelledRow", "utilities/Arrays", "utilities/enum/Enums", "../../IDebugTools"], function (require, exports, IObject_1, IItem_1, Translation_1, Button_1, Component_1, Dropdown_1, ItemDropdown_1, LabelledRow_1, Arrays_1, Enums_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AddItemToInventory extends Component_1.default {
        constructor() {
            super();
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelItem)))
                .append(this.dropdownItemType = new ItemDropdown_1.default("None", [["None", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.None))]])
                .event.subscribe("selection", this.changeItem))
                .appendTo(this);
            this.wrapperAddItem = new Component_1.default()
                .classes.add("debug-tools-inspect-human-wrapper-add-item")
                .hide()
                .append(new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelQuality)))
                .append(this.dropdownItemQuality = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: IObject_1.Quality.Random,
                options: Enums_1.default.values(IObject_1.Quality)
                    .map(quality => Arrays_1.Tuple(quality, Translation_1.default.generator(IObject_1.Quality[quality])))
                    .map(([id, t]) => Arrays_1.Tuple(id, (option) => option.setText(t))),
            }))))
                .append(new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.AddToInventory))
                .event.subscribe("activate", this.addItem))
                .appendTo(this);
            this.event.subscribe("willRemove", this.willRemove);
        }
        static init() {
            return AddItemToInventory.INSTANCE = AddItemToInventory.INSTANCE || new AddItemToInventory();
        }
        releaseAndRemove() {
            this.event.unsubscribe("willRemove", this.willRemove);
            this.remove();
            delete AddItemToInventory.INSTANCE;
        }
        willRemove() {
            this.store();
            return false;
        }
        changeItem(_, item) {
            this.wrapperAddItem.toggle(item !== "None");
        }
        addItem() {
            this.event.emit("execute", IItem_1.ItemType[this.dropdownItemType.selection], this.dropdownItemQuality.selection);
        }
    }
    __decorate([
        Override
    ], AddItemToInventory.prototype, "event", void 0);
    __decorate([
        Bound
    ], AddItemToInventory.prototype, "willRemove", null);
    __decorate([
        Bound
    ], AddItemToInventory.prototype, "changeItem", null);
    __decorate([
        Bound
    ], AddItemToInventory.prototype, "addItem", null);
    exports.default = AddItemToInventory;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkSXRlbVRvSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9BZGRJdGVtVG9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBdUJBLE1BQXFCLGtCQUFtQixTQUFRLG1CQUFTO1FBYXhEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7aUJBQzlFLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxzQkFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNySSxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQy9DLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksbUJBQVMsRUFBRTtpQkFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsQ0FBQztpQkFDekQsSUFBSSxFQUFFO2lCQUNOLE1BQU0sQ0FBQyxJQUFJLHlCQUFXLEVBQUU7aUJBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUNqRixNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksa0JBQVEsRUFBVztpQkFDeEQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsYUFBYSxFQUFFLGlCQUFPLENBQUMsTUFBTTtnQkFDN0IsT0FBTyxFQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsaUJBQU8sQ0FBQztxQkFDNUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsY0FBSyxDQUFDLE9BQU8sRUFBRSxxQkFBVyxDQUFDLFNBQVMsQ0FBQyxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdkUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNOLE1BQU0sQ0FBQyxJQUFJLGdCQUFNLEVBQUU7aUJBQ2xCLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUMxRCxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzNDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFyQ00sTUFBTSxDQUFDLElBQUk7WUFDakIsT0FBTyxrQkFBa0IsQ0FBQyxRQUFRLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxJQUFJLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUM5RixDQUFDO1FBcUNNLGdCQUFnQjtZQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkLE9BQU8sa0JBQWtCLENBQUMsUUFBUSxDQUFDO1FBQ3BDLENBQUM7UUFHTyxVQUFVO1lBQ2pCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUdPLFVBQVUsQ0FBQyxDQUFNLEVBQUUsSUFBMkI7WUFDckQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFHTyxPQUFPO1lBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGdCQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzRyxDQUFDO0tBQ0Q7SUFoRVU7UUFBVCxRQUFRO3FEQUE4RDtJQWtEdkU7UUFEQyxLQUFLO3dEQUlMO0lBR0Q7UUFEQyxLQUFLO3dEQUdMO0lBR0Q7UUFEQyxLQUFLO3FEQUdMO0lBaEVGLHFDQWlFQyJ9
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/IObject", "language/Translation", "newui/component/Button", "newui/component/Component", "newui/component/Dropdown", "newui/component/dropdown/ItemDropdown", "newui/component/LabelledRow", "utilities/Arrays", "utilities/enum/Enums", "../../IDebugTools"], function (require, exports, IObject_1, Translation_1, Button_1, Component_1, Dropdown_1, ItemDropdown_1, LabelledRow_1, Arrays_1, Enums_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let AddItemToInventory = (() => {
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
                this.event.emit("execute", this.dropdownItemType.selection, this.dropdownItemQuality.selection);
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
        return AddItemToInventory;
    })();
    exports.default = AddItemToInventory;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkSXRlbVRvSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9BZGRJdGVtVG9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBcUJBO1FBQUEsTUFBcUIsa0JBQW1CLFNBQVEsbUJBQVM7WUFheEQ7Z0JBQ0MsS0FBSyxFQUFFLENBQUM7Z0JBRVIsSUFBSSx5QkFBVyxFQUFFO3FCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7cUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3FCQUM5RSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksc0JBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDckksS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO3FCQUMvQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRWpCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxtQkFBUyxFQUFFO3FCQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRDQUE0QyxDQUFDO3FCQUN6RCxJQUFJLEVBQUU7cUJBQ04sTUFBTSxDQUFDLElBQUkseUJBQVcsRUFBRTtxQkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztxQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7cUJBQ2pGLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxrQkFBUSxFQUFXO3FCQUN4RCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO29CQUN4QixhQUFhLEVBQUUsaUJBQU8sQ0FBQyxNQUFNO29CQUM3QixPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxpQkFBTyxDQUFDO3lCQUM1QixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxjQUFLLENBQUMsT0FBTyxFQUFFLHFCQUFXLENBQUMsU0FBUyxDQUFDLGlCQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUN2RSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNwRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNOLE1BQU0sQ0FBQyxJQUFJLGdCQUFNLEVBQUU7cUJBQ2xCLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQyxDQUFDO3FCQUMxRCxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQzNDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNyRCxDQUFDO1lBckNNLE1BQU0sQ0FBQyxJQUFJO2dCQUNqQixPQUFPLGtCQUFrQixDQUFDLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLElBQUksSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1lBQzlGLENBQUM7WUFxQ00sZ0JBQWdCO2dCQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN0RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2QsT0FBTyxrQkFBa0IsQ0FBQyxRQUFRLENBQUM7WUFDcEMsQ0FBQztZQUdPLFVBQVU7Z0JBQ2pCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDYixPQUFPLEtBQUssQ0FBQztZQUNkLENBQUM7WUFHTyxVQUFVLENBQUMsQ0FBTSxFQUFFLElBQXVCO2dCQUNqRCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUM7WUFDN0MsQ0FBQztZQUdPLE9BQU87Z0JBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFxQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3RyxDQUFDO1NBQ0Q7UUFoRVU7WUFBVCxRQUFRO3lEQUE4RDtRQWtEdkU7WUFEQyxLQUFLOzREQUlMO1FBR0Q7WUFEQyxLQUFLOzREQUdMO1FBR0Q7WUFEQyxLQUFLO3lEQUdMO1FBQ0YseUJBQUM7U0FBQTtzQkFqRW9CLGtCQUFrQiJ9
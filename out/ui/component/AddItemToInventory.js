var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/IObject", "item/IItem", "language/Dictionaries", "language/Translation", "newui/component/Button", "newui/component/Component", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "utilities/Arrays", "utilities/enum/Enums", "utilities/Objects", "utilities/stream/Stream", "../../IDebugTools"], function (require, exports, IObject_1, IItem_1, Dictionaries_1, Translation_1, Button_1, Component_1, Dropdown_1, LabelledRow_1, Text_1, Arrays_1, Enums_1, Objects_1, Stream_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AddItemToInventoryEvent;
    (function (AddItemToInventoryEvent) {
        AddItemToInventoryEvent["Execute"] = "Execute";
    })(AddItemToInventoryEvent = exports.AddItemToInventoryEvent || (exports.AddItemToInventoryEvent = {}));
    class AddItemToInventory extends Component_1.default {
        constructor() {
            super();
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelItem)))
                .append(this.dropdownItemType = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: IItem_1.ItemType.None,
                options: Stream_1.default.of(Arrays_1.tuple(IItem_1.ItemType.None, Translation_1.default.nameOf(Dictionaries_1.Dictionary.Item, IItem_1.ItemType.None, false).inContext(3)))
                    .merge(Enums_1.default.values(IItem_1.ItemType)
                    .filter(item => item)
                    .map(item => Arrays_1.tuple(item, Translation_1.default.nameOf(Dictionaries_1.Dictionary.Item, item, false).inContext(3)))
                    .sorted(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2))))
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t))),
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeItem))
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
                    .map(quality => Arrays_1.tuple(quality, Translation_1.default.generator(IObject_1.Quality[quality])))
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t))),
            }))))
                .append(new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.AddToInventory))
                .on(Button_1.ButtonEvent.Activate, this.addItem))
                .appendTo(this);
            this.on("WillRemove", this.willRemove);
        }
        static init() {
            return AddItemToInventory.INSTANCE = AddItemToInventory.INSTANCE || new AddItemToInventory();
        }
        releaseAndRemove() {
            this.cancel("WillRemove", this.willRemove);
            this.remove();
            delete AddItemToInventory.INSTANCE;
        }
        willRemove() {
            this.store();
            return false;
        }
        changeItem(_, item) {
            this.wrapperAddItem.toggle(item !== IItem_1.ItemType.None);
        }
        addItem() {
            this.emit(AddItemToInventoryEvent.Execute, this.dropdownItemType.selection, this.dropdownItemQuality.selection);
        }
    }
    __decorate([
        Objects_1.Bound
    ], AddItemToInventory.prototype, "willRemove", null);
    __decorate([
        Objects_1.Bound
    ], AddItemToInventory.prototype, "changeItem", null);
    __decorate([
        Objects_1.Bound
    ], AddItemToInventory.prototype, "addItem", null);
    exports.default = AddItemToInventory;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkSXRlbVRvSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9BZGRJdGVtVG9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBZ0JBLElBQVksdUJBTVg7SUFORCxXQUFZLHVCQUF1QjtRQUtsQyw4Q0FBbUIsQ0FBQTtJQUNwQixDQUFDLEVBTlcsdUJBQXVCLEdBQXZCLCtCQUF1QixLQUF2QiwrQkFBdUIsUUFNbEM7SUFFRCxNQUFxQixrQkFBbUIsU0FBUSxtQkFBUztRQVl4RDtZQUNDLEtBQUssRUFBRSxDQUFDO1lBRVIsSUFBSSx5QkFBVyxFQUFFO2lCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2lCQUM5RSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksa0JBQVEsRUFBWTtpQkFDdEQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsYUFBYSxFQUFFLGdCQUFRLENBQUMsSUFBSTtnQkFDNUIsT0FBTyxFQUFFLGdCQUFNLENBQUMsRUFBRSxDQUFDLGNBQUssQ0FBQyxnQkFBUSxDQUFDLElBQUksRUFBRSxxQkFBVyxDQUFDLE1BQU0sQ0FBQyx5QkFBVSxDQUFDLElBQUksRUFBRSxnQkFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQW1CLENBQUMsQ0FBQztxQkFDOUgsS0FBSyxDQUFDLGVBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQVEsQ0FBQztxQkFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO3FCQUNwQixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFLLENBQUMsSUFBSSxFQUFFLHFCQUFXLENBQUMsTUFBTSxDQUFDLHlCQUFVLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQW1CLENBQUMsQ0FBQztxQkFDdkcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ2hGLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxjQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBYyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDcEUsQ0FBQyxDQUFDO2lCQUNGLEVBQUUsQ0FBQyx3QkFBYSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksbUJBQVMsRUFBRTtpQkFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsQ0FBQztpQkFDekQsSUFBSSxFQUFFO2lCQUNOLE1BQU0sQ0FBQyxJQUFJLHlCQUFXLEVBQUU7aUJBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUNqRixNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksa0JBQVEsRUFBVztpQkFDeEQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsYUFBYSxFQUFFLGlCQUFPLENBQUMsTUFBTTtnQkFDN0IsT0FBTyxFQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsaUJBQU8sQ0FBQztxQkFDNUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsY0FBSyxDQUFDLE9BQU8sRUFBRSxxQkFBVyxDQUFDLFNBQVMsQ0FBQyxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdkUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNOLE1BQU0sQ0FBQyxJQUFJLGdCQUFNLEVBQUU7aUJBQ2xCLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUMxRCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUN4QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxDQUFDLEVBQUUsZUFBNEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUE5Q00sTUFBTSxDQUFDLElBQUk7WUFDakIsT0FBTyxrQkFBa0IsQ0FBQyxRQUFRLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxJQUFJLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUM5RixDQUFDO1FBOENNLGdCQUFnQjtZQUN0QixJQUFJLENBQUMsTUFBTSxlQUE0QixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsT0FBTyxrQkFBa0IsQ0FBQyxRQUFRLENBQUM7UUFDcEMsQ0FBQztRQUdPLFVBQVU7WUFDakIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDO1FBR08sVUFBVSxDQUFDLENBQU0sRUFBRSxJQUFjO1lBQ3hDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxnQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFHTyxPQUFPO1lBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakgsQ0FBQztLQUNEO0lBZEE7UUFEQyxlQUFLO3dEQUlMO0lBR0Q7UUFEQyxlQUFLO3dEQUdMO0lBR0Q7UUFEQyxlQUFLO3FEQUdMO0lBeEVGLHFDQXlFQyJ9
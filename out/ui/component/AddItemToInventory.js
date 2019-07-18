var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/IObject", "item/IItem", "language/Dictionaries", "language/Translation", "newui/component/Button", "newui/component/Component", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "utilities/Arrays", "utilities/enum/Enums", "utilities/stream/Stream", "../../IDebugTools", "./GroupDropdown"], function (require, exports, IObject_1, IItem_1, Dictionaries_1, Translation_1, Button_1, Component_1, Dropdown_1, LabelledRow_1, Text_1, Arrays_1, Enums_1, Stream_1, IDebugTools_1, GroupDropdown_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AddItemToInventory extends Component_1.default {
        constructor() {
            super();
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelItem)))
                .append(this.dropdownItemType = new ItemDropdown()
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
                    .map(quality => Arrays_1.tuple(quality, Translation_1.default.generator(IObject_1.Quality[quality])))
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t))),
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
            this.wrapperAddItem.toggle(item !== IItem_1.ItemType.None);
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
    exports.default = AddItemToInventory;
    class ItemDropdown extends GroupDropdown_1.default {
        constructor() {
            super();
            this.setRefreshMethod(() => ({
                defaultOption: IItem_1.ItemType.None,
                options: Stream_1.default.of(Arrays_1.tuple(IItem_1.ItemType.None, Translation_1.default.nameOf(Dictionaries_1.Dictionary.Item, IItem_1.ItemType.None, false).inContext(Translation_1.TextContext.Title)))
                    .merge(Enums_1.default.values(IItem_1.ItemType)
                    .filter(item => item)
                    .map(item => Arrays_1.tuple(item, Translation_1.default.nameOf(Dictionaries_1.Dictionary.Item, item, false).inContext(Translation_1.TextContext.Title)))
                    .sorted(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2))))
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t))),
            }));
        }
        getGroupName(group) {
            return new Translation_1.default(Dictionaries_1.Dictionary.ItemGroup, group).getString();
        }
        isInGroup(item, group) {
            return itemManager.isInGroup(item, group);
        }
        getGroups() {
            return Enums_1.default.values(IItem_1.ItemTypeGroup);
        }
    }
    __decorate([
        Override
    ], ItemDropdown.prototype, "getGroupName", null);
    __decorate([
        Override
    ], ItemDropdown.prototype, "isInGroup", null);
    __decorate([
        Override
    ], ItemDropdown.prototype, "getGroups", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkSXRlbVRvSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9BZGRJdGVtVG9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBMkJBLE1BQXFCLGtCQUFtQixTQUFRLG1CQUFTO1FBYXhEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7aUJBQzlFLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxZQUFZLEVBQUU7aUJBQ2hELEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDL0MsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxtQkFBUyxFQUFFO2lCQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRDQUE0QyxDQUFDO2lCQUN6RCxJQUFJLEVBQUU7aUJBQ04sTUFBTSxDQUFDLElBQUkseUJBQVcsRUFBRTtpQkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7aUJBQ2pGLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxrQkFBUSxFQUFXO2lCQUN4RCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixhQUFhLEVBQUUsaUJBQU8sQ0FBQyxNQUFNO2dCQUM3QixPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxpQkFBTyxDQUFDO3FCQUM1QixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxjQUFLLENBQUMsT0FBTyxFQUFFLHFCQUFXLENBQUMsU0FBUyxDQUFDLGlCQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2RSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3BFLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ04sTUFBTSxDQUFDLElBQUksZ0JBQU0sRUFBRTtpQkFDbEIsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsY0FBYyxDQUFDLENBQUM7aUJBQzFELEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDM0MsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckQsQ0FBQztRQXJDTSxNQUFNLENBQUMsSUFBSTtZQUNqQixPQUFPLGtCQUFrQixDQUFDLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLElBQUksSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBQzlGLENBQUM7UUFxQ00sZ0JBQWdCO1lBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsT0FBTyxrQkFBa0IsQ0FBQyxRQUFRLENBQUM7UUFDcEMsQ0FBQztRQUdPLFVBQVU7WUFDakIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDO1FBR08sVUFBVSxDQUFDLENBQU0sRUFBRSxJQUFjO1lBQ3hDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxnQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFHTyxPQUFPO1lBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pHLENBQUM7S0FDRDtJQWhFVTtRQUFULFFBQVE7cURBQThEO0lBa0R2RTtRQURDLEtBQUs7d0RBSUw7SUFHRDtRQURDLEtBQUs7d0RBR0w7SUFHRDtRQURDLEtBQUs7cURBR0w7SUFoRUYscUNBaUVDO0lBRUQsTUFBTSxZQUFhLFNBQVEsdUJBQXNDO1FBRWhFO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDNUIsYUFBYSxFQUFFLGdCQUFRLENBQUMsSUFBSTtnQkFDNUIsT0FBTyxFQUFFLGdCQUFNLENBQUMsRUFBRSxDQUFDLGNBQUssQ0FBQyxnQkFBUSxDQUFDLElBQUksRUFBRSxxQkFBVyxDQUFDLE1BQU0sQ0FBQyx5QkFBVSxDQUFDLElBQUksRUFBRSxnQkFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMseUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3FCQUM5SCxLQUFLLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBUSxDQUFDO3FCQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7cUJBQ3BCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQUssQ0FBQyxJQUFJLEVBQUUscUJBQVcsQ0FBQyxNQUFNLENBQUMseUJBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyx5QkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7cUJBQ3ZHLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNoRixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3BFLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVtQixZQUFZLENBQUMsS0FBb0I7WUFDcEQsT0FBTyxJQUFJLHFCQUFXLENBQUMseUJBQVUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDakUsQ0FBQztRQUVtQixTQUFTLENBQUMsSUFBYyxFQUFFLEtBQW9CO1lBQ2pFLE9BQU8sV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUVtQixTQUFTO1lBQzVCLE9BQU8sZUFBSyxDQUFDLE1BQU0sQ0FBQyxxQkFBYSxDQUFDLENBQUM7UUFDcEMsQ0FBQztLQUNEO0lBWFU7UUFBVCxRQUFRO29EQUVSO0lBRVM7UUFBVCxRQUFRO2lEQUVSO0lBRVM7UUFBVCxRQUFRO2lEQUVSIn0=
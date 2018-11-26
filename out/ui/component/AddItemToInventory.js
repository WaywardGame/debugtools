var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "language/Dictionaries", "language/Translation", "newui/component/Button", "newui/component/Component", "newui/component/Dropdown", "newui/component/IComponent", "newui/component/LabelledRow", "newui/component/Text", "utilities/Arrays", "utilities/enum/Enums", "utilities/iterable/Collectors", "utilities/iterable/Generators", "utilities/Objects", "../../IDebugTools"], function (require, exports, Enums_1, Dictionaries_1, Translation_1, Button_1, Component_1, Dropdown_1, IComponent_1, LabelledRow_1, Text_1, Arrays_1, Enums_2, Collectors_1, Generators_1, Objects_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AddItemToInventoryEvent;
    (function (AddItemToInventoryEvent) {
        AddItemToInventoryEvent["Execute"] = "Execute";
    })(AddItemToInventoryEvent = exports.AddItemToInventoryEvent || (exports.AddItemToInventoryEvent = {}));
    class AddItemToInventory extends Component_1.default {
        constructor(api) {
            super(api);
            new LabelledRow_1.LabelledRow(api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelItem)))
                .append(this.dropdownItemType = new Dropdown_1.default(api)
                .setRefreshMethod(() => ({
                defaultOption: Enums_1.ItemType.None,
                options: Generators_1.pipe(Arrays_1.tuple(Enums_1.ItemType.None, Translation_1.default.nameOf(Dictionaries_1.Dictionary.Item, Enums_1.ItemType.None, false).inContext(3)))
                    .include(Enums_2.default.values(Enums_1.ItemType)
                    .filter(item => item)
                    .map(item => Arrays_1.tuple(item, Translation_1.default.nameOf(Dictionaries_1.Dictionary.Item, item, false).inContext(3)))
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values())
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t))),
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeItem))
                .appendTo(this);
            this.wrapperAddItem = new Component_1.default(api)
                .classes.add("debug-tools-inspect-human-wrapper-add-item")
                .hide()
                .append(new LabelledRow_1.LabelledRow(api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelQuality)))
                .append(this.dropdownItemQuality = new Dropdown_1.default(api)
                .setRefreshMethod(() => ({
                defaultOption: Enums_1.ItemQuality.Random,
                options: Enums_2.default.values(Enums_1.ItemQuality)
                    .map(quality => Arrays_1.tuple(quality, Translation_1.default.generator(Enums_1.ItemQuality[quality])))
                    .collect(Collectors_1.default.toArray)
                    .values()
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t))),
            }))))
                .append(new Button_1.default(api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.AddToInventory))
                .on(Button_1.ButtonEvent.Activate, this.addItem))
                .appendTo(this);
            this.on(IComponent_1.ComponentEvent.WillRemove, this.willRemove);
        }
        static init(api) {
            return AddItemToInventory.INSTANCE = AddItemToInventory.INSTANCE || new AddItemToInventory(api);
        }
        releaseAndRemove() {
            this.cancel(IComponent_1.ComponentEvent.WillRemove, this.willRemove);
            this.remove();
            delete AddItemToInventory.INSTANCE;
        }
        willRemove() {
            this.store();
            return false;
        }
        changeItem(_, item) {
            this.wrapperAddItem.toggle(item !== Enums_1.ItemType.None);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkSXRlbVRvSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9BZGRJdGVtVG9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBaUJBLElBQVksdUJBTVg7SUFORCxXQUFZLHVCQUF1QjtRQUtsQyw4Q0FBbUIsQ0FBQTtJQUNwQixDQUFDLEVBTlcsdUJBQXVCLEdBQXZCLCtCQUF1QixLQUF2QiwrQkFBdUIsUUFNbEM7SUFFRCxNQUFxQixrQkFBbUIsU0FBUSxtQkFBUztRQVl4RCxZQUFvQixHQUFVO1lBQzdCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVYLElBQUkseUJBQVcsQ0FBQyxHQUFHLENBQUM7aUJBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2lCQUM5RSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksa0JBQVEsQ0FBVyxHQUFHLENBQUM7aUJBQ3pELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLGFBQWEsRUFBRSxnQkFBUSxDQUFDLElBQUk7Z0JBQzVCLE9BQU8sRUFBRSxpQkFBSSxDQUFDLGNBQUssQ0FBQyxnQkFBUSxDQUFDLElBQUksRUFBRSxxQkFBVyxDQUFDLE1BQU0sQ0FBQyx5QkFBVSxDQUFDLElBQUksRUFBRSxnQkFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQW1CLENBQUMsQ0FBQztxQkFDekgsT0FBTyxDQUFDLGVBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQVEsQ0FBQztxQkFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO3FC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
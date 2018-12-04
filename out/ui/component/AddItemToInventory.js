var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "language/Dictionaries", "language/Translation", "newui/component/Button", "newui/component/Component", "newui/component/Dropdown", "newui/component/IComponent", "newui/component/LabelledRow", "newui/component/Text", "utilities/enum/Enums", "utilities/iterable/Collectors", "utilities/iterable/Generators", "utilities/Objects", "../../IDebugTools"], function (require, exports, Enums_1, Dictionaries_1, Translation_1, Button_1, Component_1, Dropdown_1, IComponent_1, LabelledRow_1, Text_1, Enums_2, Collectors_1, Generators_1, Objects_1, IDebugTools_1) {
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
                options: Generators_1.pipe(Generators_1.tuple(Enums_1.ItemType.None, Translation_1.default.nameOf(Dictionaries_1.Dictionary.Item, Enums_1.ItemType.None, false).inContext(3)))
                    .include(Enums_2.default.values(Enums_1.ItemType)
                    .filter(item => item)
                    .map(item => Generators_1.tuple(item, Translation_1.default.nameOf(Dictionaries_1.Dictionary.Item, item, false).inContext(3)))
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values())
                    .map(([id, t]) => Generators_1.tuple(id, (option) => option.setText(t))),
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
                    .map(quality => Generators_1.tuple(quality, Translation_1.default.generator(Enums_1.ItemQuality[quality])))
                    .collect(Collectors_1.default.toArray)
                    .values()
                    .map(([id, t]) => Generators_1.tuple(id, (option) => option.setText(t))),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkSXRlbVRvSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9BZGRJdGVtVG9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBZ0JBLElBQVksdUJBTVg7SUFORCxXQUFZLHVCQUF1QjtRQUtsQyw4Q0FBbUIsQ0FBQTtJQUNwQixDQUFDLEVBTlcsdUJBQXVCLEdBQXZCLCtCQUF1QixLQUF2QiwrQkFBdUIsUUFNbEM7SUFFRCxNQUFxQixrQkFBbUIsU0FBUSxtQkFBUztRQVl4RCxZQUFvQixHQUFVO1lBQzdCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVYLElBQUkseUJBQVcsQ0FBQyxHQUFHLENBQUM7aUJBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2lCQUM5RSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksa0JBQVEsQ0FBVyxHQUFHLENBQUM7aUJBQ3pELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLGFBQWEsRUFBRSxnQkFBUSxDQUFDLElBQUk7Z0JBQzVCLE9BQU8sRUFBRSxpQkFBSSxDQUFDLGtCQUFLLENBQUMsZ0JBQVEsQ0FBQyxJQUFJLEVBQUUscUJBQVcsQ0FBQyxNQUFNLENBQUMseUJBQVUsQ0FBQyxJQUFJLEVBQUUsZ0JBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFtQixDQUFDLENBQUM7cUJBQ3pILE9BQU8sQ0FBQyxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFRLENBQUM7cUJBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztx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
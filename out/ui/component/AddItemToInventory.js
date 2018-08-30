var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "item/Items", "language/Translation", "newui/component/Button", "newui/component/Component", "newui/component/Dropdown", "newui/component/IComponent", "newui/component/LabelledRow", "newui/component/Text", "utilities/Arrays", "utilities/Collectors", "utilities/enum/Enums", "utilities/Objects", "../../DebugTools", "../../IDebugTools"], function (require, exports, Enums_1, Items_1, Translation_1, Button_1, Component_1, Dropdown_1, IComponent_1, LabelledRow_1, Text_1, Arrays_1, Collectors_1, Enums_2, Objects_1, DebugTools_1, IDebugTools_1) {
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
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelItem)))
                .append(this.dropdownItemType = new Dropdown_1.default(api)
                .setRefreshMethod(() => ({
                defaultOption: Enums_1.ItemType.None,
                options: Enums_2.default.values(Enums_1.ItemType)
                    .map(item => Arrays_1.tuple(item, Translation_1.default.ofDescription(Items_1.default[item], Enums_1.SentenceCaseStyle.Title, false)))
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t))),
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeItem))
                .appendTo(this);
            this.wrapperAddItem = new Component_1.default(api)
                .classes.add("debug-tools-inspect-human-wrapper-add-item")
                .hide()
                .append(new LabelledRow_1.LabelledRow(api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelQuality)))
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
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.AddToInventory))
                .on(Button_1.ButtonEvent.Activate, this.addItem))
                .appendTo(this);
            this.on(IComponent_1.ComponentEvent.WillRemove, this.willRemove);
        }
        static get(api) {
            return AddItemToInventory.INSTANCE = AddItemToInventory.INSTANCE || new AddItemToInventory(api);
        }
        releaseAndRemove() {
            this.cancel(IComponent_1.ComponentEvent.WillRemove, this.willRemove);
            this.remove();
        }
        willRemove() {
            this.store();
            return false;
        }
        changeItem(_, item) {
            this.wrapperAddItem.toggle(item !== Enums_1.ItemType.None);
        }
        addItem() {
            this.trigger(AddItemToInventoryEvent.Execute, this.dropdownItemType.selection, this.dropdownItemQuality.selection);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkSXRlbVRvSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9BZGRJdGVtVG9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBaUJBLElBQVksdUJBTVg7SUFORCxXQUFZLHVCQUF1QjtRQUtsQyw4Q0FBbUIsQ0FBQTtJQUNwQixDQUFDLEVBTlcsdUJBQXVCLEdBQXZCLCtCQUF1QixLQUF2QiwrQkFBdUIsUUFNbEM7SUFFRCxNQUFxQixrQkFBbUIsU0FBUSxtQkFBUztRQVl4RCxZQUFvQixHQUFVO1lBQzdCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVYLElBQUkseUJBQVcsQ0FBQyxHQUFHLENBQUM7aUJBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2lCQUM5RSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksa0JBQVEsQ0FBVyxHQUFHLENBQUM7aUJBQ3pELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLGFBQWEsRUFBRSxnQkFBUSxDQUFDLElBQUk7Z0JBQzVCLE9BQU8sRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFRLENBQUM7cUJBQzdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQUssQ0FBQyxJQUFJLEVBQUUscUJBQVcsQ0FBQyxhQUFhLENBQUMsZUFBZ0IsQ0FBQyxJQUFJLENBQUUsRUFBRSx5QkFBaUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztxQkFDNUcsT0FBTyxDQUFDLG9CQUFVLENBQUMsT0FBTyxDQUFDO3FCQUMzQixJQUFJLENBQUMsQ0FBQyxD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
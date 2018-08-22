var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/BaseHumanEntity", "entity/IStats", "Enums", "item/Items", "language/Translation", "newui/component/Button", "newui/component/Component", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/RangeInput", "newui/component/RangeRow", "newui/component/Text", "utilities/Collectors", "utilities/enum/Enums", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools"], function (require, exports, BaseHumanEntity_1, IStats_1, Enums_1, Items_1, Translation_1, Button_1, Component_1, Dropdown_1, LabelledRow_1, RangeInput_1, RangeRow_1, Text_1, Collectors_1, Enums_2, Objects_1, Actions_1, DebugTools_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HumanInformation extends Component_1.default {
        constructor(api, human) {
            super(api);
            this.human = human;
            new LabelledRow_1.LabelledRow(api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelItem)))
                .append(new Dropdown_1.default(api)
                .setRefreshMethod(() => ({
                defaultOption: Enums_1.ItemType.None,
                options: Enums_2.default.values(Enums_1.ItemType)
                    .map(item => [item, Translation_1.default.ofObjectName(Items_1.default[item], Enums_1.SentenceCaseStyle.Title, false)])
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => [id, option => option.setText(t)]),
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeItem))
                .appendTo(this);
            this.wrapperAddItem = new Component_1.default(api)
                .hide()
                .append(new LabelledRow_1.LabelledRow(api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelQuality)))
                .append(this.dropdownItemQuality = new Dropdown_1.default(api)
                .setRefreshMethod(() => ({
                defaultOption: Enums_1.ItemQuality.Random,
                options: Enums_2.default.values(Enums_1.ItemQuality)
                    .map(quality => [quality, Translation_1.default.generator(Enums_1.ItemQuality[quality])])
                    .collect(Collectors_1.default.toArray)
                    .values()
                    .map(([id, t]) => [id, option => option.setText(t)]),
            }))))
                .append(new Button_1.default(api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.AddToInventory))
                .on(Button_1.ButtonEvent.Activate, this.addItem))
                .appendTo(this);
            this.addReputationSlider(IDebugTools_1.DebugToolsTranslation.LabelMalignity, IStats_1.Stat.Malignity);
            this.addReputationSlider(IDebugTools_1.DebugToolsTranslation.LabelBenignity, IStats_1.Stat.Benignity);
        }
        getImmutableStats() {
            return [
                IStats_1.Stat.Benignity,
                IStats_1.Stat.Malignity,
            ];
        }
        addReputationSlider(labelTranslation, type) {
            new RangeRow_1.RangeRow(this.api)
                .setLabel(label => label.setText(DebugTools_1.translation(labelTranslation)))
                .editRange(range => range
                .setMin(0)
                .setMax(BaseHumanEntity_1.REPUTATION_MAX)
                .setRefreshMethod(() => this.human.getStatValue(type)))
                .setDisplayValue(true)
                .on(RangeInput_1.RangeInputEvent.Finish, this.setReputation(type))
                .appendTo(this);
        }
        setReputation(type) {
            return (_, value) => {
                Actions_1.default.get("setStat").execute({ entity: this.human, object: [type, value] });
            };
        }
        changeItem(_, item) {
            this.item = item;
            this.wrapperAddItem.toggle(item !== Enums_1.ItemType.None);
        }
        addItem() {
            Actions_1.default.get("addItemToInventory")
                .execute({ human: this.human, object: [this.item, this.dropdownItemQuality.selection] });
        }
    }
    __decorate([
        Objects_1.Bound
    ], HumanInformation.prototype, "changeItem", null);
    __decorate([
        Objects_1.Bound
    ], HumanInformation.prototype, "addItem", null);
    exports.default = HumanInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHVtYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9IdW1hbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUF5QkEsTUFBcUIsZ0JBQWlCLFNBQVEsbUJBQVM7UUFLdEQsWUFBbUIsR0FBVSxFQUFtQixLQUF1QjtZQUN0RSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFEb0MsVUFBSyxHQUFMLEtBQUssQ0FBa0I7WUFHdEUsSUFBSSx5QkFBVyxDQUFDLEdBQUcsQ0FBQztpQkFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7aUJBQzlFLE1BQU0sQ0FBQyxJQUFJLGtCQUFRLENBQVcsR0FBRyxDQUFDO2lCQUNqQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixhQUFhLEVBQUUsZ0JBQVEsQ0FBQyxJQUFJO2dCQUM1QixPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBUSxDQUFDO3FCQUM3QixHQUFHLENBQW1DLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUscUJBQVcsQ0FBQyxZQUFZLENBQUMsZUFBZ0IsQ0FBQyxJQUFJLENBQUUsRUFBRSx5QkFBaUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztxQkFDeEksT0FBTyxDQUFDLG9CQUFVLENBQUMsT0FBTyxDQUFDO3FCQUMzQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFJLENBQUMsUUFBUSxD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
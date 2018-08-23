var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/BaseHumanEntity", "entity/IBaseEntity", "entity/IEntity", "entity/IStats", "Enums", "item/Items", "language/Translation", "newui/component/Button", "newui/component/Component", "newui/component/Dropdown", "newui/component/IComponent", "newui/component/LabelledRow", "newui/component/RangeInput", "newui/component/RangeRow", "newui/component/Text", "utilities/Collectors", "utilities/enum/Enums", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools", "../component/InspectEntityInformationSubsection"], function (require, exports, BaseHumanEntity_1, IBaseEntity_1, IEntity_1, IStats_1, Enums_1, Items_1, Translation_1, Button_1, Component_1, Dropdown_1, IComponent_1, LabelledRow_1, RangeInput_1, RangeRow_1, Text_1, Collectors_1, Enums_2, Objects_1, Actions_1, DebugTools_1, IDebugTools_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HumanInformation extends InspectEntityInformationSubsection_1.default {
        constructor(api) {
            super(api);
            this.reputationSliders = {};
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
                .classes.add("debug-tools-inspect-human-wrapper-add-item")
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
            return this.human ? [
                IStats_1.Stat.Benignity,
                IStats_1.Stat.Malignity,
                IStats_1.Stat.Attack,
                IStats_1.Stat.Defense,
                IStats_1.Stat.Reputation,
                IStats_1.Stat.Weight,
            ] : [];
        }
        update(entity) {
            if (this.human === entity)
                return;
            this.human = entity.entityType === IEntity_1.EntityType.Creature ? undefined : entity;
            this.toggle(!!this.human);
            this.triggerSync("change");
            if (!this.human)
                return;
            for (const type of Objects_1.default.keys(this.reputationSliders)) {
                this.reputationSliders[type].refresh();
            }
            this.until([IComponent_1.ComponentEvent.Remove, "change"])
                .bind(entity, IBaseEntity_1.EntityEvent.StatChanged, this.onStatChange);
        }
        addReputationSlider(labelTranslation, type) {
            this.reputationSliders[type] = new RangeRow_1.RangeRow(this.api)
                .setLabel(label => label.setText(DebugTools_1.translation(labelTranslation)))
                .editRange(range => range
                .setMin(0)
                .setMax(BaseHumanEntity_1.REPUTATION_MAX)
                .setRefreshMethod(() => this.human ? this.human.getStatValue(type) : 0))
                .setDisplayValue(true)
                .on(RangeInput_1.RangeInputEvent.Finish, this.setReputation(type))
                .appendTo(this);
        }
        setReputation(type) {
            return (_, value) => {
                if (this.human.getStatValue(type) === value)
                    return;
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
        onStatChange(_, stat) {
            switch (stat.type) {
                case IStats_1.Stat.Malignity:
                case IStats_1.Stat.Benignity:
                    this.reputationSliders[stat.type].refresh();
                    break;
            }
        }
    }
    __decorate([
        Objects_1.Bound
    ], HumanInformation.prototype, "changeItem", null);
    __decorate([
        Objects_1.Bound
    ], HumanInformation.prototype, "addItem", null);
    __decorate([
        Objects_1.Bound
    ], HumanInformation.prototype, "onStatChange", null);
    exports.default = HumanInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHVtYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9IdW1hbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUE0QkEsTUFBcUIsZ0JBQWlCLFNBQVEsNENBQWtDO1FBUS9FLFlBQW1CLEdBQVU7WUFDNUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBSEosc0JBQWlCLEdBQTRELEVBQUUsQ0FBQztZQUt2RixJQUFJLHlCQUFXLENBQUMsR0FBRyxDQUFDO2lCQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO2lCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHdCQUFXLENBQUMsbUNBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztpQkFDOUUsTUFBTSxDQUFDLElBQUksa0JBQVEsQ0FBVyxHQUFHLENBQUM7aUJBQ2pDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLGFBQWEsRUFBRSxnQkFBUSxDQUFDLElBQUk7Z0JBQzVCLE9BQU8sRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFRLENBQUM7cUJBQzdCLEdBQUcsQ0FBbUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxxQkFBVyxDQUFDLFlBQVksQ0FBQyxlQUFnQixDQUFDLElBQUksQ0FBRSxFQUFFLHlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO3FCQUN4SSxPQUFPLENBQUMsb0JBQVUsQ0FBQyxPQUFPLENBQUM7cUJBQzNCLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxD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
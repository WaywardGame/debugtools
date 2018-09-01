var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/BaseHumanEntity", "entity/IBaseEntity", "entity/IEntity", "entity/IStats", "newui/component/Component", "newui/component/IComponent", "newui/component/RangeInput", "newui/component/RangeRow", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools", "../component/AddItemToInventory", "../component/DebugToolsPanel", "../component/InspectEntityInformationSubsection"], function (require, exports, BaseHumanEntity_1, IBaseEntity_1, IEntity_1, IStats_1, Component_1, IComponent_1, RangeInput_1, RangeRow_1, Objects_1, Actions_1, DebugTools_1, IDebugTools_1, AddItemToInventory_1, DebugToolsPanel_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HumanInformation extends InspectEntityInformationSubsection_1.default {
        constructor(api) {
            super(api);
            this.reputationSliders = {};
            this.addItemContainer = new Component_1.default(api).appendTo(this);
            this.addReputationSlider(IDebugTools_1.DebugToolsTranslation.LabelMalignity, IStats_1.Stat.Malignity);
            this.addReputationSlider(IDebugTools_1.DebugToolsTranslation.LabelBenignity, IStats_1.Stat.Benignity);
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo, () => {
                const addItemToInventory = AddItemToInventory_1.default.get(this.api).appendTo(this.addItemContainer);
                this.until(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway)
                    .bind(addItemToInventory, AddItemToInventory_1.AddItemToInventoryEvent.Execute, this.addItem);
            });
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
            this.trigger("change");
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
        addItem(_, type, quality) {
            Actions_1.default.get("addItemToInventory")
                .execute({ human: this.human, object: [type, quality] });
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
    ], HumanInformation.prototype, "addItem", null);
    __decorate([
        Objects_1.Bound
    ], HumanInformation.prototype, "onStatChange", null);
    exports.default = HumanInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHVtYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9IdW1hbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFzQkEsTUFBcUIsZ0JBQWlCLFNBQVEsNENBQWtDO1FBTS9FLFlBQW1CLEdBQVU7WUFDNUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBTEssc0JBQWlCLEdBQTRELEVBQUUsQ0FBQztZQU9oRyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxtQkFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUxRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUNBQXFCLENBQUMsY0FBYyxFQUFFLGFBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMvRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUNBQXFCLENBQUMsY0FBYyxFQUFFLGFBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUUvRSxJQUFJLENBQUMsRUFBRSxDQUFDLHNDQUFvQixDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7Z0JBQzNDLE1BQU0sa0JBQWtCLEdBQUcsNEJBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQzVGLElBQUksQ0FBQyxLQUFLLENBQUMsc0NBQW9CLENBQUMsVUFBVSxDQUFDO3FCQUN6QyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsNENBQXVCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzRSxDQUFDLENBQUMsQ0FBQztRQUNKLENBQUM7UUFFTSxpQkFBaUI7WUFDdkIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsYUFBSSxDQUFDLFNBQVM7Z0JBQ2QsYUFBSSxDQUFDLFNBQVM7Z0JBQ2QsYUFBSSxDQUFD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
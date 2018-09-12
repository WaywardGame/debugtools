var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/BaseHumanEntity", "entity/IBaseEntity", "entity/IEntity", "entity/IStats", "newui/component/Component", "newui/component/IComponent", "newui/component/RangeInput", "newui/component/RangeRow", "utilities/Objects", "../../Actions", "../../IDebugTools", "../component/AddItemToInventory", "../component/DebugToolsPanel", "../component/InspectEntityInformationSubsection"], function (require, exports, BaseHumanEntity_1, IBaseEntity_1, IEntity_1, IStats_1, Component_1, IComponent_1, RangeInput_1, RangeRow_1, Objects_1, Actions_1, IDebugTools_1, AddItemToInventory_1, DebugToolsPanel_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HumanInformation extends InspectEntityInformationSubsection_1.default {
        constructor(gsapi) {
            super(gsapi);
            this.reputationSliders = {};
            this.addItemContainer = new Component_1.default(this.api).appendTo(this);
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
                .setLabel(label => label.setText(IDebugTools_1.translation(labelTranslation)))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHVtYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9IdW1hbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFxQkEsTUFBcUIsZ0JBQWlCLFNBQVEsNENBQWtDO1FBTS9FLFlBQW1CLEtBQXFCO1lBQ3ZDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUxHLHNCQUFpQixHQUE0RCxFQUFFLENBQUM7WUFPaEcsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksbUJBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRS9ELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxtQ0FBcUIsQ0FBQyxjQUFjLEVBQUUsYUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQy9FLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxtQ0FBcUIsQ0FBQyxjQUFjLEVBQUUsYUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRS9FLElBQUksQ0FBQyxFQUFFLENBQUMsc0NBQW9CLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtnQkFDM0MsTUFBTSxrQkFBa0IsR0FBRyw0QkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDNUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxzQ0FBb0IsQ0FBQyxVQUFVLENBQUM7cUJBQ3pDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSw0Q0FBdUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNFLENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQztRQUVNLGlCQUFpQjtZQUN2QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixhQUFJLENBQUMsU0FBUztnQkFDZCxhQUFJLENBQUMsU0FBUztnQkFD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
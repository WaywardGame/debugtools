var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "action/ActionExecutor", "entity/Entity", "entity/Human", "entity/IEntity", "entity/IStats", "newui/component/Component", "newui/component/RangeInput", "newui/component/RangeRow", "utilities/Objects", "../../action/AddItemToInventory", "../../action/SetStat", "../../IDebugTools", "../component/AddItemToInventory", "../component/DebugToolsPanel", "../component/InspectEntityInformationSubsection"], function (require, exports, ActionExecutor_1, Entity_1, Human_1, IEntity_1, IStats_1, Component_1, RangeInput_1, RangeRow_1, Objects_1, AddItemToInventory_1, SetStat_1, IDebugTools_1, AddItemToInventory_2, DebugToolsPanel_1, InspectEntityInformationSubsection_1) {
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
                const addItemToInventory = AddItemToInventory_2.default.init(this.api).appendTo(this.addItemContainer);
                this.until(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway)
                    .bind(addItemToInventory, AddItemToInventory_2.AddItemToInventoryEvent.Execute, this.addItem);
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
            this.human = Entity_1.default.is(entity, IEntity_1.EntityType.Creature) ? undefined : entity;
            this.toggle(!!this.human);
            this.emit("change");
            if (!this.human)
                return;
            for (const type of Objects_1.default.keys(this.reputationSliders)) {
                this.reputationSliders[type].refresh();
            }
            this.until(["Remove", "change"])
                .bind(entity, IEntity_1.EntityEvent.StatChanged, this.onStatChange);
        }
        addReputationSlider(labelTranslation, type) {
            this.reputationSliders[type] = new RangeRow_1.RangeRow(this.api)
                .setLabel(label => label.setText(IDebugTools_1.translation(labelTranslation)))
                .editRange(range => range
                .setMin(0)
                .setMax(Human_1.REPUTATION_MAX)
                .setRefreshMethod(() => this.human ? this.human.getStatValue(type) : 0))
                .setDisplayValue(true)
                .on(RangeInput_1.RangeInputEvent.Finish, this.setReputation(type))
                .appendTo(this);
        }
        setReputation(type) {
            return (_, value) => {
                if (this.human.getStatValue(type) === value)
                    return;
                ActionExecutor_1.default.get(SetStat_1.default).execute(localPlayer, this.human, type, value);
            };
        }
        addItem(_, type, quality) {
            ActionExecutor_1.default.get(AddItemToInventory_1.default).execute(localPlayer, Entity_1.default.is(this.human, IEntity_1.EntityType.Player) ? this.human : this.human.inventory, type, quality);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHVtYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9IdW1hbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFzQkEsTUFBcUIsZ0JBQWlCLFNBQVEsNENBQWtDO1FBTS9FLFlBQW1CLEtBQXFCO1lBQ3ZDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUxHLHNCQUFpQixHQUE0RCxFQUFFLENBQUM7WUFPaEcsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksbUJBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRS9ELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxtQ0FBcUIsQ0FBQyxjQUFjLEVBQUUsYUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQy9FLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxtQ0FBcUIsQ0FBQyxjQUFjLEVBQUUsYUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRS9FLElBQUksQ0FBQyxFQUFFLENBQUMsc0NBQW9CLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtnQkFDM0MsTUFBTSxrQkFBa0IsR0FBRyw0QkFBMkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDdEcsSUFBSSxDQUFDLEtBQUssQ0FBQyxzQ0FBb0IsQ0FBQyxVQUFVLENBQUM7cUJBQ3pDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSw0Q0FBdUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNFLENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQztRQUVNLGlCQUFpQjtZQUN2QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixhQUFJLENBQUMsU0FBUztnQkFDZCxhQUFJLENBQUMsU0FBUztnQkFD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
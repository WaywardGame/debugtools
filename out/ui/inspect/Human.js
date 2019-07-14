var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "entity/Entity", "entity/Human", "entity/IEntity", "entity/IStats", "event/EventManager", "newui/component/Component", "newui/component/RangeRow", "utilities/stream/Stream", "../../action/AddItemToInventory", "../../action/SetStat", "../../IDebugTools", "../component/AddItemToInventory", "../component/InspectEntityInformationSubsection"], function (require, exports, ActionExecutor_1, Entity_1, Human_1, IEntity_1, IStats_1, EventManager_1, Component_1, RangeRow_1, Stream_1, AddItemToInventory_1, SetStat_1, IDebugTools_1, AddItemToInventory_2, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HumanInformation extends InspectEntityInformationSubsection_1.default {
        constructor() {
            super();
            this.reputationSliders = {};
            this.addItemContainer = new Component_1.default().appendTo(this);
            this.addReputationSlider(IDebugTools_1.DebugToolsTranslation.LabelMalignity, IStats_1.Stat.Malignity);
            this.addReputationSlider(IDebugTools_1.DebugToolsTranslation.LabelBenignity, IStats_1.Stat.Benignity);
        }
        onSwitchTo() {
            const addItemToInventory = AddItemToInventory_2.default.init().appendTo(this.addItemContainer);
            addItemToInventory.event.until(this, "switchAway")
                .subscribe("execute", this.addItem);
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
            this.event.emit("change");
            if (!this.human)
                return;
            for (const type of Stream_1.default.keys(this.reputationSliders)) {
                this.reputationSliders[type].refresh();
            }
            entity.event.until(this, "switchAway")
                .subscribe("statChanged", this.onStatChange);
        }
        addReputationSlider(labelTranslation, type) {
            this.reputationSliders[type] = new RangeRow_1.RangeRow()
                .setLabel(label => label.setText(IDebugTools_1.translation(labelTranslation)))
                .editRange(range => range
                .setMin(0)
                .setMax(Human_1.REPUTATION_MAX)
                .setRefreshMethod(() => this.human ? this.human.getStatValue(type) : 0))
                .setDisplayValue(true)
                .event.subscribe("finish", this.setReputation(type))
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
        EventManager_1.EventHandler("self")("switchTo")
    ], HumanInformation.prototype, "onSwitchTo", null);
    __decorate([
        Override
    ], HumanInformation.prototype, "getImmutableStats", null);
    __decorate([
        Override
    ], HumanInformation.prototype, "update", null);
    __decorate([
        Bound
    ], HumanInformation.prototype, "addItem", null);
    __decorate([
        Bound
    ], HumanInformation.prototype, "onStatChange", null);
    exports.default = HumanInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHVtYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9IdW1hbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFxQkEsTUFBcUIsZ0JBQWlCLFNBQVEsNENBQWtDO1FBTS9FO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFMUSxzQkFBaUIsR0FBNEQsRUFBRSxDQUFDO1lBT2hHLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLG1CQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFdkQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLG1DQUFxQixDQUFDLGNBQWMsRUFBRSxhQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDL0UsSUFBSSxDQUFDLG1CQUFtQixDQUFDLG1DQUFxQixDQUFDLGNBQWMsRUFBRSxhQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEYsQ0FBQztRQUdTLFVBQVU7WUFDbkIsTUFBTSxrQkFBa0IsR0FBRyw0QkFBMkIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDOUYsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDO2lCQUNoRCxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBRWdCLGlCQUFpQjtZQUNqQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixhQUFJLENBQUMsU0FBUztnQkFDZCxhQUFJLENBQUMsU0FBUztnQkFDZCxhQUFJLENBQUMsTUFBTTtnQkFDWCxhQUFJLENBQUMsT0FBTztnQkFDWixhQUFJLENBQUMsVUFBVTtnQkFDZixhQUFJLENBQUMsTUFBTTthQUNYLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNSLENBQUM7UUFFZ0IsTUFBTSxDQUFD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
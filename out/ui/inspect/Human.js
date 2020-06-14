var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "entity/Human", "entity/IStats", "event/EventManager", "newui/component/Component", "newui/component/RangeRow", "../../action/AddItemToInventory", "../../action/SetStat", "../../IDebugTools", "../component/AddItemToInventory", "../component/InspectEntityInformationSubsection"], function (require, exports, ActionExecutor_1, Human_1, IStats_1, EventManager_1, Component_1, RangeRow_1, AddItemToInventory_1, SetStat_1, IDebugTools_1, AddItemToInventory_2, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let HumanInformation = (() => {
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
                addItemToInventory.event.until(this, "switchAway", "remove")
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
                this.human = entity.asHuman;
                this.toggle(!!this.human);
                this.event.emit("change");
                if (!this.human)
                    return;
                for (const type of Stream.keys(this.reputationSliders)) {
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
                    .setRefreshMethod(() => this.human ? this.human.stat.getValue(type) : 0))
                    .setDisplayValue(true)
                    .event.subscribe("finish", this.setReputation(type))
                    .appendTo(this);
            }
            setReputation(type) {
                return (_, value) => {
                    if (this.human.stat.getValue(type) === value)
                        return;
                    ActionExecutor_1.default.get(SetStat_1.default).execute(localPlayer, this.human, type, value);
                };
            }
            addItem(_, type, quality) {
                var _a;
                if (this.human)
                    ActionExecutor_1.default.get(AddItemToInventory_1.default).execute(localPlayer, (_a = this.human.asPlayer) !== null && _a !== void 0 ? _a : this.human.inventory, type, quality);
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
            EventManager_1.OwnEventHandler(HumanInformation, "switchTo")
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
        return HumanInformation;
    })();
    exports.default = HumanInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHVtYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9IdW1hbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFlQTtRQUFBLE1BQXFCLGdCQUFpQixTQUFRLDRDQUFrQztZQU0vRTtnQkFDQyxLQUFLLEVBQUUsQ0FBQztnQkFMUSxzQkFBaUIsR0FBNEQsRUFBRSxDQUFDO2dCQU9oRyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxtQkFBUyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUV2RCxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUNBQXFCLENBQUMsY0FBYyxFQUFFLGFBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDL0UsSUFBSSxDQUFDLG1CQUFtQixDQUFDLG1DQUFxQixDQUFDLGNBQWMsRUFBRSxhQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDaEYsQ0FBQztZQUdTLFVBQVU7Z0JBQ25CLE1BQU0sa0JBQWtCLEdBQUcsNEJBQTJCLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUM5RixrQkFBa0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDO3FCQUMxRCxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0QyxDQUFDO1lBRWdCLGlCQUFpQjtnQkFDakMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsYUFBSSxDQUFDLFNBQVM7b0JBQ2QsYUFBSSxDQUFDLFNBQVM7b0JBQ2QsYUFBSSxDQUFDLE1BQU07b0JBQ1gsYUFBSSxDQUFDLE9BQU87b0JBQ1osYUFBSSxDQUFDLFVBQVU7b0JBQ2YsYUFBSSxDQUFDLE1BQU07aUJBQ1gsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lB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
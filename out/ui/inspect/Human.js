var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "entity/Human", "entity/IStats", "event/EventManager", "newui/component/Component", "newui/component/RangeRow", "../../action/AddItemToInventory", "../../action/SetStat", "../../IDebugTools", "../component/AddItemToInventory", "../component/InspectEntityInformationSubsection"], function (require, exports, ActionExecutor_1, Human_1, IStats_1, EventManager_1, Component_1, RangeRow_1, AddItemToInventory_1, SetStat_1, IDebugTools_1, AddItemToInventory_2, InspectEntityInformationSubsection_1) {
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
    exports.default = HumanInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHVtYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9IdW1hbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFlQSxNQUFxQixnQkFBaUIsU0FBUSw0Q0FBa0M7UUFNL0U7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUxRLHNCQUFpQixHQUE0RCxFQUFFLENBQUM7WUFPaEcsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksbUJBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV2RCxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUNBQXFCLENBQUMsY0FBYyxFQUFFLGFBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMvRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUNBQXFCLENBQUMsY0FBYyxFQUFFLGFBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoRixDQUFDO1FBR1MsVUFBVTtZQUNuQixNQUFNLGtCQUFrQixHQUFHLDRCQUEyQixDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM5RixrQkFBa0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDO2lCQUMxRCxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBRWdCLGlCQUFpQjtZQUNqQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixhQUFJLENBQUMsU0FBUztnQkFDZCxhQUFJLENBQUMsU0FBUztnQkFDZCxhQUFJLENBQUMsTUFBTTtnQkFDWCxhQUFJLENBQUMsT0FBTztnQkFDWixhQUFJLENBQUMsVUFBVTtnQkFDZixhQUFJLENBQUMsTUFBTTthQUNYLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNSLENBQUM7UUFFZ0Is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
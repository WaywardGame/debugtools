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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHVtYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9IdW1hbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFlQSxNQUFxQixnQkFBaUIsU0FBUSw0Q0FBa0M7UUFNL0U7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUxRLHNCQUFpQixHQUE0RCxFQUFFLENBQUM7WUFPaEcsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksbUJBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV2RCxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUNBQXFCLENBQUMsY0FBYyxFQUFFLGFBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMvRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUNBQXFCLENBQUMsY0FBYyxFQUFFLGFBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoRixDQUFDO1FBR1MsVUFBVTtZQUNuQixNQUFNLGtCQUFrQixHQUFHLDRCQUEyQixDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM5RixrQkFBa0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUM7aUJBQ2hELFNBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFFZ0IsaUJBQWlCO1lBQ2pDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLGFBQUksQ0FBQyxTQUFTO2dCQUNkLGFBQUksQ0FBQyxTQUFTO2dCQUNkLGFBQUksQ0FBQyxNQUFNO2dCQUNYLGFBQUksQ0FBQyxPQUFPO2dCQUNaLGFBQUksQ0FBQyxVQUFVO2dCQUNmLGFBQUksQ0FBQyxNQUFNO2FBQ1gsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ1IsQ0FBQztRQUVnQixNQUFNLENBQUMs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
/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventManager", "game/entity/Human", "game/entity/IEntity", "game/entity/IStats", "language/Dictionary", "language/ITranslation", "language/Translation", "ui/component/CheckButton", "ui/component/Component", "ui/component/RangeRow", "utilities/Decorators", "../../IDebugTools", "../../action/SetStat", "../component/Container", "../component/InspectEntityInformationSubsection"], function (require, exports, EventManager_1, Human_1, IEntity_1, IStats_1, Dictionary_1, ITranslation_1, Translation_1, CheckButton_1, Component_1, RangeRow_1, Decorators_1, IDebugTools_1, SetStat_1, Container_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HumanInformation extends InspectEntityInformationSubsection_1.default {
        constructor() {
            super();
            this.reputationSliders = {};
            this.statusCheckButtons = {};
            this.addItemContainer = new Component_1.default().appendTo(this);
            this.addReputationSlider(IDebugTools_1.DebugToolsTranslation.LabelMalignity, IStats_1.Stat.Malignity);
            this.addReputationSlider(IDebugTools_1.DebugToolsTranslation.LabelBenignity, IStats_1.Stat.Benignity);
            for (const status of [IEntity_1.StatusType.Bleeding, IEntity_1.StatusType.Burned, IEntity_1.StatusType.Poisoned, IEntity_1.StatusType.Frostbitten]) {
                this.statusCheckButtons[status] = new CheckButton_1.CheckButton()
                    .setText(Translation_1.default.get(Dictionary_1.default.StatusEffect, status).inContext(ITranslation_1.TextContext.Title))
                    .setRefreshMethod(() => !!this.human?.hasStatus(status))
                    .event.subscribe("toggle", (_, state) => this.human?.setStatus(status, state, state ? IEntity_1.StatusEffectChangeReason.Gained : IEntity_1.StatusEffectChangeReason.Treated))
                    .appendTo(this);
            }
        }
        onSwitchTo() {
            Container_1.default.appendTo(this.addItemContainer, this, () => this.human?.inventory);
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
            for (const slider of Object.values(this.reputationSliders)) {
                slider.refresh();
            }
            for (const checkButton of Object.values(this.statusCheckButtons)) {
                checkButton.refresh();
            }
            const entityEvents = entity?.asEntityWithStats?.event.until(this, "switchAway");
            entityEvents?.subscribe("statChanged", this.onStatChange);
            entityEvents?.subscribe("statusChange", this.onStatusChange);
        }
        addReputationSlider(labelTranslation, type) {
            this.reputationSliders[type] = new RangeRow_1.RangeRow()
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(labelTranslation)))
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
                SetStat_1.default.execute(localPlayer, this.human, type, value);
            };
        }
        onStatChange(_, stat) {
            switch (stat.type) {
                case IStats_1.Stat.Malignity:
                case IStats_1.Stat.Benignity:
                    this.reputationSliders[stat.type].refresh();
                    break;
            }
        }
        onStatusChange(_, status) {
            this.statusCheckButtons[status]?.refresh();
        }
    }
    exports.default = HumanInformation;
    __decorate([
        (0, EventManager_1.OwnEventHandler)(HumanInformation, "switchTo")
    ], HumanInformation.prototype, "onSwitchTo", null);
    __decorate([
        Decorators_1.Bound
    ], HumanInformation.prototype, "onStatChange", null);
    __decorate([
        Decorators_1.Bound
    ], HumanInformation.prototype, "onStatusChange", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHVtYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9IdW1hbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUFtQkgsTUFBcUIsZ0JBQWlCLFNBQVEsNENBQWtDO1FBTy9FO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFOUSxzQkFBaUIsR0FBNEQsRUFBRSxDQUFDO1lBQ2hGLHVCQUFrQixHQUEyQyxFQUFFLENBQUM7WUFPaEYsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksbUJBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV2RCxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUNBQXFCLENBQUMsY0FBYyxFQUFFLGFBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMvRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUNBQXFCLENBQUMsY0FBYyxFQUFFLGFBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUUvRSxLQUFLLE1BQU0sTUFBTSxJQUFJLENBQUMsb0JBQVUsQ0FBQyxRQUFRLEVBQUUsb0JBQVUsQ0FBQyxNQUFNLEVBQUUsb0JBQVUsQ0FBQyxRQUFRLEVBQUUsb0JBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDM0csSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUkseUJBQVcsRUFBRTtxQkFDakQsT0FBTyxDQUFDLHFCQUFXLENBQUMsR0FBRyxDQUFDLG9CQUFVLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUN0RixnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBQ3ZELEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENB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
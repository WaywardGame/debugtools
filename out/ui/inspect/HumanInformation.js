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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHVtYW5JbmZvcm1hdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L0h1bWFuSW5mb3JtYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7Ozs7Ozs7O0lBbUJILE1BQXFCLGdCQUFpQixTQUFRLDRDQUFrQztRQU8vRTtZQUNDLEtBQUssRUFBRSxDQUFDO1lBTlEsc0JBQWlCLEdBQTRELEVBQUUsQ0FBQztZQUNoRix1QkFBa0IsR0FBMkMsRUFBRSxDQUFDO1lBT2hGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLG1CQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFdkQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLG1DQUFxQixDQUFDLGNBQWMsRUFBRSxhQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDL0UsSUFBSSxDQUFDLG1CQUFtQixDQUFDLG1DQUFxQixDQUFDLGNBQWMsRUFBRSxhQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFL0UsS0FBSyxNQUFNLE1BQU0sSUFBSSxDQUFDLG9CQUFVLENBQUMsUUFBUSxFQUFFLG9CQUFVLENBQUMsTUFBTSxFQUFFLG9CQUFVLENBQUMsUUFBUSxFQUFFLG9CQUFVLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQzNHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLHlCQUFXLEVBQUU7cUJBQ2pELE9BQU8sQ0FBQyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxvQkFBVSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsMEJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDdEYsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUN2RCxLQUFLLENBQUMs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
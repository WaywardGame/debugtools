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
define(["require", "exports", "@wayward/game/game/deity/Deity", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/IStats", "@wayward/game/language/Dictionary", "@wayward/game/language/ITranslation", "@wayward/game/language/Translation", "@wayward/game/ui/component/CheckButton", "@wayward/game/ui/component/Component", "@wayward/game/ui/component/RangeRow", "@wayward/utilities/Decorators", "@wayward/utilities/event/EventManager", "../../IDebugTools", "../../action/SetAlignment", "../component/Container", "../component/InspectEntityInformationSubsection"], function (require, exports, Deity_1, IEntity_1, IStats_1, Dictionary_1, ITranslation_1, Translation_1, CheckButton_1, Component_1, RangeRow_1, Decorators_1, EventManager_1, IDebugTools_1, SetAlignment_1, Container_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HumanInformation extends InspectEntityInformationSubsection_1.default {
        constructor() {
            super();
            this.alignmentSliders = {};
            this.statusCheckButtons = {};
            this.addItemContainer = new Component_1.default().appendTo(this);
            this.addAlignmentSlider(IDebugTools_1.DebugToolsTranslation.LabelEvilAlignment, Deity_1.Deity.Evil);
            this.addAlignmentSlider(IDebugTools_1.DebugToolsTranslation.LabelGoodAlignment, Deity_1.Deity.Good);
            for (const status of [IEntity_1.StatusType.Bleeding, IEntity_1.StatusType.Burned, IEntity_1.StatusType.Poisoned, IEntity_1.StatusType.Frostbitten]) {
                this.statusCheckButtons[status] = new CheckButton_1.CheckButton()
                    .setText(Translation_1.default.get(Dictionary_1.default.StatusEffect, status).inContext(ITranslation_1.TextContext.Title))
                    .setRefreshMethod(() => !!this.human?.hasStatus(status))
                    .event.subscribe("toggle", (_, state) => this.human?.setStatus(status, state, state ? IEntity_1.StatusEffectChangeReason.Gained : IEntity_1.StatusEffectChangeReason.Treated))
                    .appendTo(this);
            }
        }
        onSwitchTo() {
            Container_1.default.appendTo(this.addItemContainer, this, () => this.human);
        }
        getImmutableStats() {
            return this.human ? [
                IStats_1.Stat.Attack,
                IStats_1.Stat.Defense,
                IStats_1.Stat.Ferocity,
                IStats_1.Stat.Weight,
                IStats_1.Stat.InsulationHeat,
                IStats_1.Stat.InsulationCold,
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
            for (const slider of Object.values(this.alignmentSliders)) {
                slider.refresh();
            }
            for (const checkButton of Object.values(this.statusCheckButtons)) {
                checkButton.refresh();
            }
            const entityEvents = entity?.asHuman?.event.until(this, "switchAway");
            entityEvents?.subscribe("alignmentChange", this.onAlignmentChange);
            entityEvents?.subscribe("statusChange", this.onStatusChange);
        }
        addAlignmentSlider(labelTranslation, type) {
            this.alignmentSliders[type] = new RangeRow_1.RangeRow()
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(labelTranslation)))
                .editRange(range => range
                .setMin(0)
                .setMax(game.getGameOptions().player.alignment[type === Deity_1.Deity.Good ? "goodCap" : "evilCap"])
                .setRefreshMethod(() => this.human ? this.human.alignment[type === Deity_1.Deity.Good ? "good" : "evil"] : 0))
                .setDisplayValue(true)
                .event.subscribe("finish", this.setAlignment(type))
                .appendTo(this);
        }
        setAlignment(type) {
            return (_, value) => {
                if (this.human.alignment[type === Deity_1.Deity.Good ? "good" : "evil"] === value)
                    return;
                SetAlignment_1.default.execute(localPlayer, this.human, type, value);
            };
        }
        onAlignmentChange(_, deity) {
            switch (deity) {
                case Deity_1.Deity.Evil:
                case Deity_1.Deity.Good:
                    this.alignmentSliders[deity].refresh();
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
    ], HumanInformation.prototype, "onAlignmentChange", null);
    __decorate([
        Decorators_1.Bound
    ], HumanInformation.prototype, "onStatusChange", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHVtYW5JbmZvcm1hdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L0h1bWFuSW5mb3JtYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7Ozs7Ozs7O0lBb0JILE1BQXFCLGdCQUFpQixTQUFRLDRDQUFrQztRQU8vRTtZQUNDLEtBQUssRUFBRSxDQUFDO1lBTlEscUJBQWdCLEdBQW9ELEVBQUUsQ0FBQztZQUN2RSx1QkFBa0IsR0FBMkMsRUFBRSxDQUFDO1lBT2hGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLG1CQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFdkQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLG1DQUFxQixDQUFDLGtCQUFrQixFQUFFLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5RSxJQUFJLENBQUMsa0JBQWtCLENBQUMsbUNBQXFCLENBQUMsa0JBQWtCLEVBQUUsYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTlFLEtBQUssTUFBTSxNQUFNLElBQUksQ0FBQyxvQkFBVSxDQUFDLFFBQVEsRUFBRSxvQkFBVSxDQUFDLE1BQU0sRUFBRSxvQkFBVSxDQUFDLFFBQVEsRUFBRSxvQkFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7Z0JBQzVHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLHlCQUFXLEVBQUU7cUJBQ2pELE9BQU8sQ0FBQyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxvQkFBVSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsMEJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDdEYsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUN2RCxL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
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
            this.addItemContainer.dump();
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
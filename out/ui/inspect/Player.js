var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IEntity", "Enums", "language/ILanguage", "language/Translation", "newui/component/BlockRow", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/IComponent", "newui/component/LabelledRow", "newui/component/RangeInput", "newui/component/RangeRow", "newui/component/Text", "utilities/Arrays", "utilities/Collectors", "utilities/enum/Enums", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools", "../component/InspectEntityInformationSubsection"], function (require, exports, IEntity_1, Enums_1, ILanguage_1, Translation_1, BlockRow_1, CheckButton_1, Dropdown_1, IComponent_1, LabelledRow_1, RangeInput_1, RangeRow_1, Text_1, Arrays_1, Collectors_1, Enums_2, Objects_1, Actions_1, DebugTools_1, IDebugTools_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PlayerInformation extends InspectEntityInformationSubsection_1.default {
        constructor(api) {
            super(api);
            this.until(IComponent_1.ComponentEvent.Remove)
                .bind(DebugTools_1.default.INSTANCE, DebugTools_1.DebugToolsEvent.PlayerDataChange, this.onPlayerDataChange);
            new BlockRow_1.BlockRow(api)
                .append(this.checkButtonNoClip = new CheckButton_1.CheckButton(api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleNoClip))
                .setRefreshMethod(() => this.player ? !!DebugTools_1.default.INSTANCE.getPlayerData(this.player, "noclip") : false)
                .on(CheckButton_1.CheckButtonEvent.Change, this.toggleNoClip))
                .append(this.checkButtonInvulnerable = new CheckButton_1.CheckButton(api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleInvulnerable))
                .setRefreshMethod(() => this.player ? DebugTools_1.default.INSTANCE.getPlayerData(this.player, "invulnerable") : false)
                .on(CheckButton_1.CheckButtonEvent.Change, this.toggleInvulnerable))
                .appendTo(this);
            this.rangeWeightBonus = new RangeRow_1.RangeRow(api)
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelWeightBonus)))
                .editRange(range => range
                .setMin(0)
                .setMax(1000)
                .setRefreshMethod(() => this.player ? DebugTools_1.default.INSTANCE.getPlayerData(this.player, "weightBonus") : 0))
                .setDisplayValue(true)
                .on(RangeInput_1.RangeInputEvent.Finish, this.setWeightBonus)
                .appendTo(this);
            new LabelledRow_1.LabelledRow(api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelSkill)))
                .append(new Dropdown_1.default(api)
                .setRefreshMethod(() => ({
                defaultOption: "none",
                options: [
                    ["none", option => option.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.None))],
                ].values().include(Enums_2.default.values(Enums_1.SkillType)
                    .map(skill => Arrays_1.tuple(Enums_1.SkillType[skill], Translation_1.default.generator(Enums_1.SkillType[skill])))
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t)))),
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeSkill))
                .appendTo(this);
            this.skillRangeRow = new RangeRow_1.RangeRow(api)
                .hide()
                .setLabel(label => label.setText(Translation_1.default.generator(() => this.skill === undefined ? "" : Enums_1.SkillType[this.skill])))
                .editRange(range => range
                .setMin(0)
                .setMax(100)
                .setRefreshMethod(() => this.skill !== undefined && this.player && this.skill in this.player.skills ? this.player.skills[this.skill].core : 0))
                .setDisplayValue(Translation_1.default.ui(ILanguage_1.UiTranslation.GameStatsPercentage).get)
                .on(RangeInput_1.RangeInputEvent.Finish, this.setSkill)
                .appendTo(this);
        }
        update(entity) {
            if (this.player === entity)
                return;
            this.player = entity.entityType === IEntity_1.EntityType.Player ? entity : undefined;
            this.toggle(!!this.player);
            if (!this.player)
                return;
            this.triggerSync("change");
            this.refresh();
            this.until([IComponent_1.ComponentEvent.Remove, "change"])
                .bind(DebugTools_1.default.INSTANCE, DebugTools_1.DebugToolsEvent.PlayerDataChange, this.refresh);
        }
        refresh() {
            this.checkButtonNoClip.refresh();
            this.checkButtonInvulnerable.refresh();
            this.rangeWeightBonus.refresh();
        }
        changeSkill(_, skillName) {
            this.skill = skillName === "none" ? undefined : Enums_1.SkillType[skillName];
            this.skillRangeRow.refresh();
            this.skillRangeRow.toggle(skillName !== "none");
        }
        setSkill(_, value) {
            Actions_1.default.get("setSkill").execute({ player: this.player, object: [this.skill, value] });
        }
        toggleInvulnerable(_, invulnerable) {
            if (DebugTools_1.default.INSTANCE.getPlayerData(this.player, "invulnerable") === invulnerable)
                return;
            Actions_1.default.get("toggleInvulnerable").execute({ player: this.player, object: invulnerable });
        }
        toggleNoClip(_, noclip) {
            if (DebugTools_1.default.INSTANCE.getPlayerData(this.player, "noclip") === noclip)
                return;
            Actions_1.default.get("toggleNoclip").execute({ player: this.player, object: noclip });
        }
        setWeightBonus(_, weightBonus) {
            if (DebugTools_1.default.INSTANCE.getPlayerData(this.player, "weightBonus") === weightBonus)
                return;
            Actions_1.default.get("setWeightBonus").execute({ player: this.player, object: weightBonus });
        }
        onPlayerDataChange(_, playerId, key, value) {
            if (!this.player || playerId !== this.player.id)
                return;
            switch (key) {
                case "weightBonus":
                    this.rangeWeightBonus.refresh();
                    break;
                case "invulnerable":
                    this.checkButtonInvulnerable.refresh();
                    break;
                case "noclip":
                    this.checkButtonNoClip.refresh();
                    this.checkButtonInvulnerable.setDisabled(this.checkButtonNoClip.checked);
                    if (this.checkButtonNoClip.checked)
                        this.checkButtonInvulnerable.setChecked(false);
                    break;
            }
        }
    }
    __decorate([
        Objects_1.Bound
    ], PlayerInformation.prototype, "refresh", null);
    __decorate([
        Objects_1.Bound
    ], PlayerInformation.prototype, "changeSkill", null);
    __decorate([
        Objects_1.Bound
    ], PlayerInformation.prototype, "setSkill", null);
    __decorate([
        Objects_1.Bound
    ], PlayerInformation.prototype, "toggleInvulnerable", null);
    __decorate([
        Objects_1.Bound
    ], PlayerInformation.prototype, "toggleNoClip", null);
    __decorate([
        Objects_1.Bound
    ], PlayerInformation.prototype, "setWeightBonus", null);
    __decorate([
        Objects_1.Bound
    ], PlayerInformation.prototype, "onPlayerDataChange", null);
    exports.default = PlayerInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvUGxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTBCQSxNQUFxQixpQkFBa0IsU0FBUSw0Q0FBa0M7UUFVaEYsWUFBbUIsR0FBVTtZQUM1QixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFWCxJQUFJLENBQUMsS0FBSyxDQUFDLDJCQUFjLENBQUMsTUFBTSxDQUFDO2lCQUMvQixJQUFJLENBQUMsb0JBQVUsQ0FBQyxRQUFRLEVBQUUsNEJBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUV2RixJQUFJLG1CQUFRLENBQUMsR0FBRyxDQUFDO2lCQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSx5QkFBVyxDQUFDLEdBQUcsQ0FBQztpQkFDbkQsT0FBTyxDQUFDLHdCQUFXLENBQUMsbUNBQXFCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztpQkFDOUQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7aUJBQ3hHLEVBQUUsQ0FBQyw4QkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUkseUJBQVcsQ0FBQyxHQUFHLENBQUM7aUJBQ3pELE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLHdCQUF3QixDQUFDLENBQUM7aUJBQ3BFLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxD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
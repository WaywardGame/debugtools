var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "action/ActionExecutor", "entity/Entity", "entity/IEntity", "entity/IStats", "Enums", "language/dictionary/UiTranslation", "language/Translation", "mod/Mod", "newui/component/BlockRow", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/IComponent", "newui/component/LabelledRow", "newui/component/RangeInput", "newui/component/RangeRow", "newui/component/Text", "player/IPlayer", "utilities/Arrays", "utilities/enum/Enums", "utilities/iterable/Collectors", "utilities/Objects", "../../action/SetSkill", "../../action/SetWeightBonus", "../../action/ToggleInvulnerable", "../../action/ToggleNoClip", "../../action/TogglePermissions", "../../DebugTools", "../../IDebugTools", "../component/InspectEntityInformationSubsection"], function (require, exports, ActionExecutor_1, Entity_1, IEntity_1, IStats_1, Enums_1, UiTranslation_1, Translation_1, Mod_1, BlockRow_1, CheckButton_1, Dropdown_1, IComponent_1, LabelledRow_1, RangeInput_1, RangeRow_1, Text_1, IPlayer_1, Arrays_1, Enums_2, Collectors_1, Objects_1, SetSkill_1, SetWeightBonus_1, ToggleInvulnerable_1, ToggleNoClip_1, TogglePermissions_1, DebugTools_1, IDebugTools_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PlayerInformation extends InspectEntityInformationSubsection_1.default {
        constructor(gsapi) {
            super(gsapi);
            this.until(IComponent_1.ComponentEvent.Remove)
                .bind(this.DEBUG_TOOLS, DebugTools_1.DebugToolsEvent.PlayerDataChange, this.onPlayerDataChange);
            this.checkButtonPermissions = new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonTogglePermissions))
                .setRefreshMethod(() => this.player ? !!this.DEBUG_TOOLS.getPlayerData(this.player, "permissions") : false)
                .on(CheckButton_1.CheckButtonEvent.Change, this.togglePermissions)
                .appendTo(this);
            new BlockRow_1.BlockRow(this.api)
                .append(this.checkButtonNoClip = new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleNoClip))
                .setRefreshMethod(() => this.player ? !!this.DEBUG_TOOLS.getPlayerData(this.player, "noclip") : false)
                .on(CheckButton_1.CheckButtonEvent.Change, this.toggleNoClip))
                .append(this.checkButtonInvulnerable = new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleInvulnerable))
                .setRefreshMethod(() => this.player ? this.DEBUG_TOOLS.getPlayerData(this.player, "invulnerable") : false)
                .on(CheckButton_1.CheckButtonEvent.Change, this.toggleInvulnerable))
                .appendTo(this);
            this.rangeWeightBonus = new RangeRow_1.RangeRow(this.api)
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelWeightBonus)))
                .editRange(range => range
                .setMin(0)
                .setMax(1000)
                .setRefreshMethod(() => this.player ? this.player.getStat(IStats_1.Stat.Strength).bonus : IPlayer_1.STRENGTH_BONUS))
                .setDisplayValue(true)
                .on(RangeInput_1.RangeInputEvent.Finish, this.setWeightBonus)
                .appendTo(this);
            new LabelledRow_1.LabelledRow(this.api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelSkill)))
                .append(new Dropdown_1.default(this.api)
                .setRefreshMethod(() => ({
                defaultOption: "none",
                options: [
                    ["none", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.None))],
                ].values().include(Enums_2.default.values(Enums_1.SkillType)
                    .map(skill => Arrays_1.tuple(Enums_1.SkillType[skill], Translation_1.default.generator(Enums_1.SkillType[skill])))
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t)))),
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeSkill))
                .appendTo(this);
            this.skillRangeRow = new RangeRow_1.RangeRow(this.api)
                .hide()
                .setLabel(label => label.setText(Translation_1.default.generator(() => this.skill === undefined ? "" : Enums_1.SkillType[this.skill])))
                .editRange(range => range
                .setMin(0)
                .setMax(100)
                .setRefreshMethod(() => this.skill !== undefined && this.player && this.skill in this.player.skills ? this.player.skills[this.skill].core : 0))
                .setDisplayValue(Translation_1.default.ui(UiTranslation_1.default.GameStatsPercentage).get)
                .on(RangeInput_1.RangeInputEvent.Finish, this.setSkill)
                .appendTo(this);
        }
        update(entity) {
            if (this.player === entity)
                return;
            this.player = Entity_1.default.is(entity, IEntity_1.EntityType.Player) ? entity : undefined;
            this.toggle(!!this.player);
            if (!this.player)
                return;
            this.emit("change");
            this.refresh();
            this.until([IComponent_1.ComponentEvent.Remove, "change"])
                .bind(this.DEBUG_TOOLS, DebugTools_1.DebugToolsEvent.PlayerDataChange, this.refresh);
        }
        refresh() {
            if (this.checkButtonPermissions) {
                this.checkButtonPermissions.toggle(multiplayer.isServer() && this.player && !this.player.isLocalPlayer())
                    .refresh();
            }
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
            ActionExecutor_1.default.get(SetSkill_1.default).execute(localPlayer, this.player, this.skill, value);
        }
        toggleInvulnerable(_, invulnerable) {
            if (this.DEBUG_TOOLS.getPlayerData(this.player, "invulnerable") === invulnerable)
                return;
            ActionExecutor_1.default.get(ToggleInvulnerable_1.default).execute(localPlayer, this.player, invulnerable);
        }
        toggleNoClip(_, noclip) {
            if (this.DEBUG_TOOLS.getPlayerData(this.player, "noclip") === noclip)
                return;
            ActionExecutor_1.default.get(ToggleNoClip_1.default).execute(localPlayer, this.player, noclip);
        }
        togglePermissions(_, permissions) {
            if (this.DEBUG_TOOLS.getPlayerData(this.player, "permissions") === permissions)
                return;
            ActionExecutor_1.default.get(TogglePermissions_1.default).execute(localPlayer, this.player, permissions);
        }
        setWeightBonus(_, weightBonus) {
            if (this.player.getStat(IStats_1.Stat.Strength).bonus === weightBonus)
                return;
            ActionExecutor_1.default.get(SetWeightBonus_1.default).execute(localPlayer, this.player, weightBonus);
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
                case "permissions":
                    if (this.checkButtonPermissions)
                        this.checkButtonPermissions.refresh();
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
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], PlayerInformation.prototype, "DEBUG_TOOLS", void 0);
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
    ], PlayerInformation.prototype, "togglePermissions", null);
    __decorate([
        Objects_1.Bound
    ], PlayerInformation.prototype, "setWeightBonus", null);
    __decorate([
        Objects_1.Bound
    ], PlayerInformation.prototype, "onPlayerDataChange", null);
    exports.default = PlayerInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvUGxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWtDQSxNQUFxQixpQkFBa0IsU0FBUSw0Q0FBa0M7UUFjaEYsWUFBbUIsS0FBcUI7WUFDdkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWIsSUFBSSxDQUFDLEtBQUssQ0FBQywyQkFBYyxDQUFDLE1BQU0sQ0FBQztpQkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsNEJBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUVwRixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSx5QkFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3JELE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLHVCQUF1QixDQUFDLENBQUM7aUJBQ25FLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7aUJBQzFHLEVBQUUsQ0FBQyw4QkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDO2lCQUNuRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSx5QkFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3hELE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUM7aUJBQzlELGdCQUFn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
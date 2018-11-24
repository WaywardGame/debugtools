var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "action/ActionExecutor", "entity/IEntity", "Enums", "language/dictionary/UiTranslation", "language/Translation", "mod/Mod", "newui/component/BlockRow", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/IComponent", "newui/component/LabelledRow", "newui/component/RangeInput", "newui/component/RangeRow", "newui/component/Text", "utilities/Arrays", "utilities/enum/Enums", "utilities/iterable/Collectors", "utilities/Objects", "../../action/SetSkill", "../../action/SetWeightBonus", "../../action/ToggleInvulnerable", "../../action/ToggleNoClip", "../../action/TogglePermissions", "../../DebugTools", "../../IDebugTools", "../component/InspectEntityInformationSubsection"], function (require, exports, ActionExecutor_1, IEntity_1, Enums_1, UiTranslation_1, Translation_1, Mod_1, BlockRow_1, CheckButton_1, Dropdown_1, IComponent_1, LabelledRow_1, RangeInput_1, RangeRow_1, Text_1, Arrays_1, Enums_2, Collectors_1, Objects_1, SetSkill_1, SetWeightBonus_1, ToggleInvulnerable_1, ToggleNoClip_1, TogglePermissions_1, DebugTools_1, IDebugTools_1, InspectEntityInformationSubsection_1) {
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
                .setRefreshMethod(() => this.player ? this.DEBUG_TOOLS.getPlayerData(this.player, "weightBonus") : 0))
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
            this.player = entity.entityType === IEntity_1.EntityType.Player ? entity : undefined;
            this.toggle(!!this.player);
            if (!this.player)
                return;
            this.trigger("change");
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
            if (this.DEBUG_TOOLS.getPlayerData(this.player, "weightBonus") === weightBonus)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvUGxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWdDQSxNQUFxQixpQkFBa0IsU0FBUSw0Q0FBa0M7UUFjaEYsWUFBbUIsS0FBcUI7WUFDdkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWIsSUFBSSxDQUFDLEtBQUssQ0FBQywyQkFBYyxDQUFDLE1BQU0sQ0FBQztpQkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsNEJBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUVwRixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSx5QkFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3JELE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLHVCQUF1QixDQUFDLENBQUM7aUJBQ25FLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7aUJBQzFHLEVBQUUsQ0FBQyw4QkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDO2lCQUNuRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSx5QkFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3hELE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUM7aUJBQzlELGdCQUFn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
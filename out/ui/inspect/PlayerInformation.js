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
define(["require", "exports", "language/ITranslation", "language/Translation", "mod/Mod", "ui/component/BlockRow", "ui/component/CheckButton", "ui/component/LabelledRow", "ui/component/RangeRow", "ui/component/dropdown/SkillDropdown", "utilities/Decorators", "../../IDebugTools", "../../action/SetSkill", "../../action/SetWeightBonus", "../../action/ToggleInvulnerable", "../../action/ToggleNoClip", "../../action/TogglePermissions", "../component/InspectEntityInformationSubsection"], function (require, exports, ITranslation_1, Translation_1, Mod_1, BlockRow_1, CheckButton_1, LabelledRow_1, RangeRow_1, SkillDropdown_1, Decorators_1, IDebugTools_1, SetSkill_1, SetWeightBonus_1, ToggleInvulnerable_1, ToggleNoClip_1, TogglePermissions_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PlayerInformation extends InspectEntityInformationSubsection_1.default {
        constructor() {
            super();
            this.skill = "none";
            this.DEBUG_TOOLS.event.until(this, "remove")
                .subscribe("playerDataChange", this.onPlayerDataChange);
            this.checkButtonPermissions = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonTogglePermissions))
                .setRefreshMethod(() => this.player ? !!this.DEBUG_TOOLS.getPlayerData(this.player, "permissions") : false)
                .event.subscribe("toggle", this.togglePermissions)
                .appendTo(this);
            new BlockRow_1.BlockRow()
                .append(this.checkButtonNoClip = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonToggleNoClip))
                .setRefreshMethod(() => this.player?.isFlying ?? false)
                .event.subscribe("toggle", this.toggleNoClip))
                .append(this.checkButtonInvulnerable = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonToggleInvulnerable))
                .setRefreshMethod(() => this.player ? this.DEBUG_TOOLS.getPlayerData(this.player, "invulnerable") === true : false)
                .event.subscribe("toggle", this.toggleInvulnerable))
                .appendTo(this);
            this.rangeWeightBonus = new RangeRow_1.RangeRow()
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelWeightBonus)))
                .editRange(range => range
                .setMin(0)
                .setMax(10000)
                .setRefreshMethod(() => this.player ? this.DEBUG_TOOLS.getPlayerData(this.player, "weightBonus") : 0))
                .setDisplayValue(true)
                .event.subscribe("finish", this.setWeightBonus)
                .appendTo(this);
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelSkill)))
                .append(new SkillDropdown_1.default("none", [
                ["none", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.None))],
                ["all", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.MethodAll))],
            ])
                .event.subscribe("selection", this.changeSkill))
                .appendTo(this);
            this.skillRangeRow = new RangeRow_1.RangeRow()
                .hide()
                .setLabel(label => label.setText(() => this.skill === undefined ? undefined
                : this.skill === "all" ? (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.MethodAll)
                    : Translation_1.default.skill(this.skill).inContext(ITranslation_1.TextContext.Title)))
                .setInheritTextTooltip()
                .editRange(range => range
                .setMin(0)
                .setMax(200)
                .setRefreshMethod(() => typeof (this.skill) === "number" ? (this.player?.skill.getCore(this.skill) ?? 0) : 0))
                .setDisplayValue((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.StatsPercentage).get)
                .event.subscribe("finish", this.setSkill)
                .appendTo(this);
        }
        update(entity) {
            if (this.player === entity)
                return;
            this.player = entity.asPlayer;
            this.toggle(!!this.player);
            if (!this.player)
                return;
            this.event.emit("change");
            this.refresh();
            this.DEBUG_TOOLS.event.until(this, "remove", "change")
                .subscribe("playerDataChange", this.refresh);
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
        changeSkill(_, skill) {
            this.skill = skill;
            this.skillRangeRow.refresh();
            this.skillRangeRow.toggle(skill !== "none");
        }
        setSkill(_, value) {
            SetSkill_1.default.execute(localPlayer, this.player, typeof this.skill === "string" ? -1 : this.skill, value);
        }
        toggleInvulnerable(_, invulnerable) {
            if (this.DEBUG_TOOLS.getPlayerData(this.player, "invulnerable") === invulnerable)
                return;
            ToggleInvulnerable_1.default.execute(localPlayer, this.player, invulnerable);
        }
        toggleNoClip(_, noclip) {
            if (this.player?.isFlying === noclip)
                return;
            ToggleNoClip_1.default.execute(localPlayer, this.player);
        }
        togglePermissions(_, permissions) {
            if (this.DEBUG_TOOLS.getPlayerData(this.player, "permissions") === permissions)
                return;
            TogglePermissions_1.default.execute(localPlayer, this.player, permissions);
        }
        setWeightBonus(_, weightBonus) {
            if (this.DEBUG_TOOLS.getPlayerData(this.player, "weightBonus") === weightBonus)
                return;
            SetWeightBonus_1.default.execute(localPlayer, this.player, weightBonus);
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
            }
        }
    }
    exports.default = PlayerInformation;
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], PlayerInformation.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        Decorators_1.Bound
    ], PlayerInformation.prototype, "refresh", null);
    __decorate([
        Decorators_1.Bound
    ], PlayerInformation.prototype, "changeSkill", null);
    __decorate([
        Decorators_1.Bound
    ], PlayerInformation.prototype, "setSkill", null);
    __decorate([
        Decorators_1.Bound
    ], PlayerInformation.prototype, "toggleInvulnerable", null);
    __decorate([
        Decorators_1.Bound
    ], PlayerInformation.prototype, "toggleNoClip", null);
    __decorate([
        Decorators_1.Bound
    ], PlayerInformation.prototype, "togglePermissions", null);
    __decorate([
        Decorators_1.Bound
    ], PlayerInformation.prototype, "setWeightBonus", null);
    __decorate([
        Decorators_1.Bound
    ], PlayerInformation.prototype, "onPlayerDataChange", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVySW5mb3JtYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9QbGF5ZXJJbmZvcm1hdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUF3QkgsTUFBcUIsaUJBQWtCLFNBQVEsNENBQWtDO1FBY2hGO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFKRCxVQUFLLEdBQStCLE1BQU0sQ0FBQztZQU1sRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQztpQkFDMUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBRXpELElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLHlCQUFXLEVBQUU7aUJBQzdDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsdUJBQXVCLENBQUMsQ0FBQztpQkFDbkUsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztpQkFDMUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDO2lCQUNqRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxtQkFBUSxFQUFFO2lCQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSx5QkFBVyxFQUFFO2lCQUNoRCxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUM7aUJBQzlELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFD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
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
define(["require", "exports", "language/ITranslation", "language/Translation", "mod/Mod", "ui/component/BlockRow", "ui/component/Button", "ui/component/CheckButton", "ui/component/Dropdown", "ui/component/LabelledRow", "ui/component/RangeRow", "ui/component/dropdown/SkillDropdown", "utilities/Decorators", "../../IDebugTools", "../../action/ReplacePlayerData", "../../action/SetSkill", "../../action/SetWeightBonus", "../../action/ToggleInvulnerable", "../../action/ToggleNoClip", "../../action/TogglePermissions", "../component/InspectEntityInformationSubsection"], function (require, exports, ITranslation_1, Translation_1, Mod_1, BlockRow_1, Button_1, CheckButton_1, Dropdown_1, LabelledRow_1, RangeRow_1, SkillDropdown_1, Decorators_1, IDebugTools_1, ReplacePlayerData_1, SetSkill_1, SetWeightBonus_1, ToggleInvulnerable_1, ToggleNoClip_1, TogglePermissions_1, InspectEntityInformationSubsection_1) {
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
            const replaceDataRow = new LabelledRow_1.LabelledRow()
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelReplaceData)))
                .appendTo(this);
            this.buttonExecuteDataReplace = new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonReplace).addArgs(() => this.player?.getName()))
                .event.subscribe("activate", this.replaceData);
            replaceDataRow.append(this.playerToReplaceDataWithDropdown = new Dropdown_1.default()
                .setRefreshMethod(() => {
                const playerOptions = game.playerManager.getAll(true, true, false, true)
                    .filter(player => player !== this.player)
                    .map((player) => [player.identifier, option => option.setText(player.getName())]);
                replaceDataRow.toggle(!!playerOptions.length);
                return {
                    defaultOption: "",
                    options: [
                        ["", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.None))],
                        ...playerOptions,
                    ],
                };
            })
                .event.subscribe("selection", (_, selection) => this.buttonExecuteDataReplace.toggle(!!selection)))
                .append(this.buttonExecuteDataReplace);
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
            this.playerToReplaceDataWithDropdown?.refresh();
            this.buttonExecuteDataReplace.refreshText();
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
        replaceData() {
            const playerId = this.playerToReplaceDataWithDropdown?.selection;
            const replaceFrom = playerId && game.playerManager.getByIdentifier(playerId, true);
            if (!playerId || !this.player || !replaceFrom) {
                return;
            }
            ReplacePlayerData_1.default.execute(localPlayer, this.player, replaceFrom);
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
    __decorate([
        Decorators_1.Bound
    ], PlayerInformation.prototype, "replaceData", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVySW5mb3JtYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9QbGF5ZXJJbmZvcm1hdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUEyQkgsTUFBcUIsaUJBQWtCLFNBQVEsNENBQWtDO1FBZ0JoRjtZQUNDLEtBQUssRUFBRSxDQUFDO1lBSkQsVUFBSyxHQUErQixNQUFNLENBQUM7WUFNbEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7aUJBQzFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUV6RCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSx5QkFBVyxFQUFFO2lCQUM3QyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLHVCQUF1QixDQUFDLENBQUM7aUJBQ25FLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7aUJBQzFHLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztpQkFDakQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksbUJBQVEsRUFBRTtpQkFDWixNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDaEQsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2lCQUM5RCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FB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
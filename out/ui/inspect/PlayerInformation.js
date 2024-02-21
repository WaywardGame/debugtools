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
define(["require", "exports", "@wayward/game/language/ITranslation", "@wayward/game/language/Translation", "@wayward/game/mod/Mod", "@wayward/game/ui/component/BlockRow", "@wayward/game/ui/component/Button", "@wayward/game/ui/component/CheckButton", "@wayward/game/ui/component/Dropdown", "@wayward/game/ui/component/LabelledRow", "@wayward/game/ui/component/RangeRow", "@wayward/game/ui/component/dropdown/SkillDropdown", "@wayward/utilities/Decorators", "../../IDebugTools", "../../action/ClearNotes", "../../action/ReplacePlayerData", "../../action/SetSkill", "../../action/ToggleNoClip", "../component/InspectEntityInformationSubsection", "../../action/SetPlayerData", "@wayward/game/renderer/IRenderer"], function (require, exports, ITranslation_1, Translation_1, Mod_1, BlockRow_1, Button_1, CheckButton_1, Dropdown_1, LabelledRow_1, RangeRow_1, SkillDropdown_1, Decorators_1, IDebugTools_1, ClearNotes_1, ReplacePlayerData_1, SetSkill_1, ToggleNoClip_1, InspectEntityInformationSubsection_1, SetPlayerData_1, IRenderer_1) {
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
                .append(this.checkButtonUnkillable = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonToggleUnkillable))
                .setRefreshMethod(() => this.player ? this.DEBUG_TOOLS.getPlayerData(this.player, "unkillable") === true : false)
                .event.subscribe("toggle", this.toggleUnkillable))
                .append(this.checkButtonNoRender = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonToggleNoRender))
                .setRefreshMethod(() => this.player ? this.DEBUG_TOOLS.getPlayerData(this.player, "noRender") === true : false)
                .event.subscribe("toggle", this.toggleNoRender))
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
            this.clearNotesButton = new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonClearNotes))
                .event.subscribe("activate", () => this.player && ClearNotes_1.default.execute(localPlayer, this.player))
                .appendTo(this);
        }
        update(entity) {
            if (this.player === entity)
                return;
            this.player = entity.asPlayer;
            this.toggle(!!this.player);
            this.clearNotesButton.toggle(!!this.player?.notes.notes.length);
            if (!this.player)
                return;
            this.event.emit("change");
            this.refresh();
            this.DEBUG_TOOLS.event.until(this, "remove", "change")
                .subscribe("playerDataChange", this.refresh);
            const entityEvents = this.player?.event.until(this, "switchAway");
            entityEvents.subscribe(["writtenNote", "clearNotes"], () => this.clearNotesButton.toggle(!!this.player?.notes.notes.length));
        }
        refresh() {
            if (this.checkButtonPermissions) {
                this.checkButtonPermissions.toggle(multiplayer.isServer && this.player && !this.player.isLocalPlayer)
                    .refresh();
            }
            this.checkButtonNoClip.refresh();
            this.checkButtonUnkillable.refresh();
            this.checkButtonNoRender.refresh();
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
        toggleUnkillable(_, unkillable) {
            if (this.DEBUG_TOOLS.getPlayerData(this.player, "unkillable") === unkillable)
                return;
            SetPlayerData_1.default.execute(localPlayer, this.player, "unkillable", unkillable);
        }
        toggleNoRender(_, noRender) {
            if (this.DEBUG_TOOLS.getPlayerData(this.player, "noRender") === noRender)
                return;
            SetPlayerData_1.default.execute(localPlayer, this.player, "noRender", noRender);
            localPlayer.updateView(IRenderer_1.RenderSource.Mod, false);
        }
        toggleNoClip(_, noclip) {
            if (this.player?.isFlying === noclip)
                return;
            ToggleNoClip_1.default.execute(localPlayer, this.player);
        }
        togglePermissions(_, permissions) {
            if (this.DEBUG_TOOLS.getPlayerData(this.player, "permissions") === permissions)
                return;
            SetPlayerData_1.default.execute(localPlayer, this.player, "permissions", permissions);
        }
        setWeightBonus(_, weightBonus) {
            if (this.DEBUG_TOOLS.getPlayerData(this.player, "weightBonus") === weightBonus)
                return;
            SetPlayerData_1.default.execute(localPlayer, this.player, "weightBonus", weightBonus);
        }
        onPlayerDataChange(_, playerId, key, value) {
            if (!this.player || playerId !== this.player.id)
                return;
            switch (key) {
                case "weightBonus":
                    this.rangeWeightBonus.refresh();
                    break;
                case "unkillable":
                    this.checkButtonUnkillable.refresh();
                    break;
                case "noRender":
                    this.checkButtonNoRender.refresh();
                    break;
                case "permissions":
                    if (this.checkButtonPermissions)
                        this.checkButtonPermissions.refresh();
                    break;
            }
        }
        replaceData() {
            const playerId = this.playerToReplaceDataWithDropdown?.selectedOption;
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
    ], PlayerInformation.prototype, "toggleUnkillable", null);
    __decorate([
        Decorators_1.Bound
    ], PlayerInformation.prototype, "toggleNoRender", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVySW5mb3JtYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9QbGF5ZXJJbmZvcm1hdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUEyQkgsTUFBcUIsaUJBQWtCLFNBQVEsNENBQWtDO1FBa0JoRjtZQUNDLEtBQUssRUFBRSxDQUFDO1lBSkQsVUFBSyxHQUErQixNQUFNLENBQUM7WUFNbEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7aUJBQzFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUV6RCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSx5QkFBVyxFQUFFO2lCQUM3QyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLHVCQUF1QixDQUFDLENBQUM7aUJBQ25FLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7aUJBQzFHLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztpQkFDakQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksbUJBQVEsRUFBRTtpQkFDWixNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDaEQsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2lCQUM5RCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FB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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "language/dictionary/UiTranslation", "language/ITranslation", "language/Translation", "mod/Mod", "ui/component/BlockRow", "ui/component/CheckButton", "ui/component/dropdown/SkillDropdown", "ui/component/LabelledRow", "ui/component/RangeRow", "utilities/Decorators", "../../action/SetSkill", "../../action/SetWeightBonus", "../../action/ToggleInvulnerable", "../../action/ToggleNoClip", "../../action/TogglePermissions", "../../IDebugTools", "../component/InspectEntityInformationSubsection"], function (require, exports, UiTranslation_1, ITranslation_1, Translation_1, Mod_1, BlockRow_1, CheckButton_1, SkillDropdown_1, LabelledRow_1, RangeRow_1, Decorators_1, SetSkill_1, SetWeightBonus_1, ToggleInvulnerable_1, ToggleNoClip_1, TogglePermissions_1, IDebugTools_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PlayerInformation extends InspectEntityInformationSubsection_1.default {
        constructor() {
            super();
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
                .setRefreshMethod(() => this.player ? !!this.DEBUG_TOOLS.getPlayerData(this.player, "noclip") : false)
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
                : this.skill === -1 ? (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.MethodAll)
                    : Translation_1.default.skill(this.skill).inContext(ITranslation_1.TextContext.Title)))
                .setInheritTextTooltip()
                .editRange(range => range
                .setMin(0)
                .setMax(100)
                .setRefreshMethod(() => this.player?.skill.getCore(this.skill) ?? 0))
                .setDisplayValue(Translation_1.default.ui(UiTranslation_1.default.GameStatsPercentage).get)
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
            this.skill = skill === "none" ? undefined : skill === "all" ? -1 : skill;
            this.skillRangeRow.refresh();
            this.skillRangeRow.toggle(skill !== "none");
        }
        setSkill(_, value) {
            SetSkill_1.default.execute(localPlayer, this.player, this.skill, value);
        }
        toggleInvulnerable(_, invulnerable) {
            if (this.DEBUG_TOOLS.getPlayerData(this.player, "invulnerable") === invulnerable)
                return;
            ToggleInvulnerable_1.default.execute(localPlayer, this.player, invulnerable);
        }
        toggleNoClip(_, noclip) {
            if (this.DEBUG_TOOLS.getPlayerData(this.player, "noclip") === noclip)
                return;
            ToggleNoClip_1.default.execute(localPlayer, this.player, noclip);
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
                case "noclip":
                    this.checkButtonNoClip.refresh();
                    break;
            }
        }
    }
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
    exports.default = PlayerInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvUGxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXVCQSxNQUFxQixpQkFBa0IsU0FBUSw0Q0FBa0M7UUFjaEY7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUVSLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO2lCQUMxQyxTQUFTLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFFekQsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDN0MsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2lCQUNuRSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2lCQUMxRyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUM7aUJBQ2pELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLG1CQUFRLEVBQUU7aUJBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLHlCQUFXLEVBQUU7aUJBQ2hELE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztpQkFDOUQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxD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
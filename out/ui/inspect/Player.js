var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "entity/IHuman", "language/dictionary/UiTranslation", "language/Translation", "mod/Mod", "newui/component/BlockRow", "newui/component/CheckButton", "newui/component/dropdown/SkillDropdown", "newui/component/LabelledRow", "newui/component/RangeRow", "../../action/SetSkill", "../../action/SetWeightBonus", "../../action/ToggleInvulnerable", "../../action/ToggleNoClip", "../../action/TogglePermissions", "../../IDebugTools", "../component/InspectEntityInformationSubsection"], function (require, exports, ActionExecutor_1, IHuman_1, UiTranslation_1, Translation_1, Mod_1, BlockRow_1, CheckButton_1, SkillDropdown_1, LabelledRow_1, RangeRow_1, SetSkill_1, SetWeightBonus_1, ToggleInvulnerable_1, ToggleNoClip_1, TogglePermissions_1, IDebugTools_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let PlayerInformation = (() => {
        class PlayerInformation extends InspectEntityInformationSubsection_1.default {
            constructor() {
                super();
                this.DEBUG_TOOLS.event.until(this, "remove")
                    .subscribe("playerDataChange", this.onPlayerDataChange);
                this.checkButtonPermissions = new CheckButton_1.CheckButton()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonTogglePermissions))
                    .setRefreshMethod(() => this.player ? !!this.DEBUG_TOOLS.getPlayerData(this.player, "permissions") : false)
                    .event.subscribe("toggle", this.togglePermissions)
                    .appendTo(this);
                new BlockRow_1.BlockRow()
                    .append(this.checkButtonNoClip = new CheckButton_1.CheckButton()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleNoClip))
                    .setRefreshMethod(() => this.player ? !!this.DEBUG_TOOLS.getPlayerData(this.player, "noclip") : false)
                    .event.subscribe("toggle", this.toggleNoClip))
                    .append(this.checkButtonInvulnerable = new CheckButton_1.CheckButton()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleInvulnerable))
                    .setRefreshMethod(() => this.player ? this.DEBUG_TOOLS.getPlayerData(this.player, "invulnerable") === true : false)
                    .event.subscribe("toggle", this.toggleInvulnerable))
                    .appendTo(this);
                this.rangeWeightBonus = new RangeRow_1.RangeRow()
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelWeightBonus)))
                    .editRange(range => range
                    .setMin(0)
                    .setMax(1000)
                    .setRefreshMethod(() => this.player ? this.DEBUG_TOOLS.getPlayerData(this.player, "weightBonus") : 0))
                    .setDisplayValue(true)
                    .event.subscribe("finish", this.setWeightBonus)
                    .appendTo(this);
                new LabelledRow_1.LabelledRow()
                    .classes.add("dropdown-label")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelSkill)))
                    .append(new SkillDropdown_1.default("none", [["none", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.None))]])
                    .event.subscribe("selection", this.changeSkill))
                    .appendTo(this);
                this.skillRangeRow = new RangeRow_1.RangeRow()
                    .hide()
                    .setLabel(label => label.setText(Translation_1.default.generator(() => this.skill === undefined ? "" : IHuman_1.SkillType[this.skill])))
                    .editRange(range => range
                    .setMin(0)
                    .setMax(100)
                    .setRefreshMethod(() => this.skill !== undefined && this.player && this.skill in this.player.skills ? this.player.skills[this.skill].core : 0))
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
                this.skill = skill === "none" ? undefined : skill;
                this.skillRangeRow.refresh();
                this.skillRangeRow.toggle(skill !== "none");
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
                        break;
                }
            }
        }
        __decorate([
            Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
        ], PlayerInformation.prototype, "DEBUG_TOOLS", void 0);
        __decorate([
            Override
        ], PlayerInformation.prototype, "update", null);
        __decorate([
            Bound
        ], PlayerInformation.prototype, "refresh", null);
        __decorate([
            Bound
        ], PlayerInformation.prototype, "changeSkill", null);
        __decorate([
            Bound
        ], PlayerInformation.prototype, "setSkill", null);
        __decorate([
            Bound
        ], PlayerInformation.prototype, "toggleInvulnerable", null);
        __decorate([
            Bound
        ], PlayerInformation.prototype, "toggleNoClip", null);
        __decorate([
            Bound
        ], PlayerInformation.prototype, "togglePermissions", null);
        __decorate([
            Bound
        ], PlayerInformation.prototype, "setWeightBonus", null);
        __decorate([
            Bound
        ], PlayerInformation.prototype, "onPlayerDataChange", null);
        return PlayerInformation;
    })();
    exports.default = PlayerInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvUGxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXNCQTtRQUFBLE1BQXFCLGlCQUFrQixTQUFRLDRDQUFrQztZQWNoRjtnQkFDQyxLQUFLLEVBQUUsQ0FBQztnQkFFUixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQztxQkFDMUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUV6RCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSx5QkFBVyxFQUFFO3FCQUM3QyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO3FCQUNuRSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO3FCQUMxRyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUM7cUJBQ2pELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFakIsSUFBSSxtQkFBUSxFQUFFO3FCQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSx5QkFBVyxFQUFFO3FCQUNoRCxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO3FCQUM5RCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO3FCQUNyRyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7cUJBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSx5QkFBVyxFQUFFO3FCQUN0RCxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO3FCQUNwRSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO3FCQUNsSCxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztxQkFDcEQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVqQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxtQkFBUSxFQUFFO3FCQUNwQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO3FCQUNyRixTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLO3FCQUN2QixNQUFNLENBQUMsQ0FBQyxDQUFDO3FCQUNULE1BQU0sQ0FBQyxJQUFJLENBQUM7cUJBQ1osZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3RHLGVBQWUsQ0FBQyxJQUFJLENBQUM7cUJBQ3JCLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7cUJBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFakIsSUFBSSx5QkFBVyxFQUFFO3FCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7cUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO3FCQUMvRSxNQUFNLENBQUMsSUFBSSx1QkFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUM5RyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7cUJBQ2hELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFakIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLG1CQUFRLEVBQUU7cUJBQ2pDLElBQUksRUFBRTtxQkFDTixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHFCQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDcEgsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSztxQkFDdkIsTUFBTSxDQUFDLENBQUMsQ0FBQztxQkFDVCxNQUFNLENBQUMsR0FBRyxDQUFDO3FCQUNYLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ2hKLGVBQWUsQ0FBQyxxQkFBVyxDQUFDLEVBQUUsQ0FBQyx1QkFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUMsR0FBRyxDQUFDO3FCQUN0RSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDO3FCQUN4QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsQ0FBQztZQUVnQixNQUFNLENBQUMsTUFBK0I7Z0JBQ3RELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNO29CQUFFLE9BQU87Z0JBRW5DLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUUzQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07b0JBQUUsT0FBTztnQkFFekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRTFCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFFZixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUM7cUJBQ3BELFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0MsQ0FBQztZQUdPLE9BQU87Z0JBQ2QsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEVBQUU7b0JBQ2hDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO3lCQUN2RyxPQUFPLEVBQUUsQ0FBQztpQkFDWjtnQkFFRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pDLENBQUM7WUFHTyxXQUFXLENBQUMsQ0FBTSxFQUFFLEtBQXlCO2dCQUNwRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUNsRCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUU3QixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDLENBQUM7WUFDN0MsQ0FBQztZQUdPLFFBQVEsQ0FBQyxDQUFNLEVBQUUsS0FBYTtnQkFDckMsd0JBQWMsQ0FBQyxHQUFHLENBQUMsa0JBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU8sRUFBRSxJQUFJLENBQUMsS0FBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JGLENBQUM7WUFHTyxrQkFBa0IsQ0FBQyxDQUFNLEVBQUUsWUFBcUI7Z0JBQ3ZELElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU8sRUFBRSxjQUFjLENBQUMsS0FBSyxZQUFZO29CQUFFLE9BQU87Z0JBRTFGLHdCQUFjLENBQUMsR0FBRyxDQUFDLDRCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ3pGLENBQUM7WUFHTyxZQUFZLENBQUMsQ0FBTSxFQUFFLE1BQWU7Z0JBQzNDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU8sRUFBRSxRQUFRLENBQUMsS0FBSyxNQUFNO29CQUFFLE9BQU87Z0JBRTlFLHdCQUFjLENBQUMsR0FBRyxDQUFDLHNCQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDN0UsQ0FBQztZQUdPLGlCQUFpQixDQUFDLENBQU0sRUFBRSxXQUFvQjtnQkFDckQsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTyxFQUFFLGFBQWEsQ0FBQyxLQUFLLFdBQVc7b0JBQUUsT0FBTztnQkFFeEYsd0JBQWMsQ0FBQyxHQUFHLENBQUMsMkJBQWlCLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDdkYsQ0FBQztZQUdPLGNBQWMsQ0FBQyxDQUFNLEVBQUUsV0FBbUI7Z0JBQ2pELElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU8sRUFBRSxhQUFhLENBQUMsS0FBSyxXQUFXO29CQUFFLE9BQU87Z0JBRXhGLHdCQUFjLENBQUMsR0FBRyxDQUFDLHdCQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDcEYsQ0FBQztZQUdPLGtCQUFrQixDQUE4QixDQUFNLEVBQUUsUUFBZ0IsRUFBRSxHQUFNLEVBQUUsS0FBcUI7Z0JBQzlHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLFFBQVEsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQUUsT0FBTztnQkFFeEQsUUFBUSxHQUFHLEVBQUU7b0JBQ1osS0FBSyxhQUFhO3dCQUNqQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ2hDLE1BQU07b0JBQ1AsS0FBSyxjQUFjO3dCQUNsQixJQUFJLENBQUMsdUJBQXVCLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ3ZDLE1BQU07b0JBQ1AsS0FBSyxhQUFhO3dCQUNqQixJQUFJLElBQUksQ0FBQyxzQkFBc0I7NEJBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUN2RSxNQUFNO29CQUNQLEtBQUssUUFBUTt3QkFDWixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ2pDLE1BQU07aUJBQ1A7WUFDRixDQUFDO1NBQ0Q7UUF2SkE7WUFEQyxhQUFHLENBQUMsUUFBUSxDQUFhLDRCQUFjLENBQUM7OERBQ0Q7UUErRDlCO1lBQVQsUUFBUTt1REFjUjtRQUdEO1lBREMsS0FBSzt3REFVTDtRQUdEO1lBREMsS0FBSzs0REFNTDtRQUdEO1lBREMsS0FBSzt5REFHTDtRQUdEO1lBREMsS0FBSzttRUFLTDtRQUdEO1lBREMsS0FBSzs2REFLTDtRQUdEO1lBREMsS0FBSztrRUFLTDtRQUdEO1lBREMsS0FBSzsrREFLTDtRQUdEO1lBREMsS0FBSzttRUFrQkw7UUFDRix3QkFBQztTQUFBO3NCQTFKb0IsaUJBQWlCIn0=
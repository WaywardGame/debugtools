var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "game/IGame", "mod/IHookHost", "mod/IHookManager", "mod/Mod", "newui/component/Button", "newui/component/CheckButton", "newui/component/RangeInput", "newui/component/RangeRow", "renderer/Shaders", "utilities/Objects", "../../action/UpdateStatsAndAttributes", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, ActionExecutor_1, IGame_1, IHookHost_1, IHookManager_1, Mod_1, Button_1, CheckButton_1, RangeInput_1, RangeRow_1, Shaders_1, Objects_1, UpdateStatsAndAttributes_1, IDebugTools_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DisplayPanel extends DebugToolsPanel_1.default {
        constructor() {
            super();
            new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleFog))
                .setRefreshMethod(() => this.DEBUG_TOOLS.getPlayerData(localPlayer, "fog"))
                .on(CheckButton_1.CheckButtonEvent.Change, this.toggleFog)
                .appendTo(this);
            new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleLighting))
                .setRefreshMethod(() => this.DEBUG_TOOLS.getPlayerData(localPlayer, "lighting"))
                .on(CheckButton_1.CheckButtonEvent.Change, this.toggleLighting)
                .appendTo(this);
            this.zoomRange = new RangeRow_1.RangeRow()
                .classes.add("debug-tools-range-row-no-default-button")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelZoomLevel)))
                .editRange(range => range
                .setMin(0)
                .setMax(11)
                .setRefreshMethod(() => this.saveData.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.saveData.zoomLevel))
                .setDisplayValue(() => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ZoomLevel)
                .get(this.DEBUG_TOOLS.getZoomLevel() || saveDataGlobal.options.zoomLevel))
                .on(RangeInput_1.RangeInputEvent.Change, (_, value) => {
                this.saveData.zoomLevel = value;
                game.updateZoomLevel();
            })
                .appendTo(this);
            new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonUnlockCamera))
                .setRefreshMethod(() => this.DEBUG_TOOLS.isCameraUnlocked)
                .on(CheckButton_1.CheckButtonEvent.Change, (_, checked) => this.DEBUG_TOOLS.setCameraUnlocked(checked))
                .appendTo(this);
            new Button_1.default()
                .classes.add("warning")
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonResetWebGL))
                .on(Button_1.ButtonEvent.Activate, this.resetWebGL)
                .appendTo(this);
            new Button_1.default()
                .classes.add("warning")
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonReloadShaders))
                .on(Button_1.ButtonEvent.Activate, this.reloadShaders)
                .appendTo(this);
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo, this.onSwitchTo);
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway, this.onSwitchAway);
        }
        getTranslation() {
            return IDebugTools_1.DebugToolsTranslation.PanelDisplay;
        }
        getZoomLevel() {
            if (this.zoomRange) {
                this.zoomRange.refresh();
            }
            return undefined;
        }
        onSwitchTo() {
            hookManager.register(this, "DebugToolsDialog:DisplayPanel")
                .until(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway);
        }
        onSwitchAway() {
        }
        toggleFog(_, fog) {
            this.DEBUG_TOOLS.setPlayerData(localPlayer, "fog", fog);
            this.DEBUG_TOOLS.updateFog();
        }
        toggleLighting(_, lighting) {
            this.DEBUG_TOOLS.setPlayerData(localPlayer, "lighting", lighting);
            ActionExecutor_1.default.get(UpdateStatsAndAttributes_1.default).execute(localPlayer, localPlayer);
            game.updateView(IGame_1.RenderSource.Mod, true);
        }
        resetWebGL() {
            game.resetWebGL();
        }
        async reloadShaders() {
            await Shaders_1.loadShaders();
            Shaders_1.compileShaders();
            game.updateView(IGame_1.RenderSource.Mod, true);
        }
    }
    __decorate([
        Mod_1.default.instance("Debug Tools")
    ], DisplayPanel.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        Mod_1.default.saveData("Debug Tools")
    ], DisplayPanel.prototype, "saveData", void 0);
    __decorate([
        IHookHost_1.HookMethod(IHookManager_1.HookPriority.High)
    ], DisplayPanel.prototype, "getZoomLevel", null);
    __decorate([
        Objects_1.Bound
    ], DisplayPanel.prototype, "onSwitchTo", null);
    __decorate([
        Objects_1.Bound
    ], DisplayPanel.prototype, "onSwitchAway", null);
    __decorate([
        Objects_1.Bound
    ], DisplayPanel.prototype, "toggleFog", null);
    __decorate([
        Objects_1.Bound
    ], DisplayPanel.prototype, "toggleLighting", null);
    __decorate([
        Objects_1.Bound
    ], DisplayPanel.prototype, "resetWebGL", null);
    __decorate([
        Objects_1.Bound
    ], DisplayPanel.prototype, "reloadShaders", null);
    exports.default = DisplayPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzcGxheVBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0Rpc3BsYXlQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFnQkEsTUFBcUIsWUFBYSxTQUFRLHlCQUFlO1FBU3hEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsZUFBZSxDQUFDLENBQUM7aUJBQzNELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDMUUsRUFBRSxDQUFDLDhCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO2lCQUMzQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSx5QkFBVyxFQUFFO2lCQUNmLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLG9CQUFvQixDQUFDLENBQUM7aUJBQ2hFLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztpQkFDL0UsRUFBRSxDQUFDLDhCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDO2lCQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLG1CQUFRLEVBQUU7aUJBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMseUNBQXlDLENBQUM7aUJBQ3RELFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2lCQUNuRixTQUFTLENB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
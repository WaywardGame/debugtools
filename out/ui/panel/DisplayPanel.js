var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "action/ActionExecutor", "game/IGame", "mod/IHookHost", "mod/IHookManager", "mod/Mod", "newui/component/Button", "newui/component/CheckButton", "newui/component/RangeInput", "newui/component/RangeRow", "renderer/Shaders", "utilities/Objects", "../../action/UpdateStatsAndAttributes", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, ActionExecutor_1, IGame_1, IHookHost_1, IHookManager_1, Mod_1, Button_1, CheckButton_1, RangeInput_1, RangeRow_1, Shaders_1, Objects_1, UpdateStatsAndAttributes_1, IDebugTools_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DisplayPanel extends DebugToolsPanel_1.default {
        constructor(gsapi) {
            super(gsapi);
            new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleFog))
                .setRefreshMethod(() => this.DEBUG_TOOLS.getPlayerData(localPlayer, "fog"))
                .on(CheckButton_1.CheckButtonEvent.Change, this.toggleFog)
                .appendTo(this);
            new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleLighting))
                .setRefreshMethod(() => this.DEBUG_TOOLS.getPlayerData(localPlayer, "lighting"))
                .on(CheckButton_1.CheckButtonEvent.Change, this.toggleLighting)
                .appendTo(this);
            this.zoomRange = new RangeRow_1.RangeRow(this.api)
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
            new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonUnlockCamera))
                .setRefreshMethod(() => this.DEBUG_TOOLS.isCameraUnlocked)
                .on(CheckButton_1.CheckButtonEvent.Change, (_, checked) => this.DEBUG_TOOLS.setCameraUnlocked(checked))
                .appendTo(this);
            new Button_1.default(this.api)
                .classes.add("warning")
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonResetWebGL))
                .on(Button_1.ButtonEvent.Activate, this.resetWebGL)
                .appendTo(this);
            new Button_1.default(this.api)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzcGxheVBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0Rpc3BsYXlQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFpQkEsTUFBcUIsWUFBYSxTQUFRLHlCQUFlO1FBU3hELFlBQW1CLEtBQXFCO1lBQ3ZDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUViLElBQUkseUJBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUN2QixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztpQkFDM0QsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUMxRSxFQUFFLENBQUMsOEJBQWdCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7aUJBQzNDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLHlCQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztpQkFDdkIsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztpQkFDaEUsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2lCQUMvRSxFQUFFLENBQUMsOEJBQWdCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7aUJBQ2hELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxDQUFDO2lCQUN0RCxRQUFRLENBQUMsS0FBSyxDQUFDLEVB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
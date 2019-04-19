var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "event/EventManager", "game/IGame", "mod/IHookHost", "mod/IHookManager", "mod/Mod", "newui/component/Button", "newui/component/CheckButton", "newui/component/RangeRow", "renderer/Shaders", "../../action/UpdateStatsAndAttributes", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, ActionExecutor_1, EventManager_1, IGame_1, IHookHost_1, IHookManager_1, Mod_1, Button_1, CheckButton_1, RangeRow_1, Shaders_1, UpdateStatsAndAttributes_1, IDebugTools_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DisplayPanel extends DebugToolsPanel_1.default {
        constructor() {
            super();
            new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleFog))
                .setRefreshMethod(() => this.DEBUG_TOOLS.getPlayerData(localPlayer, "fog"))
                .event.subscribe("toggle", this.toggleFog)
                .appendTo(this);
            new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleLighting))
                .setRefreshMethod(() => this.DEBUG_TOOLS.getPlayerData(localPlayer, "lighting"))
                .event.subscribe("toggle", this.toggleLighting)
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
                .event.subscribe("change", (_, value) => {
                this.saveData.zoomLevel = value;
                game.updateZoomLevel();
            })
                .appendTo(this);
            new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonUnlockCamera))
                .setRefreshMethod(() => this.DEBUG_TOOLS.isCameraUnlocked)
                .event.subscribe("toggle", (_, checked) => this.DEBUG_TOOLS.setCameraUnlocked(checked))
                .appendTo(this);
            new Button_1.default()
                .classes.add("warning")
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonResetWebGL))
                .event.subscribe("activate", this.resetWebGL)
                .appendTo(this);
            new Button_1.default()
                .classes.add("warning")
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonReloadShaders))
                .event.subscribe("activate", this.reloadShaders)
                .appendTo(this);
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
            this.registerHookHost("DebugToolsDialog:DisplayPanel");
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
        Override
    ], DisplayPanel.prototype, "getTranslation", null);
    __decorate([
        IHookHost_1.HookMethod(IHookManager_1.HookPriority.High)
    ], DisplayPanel.prototype, "getZoomLevel", null);
    __decorate([
        EventManager_1.EventHandler("self")("switchTo")
    ], DisplayPanel.prototype, "onSwitchTo", null);
    __decorate([
        EventManager_1.EventHandler("self")("switchAway")
    ], DisplayPanel.prototype, "onSwitchAway", null);
    __decorate([
        Bound
    ], DisplayPanel.prototype, "toggleFog", null);
    __decorate([
        Bound
    ], DisplayPanel.prototype, "toggleLighting", null);
    __decorate([
        Bound
    ], DisplayPanel.prototype, "resetWebGL", null);
    __decorate([
        Bound
    ], DisplayPanel.prototype, "reloadShaders", null);
    exports.default = DisplayPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzcGxheVBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0Rpc3BsYXlQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFnQkEsTUFBcUIsWUFBYSxTQUFRLHlCQUFlO1FBU3hEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsZUFBZSxDQUFDLENBQUM7aUJBQzNELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDMUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztpQkFDekMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2lCQUNoRSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7aUJBQy9FLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7aUJBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsRUFBRTtpQkFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQztpQkFDdEQsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7aUJBQ25GLFNBQVMsQ0FBQyxL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
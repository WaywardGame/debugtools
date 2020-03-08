var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventManager", "game/IGame", "mod/Mod", "newui/component/Button", "newui/component/CheckButton", "newui/component/RangeRow", "renderer/Shaders", "renderer/WorldRenderer", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, EventManager_1, IGame_1, Mod_1, Button_1, CheckButton_1, RangeRow_1, Shaders_1, WorldRenderer_1, IDebugTools_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DisplayPanel extends DebugToolsPanel_1.default {
        constructor() {
            super();
            new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleFog))
                .setRefreshMethod(() => this.DEBUG_TOOLS.getPlayerData(localPlayer, "fog") !== false)
                .event.subscribe("toggle", this.toggleFog)
                .appendTo(this);
            new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleLighting))
                .setRefreshMethod(() => this.DEBUG_TOOLS.getPlayerData(localPlayer, "lighting") !== false)
                .event.subscribe("toggle", this.toggleLighting)
                .appendTo(this);
            this.zoomRange = new RangeRow_1.RangeRow()
                .classes.add("debug-tools-range-row-no-default-button")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelZoomLevel)))
                .editRange(range => range
                .setMin(0)
                .setMax(IDebugTools_1.ZOOM_LEVEL_MAX + 3)
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
        toggleFog(_, fog) {
            this.DEBUG_TOOLS.toggleFog(fog);
        }
        toggleLighting(_, lighting) {
            this.DEBUG_TOOLS.toggleLighting(lighting);
        }
        onSwitchTo() {
            var _a;
            this.registerEventBusSubscriber("switchAway");
            (_a = this.zoomRange) === null || _a === void 0 ? void 0 : _a.refresh();
        }
        onUpdateZoom() {
            var _a;
            (_a = this.zoomRange) === null || _a === void 0 ? void 0 : _a.refresh();
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
        Bound
    ], DisplayPanel.prototype, "toggleFog", null);
    __decorate([
        Bound
    ], DisplayPanel.prototype, "toggleLighting", null);
    __decorate([
        EventManager_1.OwnEventHandler(DisplayPanel, "switchTo")
    ], DisplayPanel.prototype, "onSwitchTo", null);
    __decorate([
        EventManager_1.EventHandler(WorldRenderer_1.default, "updateZoom")
    ], DisplayPanel.prototype, "onUpdateZoom", null);
    __decorate([
        Bound
    ], DisplayPanel.prototype, "resetWebGL", null);
    __decorate([
        Bound
    ], DisplayPanel.prototype, "reloadShaders", null);
    exports.default = DisplayPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzcGxheVBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0Rpc3BsYXlQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFZQSxNQUFxQixZQUFhLFNBQVEseUJBQWU7UUFTeEQ7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUVSLElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztpQkFDM0QsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxLQUFLLEtBQUssQ0FBQztpQkFDcEYsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztpQkFDekMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2lCQUNoRSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLEtBQUssS0FBSyxDQUFDO2lCQUN6RixLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDO2lCQUM5QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLG1CQUFRLEVBQUU7aUJBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMseUNBQXlDLENBQUM7aUJBQ3RELFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFD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
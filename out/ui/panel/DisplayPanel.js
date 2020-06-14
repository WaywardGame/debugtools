var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventManager", "game/IGame", "mod/Mod", "newui/component/Button", "newui/component/CheckButton", "newui/component/Divider", "newui/component/RangeRow", "newui/component/Text", "renderer/IWorldRenderer", "renderer/Shaders", "renderer/WorldLayerRenderer", "renderer/WorldRenderer", "utilities/enum/Enums", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, EventManager_1, IGame_1, Mod_1, Button_1, CheckButton_1, Divider_1, RangeRow_1, Text_1, IWorldRenderer_1, Shaders_1, WorldLayerRenderer_1, WorldRenderer_1, Enums_1, IDebugTools_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let DisplayPanel = (() => {
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
                new Divider_1.default()
                    .appendTo(this);
                new Text_1.Heading()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.HeadingLayers))
                    .appendTo(this);
                Enums_1.default.values(IWorldRenderer_1.RenderLayerFlag)
                    .filter(flag => flag !== IWorldRenderer_1.RenderLayerFlag.None && flag !== IWorldRenderer_1.RenderLayerFlag.All)
                    .map(layerFlag => new CheckButton_1.CheckButton()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleLayer)
                    .addArgs(IWorldRenderer_1.RenderLayerFlag[layerFlag]))
                    .setRefreshMethod(() => this.saveData.renderLayerFlags !== undefined ? !!(this.saveData.renderLayerFlags & layerFlag) : true)
                    .event.subscribe("toggle", (_, checked) => {
                    this.updateRenderLayerFlag(layerFlag, checked);
                }))
                    .splat(this.append);
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
            updateRenderLayerFlag(flag, checked) {
                if (this.saveData.renderLayerFlags === undefined) {
                    this.saveData.renderLayerFlags = IWorldRenderer_1.RenderLayerFlag.All;
                }
                if (checked) {
                    this.saveData.renderLayerFlags |= flag;
                }
                else {
                    this.saveData.renderLayerFlags &= ~flag;
                }
                game.updateView(IGame_1.RenderSource.Mod);
            }
            getRenderFlags() {
                var _a;
                return (_a = this.saveData.renderLayerFlags) !== null && _a !== void 0 ? _a : IWorldRenderer_1.RenderLayerFlag.All;
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
        __decorate([
            Bound
        ], DisplayPanel.prototype, "updateRenderLayerFlag", null);
        __decorate([
            EventManager_1.EventHandler(WorldLayerRenderer_1.default, "getRenderFlags")
        ], DisplayPanel.prototype, "getRenderFlags", null);
        return DisplayPanel;
    })();
    exports.default = DisplayPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzcGxheVBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0Rpc3BsYXlQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFpQkE7UUFBQSxNQUFxQixZQUFhLFNBQVEseUJBQWU7WUFTeEQ7Z0JBQ0MsS0FBSyxFQUFFLENBQUM7Z0JBRVIsSUFBSSx5QkFBVyxFQUFFO3FCQUNmLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGVBQWUsQ0FBQyxDQUFDO3FCQUMzRCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLEtBQUssS0FBSyxDQUFDO3FCQUNwRixLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO3FCQUN6QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRWpCLElBQUkseUJBQVcsRUFBRTtxQkFDZixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO3FCQUNoRSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLEtBQUssS0FBSyxDQUFDO3FCQUN6RixLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDO3FCQUM5QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRWpCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxtQkFBUSxFQUFFO3FCQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxDQUFDO3FCQUN0RCxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsY0FBYyxDQUFD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
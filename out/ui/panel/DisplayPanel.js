var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventManager", "mod/Mod", "renderer/IRenderer", "renderer/Shaders", "renderer/world/IWorldRenderer", "renderer/world/WorldLayerRenderer", "renderer/world/WorldRenderer", "ui/component/Button", "ui/component/CheckButton", "ui/component/Divider", "ui/component/RangeRow", "ui/component/Text", "ui/util/ImagePath", "utilities/Decorators", "utilities/enum/Enums", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, EventManager_1, Mod_1, IRenderer_1, Shaders_1, IWorldRenderer_1, WorldLayerRenderer_1, WorldRenderer_1, Button_1, CheckButton_1, Divider_1, RangeRow_1, Text_1, ImagePath_1, Decorators_1, Enums_1, IDebugTools_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DisplayPanel extends DebugToolsPanel_1.default {
        constructor() {
            super();
            new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonToggleFog))
                .setRefreshMethod(() => this.DEBUG_TOOLS.getPlayerData(localPlayer, "fog") !== false)
                .event.subscribe("toggle", this.toggleFog)
                .appendTo(this);
            new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonToggleLighting))
                .setRefreshMethod(() => this.DEBUG_TOOLS.getPlayerData(localPlayer, "lighting") !== false)
                .event.subscribe("toggle", this.toggleLighting)
                .appendTo(this);
            this.zoomRange = new RangeRow_1.RangeRow()
                .classes.add("debug-tools-range-row-no-default-button")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelZoomLevel)))
                .editRange(range => range
                .setMin(0)
                .setMax(IRenderer_1.ZOOM_LEVEL_MAX + 3)
                .setRefreshMethod(() => saveDataGlobal.options.zoomLevel))
                .setDisplayValue(() => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ZoomLevel)
                .get(saveDataGlobal.options.zoomLevel))
                .event.subscribe("change", (_, value) => {
                saveDataGlobal.options.zoomLevel = value;
                renderer?.updateZoomLevel();
            })
                .appendTo(this);
            let temperatureOverlay = false;
            new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonToggleTemperature))
                .setRefreshMethod(() => temperatureOverlay)
                .event.subscribe("toggle", (_, enabled) => (temperatureOverlay = enabled) ? this.DEBUG_TOOLS.temperatureOverlay.show() : this.DEBUG_TOOLS.temperatureOverlay.hide())
                .appendTo(this);
            new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonUnlockCamera))
                .setRefreshMethod(() => this.DEBUG_TOOLS.isCameraUnlocked)
                .event.subscribe("toggle", (_, checked) => this.DEBUG_TOOLS.setCameraUnlocked(checked))
                .appendTo(this);
            new Button_1.default()
                .setType(Button_1.ButtonType.Warning)
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonResetRenderer))
                .event.subscribe("activate", this.resetWebGL)
                .appendTo(this);
            new Button_1.default()
                .setType(Button_1.ButtonType.Warning)
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonRefreshTiles))
                .event.subscribe("activate", this.refreshTiles)
                .appendTo(this);
            new Button_1.default()
                .setType(Button_1.ButtonType.Warning)
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonReloadShaders))
                .event.subscribe("activate", this.reloadShaders)
                .appendTo(this);
            new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonReloadUIImages))
                .event.subscribe("activate", ImagePath_1.default.cachebust)
                .appendTo(this);
            new Divider_1.default()
                .appendTo(this);
            new Text_1.Heading()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.HeadingLayers))
                .appendTo(this);
            Enums_1.default.values(IWorldRenderer_1.RenderLayerFlag)
                .filter(flag => flag !== IWorldRenderer_1.RenderLayerFlag.None && flag !== IWorldRenderer_1.RenderLayerFlag.All)
                .map(layerFlag => new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonToggleLayer)
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
            this.zoomRange?.refresh();
        }
        onUpdateZoom() {
            this.zoomRange?.refresh();
        }
        resetWebGL() {
            game.resetWebGL();
        }
        refreshTiles() {
            renderer?.worldRenderer.updateAllTiles();
        }
        async reloadShaders() {
            await Shaders_1.Shaders.load();
            await game.webGlContext?.recompilePrograms();
            localPlayer.updateView(IRenderer_1.RenderSource.Mod, true);
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
            localPlayer.updateView(IRenderer_1.RenderSource.Mod);
        }
        getRenderFlags() {
            return this.saveData.renderLayerFlags ?? IWorldRenderer_1.RenderLayerFlag.All;
        }
    }
    __decorate([
        Mod_1.default.instance("Debug Tools")
    ], DisplayPanel.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        Mod_1.default.saveData("Debug Tools")
    ], DisplayPanel.prototype, "saveData", void 0);
    __decorate([
        Decorators_1.Bound
    ], DisplayPanel.prototype, "toggleFog", null);
    __decorate([
        Decorators_1.Bound
    ], DisplayPanel.prototype, "toggleLighting", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(DisplayPanel, "switchTo")
    ], DisplayPanel.prototype, "onSwitchTo", null);
    __decorate([
        (0, EventManager_1.EventHandler)(WorldRenderer_1.default, "updateZoom")
    ], DisplayPanel.prototype, "onUpdateZoom", null);
    __decorate([
        Decorators_1.Bound
    ], DisplayPanel.prototype, "resetWebGL", null);
    __decorate([
        Decorators_1.Bound
    ], DisplayPanel.prototype, "refreshTiles", null);
    __decorate([
        Decorators_1.Bound
    ], DisplayPanel.prototype, "reloadShaders", null);
    __decorate([
        Decorators_1.Bound
    ], DisplayPanel.prototype, "updateRenderLayerFlag", null);
    __decorate([
        (0, EventManager_1.EventHandler)(WorldLayerRenderer_1.default, "getRenderFlags")
    ], DisplayPanel.prototype, "getRenderFlags", null);
    exports.default = DisplayPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzcGxheVBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0Rpc3BsYXlQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFxQkEsTUFBcUIsWUFBYSxTQUFRLHlCQUFlO1FBU3hEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztpQkFDM0QsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxLQUFLLEtBQUssQ0FBQztpQkFDcEYsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztpQkFDekMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLG9CQUFvQixDQUFDLENBQUM7aUJBQ2hFLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsS0FBSyxLQUFLLENBQUM7aUJBQ3pGLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7aUJBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsRUFBRTtpQkFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQztpQkFDdEQsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsY0FB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
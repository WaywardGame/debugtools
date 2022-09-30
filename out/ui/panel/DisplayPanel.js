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
                .setMax(IDebugTools_1.ZOOM_LEVEL_MAX + 3)
                .setRefreshMethod(() => this.saveData.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.saveData.zoomLevel))
                .setDisplayValue(() => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ZoomLevel)
                .get(this.DEBUG_TOOLS.getZoomLevel() || saveDataGlobal.options.zoomLevel))
                .event.subscribe("change", (_, value) => {
                this.saveData.zoomLevel = value;
                renderer?.updateZoomLevel();
            })
                .appendTo(this);
            new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonUnlockCamera))
                .setRefreshMethod(() => this.DEBUG_TOOLS.isCameraUnlocked)
                .event.subscribe("toggle", (_, checked) => this.DEBUG_TOOLS.setCameraUnlocked(checked))
                .appendTo(this);
            new Button_1.default()
                .classes.add("warning")
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonResetRenderer))
                .event.subscribe("activate", this.resetWebGL)
                .appendTo(this);
            new Button_1.default()
                .classes.add("warning")
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonRefreshTiles))
                .event.subscribe("activate", this.refreshTiles)
                .appendTo(this);
            new Button_1.default()
                .classes.add("warning")
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
            renderers.updateView(IRenderer_1.RenderSource.Mod, true);
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
            renderers.updateView(IRenderer_1.RenderSource.Mod);
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
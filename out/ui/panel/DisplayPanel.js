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
define(["require", "exports", "event/EventManager", "language/Translation", "language/dictionary/UiTranslation", "mod/Mod", "renderer/IRenderer", "renderer/Shaders", "renderer/world/IWorldRenderer", "renderer/world/WorldLayerRenderer", "renderer/world/WorldRenderer", "ui/component/Button", "ui/component/CheckButton", "ui/component/Divider", "ui/component/RangeRow", "ui/component/Text", "ui/util/ImagePath", "utilities/Decorators", "utilities/enum/Enums", "utilities/promise/Async", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, EventManager_1, Translation_1, UiTranslation_1, Mod_1, IRenderer_1, Shaders_1, IWorldRenderer_1, WorldLayerRenderer_1, WorldRenderer_1, Button_1, CheckButton_1, Divider_1, RangeRow_1, Text_1, ImagePath_1, Decorators_1, Enums_1, Async_1, IDebugTools_1, DebugToolsPanel_1) {
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
            new RangeRow_1.RangeRow()
                .setLabel(label => label.setText(UiTranslation_1.default.MenuOptionsLabelInterfaceScale))
                .editRange(range => range
                .noClampOnRefresh()
                .setMin(ui.scale.getMinimum(), false)
                .setMax(ui.scale.getMaximum(), false)
                .setStep(0.25)
                .setRefreshMethod(() => ui.scale.getClamped()))
                .addDefaultButton(() => ui.scale.getClamped(1))
                .setDisplayValue(value => Translation_1.default.merge(ui.scale.getClamped(value)))
                .event.subscribe("finish", async (_, scale) => {
                ui.scale.setUserSetting(scale);
                await (0, Async_1.sleep)(10);
            })
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
    exports.default = DisplayPanel;
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzcGxheVBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0Rpc3BsYXlQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUEwQkgsTUFBcUIsWUFBYSxTQUFRLHlCQUFlO1FBU3hEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztpQkFDM0QsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxLQUFLLEtBQUssQ0FBQztpQkFDcEYsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztpQkFDekMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLG9CQUFvQixDQUFDLENBQUM7aUJBQ2hFLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsS0FBSyxLQUFLLENBQUM7aUJBQ3pGLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7aUJBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsRUFBRTtpQkFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQztpQkFDdEQsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVB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
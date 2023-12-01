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
define(["require", "exports", "@wayward/game/event/EventManager", "@wayward/game/language/Translation", "@wayward/game/language/dictionary/UiTranslation", "@wayward/game/mod/Mod", "@wayward/game/renderer/IRenderer", "@wayward/game/renderer/platform/webgl/WebGlShaders", "@wayward/game/renderer/world/IWorldRenderer", "@wayward/game/renderer/world/WorldLayerRenderer", "@wayward/game/renderer/world/WorldRenderer", "@wayward/game/ui/component/Button", "@wayward/game/ui/component/CheckButton", "@wayward/game/ui/component/Divider", "@wayward/game/ui/component/RangeRow", "@wayward/game/ui/component/Text", "@wayward/game/utilities/enum/Enums", "@wayward/utilities/Decorators", "@wayward/utilities/event/EventManager", "@wayward/utilities/promise/Async", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, EventManager_1, Translation_1, UiTranslation_1, Mod_1, IRenderer_1, WebGlShaders_1, IWorldRenderer_1, WorldLayerRenderer_1, WorldRenderer_1, Button_1, CheckButton_1, Divider_1, RangeRow_1, Text_1, Enums_1, Decorators_1, EventManager_2, Async_1, IDebugTools_1, DebugToolsPanel_1) {
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
                .event.subscribe("activate", this.resetRenderer)
                .appendTo(this);
            new Button_1.default()
                .setType(Button_1.ButtonType.Warning)
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonLoseWebGlContext))
                .event.subscribe("activate", this.loseWebGlContext)
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
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonReloadTextures))
                .event.subscribe("activate", ui.reloadTextures)
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
        resetRenderer() {
            game.initializeRenderer();
        }
        loseWebGlContext() {
            game.loseWebGlContext();
        }
        refreshTiles() {
            renderer?.worldRenderer.updateAllTiles();
        }
        async reloadShaders() {
            await (0, WebGlShaders_1.loadWebGlShaders)();
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
        (0, EventManager_2.OwnEventHandler)(DisplayPanel, "switchTo")
    ], DisplayPanel.prototype, "onSwitchTo", null);
    __decorate([
        (0, EventManager_1.EventHandler)(WorldRenderer_1.WorldRenderer, "updateZoom")
    ], DisplayPanel.prototype, "onUpdateZoom", null);
    __decorate([
        Decorators_1.Bound
    ], DisplayPanel.prototype, "resetRenderer", null);
    __decorate([
        Decorators_1.Bound
    ], DisplayPanel.prototype, "loseWebGlContext", null);
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
        (0, EventManager_1.EventHandler)(WorldLayerRenderer_1.WorldLayerRenderer, "getRenderFlags")
    ], DisplayPanel.prototype, "getRenderFlags", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzcGxheVBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0Rpc3BsYXlQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUEwQkgsTUFBcUIsWUFBYSxTQUFRLHlCQUFlO1FBU3hEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztpQkFDM0QsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxLQUFLLEtBQUssQ0FBQztpQkFDcEYsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztpQkFDekMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLG9CQUFvQixDQUFDLENBQUM7aUJBQ2hFLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsS0FBSyxLQUFLLENBQUM7aUJBQ3pGLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7aUJBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsRUFBRTtpQkFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQztpQkFDdEQsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVB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
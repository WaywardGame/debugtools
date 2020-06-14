var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "event/EventEmitter", "event/EventManager", "game/IGame", "mod/Mod", "mod/ModRegistry", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/Component", "newui/component/ContextMenu", "newui/component/RangeRow", "newui/input/Bind", "newui/input/Bindable", "newui/input/InputManager", "newui/screen/screens/game/util/movement/MovementHandler", "newui/screen/screens/GameScreen", "newui/screen/screens/menu/component/Spacer", "renderer/IWorldRenderer", "renderer/WorldRenderer", "utilities/math/Vector2", "utilities/math/Vector3", "utilities/TileHelpers", "../../action/Paint", "../../IDebugTools", "../../overlay/Overlays", "../../overlay/SelectionOverlay", "../../util/TilePosition", "../component/DebugToolsPanel", "../paint/Corpse", "../paint/Creature", "../paint/Doodad", "../paint/NPC", "../paint/Terrain", "../paint/TileEvent"], function (require, exports, ActionExecutor_1, EventEmitter_1, EventManager_1, IGame_1, Mod_1, ModRegistry_1, BlockRow_1, Button_1, CheckButton_1, Component_1, ContextMenu_1, RangeRow_1, Bind_1, Bindable_1, InputManager_1, MovementHandler_1, GameScreen_1, Spacer_1, IWorldRenderer_1, WorldRenderer_1, Vector2_1, Vector3_1, TileHelpers_1, Paint_1, IDebugTools_1, Overlays_1, SelectionOverlay_1, TilePosition_1, DebugToolsPanel_1, Corpse_1, Creature_1, Doodad_1, NPC_1, Terrain_1, TileEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const paintSections = [
        Terrain_1.default,
        Creature_1.default,
        NPC_1.default,
        Doodad_1.default,
        Corpse_1.default,
        TileEvent_1.default,
    ];
    let PaintPanel = (() => {
        class PaintPanel extends DebugToolsPanel_1.default {
            constructor() {
                super();
                this.paintSections = [];
                this.painting = false;
                this.paintTiles = [];
                this.maxSprites = 1024;
                this.paintSections.splice(0, Infinity);
                this.paintSections.push(...paintSections
                    .map(cls => new cls()
                    .event.subscribe("change", this.onPaintSectionChange)
                    .appendTo(this)));
                new Spacer_1.default().appendTo(this);
                this.paintRow = new Component_1.default()
                    .classes.add("debug-tools-paint-row")
                    .append(this.paintRadius = new RangeRow_1.RangeRow()
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRadius)))
                    .editRange(range => range
                    .setMin(0)
                    .setMax(5)
                    .setRefreshMethod(() => 0)
                    .setTooltip(tooltip => tooltip.addText(text => text
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRadiusTooltip)))))
                    .setDisplayValue(true)
                    .addDefaultButton(() => 0))
                    .append(new BlockRow_1.BlockRow()
                    .classes.add("real-paint-row")
                    .append(this.paintButton = new CheckButton_1.CheckButton()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPaint))
                    .event.subscribe("toggle", (_, paint) => {
                    this.paintRow.classes.toggle(this.painting = paint, "painting");
                    if (!paint)
                        this.clearPaint();
                }))
                    .append(new Button_1.default()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPaintClear))
                    .setTooltip(tooltip => tooltip.addText(text => text.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TooltipPaintClear))))
                    .event.subscribe("activate", this.clearPaint))
                    .append(new Button_1.default()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPaintComplete))
                    .setTooltip(tooltip => tooltip.addText(text => text.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TooltipPaintComplete))))
                    .event.subscribe("activate", this.completePaint)));
            }
            getTranslation() {
                return IDebugTools_1.DebugToolsTranslation.PanelPaint;
            }
            canClientMove() {
                if (this.painting)
                    return false;
                return undefined;
            }
            getMaxSpritesForLayer(_, maxSprites) {
                return this.maxSprites = maxSprites + (this.painting ? this.paintTiles.length * 4 : 0);
            }
            onContextMenuBind(api) {
                for (const paintSection of this.paintSections) {
                    if (paintSection.isChanging() && api.mouse.isWithin(paintSection)) {
                        this.showPaintSectionResetMenu(paintSection);
                        return true;
                    }
                }
                return false;
            }
            onStartPaintOrErasePaint(api) {
                return this.painting && !!(GameScreen_1.gameScreen === null || GameScreen_1.gameScreen === void 0 ? void 0 : GameScreen_1.gameScreen.mouseStartWasWithin(api));
            }
            onPaint(api) {
                if (!this.painting || !(GameScreen_1.gameScreen === null || GameScreen_1.gameScreen === void 0 ? void 0 : GameScreen_1.gameScreen.mouseStartWasWithin(api)))
                    return false;
                const tilePosition = renderer.screenToTile(...api.mouse.position.xy);
                if (!tilePosition)
                    return false;
                const direction = Vector2_1.default.direction(tilePosition, this.lastPaintPosition = this.lastPaintPosition || tilePosition);
                let interpolatedPosition = new Vector2_1.default(this.lastPaintPosition);
                for (let i = 0; i < 300; i++) {
                    interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintPosition, tilePosition);
                    const paintPosition = interpolatedPosition.floor(new Vector2_1.default());
                    for (const [paintTilePosition] of TileHelpers_1.default.tilesInRange(new Vector3_1.default(paintPosition, localPlayer.z), this.paintRadius.value, true)) {
                        SelectionOverlay_1.default.add(paintTilePosition);
                        const tileId = TilePosition_1.getTileId(paintTilePosition.x, paintTilePosition.y, localPlayer.z);
                        if (!this.paintTiles.includes(tileId))
                            this.paintTiles.push(tileId);
                    }
                    if (paintPosition.equals(tilePosition))
                        break;
                }
                this.lastPaintPosition = tilePosition;
                this.updateOverlayBatch();
                game.updateView(IGame_1.RenderSource.Mod, false);
                return true;
            }
            onErasePaint(api) {
                if (!this.painting || !(GameScreen_1.gameScreen === null || GameScreen_1.gameScreen === void 0 ? void 0 : GameScreen_1.gameScreen.mouseStartWasWithin(api)))
                    return false;
                const tilePosition = renderer.screenToTile(...api.mouse.position.xy);
                if (!tilePosition)
                    return false;
                const direction = Vector2_1.default.direction(tilePosition, this.lastPaintPosition = this.lastPaintPosition || tilePosition);
                let interpolatedPosition = new Vector2_1.default(this.lastPaintPosition);
                for (let i = 0; i < 300; i++) {
                    interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintPosition, tilePosition);
                    const paintPosition = interpolatedPosition.floor(new Vector2_1.default());
                    for (const [paintTilePosition] of TileHelpers_1.default.tilesInRange(new Vector3_1.default(paintPosition, localPlayer.z), this.paintRadius.value, true)) {
                        SelectionOverlay_1.default.remove(paintTilePosition);
                        const tileId = TilePosition_1.getTileId(paintTilePosition.x, paintTilePosition.y, localPlayer.z);
                        const index = this.paintTiles.indexOf(tileId);
                        if (index > -1)
                            this.paintTiles.splice(index, 1);
                    }
                    if (paintPosition.equals(tilePosition))
                        break;
                }
                this.lastPaintPosition = tilePosition;
                this.updateOverlayBatch();
                game.updateView(IGame_1.RenderSource.Mod, false);
                return true;
            }
            onStopPaint(api) {
                if (this.painting && !api.input.isHolding(this.DEBUG_TOOLS.bindablePaint) && !api.input.isHolding(this.DEBUG_TOOLS.bindableErasePaint))
                    delete this.lastPaintPosition;
                return false;
            }
            onCancelPaint() {
                if (!this.painting)
                    return false;
                this.paintButton.setChecked(false);
                return true;
            }
            onClearPaint() {
                if (!this.painting)
                    return false;
                this.clearPaint();
                return true;
            }
            onCompletePaint() {
                if (!this.painting)
                    return false;
                this.completePaint();
                return true;
            }
            onSwitchTo() {
                this.getParent().classes.add("debug-tools-paint-panel");
                this.paintRow.appendTo(this.getParent().getParent());
                Bind_1.default.registerHandlers(this);
            }
            onSwitchAway() {
                var _a;
                Bind_1.default.deregisterHandlers(this);
                this.paintButton.setChecked(false);
                this.paintRow.store();
                (_a = this.getParent()) === null || _a === void 0 ? void 0 : _a.classes.remove("debug-tools-paint-panel");
            }
            updateOverlayBatch() {
                if (this.paintTiles.length * 4 - 512 < this.maxSprites || this.paintTiles.length * 4 + 512 > this.maxSprites) {
                    renderer.initializeSpriteBatch(IWorldRenderer_1.SpriteBatchLayer.Overlay, true);
                }
            }
            onPaintSectionChange(paintSection) {
                if (paintSection.isChanging() && !this.painting) {
                    this.paintButton.setChecked(true);
                }
            }
            showPaintSectionResetMenu(paintSection) {
                new ContextMenu_1.default(["Lock Inspection", {
                        translation: IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ResetPaintSection),
                        onActivate: () => paintSection.reset(),
                    }])
                    .addAllDescribedOptions()
                    .setPosition(...InputManager_1.default.mouse.position.xy)
                    .schedule(GameScreen_1.gameScreen.setContextMenu);
            }
            completePaint() {
                const paintData = {};
                for (const paintSection of this.paintSections) {
                    Object.assign(paintData, paintSection.getTilePaintData());
                }
                ActionExecutor_1.default.get(Paint_1.default).execute(localPlayer, [...this.paintTiles], paintData);
                this.clearPaint();
            }
            clearPaint() {
                for (const tileId of this.paintTiles) {
                    const position = TilePosition_1.getTilePosition(tileId);
                    const tile = game.getTile(...position);
                    TileHelpers_1.default.Overlay.remove(tile, Overlays_1.default.isPaint);
                }
                this.paintTiles.splice(0, Infinity);
                this.updateOverlayBatch();
                game.updateView(IGame_1.RenderSource.Mod, false);
            }
        }
        __decorate([
            Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
        ], PaintPanel.prototype, "DEBUG_TOOLS", void 0);
        __decorate([
            Override
        ], PaintPanel.prototype, "getTranslation", null);
        __decorate([
            EventManager_1.EventHandler(MovementHandler_1.default, "canMove")
        ], PaintPanel.prototype, "canClientMove", null);
        __decorate([
            EventManager_1.EventHandler(WorldRenderer_1.default, "getMaxSpritesForLayer")
        ], PaintPanel.prototype, "getMaxSpritesForLayer", null);
        __decorate([
            Bind_1.default.onDown(Bindable_1.default.MenuContextMenu, EventEmitter_1.Priority.High)
        ], PaintPanel.prototype, "onContextMenuBind", null);
        __decorate([
            Bind_1.default.onDown(ModRegistry_1.Registry(IDebugTools_1.DEBUG_TOOLS_ID).get("bindablePaint"), EventEmitter_1.Priority.High),
            Bind_1.default.onDown(ModRegistry_1.Registry(IDebugTools_1.DEBUG_TOOLS_ID).get("bindableErasePaint"), EventEmitter_1.Priority.High)
        ], PaintPanel.prototype, "onStartPaintOrErasePaint", null);
        __decorate([
            Bind_1.default.onHolding(ModRegistry_1.Registry(IDebugTools_1.DEBUG_TOOLS_ID).get("bindablePaint"))
        ], PaintPanel.prototype, "onPaint", null);
        __decorate([
            Bind_1.default.onHolding(ModRegistry_1.Registry(IDebugTools_1.DEBUG_TOOLS_ID).get("bindableErasePaint"))
        ], PaintPanel.prototype, "onErasePaint", null);
        __decorate([
            Bind_1.default.onUp(ModRegistry_1.Registry(IDebugTools_1.DEBUG_TOOLS_ID).get("bindablePaint")),
            Bind_1.default.onUp(ModRegistry_1.Registry(IDebugTools_1.DEBUG_TOOLS_ID).get("bindableErasePaint"))
        ], PaintPanel.prototype, "onStopPaint", null);
        __decorate([
            Bind_1.default.onDown(ModRegistry_1.Registry(IDebugTools_1.DEBUG_TOOLS_ID).get("bindableCancelPaint"), EventEmitter_1.Priority.High)
        ], PaintPanel.prototype, "onCancelPaint", null);
        __decorate([
            Bind_1.default.onDown(ModRegistry_1.Registry(IDebugTools_1.DEBUG_TOOLS_ID).get("bindableClearPaint"), EventEmitter_1.Priority.High)
        ], PaintPanel.prototype, "onClearPaint", null);
        __decorate([
            Bind_1.default.onDown(ModRegistry_1.Registry(IDebugTools_1.DEBUG_TOOLS_ID).get("bindableCompletePaint"), EventEmitter_1.Priority.High)
        ], PaintPanel.prototype, "onCompletePaint", null);
        __decorate([
            EventManager_1.OwnEventHandler(PaintPanel, "switchTo")
        ], PaintPanel.prototype, "onSwitchTo", null);
        __decorate([
            EventManager_1.OwnEventHandler(PaintPanel, "switchAway")
        ], PaintPanel.prototype, "onSwitchAway", null);
        __decorate([
            Bound
        ], PaintPanel.prototype, "onPaintSectionChange", null);
        __decorate([
            Bound
        ], PaintPanel.prototype, "showPaintSectionResetMenu", null);
        __decorate([
            Bound
        ], PaintPanel.prototype, "completePaint", null);
        __decorate([
            Bound
        ], PaintPanel.prototype, "clearPaint", null);
        return PaintPanel;
    })();
    exports.default = PaintPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFpbnRQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9QYWludFBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWdGQSxNQUFNLGFBQWEsR0FBZ0M7UUFDbEQsaUJBQVk7UUFDWixrQkFBYTtRQUNiLGFBQVE7UUFDUixnQkFBVztRQUNYLGdCQUFXO1FBQ1gsbUJBQWM7S0FDZCxDQUFDO0lBRUY7UUFBQSxNQUFxQixVQUFXLFNBQVEseUJBQWU7WUFldEQ7Z0JBQ0MsS0FBSyxFQUFFLENBQUM7Z0JBWFEsa0JBQWEsR0FBb0IsRUFBRSxDQUFDO2dCQUs3QyxhQUFRLEdBQUcsS0FBSyxDQUFDO2dCQUNSLGVBQVUsR0FBYSxFQUFFLENBQUM7Z0JBRW5DLGVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBS3pCLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFdkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxhQUFhO3FCQUN0QyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRTtxQkFDbkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDO3FCQUNwRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVwQixJQUFJLGdCQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRTVCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBUyxFQUFFO3FCQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDO3FCQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLG1CQUFRLEVBQUU7cUJBQ3ZDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFP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
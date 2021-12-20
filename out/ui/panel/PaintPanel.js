var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventEmitter", "event/EventManager", "mod/Mod", "mod/ModRegistry", "renderer/IRenderer", "renderer/world/IWorldRenderer", "renderer/world/WorldRenderer", "ui/component/BlockRow", "ui/component/Button", "ui/component/CheckButton", "ui/component/Component", "ui/component/ContextMenu", "ui/component/RangeRow", "ui/input/Bind", "ui/input/Bindable", "ui/input/InputManager", "ui/screen/screens/game/util/movement/MovementHandler", "utilities/Decorators", "utilities/game/TileHelpers", "utilities/math/Vector2", "utilities/math/Vector3", "../../action/Paint", "../../IDebugTools", "../../overlay/Overlays", "../../overlay/SelectionOverlay", "../../util/TilePosition", "../component/DebugToolsPanel", "../paint/Corpse", "../paint/Creature", "../paint/Doodad", "../paint/NPC", "../paint/Terrain", "../paint/TileEvent"], function (require, exports, EventEmitter_1, EventManager_1, Mod_1, ModRegistry_1, IRenderer_1, IWorldRenderer_1, WorldRenderer_1, BlockRow_1, Button_1, CheckButton_1, Component_1, ContextMenu_1, RangeRow_1, Bind_1, Bindable_1, InputManager_1, MovementHandler_1, Decorators_1, TileHelpers_1, Vector2_1, Vector3_1, Paint_1, IDebugTools_1, Overlays_1, SelectionOverlay_1, TilePosition_1, DebugToolsPanel_1, Corpse_1, Creature_1, Doodad_1, NPC_1, Terrain_1, TileEvent_1) {
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
            this.paintRow = new Component_1.default()
                .classes.add("debug-tools-paint-row")
                .append(this.paintRadius = new RangeRow_1.RangeRow()
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.PaintRadius)))
                .editRange(range => range
                .setMin(0)
                .setMax(5)
                .setRefreshMethod(() => 0)
                .setTooltip(tooltip => tooltip.addText(text => text
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.PaintRadiusTooltip)))))
                .setDisplayValue(true)
                .addDefaultButton(() => 0))
                .append(new BlockRow_1.BlockRow()
                .classes.add("real-paint-row")
                .append(this.paintButton = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonPaint))
                .event.subscribe("toggle", (_, paint) => {
                this.paintRow.classes.toggle(this.painting = paint, "painting");
                if (!paint)
                    this.clearPaint();
            }))
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonPaintClear))
                .setTooltip(tooltip => tooltip.addText(text => text.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.TooltipPaintClear))))
                .event.subscribe("activate", this.clearPaint))
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonPaintComplete))
                .setTooltip(tooltip => tooltip.addText(text => text.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.TooltipPaintComplete))))
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
            return this.painting && !!(gameScreen === null || gameScreen === void 0 ? void 0 : gameScreen.mouseStartWasWithin(api));
        }
        onPaint(api) {
            if (!this.painting || !(gameScreen === null || gameScreen === void 0 ? void 0 : gameScreen.mouseStartWasWithin(api)) || !renderer)
                return false;
            const tilePosition = renderer.worldRenderer.screenToTile(...api.mouse.position.xy);
            if (!tilePosition)
                return false;
            const direction = Vector2_1.default.direction(tilePosition, this.lastPaintPosition = this.lastPaintPosition || tilePosition);
            let interpolatedPosition = new Vector2_1.default(this.lastPaintPosition);
            for (let i = 0; i < 300; i++) {
                interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintPosition, tilePosition);
                const paintPosition = interpolatedPosition.floor(new Vector2_1.default());
                for (const [paintTilePosition] of TileHelpers_1.default.tilesInRange(localIsland, new Vector3_1.default(paintPosition, localPlayer.z), this.paintRadius.value, true)) {
                    SelectionOverlay_1.default.add(paintTilePosition);
                    const tileId = (0, TilePosition_1.getTileId)(paintTilePosition.x, paintTilePosition.y, localPlayer.z);
                    if (!this.paintTiles.includes(tileId))
                        this.paintTiles.push(tileId);
                }
                if (paintPosition.equals(tilePosition))
                    break;
            }
            this.lastPaintPosition = tilePosition;
            this.updateOverlayBatch();
            game.updateView(IRenderer_1.RenderSource.Mod, false);
            return true;
        }
        onErasePaint(api) {
            if (!this.painting || !(gameScreen === null || gameScreen === void 0 ? void 0 : gameScreen.mouseStartWasWithin(api)) || !renderer)
                return false;
            const tilePosition = renderer.worldRenderer.screenToTile(...api.mouse.position.xy);
            if (!tilePosition)
                return false;
            const direction = Vector2_1.default.direction(tilePosition, this.lastPaintPosition = this.lastPaintPosition || tilePosition);
            let interpolatedPosition = new Vector2_1.default(this.lastPaintPosition);
            for (let i = 0; i < 300; i++) {
                interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintPosition, tilePosition);
                const paintPosition = interpolatedPosition.floor(new Vector2_1.default());
                for (const [paintTilePosition] of TileHelpers_1.default.tilesInRange(localIsland, new Vector3_1.default(paintPosition, localPlayer.z), this.paintRadius.value, true)) {
                    SelectionOverlay_1.default.remove(paintTilePosition);
                    const tileId = (0, TilePosition_1.getTileId)(paintTilePosition.x, paintTilePosition.y, localPlayer.z);
                    const index = this.paintTiles.indexOf(tileId);
                    if (index > -1)
                        this.paintTiles.splice(index, 1);
                }
                if (paintPosition.equals(tilePosition))
                    break;
            }
            this.lastPaintPosition = tilePosition;
            this.updateOverlayBatch();
            game.updateView(IRenderer_1.RenderSource.Mod, false);
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
            this.clearPaint();
            this.painting = false;
            this.paintButton.setChecked(false);
            this.paintRow.store(this);
            (_a = this.getParent()) === null || _a === void 0 ? void 0 : _a.classes.remove("debug-tools-paint-panel");
        }
        updateOverlayBatch() {
            if (this.paintTiles.length * 4 - 512 < this.maxSprites || this.paintTiles.length * 4 + 512 > this.maxSprites) {
                renderer.worldRenderer.initializeSpriteBatch(IWorldRenderer_1.SpriteBatchLayer.Overlay);
            }
        }
        onPaintSectionChange(paintSection) {
            if (paintSection.isChanging() && !this.painting) {
                this.paintButton.setChecked(true);
            }
        }
        showPaintSectionResetMenu(paintSection) {
            new ContextMenu_1.default(["Lock Inspection", {
                    translation: (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ResetPaintSection),
                    onActivate: () => paintSection.reset(),
                }])
                .addAllDescribedOptions()
                .setPosition(...InputManager_1.default.mouse.position.xy)
                .schedule(gameScreen.setContextMenu);
        }
        completePaint() {
            const paintData = {};
            for (const paintSection of this.paintSections) {
                Object.assign(paintData, paintSection.getTilePaintData());
            }
            Paint_1.default.execute(localPlayer, [...this.paintTiles], paintData);
            this.clearPaint();
        }
        clearPaint() {
            for (const tileId of this.paintTiles) {
                const position = (0, TilePosition_1.getTilePosition)(tileId);
                const tile = localIsland.getTile(...position);
                TileHelpers_1.default.Overlay.remove(tile, Overlays_1.default.isPaint);
            }
            this.paintTiles.splice(0, Infinity);
            this.updateOverlayBatch();
            game.updateView(IRenderer_1.RenderSource.Mod, false);
        }
    }
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], PaintPanel.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        (0, EventManager_1.EventHandler)(MovementHandler_1.default, "canMove")
    ], PaintPanel.prototype, "canClientMove", null);
    __decorate([
        (0, EventManager_1.EventHandler)(WorldRenderer_1.default, "getMaxSpritesForLayer")
    ], PaintPanel.prototype, "getMaxSpritesForLayer", null);
    __decorate([
        Bind_1.default.onDown(Bindable_1.default.MenuContextMenu, EventEmitter_1.Priority.High)
    ], PaintPanel.prototype, "onContextMenuBind", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)(IDebugTools_1.DEBUG_TOOLS_ID).get("bindablePaint"), EventEmitter_1.Priority.High),
        Bind_1.default.onDown((0, ModRegistry_1.Registry)(IDebugTools_1.DEBUG_TOOLS_ID).get("bindableErasePaint"), EventEmitter_1.Priority.High)
    ], PaintPanel.prototype, "onStartPaintOrErasePaint", null);
    __decorate([
        Bind_1.default.onHolding((0, ModRegistry_1.Registry)(IDebugTools_1.DEBUG_TOOLS_ID).get("bindablePaint"))
    ], PaintPanel.prototype, "onPaint", null);
    __decorate([
        Bind_1.default.onHolding((0, ModRegistry_1.Registry)(IDebugTools_1.DEBUG_TOOLS_ID).get("bindableErasePaint"))
    ], PaintPanel.prototype, "onErasePaint", null);
    __decorate([
        Bind_1.default.onUp((0, ModRegistry_1.Registry)(IDebugTools_1.DEBUG_TOOLS_ID).get("bindablePaint")),
        Bind_1.default.onUp((0, ModRegistry_1.Registry)(IDebugTools_1.DEBUG_TOOLS_ID).get("bindableErasePaint"))
    ], PaintPanel.prototype, "onStopPaint", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)(IDebugTools_1.DEBUG_TOOLS_ID).get("bindableCancelPaint"), EventEmitter_1.Priority.High)
    ], PaintPanel.prototype, "onCancelPaint", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)(IDebugTools_1.DEBUG_TOOLS_ID).get("bindableClearPaint"), EventEmitter_1.Priority.High)
    ], PaintPanel.prototype, "onClearPaint", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)(IDebugTools_1.DEBUG_TOOLS_ID).get("bindableCompletePaint"), EventEmitter_1.Priority.High)
    ], PaintPanel.prototype, "onCompletePaint", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(PaintPanel, "switchTo")
    ], PaintPanel.prototype, "onSwitchTo", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(PaintPanel, "switchAway")
    ], PaintPanel.prototype, "onSwitchAway", null);
    __decorate([
        Decorators_1.Bound
    ], PaintPanel.prototype, "onPaintSectionChange", null);
    __decorate([
        Decorators_1.Bound
    ], PaintPanel.prototype, "showPaintSectionResetMenu", null);
    __decorate([
        Decorators_1.Bound
    ], PaintPanel.prototype, "completePaint", null);
    __decorate([
        Decorators_1.Bound
    ], PaintPanel.prototype, "clearPaint", null);
    exports.default = PaintPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFpbnRQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9QYWludFBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQThFQSxNQUFNLGFBQWEsR0FBZ0M7UUFDbEQsaUJBQVk7UUFDWixrQkFBYTtRQUNiLGFBQVE7UUFDUixnQkFBVztRQUNYLGdCQUFXO1FBQ1gsbUJBQWM7S0FDZCxDQUFDO0lBRUYsTUFBcUIsVUFBVyxTQUFRLHlCQUFlO1FBZXREO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFYUSxrQkFBYSxHQUFvQixFQUFFLENBQUM7WUFLN0MsYUFBUSxHQUFHLEtBQUssQ0FBQztZQUNSLGVBQVUsR0FBYSxFQUFFLENBQUM7WUFFbkMsZUFBVSxHQUFHLElBQUksQ0FBQztZQUt6QixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFdkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxhQUFhO2lCQUN0QyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRTtpQkFDbkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDO2lCQUNwRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXBCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBUyxFQUFFO2lCQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDO2lCQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLG1CQUFRLEVBQUU7aUJBQ3ZDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ2hGLFNBQVMs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
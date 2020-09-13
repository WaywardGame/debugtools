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
            if (!this.painting || !(GameScreen_1.gameScreen === null || GameScreen_1.gameScreen === void 0 ? void 0 : GameScreen_1.gameScreen.mouseStartWasWithin(api)) || !renderer)
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
            if (!this.painting || !(GameScreen_1.gameScreen === null || GameScreen_1.gameScreen === void 0 ? void 0 : GameScreen_1.gameScreen.mouseStartWasWithin(api)) || !renderer)
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
    exports.default = PaintPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFpbnRQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9QYWludFBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWdGQSxNQUFNLGFBQWEsR0FBZ0M7UUFDbEQsaUJBQVk7UUFDWixrQkFBYTtRQUNiLGFBQVE7UUFDUixnQkFBVztRQUNYLGdCQUFXO1FBQ1gsbUJBQWM7S0FDZCxDQUFDO0lBRUYsTUFBcUIsVUFBVyxTQUFRLHlCQUFlO1FBZXREO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFYUSxrQkFBYSxHQUFvQixFQUFFLENBQUM7WUFLN0MsYUFBUSxHQUFHLEtBQUssQ0FBQztZQUNSLGVBQVUsR0FBYSxFQUFFLENBQUM7WUFFbkMsZUFBVSxHQUFHLElBQUksQ0FBQztZQUt6QixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFdkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxhQUFhO2lCQUN0QyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRTtpQkFDbkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDO2lCQUNwRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXBCLElBQUksZ0JBQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUU1QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksbUJBQVMsRUFBRTtpQkFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQztpQkFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxtQkFBUSxFQUFFO2lCQUN2QyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHlCQUFXLENB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
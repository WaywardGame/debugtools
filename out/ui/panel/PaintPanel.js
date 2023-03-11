var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventEmitter", "event/EventManager", "mod/Mod", "mod/ModRegistry", "renderer/IRenderer", "renderer/world/IWorldRenderer", "renderer/world/WorldRenderer", "ui/component/BlockRow", "ui/component/Button", "ui/component/CheckButton", "ui/component/Component", "ui/component/ContextMenu", "ui/component/RangeRow", "ui/input/Bind", "ui/input/Bindable", "ui/input/InputManager", "ui/screen/screens/game/util/movement/MovementHandler", "utilities/Decorators", "utilities/math/Vector2", "../../IDebugTools", "../../action/Paint", "../../overlay/Overlays", "../../overlay/SelectionOverlay", "../component/DebugToolsPanel", "../paint/Corpse", "../paint/Creature", "../paint/Doodad", "../paint/NPC", "../paint/Terrain", "../paint/TileEvent"], function (require, exports, EventEmitter_1, EventManager_1, Mod_1, ModRegistry_1, IRenderer_1, IWorldRenderer_1, WorldRenderer_1, BlockRow_1, Button_1, CheckButton_1, Component_1, ContextMenu_1, RangeRow_1, Bind_1, Bindable_1, InputManager_1, MovementHandler_1, Decorators_1, Vector2_1, IDebugTools_1, Paint_1, Overlays_1, SelectionOverlay_1, DebugToolsPanel_1, Corpse_1, Creature_1, Doodad_1, NPC_1, Terrain_1, TileEvent_1) {
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
            this.paintTiles = new Set();
            this.maxSprites = 1024;
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
                .setTooltip(tooltip => tooltip.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.PaintRadiusTooltip))))
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
                .setTooltip(tooltip => tooltip.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.TooltipPaintClear)))
                .event.subscribe("activate", this.clearPaint))
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonPaintComplete))
                .setTooltip(tooltip => tooltip.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.TooltipPaintComplete)))
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
            return this.maxSprites = maxSprites + (this.painting ? this.paintTiles.size * 4 : 0);
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
            return this.painting && !!gameScreen?.mouseStartWasWithin(api);
        }
        onPaint(api) {
            if (!this.painting || !gameScreen?.mouseStartWasWithin(api) || !renderer) {
                return false;
            }
            const tilePosition = renderer.worldRenderer.screenToTile(...api.mouse.position.xy);
            if (!tilePosition || this.lastPaintPosition === tilePosition) {
                return false;
            }
            this.lastPaintPosition = tilePosition;
            let shouldUpdateView = false;
            const direction = Vector2_1.default.direction(tilePosition, this.lastPaintPosition = this.lastPaintPosition || tilePosition);
            let interpolatedPosition = new Vector2_1.default(this.lastPaintPosition);
            for (let i = 0; i < 300; i++) {
                interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintPosition, tilePosition);
                const paintPosition = interpolatedPosition.floor(new Vector2_1.default());
                for (const paintTile of localIsland.getTileFromPoint({ x: paintPosition.x, y: paintPosition.y, z: localPlayer.z }).tilesInRange(this.paintRadius.value, true)) {
                    if (SelectionOverlay_1.default.add(paintTile)) {
                        shouldUpdateView = true;
                        this.paintTiles.add(paintTile);
                    }
                }
                if (paintPosition.equals(tilePosition)) {
                    break;
                }
            }
            if (shouldUpdateView) {
                this.updateOverlayBatch();
                localPlayer.updateView(IRenderer_1.RenderSource.Mod, false);
            }
            return true;
        }
        onErasePaint(api) {
            if (!this.painting || !gameScreen?.mouseStartWasWithin(api) || !renderer) {
                return false;
            }
            const tilePosition = renderer.worldRenderer.screenToTile(...api.mouse.position.xy);
            if (!tilePosition || this.lastPaintPosition === tilePosition) {
                return false;
            }
            this.lastPaintPosition = tilePosition;
            let shouldUpdateView = false;
            const direction = Vector2_1.default.direction(tilePosition, this.lastPaintPosition = this.lastPaintPosition || tilePosition);
            let interpolatedPosition = new Vector2_1.default(this.lastPaintPosition);
            for (let i = 0; i < 300; i++) {
                interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintPosition, tilePosition);
                const paintPosition = interpolatedPosition.floor(new Vector2_1.default());
                for (const paintTile of localIsland.getTileFromPoint({ x: paintPosition.x, y: paintPosition.y, z: localPlayer.z }).tilesInRange(this.paintRadius.value, true)) {
                    if (SelectionOverlay_1.default.remove(paintTile)) {
                        shouldUpdateView = true;
                        this.paintTiles.delete(paintTile);
                    }
                }
                if (paintPosition.equals(tilePosition)) {
                    break;
                }
            }
            if (shouldUpdateView) {
                this.updateOverlayBatch();
                localPlayer.updateView(IRenderer_1.RenderSource.Mod, false);
            }
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
            this.painting = false;
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
            Bind_1.default.deregisterHandlers(this);
            this.clearPaint();
            this.painting = false;
            this.paintButton.setChecked(false);
            this.paintRow.store(this.getParent().getParent().getParent().getParent());
            this.getParent()?.classes.remove("debug-tools-paint-panel");
            this.paintSections.length = 0;
        }
        onWillRemove() {
            this.paintSections.length = 0;
        }
        updateOverlayBatch() {
            if (this.paintTiles.size * 4 - 512 < this.maxSprites || this.paintTiles.size * 4 + 512 > this.maxSprites) {
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
            Paint_1.default.execute(localPlayer, Array.from(this.paintTiles), paintData);
            this.clearPaint();
        }
        clearPaint() {
            for (const tile of this.paintTiles) {
                tile.removeOverlay(Overlays_1.default.isPaint);
            }
            this.paintTiles.clear();
            this.updateOverlayBatch();
            localPlayer.updateView(IRenderer_1.RenderSource.Mod, false);
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
        Bind_1.default.onHolding((0, ModRegistry_1.Registry)(IDebugTools_1.DEBUG_TOOLS_ID).get("bindablePaint"), EventEmitter_1.Priority.High)
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
        (0, EventManager_1.OwnEventHandler)(PaintPanel, "willRemove")
    ], PaintPanel.prototype, "onWillRemove", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFpbnRQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9QYWludFBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTRFQSxNQUFNLGFBQWEsR0FBZ0M7UUFDbEQsaUJBQVk7UUFDWixrQkFBYTtRQUNiLGFBQVE7UUFDUixnQkFBVztRQUNYLGdCQUFXO1FBQ1gsbUJBQWM7S0FDZCxDQUFDO0lBRUYsTUFBcUIsVUFBVyxTQUFRLHlCQUFlO1FBZXREO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFYUSxrQkFBYSxHQUFvQixFQUFFLENBQUM7WUFLN0MsYUFBUSxHQUFHLEtBQUssQ0FBQztZQUNSLGVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBUSxDQUFDO1lBRXRDLGVBQVUsR0FBRyxJQUFJLENBQUM7WUFLekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxhQUFhO2lCQUN0QyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRTtpQkFDbkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDO2lCQUNwRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXBCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBUyxFQUFFO2lCQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDO2lCQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLG1CQUFRLEVBQUU7aUJBQ3ZDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ2hGLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUs7aUJBQ3ZCLE1BQU0sQ0FBQyxDQUFDLENBQUM7aUJBQ1QsTUFBTSxDQUFDLENBQUMsQ0FBQztpQkFDVCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3pCLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUMvRixlQUFlLENBQUMsSUFBSSxDQUFDO2lCQUNyQixnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDM0IsTUFBTSxDQUFDLElBQUksbUJBQVEsRUFBRTtpQkFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSx5QkFBVyxFQUFFO2lCQUMxQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN2RCxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUNoRSxJQUFJLENBQUMsS0FBSztvQkFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7aUJBQ0gsTUFBTSxDQUFDLElBQUksZ0JBQU0sRUFBRTtpQkFDbEIsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUM1RCxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7aUJBQzVGLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDOUMsTUFBTSxDQUFDLElBQUksZ0JBQU0sRUFBRTtpQkFDbEIsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2lCQUMvRCxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7aUJBQy9GLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUVlLGNBQWM7WUFDN0IsT0FBTyxtQ0FBcUIsQ0FBQyxVQUFVLENBQUM7UUFDekMsQ0FBQztRQU9TLGFBQWE7WUFDdEIsSUFBSSxJQUFJLENBQUMsUUFBUTtnQkFBRSxPQUFPLEtBQUssQ0FBQztZQUVoQyxPQUFPLFNBQVMsQ0FBQztRQUNsQixDQUFDO1FBR1MscUJBQXFCLENBQUMsQ0FBTSxFQUFFLFVBQWtCO1lBQ3pELE9BQU8sSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RGLENBQUM7UUFHUyxpQkFBaUIsQ0FBQyxHQUFvQjtZQUMvQyxLQUFLLE1BQU0sWUFBWSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQzlDLElBQUksWUFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFO29CQUNsRSxJQUFJLENBQUMseUJBQXlCLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQzdDLE9BQU8sSUFBSSxDQUFDO2lCQUNaO2FBQ0Q7WUFFRCxPQUFPLEtBQUssQ0FBQztRQUNkLENBQUM7UUFJUyx3QkFBd0IsQ0FBQyxHQUFvQjtZQUN0RCxPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBR1MsT0FBTyxDQUFDLEdBQW9CO1lBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsVUFBVSxFQUFFLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUN6RSxPQUFPLEtBQUssQ0FBQzthQUNiO1lBRUQsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNuRixJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxZQUFZLEVBQUU7Z0JBQzdELE9BQU8sS0FBSyxDQUFDO2FBQ2I7WUFFRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsWUFBWSxDQUFDO1lBRXRDLElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1lBRTdCLE1BQU0sU0FBUyxHQUFHLGlCQUFPLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixJQUFJLFlBQVksQ0FBQyxDQUFDO1lBRW5ILElBQUksb0JBQW9CLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQy9ELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzdCLG9CQUFvQixHQUFHLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUV2RyxNQUFNLGFBQWEsR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxpQkFBTyxFQUFFLENBQUMsQ0FBQztnQkFFaEUsS0FBSyxNQUFNLFNBQVMsSUFBSSxXQUFXLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFO29CQUM5SixJQUFJLDBCQUFnQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTt3QkFDcEMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO3dCQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztxQkFDL0I7aUJBQ0Q7Z0JBRUQsSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFO29CQUN2QyxNQUFNO2lCQUNOO2FBQ0Q7WUFFRCxJQUFJLGdCQUFnQixFQUFFO2dCQUNyQixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDMUIsV0FBVyxDQUFDLFVBQVUsQ0FBQyx3QkFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNoRDtZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUdTLFlBQVksQ0FBQyxHQUFvQjtZQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDekUsT0FBTyxLQUFLLENBQUM7YUFDYjtZQUVELE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbkYsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsaUJBQWlCLEtBQUssWUFBWSxFQUFFO2dCQUM3RCxPQUFPLEtBQUssQ0FBQzthQUNiO1lBRUQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFlBQVksQ0FBQztZQUV0QyxJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztZQUU3QixNQUFNLFNBQVMsR0FBRyxpQkFBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxZQUFZLENBQUMsQ0FBQztZQUVuSCxJQUFJLG9CQUFvQixHQUFHLElBQUksaUJBQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUMvRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM3QixvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFFdkcsTUFBTSxhQUFhLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxDQUFDLElBQUksaUJBQU8sRUFBRSxDQUFDLENBQUM7Z0JBRWhFLEtBQUssTUFBTSxTQUFTLElBQUksV0FBVyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDOUosSUFBSSwwQkFBZ0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUU7d0JBQ3ZDLGdCQUFnQixHQUFHLElBQUksQ0FBQzt3QkFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7cUJBQ2xDO2lCQUNEO2dCQUVELElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTtvQkFDdkMsTUFBTTtpQkFDTjthQUNEO1lBRUQsSUFBSSxnQkFBZ0IsRUFBRTtnQkFDckIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQzFCLFdBQVcsQ0FBQyxVQUFVLENBQUMsd0JBQVksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDaEQ7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFJUyxXQUFXLENBQUMsR0FBb0I7WUFDekMsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUM7Z0JBQ3JJLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO1lBRS9CLE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUdTLGFBQWE7WUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO2dCQUNqQixPQUFPLEtBQUssQ0FBQztZQUNkLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25DLE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUdTLFlBQVk7WUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO2dCQUNqQixPQUFPLEtBQUssQ0FBQztZQUVkLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFHUyxlQUFlO1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtnQkFDakIsT0FBTyxLQUFLLENBQUM7WUFFZCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBR1MsVUFBVTtZQUNuQixJQUFJLENBQUMsU0FBUyxFQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUcsQ0FBQyxTQUFTLEVBQUcsQ0FBQyxDQUFDO1lBRXZELGNBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBR1MsWUFBWTtZQUNyQixjQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFOUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBR25DLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUcsQ0FBQyxTQUFTLEVBQUcsQ0FBQyxTQUFTLEVBQUcsQ0FBQyxTQUFTLEVBQUcsQ0FBQyxDQUFDO1lBQzlFLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFFNUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFHUyxZQUFZO1lBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMvQixDQUFDO1FBTU8sa0JBQWtCO1lBQ3pCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDekcsUUFBUyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxpQ0FBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN4RTtRQUNGLENBQUM7UUFHTyxvQkFBb0IsQ0FBQyxZQUEyQjtZQUN2RCxJQUFJLFlBQVksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2hELElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xDO1FBQ0YsQ0FBQztRQUdPLHlCQUF5QixDQUFDLFlBQTJCO1lBQzVELElBQUkscUJBQVcsQ0FBQyxDQUFDLGlCQUFpQixFQUFFO29CQUNuQyxXQUFXLEVBQUUsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGlCQUFpQixDQUFDO29CQUNqRSxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRTtpQkFDdEMsQ0FBQyxDQUFDO2lCQUNELHNCQUFzQixFQUFFO2lCQUN4QixXQUFXLENBQUMsR0FBRyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO2lCQUM5QyxRQUFRLENBQUMsVUFBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFHTyxhQUFhO1lBQ3BCLE1BQU0sU0FBUyxHQUFlLEVBQUUsQ0FBQztZQUNqQyxLQUFLLE1BQU0sWUFBWSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQzlDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7YUFDMUQ7WUFFRCxlQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUVuRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUdPLFVBQVU7WUFDakIsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNuQyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDckM7WUFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRXhCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzFCLFdBQVcsQ0FBQyxVQUFVLENBQUMsd0JBQVksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDakQsQ0FBQztLQUNEO0lBaFNnQjtRQURmLGFBQUcsQ0FBQyxRQUFRLENBQWEsNEJBQWMsQ0FBQzttREFDRDtJQTBEOUI7UUFEVCxJQUFBLDJCQUFZLEVBQUMseUJBQWUsRUFBRSxTQUFTLENBQUM7bURBS3hDO0lBR1M7UUFEVCxJQUFBLDJCQUFZLEVBQUMsdUJBQWEsRUFBRSx1QkFBdUIsQ0FBQzsyREFHcEQ7SUFHUztRQURULGNBQUksQ0FBQyxNQUFNLENBQUMsa0JBQVEsQ0FBQyxlQUFlLEVBQUUsdUJBQVEsQ0FBQyxJQUFJLENBQUM7dURBVXBEO0lBSVM7UUFGVCxjQUFJLENBQUMsTUFBTSxDQUFDLElBQUEsc0JBQVEsRUFBYSw0QkFBYyxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFLHVCQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3JGLGNBQUksQ0FBQyxNQUFNLENBQUMsSUFBQSxzQkFBUSxFQUFhLDRCQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsRUFBRSx1QkFBUSxDQUFDLElBQUksQ0FBQzs4REFHMUY7SUFHUztRQURULGNBQUksQ0FBQyxTQUFTLENBQUMsSUFBQSxzQkFBUSxFQUFhLDRCQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsdUJBQVEsQ0FBQyxJQUFJLENBQUM7NkNBeUN4RjtJQUdTO1FBRFQsY0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFBLHNCQUFRLEVBQWEsNEJBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2tEQXlDOUU7SUFJUztRQUZULGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBQSxzQkFBUSxFQUFhLDRCQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDcEUsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFBLHNCQUFRLEVBQWEsNEJBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2lEQU16RTtJQUdTO1FBRFQsY0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFBLHNCQUFRLEVBQWEsNEJBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLHVCQUFRLENBQUMsSUFBSSxDQUFDO21EQU8zRjtJQUdTO1FBRFQsY0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFBLHNCQUFRLEVBQWEsNEJBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLHVCQUFRLENBQUMsSUFBSSxDQUFDO2tEQU8xRjtJQUdTO1FBRFQsY0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFBLHNCQUFRLEVBQWEsNEJBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLHVCQUFRLENBQUMsSUFBSSxDQUFDO3FEQU83RjtJQUdTO1FBRFQsSUFBQSw4QkFBZSxFQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7Z0RBTXZDO0lBR1M7UUFEVCxJQUFBLDhCQUFlLEVBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQztrREFhekM7SUFHUztRQURULElBQUEsOEJBQWUsRUFBQyxVQUFVLEVBQUUsWUFBWSxDQUFDO2tEQUd6QztJQWFPO1FBRFAsa0JBQUs7MERBS0w7SUFHTztRQURQLGtCQUFLOytEQVNMO0lBR087UUFEUCxrQkFBSzttREFVTDtJQUdPO1FBRFAsa0JBQUs7Z0RBVUw7SUFsU0YsNkJBbVNDIn0=
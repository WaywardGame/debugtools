var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventEmitter", "event/EventManager", "mod/Mod", "mod/ModRegistry", "renderer/IRenderer", "ui/component/BlockRow", "ui/component/Button", "ui/component/CheckButton", "ui/component/Component", "ui/component/ContextMenu", "ui/component/RangeRow", "ui/input/Bind", "ui/input/Bindable", "ui/input/InputManager", "ui/screen/screens/game/util/movement/MovementHandler", "utilities/Decorators", "utilities/math/Vector2", "../../IDebugTools", "../../action/Paint", "../../overlay/SelectionOverlay", "../component/DebugToolsPanel", "../paint/Corpse", "../paint/Creature", "../paint/Doodad", "../paint/NPC", "../paint/Terrain", "../paint/TileEvent"], function (require, exports, EventEmitter_1, EventManager_1, Mod_1, ModRegistry_1, IRenderer_1, BlockRow_1, Button_1, CheckButton_1, Component_1, ContextMenu_1, RangeRow_1, Bind_1, Bindable_1, InputManager_1, MovementHandler_1, Decorators_1, Vector2_1, IDebugTools_1, Paint_1, SelectionOverlay_1, DebugToolsPanel_1, Corpse_1, Creature_1, Doodad_1, NPC_1, Terrain_1, TileEvent_1) {
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
            if (!tilePosition || this.lastPaintTile === tilePosition) {
                return false;
            }
            this.lastPaintTile = tilePosition;
            let shouldUpdateView = false;
            const direction = Vector2_1.default.direction(tilePosition, this.lastPaintTile = this.lastPaintTile || tilePosition);
            let interpolatedPosition = new Vector2_1.default(this.lastPaintTile);
            for (let i = 0; i < 300; i++) {
                interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintTile, tilePosition);
                const paintPosition = interpolatedPosition.floor(new Vector2_1.default());
                const tile = localIsland.getTileSafe(paintPosition.x, paintPosition.y, localPlayer.z);
                if (!tile) {
                    break;
                }
                for (const paintTile of tile.tilesInRange(this.paintRadius.value, true)) {
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
                localPlayer.updateView(IRenderer_1.RenderSource.Mod, false);
            }
            return true;
        }
        onErasePaint(api) {
            if (!this.painting || !gameScreen?.mouseStartWasWithin(api) || !renderer) {
                return false;
            }
            const tilePosition = renderer.worldRenderer.screenToTile(...api.mouse.position.xy);
            if (!tilePosition || this.lastPaintTile === tilePosition) {
                return false;
            }
            this.lastPaintTile = tilePosition;
            let shouldUpdateView = false;
            const direction = Vector2_1.default.direction(tilePosition, this.lastPaintTile = this.lastPaintTile || tilePosition);
            let interpolatedPosition = new Vector2_1.default(this.lastPaintTile);
            for (let i = 0; i < 300; i++) {
                interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintTile, tilePosition);
                const paintPosition = interpolatedPosition.floor(new Vector2_1.default());
                const tile = localIsland.getTileSafe(paintPosition.x, paintPosition.y, localPlayer.z);
                if (!tile) {
                    break;
                }
                for (const paintTile of tile.tilesInRange(this.paintRadius.value, true)) {
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
                localPlayer.updateView(IRenderer_1.RenderSource.Mod, false);
            }
            return true;
        }
        onStopPaint(api) {
            if (this.painting && !api.input.isHolding(this.DEBUG_TOOLS.bindablePaint) && !api.input.isHolding(this.DEBUG_TOOLS.bindableErasePaint))
                delete this.lastPaintTile;
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
            Paint_1.default.execute(localPlayer, Array.from(this.paintTiles.keys()), paintData);
            this.clearPaint();
        }
        clearPaint() {
            for (const tile of this.paintTiles) {
                SelectionOverlay_1.default.remove(tile);
            }
            this.paintTiles.clear();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFpbnRQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9QYWludFBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXdFQSxNQUFNLGFBQWEsR0FBZ0M7UUFDbEQsaUJBQVk7UUFDWixrQkFBYTtRQUNiLGFBQVE7UUFDUixnQkFBVztRQUNYLGdCQUFXO1FBQ1gsbUJBQWM7S0FDZCxDQUFDO0lBRUYsTUFBcUIsVUFBVyxTQUFRLHlCQUFlO1FBY3REO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFWUSxrQkFBYSxHQUFvQixFQUFFLENBQUM7WUFLN0MsYUFBUSxHQUFHLEtBQUssQ0FBQztZQUNSLGVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBUSxDQUFDO1lBTTdDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsYUFBYTtpQkFDdEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUU7aUJBQ25CLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztpQkFDcEQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVwQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksbUJBQVMsRUFBRTtpQkFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQztpQkFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxtQkFBUSxFQUFFO2lCQUN2QyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2lCQUNoRixTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLO2lCQUN2QixNQUFNLENBQUMsQ0FBQyxDQUFDO2lCQUNULE1BQU0sQ0FBQyxDQUFDLENBQUM7aUJBQ1QsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUN6QixVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDL0YsZUFBZSxDQUFDLElBQUksQ0FBQztpQkFDckIsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzNCLE1BQU0sQ0FBQyxJQUFJLG1CQUFRLEVBQUU7aUJBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDMUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDdkQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDaEUsSUFBSSxDQUFDLEtBQUs7b0JBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDO2lCQUNILE1BQU0sQ0FBQyxJQUFJLGdCQUFNLEVBQUU7aUJBQ2xCLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDNUQsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2lCQUM1RixLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQzlDLE1BQU0sQ0FBQyxJQUFJLGdCQUFNLEVBQUU7aUJBQ2xCLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztpQkFDL0QsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2lCQUMvRixLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFFZSxjQUFjO1lBQzdCLE9BQU8sbUNBQXFCLENBQUMsVUFBVSxDQUFDO1FBQ3pDLENBQUM7UUFPUyxhQUFhO1lBQ3RCLElBQUksSUFBSSxDQUFDLFFBQVE7Z0JBQUUsT0FBTyxLQUFLLENBQUM7WUFFaEMsT0FBTyxTQUFTLENBQUM7UUFDbEIsQ0FBQztRQUdTLGlCQUFpQixDQUFDLEdBQW9CO1lBQy9DLEtBQUssTUFBTSxZQUFZLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDOUMsSUFBSSxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUU7b0JBQ2xFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDN0MsT0FBTyxJQUFJLENBQUM7aUJBQ1o7YUFDRDtZQUVELE9BQU8sS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUlTLHdCQUF3QixDQUFDLEdBQW9CO1lBQ3RELE9BQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7UUFHUyxPQUFPLENBQUMsR0FBb0I7WUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3pFLE9BQU8sS0FBSyxDQUFDO2FBQ2I7WUFFRCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25GLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxZQUFZLEVBQUU7Z0JBQ3pELE9BQU8sS0FBSyxDQUFDO2FBQ2I7WUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztZQUVsQyxJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztZQUU3QixNQUFNLFNBQVMsR0FBRyxpQkFBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLFlBQVksQ0FBQyxDQUFDO1lBRTNHLElBQUksb0JBQW9CLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMzRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM3QixvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBRW5HLE1BQU0sYUFBYSxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxJQUFJLGlCQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUVoRSxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RGLElBQUksQ0FBQyxJQUFJLEVBQUU7b0JBQ1YsTUFBTTtpQkFDTjtnQkFFRCxLQUFLLE1BQU0sU0FBUyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0JBQ3hFLElBQUksMEJBQWdCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO3dCQUNwQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7d0JBQ3hCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO3FCQUMvQjtpQkFDRDtnQkFFRCxJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUU7b0JBQ3ZDLE1BQU07aUJBQ047YUFDRDtZQUVELElBQUksZ0JBQWdCLEVBQUU7Z0JBQ3JCLFdBQVcsQ0FBQyxVQUFVLENBQUMsd0JBQVksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDaEQ7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFHUyxZQUFZLENBQUMsR0FBb0I7WUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3pFLE9BQU8sS0FBSyxDQUFDO2FBQ2I7WUFFRCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25GLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxZQUFZLEVBQUU7Z0JBQ3pELE9BQU8sS0FBSyxDQUFDO2FBQ2I7WUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztZQUVsQyxJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztZQUU3QixNQUFNLFNBQVMsR0FBRyxpQkFBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLFlBQVksQ0FBQyxDQUFDO1lBRTNHLElBQUksb0JBQW9CLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMzRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM3QixvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBRW5HLE1BQU0sYUFBYSxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxJQUFJLGlCQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUVoRSxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RGLElBQUksQ0FBQyxJQUFJLEVBQUU7b0JBQ1YsTUFBTTtpQkFDTjtnQkFFRCxLQUFLLE1BQU0sU0FBUyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0JBQ3hFLElBQUksMEJBQWdCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFO3dCQUN2QyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7d0JBQ3hCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3FCQUNsQztpQkFDRDtnQkFFRCxJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUU7b0JBQ3ZDLE1BQU07aUJBQ047YUFDRDtZQUVELElBQUksZ0JBQWdCLEVBQUU7Z0JBQ3JCLFdBQVcsQ0FBQyxVQUFVLENBQUMsd0JBQVksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDaEQ7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFJUyxXQUFXLENBQUMsR0FBb0I7WUFDekMsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUM7Z0JBQ3JJLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUUzQixPQUFPLEtBQUssQ0FBQztRQUNkLENBQUM7UUFHUyxhQUFhO1lBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtnQkFDakIsT0FBTyxLQUFLLENBQUM7WUFDZCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQyxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFHUyxZQUFZO1lBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtnQkFDakIsT0FBTyxLQUFLLENBQUM7WUFFZCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbEIsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBR1MsZUFBZTtZQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7Z0JBQ2pCLE9BQU8sS0FBSyxDQUFDO1lBRWQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUdTLFVBQVU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsRUFBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFHLENBQUMsU0FBUyxFQUFHLENBQUMsQ0FBQztZQUV2RCxjQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQUdTLFlBQVk7WUFDckIsY0FBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTlCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUduQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFHLENBQUMsU0FBUyxFQUFHLENBQUMsU0FBUyxFQUFHLENBQUMsU0FBUyxFQUFHLENBQUMsQ0FBQztZQUM5RSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBRTVELElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMvQixDQUFDO1FBR1MsWUFBWTtZQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQU9PLG9CQUFvQixDQUFDLFlBQTJCO1lBQ3ZELElBQUksWUFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDaEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbEM7UUFDRixDQUFDO1FBR08seUJBQXlCLENBQUMsWUFBMkI7WUFDNUQsSUFBSSxxQkFBVyxDQUFDLENBQUMsaUJBQWlCLEVBQUU7b0JBQ25DLFdBQVcsRUFBRSxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsaUJBQWlCLENBQUM7b0JBQ2pFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFO2lCQUN0QyxDQUFDLENBQUM7aUJBQ0Qsc0JBQXNCLEVBQUU7aUJBQ3hCLFdBQVcsQ0FBQyxHQUFHLHNCQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7aUJBQzlDLFFBQVEsQ0FBQyxVQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUdPLGFBQWE7WUFDcEIsTUFBTSxTQUFTLEdBQWUsRUFBRSxDQUFDO1lBQ2pDLEtBQUssTUFBTSxZQUFZLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQzthQUMxRDtZQUVELGVBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRTFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNuQixDQUFDO1FBR08sVUFBVTtZQUNqQixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ25DLDBCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM5QjtZQUVELElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFeEIsV0FBVyxDQUFDLFVBQVUsQ0FBQyx3QkFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqRCxDQUFDO0tBQ0Q7SUEzUmdCO1FBRGYsYUFBRyxDQUFDLFFBQVEsQ0FBYSw0QkFBYyxDQUFDO21EQUNEO0lBeUQ5QjtRQURULElBQUEsMkJBQVksRUFBQyx5QkFBZSxFQUFFLFNBQVMsQ0FBQzttREFLeEM7SUFHUztRQURULGNBQUksQ0FBQyxNQUFNLENBQUMsa0JBQVEsQ0FBQyxlQUFlLEVBQUUsdUJBQVEsQ0FBQyxJQUFJLENBQUM7dURBVXBEO0lBSVM7UUFGVCxjQUFJLENBQUMsTUFBTSxDQUFDLElBQUEsc0JBQVEsRUFBYSw0QkFBYyxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFLHVCQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3JGLGNBQUksQ0FBQyxNQUFNLENBQUMsSUFBQSxzQkFBUSxFQUFhLDRCQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsRUFBRSx1QkFBUSxDQUFDLElBQUksQ0FBQzs4REFHMUY7SUFHUztRQURULGNBQUksQ0FBQyxTQUFTLENBQUMsSUFBQSxzQkFBUSxFQUFhLDRCQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsdUJBQVEsQ0FBQyxJQUFJLENBQUM7NkNBNkN4RjtJQUdTO1FBRFQsY0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFBLHNCQUFRLEVBQWEsNEJBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2tEQTZDOUU7SUFJUztRQUZULGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBQSxzQkFBUSxFQUFhLDRCQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDcEUsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFBLHNCQUFRLEVBQWEsNEJBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2lEQU16RTtJQUdTO1FBRFQsY0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFBLHNCQUFRLEVBQWEsNEJBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLHVCQUFRLENBQUMsSUFBSSxDQUFDO21EQU8zRjtJQUdTO1FBRFQsY0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFBLHNCQUFRLEVBQWEsNEJBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLHVCQUFRLENBQUMsSUFBSSxDQUFDO2tEQU8xRjtJQUdTO1FBRFQsY0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFBLHNCQUFRLEVBQWEsNEJBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLHVCQUFRLENBQUMsSUFBSSxDQUFDO3FEQU83RjtJQUdTO1FBRFQsSUFBQSw4QkFBZSxFQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7Z0RBTXZDO0lBR1M7UUFEVCxJQUFBLDhCQUFlLEVBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQztrREFhekM7SUFHUztRQURULElBQUEsOEJBQWUsRUFBQyxVQUFVLEVBQUUsWUFBWSxDQUFDO2tEQUd6QztJQU9PO1FBRFAsa0JBQUs7MERBS0w7SUFHTztRQURQLGtCQUFLOytEQVNMO0lBR087UUFEUCxrQkFBSzttREFVTDtJQUdPO1FBRFAsa0JBQUs7Z0RBU0w7SUE3UkYsNkJBOFJDIn0=
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "game/IGame", "mod/IHookHost", "mod/IHookManager", "mod/Mod", "newui/BindingManager", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/ContextMenu", "newui/screen/screens/menu/component/Spacer", "renderer/IWorldRenderer", "utilities/math/Vector2", "utilities/Objects", "utilities/TileHelpers", "../../action/Paint", "../../IDebugTools", "../../overlay/Overlays", "../../overlay/SelectionOverlay", "../../util/TilePosition", "../component/DebugToolsPanel", "../paint/Corpse", "../paint/Creature", "../paint/Doodad", "../paint/NPC", "../paint/Terrain", "../paint/TileEvent"], function (require, exports, ActionExecutor_1, IGame_1, IHookHost_1, IHookManager_1, Mod_1, BindingManager_1, BlockRow_1, Button_1, CheckButton_1, ContextMenu_1, Spacer_1, IWorldRenderer_1, Vector2_1, Objects_1, TileHelpers_1, Paint_1, IDebugTools_1, Overlays_1, SelectionOverlay_1, TilePosition_1, DebugToolsPanel_1, Corpse_1, Creature_1, Doodad_1, NPC_1, Terrain_1, TileEvent_1) {
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
                .on("change", this.onPaintSectionChange)
                .appendTo(this)));
            new Spacer_1.default().appendTo(this);
            this.paintRow = new BlockRow_1.BlockRow()
                .classes.add("debug-tools-paint-row")
                .append(this.paintButton = new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPaint))
                .on(CheckButton_1.CheckButtonEvent.Change, (_, paint) => {
                this.paintRow.classes.toggle(this.painting = paint, "painting");
                if (!paint)
                    this.clearPaint();
            }))
                .append(new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPaintClear))
                .setTooltip(tooltip => tooltip.addText(text => text.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TooltipPaintClear))))
                .on(Button_1.ButtonEvent.Activate, this.clearPaint))
                .append(new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPaintComplete))
                .setTooltip(tooltip => tooltip.addText(text => text.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TooltipPaintComplete))))
                .on(Button_1.ButtonEvent.Activate, this.completePaint));
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo, this.onSwitchTo);
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway, this.onSwitchAway);
        }
        getTranslation() {
            return IDebugTools_1.DebugToolsTranslation.PanelPaint;
        }
        canClientMove(api) {
            if (this.painting)
                return false;
            return undefined;
        }
        getMaxSpritesForLayer(layer, maxSprites) {
            if (this.painting) {
                return this.maxSprites = maxSprites + this.paintTiles.length * 4;
            }
            this.maxSprites = maxSprites;
            return undefined;
        }
        onBindLoop(bindPressed, api) {
            if (api.wasPressed(BindingManager_1.Bindable.MenuContextMenu) && !bindPressed) {
                for (const paintSection of this.paintSections) {
                    if (paintSection.isChanging() && api.isMouseWithin(paintSection)) {
                        this.showPaintSectionResetMenu(paintSection);
                        bindPressed = BindingManager_1.Bindable.MenuContextMenu;
                    }
                }
            }
            if (this.painting) {
                if (api.isDown(this.DEBUG_TOOLS.bindablePaint) && gameScreen.wasMouseStartWithin()) {
                    const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);
                    const direction = Vector2_1.default.direction(tilePosition, this.lastPaintPosition = this.lastPaintPosition || tilePosition);
                    let interpolatedPosition = new Vector2_1.default(this.lastPaintPosition);
                    for (let i = 0; i < 300; i++) {
                        interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintPosition, tilePosition);
                        const paintPosition = interpolatedPosition.floor(new Vector2_1.default());
                        SelectionOverlay_1.default.add(paintPosition);
                        const tileId = TilePosition_1.getTileId(paintPosition.x, paintPosition.y, localPlayer.z);
                        if (!this.paintTiles.includes(tileId))
                            this.paintTiles.push(tileId);
                        if (paintPosition.equals(tilePosition))
                            break;
                    }
                    this.lastPaintPosition = tilePosition;
                    this.updateOverlayBatch();
                    game.updateView(IGame_1.RenderSource.Mod, false);
                    bindPressed = this.DEBUG_TOOLS.bindablePaint;
                }
                if (api.isDown(this.DEBUG_TOOLS.bindableErasePaint) && gameScreen.wasMouseStartWithin()) {
                    const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);
                    const direction = Vector2_1.default.direction(tilePosition, this.lastPaintPosition = this.lastPaintPosition || tilePosition);
                    let interpolatedPosition = new Vector2_1.default(this.lastPaintPosition);
                    for (let i = 0; i < 300; i++) {
                        interpolatedPosition = interpolatedPosition.add(direction).clamp(this.lastPaintPosition, tilePosition);
                        const paintPosition = interpolatedPosition.floor(new Vector2_1.default());
                        SelectionOverlay_1.default.remove(paintPosition);
                        const tileId = TilePosition_1.getTileId(paintPosition.x, paintPosition.y, localPlayer.z);
                        const index = this.paintTiles.indexOf(tileId);
                        if (index > -1)
                            this.paintTiles.splice(index, 1);
                        if (paintPosition.equals(tilePosition))
                            break;
                    }
                    this.lastPaintPosition = tilePosition;
                    this.updateOverlayBatch();
                    game.updateView(IGame_1.RenderSource.Mod, false);
                    bindPressed = this.DEBUG_TOOLS.bindableErasePaint;
                }
                if (!bindPressed)
                    delete this.lastPaintPosition;
                if (api.wasPressed(this.DEBUG_TOOLS.bindableCancelPaint)) {
                    this.paintButton.setChecked(false);
                    bindPressed = this.DEBUG_TOOLS.bindableCancelPaint;
                }
                if (api.wasPressed(this.DEBUG_TOOLS.bindableClearPaint)) {
                    this.clearPaint();
                    bindPressed = this.DEBUG_TOOLS.bindableClearPaint;
                }
                if (api.wasPressed(this.DEBUG_TOOLS.bindableCompletePaint)) {
                    this.completePaint();
                    bindPressed = this.DEBUG_TOOLS.bindableCompletePaint;
                }
            }
            return bindPressed;
        }
        updateOverlayBatch() {
            if (this.paintTiles.length * 4 - 512 < this.maxSprites || this.paintTiles.length * 4 + 512 > this.maxSprites) {
                renderer.initializeSpriteBatch(IWorldRenderer_1.SpriteBatchLayer.Overlay, true);
            }
        }
        onSwitchTo() {
            this.getParent().classes.add("debug-tools-paint-panel");
            this.paintRow.appendTo(this.getParent().getParent());
            hookManager.register(this, "DebugToolsDialog:PaintPanel")
                .until(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway);
        }
        onSwitchAway() {
            this.paintButton.setChecked(false);
            this.paintRow.store();
            const parent = this.getParent();
            if (parent) {
                parent.classes.remove("debug-tools-paint-panel");
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
                .setPosition(...BindingManager_1.bindingManager.getMouse().xy)
                .schedule(gameScreen.setContextMenu);
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
        IHookHost_1.HookMethod
    ], PaintPanel.prototype, "canClientMove", null);
    __decorate([
        IHookHost_1.HookMethod
    ], PaintPanel.prototype, "getMaxSpritesForLayer", null);
    __decorate([
        Override, IHookHost_1.HookMethod(IHookManager_1.HookPriority.High)
    ], PaintPanel.prototype, "onBindLoop", null);
    __decorate([
        Objects_1.Bound
    ], PaintPanel.prototype, "onSwitchTo", null);
    __decorate([
        Objects_1.Bound
    ], PaintPanel.prototype, "onSwitchAway", null);
    __decorate([
        Objects_1.Bound
    ], PaintPanel.prototype, "onPaintSectionChange", null);
    __decorate([
        Objects_1.Bound
    ], PaintPanel.prototype, "showPaintSectionResetMenu", null);
    __decorate([
        Objects_1.Bound
    ], PaintPanel.prototype, "completePaint", null);
    __decorate([
        Objects_1.Bound
    ], PaintPanel.prototype, "clearPaint", null);
    exports.default = PaintPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFpbnRQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9QYWludFBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQW1FQSxNQUFNLGFBQWEsR0FBZ0M7UUFDbEQsaUJBQVk7UUFDWixrQkFBYTtRQUNiLGFBQVE7UUFDUixnQkFBVztRQUNYLGdCQUFXO1FBQ1gsbUJBQWM7S0FDZCxDQUFDO0lBRUYsTUFBcUIsVUFBVyxTQUFRLHlCQUFlO1FBY3REO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFWUSxrQkFBYSxHQUFvQixFQUFFLENBQUM7WUFJN0MsYUFBUSxHQUFHLEtBQUssQ0FBQztZQUNSLGVBQVUsR0FBYSxFQUFFLENBQUM7WUFFbkMsZUFBVSxHQUFHLElBQUksQ0FBQztZQUt6QixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFdkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxhQUFhO2lCQUN0QyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRTtpQkFDbkIsRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUM7aUJBQ3ZDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFcEIsSUFBSSxnQkFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTVCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBUSxFQUFFO2lCQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDO2lCQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHlCQUFXLEVBQUU7aUJBQzFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN2RCxFQUFFLENBQVksOEJB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
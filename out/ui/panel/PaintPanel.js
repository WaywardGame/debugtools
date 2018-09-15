var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "mod/IHookHost", "mod/IHookManager", "mod/Mod", "newui/BindingManager", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/ContextMenu", "newui/screen/IScreen", "newui/screen/screens/menu/component/Spacer", "utilities/math/Vector2", "utilities/Objects", "utilities/TileHelpers", "../../Actions", "../../IDebugTools", "../../overlay/Overlays", "../../overlay/SelectionOverlay", "../../util/TilePosition", "../component/DebugToolsPanel", "../paint/Corpse", "../paint/Creature", "../paint/Doodad", "../paint/NPC", "../paint/Terrain", "../paint/TileEvent"], function (require, exports, Enums_1, IHookHost_1, IHookManager_1, Mod_1, BindingManager_1, BlockRow_1, Button_1, CheckButton_1, ContextMenu_1, IScreen_1, Spacer_1, Vector2_1, Objects_1, TileHelpers_1, Actions_1, IDebugTools_1, Overlays_1, SelectionOverlay_1, TilePosition_1, DebugToolsPanel_1, Corpse_1, Creature_1, Doodad_1, NPC_1, Terrain_1, TileEvent_1) {
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
        constructor(gsapi) {
            super(gsapi);
            this.paintSections = [];
            this.painting = false;
            this.paintTiles = [];
            this.maxSprites = 1024;
            this.paintSections.splice(0, Infinity);
            this.paintSections.push(...paintSections
                .map(cls => new cls(this.api)
                .on("change", this.onPaintSectionChange)
                .appendTo(this)));
            new Spacer_1.default(this.api).appendTo(this);
            this.paintRow = new BlockRow_1.BlockRow(this.api)
                .classes.add("debug-tools-paint-row")
                .append(this.paintButton = new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPaint))
                .on(CheckButton_1.CheckButtonEvent.Change, (_, paint) => {
                this.paintRow.classes.toggle(this.painting = paint, "painting");
                if (!paint)
                    this.clearPaint();
            }))
                .append(new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPaintClear))
                .setTooltip(tooltip => tooltip.addText(text => text.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TooltipPaintClear))))
                .on(Button_1.ButtonEvent.Activate, this.clearPaint))
                .append(new Button_1.default(this.api)
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
            if (api.wasPressed(Enums_1.Bindable.MenuContextMenu) && !bindPressed) {
                for (const paintSection of this.paintSections) {
                    if (paintSection.isChanging() && api.isMouseWithin(paintSection)) {
                        this.showPaintSectionResetMenu(paintSection);
                        bindPressed = Enums_1.Bindable.MenuContextMenu;
                    }
                }
            }
            if (this.painting) {
                if (api.isDown(this.DEBUG_TOOLS.bindablePaint) && this.gsapi.wasMouseStartWithin()) {
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
                    game.updateView(false);
                    bindPressed = this.DEBUG_TOOLS.bindablePaint;
                }
                if (api.isDown(this.DEBUG_TOOLS.bindableErasePaint) && this.gsapi.wasMouseStartWithin()) {
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
                    game.updateView(false);
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
                renderer.initializeSpriteBatch(Enums_1.SpriteBatchLayer.Overlay, true);
            }
        }
        onSwitchTo() {
            this.parent.classes.add("debug-tools-paint-panel");
            this.paintRow.appendTo(this.parent.parent);
            hookManager.register(this, "DebugToolsDialog:PaintPanel")
                .until(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway);
        }
        onSwitchAway() {
            this.paintButton.setChecked(false);
            this.paintRow.store();
            if (this.parent) {
                this.parent.classes.remove("debug-tools-paint-panel");
            }
        }
        onPaintSectionChange(paintSection) {
            if (paintSection.isChanging() && !this.painting) {
                this.paintButton.setChecked(true);
            }
        }
        showPaintSectionResetMenu(paintSection) {
            new ContextMenu_1.default(this.api, ["Lock Inspection", {
                    translation: IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ResetPaintSection),
                    onActivate: () => paintSection.reset(),
                }])
                .addAllDescribedOptions()
                .setPosition(...BindingManager_1.bindingManager.getMouse().xy)
                .schedule(this.api.getScreen(IScreen_1.ScreenId.Game).setContextMenu);
        }
        completePaint() {
            const paintData = {};
            for (const paintSection of this.paintSections) {
                Object.assign(paintData, paintSection.getTilePaintData());
            }
            Actions_1.default.get("paint").execute({ object: [this.paintTiles, paintData] });
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
            game.updateView(false);
        }
    }
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], PaintPanel.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        IHookHost_1.HookMethod
    ], PaintPanel.prototype, "canClientMove", null);
    __decorate([
        IHookHost_1.HookMethod
    ], PaintPanel.prototype, "getMaxSpritesForLayer", null);
    __decorate([
        IHookHost_1.HookMethod(IHookManager_1.HookPriority.High)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFpbnRQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9QYWludFBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWdFQSxNQUFNLGFBQWEsR0FBMEM7UUFDNUQsaUJBQVk7UUFDWixrQkFBYTtRQUNiLGFBQVE7UUFDUixnQkFBVztRQUNYLGdCQUFXO1FBQ1gsbUJBQWM7S0FDZCxDQUFDO0lBRUYsTUFBcUIsVUFBVyxTQUFRLHlCQUFlO1FBY3RELFlBQW1CLEtBQXFCO1lBQ3ZDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQVZHLGtCQUFhLEdBQW9CLEVBQUUsQ0FBQztZQUk3QyxhQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ1IsZUFBVSxHQUFhLEVBQUUsQ0FBQztZQUVuQyxlQUFVLEdBQUcsSUFBSSxDQUFDO1lBS3pCLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUV2QyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLGFBQWE7aUJBQ3RDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQzNCLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDO2lCQUN2QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXBCLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXBDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUM7aUJBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUkseUJB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
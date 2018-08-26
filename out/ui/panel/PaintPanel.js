var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "mod/IHookHost", "mod/IHookManager", "newui/BindingManager", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/ContextMenu", "newui/screen/IScreen", "newui/screen/screens/menu/component/Spacer", "utilities/math/Vector2", "utilities/Objects", "utilities/TileHelpers", "../../Actions", "../../DebugTools", "../../IDebugTools", "../../overlay/SelectionOverlay", "../../util/TilePosition", "../component/DebugToolsPanel", "../paint/Corpse", "../paint/Creature", "../paint/Doodad", "../paint/NPC", "../paint/Terrain", "../paint/TileEvent"], function (require, exports, Enums_1, IHookHost_1, IHookManager_1, BindingManager_1, BlockRow_1, Button_1, CheckButton_1, ContextMenu_1, IScreen_1, Spacer_1, Vector2_1, Objects_1, TileHelpers_1, Actions_1, DebugTools_1, IDebugTools_1, SelectionOverlay_1, TilePosition_1, DebugToolsPanel_1, Corpse_1, Creature_1, Doodad_1, NPC_1, Terrain_1, TileEvent_1) {
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
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPaint))
                .on(CheckButton_1.CheckButtonEvent.Change, (_, paint) => {
                this.paintRow.classes.toggle(this.painting = paint, "painting");
                if (!paint)
                    this.clearPaint();
            }))
                .append(new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPaintClear))
                .setTooltip(tooltip => tooltip.addText(text => text.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TooltipPaintClear))))
                .on(Button_1.ButtonEvent.Activate, this.clearPaint))
                .append(new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPaintComplete))
                .setTooltip(tooltip => tooltip.addText(text => text.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TooltipPaintComplete))))
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
                if (api.isDown(DebugTools_1.default.INSTANCE.bindablePaint) && this.gsapi.wasMouseStartWithin()) {
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
                    bindPressed = DebugTools_1.default.INSTANCE.bindablePaint;
                }
                if (api.isDown(DebugTools_1.default.INSTANCE.bindableErasePaint) && this.gsapi.wasMouseStartWithin()) {
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
                    bindPressed = DebugTools_1.default.INSTANCE.bindableErasePaint;
                }
                if (!bindPressed)
                    delete this.lastPaintPosition;
                if (api.wasPressed(DebugTools_1.default.INSTANCE.bindableCancelPaint)) {
                    this.paintButton.setChecked(false);
                    bindPressed = DebugTools_1.default.INSTANCE.bindableCancelPaint;
                }
                if (api.wasPressed(DebugTools_1.default.INSTANCE.bindableClearPaint)) {
                    this.clearPaint();
                    bindPressed = DebugTools_1.default.INSTANCE.bindableClearPaint;
                }
                if (api.wasPressed(DebugTools_1.default.INSTANCE.bindableCompletePaint)) {
                    this.completePaint();
                    bindPressed = DebugTools_1.default.INSTANCE.bindableCompletePaint;
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
            this.parent.classes.remove("debug-tools-paint-panel");
        }
        onPaintSectionChange(paintSection) {
            if (paintSection.isChanging() && !this.painting) {
                this.paintButton.setChecked(true);
            }
        }
        showPaintSectionResetMenu(paintSection) {
            new ContextMenu_1.default(this.api, ["Lock Inspection", {
                    translation: DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ResetPaintSection),
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
                TileHelpers_1.default.Overlay.remove(tile, IDebugTools_1.isPaintOverlay);
            }
            this.paintTiles.splice(0, Infinity);
            this.updateOverlayBatch();
            game.updateView(false);
        }
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFpbnRQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9QYWludFBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQThEQSxNQUFNLGFBQWEsR0FBMEM7UUFDNUQsaUJBQVk7UUFDWixrQkFBYTtRQUNiLGFBQVE7UUFDUixnQkFBVztRQUNYLGdCQUFXO1FBQ1gsbUJBQWM7S0FDZCxDQUFDO0lBRUYsTUFBcUIsVUFBVyxTQUFRLHlCQUFlO1FBVXRELFlBQW1CLEtBQXFCO1lBQ3ZDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQVZHLGtCQUFhLEdBQW9CLEVBQUUsQ0FBQztZQUk3QyxhQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ1IsZUFBVSxHQUFhLEVBQUUsQ0FBQztZQUVuQyxlQUFVLEdBQUcsSUFBSSxDQUFDO1lBS3pCLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUV2QyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLGFBQWE7aUJBQ3RDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQzNCLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDO2lCQUN2QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXBCLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXBDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUM7aUJBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUkseUJB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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "mod/IHookHost", "mod/IHookManager", "newui/BindingManager", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/ContextMenu", "newui/screen/IScreen", "newui/screen/screens/menu/component/Spacer", "utilities/Collectors", "utilities/enum/Enums", "utilities/math/Vector2", "utilities/math/Vector3", "utilities/Objects", "utilities/TileHelpers", "../../Actions", "../../DebugTools", "../../IDebugTools", "../../util/TilePosition", "../component/DebugToolsPanel", "../paint/Corpse", "../paint/Creature", "../paint/Doodad", "../paint/NPC", "../paint/Terrain", "../paint/TileEvent"], function (require, exports, Enums_1, IHookHost_1, IHookManager_1, BindingManager_1, BlockRow_1, Button_1, CheckButton_1, ContextMenu_1, IScreen_1, Spacer_1, Collectors_1, Enums_2, Vector2_1, Vector3_1, Objects_1, TileHelpers_1, Actions_1, DebugTools_1, IDebugTools_1, TilePosition_1, DebugToolsPanel_1, Corpse_1, Creature_1, Doodad_1, NPC_1, Terrain_1, TileEvent_1) {
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
                        const tile = game.getTile(paintPosition.x, paintPosition.y, localPlayer.z);
                        if (TileHelpers_1.default.Overlay.add(tile, { type: DebugTools_1.default.INSTANCE.overlayPaint }, IDebugTools_1.isPaintOverlay)) {
                            this.updatePaintOverlay(tile, paintPosition);
                        }
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
                        const tile = game.getTile(paintPosition.x, paintPosition.y, localPlayer.z);
                        if (TileHelpers_1.default.Overlay.remove(tile, IDebugTools_1.isPaintOverlay)) {
                            this.updatePaintOverlay(tile, paintPosition);
                        }
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
            this.painting = false;
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
        updatePaintOverlay(tile, tilePosition, updateNeighbors = true) {
            let neighborTiles;
            let connections;
            const isTilePainted = TileHelpers_1.default.Overlay.remove(tile, IDebugTools_1.isPaintOverlay);
            if (isTilePainted) {
                neighborTiles = this.getNeighborTiles(tilePosition);
                connections = this.getPaintOverlayConnections(neighborTiles);
                const mappedTile = {
                    [SubTilePosition.TopLeft]: paintTileMap[SubTilePosition.TopLeft][getId(SubTilePosition.TopLeft, ...connections)],
                    [SubTilePosition.TopRight]: paintTileMap[SubTilePosition.TopRight][getId(SubTilePosition.TopRight, ...connections)],
                    [SubTilePosition.BottomLeft]: paintTileMap[SubTilePosition.BottomLeft][getId(SubTilePosition.BottomLeft, ...connections)],
                    [SubTilePosition.BottomRight]: paintTileMap[SubTilePosition.BottomRight][getId(SubTilePosition.BottomRight, ...connections)],
                };
                for (const subTilePosition of Enums_2.default.values(SubTilePosition)) {
                    const offset = subTilePositionMap[subTilePosition];
                    if (mappedTile[subTilePosition] === 4) {
                        TileHelpers_1.default.Overlay.add(tile, {
                            type: DebugTools_1.default.INSTANCE.overlayPaint,
                            size: 8,
                            offsetX: 20,
                            offsetY: 4,
                            spriteOffsetX: offset.x / 16,
                            spriteOffsetY: offset.y / 16,
                        });
                        continue;
                    }
                    TileHelpers_1.default.Overlay.add(tile, {
                        type: DebugTools_1.default.INSTANCE.overlayPaint,
                        size: 8,
                        offsetX: mappedTile[subTilePosition] * 16 + offset.x,
                        offsetY: offset.y,
                        spriteOffsetX: offset.x / 16,
                        spriteOffsetY: offset.y / 16,
                    });
                }
            }
            if (!updateNeighbors)
                return;
            neighborTiles = neighborTiles || this.getNeighborTiles(tilePosition);
            connections = connections || this.getPaintOverlayConnections(neighborTiles);
            for (const [neighborPosition, neighborTile] of Objects_1.default.values(neighborTiles)) {
                this.updatePaintOverlay(neighborTile, neighborPosition, false);
            }
        }
        getNeighborTiles(tilePosition) {
            const vectors = getNeighborVectors(tilePosition);
            return Enums_2.default.values(NeighborPosition)
                .map(pos => [pos, [vectors[pos], game.getTile(...vectors[pos].xyz)]])
                .collect(Objects_1.default.create);
        }
        getPaintOverlayConnections(neighbors) {
            return Objects_1.default.keys(neighbors)
                .filter(neighborPosition => TileHelpers_1.default.Overlay.has(neighbors[neighborPosition][1], IDebugTools_1.isPaintOverlay))
                .collect(Collectors_1.default.toArray);
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
    function getNeighborVectors(tilePosition) {
        return {
            [NeighborPosition.TopLeft]: new Vector3_1.default(tilePosition.x - 1, tilePosition.y - 1, localPlayer.z),
            [NeighborPosition.Top]: new Vector3_1.default(tilePosition.x, tilePosition.y - 1, localPlayer.z),
            [NeighborPosition.TopRight]: new Vector3_1.default(tilePosition.x + 1, tilePosition.y - 1, localPlayer.z),
            [NeighborPosition.Right]: new Vector3_1.default(tilePosition.x + 1, tilePosition.y, localPlayer.z),
            [NeighborPosition.BottomRight]: new Vector3_1.default(tilePosition.x + 1, tilePosition.y + 1, localPlayer.z),
            [NeighborPosition.Bottom]: new Vector3_1.default(tilePosition.x, tilePosition.y + 1, localPlayer.z),
            [NeighborPosition.BottomLeft]: new Vector3_1.default(tilePosition.x - 1, tilePosition.y + 1, localPlayer.z),
            [NeighborPosition.Left]: new Vector3_1.default(tilePosition.x - 1, tilePosition.y, localPlayer.z),
        };
    }
    var NeighborPosition;
    (function (NeighborPosition) {
        NeighborPosition["TopLeft"] = "T";
        NeighborPosition["Top"] = "O";
        NeighborPosition["TopRight"] = "P";
        NeighborPosition["Right"] = "R";
        NeighborPosition["BottomRight"] = "B";
        NeighborPosition["Bottom"] = "M";
        NeighborPosition["BottomLeft"] = "L";
        NeighborPosition["Left"] = "E";
    })(NeighborPosition || (NeighborPosition = {}));
    var SubTilePosition;
    (function (SubTilePosition) {
        SubTilePosition[SubTilePosition["TopLeft"] = 0] = "TopLeft";
        SubTilePosition[SubTilePosition["TopRight"] = 1] = "TopRight";
        SubTilePosition[SubTilePosition["BottomLeft"] = 2] = "BottomLeft";
        SubTilePosition[SubTilePosition["BottomRight"] = 3] = "BottomRight";
    })(SubTilePosition || (SubTilePosition = {}));
    const paintTileMap = {
        [SubTilePosition.TopLeft]: {
            [""]: 0,
            [getId(SubTilePosition.TopLeft, NeighborPosition.TopLeft)]: 0,
            [getId(SubTilePosition.TopLeft, NeighborPosition.Top)]: 2,
            [getId(SubTilePosition.TopLeft, NeighborPosition.Top, NeighborPosition.TopLeft)]: 2,
            [getId(SubTilePosition.TopLeft, NeighborPosition.Left)]: 3,
            [getId(SubTilePosition.TopLeft, NeighborPosition.Left, NeighborPosition.TopLeft)]: 3,
            [getId(SubTilePosition.TopLeft, NeighborPosition.Top, NeighborPosition.Left)]: 1,
            [getId(SubTilePosition.TopLeft, NeighborPosition.Top, NeighborPosition.Left, NeighborPosition.TopLeft)]: 4,
        },
        [SubTilePosition.TopRight]: {
            [""]: 0,
            [getId(SubTilePosition.TopRight, NeighborPosition.TopRight)]: 0,
            [getId(SubTilePosition.TopRight, NeighborPosition.Top)]: 2,
            [getId(SubTilePosition.TopRight, NeighborPosition.Top, NeighborPosition.TopRight)]: 2,
            [getId(SubTilePosition.TopRight, NeighborPosition.Right)]: 3,
            [getId(SubTilePosition.TopRight, NeighborPosition.Right, NeighborPosition.TopRight)]: 3,
            [getId(SubTilePosition.TopRight, NeighborPosition.Top, NeighborPosition.Right)]: 1,
            [getId(SubTilePosition.TopRight, NeighborPosition.Top, NeighborPosition.Right, NeighborPosition.TopRight)]: 4,
        },
        [SubTilePosition.BottomLeft]: {
            [""]: 0,
            [getId(SubTilePosition.BottomLeft, NeighborPosition.BottomLeft)]: 0,
            [getId(SubTilePosition.BottomLeft, NeighborPosition.Bottom)]: 2,
            [getId(SubTilePosition.BottomLeft, NeighborPosition.Bottom, NeighborPosition.BottomLeft)]: 2,
            [getId(SubTilePosition.BottomLeft, NeighborPosition.Left)]: 3,
            [getId(SubTilePosition.BottomLeft, NeighborPosition.Left, NeighborPosition.BottomLeft)]: 3,
            [getId(SubTilePosition.BottomLeft, NeighborPosition.Bottom, NeighborPosition.Left)]: 1,
            [getId(SubTilePosition.BottomLeft, NeighborPosition.Bottom, NeighborPosition.Left, NeighborPosition.BottomLeft)]: 4,
        },
        [SubTilePosition.BottomRight]: {
            [""]: 0,
            [getId(SubTilePosition.BottomRight, NeighborPosition.BottomRight)]: 0,
            [getId(SubTilePosition.BottomRight, NeighborPosition.Bottom)]: 2,
            [getId(SubTilePosition.BottomRight, NeighborPosition.Bottom, NeighborPosition.BottomRight)]: 2,
            [getId(SubTilePosition.BottomRight, NeighborPosition.Right)]: 3,
            [getId(SubTilePosition.BottomRight, NeighborPosition.Right, NeighborPosition.BottomRight)]: 3,
            [getId(SubTilePosition.BottomRight, NeighborPosition.Bottom, NeighborPosition.Right)]: 1,
            [getId(SubTilePosition.BottomRight, NeighborPosition.Bottom, NeighborPosition.Right, NeighborPosition.BottomRight)]: 4,
        },
    };
    function getId(relevantFor, ...positions) {
        return positions.filter((p) => p !== undefined && isRelevant(relevantFor, p))
            .sort((a, b) => a.localeCompare(b))
            .join("");
    }
    function isRelevant(subTilePosition, neighborPosition) {
        switch (subTilePosition) {
            case SubTilePosition.TopLeft:
                return neighborPosition === NeighborPosition.Top || neighborPosition === NeighborPosition.TopLeft || neighborPosition === NeighborPosition.Left;
            case SubTilePosition.TopRight:
                return neighborPosition === NeighborPosition.Top || neighborPosition === NeighborPosition.TopRight || neighborPosition === NeighborPosition.Right;
            case SubTilePosition.BottomLeft:
                return neighborPosition === NeighborPosition.Bottom || neighborPosition === NeighborPosition.BottomLeft || neighborPosition === NeighborPosition.Left;
            case SubTilePosition.BottomRight:
                return neighborPosition === NeighborPosition.Bottom || neighborPosition === NeighborPosition.BottomRight || neighborPosition === NeighborPosition.Right;
        }
    }
    const subTilePositionMap = {
        [SubTilePosition.TopLeft]: Vector2_1.default.ZERO,
        [SubTilePosition.TopRight]: new Vector2_1.default(8, 0),
        [SubTilePosition.BottomLeft]: new Vector2_1.default(0, 8),
        [SubTilePosition.BottomRight]: new Vector2_1.default(8),
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFpbnRQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9QYWludFBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWtFQSxNQUFNLGFBQWEsR0FBMEM7UUFDNUQsaUJBQVk7UUFDWixrQkFBYTtRQUNiLGFBQVE7UUFDUixnQkFBVztRQUNYLGdCQUFXO1FBQ1gsbUJBQWM7S0FDZCxDQUFDO0lBRUYsTUFBcUIsVUFBVyxTQUFRLHlCQUFlO1FBVXRELFlBQW1CLEtBQXFCO1lBQ3ZDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQVZHLGtCQUFhLEdBQW9CLEVBQUUsQ0FBQztZQUk3QyxhQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ1IsZUFBVSxHQUFhLEVBQUUsQ0FBQztZQUVuQyxlQUFVLEdBQUcsSUFBSSxDQUFDO1lBS3pCLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUV2QyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLGFBQWE7aUJBQ3RDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQzNCLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDO2lCQUN2QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXBCLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXBDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUM7aUJBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUkseUJB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
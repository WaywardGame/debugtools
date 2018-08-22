var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/IHookHost", "mod/IHookManager", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/Component", "newui/component/IComponent", "newui/component/RangeInput", "newui/component/RangeRow", "newui/screen/screens/game/component/Dialog", "newui/screen/screens/game/Dialogs", "newui/screen/screens/menu/component/Spacer", "renderer/Shaders", "utilities/Collectors", "utilities/enum/Enums", "utilities/math/Vector2", "utilities/math/Vector3", "utilities/Objects", "utilities/TileHelpers", "../Actions", "../DebugTools", "../IDebugTools", "../util/TilePosition", "./paint/Corpse", "./paint/Creature", "./paint/Doodad", "./paint/NPC", "./paint/Terrain", "./paint/TileEvent"], function (require, exports, IHookHost_1, IHookManager_1, BlockRow_1, Button_1, CheckButton_1, Component_1, IComponent_1, RangeInput_1, RangeRow_1, Dialog_1, Dialogs_1, Spacer_1, Shaders_1, Collectors_1, Enums_1, Vector2_1, Vector3_1, Objects_1, TileHelpers_1, Actions_1, DebugTools_1, IDebugTools_1, TilePosition_1, Corpse_1, Creature_1, Doodad_1, NPC_1, Terrain_1, TileEvent_1) {
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
    class DebugToolsDialog extends Dialog_1.default {
        constructor(gsapi, id) {
            super(gsapi, id);
            this.painting = false;
            this.paintTiles = [];
            this.paintSections = [];
            this.classes.add("debug-tools-dialog");
            const api = gsapi.uiApi;
            this.subpanels = [
                [IDebugTools_1.DebugToolsTranslation.PanelGeneral, this.showGeneralPanel],
                [IDebugTools_1.DebugToolsTranslation.PanelDisplay, this.showDisplayPanel],
                [IDebugTools_1.DebugToolsTranslation.PanelPaint, this.showPaintPanel],
            ];
            this.subpanelLinkWrapper = new Component_1.default(api)
                .append(this.addScrollableWrapper().append(this.subpanels.map(subpanel => new Button_1.default(api)
                .classes.add("debug-tools-subpanel-link")
                .setText(DebugTools_1.translation(subpanel[0]))
                .on(Button_1.ButtonEvent.Activate, this.showSubPanel(subpanel[0]))
                .schedule(subpanelButton => subpanel[2] = subpanelButton))))
                .appendTo(this.body);
            this.panelWrapper = this.addScrollableWrapper()
                .appendTo(new Component_1.default(api)
                .appendTo(this.body));
            const [name, , button] = this.subpanels.first();
            this.showSubPanel(name)(button);
            hookManager.register(this, "DebugToolsDialog")
                .until(IComponent_1.ComponentEvent.Remove);
            this.until(IComponent_1.ComponentEvent.Remove)
                .bind(DebugTools_1.default.INSTANCE, IDebugTools_1.DebugToolsEvent.UpdateSpectateState, () => this.spectateButton && this.spectateButton.refresh());
        }
        get saveData() {
            return DebugTools_1.default.INSTANCE.data;
        }
        getName() {
            return DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.DialogTitleMain);
        }
        getZoomLevel() {
            if (this.zoomRange) {
                this.zoomRange.refresh();
            }
            return undefined;
        }
        onGameTickEnd() {
            if (this.timeRange) {
                this.timeRange.refresh();
            }
        }
        onBindLoop(bindPressed, api) {
            if (this.painting) {
                if (api.isDown(DebugTools_1.default.INSTANCE.bindablePaint) && this.gsapi.wasMouseStartWithin()) {
                    const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);
                    const tile = game.getTile(tilePosition.x, tilePosition.y, localPlayer.z);
                    if (TileHelpers_1.default.Overlay.add(tile, { type: DebugTools_1.default.INSTANCE.overlayPaint }, IDebugTools_1.isPaintOverlay)) {
                        this.updatePaintOverlay(tile, tilePosition);
                    }
                    const tileId = TilePosition_1.getTileId(tilePosition.x, tilePosition.y, localPlayer.z);
                    if (!this.paintTiles.includes(tileId))
                        this.paintTiles.push(tileId);
                    game.updateView(false);
                    bindPressed = DebugTools_1.default.INSTANCE.bindablePaint;
                }
                if (api.isDown(DebugTools_1.default.INSTANCE.bindableErasePaint) && this.gsapi.wasMouseStartWithin()) {
                    const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);
                    const tile = game.getTile(tilePosition.x, tilePosition.y, localPlayer.z);
                    if (TileHelpers_1.default.Overlay.remove(tile, IDebugTools_1.isPaintOverlay)) {
                        this.updatePaintOverlay(tile, tilePosition);
                    }
                    const tileId = TilePosition_1.getTileId(tilePosition.x, tilePosition.y, localPlayer.z);
                    const index = this.paintTiles.indexOf(tileId);
                    if (index > -1)
                        this.paintTiles.splice(index, 1);
                    game.updateView(false);
                    bindPressed = DebugTools_1.default.INSTANCE.bindableErasePaint;
                }
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
        canClientMove(api) {
            if (this.selectionPromise || this.painting) {
                return false;
            }
            return undefined;
        }
        showSubPanel(name) {
            return (link) => {
                if (this.selectionPromise) {
                    this.selectionPromise.cancel();
                    delete this.selectionPromise;
                }
                this.painting = false;
                for (const element of this.subpanelLinkWrapper.findDescendants(".debug-tools-subpanel-link.active")) {
                    element.classList.remove("active");
                }
                link.classes.add("active");
                const [, initializer] = this.subpanels.filter(([n]) => name === n).first();
                initializer(this.panelWrapper.dump());
            };
        }
        showGeneralPanel(component) {
            this.timeRange = new RangeRow_1.RangeRow(this.api)
                .classes.add("debug-tools-range-row-no-default-button")
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTime)))
                .editRange(range => range
                .setStep(0.001)
                .setMin(0)
                .setMax(1)
                .setRefreshMethod(() => game.time.getTime()))
                .setDisplayValue(time => game.time.getTranslation(time))
                .on(RangeInput_1.RangeInputEvent.Change, (_, time) => {
                Actions_1.default.get("setTime").execute({ object: time });
            })
                .appendTo(component);
            this.inspectButton = new CheckButton_1.CheckButton(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonInspect))
                .setRefreshMethod(() => !!this.selectionPromise)
                .on(CheckButton_1.CheckButtonEvent.Change, (_, checked) => {
                if (!!this.selectionPromise !== checked) {
                    if (checked && DebugTools_1.default.INSTANCE.selector.selecting)
                        return false;
                    if (!checked) {
                        if (this.selectionPromise && !this.selectionPromise.isResolved) {
                            this.selectionPromise.cancel();
                        }
                        delete this.selectionPromise;
                    }
                    else {
                        this.selectionPromise = DebugTools_1.default.INSTANCE.selector.select();
                        this.selectionPromise.then(this.inspectTile);
                    }
                }
                return true;
            })
                .appendTo(component);
            new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonInspectLocalPlayer))
                .on(Button_1.ButtonEvent.Activate, this.inspectLocalPlayer)
                .appendTo(component);
            new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonUnlockRecipes))
                .on(Button_1.ButtonEvent.Activate, this.unlockRecipes)
                .appendTo(component);
            new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRemoveAllCreatures))
                .on(Button_1.ButtonEvent.Activate, this.removeAllCreatures)
                .appendTo(component);
            new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRemoveAllNPCs))
                .on(Button_1.ButtonEvent.Activate, this.removeAllNPCs)
                .appendTo(component);
        }
        async unlockRecipes() {
            const confirm = await this.api.interrupt(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InterruptConfirmationUnlockRecipes))
                .withDescription(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InterruptConfirmationUnlockRecipesDescription))
                .withConfirmation();
            if (!confirm)
                return;
            Actions_1.default.get("unlockRecipes").execute();
        }
        removeAllCreatures() {
            Actions_1.default.get("removeAllCreatures").execute();
        }
        removeAllNPCs() {
            Actions_1.default.get("removeAllNPCs").execute();
        }
        showDisplayPanel(component) {
            new CheckButton_1.CheckButton(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleFog))
                .setRefreshMethod(() => this.saveData.fog)
                .on(CheckButton_1.CheckButtonEvent.Change, this.toggleFog)
                .appendTo(component);
            new CheckButton_1.CheckButton(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleLighting))
                .setRefreshMethod(() => this.saveData.lighting)
                .on(CheckButton_1.CheckButtonEvent.Change, this.toggleLighting)
                .appendTo(component);
            this.zoomRange = new RangeRow_1.RangeRow(this.api)
                .classes.add("debug-tools-range-row-no-default-button")
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelZoomLevel)))
                .editRange(range => range
                .setMin(0)
                .setMax(11)
                .setRefreshMethod(() => this.saveData.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.saveData.zoomLevel))
                .setDisplayValue(() => DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ZoomLevel)
                .get(DebugTools_1.default.INSTANCE.getZoomLevel() || saveDataGlobal.options.zoomLevel))
                .on(RangeInput_1.RangeInputEvent.Change, (_, value) => {
                this.saveData.zoomLevel = value;
                game.updateZoomLevel();
            })
                .appendTo(component);
            new CheckButton_1.CheckButton(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonUnlockCamera))
                .setRefreshMethod(() => DebugTools_1.default.INSTANCE.isCameraUnlocked)
                .on(CheckButton_1.CheckButtonEvent.Change, (_, checked) => DebugTools_1.default.INSTANCE.setCameraUnlocked(checked))
                .appendTo(component);
            new Button_1.default(this.api)
                .classes.add("warning")
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonResetWebGL))
                .on(Button_1.ButtonEvent.Activate, this.resetWebGL)
                .appendTo(component);
            new Button_1.default(this.api)
                .classes.add("warning")
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonReloadShaders))
                .on(Button_1.ButtonEvent.Activate, this.reloadShaders)
                .appendTo(component);
        }
        showPaintPanel(component) {
            this.paintSections.splice(0, Infinity);
            component.append(paintSections.values()
                .map(cls => new cls(this.api)
                .schedule(paintSection => this.paintSections.push(paintSection))));
            new Spacer_1.default(this.api).appendTo(component);
            this.paintButton = new CheckButton_1.CheckButton(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPaint))
                .on(CheckButton_1.CheckButtonEvent.Change, (_, paint) => {
                paintRow.toggle(this.painting = paint);
                if (!paint)
                    this.clearPaint();
            })
                .appendTo(component);
            const paintRow = new BlockRow_1.BlockRow(this.api)
                .hide()
                .append(new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPaintClear))
                .on(Button_1.ButtonEvent.Activate, this.clearPaint))
                .append(new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPaintComplete))
                .on(Button_1.ButtonEvent.Activate, this.completePaint))
                .appendTo(component);
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
            game.updateView(false);
        }
        toggleFog(_, fog) {
            this.saveData.fog = fog;
            DebugTools_1.default.INSTANCE.updateFog();
        }
        toggleLighting(_, lighting) {
            this.saveData.lighting = lighting;
            Actions_1.default.get("updateStatsAndAttributes").execute();
            game.updateView(true);
        }
        inspectLocalPlayer() {
            this.inspectTile(new Vector2_1.default(localPlayer));
        }
        inspectTile(tilePosition) {
            delete this.selectionPromise;
            this.inspectButton.refresh();
            if (!tilePosition)
                return;
            DebugTools_1.default.INSTANCE.inspectTile(tilePosition);
        }
        resetWebGL() {
            game.resetWebGL();
        }
        async reloadShaders() {
            await Shaders_1.loadShaders();
            Shaders_1.compileShaders();
            game.updateView(true);
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
                for (const subTilePosition of Enums_1.default.values(SubTilePosition)) {
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
            return Enums_1.default.values(NeighborPosition)
                .map(pos => [pos, [vectors[pos], game.getTile(...vectors[pos].xyz)]])
                .collect(Objects_1.default.create);
        }
        getPaintOverlayConnections(neighbors) {
            return Objects_1.default.keys(neighbors)
                .filter(neighborPosition => TileHelpers_1.default.Overlay.has(neighbors[neighborPosition][1], IDebugTools_1.isPaintOverlay))
                .collect(Collectors_1.default.toArray);
        }
    }
    DebugToolsDialog.description = {
        minSize: {
            x: 25,
            y: 25,
        },
        size: {
            x: 25,
            y: 30,
        },
        maxSize: {
            x: 40,
            y: 70,
        },
        edges: [
            [Dialogs_1.Edge.Left, 25],
            [Dialogs_1.Edge.Bottom, 0],
        ],
    };
    __decorate([
        IHookHost_1.HookMethod(IHookManager_1.HookPriority.High)
    ], DebugToolsDialog.prototype, "getZoomLevel", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugToolsDialog.prototype, "onGameTickEnd", null);
    __decorate([
        IHookHost_1.HookMethod(IHookManager_1.HookPriority.High)
    ], DebugToolsDialog.prototype, "onBindLoop", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugToolsDialog.prototype, "canClientMove", null);
    __decorate([
        Objects_1.Bound
    ], DebugToolsDialog.prototype, "showGeneralPanel", null);
    __decorate([
        Objects_1.Bound
    ], DebugToolsDialog.prototype, "unlockRecipes", null);
    __decorate([
        Objects_1.Bound
    ], DebugToolsDialog.prototype, "removeAllCreatures", null);
    __decorate([
        Objects_1.Bound
    ], DebugToolsDialog.prototype, "removeAllNPCs", null);
    __decorate([
        Objects_1.Bound
    ], DebugToolsDialog.prototype, "showDisplayPanel", null);
    __decorate([
        Objects_1.Bound
    ], DebugToolsDialog.prototype, "showPaintPanel", null);
    __decorate([
        Objects_1.Bound
    ], DebugToolsDialog.prototype, "completePaint", null);
    __decorate([
        Objects_1.Bound
    ], DebugToolsDialog.prototype, "clearPaint", null);
    __decorate([
        Objects_1.Bound
    ], DebugToolsDialog.prototype, "toggleFog", null);
    __decorate([
        Objects_1.Bound
    ], DebugToolsDialog.prototype, "toggleLighting", null);
    __decorate([
        Objects_1.Bound
    ], DebugToolsDialog.prototype, "inspectLocalPlayer", null);
    __decorate([
        Objects_1.Bound
    ], DebugToolsDialog.prototype, "inspectTile", null);
    __decorate([
        Objects_1.Bound
    ], DebugToolsDialog.prototype, "resetWebGL", null);
    __decorate([
        Objects_1.Bound
    ], DebugToolsDialog.prototype, "reloadShaders", null);
    exports.default = DebugToolsDialog;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29sc0RpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9EZWJ1Z1Rvb2xzRGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQW9FQSxNQUFNLGFBQWEsR0FBNkM7UUFDL0QsaUJBQVk7UUFDWixrQkFBYTtRQUNiLGFBQVE7UUFDUixnQkFBVztRQUNYLGdCQUFXO1FBQ1gsbUJBQWM7S0FDZCxDQUFDO0lBRUYsTUFBcUIsZ0JBQWlCLFNBQVEsZ0JBQU07UUE2Q25ELFlBQW1CLEtBQXFCLEVBQUUsRUFBWTtZQUNyRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBTlYsYUFBUSxHQUFHLEtBQUssQ0FBQztZQUNSLGVBQVUsR0FBYSxFQUFFLENBQUM7WUFDMUIsa0JBQWEsR0FBb0IsRUFBRSxDQUFDO1lBS3BELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFLdkMsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUV4QixJQUFJLENBQUMsU0FBUyxHQUFHO2dCQUNoQixDQUFDLG1DQUFxQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzNELENBQUMsbUNBQXFCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDM0QsQ0FBQyxtQ0FBcUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQzthQUN2RCxDQUFDO1lBRUYsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksbUJBQVMsQ0FBQyxHQUFHLENBQUM7aUJBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLGdCQUFNLENBQUMsR0FBRyxDQUFDO2lCQUN2RixP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QUssQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMvRCxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMxRCxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDckYsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDNUQsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3ZGLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNsRixDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDO1NBQzdHO1FBQ0QsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDN0IsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ1AsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDbkUsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDL0QsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFD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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventBuses", "event/EventManager", "game/tile/ITerrain", "mod/Mod", "mod/ModRegistry", "renderer/IRenderer", "ui/component/ContextMenu", "ui/component/Text", "ui/input/Bind", "ui/input/Bindable", "ui/input/InputManager", "ui/screen/screens/game/component/TabDialog", "ui/screen/screens/game/Dialogs", "utilities/collection/Arrays", "utilities/Decorators", "utilities/game/TileHelpers", "utilities/math/Vector2", "utilities/math/Vector3", "../IDebugTools", "../overlay/Overlays", "./component/InspectInformationSection", "./inspect/Corpse", "./inspect/Doodad", "./inspect/Entity", "./inspect/Item", "./inspect/Terrain", "./inspect/TileEvent"], function (require, exports, EventBuses_1, EventManager_1, ITerrain_1, Mod_1, ModRegistry_1, IRenderer_1, ContextMenu_1, Text_1, Bind_1, Bindable_1, InputManager_1, TabDialog_1, Dialogs_1, Arrays_1, Decorators_1, TileHelpers_1, Vector2_1, Vector3_1, IDebugTools_1, Overlays_1, InspectInformationSection_1, Corpse_1, Doodad_1, Entity_1, Item_1, Terrain_1, TileEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const informationSectionClasses = [
        Terrain_1.default,
        Entity_1.default,
        Corpse_1.default,
        Doodad_1.default,
        TileEvent_1.default,
        Item_1.default,
    ];
    class InspectDialog extends TabDialog_1.default {
        constructor(id) {
            super(id);
            this.shouldLog = false;
            this.willShowSubpanel = false;
            this.classes.add("debug-tools-inspect-dialog");
            InspectDialog.INSTANCE = this;
        }
        getSubpanels() {
            const subpanels = informationSectionClasses.stream()
                .merge(this.DEBUG_TOOLS.modRegistryInspectDialogPanels.getRegistrations()
                .map(registration => registration.data(InspectInformationSection_1.default)))
                .map(cls => new cls()
                .event.subscribe("update", this.update))
                .toArray();
            this.entityInfoSection = subpanels
                .find((infoSection) => infoSection instanceof Entity_1.default);
            return subpanels;
        }
        getSubpanelInformation(subpanels) {
            this.entityButtons = [];
            return this.subpanels.stream()
                .map(section => (0, Arrays_1.Tuple)(section, section.getTabs()))
                .filter(([, tabs]) => !!tabs.length)
                .map(([section, tabs]) => tabs
                .map(([index, getTabTranslation]) => (0, Arrays_1.Tuple)(Text_1.default.toString(getTabTranslation), getTabTranslation, (component) => section.setTab(index)
                .appendTo(component)
                .event.emit("switchTo"), (button) => !(section instanceof Entity_1.default) ? undefined : this.entityButtons[index] = button)))
                .flatMap()
                .toArray();
        }
        getName() {
            return (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.DialogTitleInspect);
        }
        setInspection(what) {
            this.setInspectionTile(what);
            this.inspectionLock = "entityType" in what ? what : undefined;
            this.update();
            if (this.inspectionLock)
                this.willShowSubpanel = true;
            return this;
        }
        update() {
            if (this.inspectionLock)
                this.setInspectionTile(this.inspectionLock);
            for (const section of this.subpanels) {
                section.resetWillLog();
                section.update(this.tilePosition, this.tile);
            }
            this.logUpdate();
            this.schedule(300, 300, this.updateSubpanels);
        }
        onCloseBind() {
            this.close();
            return true;
        }
        onContextMenuBind(api) {
            for (let i = 0; i < this.entityButtons.length; i++) {
                if (api.mouse.isWithin(this.entityButtons[i])) {
                    this.showInspectionLockMenu(i);
                    return true;
                }
            }
            return false;
        }
        onGameEnd() {
            this.close();
        }
        onGameTickEnd() {
            this.update();
        }
        onMoveComplete() {
            this.update();
        }
        onTileUpdate(island, tile, x, y, z, tileUpdateType) {
            this.update();
        }
        onClose() {
            if (this.inspectingTile) {
                TileHelpers_1.default.Overlay.remove(this.inspectingTile, Overlays_1.default.isSelectedTarget);
                delete this.inspectingTile;
            }
            game.updateView(IRenderer_1.RenderSource.Mod, false);
            delete InspectDialog.INSTANCE;
        }
        updateSubpanels() {
            this.updateSubpanelList();
            if (this.willShowSubpanel && this.inspectionLock) {
                this.showSubPanel(this.entityButtons[this.entityInfoSection.getEntityIndex(this.inspectionLock)]);
                this.willShowSubpanel = false;
            }
            if (this.inspectionLock) {
                for (const entityButton of this.entityButtons)
                    entityButton.classes.remove("inspection-lock");
                this.entityButtons[this.entityInfoSection.getEntityIndex(this.inspectionLock)]
                    .classes.add("inspection-lock");
            }
        }
        setInspectionTile(what) {
            const position = new Vector3_1.default(what.x, what.y, "z" in what ? what.z : localPlayer.z);
            if (this.tilePosition && position.equals(this.tilePosition))
                return;
            this.tilePosition = position;
            this.tile = localIsland.getTile(...this.tilePosition.xyz);
            this.shouldLog = true;
            this.logUpdate();
            if (this.inspectingTile && this.inspectingTile !== this.tile) {
                TileHelpers_1.default.Overlay.remove(this.inspectingTile, Overlays_1.default.isSelectedTarget);
            }
            this.inspectingTile = this.tile;
            TileHelpers_1.default.Overlay.add(this.tile, {
                type: this.DEBUG_TOOLS.overlayTarget,
                red: 0,
                blue: 0,
            }, Overlays_1.default.isSelectedTarget);
            game.updateView(IRenderer_1.RenderSource.Mod, false);
        }
        logUpdate() {
            var _a;
            if (this.shouldLog) {
                const tileData = this.tilePosition ? localIsland.getTileData(this.tilePosition.x, this.tilePosition.y, this.tilePosition.z) : undefined;
                this.LOG.info("Tile:", this.tile, (_a = this.tilePosition) === null || _a === void 0 ? void 0 : _a.toString(), tileData === null || tileData === void 0 ? void 0 : tileData.map(data => ITerrain_1.TerrainType[data.type]).join(", "), tileData);
                this.shouldLog = false;
            }
            for (const infoSection of this.subpanels) {
                if (infoSection.willLog) {
                    infoSection.logUpdate();
                    infoSection.resetWillLog();
                }
            }
        }
        showInspectionLockMenu(index) {
            new ContextMenu_1.default(this.entityButtons[index].classes.hasEvery("inspection-lock") ?
                ["Unlock Inspection", {
                        translation: (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.UnlockInspection),
                        onActivate: this.unlockInspection,
                    }] :
                ["Lock Inspection", {
                        translation: (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LockInspection),
                        onActivate: this.lockInspection(index),
                    }])
                .addAllDescribedOptions()
                .setPosition(...InputManager_1.default.mouse.position.xy)
                .schedule(gameScreen.setContextMenu);
        }
        unlockInspection() {
            delete this.inspectionLock;
            for (const entityButton of this.entityButtons)
                entityButton.classes.remove("inspection-lock");
        }
        lockInspection(index) {
            return () => this.setInspection(this.entityInfoSection.getEntity(index));
        }
    }
    InspectDialog.description = {
        minSize: new Vector2_1.default(20, 25),
        size: new Vector2_1.default(25, 27),
        maxSize: new Vector2_1.default(40, 70),
        edges: [
            [Dialogs_1.Edge.Left, 50],
            [Dialogs_1.Edge.Bottom, 33],
        ],
        saveOpen: false,
    };
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], InspectDialog.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], InspectDialog.prototype, "LOG", void 0);
    __decorate([
        Decorators_1.Bound
    ], InspectDialog.prototype, "update", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "preMoveToIsland"),
        Bind_1.default.onDown((0, ModRegistry_1.Registry)(IDebugTools_1.DEBUG_TOOLS_ID).get("bindableCloseInspectDialog"))
    ], InspectDialog.prototype, "onCloseBind", null);
    __decorate([
        Bind_1.default.onDown(Bindable_1.default.MenuContextMenu)
    ], InspectDialog.prototype, "onContextMenuBind", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Game, "stoppingPlay")
    ], InspectDialog.prototype, "onGameEnd", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Game, "tickEnd"),
        (0, Decorators_1.Debounce)(100)
    ], InspectDialog.prototype, "onGameTickEnd", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Players, "moveComplete")
    ], InspectDialog.prototype, "onMoveComplete", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Island, "tileUpdate")
    ], InspectDialog.prototype, "onTileUpdate", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(InspectDialog, "close")
    ], InspectDialog.prototype, "onClose", null);
    __decorate([
        Decorators_1.Bound
    ], InspectDialog.prototype, "updateSubpanels", null);
    __decorate([
        Decorators_1.Bound
    ], InspectDialog.prototype, "logUpdate", null);
    __decorate([
        Decorators_1.Bound
    ], InspectDialog.prototype, "showInspectionLockMenu", null);
    __decorate([
        Decorators_1.Bound
    ], InspectDialog.prototype, "unlockInspection", null);
    exports.default = InspectDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdERpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9JbnNwZWN0RGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXdDQSxNQUFNLHlCQUF5QixHQUEyQztRQUN6RSxpQkFBa0I7UUFDbEIsZ0JBQWlCO1FBQ2pCLGdCQUFpQjtRQUNqQixnQkFBaUI7UUFDakIsbUJBQW9CO1FBQ3BCLGNBQWU7S0FDZixDQUFDO0lBRUYsTUFBcUIsYUFBYyxTQUFRLG1CQUFvQztRQWdDOUUsWUFBbUIsRUFBWTtZQUM5QixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7WUFKSCxjQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ2xCLHFCQUFnQixHQUFHLEtBQUssQ0FBQztZQUtoQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1lBRS9DLGFBQWEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQy9CLENBQUM7UUFNa0IsWUFBWTtZQUM5QixNQUFNLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQyxNQUFNLEVBQUU7aUJBQ2xELEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLDhCQUE4QixDQUFDLGdCQUFnQixFQUFFO2lCQUN2RSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLG1DQUF5QixDQUFDLENBQUMsQ0FBQztpQkFDbkUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUU7aUJBQ25CLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDeEMsT0FBTyxFQUFFLENBQUM7WUFHWixJQUFJLENBQUMsaUJBQWlCLEdBQUcsU0FBUztpQkFDaEMsSUFBSSxDQUFvQixDQUFDLFdBQVcsRUFBb0MsRUFBRSxDQUFDLFdBQVcsWUFBWSxnQkFBaUIsQ0FBRSxD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
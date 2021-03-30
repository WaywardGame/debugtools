var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventBuses", "event/EventManager", "game/IGame", "mod/IHookHost", "mod/Mod", "mod/ModRegistry", "ui/component/ContextMenu", "ui/component/Text", "ui/input/Bind", "ui/input/Bindable", "ui/input/InputManager", "ui/screen/screens/game/Dialogs", "ui/screen/screens/GameScreen", "utilities/collection/Arrays", "utilities/game/TileHelpers", "utilities/math/Vector2", "utilities/math/Vector3", "../IDebugTools", "../overlay/Overlays", "./component/InspectInformationSection", "./inspect/Corpse", "./inspect/Doodad", "./inspect/Entity", "./inspect/Item", "./inspect/Terrain", "./inspect/TileEvent", "./TabDialog"], function (require, exports, EventBuses_1, EventManager_1, IGame_1, IHookHost_1, Mod_1, ModRegistry_1, ContextMenu_1, Text_1, Bind_1, Bindable_1, InputManager_1, Dialogs_1, GameScreen_1, Arrays_1, TileHelpers_1, Vector2_1, Vector3_1, IDebugTools_1, Overlays_1, InspectInformationSection_1, Corpse_1, Doodad_1, Entity_1, Item_1, Terrain_1, TileEvent_1, TabDialog_1) {
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
            this.storePanels = true;
            this.shouldLog = false;
            this.willShowSubpanel = false;
            this.classes.add("debug-tools-inspect-dialog");
            InspectDialog.INSTANCE = this;
        }
        getSubpanels() {
            if (!this.infoSections) {
                this.infoSections = informationSectionClasses.stream()
                    .merge(this.DEBUG_TOOLS.modRegistryInspectDialogPanels.getRegistrations()
                    .map(registration => registration.data(InspectInformationSection_1.default)))
                    .map(cls => new cls()
                    .event.subscribe("update", this.update)
                    .event.subscribe("willRemove", infoSection => {
                    if (this.storePanels) {
                        infoSection.event.emit("switchAway");
                        infoSection.store();
                        return false;
                    }
                    return undefined;
                }))
                    .toArray();
                this.entityInfoSection = this.infoSections
                    .find((infoSection) => infoSection instanceof Entity_1.default);
            }
            this.entityButtons = [];
            return this.infoSections.stream()
                .map(section => Arrays_1.Tuple(section, section.getTabs()))
                .filter(([, tabs]) => !!tabs.length)
                .map(([section, tabs]) => tabs
                .map(([index, getTabTranslation]) => Arrays_1.Tuple(Text_1.default.toString(getTabTranslation), getTabTranslation, (component) => section.setTab(index)
                .appendTo(component)
                .event.emit("switchTo"), (button) => !(section instanceof Entity_1.default) ? undefined : this.entityButtons[index] = button)))
                .flatMap()
                .toArray();
        }
        getName() {
            return IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.DialogTitleInspect);
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
            for (const section of this.infoSections) {
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
        onTileUpdate(game, tile, x, y, z, tileUpdateType) {
            this.update();
        }
        onClose() {
            if (this.inspectingTile) {
                TileHelpers_1.default.Overlay.remove(this.inspectingTile, Overlays_1.default.isSelectedTarget);
                delete this.inspectingTile;
            }
            game.updateView(IGame_1.RenderSource.Mod, false);
            this.storePanels = false;
            for (const infoSection of this.infoSections) {
                if (infoSection.isVisible()) {
                    infoSection.event.emit("switchAway");
                }
                infoSection.remove();
            }
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
            this.tile = game.getTile(...this.tilePosition.xyz);
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
            game.updateView(IGame_1.RenderSource.Mod, false);
        }
        logUpdate() {
            if (this.shouldLog) {
                this.LOG.info("Tile:", this.tile, this.tilePosition !== undefined ? this.tilePosition.toString() : undefined, this.tilePosition ? game.getTileData(this.tilePosition.x, this.tilePosition.y, this.tilePosition.z) : undefined);
                this.shouldLog = false;
            }
            for (const infoSection of this.infoSections) {
                if (infoSection.willLog) {
                    infoSection.logUpdate();
                    infoSection.resetWillLog();
                }
            }
        }
        showInspectionLockMenu(index) {
            new ContextMenu_1.default(this.entityButtons[index].classes.hasEvery("inspection-lock") ?
                ["Unlock Inspection", {
                        translation: IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.UnlockInspection),
                        onActivate: this.unlockInspection,
                    }] :
                ["Lock Inspection", {
                        translation: IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LockInspection),
                        onActivate: this.lockInspection(index),
                    }])
                .addAllDescribedOptions()
                .setPosition(...InputManager_1.default.mouse.position.xy)
                .schedule(GameScreen_1.gameScreen.setContextMenu);
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
        Override
    ], InspectDialog.prototype, "getSubpanels", null);
    __decorate([
        Override
    ], InspectDialog.prototype, "getName", null);
    __decorate([
        Bound
    ], InspectDialog.prototype, "update", null);
    __decorate([
        Bind_1.default.onDown(ModRegistry_1.Registry(IDebugTools_1.DEBUG_TOOLS_ID).get("bindableCloseInspectDialog"))
    ], InspectDialog.prototype, "onCloseBind", null);
    __decorate([
        Bind_1.default.onDown(Bindable_1.default.MenuContextMenu)
    ], InspectDialog.prototype, "onContextMenuBind", null);
    __decorate([
        EventManager_1.EventHandler(EventBuses_1.EventBus.Game, "end")
    ], InspectDialog.prototype, "onGameEnd", null);
    __decorate([
        IHookHost_1.HookMethod,
        Debounce(100)
    ], InspectDialog.prototype, "onGameTickEnd", null);
    __decorate([
        EventManager_1.EventHandler(EventBuses_1.EventBus.Players, "moveComplete")
    ], InspectDialog.prototype, "onMoveComplete", null);
    __decorate([
        EventManager_1.EventHandler(EventBuses_1.EventBus.Game, "tileUpdate")
    ], InspectDialog.prototype, "onTileUpdate", null);
    __decorate([
        EventManager_1.OwnEventHandler(InspectDialog, "close")
    ], InspectDialog.prototype, "onClose", null);
    __decorate([
        Bound
    ], InspectDialog.prototype, "updateSubpanels", null);
    __decorate([
        Bound
    ], InspectDialog.prototype, "logUpdate", null);
    __decorate([
        Bound
    ], InspectDialog.prototype, "showInspectionLockMenu", null);
    __decorate([
        Bound
    ], InspectDialog.prototype, "unlockInspection", null);
    exports.default = InspectDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdERpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9JbnNwZWN0RGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXdDQSxNQUFNLHlCQUF5QixHQUEyQztRQUN6RSxpQkFBa0I7UUFDbEIsZ0JBQWlCO1FBQ2pCLGdCQUFpQjtRQUNqQixnQkFBaUI7UUFDakIsbUJBQW9CO1FBQ3BCLGNBQWU7S0FDZixDQUFDO0lBRUYsTUFBcUIsYUFBYyxTQUFRLG1CQUFTO1FBa0NuRCxZQUFtQixFQUFZO1lBQzlCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUxILGdCQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ25CLGNBQVMsR0FBRyxLQUFLLENBQUM7WUFDbEIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1lBS2hDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFFL0MsYUFBYSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDL0IsQ0FBQztRQU1nQixZQUFZO1lBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLHlCQUF5QixDQUFDLE1BQU0sRUFBRTtxQkFDcEQsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsOEJBQThCLENBQUMsZ0JBQWdCLEVBQUU7cUJBQ3ZFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsbUNBQXlCLENBQUMsQ0FBQyxDQUFDO3FCQUNuRSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRTtxQkFDbkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztxQkFDdEMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLEVBQUU7b0JBQzVDLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTt3QkFDckIsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBQ3JDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDcEIsT0FBTyxLQUFLLENBQUM7cUJBQ2I7b0JBRUQsT0FBTyxTQUFTLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQyxDQUFDO3FCQUNILE9BQU8sRUFBRSxDQUFDO2dCQUdaLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsWUFBWTtxQkFDeEMsSUFBSSxDQUFvQixDQUFDLFdBQVcsRUFBb0MsRUFBRSxDQUFDLFdBQVcsWUFBWSxnQkFBaUIsQ0FBRSxDQUFDO2FBQ3hIO1lBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7WUFFeEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRTtpQkFFL0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsY0FBSyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztpQkFFakQsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztpQkFFbkMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUk7aUJBRTVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUssQ0FDekMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUNoQyxpQkFBaUIsRUFFakIsQ0FBQyxTQUFvQixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztpQkFDN0MsUUFBUSxDQUFDLFNBQVMsQ0FBQztpQkFDbkIsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFFeEIsQ0FBQyxNQUFjLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLFlBQVksZ0JBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FDNUcsQ0FBQyxDQUFDO2lCQUVILE9BQU8sRUFBdUI7aUJBRTlCLE9BQU8sRUFBRSxDQUFDO1FBQ2IsQ0FBQztRQUVnQixPQUFPO1lBQ3ZCLE9BQU8seUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFTTSxhQUFhLENBQUMsSUFBc0I7WUFDMUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTdCLElBQUksQ0FBQyxjQUFjLEdBQUcsWUFBWSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFFOUQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBRWQsSUFBSSxJQUFJLENBQUMsY0FBYztnQkFBRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1lBRXRELE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQVNNLE1BQU07WUFDWixJQUFJLElBQUksQ0FBQyxjQUFjO2dCQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFckUsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN4QyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3ZCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQWEsRUFBRSxJQUFJLENBQUMsSUFBSyxDQUFDLENBQUM7YUFDL0M7WUFFRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBR00sV0FBVztZQUNqQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDYixPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFHTSxpQkFBaUIsQ0FBQyxHQUFvQjtZQUM1QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBSW5ELElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUM5QyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLE9BQU8sSUFBSSxDQUFDO2lCQUNaO2FBQ0Q7WUFFRCxPQUFPLEtBQUssQ0FBQztRQUNkLENBQUM7UUFHTSxTQUFTO1lBQ2YsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2QsQ0FBQztRQVFNLGFBQWE7WUFDbkIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2YsQ0FBQztRQUdNLGNBQWM7WUFDcEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2YsQ0FBQztRQUdNLFlBQVksQ0FBQyxJQUFTLEVBQUUsSUFBVyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLGNBQThCO1lBQzFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNmLENBQUM7UUFPUyxPQUFPO1lBQ2hCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDeEIscUJBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsa0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUMzRSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7YUFDM0I7WUFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRXpDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLEtBQUssTUFBTSxXQUFXLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDNUMsSUFBSSxXQUFXLENBQUMsU0FBUyxFQUFFLEVBQUU7b0JBQzVCLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUNyQztnQkFFRCxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDckI7WUFFRCxPQUFPLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDL0IsQ0FBQztRQVFPLGVBQWU7WUFDdEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFFMUIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDakQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEcsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQzthQUM5QjtZQUVELElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDeEIsS0FBSyxNQUFNLFlBQVksSUFBSSxJQUFJLENBQUMsYUFBYTtvQkFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUU5RixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO3FCQUM1RSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7YUFDakM7UUFDRixDQUFDO1FBUU8saUJBQWlCLENBQUMsSUFBc0I7WUFDL0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbkYsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFBRSxPQUFPO1lBQ3BFLElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO1lBRTdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFbkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBR2pCLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQzdELHFCQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGtCQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzthQUMzRTtZQUdELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNoQyxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDbEMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYTtnQkFDcEMsR0FBRyxFQUFFLENBQUM7Z0JBQ04sSUFBSSxFQUFFLENBQUM7YUFDUCxFQUFFLGtCQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFNTyxTQUFTO1lBQ2hCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUMvTixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQzthQUN2QjtZQUVELEtBQUssTUFBTSxXQUFXLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDNUMsSUFBSSxXQUFXLENBQUMsT0FBTyxFQUFFO29CQUN4QixXQUFXLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ3hCLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztpQkFDM0I7YUFDRDtRQUNGLENBQUM7UUFPTyxzQkFBc0IsQ0FBQyxLQUFhO1lBQzNDLElBQUkscUJBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUM5RSxDQUFDLG1CQUFtQixFQUFFO3dCQUNyQixXQUFXLEVBQUUseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxnQkFBZ0IsQ0FBQzt3QkFDaEUsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7cUJBQ2pDLENBQUMsQ0FBQyxDQUFDO2dCQUNKLENBQUMsaUJBQWlCLEVBQUU7d0JBQ25CLFdBQVcsRUFBRSx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQzt3QkFDOUQsVUFBVSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO3FCQUN0QyxDQUFDLENBQUM7aUJBQ0Ysc0JBQXNCLEVBQUU7aUJBQ3hCLFdBQVcsQ0FBQyxHQUFHLHNCQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7aUJBQzlDLFFBQVEsQ0FBQyx1QkFBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFNTyxnQkFBZ0I7WUFDdkIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQzNCLEtBQUssTUFBTSxZQUFZLElBQUksSUFBSSxDQUFDLGFBQWE7Z0JBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMvRixDQUFDO1FBS08sY0FBYyxDQUFDLEtBQWE7WUFDbkMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMxRSxDQUFDOztJQXRUYSx5QkFBVyxHQUF1QjtRQUMvQyxPQUFPLEVBQUUsSUFBSSxpQkFBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDNUIsSUFBSSxFQUFFLElBQUksaUJBQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQ3pCLE9BQU8sRUFBRSxJQUFJLGlCQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUM1QixLQUFLLEVBQUU7WUFDTixDQUFDLGNBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQ2YsQ0FBQyxjQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztTQUNqQjtRQUNELFFBQVEsRUFBRSxLQUFLO0tBQ2YsQ0FBQztJQUtGO1FBREMsYUFBRyxDQUFDLFFBQVEsQ0FBYSw0QkFBYyxDQUFDO3NEQUNEO0lBRXhDO1FBREMsYUFBRyxDQUFDLEdBQUcsQ0FBQyw0QkFBYyxDQUFDOzhDQUNDO0lBMEJmO1FBQVQsUUFBUTtxREErQ1I7SUFFUztRQUFULFFBQVE7Z0RBRVI7SUE0QkQ7UUFEQyxLQUFLOytDQVdMO0lBR0Q7UUFEQyxjQUFJLENBQUMsTUFBTSxDQUFDLHNCQUFRLENBQWEsNEJBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO29EQUluRjtJQUdEO1FBREMsY0FBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBUSxDQUFDLGVBQWUsQ0FBQzswREFhckM7SUFHRDtRQURDLDJCQUFZLENBQUMscUJBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO2tEQUdsQztJQVFEO1FBRkMsc0JBQVU7UUFDVixRQUFRLENBQUMsR0FBRyxDQUFDO3NEQUdiO0lBR0Q7UUFEQywyQkFBWSxDQUFDLHFCQUFRLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQzt1REFHOUM7SUFHRDtRQURDLDJCQUFZLENBQUMscUJBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDO3FEQUd6QztJQU9EO1FBREMsOEJBQWUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO2dEQW1CdkM7SUFRRDtRQURDLEtBQUs7d0RBZUw7SUFzQ0Q7UUFEQyxLQUFLO2tEQWFMO0lBT0Q7UUFEQyxLQUFLOytEQWNMO0lBTUQ7UUFEQyxLQUFLO3lEQUlMO0lBblRGLGdDQTRUQyJ9
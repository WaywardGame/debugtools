var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventBuses", "event/EventManager", "game/IGame", "mod/IHookHost", "mod/Mod", "mod/ModRegistry", "newui/component/ContextMenu", "newui/component/Text", "newui/input/Bind", "newui/input/Bindable", "newui/input/InputManager", "newui/screen/screens/game/Dialogs", "newui/screen/screens/GameScreen", "utilities/Arrays", "utilities/math/Vector2", "utilities/math/Vector3", "utilities/TileHelpers", "../IDebugTools", "../overlay/Overlays", "./component/InspectInformationSection", "./inspect/Corpse", "./inspect/Doodad", "./inspect/Entity", "./inspect/Item", "./inspect/Terrain", "./inspect/TileEvent", "./TabDialog"], function (require, exports, EventBuses_1, EventManager_1, IGame_1, IHookHost_1, Mod_1, ModRegistry_1, ContextMenu_1, Text_1, Bind_1, Bindable_1, InputManager_1, Dialogs_1, GameScreen_1, Arrays_1, Vector2_1, Vector3_1, TileHelpers_1, IDebugTools_1, Overlays_1, InspectInformationSection_1, Corpse_1, Doodad_1, Entity_1, Item_1, Terrain_1, TileEvent_1, TabDialog_1) {
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
    let InspectDialog = (() => {
        class InspectDialog extends TabDialog_1.default {
            constructor(id) {
                super(id);
                this.storePanels = true;
                this.shouldLog = false;
                this.willShowSubpanel = false;
                this.classes.add("debug-tools-inspect-dialog");
                this.registerHookHost("DebugToolsInspectDialog");
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
                    this.LOG.info("Tile:", this.tile, this.tilePosition !== undefined ? this.tilePosition.toString() : undefined);
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
            IHookHost_1.HookMethod
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
        return InspectDialog;
    })();
    exports.default = InspectDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdERpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9JbnNwZWN0RGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTJDQSxNQUFNLHlCQUF5QixHQUEyQztRQUN6RSxpQkFBa0I7UUFDbEIsZ0JBQWlCO1FBQ2pCLGdCQUFpQjtRQUNqQixnQkFBaUI7UUFDakIsbUJBQW9CO1FBQ3BCLGNBQWU7S0FDZixDQUFDO0lBRUY7UUFBQSxNQUFxQixhQUFjLFNBQVEsbUJBQVM7WUFrQ25ELFlBQW1CLEVBQVk7Z0JBQzlCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFMSCxnQkFBVyxHQUFHLElBQUksQ0FBQztnQkFDbkIsY0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDbEIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO2dCQUtoQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO2dCQUcvQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMseUJBQXlCLENBQUMsQ0FBQztnQkFFakQsYUFBYSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDL0IsQ0FBQztZQU1nQixZQUFZO2dCQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtvQkFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyx5QkFBeUIsQ0FBQyxNQUFNLEVBQUU7eUJBQ3BELEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLDhCQUE4QixDQUFDLGdCQUFnQixFQUFFO3lCQUN2RSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLG1DQUF5QixDQUFDLENBQUMsQ0FBQzt5QkFDbkUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUU7eUJBQ25CLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7eUJBQ3RDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxFQUFFO3dCQUM1QyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7NEJBQ3JCLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDOzRCQUNyQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7NEJBQ3BCLE9BQU8sS0FBSyxDQUFDO3lCQUNiO3dCQUVELE9BQU8sU0FBUyxDQUFDO29CQUNsQixDQUFDLENBQUMsQ0FBQzt5QkFDSCxPQUFPLEVBQUUsQ0FBQztvQkFHWixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFlBQVk7eUJBQ3hDLElBQUksQ0FBb0IsQ0FBQyxXQUFXLEVBQW9DLEVBQUUsQ0FBQyxXQUFXLFlBQVksZ0JBQWlCLENBQUUsQ0FBQztpQkFDeEg7Z0JBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7Z0JBRXhCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUU7cUJBRS9CLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGNBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7cUJBRWpELE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7cUJBRW5DLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJO3FCQUU1QixHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxjQUFLLENBQ3pDLGNBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFDaEMsaUJBQWlCLEVBRWpCLENBQUMsU0FBb0IsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7cUJBQzdDLFFBQVEsQ0FBQyxTQUFTLENBQUM7cUJBQ25CLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBRXhCLENBQUMsTUFBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxZQUFZLGdCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQzVHLENBQUMsQ0FBQztxQkFFSCxPQUFPLEVBQXVCO3FCQUU5QixPQUFPLEVBQUUsQ0FBQztZQUNiLENBQUM7WUFFZ0IsT0FBTztnQkFDdkIsT0FBTyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDOUQsQ0FBQztZQVNNLGFBQWEsQ0FBQyxJQUF1QztnQkFDM0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUU3QixJQUFJLENBQUMsY0FBYyxHQUFHLFlBQVksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUU5RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBRWQsSUFBSSxJQUFJLENBQUMsY0FBYztvQkFBRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO2dCQUV0RCxPQUFPLElBQUksQ0FBQztZQUNiLENBQUM7WUFTTSxNQUFNO2dCQUNaLElBQUksSUFBSSxDQUFDLGNBQWM7b0JBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFFckUsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO29CQUN4QyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQ3ZCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQWEsRUFBRSxJQUFJLENBQUMsSUFBSyxDQUFDLENBQUM7aUJBQy9DO2dCQUVELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUMvQyxDQUFDO1lBR00sV0FBVztnQkFDakIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNiLE9BQU8sSUFBSSxDQUFDO1lBQ2IsQ0FBQztZQUdNLGlCQUFpQixDQUFDLEdBQW9CO2dCQUM1QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBSW5ELElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUM5QyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQy9CLE9BQU8sSUFBSSxDQUFDO3FCQUNaO2lCQUNEO2dCQUVELE9BQU8sS0FBSyxDQUFDO1lBQ2QsQ0FBQztZQUdNLFNBQVM7Z0JBQ2YsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2QsQ0FBQztZQU9NLGFBQWE7Z0JBQ25CLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNmLENBQUM7WUFHTSxjQUFjO2dCQUNwQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZixDQUFDO1lBR00sWUFBWSxDQUFDLElBQVMsRUFBRSxJQUFXLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsY0FBOEI7Z0JBQzFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNmLENBQUM7WUFPUyxPQUFPO2dCQUNoQixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7b0JBQ3hCLHFCQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGtCQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDM0UsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO2lCQUMzQjtnQkFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUV6QyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztnQkFDekIsS0FBSyxNQUFNLFdBQVcsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO29CQUM1QyxJQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUUsRUFBRTt3QkFDNUIsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7cUJBQ3JDO29CQUVELFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDckI7Z0JBRUQsT0FBTyxhQUFhLENBQUMsUUFBUSxDQUFDO1lBQy9CLENBQUM7WUFRTyxlQUFlO2dCQUN0QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFFMUIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtvQkFDakQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEcsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztpQkFDOUI7Z0JBRUQsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO29CQUN4QixLQUFLLE1BQU0sWUFBWSxJQUFJLElBQUksQ0FBQyxhQUFhO3dCQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7b0JBRTlGLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7eUJBQzVFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztpQkFDakM7WUFDRixDQUFDO1lBUU8saUJBQWlCLENBQUMsSUFBc0I7Z0JBQy9DLE1BQU0sUUFBUSxHQUFHLElBQUksaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVuRixJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO29CQUFFLE9BQU87Z0JBQ3BFLElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO2dCQUU3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUVuRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDdEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUdqQixJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFO29CQUM3RCxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxrQkFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7aUJBQzNFO2dCQUdELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDaEMscUJBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7b0JBQ2xDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWE7b0JBQ3BDLEdBQUcsRUFBRSxDQUFDO29CQUNOLElBQUksRUFBRSxDQUFDO2lCQUNQLEVBQUUsa0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUM5QixJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzFDLENBQUM7WUFNTyxTQUFTO2dCQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDOUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7aUJBQ3ZCO2dCQUVELEtBQUssTUFBTSxXQUFXLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtvQkFDNUMsSUFBSSxXQUFXLENBQUMsT0FBTyxFQUFFO3dCQUN4QixXQUFXLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ3hCLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztxQkFDM0I7aUJBQ0Q7WUFDRixDQUFDO1lBT08sc0JBQXNCLENBQUMsS0FBYTtnQkFDM0MsSUFBSSxxQkFBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7b0JBQzlFLENBQUMsbUJBQW1CLEVBQUU7NEJBQ3JCLFdBQVcsRUFBRSx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGdCQUFnQixDQUFDOzRCQUNoRSxVQUFVLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjt5QkFDakMsQ0FBQyxDQUFDLENBQUM7b0JBQ0osQ0FBQyxpQkFBaUIsRUFBRTs0QkFDbkIsV0FBVyxFQUFFLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsY0FBYyxDQUFDOzRCQUM5RCxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUM7eUJBQ3RDLENBQUMsQ0FBQztxQkFDRixzQkFBc0IsRUFBRTtxQkFDeEIsV0FBVyxDQUFDLEdBQUcsc0JBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztxQkFDOUMsUUFBUSxDQUFDLHVCQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDeEMsQ0FBQztZQU1PLGdCQUFnQjtnQkFDdkIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO2dCQUMzQixLQUFLLE1BQU0sWUFBWSxJQUFJLElBQUksQ0FBQyxhQUFhO29CQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDL0YsQ0FBQztZQUtPLGNBQWMsQ0FBQyxLQUFhO2dCQUNuQyxPQUFPLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzFFLENBQUM7O1FBeFRhLHlCQUFXLEdBQXVCO1lBQy9DLE9BQU8sRUFBRSxJQUFJLGlCQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUM1QixJQUFJLEVBQUUsSUFBSSxpQkFBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDekIsT0FBTyxFQUFFLElBQUksaUJBQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQzVCLEtBQUssRUFBRTtnQkFDTixDQUFDLGNBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO2dCQUNmLENBQUMsY0FBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7YUFDakI7WUFDRCxRQUFRLEVBQUUsS0FBSztTQUNmLENBQUM7UUFLRjtZQURDLGFBQUcsQ0FBQyxRQUFRLENBQWEsNEJBQWMsQ0FBQzswREFDRDtRQUV4QztZQURDLGFBQUcsQ0FBQyxHQUFHLENBQUMsNEJBQWMsQ0FBQztrREFDQztRQTZCZjtZQUFULFFBQVE7eURBK0NSO1FBRVM7WUFBVCxRQUFRO29EQUVSO1FBNEJEO1lBREMsS0FBSzttREFXTDtRQUdEO1lBREMsY0FBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBUSxDQUFhLDRCQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQzt3REFJbkY7UUFHRDtZQURDLGNBQUksQ0FBQyxNQUFNLENBQUMsa0JBQVEsQ0FBQyxlQUFlLENBQUM7OERBYXJDO1FBR0Q7WUFEQywyQkFBWSxDQUFDLHFCQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztzREFHbEM7UUFPRDtZQURDLHNCQUFVOzBEQUdWO1FBR0Q7WUFEQywyQkFBWSxDQUFDLHFCQUFRLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQzsyREFHOUM7UUFHRDtZQURDLDJCQUFZLENBQUMscUJBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDO3lEQUd6QztRQU9EO1lBREMsOEJBQWUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO29EQW1CdkM7UUFRRDtZQURDLEtBQUs7NERBZUw7UUFzQ0Q7WUFEQyxLQUFLO3NEQWFMO1FBT0Q7WUFEQyxLQUFLO21FQWNMO1FBTUQ7WUFEQyxLQUFLOzZEQUlMO1FBU0Ysb0JBQUM7U0FBQTtzQkE5VG9CLGFBQWEifQ==
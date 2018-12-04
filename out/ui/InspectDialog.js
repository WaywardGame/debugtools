var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "mod/IHookHost", "mod/Mod", "newui/BindingManager", "newui/component/ContextMenu", "newui/component/IComponent", "newui/component/Text", "newui/screen/IScreen", "newui/screen/screens/game/component/Dialog", "newui/screen/screens/game/Dialogs", "utilities/iterable/Collectors", "utilities/iterable/Generators", "utilities/math/Vector3", "utilities/Objects", "utilities/TileHelpers", "../IDebugTools", "../overlay/Overlays", "./component/DebugToolsPanel", "./component/InspectInformationSection", "./inspect/Corpse", "./inspect/Doodad", "./inspect/Entity", "./inspect/Item", "./inspect/Terrain", "./inspect/TileEvent", "./TabDialog"], function (require, exports, Enums_1, IHookHost_1, Mod_1, BindingManager_1, ContextMenu_1, IComponent_1, Text_1, IScreen_1, Dialog_1, Dialogs_1, Collectors_1, Generators_1, Vector3_1, Objects_1, TileHelpers_1, IDebugTools_1, Overlays_1, DebugToolsPanel_1, InspectInformationSection_1, Corpse_1, Doodad_1, Entity_1, Item_1, Terrain_1, TileEvent_1, TabDialog_1) {
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
        constructor(gsapi, id) {
            super(gsapi, id);
            this.storePanels = true;
            this.shouldLog = false;
            this.willShowSubpanel = false;
            this.classes.add("debug-tools-inspect-dialog");
            hookManager.register(this, "DebugToolsInspectDialog")
                .until(IComponent_1.ComponentEvent.Remove);
            this.on(Dialog_1.DialogEvent.Close, this.onClose);
            InspectDialog.INSTANCE = this;
        }
        getSubpanels() {
            if (!this.infoSections) {
                this.infoSections = informationSectionClasses.values()
                    .include(this.DEBUG_TOOLS.modRegistryInspectDialogPanels.getRegistrations()
                    .map(registration => registration.data(InspectInformationSection_1.default)))
                    .map(cls => new cls(this.gsapi)
                    .on("update", this.update)
                    .on(IComponent_1.ComponentEvent.WillRemove, infoSection => {
                    if (this.storePanels) {
                        infoSection.emit(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway);
                        infoSection.store();
                        return false;
                    }
                    return undefined;
                }))
                    .collect(Collectors_1.default.toArray);
                this.entityInfoSection = this.infoSections
                    .find((infoSection) => infoSection instanceof Entity_1.default);
            }
            this.entityButtons = [];
            return this.infoSections.values()
                .map(section => Generators_1.tuple(section, section.getTabs()))
                .filter(([, tabs]) => !!tabs.length)
                .map(([section, tabs]) => tabs
                .map(([index, getTabTranslation]) => Generators_1.tuple(Text_1.default.toString(getTabTranslation), getTabTranslation, (component) => section.setTab(index)
                .appendTo(component)
                .emit(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo), (button) => !(section instanceof Entity_1.default) ? undefined : this.entityButtons[index] = button)))
                .flatMap()
                .collect(Collectors_1.default.toArray);
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
        onBindLoop(bindPressed, api) {
            if (api.wasPressed(this.DEBUG_TOOLS.bindableCloseInspectDialog) && !bindPressed) {
                this.close();
                bindPressed = this.DEBUG_TOOLS.bindableCloseInspectDialog;
            }
            if (api.wasPressed(Enums_1.Bindable.MenuContextMenu) && !bindPressed) {
                for (let i = 0; i < this.entityButtons.length; i++) {
                    if (api.isMouseWithin(this.entityButtons[i])) {
                        this.showInspectionLockMenu(i);
                        bindPressed = Enums_1.Bindable.MenuContextMenu;
                    }
                }
            }
            return bindPressed;
        }
        onGameEnd(state) {
            this.close();
        }
        onGameTickEnd() {
            this.update();
        }
        onMoveComplete(player) {
            this.update();
        }
        onTileUpdate(tile, x, y, z) {
            this.update();
        }
        updateSubpanels() {
            this.updateSubpanelList();
            if (this.willShowSubpanel && this.inspectionLock) {
                this.showSubPanel(this.entityButtons[this.entityInfoSection.getIndex(this.inspectionLock)]);
                this.willShowSubpanel = false;
            }
            if (this.inspectionLock) {
                for (const entityButton of this.entityButtons)
                    entityButton.classes.remove("inspection-lock");
                this.entityButtons[this.entityInfoSection.getIndex(this.inspectionLock)]
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
            game.updateView(false);
        }
        logUpdate() {
            if (this.shouldLog) {
                this.LOG.info("Tile:", this.tile, this.tilePosition !== undefined ? this.tilePosition.toString() : undefined);
                this.shouldLog = false;
            }
            for (const infoSection of this.infoSections) {
                if (infoSection.willLog) {
                    infoSection.logUpdate();
                }
            }
        }
        showInspectionLockMenu(index) {
            new ContextMenu_1.default(this.api, this.entityButtons[index].classes.has("inspection-lock") ?
                ["Unlock Inspection", {
                        translation: IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.UnlockInspection),
                        onActivate: this.unlockInspection,
                    }] :
                ["Lock Inspection", {
                        translation: IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LockInspection),
                        onActivate: this.lockInspection(index),
                    }])
                .addAllDescribedOptions()
                .setPosition(...BindingManager_1.bindingManager.getMouse().xy)
                .schedule(this.api.getScreen(IScreen_1.ScreenId.Game).setContextMenu);
        }
        unlockInspection() {
            delete this.inspectionLock;
            for (const entityButton of this.entityButtons)
                entityButton.classes.remove("inspection-lock");
        }
        lockInspection(index) {
            return () => this.setInspection(this.entityInfoSection.getEntity(index));
        }
        onClose() {
            if (this.inspectingTile) {
                TileHelpers_1.default.Overlay.remove(this.inspectingTile, Overlays_1.default.isSelectedTarget);
                delete this.inspectingTile;
            }
            game.updateView(false);
            this.storePanels = false;
            for (const infoSection of this.infoSections) {
                if (infoSection.isVisible()) {
                    infoSection.emit(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway);
                }
                infoSection.remove();
            }
            delete InspectDialog.INSTANCE;
        }
    }
    InspectDialog.description = {
        minSize: {
            x: 20,
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
            [Dialogs_1.Edge.Left, 50],
            [Dialogs_1.Edge.Bottom, 0],
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
        Objects_1.Bound
    ], InspectDialog.prototype, "update", null);
    __decorate([
        IHookHost_1.HookMethod
    ], InspectDialog.prototype, "onBindLoop", null);
    __decorate([
        IHookHost_1.HookMethod
    ], InspectDialog.prototype, "onGameEnd", null);
    __decorate([
        IHookHost_1.HookMethod
    ], InspectDialog.prototype, "onGameTickEnd", null);
    __decorate([
        IHookHost_1.HookMethod
    ], InspectDialog.prototype, "onMoveComplete", null);
    __decorate([
        IHookHost_1.HookMethod
    ], InspectDialog.prototype, "onTileUpdate", null);
    __decorate([
        Objects_1.Bound
    ], InspectDialog.prototype, "updateSubpanels", null);
    __decorate([
        Objects_1.Bound
    ], InspectDialog.prototype, "logUpdate", null);
    __decorate([
        Objects_1.Bound
    ], InspectDialog.prototype, "showInspectionLockMenu", null);
    __decorate([
        Objects_1.Bound
    ], InspectDialog.prototype, "unlockInspection", null);
    __decorate([
        Objects_1.Bound
    ], InspectDialog.prototype, "onClose", null);
    exports.default = InspectDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdERpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9JbnNwZWN0RGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTRDQSxNQUFNLHlCQUF5QixHQUEyQztRQUN6RSxpQkFBa0I7UUFDbEIsZ0JBQWlCO1FBQ2pCLGdCQUFpQjtRQUNqQixnQkFBaUI7UUFDakIsbUJBQW9CO1FBQ3BCLGNBQWU7S0FDZixDQUFDO0lBRUYsTUFBcUIsYUFBYyxTQUFRLG1CQUFTO1FBMkNuRCxZQUFtQixLQUFxQixFQUFFLEVBQVk7WUFDckQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUxWLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ25CLGNBQVMsR0FBRyxLQUFLLENBQUM7WUFDbEIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1lBS2hDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFHL0MsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUseUJBQXlCLENBQUM7aUJBRW5ELEtBQUssQ0FBQywyQkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRS9CLElBQUksQ0FBQyxFQUFFLENBQUMsb0JBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXpDLGFBQWEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQy9CLENBQUM7UUFNTSxZQUFZO1lBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLHlCQUF5QixDQUFDLE1BQU0sRUFBRTtxQkFDcEQsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsOEJBQThCLENBQUMsZ0JBQWdCLEVBQUU7cUJBQ3pFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsbUNBQXlCLENBQUMsQ0FBQyxDQUFDO3FCQUNuRSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO3FCQUM3QixFQUFFLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7cUJBQ3pCLEVBQUUsQ0FBQywyQkFBYyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsRUFBRTtvQkFDNUMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO3dCQUNyQixXQUFXLENBQUMsSUFBSSxDQUFDLHNDQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO3dCQUNsRCxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ3BCLE9BQU8sS0FBSyxDQUFDO3FCQUNiO29CQUVELE9BQU8sU0FBUyxDQUFDO2dCQUNsQixDQUFDLENBQUMsQ0FBQztxQkFDSCxPQUFPLENBQUMsb0JBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFHOUIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxZQUFZO3FCQUN4QyxJQUFJLENBQW9CLENBQUMsV0FBVyxFQUFvQyxFQUFFLENBQUMsV0FBVyxZQUFZLGdCQUFpQixDQUFFLENBQUM7YUFDeEg7WUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztZQUV4QixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO2lCQUUvQixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxrQkFBSyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztpQkFFakQsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztpQkFFbkMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUk7aUJBRTVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxDQUFDLGtCQUFLLENBQ3pDLGNBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFDaEMsaUJBQWlCLEVBRWpCLENBQUMsU0FBb0IsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7aUJBQzdDLFFBQVEsQ0FBQyxTQUFTLENBQUM7aUJBQ25CLElBQUksQ0FBQyxzQ0FBb0IsQ0FBQyxRQUFRLENBQUMsRUFFckMsQ0FBQyxNQUFjLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLFlBQVksZ0JBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FDNUcsQ0FBQyxDQUFDO2lCQUVILE9BQU8sRUFBdUI7aUJBRTlCLE9BQU8sQ0FBQyxvQkFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFTSxPQUFPO1lBQ2IsT0FBTyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDOUQsQ0FBQztRQVNNLGFBQWEsQ0FBQyxJQUEwQztZQUM5RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFN0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxZQUFZLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUU5RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFFZCxJQUFJLElBQUksQ0FBQyxjQUFjO2dCQUFFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7WUFFdEQsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBU00sTUFBTTtZQUNaLElBQUksSUFBSSxDQUFDLGNBQWM7Z0JBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUVyRSxLQUFLLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3hDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDdkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBYSxFQUFFLElBQUksQ0FBQyxJQUFLLENBQUMsQ0FBQzthQUMvQztZQUVELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUFHTSxVQUFVLENBQUMsV0FBcUIsRUFBRSxHQUFtQjtZQUMzRCxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNoRixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2IsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsMEJBQTBCLENBQUM7YUFDMUQ7WUFFRCxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsZ0JBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDN0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUluRCxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUM3QyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQy9CLFdBQVcsR0FBRyxnQkFBUSxDQUFDLGVBQWUsQ0FBQztxQkFDdkM7aUJBQ0Q7YUFDRDtZQUVELE9BQU8sV0FBVyxDQUFDO1FBQ3BCLENBQUM7UUFHTSxTQUFTLENBQUMsS0FBa0I7WUFDbEMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2QsQ0FBQztRQU9NLGFBQWE7WUFDbkIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2YsQ0FBQztRQUdNLGNBQWMsQ0FBQyxNQUFlO1lBQ3BDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNmLENBQUM7UUFHTSxZQUFZLENBQUMsSUFBVyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztZQUMvRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZixDQUFDO1FBUU8sZUFBZTtZQUN0QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUUxQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO2dCQUNqRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1RixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO2FBQzlCO1lBRUQsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO2dCQUN4QixLQUFLLE1BQU0sWUFBWSxJQUFJLElBQUksQ0FBQyxhQUFhO29CQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBRTlGLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7cUJBQ3RFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQzthQUNqQztRQUNGLENBQUM7UUFRTyxpQkFBaUIsQ0FBQyxJQUF1QjtZQUNoRCxNQUFNLFFBQVEsR0FBRyxJQUFJLGlCQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVuRixJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUFFLE9BQU87WUFDcEUsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7WUFFN0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVuRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFHakIsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDN0QscUJBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsa0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2FBQzNFO1lBR0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2hDLHFCQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNsQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhO2dCQUNwQyxHQUFHLEVBQUUsQ0FBQztnQkFDTixJQUFJLEVBQUUsQ0FBQzthQUNQLEVBQUUsa0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQU1PLFNBQVM7WUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzlHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2FBQ3ZCO1lBRUQsS0FBSyxNQUFNLFdBQVcsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUM1QyxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUU7b0JBQ3hCLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztpQkFDeEI7YUFDRDtRQUNGLENBQUM7UUFPTyxzQkFBc0IsQ0FBQyxLQUFhO1lBQzNDLElBQUkscUJBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUN2QixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxDQUFDLG1CQUFtQixFQUFFO3dCQUNyQixXQUFXLEVBQUUseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxnQkFBZ0IsQ0FBQzt3QkFDaEUsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7cUJBQ2pDLENBQUMsQ0FBQyxDQUFDO2dCQUNKLENBQUMsaUJBQWlCLEVBQUU7d0JBQ25CLFdBQVcsRUFBRSx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQzt3QkFDOUQsVUFBVSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO3FCQUN0QyxDQUFDLENBQ0g7aUJBQ0Msc0JBQXNCLEVBQUU7aUJBQ3hCLFdBQVcsQ0FBQyxHQUFHLCtCQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDO2lCQUM1QyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsa0JBQVEsQ0FBQyxJQUFJLENBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMvRCxDQUFDO1FBTU8sZ0JBQWdCO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUMzQixLQUFLLE1BQU0sWUFBWSxJQUFJLElBQUksQ0FBQyxhQUFhO2dCQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDL0YsQ0FBQztRQUtPLGNBQWMsQ0FBQyxLQUFhO1lBQ25DLE9BQU8sR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDMUUsQ0FBQztRQU9PLE9BQU87WUFDZCxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ3hCLHFCQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGtCQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDM0UsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO2FBQzNCO1lBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV2QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN6QixLQUFLLE1BQU0sV0FBVyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQzVDLElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRSxFQUFFO29CQUM1QixXQUFXLENBQUMsSUFBSSxDQUFDLHNDQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUNsRDtnQkFFRCxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDckI7WUFFRCxPQUFPLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDL0IsQ0FBQzs7SUF2VWEseUJBQVcsR0FBdUI7UUFDL0MsT0FBTyxFQUFFO1lBQ1IsQ0FBQyxFQUFFLEVBQUU7WUFDTCxDQUFDLEVBQUUsRUFBRTtTQUNMO1FBQ0QsSUFBSSxFQUFFO1lBQ0wsQ0FBQyxFQUFFLEVBQUU7WUFDTCxDQUFDLEVBQUUsRUFBRTtTQUNMO1FBQ0QsT0FBTyxFQUFFO1lBQ1IsQ0FBQyxFQUFFLEVBQUU7WUFDTCxDQUFDLEVBQUUsRUFBRTtTQUNMO1FBQ0QsS0FBSyxFQUFFO1lBQ04sQ0FBQyxjQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUNmLENBQUMsY0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDaEI7UUFDRCxRQUFRLEVBQUUsS0FBSztLQUNmLENBQUM7SUFLRjtRQURDLGFBQUcsQ0FBQyxRQUFRLENBQWEsNEJBQWMsQ0FBQztzREFDRDtJQUV4QztRQURDLGFBQUcsQ0FBQyxHQUFHLENBQUMsNEJBQWMsQ0FBQzs4Q0FDQztJQWdIekI7UUFEQyxlQUFLOytDQVdMO0lBR0Q7UUFEQyxzQkFBVTttREFvQlY7SUFHRDtRQURDLHNCQUFVO2tEQUdWO0lBT0Q7UUFEQyxzQkFBVTtzREFHVjtJQUdEO1FBREMsc0JBQVU7dURBR1Y7SUFHRDtRQURDLHNCQUFVO3FEQUdWO0lBUUQ7UUFEQyxlQUFLO3dEQWVMO0lBc0NEO1FBREMsZUFBSztrREFZTDtJQU9EO1FBREMsZUFBSzsrREFnQkw7SUFNRDtRQURDLGVBQUs7eURBSUw7SUFjRDtRQURDLGVBQUs7Z0RBbUJMO0lBM1VGLGdDQTZVQyJ9
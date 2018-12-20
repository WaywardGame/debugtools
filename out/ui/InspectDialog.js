var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "mod/IHookHost", "mod/Mod", "newui/BindingManager", "newui/component/ContextMenu", "newui/component/Text", "newui/screen/IScreen", "newui/screen/screens/game/component/Dialog", "newui/screen/screens/game/Dialogs", "utilities/iterable/Collectors", "utilities/iterable/Generators", "utilities/math/Vector3", "utilities/Objects", "utilities/TileHelpers", "../IDebugTools", "../overlay/Overlays", "./component/DebugToolsPanel", "./component/InspectInformationSection", "./inspect/Corpse", "./inspect/Doodad", "./inspect/Entity", "./inspect/Item", "./inspect/Terrain", "./inspect/TileEvent", "./TabDialog"], function (require, exports, Enums_1, IHookHost_1, Mod_1, BindingManager_1, ContextMenu_1, Text_1, IScreen_1, Dialog_1, Dialogs_1, Collectors_1, Generators_1, Vector3_1, Objects_1, TileHelpers_1, IDebugTools_1, Overlays_1, DebugToolsPanel_1, InspectInformationSection_1, Corpse_1, Doodad_1, Entity_1, Item_1, Terrain_1, TileEvent_1, TabDialog_1) {
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
                .until("Remove");
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
                    .on("WillRemove", infoSection => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdERpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9JbnNwZWN0RGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTRDQSxNQUFNLHlCQUF5QixHQUEyQztRQUN6RSxpQkFBa0I7UUFDbEIsZ0JBQWlCO1FBQ2pCLGdCQUFpQjtRQUNqQixnQkFBaUI7UUFDakIsbUJBQW9CO1FBQ3BCLGNBQWU7S0FDZixDQUFDO0lBRUYsTUFBcUIsYUFBYyxTQUFRLG1CQUFTO1FBMkNuRCxZQUFtQixLQUFxQixFQUFFLEVBQVk7WUFDckQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUxWLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ25CLGNBQVMsR0FBRyxLQUFLLENBQUM7WUFDbEIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1lBS2hDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFHL0MsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUseUJBQXlCLENBQUM7aUJBRW5ELEtBQUssVUFBdUIsQ0FBQztZQUUvQixJQUFJLENBQUMsRUFBRSxDQUFDLG9CQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV6QyxhQUFhLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUMvQixDQUFDO1FBTU0sWUFBWTtZQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyx5QkFBeUIsQ0FBQyxNQUFNLEVBQUU7cUJBQ3BELE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLDhCQUE4QixDQUFDLGdCQUFnQixFQUFFO3FCQUN6RSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLG1DQUF5QixDQUFDLENBQUMsQ0FBQztxQkFDbkUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztxQkFDN0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDO3FCQUN6QixFQUFFLGVBQTRCLFdBQVcsQ0FBQyxFQUFFO29CQUM1QyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7d0JBQ3JCLFdBQVcsQ0FBQyxJQUFJLENBQUMsc0NBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7d0JBQ2xELFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDcEIsT0FBTyxLQUFLLENBQUM7cUJBQ2I7b0JBRUQsT0FBTyxTQUFTLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQyxDQUFDO3FCQUNILE9BQU8sQ0FBQyxvQkFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUc5QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFlBQVk7cUJBQ3hDLElBQUksQ0FBb0IsQ0FBQyxXQUFXLEVBQW9DLEVBQUUsQ0FBQyxXQUFXLFlBQVksZ0JBQWlCLENBQUUsQ0FBQzthQUN4SDtZQUVELElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1lBRXhCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUU7aUJBRS9CLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGtCQUFLLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2lCQUVqRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2lCQUVuQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSTtpQkFFNUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsRUFBRSxFQUFFLENBQUMsa0JBQUssQ0FDekMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUNoQyxpQkFBaUIsRUFFakIsQ0FBQyxTQUFvQixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztpQkFDN0MsUUFBUSxDQUFDLFNBQVMsQ0FBQztpQkFDbkIsSUFBSSxDQUFDLHNDQUFvQixDQUFDLFFBQVEsQ0FBQyxFQUVyQyxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sWUFBWSxnQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUM1RyxDQUFDLENBQUM7aUJBRUgsT0FBTyxFQUF1QjtpQkFFOUIsT0FBTyxDQUFDLG9CQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUVNLE9BQU87WUFDYixPQUFPLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBU00sYUFBYSxDQUFDLElBQTBDO1lBQzlELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUU3QixJQUFJLENBQUMsY0FBYyxHQUFHLFlBQVksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBRTlELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUVkLElBQUksSUFBSSxDQUFDLGNBQWM7Z0JBQUUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztZQUV0RCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFTTSxNQUFNO1lBQ1osSUFBSSxJQUFJLENBQUMsY0FBYztnQkFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRXJFLEtBQUssTUFBTSxPQUFPLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDeEMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUN2QixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFhLEVBQUUsSUFBSSxDQUFDLElBQUssQ0FBQyxDQUFDO2FBQy9DO1lBRUQsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUdNLFVBQVUsQ0FBQyxXQUFxQixFQUFFLEdBQW1CO1lBQzNELElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ2hGLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDYixXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQywwQkFBMEIsQ0FBQzthQUMxRDtZQUVELElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxnQkFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUM3RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBSW5ELElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQzdDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDL0IsV0FBVyxHQUFHLGdCQUFRLENBQUMsZUFBZSxDQUFDO3FCQUN2QztpQkFDRDthQUNEO1lBRUQsT0FBTyxXQUFXLENBQUM7UUFDcEIsQ0FBQztRQUdNLFNBQVMsQ0FBQyxLQUFrQjtZQUNsQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZCxDQUFDO1FBT00sYUFBYTtZQUNuQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZixDQUFDO1FBR00sY0FBYyxDQUFDLE1BQWU7WUFDcEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2YsQ0FBQztRQUdNLFlBQVksQ0FBQyxJQUFXLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1lBQy9ELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNmLENBQUM7UUFRTyxlQUFlO1lBQ3RCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBRTFCLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ2pELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7YUFDOUI7WUFFRCxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ3hCLEtBQUssTUFBTSxZQUFZLElBQUksSUFBSSxDQUFDLGFBQWE7b0JBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFFOUYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztxQkFDdEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2FBQ2pDO1FBQ0YsQ0FBQztRQVFPLGlCQUFpQixDQUFDLElBQXVCO1lBQ2hELE1BQU0sUUFBUSxHQUFHLElBQUksaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRW5GLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQUUsT0FBTztZQUNwRSxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQztZQUU3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRW5ELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUdqQixJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUM3RCxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxrQkFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7YUFDM0U7WUFHRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDaEMscUJBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2xDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWE7Z0JBQ3BDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLElBQUksRUFBRSxDQUFDO2FBQ1AsRUFBRSxrQkFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixDQUFDO1FBTU8sU0FBUztZQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDOUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7YUFDdkI7WUFFRCxLQUFLLE1BQU0sV0FBVyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQzVDLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRTtvQkFDeEIsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO2lCQUN4QjthQUNEO1FBQ0YsQ0FBQztRQU9PLHNCQUFzQixDQUFDLEtBQWE7WUFDM0MsSUFBSSxxQkFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQ3ZCLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELENBQUMsbUJBQW1CLEVBQUU7d0JBQ3JCLFdBQVcsRUFBRSx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGdCQUFnQixDQUFDO3dCQUNoRSxVQUFVLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtxQkFDakMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0osQ0FBQyxpQkFBaUIsRUFBRTt3QkFDbkIsV0FBVyxFQUFFLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsY0FBYyxDQUFDO3dCQUM5RCxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUM7cUJBQ3RDLENBQUMsQ0FDSDtpQkFDQyxzQkFBc0IsRUFBRTtpQkFDeEIsV0FBVyxDQUFDLEdBQUcsK0JBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUM7aUJBQzVDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQkFBUSxDQUFDLElBQUksQ0FBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFNTyxnQkFBZ0I7WUFDdkIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQzNCLEtBQUssTUFBTSxZQUFZLElBQUksSUFBSSxDQUFDLGFBQWE7Z0JBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMvRixDQUFDO1FBS08sY0FBYyxDQUFDLEtBQWE7WUFDbkMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMxRSxDQUFDO1FBT08sT0FBTztZQUNkLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDeEIscUJBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsa0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUMzRSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7YUFDM0I7WUFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXZCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLEtBQUssTUFBTSxXQUFXLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDNUMsSUFBSSxXQUFXLENBQUMsU0FBUyxFQUFFLEVBQUU7b0JBQzVCLFdBQVcsQ0FBQyxJQUFJLENBQUMsc0NBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQ2xEO2dCQUVELFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNyQjtZQUVELE9BQU8sYUFBYSxDQUFDLFFBQVEsQ0FBQztRQUMvQixDQUFDOztJQXZVYSx5QkFBVyxHQUF1QjtRQUMvQyxPQUFPLEVBQUU7WUFDUixDQUFDLEVBQUUsRUFBRTtZQUNMLENBQUMsRUFBRSxFQUFFO1NBQ0w7UUFDRCxJQUFJLEVBQUU7WUFDTCxDQUFDLEVBQUUsRUFBRTtZQUNMLENBQUMsRUFBRSxFQUFFO1NBQ0w7UUFDRCxPQUFPLEVBQUU7WUFDUixDQUFDLEVBQUUsRUFBRTtZQUNMLENBQUMsRUFBRSxFQUFFO1NBQ0w7UUFDRCxLQUFLLEVBQUU7WUFDTixDQUFDLGNBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQ2YsQ0FBQyxjQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUNoQjtRQUNELFFBQVEsRUFBRSxLQUFLO0tBQ2YsQ0FBQztJQUtGO1FBREMsYUFBRyxDQUFDLFFBQVEsQ0FBYSw0QkFBYyxDQUFDO3NEQUNEO0lBRXhDO1FBREMsYUFBRyxDQUFDLEdBQUcsQ0FBQyw0QkFBYyxDQUFDOzhDQUNDO0lBZ0h6QjtRQURDLGVBQUs7K0NBV0w7SUFHRDtRQURDLHNCQUFVO21EQW9CVjtJQUdEO1FBREMsc0JBQVU7a0RBR1Y7SUFPRDtRQURDLHNCQUFVO3NEQUdWO0lBR0Q7UUFEQyxzQkFBVTt1REFHVjtJQUdEO1FBREMsc0JBQVU7cURBR1Y7SUFRRDtRQURDLGVBQUs7d0RBZUw7SUFzQ0Q7UUFEQyxlQUFLO2tEQVlMO0lBT0Q7UUFEQyxlQUFLOytEQWdCTDtJQU1EO1FBREMsZUFBSzt5REFJTDtJQWNEO1FBREMsZUFBSztnREFtQkw7SUEzVUYsZ0NBNlVDIn0=
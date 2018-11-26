var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "mod/IHookHost", "mod/Mod", "newui/BindingManager", "newui/component/ContextMenu", "newui/component/IComponent", "newui/component/Text", "newui/screen/IScreen", "newui/screen/screens/game/component/Dialog", "newui/screen/screens/game/Dialogs", "utilities/Arrays", "utilities/iterable/Collectors", "utilities/math/Vector3", "utilities/Objects", "utilities/TileHelpers", "../IDebugTools", "../overlay/Overlays", "./component/DebugToolsPanel", "./component/InspectInformationSection", "./inspect/Corpse", "./inspect/Doodad", "./inspect/Entity", "./inspect/Item", "./inspect/Terrain", "./inspect/TileEvent", "./TabDialog"], function (require, exports, Enums_1, IHookHost_1, Mod_1, BindingManager_1, ContextMenu_1, IComponent_1, Text_1, IScreen_1, Dialog_1, Dialogs_1, Arrays_1, Collectors_1, Vector3_1, Objects_1, TileHelpers_1, IDebugTools_1, Overlays_1, DebugToolsPanel_1, InspectInformationSection_1, Corpse_1, Doodad_1, Entity_1, Item_1, Terrain_1, TileEvent_1, TabDialog_1) {
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
                .map(section => Arrays_1.tuple(section, section.getTabs()))
                .filter(([, tabs]) => !!tabs.length)
                .map(([section, tabs]) => tabs
                .map(([index, getTabTranslation]) => Arrays_1.tuple(Text_1.default.toString(getTabTranslation), getTabTranslation, (component) => section.setTab(index)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdERpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9JbnNwZWN0RGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTRDQSxNQUFNLHlCQUF5QixHQUEyQztRQUN6RSxpQkFBa0I7UUFDbEIsZ0JBQWlCO1FBQ2pCLGdCQUFpQjtRQUNqQixnQkFBaUI7UUFDakIsbUJBQW9CO1FBQ3BCLGNBQWU7S0FDZixDQUFDO0lBRUYsTUFBcUIsYUFBYyxTQUFRLG1CQUFTO1FBMkNuRCxZQUFtQixLQUFxQixFQUFFLEVBQVk7WUFDckQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUxWLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ25CLGNBQVMsR0FBRyxLQUFLLENBQUM7WUFDbEIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1lBS2hDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFHL0MsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUseUJBQXlCLENBQUM7aUJBRW5ELEtBQUssQ0FBQywyQkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRS9CLElBQUksQ0FBQyxFQUFFLENBQUMsb0JBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXpDLGFBQWEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQy9CLENBQUM7UUFNTSxZQUFZO1lBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLHlCQUF5QixDQUFDLE1BQU0sRUFBRTtxQkFDcEQsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsOEJBQThCLENBQUMsZ0JBQWdCLEVBQUU7cUJBQ3pFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsbUNBQXlC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
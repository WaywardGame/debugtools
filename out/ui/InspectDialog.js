var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "mod/IHookHost", "mod/Mod", "newui/BindingManager", "newui/component/ContextMenu", "newui/component/IComponent", "newui/component/Text", "newui/screen/IScreen", "newui/screen/screens/game/component/Dialog", "newui/screen/screens/game/Dialogs", "utilities/Arrays", "utilities/Collectors", "utilities/math/Vector3", "utilities/Objects", "utilities/TileHelpers", "../DebugTools", "../IDebugTools", "../overlay/Overlays", "./component/DebugToolsPanel", "./inspect/Corpse", "./inspect/Doodad", "./inspect/Entity", "./inspect/Item", "./inspect/Terrain", "./inspect/TileEvent", "./TabDialog"], function (require, exports, Enums_1, IHookHost_1, Mod_1, BindingManager_1, ContextMenu_1, IComponent_1, Text_1, IScreen_1, Dialog_1, Dialogs_1, Arrays_1, Collectors_1, Vector3_1, Objects_1, TileHelpers_1, DebugTools_1, IDebugTools_1, Overlays_1, DebugToolsPanel_1, Corpse_1, Doodad_1, Entity_1, Item_1, Terrain_1, TileEvent_1, TabDialog_1) {
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
                this.infoSections = informationSectionClasses.map(cls => new cls(this.api)
                    .on("update", this.update)
                    .on(IComponent_1.ComponentEvent.WillRemove, infoSection => {
                    if (this.storePanels) {
                        infoSection.trigger(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway);
                        infoSection.store();
                        return false;
                    }
                    return undefined;
                }));
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
                .trigger(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo), (button) => !(section instanceof Entity_1.default) ? undefined : this.entityButtons[index] = button)))
                .flat(1)
                .collect(Collectors_1.default.toArray);
        }
        getName() {
            return DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.DialogTitleInspect);
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
                this.LOG.info("Tile:", this.tile);
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
                        translation: DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.UnlockInspection),
                        onActivate: this.unlockInspection,
                    }] :
                ["Lock Inspection", {
                        translation: DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LockInspection),
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
            for (const infoSection of this.infoSections)
                infoSection.remove();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdERpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9JbnNwZWN0RGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTBDQSxNQUFNLHlCQUF5QixHQUFzRDtRQUNwRixpQkFBa0I7UUFDbEIsZ0JBQWlCO1FBQ2pCLGdCQUFpQjtRQUNqQixnQkFBaUI7UUFDakIsbUJBQW9CO1FBQ3BCLGNBQWU7S0FDZixDQUFDO0lBRUYsTUFBcUIsYUFBYyxTQUFRLG1CQUFTO1FBMkNuRCxZQUFtQixLQUFxQixFQUFFLEVBQVk7WUFDckQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUxWLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ25CLGNBQVMsR0FBRyxLQUFLLENBQUM7WUFDbEIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1lBS2hDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFHL0MsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUseUJBQXlCLENBQUM7aUJBRW5ELEtBQUssQ0FBQywyQkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRS9CLElBQUksQ0FBQyxFQUFFLENBQUMsb0JBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXpDLGFBQWEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQy9CLENBQUM7UUFNTSxZQUFZO1lBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLHlCQUF5QixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7cUJBQ3hFLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztxQkFDekIsRUFBRSxDQUFDLDJCQUFj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
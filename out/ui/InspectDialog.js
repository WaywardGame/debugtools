var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventManager", "game/IGame", "mod/IHookHost", "mod/Mod", "newui/BindingManager", "newui/component/ContextMenu", "newui/component/Text", "newui/screen/screens/game/Dialogs", "utilities/Arrays", "utilities/math/Vector3", "utilities/TileHelpers", "../IDebugTools", "../overlay/Overlays", "./component/InspectInformationSection", "./inspect/Corpse", "./inspect/Doodad", "./inspect/Entity", "./inspect/Item", "./inspect/Terrain", "./inspect/TileEvent", "./TabDialog"], function (require, exports, EventManager_1, IGame_1, IHookHost_1, Mod_1, BindingManager_1, ContextMenu_1, Text_1, Dialogs_1, Arrays_1, Vector3_1, TileHelpers_1, IDebugTools_1, Overlays_1, InspectInformationSection_1, Corpse_1, Doodad_1, Entity_1, Item_1, Terrain_1, TileEvent_1, TabDialog_1) {
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
                .map(section => Arrays_1.tuple(section, section.getTabs()))
                .filter(([, tabs]) => !!tabs.length)
                .map(([section, tabs]) => tabs
                .map(([index, getTabTranslation]) => Arrays_1.tuple(Text_1.default.toString(getTabTranslation), getTabTranslation, (component) => section.setTab(index)
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
        onBindLoop(bindPressed, api) {
            if (api.wasPressed(this.DEBUG_TOOLS.bindableCloseInspectDialog) && !bindPressed) {
                this.close();
                bindPressed = this.DEBUG_TOOLS.bindableCloseInspectDialog;
            }
            if (api.wasPressed(BindingManager_1.Bindable.MenuContextMenu) && !bindPressed) {
                for (let i = 0; i < this.entityButtons.length; i++) {
                    if (api.isMouseWithin(this.entityButtons[i])) {
                        this.showInspectionLockMenu(i);
                        bindPressed = BindingManager_1.Bindable.MenuContextMenu;
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
                .setPosition(...BindingManager_1.bindingManager.getMouse().xy)
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
        Override
    ], InspectDialog.prototype, "getSubpanels", null);
    __decorate([
        Override
    ], InspectDialog.prototype, "getName", null);
    __decorate([
        Bound
    ], InspectDialog.prototype, "update", null);
    __decorate([
        Override, IHookHost_1.HookMethod
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
        EventManager_1.EventHandler("self")("close")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdERpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9JbnNwZWN0RGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXdDQSxNQUFNLHlCQUF5QixHQUEyQztRQUN6RSxpQkFBa0I7UUFDbEIsZ0JBQWlCO1FBQ2pCLGdCQUFpQjtRQUNqQixnQkFBaUI7UUFDakIsbUJBQW9CO1FBQ3BCLGNBQWU7S0FDZixDQUFDO0lBRUYsTUFBcUIsYUFBYyxTQUFRLG1CQUFTO1FBMkNuRCxZQUFtQixFQUFZO1lBQzlCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUxILGdCQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ25CLGNBQVMsR0FBRyxLQUFLLENBQUM7WUFDbEIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1lBS2hDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFHL0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFFakQsYUFBYSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDL0IsQ0FBQztRQU1nQixZQUFZO1lBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLHlCQUF5QixDQUFDLE1BQU0sRUFBRTtxQkFDcEQsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsOEJBQThCLENBQUMsZ0JBQWdCLEVBQUU7cUJBQ3ZFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsbUNBQXlCLENBQUMsQ0FBQyxDQUFDO3FCQUNuRSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRTtxQkFDbkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztxQkFDdEMsS0FBSyxD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
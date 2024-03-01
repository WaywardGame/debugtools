/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@wayward/game/event/EventBuses", "@wayward/game/event/EventManager", "@wayward/game/game/entity/Entity", "@wayward/game/game/item/Item", "@wayward/game/game/tile/ITerrain", "@wayward/game/game/tile/Tile", "@wayward/game/mod/Mod", "@wayward/game/mod/ModRegistry", "@wayward/game/renderer/IRenderer", "@wayward/game/ui/component/ContextMenu", "@wayward/game/ui/component/Text", "@wayward/game/ui/input/Bind", "@wayward/game/ui/input/Bindable", "@wayward/game/ui/input/InputManager", "@wayward/game/ui/screen/screens/game/Dialogs", "@wayward/game/ui/screen/screens/game/component/TabDialog", "@wayward/game/utilities/math/Vector2", "@wayward/utilities/Decorators", "@wayward/utilities/collection/Tuple", "@wayward/utilities/event/EventManager", "../IDebugTools", "./component/Container", "./component/InspectInformationSection", "./inspect/CorpseInformation", "./inspect/DoodadInformation", "./inspect/EntityInformation", "./inspect/ItemInformation", "./inspect/TerrainInformation", "./inspect/TileEventInformation", "./inspect/VehicleInformation"], function (require, exports, EventBuses_1, EventManager_1, Entity_1, Item_1, ITerrain_1, Tile_1, Mod_1, ModRegistry_1, IRenderer_1, ContextMenu_1, Text_1, Bind_1, Bindable_1, InputManager_1, Dialogs_1, TabDialog_1, Vector2_1, Decorators_1, Tuple_1, EventManager_2, IDebugTools_1, Container_1, InspectInformationSection_1, CorpseInformation_1, DoodadInformation_1, EntityInformation_1, ItemInformation_1, TerrainInformation_1, TileEventInformation_1, VehicleInformation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const informationSectionClasses = [
        TerrainInformation_1.default,
        EntityInformation_1.default,
        CorpseInformation_1.default,
        DoodadInformation_1.default,
        VehicleInformation_1.default,
        TileEventInformation_1.default,
        ItemInformation_1.default,
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
                .find((infoSection) => infoSection instanceof EntityInformation_1.default);
            return subpanels;
        }
        getSubpanelInformation(subpanels) {
            this.entityButtons = [];
            return this.subpanels.stream()
                .map(section => (0, Tuple_1.Tuple)(section, section.getTabs()))
                .filter(([, tabs]) => !!tabs.length)
                .map(([section, tabs]) => tabs
                .map(([index, getTabTranslation]) => (0, Tuple_1.Tuple)(Text_1.default.toString(getTabTranslation), getTabTranslation, (component) => section.setTab(index)
                .schedule(section => this.onShowSubpanel(section)(component)), (button) => !(section instanceof EntityInformation_1.default) ? undefined : this.entityButtons[index] = button)))
                .flatMap()
                .toArray();
        }
        getName() {
            return (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.DialogTitleInspect);
        }
        setInspection(what) {
            this.setInspectionTile(what);
            const item = what instanceof Item_1.default ? what : undefined;
            if (item)
                this.LOG.info("Item:", item);
            while (what instanceof Item_1.default) {
                const containerEntity = what.island.items.resolveContainer(what.containedWithin);
                if (containerEntity instanceof Entity_1.default) {
                    what = containerEntity;
                }
            }
            this.inspectionLock = what instanceof Entity_1.default ? what : undefined;
            this.update();
            if (item) {
                this.event.waitFor("updateSubpanels").then(() => {
                    const itemShowed = Container_1.default.getFirst()?.showItem(item);
                    this.panelWrapper.scrollTo(itemShowed, 300);
                });
            }
            if (this.inspectionLock)
                this.willShowSubpanel = true;
            return this;
        }
        update() {
            if (this.inspectionLock)
                this.setInspectionTile(this.inspectionLock);
            for (const section of this.subpanels) {
                section.resetWillLog();
                section.update(this.tile);
            }
            this.logUpdate();
            this.schedule(20, 50, this.updateSubpanels);
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
        onGameTickEnd(island) {
            if (island.isLocalIsland) {
                this.update();
            }
        }
        onMoveComplete() {
            this.update();
        }
        onTileUpdate(island, tile, tileUpdateType) {
            this.update();
        }
        onClose() {
            if (this.inspectingTile) {
                this.inspectingTile.tile.removeOverlay(this.inspectingTile.overlay);
                delete this.inspectingTile;
            }
            localPlayer.updateView(IRenderer_1.RenderSource.Mod, false);
            delete InspectDialog.INSTANCE;
        }
        updateSubpanels() {
            this.updateSubpanelList();
            let lockedButton;
            if (this.willShowSubpanel && this.inspectionLock) {
                lockedButton = this.entityButtons[this.entityInfoSection.getEntityIndex(this.inspectionLock)]
                    ?? (this.inspectionLock.asDoodad && this.subpanelInformations.find(info => `${info[0]}`.startsWith("Doodad: "))?.[4]);
                this.showSubPanel(lockedButton);
                this.willShowSubpanel = false;
            }
            if (this.inspectionLock) {
                for (const entityButton of this.entityButtons)
                    entityButton.classes.remove("inspection-lock");
                lockedButton?.classes.add("inspection-lock");
            }
            this.event.emit("updateSubpanels");
        }
        setInspectionTile(what) {
            const tile = what instanceof Tile_1.default ? what : what.tile;
            ;
            if (!tile) {
                return;
            }
            if (this.tile && this.tile === tile) {
                return;
            }
            this.tile = tile;
            this.shouldLog = true;
            this.logUpdate();
            if (this.inspectingTile && this.tile !== this.inspectingTile.tile) {
                this.inspectingTile.tile.removeOverlay(this.inspectingTile.overlay);
            }
            this.inspectingTile = {
                tile: this.tile,
                overlay: {
                    type: this.DEBUG_TOOLS.overlayTarget,
                    red: 0,
                    blue: 0,
                },
            };
            this.tile.addOrUpdateOverlay(this.inspectingTile.overlay);
            localPlayer.updateView(IRenderer_1.RenderSource.Mod, false);
        }
        logUpdate() {
            if (this.shouldLog) {
                const tileData = this.tile ? this.tile.getTileData() : undefined;
                this.LOG.info("Tile:", this.tile, this.tile?.toString(), tileData?.map(data => ITerrain_1.TerrainType[data.type]).join(", "), tileData);
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
        minResolution: new Vector2_1.default(300, 200),
        size: new Vector2_1.default(29, 31),
        edges: [
            [Dialogs_1.Edge.Left, 50],
            [Dialogs_1.Edge.Top, 7],
        ],
        saveOpen: false,
    };
    exports.default = InspectDialog;
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
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Island, "tickEnd"),
        (0, Decorators_1.Debounce)(10)
    ], InspectDialog.prototype, "onGameTickEnd", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Players, "moveComplete")
    ], InspectDialog.prototype, "onMoveComplete", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Island, "tileUpdate"),
        (0, Decorators_1.Debounce)(10)
    ], InspectDialog.prototype, "onTileUpdate", null);
    __decorate([
        (0, EventManager_2.OwnEventHandler)(InspectDialog, "close")
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdERpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9JbnNwZWN0RGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7Ozs7OztJQThDSCxNQUFNLHlCQUF5QixHQUEyQztRQUN6RSw0QkFBa0I7UUFDbEIsMkJBQWlCO1FBQ2pCLDJCQUFpQjtRQUNqQiwyQkFBaUI7UUFDakIsNEJBQWtCO1FBQ2xCLDhCQUFvQjtRQUNwQix5QkFBZTtLQUNmLENBQUM7SUFNRixNQUFxQixhQUFjLFNBQVEsbUJBQW9DO1FBZ0M5RSxZQUFtQixFQUFZO1lBQzlCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUpILGNBQVMsR0FBRyxLQUFLLENBQUM7WUFDbEIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1lBS2hDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFFL0MsYUFBYSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDL0IsQ0FBQztRQU1rQixZQUFZO1lBQzlCLE1BQU0sU0FBUyxHQUFHLHlCQUF5QixDQUFDLE1BQU0sRUFBRTtpQkFDbEQsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsOEJBQThCLENBQUMsZ0JBQWdCLEVBQUU7aUJBQ3ZFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsbUNBQXlCLENBQUMsQ0FBQyxDQUFDO2lCQUNuRSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRTtpQkFDbkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUN4QyxPQUFPLEVBQUUsQ0FBQztZQUdaLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxTQUFTO2lCQUNoQyxJQUFJLENBQW9CLENBQUMsV0FBVyxFQUFvQyxF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
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
define(["require", "exports", "event/EventBuses", "event/EventManager", "game/item/Item", "game/tile/ITerrain", "game/tile/Tile", "mod/Mod", "mod/ModRegistry", "renderer/IRenderer", "ui/component/ContextMenu", "ui/component/Text", "ui/input/Bind", "ui/input/Bindable", "ui/input/InputManager", "ui/screen/screens/game/Dialogs", "ui/screen/screens/game/component/TabDialog", "utilities/Decorators", "utilities/collection/Tuple", "utilities/math/Vector2", "../IDebugTools", "./component/Container", "./component/InspectInformationSection", "./inspect/Corpse", "./inspect/Doodad", "./inspect/Entity", "./inspect/Item", "./inspect/Terrain", "./inspect/TileEvent"], function (require, exports, EventBuses_1, EventManager_1, Item_1, ITerrain_1, Tile_1, Mod_1, ModRegistry_1, IRenderer_1, ContextMenu_1, Text_1, Bind_1, Bindable_1, InputManager_1, Dialogs_1, TabDialog_1, Decorators_1, Tuple_1, Vector2_1, IDebugTools_1, Container_1, InspectInformationSection_1, Corpse_1, Doodad_1, Entity_1, Item_2, Terrain_1, TileEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const informationSectionClasses = [
        Terrain_1.default,
        Entity_1.default,
        Corpse_1.default,
        Doodad_1.default,
        TileEvent_1.default,
        Item_2.default,
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
                .map(section => (0, Tuple_1.Tuple)(section, section.getTabs()))
                .filter(([, tabs]) => !!tabs.length)
                .map(([section, tabs]) => tabs
                .map(([index, getTabTranslation]) => (0, Tuple_1.Tuple)(Text_1.default.toString(getTabTranslation), getTabTranslation, (component) => section.setTab(index)
                .schedule(section => this.onShowSubpanel(section)(component)), (button) => !(section instanceof Entity_1.default) ? undefined : this.entityButtons[index] = button)))
                .flatMap()
                .toArray();
        }
        getName() {
            return (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.DialogTitleInspect);
        }
        setInspection(what) {
            this.setInspectionTile(what);
            let item;
            if (what instanceof Item_1.default) {
                item = what;
                this.LOG.info("Item:", item);
                const human = what.getCurrentOwner();
                if (human) {
                    what = human;
                }
            }
            this.inspectionLock = "entityType" in what ? what : undefined;
            this.update();
            if (item) {
                this.event.waitFor("updateSubpanels").then(() => {
                    const itemElement = this.queryX(`.${Container_1.ContainerClasses.ItemDetails}[@data-item-id="${item.id}"]`);
                    if (itemElement) {
                        for (const itemDetailsElement of this.element.querySelectorAll(`.${Container_1.ContainerClasses.ItemDetails}, .${Container_1.ContainerClasses.ContainedItemDetails}`))
                            itemDetailsElement.open = false;
                        let detailsElement = itemElement;
                        while (detailsElement = detailsElement.parentElement?.closest(`.${Container_1.ContainerClasses.ContainedItemDetails}, .${Container_1.ContainerClasses.ItemDetails}`))
                            detailsElement.open = true;
                        itemElement.open = true;
                        const summary = itemElement.querySelector("summary");
                        if (summary) {
                            this.panelWrapper.scrollTo(summary, 300);
                            summary?.focus();
                        }
                    }
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
        onGameTickEnd() {
            this.update();
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
        size: new Vector2_1.default(29, 25),
        edges: [
            [Dialogs_1.Edge.Left, 50],
            [Dialogs_1.Edge.Bottom, 31],
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
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Game, "tickEnd"),
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdERpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9JbnNwZWN0RGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7Ozs7OztJQTJDSCxNQUFNLHlCQUF5QixHQUEyQztRQUN6RSxpQkFBa0I7UUFDbEIsZ0JBQWlCO1FBQ2pCLGdCQUFpQjtRQUNqQixnQkFBaUI7UUFDakIsbUJBQW9CO1FBQ3BCLGNBQWU7S0FDZixDQUFDO0lBTUYsTUFBcUIsYUFBYyxTQUFRLG1CQUFvQztRQWdDOUUsWUFBbUIsRUFBWTtZQUM5QixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7WUFKSCxjQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ2xCLHFCQUFnQixHQUFHLEtBQUssQ0FBQztZQUtoQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1lBRS9DLGFBQWEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQy9CLENBQUM7UUFNa0IsWUFBWTtZQUM5QixNQUFNLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQyxNQUFNLEVBQUU7aUJBQ2xELEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLDhCQUE4QixDQUFDLGdCQUFnQixFQUFFO2lCQUN2RSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLG1DQUF5QixDQUFDLENBQUMsQ0FBQztpQkFDbkUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUU7aUJBQ25CLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDeEMsT0FBTyxFQUFFLENBQUM7WUFHWixJQUFJLENBQUMsaUJBQWlCLEdBQUcsU0FBUztpQkFDaEMsSUFBSSxDQUFvQixDQUFDLFdBQVcsRUFBb0MsRUFBRSxDQUFDLFdBQVcs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
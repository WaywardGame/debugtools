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
define(["require", "exports", "event/EventBuses", "event/EventManager", "game/item/Item", "game/tile/ITerrain", "game/tile/Tile", "mod/Mod", "mod/ModRegistry", "renderer/IRenderer", "ui/component/ContextMenu", "ui/component/Text", "ui/input/Bind", "ui/input/Bindable", "ui/input/InputManager", "ui/screen/screens/game/Dialogs", "ui/screen/screens/game/component/TabDialog", "utilities/Decorators", "utilities/collection/Tuple", "utilities/math/Vector2", "../IDebugTools", "./component/Container", "./component/InspectInformationSection", "./inspect/CorpseInformation", "./inspect/DoodadInformation", "./inspect/EntityInformation", "./inspect/ItemInformation", "./inspect/TerrainInformation", "./inspect/TileEventInformation"], function (require, exports, EventBuses_1, EventManager_1, Item_1, ITerrain_1, Tile_1, Mod_1, ModRegistry_1, IRenderer_1, ContextMenu_1, Text_1, Bind_1, Bindable_1, InputManager_1, Dialogs_1, TabDialog_1, Decorators_1, Tuple_1, Vector2_1, IDebugTools_1, Container_1, InspectInformationSection_1, CorpseInformation_1, DoodadInformation_1, EntityInformation_1, ItemInformation_1, TerrainInformation_1, TileEventInformation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const informationSectionClasses = [
        TerrainInformation_1.default,
        EntityInformation_1.default,
        CorpseInformation_1.default,
        DoodadInformation_1.default,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdERpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9JbnNwZWN0RGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7Ozs7OztJQTJDSCxNQUFNLHlCQUF5QixHQUEyQztRQUN6RSw0QkFBa0I7UUFDbEIsMkJBQWlCO1FBQ2pCLDJCQUFpQjtRQUNqQiwyQkFBaUI7UUFDakIsOEJBQW9CO1FBQ3BCLHlCQUFlO0tBQ2YsQ0FBQztJQU1GLE1BQXFCLGFBQWMsU0FBUSxtQkFBb0M7UUFnQzlFLFlBQW1CLEVBQVk7WUFDOUIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBSkgsY0FBUyxHQUFHLEtBQUssQ0FBQztZQUNsQixxQkFBZ0IsR0FBRyxLQUFLLENBQUM7WUFLaEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUUvQyxhQUFhLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUMvQixDQUFDO1FBTWtCLFlBQVk7WUFDOUIsTUFBTSxTQUFTLEdBQUcseUJBQXlCLENBQUMsTUFBTSxFQUFFO2lCQUNsRCxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyw4QkFBOEIsQ0FBQyxnQkFBZ0IsRUFBRTtpQkFDdkUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxtQ0FBeUIsQ0FBQyxDQUFDLENBQUM7aUJBQ25FLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxFQUFFO2lCQUNuQixLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3hDLE9BQU8sRUFBRSxDQUFDO1lBR1osSUFBSSxDQUFDLGlCQUFpQixHQUFHLFNBQVM7aUJBQ2hDLElBQUksQ0FBb0IsQ0FBQyxXQUFXLEVBQW9DLEVBQUUsQ0FBQyxXQUFX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
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
define(["require", "exports", "event/EventBuses", "event/EventManager", "game/island/Island", "mod/Mod", "mod/ModRegistry", "renderer/IRenderer", "renderer/world/WorldRenderer", "ui/input/Bind", "ui/input/IInput", "ui/input/InputManager", "ui/screen/screens/GameScreen", "ui/screen/screens/game/static/menubar/IMenuBarButton", "utilities/Decorators", "utilities/class/Inject", "utilities/math/Vector2", "utilities/math/Vector3", "./Actions", "./IDebugTools", "./LocationSelector", "./UnlockedCameraMovementHandler", "./action/AddItemToInventory", "./action/ChangeLayer", "./action/ChangeTerrain", "./action/ClearInventory", "./action/Clone", "./action/ForceSailToCivilization", "./action/Heal", "./action/Kill", "./action/MoveToIsland", "./action/Paint", "./action/PlaceTemplate", "./action/Remove", "./action/RenameIsland", "./action/SelectionExecute", "./action/SetDecay", "./action/SetDecayBulk", "./action/SetDurability", "./action/SetDurabilityBulk", "./action/SetGrowingStage", "./action/SetSkill", "./action/SetStat", "./action/SetTamed", "./action/SetTime", "./action/SetWeightBonus", "./action/TeleportEntity", "./action/ToggleInvulnerable", "./action/ToggleNoClip", "./action/TogglePermissions", "./action/ToggleTilled", "./action/UpdateStatsAndAttributes", "./overlay/TemperatureOverlay", "./ui/AccidentalDeathHelper", "./ui/DebugToolsDialog", "./ui/InspectDialog", "./ui/component/Container", "./ui/component/DebugToolsPanel", "./ui/inspection/Temperature", "./util/Version"], function (require, exports, EventBuses_1, EventManager_1, Island_1, Mod_1, ModRegistry_1, IRenderer_1, WorldRenderer_1, Bind_1, IInput_1, InputManager_1, GameScreen_1, IMenuBarButton_1, Decorators_1, Inject_1, Vector2_1, Vector3_1, Actions_1, IDebugTools_1, LocationSelector_1, UnlockedCameraMovementHandler_1, AddItemToInventory_1, ChangeLayer_1, ChangeTerrain_1, ClearInventory_1, Clone_1, ForceSailToCivilization_1, Heal_1, Kill_1, MoveToIsland_1, Paint_1, PlaceTemplate_1, Remove_1, RenameIsland_1, SelectionExecute_1, SetDecay_1, SetDecayBulk_1, SetDurability_1, SetDurabilityBulk_1, SetGrowingStage_1, SetSkill_1, SetStat_1, SetTamed_1, SetTime_1, SetWeightBonus_1, TeleportEntity_1, ToggleInvulnerable_1, ToggleNoClip_1, TogglePermissions_1, ToggleTilled_1, UpdateStatsAndAttributes_1, TemperatureOverlay_1, AccidentalDeathHelper_1, DebugToolsDialog_1, InspectDialog_1, Container_1, DebugToolsPanel_1, Temperature_1, Version_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DebugToolsPanel = void 0;
    exports.DebugToolsPanel = DebugToolsPanel_1.default;
    var CameraState;
    (function (CameraState) {
        CameraState[CameraState["Locked"] = 0] = "Locked";
        CameraState[CameraState["Unlocked"] = 1] = "Unlocked";
        CameraState[CameraState["Transition"] = 2] = "Transition";
    })(CameraState || (CameraState = {}));
    class DebugTools extends Mod_1.default {
        constructor() {
            super(...arguments);
            this.temperatureOverlay = new TemperatureOverlay_1.TemperatureOverlay();
            this.accidentalDeathHelper = new AccidentalDeathHelper_1.default();
            this.cameraState = CameraState.Locked;
        }
        get isCameraUnlocked() {
            return this.cameraState === CameraState.Unlocked;
        }
        getPlayerData(player, key) {
            const playerData = this.data.playerData;
            const data = playerData[player.identifier];
            if (data) {
                return data[key];
            }
            return (playerData[player.identifier] = {
                weightBonus: 0,
                invulnerable: false,
                permissions: player.isServer(),
                fog: undefined,
                lighting: true,
            })[key];
        }
        setPlayerData(player, key, value) {
            this.getPlayerData(player, key);
            this.data.playerData[player.identifier][key] = value;
            this.event.emit("playerDataChange", player.id, key, value);
            if (!this.hasPermission() && gameScreen) {
                gameScreen.dialogs.close(this.dialogMain);
                gameScreen.dialogs.close(this.dialogInspect);
            }
        }
        initializeGlobalData(data) {
            return !this.needsUpgrade(data) ? data : {
                lastVersion: game.modManager.getVersion(this.getIndex()),
            };
        }
        initializeSaveData(data) {
            return !this.needsUpgrade(data) ? data : {
                playerData: {},
                lastVersion: game.modManager.getVersion(this.getIndex()),
            };
        }
        onInitialize() {
            IDebugTools_1.translation.setDebugToolsInstance(this);
        }
        onLoad() {
            EventManager_1.default.registerEventBusSubscriber(this.selector);
            Bind_1.default.registerHandlers(this.selector);
            EventManager_1.default.registerEventBusSubscriber(this.accidentalDeathHelper);
        }
        onUnload() {
            Container_1.default.releaseAndRemove();
            EventManager_1.default.deregisterEventBusSubscriber(this.selector);
            Bind_1.default.deregisterHandlers(this.selector);
            this.unlockedCameraMovementHandler.end();
            this.temperatureOverlay.unsubscribeEvents();
            this.temperatureOverlay.setMode(TemperatureOverlay_1.TemperatureOverlayMode.None);
            EventManager_1.default.deregisterEventBusSubscriber(this.accidentalDeathHelper);
        }
        onSave() {
            return this.data;
        }
        updateFog() {
            if (renderer) {
                const fogForceEnabled = this.getPlayerData(localPlayer, "fog");
                if (fogForceEnabled !== undefined && renderer.fieldOfView.disabled !== !fogForceEnabled) {
                    renderer.fieldOfView.disabled = !fogForceEnabled;
                    localPlayer.updateView(IRenderer_1.RenderSource.Mod, IRenderer_1.UpdateRenderFlag.FieldOfView | IRenderer_1.UpdateRenderFlag.FieldOfViewSkipTransition);
                }
            }
        }
        setCameraUnlocked(unlocked) {
            if (unlocked) {
                this.cameraState = CameraState.Unlocked;
                this.unlockedCameraMovementHandler.position = new Vector2_1.default(localPlayer);
                this.unlockedCameraMovementHandler.velocity = Vector2_1.default.ZERO;
                this.unlockedCameraMovementHandler.transition = undefined;
                this.unlockedCameraMovementHandler.homingVelocity = 0;
            }
            else {
                this.cameraState = CameraState.Transition;
                this.unlockedCameraMovementHandler.transition = new Vector2_1.default(localPlayer);
            }
        }
        inspect(what) {
            if (!gameScreen) {
                return;
            }
            gameScreen.dialogs.open(DebugTools.INSTANCE.dialogInspect)
                .setInspection(what);
            this.event.emit("inspect");
        }
        toggleDialog() {
            if (!this.hasPermission() || !gameScreen)
                return;
            gameScreen.dialogs.toggle(this.dialogMain);
        }
        hasPermission() {
            return !multiplayer.isConnected() || multiplayer.isServer() || this.getPlayerData(localPlayer, "permissions");
        }
        toggleFog(fog) {
            this.setPlayerData(localPlayer, "fog", fog);
            this.updateFog();
        }
        toggleLighting(lighting) {
            this.setPlayerData(localPlayer, "lighting", lighting);
            UpdateStatsAndAttributes_1.default.execute(localPlayer, localPlayer);
            localPlayer.updateView(IRenderer_1.RenderSource.Mod, true);
        }
        debugToolsAccessCommand(_, player, args) {
            if (!this.hasPermission()) {
                return;
            }
            const targetPlayer = game.playerManager.getByName(args);
            if (targetPlayer !== undefined && !targetPlayer.isLocalPlayer()) {
                const newPermissions = !this.getPlayerData(targetPlayer, "permissions");
                TogglePermissions_1.default.execute(localPlayer, targetPlayer, newPermissions);
                DebugTools.LOG.info(`Updating permissions for ${targetPlayer.getName().toString()} to ${newPermissions}`);
            }
        }
        postFieldOfView() {
            this.updateFog();
        }
        onGameScreenVisible() {
            Container_1.default.init();
        }
        onGamePlay() {
            this.unlockedCameraMovementHandler.begin();
        }
        onMoveToIsland(player, oldIsland, newIsland) {
            this.temperatureOverlay.unsubscribeEvents(oldIsland);
            if (this.temperatureOverlay.getMode() !== TemperatureOverlay_1.TemperatureOverlayMode.None)
                this.temperatureOverlay.subscribeEvents(newIsland);
        }
        onRendererCreated(_, renderer) {
            const rendererEventsUntilDeleted = renderer.event.until(renderer, "deleted");
            rendererEventsUntilDeleted?.subscribe("getMaxZoomLevel", this.getMaxZoomLevel);
            rendererEventsUntilDeleted?.subscribe("getZoomLevel", this.getZoomLevel);
            rendererEventsUntilDeleted?.subscribe("getCameraPosition", this.getCameraPosition);
        }
        getMaxZoomLevel() {
            if (!this.hasPermission()) {
                return undefined;
            }
            return IRenderer_1.ZOOM_LEVEL_MAX + 3;
        }
        getZoomLevel(_renderer, zoomLevel) {
            if (!this.hasPermission()) {
                return undefined;
            }
            if (zoomLevel > 3) {
                return zoomLevel - 3;
            }
            return 1 / 2 ** (4 - zoomLevel);
        }
        getCameraPosition(_, position) {
            if (this.cameraState === CameraState.Locked) {
                return undefined;
            }
            if (this.cameraState === CameraState.Transition) {
                this.unlockedCameraMovementHandler.transition = new Vector2_1.default(localPlayer);
                if (Vector2_1.default.isDistanceWithin(this.unlockedCameraMovementHandler.position, localPlayer, 0.5)) {
                    this.cameraState = CameraState.Locked;
                    return undefined;
                }
            }
            return this.unlockedCameraMovementHandler.position;
        }
        onPlayerDie(player) {
            if (this.getPlayerData(player, "invulnerable"))
                return false;
        }
        getPlayerMaxWeight(player, weight) {
            return weight + this.getPlayerData(player, "weightBonus");
        }
        onToggleCameraLock() {
            if (!this.hasPermission())
                return false;
            this.setCameraUnlocked(this.cameraState !== CameraState.Unlocked);
            return true;
        }
        onToggleFullVisibility() {
            if (!this.hasPermission())
                return false;
            const visibility = !(this.getPlayerData(localPlayer, "fog") || this.getPlayerData(localPlayer, "lighting"));
            this.toggleFog(visibility);
            this.toggleLighting(visibility);
            return true;
        }
        onInspectTile() {
            if (!this.hasPermission() || !gameScreen?.isMouseWithin() || !renderer)
                return false;
            const tile = renderer.worldRenderer.screenToTile(...InputManager_1.default.mouse.position.xy);
            if (!tile)
                return false;
            this.inspect(tile);
            return true;
        }
        onInspectItem(api) {
            const itemElement = oldui.screenInGame?.getHoveredItem(api);
            const item = itemElement && localIsland.items.get(+itemElement.dataset.itemId);
            if (!this.hasPermission() || !item)
                return false;
            this.inspect(item);
            return true;
        }
        onInspectLocalPlayer() {
            if (!this.hasPermission())
                return false;
            this.inspect(localPlayer);
            return true;
        }
        onHealLocalPlayer() {
            if (!this.hasPermission())
                return false;
            Heal_1.default.execute(localPlayer, localPlayer);
            return true;
        }
        onTeleportLocalPlayer(api) {
            if (!this.hasPermission() || !renderer)
                return false;
            const tile = renderer.worldRenderer.screenToTile(...api.mouse.position.xy);
            if (!tile)
                return false;
            TeleportEntity_1.default.execute(localPlayer, localPlayer, tile);
            return true;
        }
        onToggleNoClipOnLocalPlayer() {
            if (!this.hasPermission())
                return false;
            ToggleNoClip_1.default.execute(localPlayer, localPlayer);
            return true;
        }
        getAmbientColor(api) {
            if (this.getPlayerData(localPlayer, "lighting") === false) {
                api.returnValue = Vector3_1.default.ONE.xyz;
                api.cancelled = true;
            }
        }
        getTileLightLevel(api, tile) {
            if (this.getPlayerData(localPlayer, "lighting") === false) {
                api.returnValue = 0;
                api.cancelled = true;
            }
        }
        needsUpgrade(data) {
            if (!data) {
                return true;
            }
            const versionString = game.modManager.getVersion(this.getIndex());
            const lastLoadVersionString = (data && data.lastVersion) || "0.0.0";
            if (versionString === lastLoadVersionString) {
                return false;
            }
            const version = new Version_1.default(versionString);
            const lastLoadVersion = new Version_1.default(lastLoadVersionString);
            return lastLoadVersion.isOlderThan(version);
        }
    }
    __decorate([
        ModRegistry_1.default.registry(Actions_1.default)
    ], DebugTools.prototype, "actions", void 0);
    __decorate([
        ModRegistry_1.default.registry(LocationSelector_1.default)
    ], DebugTools.prototype, "selector", void 0);
    __decorate([
        ModRegistry_1.default.registry(UnlockedCameraMovementHandler_1.default)
    ], DebugTools.prototype, "unlockedCameraMovementHandler", void 0);
    __decorate([
        ModRegistry_1.default.interModRegistry("MainDialogPanel")
    ], DebugTools.prototype, "modRegistryMainDialogPanels", void 0);
    __decorate([
        ModRegistry_1.default.interModRegistry("InspectDialogPanel")
    ], DebugTools.prototype, "modRegistryInspectDialogPanels", void 0);
    __decorate([
        ModRegistry_1.default.interModRegistry("InspectDialogEntityInformationSubsection")
    ], DebugTools.prototype, "modRegistryInspectDialogEntityInformationSubsections", void 0);
    __decorate([
        ModRegistry_1.default.bindable("ToggleDialog", IInput_1.IInput.key("Backslash"), IInput_1.IInput.key("IntlBackslash"))
    ], DebugTools.prototype, "bindableToggleDialog", void 0);
    __decorate([
        ModRegistry_1.default.bindable("CloseInspectDialog", IInput_1.IInput.key("KeyI", "Alt"))
    ], DebugTools.prototype, "bindableCloseInspectDialog", void 0);
    __decorate([
        ModRegistry_1.default.bindable("InspectTile", IInput_1.IInput.mouseButton(2, "Alt"))
    ], DebugTools.prototype, "bindableInspectTile", void 0);
    __decorate([
        ModRegistry_1.default.bindable("InspectLocalPlayer", IInput_1.IInput.key("KeyP", "Alt"))
    ], DebugTools.prototype, "bindableInspectLocalPlayer", void 0);
    __decorate([
        ModRegistry_1.default.bindable("InspectItem", IInput_1.IInput.mouseButton(2, "Alt"))
    ], DebugTools.prototype, "bindableInspectItem", void 0);
    __decorate([
        ModRegistry_1.default.bindable("HealLocalPlayer", IInput_1.IInput.key("KeyH", "Alt"))
    ], DebugTools.prototype, "bindableHealLocalPlayer", void 0);
    __decorate([
        ModRegistry_1.default.bindable("TeleportLocalPlayer", IInput_1.IInput.mouseButton(0, "Alt"))
    ], DebugTools.prototype, "bindableTeleportLocalPlayer", void 0);
    __decorate([
        ModRegistry_1.default.bindable("ToggleNoClip", IInput_1.IInput.key("KeyN", "Alt"))
    ], DebugTools.prototype, "bindableToggleNoClipOnLocalPlayer", void 0);
    __decorate([
        ModRegistry_1.default.bindable("ToggleCameraLock", IInput_1.IInput.key("KeyC", "Alt"))
    ], DebugTools.prototype, "bindableToggleCameraLock", void 0);
    __decorate([
        ModRegistry_1.default.bindable("ToggleFullVisibility", IInput_1.IInput.key("KeyV", "Alt"))
    ], DebugTools.prototype, "bindableToggleFullVisibility", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Paint", IInput_1.IInput.mouseButton(0))
    ], DebugTools.prototype, "bindablePaint", void 0);
    __decorate([
        ModRegistry_1.default.bindable("ErasePaint", IInput_1.IInput.mouseButton(2))
    ], DebugTools.prototype, "bindableErasePaint", void 0);
    __decorate([
        ModRegistry_1.default.bindable("ClearPaint", IInput_1.IInput.key("Backspace"))
    ], DebugTools.prototype, "bindableClearPaint", void 0);
    __decorate([
        ModRegistry_1.default.bindable("CancelPaint", IInput_1.IInput.key("Escape"))
    ], DebugTools.prototype, "bindableCancelPaint", void 0);
    __decorate([
        ModRegistry_1.default.bindable("CompletePaint", IInput_1.IInput.key("Enter"))
    ], DebugTools.prototype, "bindableCompletePaint", void 0);
    __decorate([
        ModRegistry_1.default.dictionary("DebugTools", IDebugTools_1.DebugToolsTranslation)
    ], DebugTools.prototype, "dictionary", void 0);
    __decorate([
        ModRegistry_1.default.message("FailureTileBlocked")
    ], DebugTools.prototype, "messageFailureTileBlocked", void 0);
    __decorate([
        ModRegistry_1.default.messageSource("DebugTools")
    ], DebugTools.prototype, "source", void 0);
    __decorate([
        ModRegistry_1.default.action("PlaceTemplate", PlaceTemplate_1.default)
    ], DebugTools.prototype, "actionPlaceTemplate", void 0);
    __decorate([
        ModRegistry_1.default.action("SelectionExecute", SelectionExecute_1.default)
    ], DebugTools.prototype, "actionSelectionExecute", void 0);
    __decorate([
        ModRegistry_1.default.action("TeleportEntity", TeleportEntity_1.default)
    ], DebugTools.prototype, "actionTeleportEntity", void 0);
    __decorate([
        ModRegistry_1.default.action("Kill", Kill_1.default)
    ], DebugTools.prototype, "actionKill", void 0);
    __decorate([
        ModRegistry_1.default.action("Clone", Clone_1.default)
    ], DebugTools.prototype, "actionClone", void 0);
    __decorate([
        ModRegistry_1.default.action("SetTime", SetTime_1.default)
    ], DebugTools.prototype, "actionSetTime", void 0);
    __decorate([
        ModRegistry_1.default.action("Heal", Heal_1.default)
    ], DebugTools.prototype, "actionHeal", void 0);
    __decorate([
        ModRegistry_1.default.action("SetStat", SetStat_1.default)
    ], DebugTools.prototype, "actionSetStat", void 0);
    __decorate([
        ModRegistry_1.default.action("SetTamed", SetTamed_1.default)
    ], DebugTools.prototype, "actionSetTamed", void 0);
    __decorate([
        ModRegistry_1.default.action("Remove", Remove_1.default)
    ], DebugTools.prototype, "actionRemove", void 0);
    __decorate([
        ModRegistry_1.default.action("SetWeightBonus", SetWeightBonus_1.default)
    ], DebugTools.prototype, "actionSetWeightBonus", void 0);
    __decorate([
        ModRegistry_1.default.action("ChangeLayer", ChangeLayer_1.default)
    ], DebugTools.prototype, "actionChangeLayer", void 0);
    __decorate([
        ModRegistry_1.default.action("ChangeTerrain", ChangeTerrain_1.default)
    ], DebugTools.prototype, "actionChangeTerrain", void 0);
    __decorate([
        ModRegistry_1.default.action("ToggleTilled", ToggleTilled_1.default)
    ], DebugTools.prototype, "actionToggleTilled", void 0);
    __decorate([
        ModRegistry_1.default.action("UpdateStatsAndAttributes", UpdateStatsAndAttributes_1.default)
    ], DebugTools.prototype, "actionUpdateStatsAndAttributes", void 0);
    __decorate([
        ModRegistry_1.default.action("AddItemToInventory", AddItemToInventory_1.default)
    ], DebugTools.prototype, "actionAddItemToInventory", void 0);
    __decorate([
        ModRegistry_1.default.action("SetDurability", SetDurability_1.default)
    ], DebugTools.prototype, "actionSetDurability", void 0);
    __decorate([
        ModRegistry_1.default.action("SetDecay", SetDecay_1.default)
    ], DebugTools.prototype, "actionSetDecay", void 0);
    __decorate([
        ModRegistry_1.default.action("SetDurabilityBulk", SetDurabilityBulk_1.default)
    ], DebugTools.prototype, "actionSetDurabilityBulk", void 0);
    __decorate([
        ModRegistry_1.default.action("SetDecayBulk", SetDecayBulk_1.default)
    ], DebugTools.prototype, "actionSetDecayBulk", void 0);
    __decorate([
        ModRegistry_1.default.action("ClearInventory", ClearInventory_1.default)
    ], DebugTools.prototype, "actionClearInventory", void 0);
    __decorate([
        ModRegistry_1.default.action("Paint", Paint_1.default)
    ], DebugTools.prototype, "actionPaint", void 0);
    __decorate([
        ModRegistry_1.default.action("ToggleInvulnerable", ToggleInvulnerable_1.default)
    ], DebugTools.prototype, "actionToggleInvulnerable", void 0);
    __decorate([
        ModRegistry_1.default.action("SetSkill", SetSkill_1.default)
    ], DebugTools.prototype, "actionSetSkill", void 0);
    __decorate([
        ModRegistry_1.default.action("SetGrowingStage", SetGrowingStage_1.default)
    ], DebugTools.prototype, "actionSetGrowingStage", void 0);
    __decorate([
        ModRegistry_1.default.action("ToggleNoclip", ToggleNoClip_1.default)
    ], DebugTools.prototype, "actionToggleNoclip", void 0);
    __decorate([
        ModRegistry_1.default.action("TogglePermissions", TogglePermissions_1.default)
    ], DebugTools.prototype, "actionTogglePermissions", void 0);
    __decorate([
        ModRegistry_1.default.action("RenameIsland", RenameIsland_1.default)
    ], DebugTools.prototype, "actionRenameIsland", void 0);
    __decorate([
        ModRegistry_1.default.action("MoveToIsland", MoveToIsland_1.default)
    ], DebugTools.prototype, "actionMoveToIsland", void 0);
    __decorate([
        ModRegistry_1.default.action("ForceSailToCivilization", ForceSailToCivilization_1.default)
    ], DebugTools.prototype, "actionForceSailToCivilization", void 0);
    __decorate([
        ModRegistry_1.default.dialog("Main", DebugToolsDialog_1.default.description, DebugToolsDialog_1.default)
    ], DebugTools.prototype, "dialogMain", void 0);
    __decorate([
        ModRegistry_1.default.dialog("Inspect", InspectDialog_1.default.description, InspectDialog_1.default)
    ], DebugTools.prototype, "dialogInspect", void 0);
    __decorate([
        ModRegistry_1.default.inspectionType("temperature", Temperature_1.default)
    ], DebugTools.prototype, "inspectionTemperature", void 0);
    __decorate([
        ModRegistry_1.default.menuBarButton("Dialog", {
            onActivate: () => DebugTools.INSTANCE.toggleDialog(),
            group: IMenuBarButton_1.MenuBarButtonGroup.Meta,
            bindable: (0, ModRegistry_1.Registry)().get("bindableToggleDialog"),
            tooltip: tooltip => tooltip.schedule(tooltip => tooltip.getLastBlock().dump())
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.DialogTitleMain)),
            onCreate: button => {
                button.toggle(DebugTools.INSTANCE.hasPermission());
                DebugTools.INSTANCE.event.until(DebugTools.INSTANCE, "unload")
                    .subscribe("playerDataChange", () => button.toggle(DebugTools.INSTANCE.hasPermission()));
            },
        })
    ], DebugTools.prototype, "menuBarButton", void 0);
    __decorate([
        ModRegistry_1.default.overlay("Target")
    ], DebugTools.prototype, "overlayTarget", void 0);
    __decorate([
        ModRegistry_1.default.overlay("Paint")
    ], DebugTools.prototype, "overlayPaint", void 0);
    __decorate([
        Mod_1.default.saveData()
    ], DebugTools.prototype, "data", void 0);
    __decorate([
        Mod_1.default.globalData()
    ], DebugTools.prototype, "globalData", void 0);
    __decorate([
        ModRegistry_1.default.command("DebugToolsPermission")
    ], DebugTools.prototype, "debugToolsAccessCommand", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Game, "postFieldOfView")
    ], DebugTools.prototype, "postFieldOfView", null);
    __decorate([
        (0, EventManager_1.EventHandler)(GameScreen_1.default, "show")
    ], DebugTools.prototype, "onGameScreenVisible", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Game, "play")
    ], DebugTools.prototype, "onGamePlay", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "moveToIsland")
    ], DebugTools.prototype, "onMoveToIsland", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Game, "rendererCreated")
    ], DebugTools.prototype, "onRendererCreated", null);
    __decorate([
        Decorators_1.Bound
    ], DebugTools.prototype, "getMaxZoomLevel", null);
    __decorate([
        Decorators_1.Bound
    ], DebugTools.prototype, "getZoomLevel", null);
    __decorate([
        Decorators_1.Bound
    ], DebugTools.prototype, "getCameraPosition", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Players, "shouldDie")
    ], DebugTools.prototype, "onPlayerDie", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Players, "getMaxWeight")
    ], DebugTools.prototype, "getPlayerMaxWeight", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableToggleCameraLock"))
    ], DebugTools.prototype, "onToggleCameraLock", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableToggleFullVisibility"))
    ], DebugTools.prototype, "onToggleFullVisibility", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableInspectTile"))
    ], DebugTools.prototype, "onInspectTile", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableInspectItem"))
    ], DebugTools.prototype, "onInspectItem", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableInspectLocalPlayer"))
    ], DebugTools.prototype, "onInspectLocalPlayer", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableHealLocalPlayer"))
    ], DebugTools.prototype, "onHealLocalPlayer", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableTeleportLocalPlayer"))
    ], DebugTools.prototype, "onTeleportLocalPlayer", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableToggleNoClipOnLocalPlayer"))
    ], DebugTools.prototype, "onToggleNoClipOnLocalPlayer", null);
    __decorate([
        (0, Inject_1.Inject)(WorldRenderer_1.default, "calculateAmbientColor", Inject_1.InjectionPosition.Pre)
    ], DebugTools.prototype, "getAmbientColor", null);
    __decorate([
        (0, Inject_1.Inject)(Island_1.default, "calculateTileLightLevel", Inject_1.InjectionPosition.Pre)
    ], DebugTools.prototype, "getTileLightLevel", null);
    __decorate([
        Mod_1.default.instance()
    ], DebugTools, "INSTANCE", void 0);
    __decorate([
        Mod_1.default.log()
    ], DebugTools, "LOG", void 0);
    exports.default = DebugTools;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7Ozs7Ozs7SUE2eEJNLDBCQWx0QkYseUJBQWUsQ0FrdEJFO0lBM3NCeEIsSUFBSyxXQWFKO0lBYkQsV0FBSyxXQUFXO1FBSWYsaURBQU0sQ0FBQTtRQUlOLHFEQUFRLENBQUE7UUFJUix5REFBVSxDQUFBO0lBQ1gsQ0FBQyxFQWJJLFdBQVcsS0FBWCxXQUFXLFFBYWY7SUFvQkQsTUFBcUIsVUFBVyxTQUFRLGFBQUc7UUFBM0M7O1lBZ09RLHVCQUFrQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztZQUM5QywwQkFBcUIsR0FBRyxJQUFJLCtCQUFxQixFQUFFLENBQUM7WUFDbkQsZ0JBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBcWMxQyxDQUFDO1FBaGNBLElBQVcsZ0JBQWdCO1lBQzFCLE9BQU8sSUFBSSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQ2xELENBQUM7UUFTTSxhQUFhLENBQThCLE1BQWMsRUFBRSxHQUFNO1lBQ3ZFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3hDLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0MsSUFBSSxJQUFJLEVBQUU7Z0JBQ1QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDakI7WUFFRCxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRztnQkFDdkMsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLFdBQVcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFO2dCQUM5QixHQUFHLEVBQUUsU0FBUztnQkFDZCxRQUFRLEVBQUUsSUFBSTth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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventBuses", "event/EventManager", "game/island/Island", "mod/Mod", "mod/ModRegistry", "renderer/IRenderer", "renderer/world/WorldRenderer", "ui/input/Bind", "ui/input/IInput", "ui/input/InputManager", "ui/screen/screens/GameScreen", "ui/screen/screens/game/static/menubar/IMenuBarButton", "utilities/Decorators", "utilities/class/Inject", "utilities/math/Vector2", "utilities/math/Vector3", "./Actions", "./IDebugTools", "./LocationSelector", "./UnlockedCameraMovementHandler", "./action/AddItemToInventory", "./action/ChangeLayer", "./action/ChangeTerrain", "./action/ClearInventory", "./action/Clone", "./action/ForceSailToCivilization", "./action/Heal", "./action/Kill", "./action/MoveToIsland", "./action/Paint", "./action/PlaceTemplate", "./action/Remove", "./action/RenameIsland", "./action/SelectionExecute", "./action/SetDecay", "./action/SetDecayBulk", "./action/SetDurability", "./action/SetDurabilityBulk", "./action/SetGrowingStage", "./action/SetSkill", "./action/SetStat", "./action/SetTamed", "./action/SetTime", "./action/SetWeightBonus", "./action/TeleportEntity", "./action/ToggleInvulnerable", "./action/ToggleNoClip", "./action/TogglePermissions", "./action/ToggleTilled", "./action/UpdateStatsAndAttributes", "./overlay/TemperatureOverlay", "./ui/DebugToolsDialog", "./ui/InspectDialog", "./ui/component/Container", "./ui/component/DebugToolsPanel", "./ui/inspection/Temperature", "./util/Version"], function (require, exports, EventBuses_1, EventManager_1, Island_1, Mod_1, ModRegistry_1, IRenderer_1, WorldRenderer_1, Bind_1, IInput_1, InputManager_1, GameScreen_1, IMenuBarButton_1, Decorators_1, Inject_1, Vector2_1, Vector3_1, Actions_1, IDebugTools_1, LocationSelector_1, UnlockedCameraMovementHandler_1, AddItemToInventory_1, ChangeLayer_1, ChangeTerrain_1, ClearInventory_1, Clone_1, ForceSailToCivilization_1, Heal_1, Kill_1, MoveToIsland_1, Paint_1, PlaceTemplate_1, Remove_1, RenameIsland_1, SelectionExecute_1, SetDecay_1, SetDecayBulk_1, SetDurability_1, SetDurabilityBulk_1, SetGrowingStage_1, SetSkill_1, SetStat_1, SetTamed_1, SetTime_1, SetWeightBonus_1, TeleportEntity_1, ToggleInvulnerable_1, ToggleNoClip_1, TogglePermissions_1, ToggleTilled_1, UpdateStatsAndAttributes_1, TemperatureOverlay_1, DebugToolsDialog_1, InspectDialog_1, Container_1, DebugToolsPanel_1, Temperature_1, Version_1) {
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
        }
        onUnload() {
            Container_1.default.releaseAndRemove();
            EventManager_1.default.deregisterEventBusSubscriber(this.selector);
            Bind_1.default.deregisterHandlers(this.selector);
            this.unlockedCameraMovementHandler.end();
            this.temperatureOverlay.unsubscribeEvents();
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
            this.temperatureOverlay.subscribeEvents();
            this.unlockedCameraMovementHandler.begin();
        }
        onMoveToIsland(player, oldIsland, newIsland) {
            this.temperatureOverlay.unsubscribeEvents(oldIsland);
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
            TeleportEntity_1.default.execute(localPlayer, localPlayer, tile.point);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFzeEJTLDBCQTlzQkYseUJBQWUsQ0E4c0JFO0lBdnNCeEIsSUFBSyxXQWFKO0lBYkQsV0FBSyxXQUFXO1FBSWYsaURBQU0sQ0FBQTtRQUlOLHFEQUFRLENBQUE7UUFJUix5REFBVSxDQUFBO0lBQ1gsQ0FBQyxFQWJJLFdBQVcsS0FBWCxXQUFXLFFBYWY7SUFvQkQsTUFBcUIsVUFBVyxTQUFRLGFBQUc7UUFBM0M7O1lBZ09RLHVCQUFrQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztZQUM3QyxnQkFBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFrYzFDLENBQUM7UUE3YkEsSUFBVyxnQkFBZ0I7WUFDMUIsT0FBTyxJQUFJLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUM7UUFDbEQsQ0FBQztRQVNNLGFBQWEsQ0FBOEIsTUFBYyxFQUFFLEdBQU07WUFDdkUsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDeEMsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzQyxJQUFJLElBQUksRUFBRTtnQkFDVCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNqQjtZQUVELE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHO2dCQUN2QyxXQUFXLEVBQUUsQ0FBQztnQkFDZCxZQUFZLEVBQUUsS0FBSztnQkFDbkIsV0FBVyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUU7Z0JBQzlCLEdBQUcsRUFBRSxTQUFTO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2FBQ2QsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1QsQ0FBQztRQVlNLGFBQWEsQ0FBOEIsTUFB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
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
            Container_1.default.INSTANCE?.releaseAndRemove();
            EventManager_1.default.deregisterEventBusSubscriber(this.selector);
            Bind_1.default.deregisterHandlers(this.selector);
            this.unlockedCameraMovementHandler.end();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUE4d0JTLDBCQXRzQkYseUJBQWUsQ0Fzc0JFO0lBL3JCeEIsSUFBSyxXQWFKO0lBYkQsV0FBSyxXQUFXO1FBSWYsaURBQU0sQ0FBQTtRQUlOLHFEQUFRLENBQUE7UUFJUix5REFBVSxDQUFBO0lBQ1gsQ0FBQyxFQWJJLFdBQVcsS0FBWCxXQUFXLFFBYWY7SUFvQkQsTUFBcUIsVUFBVyxTQUFRLGFBQUc7UUFBM0M7O1lBZ09RLHVCQUFrQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztZQUM3QyxnQkFBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUEwYjFDLENBQUM7UUFyYkEsSUFBVyxnQkFBZ0I7WUFDMUIsT0FBTyxJQUFJLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUM7UUFDbEQsQ0FBQztRQVNNLGFBQWEsQ0FBOEIsTUFBYyxFQUFFLEdBQU07WUFDdkUsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDeEMsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzQyxJQUFJLElBQUksRUFBRTtnQkFDVCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNqQjtZQUVELE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHO2dCQUN2QyxXQUFXLEVBQUUsQ0FBQztnQkFDZCxZQUFZLEVBQUUsS0FBSztnQkFDbkIsV0FBVyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUU7Z0JBQzlCLEdBQUcsRUFBRSxTQUFTO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2FBQ2QsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1QsQ0FBQztRQVlNLGFBQWEsQ0FBOEIsTUFB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
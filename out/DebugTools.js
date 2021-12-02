var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventBuses", "event/EventEmitter", "event/EventManager", "game/entity/creature/Creature", "game/entity/Human", "game/entity/IEntity", "game/entity/IHuman", "game/island/Island", "mod/Mod", "mod/ModRegistry", "renderer/IRenderer", "renderer/world/WorldRenderer", "ui/input/Bind", "ui/input/Bindable", "ui/input/IInput", "ui/input/InputManager", "ui/screen/screens/game/static/menubar/IMenuBarButton", "ui/screen/screens/GameScreen", "utilities/class/Inject", "utilities/Decorators", "utilities/math/Vector2", "utilities/math/Vector3", "./action/AddItemToInventory", "./action/ChangeLayer", "./action/ChangeTerrain", "./action/ClearInventory", "./action/Clone", "./action/ForceSailToCivilization", "./action/Heal", "./action/Kill", "./action/Paint", "./action/PlaceTemplate", "./action/Remove", "./action/RenameIsland", "./action/MoveToIsland", "./action/SelectionExecute", "./action/SetGrowingStage", "./action/SetSkill", "./action/SetStat", "./action/SetTamed", "./action/SetTime", "./action/SetWeightBonus", "./action/TeleportEntity", "./action/ToggleInvulnerable", "./action/ToggleNoClip", "./action/TogglePermissions", "./action/ToggleTilled", "./action/UpdateStatsAndAttributes", "./Actions", "./IDebugTools", "./LocationSelector", "./ui/component/AddItemToInventory", "./ui/component/DebugToolsPanel", "./ui/DebugToolsDialog", "./ui/InspectDialog", "./ui/inspection/Temperature", "./UnlockedCameraMovementHandler", "./util/Version"], function (require, exports, EventBuses_1, EventEmitter_1, EventManager_1, Creature_1, Human_1, IEntity_1, IHuman_1, Island_1, Mod_1, ModRegistry_1, IRenderer_1, WorldRenderer_1, Bind_1, Bindable_1, IInput_1, InputManager_1, IMenuBarButton_1, GameScreen_1, Inject_1, Decorators_1, Vector2_1, Vector3_1, AddItemToInventory_1, ChangeLayer_1, ChangeTerrain_1, ClearInventory_1, Clone_1, ForceSailToCivilization_1, Heal_1, Kill_1, Paint_1, PlaceTemplate_1, Remove_1, RenameIsland_1, MoveToIsland_1, SelectionExecute_1, SetGrowingStage_1, SetSkill_1, SetStat_1, SetTamed_1, SetTime_1, SetWeightBonus_1, TeleportEntity_1, ToggleInvulnerable_1, ToggleNoClip_1, TogglePermissions_1, ToggleTilled_1, UpdateStatsAndAttributes_1, Actions_1, IDebugTools_1, LocationSelector_1, AddItemToInventory_2, DebugToolsPanel_1, DebugToolsDialog_1, InspectDialog_1, Temperature_1, UnlockedCameraMovementHandler_1, Version_1) {
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
                noclip: false,
                permissions: players[player.id].isServer(),
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
                lastVersion: modManager.getVersion(this.getIndex()),
            };
        }
        initializeSaveData(data) {
            return !this.needsUpgrade(data) ? data : {
                playerData: {},
                lastVersion: modManager.getVersion(this.getIndex()),
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
            AddItemToInventory_2.default.init().releaseAndRemove();
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
                    game.updateView(IRenderer_1.RenderSource.Mod, true);
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
            game.updateView(IRenderer_1.RenderSource.Mod, true);
        }
        debugToolsAccessCommand(_, player, args) {
            if (!this.hasPermission()) {
                return;
            }
            const targetPlayer = playerManager.getByName(args);
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
            AddItemToInventory_2.default.init();
        }
        onGamePlay() {
            const rendererEventsUntilUnload = renderer === null || renderer === void 0 ? void 0 : renderer.event.until(this, "unload");
            rendererEventsUntilUnload === null || rendererEventsUntilUnload === void 0 ? void 0 : rendererEventsUntilUnload.subscribe("getZoomLevel", this.getZoomLevel);
            rendererEventsUntilUnload === null || rendererEventsUntilUnload === void 0 ? void 0 : rendererEventsUntilUnload.subscribe("getCameraPosition", this.getCameraPosition);
            this.unlockedCameraMovementHandler.begin();
        }
        getZoomLevel() {
            if (this.data.zoomLevel === undefined || !this.hasPermission()) {
                return undefined;
            }
            if (this.data.zoomLevel > 3) {
                return this.data.zoomLevel - 3;
            }
            return 1 / 2 ** (4 - this.data.zoomLevel);
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
        onPlayerDamage(player, info) {
            if (this.getPlayerData(player, "invulnerable"))
                return 0;
        }
        canCreatureAttack(creature, enemy) {
            if (enemy.asPlayer) {
                if (this.getPlayerData(enemy.asPlayer, "invulnerable"))
                    return false;
                if (this.getPlayerData(enemy.asPlayer, "noclip"))
                    return false;
            }
            return undefined;
        }
        onMove(player, fromX, fromY, fromZ, fromTile, nextX, nextY, nextZ, tile) {
            const noclip = this.getPlayerData(player, "noclip");
            if (!noclip)
                return undefined;
            player.setMoveType(IEntity_1.MoveType.Flying);
            if (noclip.moving) {
                noclip.delay = Math.max(noclip.delay - 1, 1);
            }
            else {
                noclip.delay = IHuman_1.Delay.Movement;
            }
            player.addDelay(noclip.delay, true);
            player.isMoving = true;
            player.isMovingClientside = true;
            player.nextX = nextX;
            player.nextY = nextY;
            player.nextMoveTime = game.absoluteTime + (noclip.delay * game.interval);
            noclip.moving = true;
            game.passTurn(player);
            return false;
        }
        onNoInputReceived(player) {
            const noclip = this.getPlayerData(player, "noclip");
            if (!noclip)
                return;
            noclip.moving = false;
        }
        getPlayerWeightOrStaminaMovementPenalty(player) {
            return this.getPlayerData(player, "noclip") ? 0 : undefined;
        }
        isHumanSwimming(human, isSwimming) {
            if (human.asNPC)
                return undefined;
            return this.getPlayerData(human, "noclip") ? false : undefined;
        }
        getPlayerMaxWeight(player, weight) {
            return weight + this.getPlayerData(player, "weightBonus");
        }
        onZoomIn(api) {
            if (!this.hasPermission() || !(gameScreen === null || gameScreen === void 0 ? void 0 : gameScreen.isMouseWithin()))
                return false;
            this.data.zoomLevel = this.data.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.data.zoomLevel;
            this.data.zoomLevel = api.bindable === Bindable_1.default.GameZoomIn ? Math.min(IDebugTools_1.ZOOM_LEVEL_MAX + 3, ++this.data.zoomLevel) : Math.max(0, --this.data.zoomLevel);
            renderer === null || renderer === void 0 ? void 0 : renderer.updateZoomLevel();
            return true;
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
            if (!this.hasPermission() || !(gameScreen === null || gameScreen === void 0 ? void 0 : gameScreen.isMouseWithin()) || !renderer)
                return false;
            const tile = renderer.worldRenderer.screenToTile(...InputManager_1.default.mouse.position.xy);
            if (!tile)
                return false;
            this.inspect(tile);
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
            TeleportEntity_1.default.execute(localPlayer, localPlayer, { ...tile.raw(), z: localPlayer.z });
            return true;
        }
        onToggleNoClipOnLocalPlayer() {
            if (!this.hasPermission())
                return false;
            ToggleNoClip_1.default.execute(localPlayer, localPlayer, !this.getPlayerData(localPlayer, "noclip"));
            return true;
        }
        getAmbientColor(api) {
            if (this.getPlayerData(localPlayer, "lighting") === false) {
                api.returnValue = Vector3_1.default.ONE.xyz;
                api.cancelled = true;
            }
        }
        getTileLightLevel(api, tile, x, y, z) {
            if (this.getPlayerData(localPlayer, "lighting") === false) {
                api.returnValue = 0;
                api.cancelled = true;
            }
        }
        needsUpgrade(data) {
            if (!data) {
                return true;
            }
            const versionString = modManager.getVersion(this.getIndex());
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
        ModRegistry_1.default.bindable("InspectTile", IInput_1.IInput.mouseButton(2, "Ctrl"))
    ], DebugTools.prototype, "bindableInspectTile", void 0);
    __decorate([
        ModRegistry_1.default.bindable("InspectLocalPlayer", IInput_1.IInput.key("KeyP", "Alt"))
    ], DebugTools.prototype, "bindableInspectLocalPlayer", void 0);
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
            tooltip: tooltip => tooltip.dump().addText(text => text.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.DialogTitleMain))),
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
        Decorators_1.Bound
    ], DebugTools.prototype, "getZoomLevel", null);
    __decorate([
        Decorators_1.Bound
    ], DebugTools.prototype, "getCameraPosition", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Players, "damage")
    ], DebugTools.prototype, "onPlayerDamage", null);
    __decorate([
        (0, EventManager_1.EventHandler)(Creature_1.default, "canAttack")
    ], DebugTools.prototype, "canCreatureAttack", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Players, "preMove")
    ], DebugTools.prototype, "onMove", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Players, "noInput")
    ], DebugTools.prototype, "onNoInputReceived", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Players, "getWeightOrStaminaMovementPenalty")
    ], DebugTools.prototype, "getPlayerWeightOrStaminaMovementPenalty", null);
    __decorate([
        (0, EventManager_1.EventHandler)(Human_1.default, "isSwimming")
    ], DebugTools.prototype, "isHumanSwimming", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Players, "getMaxWeight")
    ], DebugTools.prototype, "getPlayerMaxWeight", null);
    __decorate([
        Bind_1.default.onDown(Bindable_1.default.GameZoomIn, EventEmitter_1.Priority.High),
        Bind_1.default.onDown(Bindable_1.default.GameZoomOut, EventEmitter_1.Priority.High)
    ], DebugTools.prototype, "onZoomIn", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUF5ekJTLDBCQXh2QkYseUJBQWUsQ0F3dkJFO0lBOXVCeEIsSUFBSyxXQWFKO0lBYkQsV0FBSyxXQUFXO1FBSWYsaURBQU0sQ0FBQTtRQUlOLHFEQUFRLENBQUE7UUFJUix5REFBVSxDQUFBO0lBQ1gsQ0FBQyxFQWJJLFdBQVcsS0FBWCxXQUFXLFFBYWY7SUFvQkQsTUFBcUIsVUFBVyxTQUFRLGFBQUc7UUFBM0M7O1lBNE1TLGdCQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQThmMUMsQ0FBQztRQXpmQSxJQUFXLGdCQUFnQjtZQUMxQixPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLFFBQVEsQ0FBQztRQUNsRCxDQUFDO1FBU00sYUFBYSxDQUE4QixNQUFjLEVBQUUsR0FBTTtZQUN2RSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUN4QyxNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNDLElBQUksSUFBSSxFQUFFO2dCQUNULE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2pCO1lBRUQsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUc7Z0JBQ3ZDLFdBQVcsRUFBRSxDQUFDO2dCQUNkLFlBQVksRUFBRSxLQUFLO2dCQUNuQixNQUFNLEVBQUUsS0FBSztnQkFDYixXQUFXLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUU7Z0JBQzFDLEdBQUcsRUFBRSxTQUFTO2dCQUNkLFFBQVEsRUFBRSxJQUFJO2FBQ2QsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1QsQ0FBQztRQVlNLGFBQWEsQ0FB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
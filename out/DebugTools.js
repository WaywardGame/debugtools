var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "entity/creature/Creature", "entity/Human", "entity/IEntity", "entity/IHuman", "event/EventBuses", "event/EventEmitter", "event/EventManager", "game/Game", "game/IGame", "mod/IHookHost", "mod/Mod", "mod/ModRegistry", "newui/input/Bind", "newui/input/Bindable", "newui/input/IInput", "newui/input/InputManager", "newui/screen/screens/game/static/menubar/MenuBarButtonDescriptions", "newui/screen/screens/GameScreen", "renderer/WorldRenderer", "utilities/Inject", "utilities/math/Vector2", "utilities/math/Vector3", "./action/AddItemToInventory", "./action/ChangeTerrain", "./action/Clone", "./action/ForceSailToCivilization", "./action/Heal", "./action/Kill", "./action/Paint", "./action/PlaceTemplate", "./action/Remove", "./action/RenameIsland", "./action/SelectionExecute", "./action/SetGrowingStage", "./action/SetSkill", "./action/SetStat", "./action/SetTamed", "./action/SetTime", "./action/SetWeightBonus", "./action/TeleportEntity", "./action/ToggleInvulnerable", "./action/ToggleNoClip", "./action/TogglePermissions", "./action/ToggleTilled", "./action/UpdateStatsAndAttributes", "./Actions", "./IDebugTools", "./LocationSelector", "./ui/component/AddItemToInventory", "./ui/DebugToolsDialog", "./ui/InspectDialog", "./ui/inspection/Temperature", "./UnlockedCameraMovementHandler", "./util/Version"], function (require, exports, ActionExecutor_1, Creature_1, Human_1, IEntity_1, IHuman_1, EventBuses_1, EventEmitter_1, EventManager_1, Game_1, IGame_1, IHookHost_1, Mod_1, ModRegistry_1, Bind_1, Bindable_1, IInput_1, InputManager_1, MenuBarButtonDescriptions_1, GameScreen_1, WorldRenderer_1, Inject_1, Vector2_1, Vector3_1, AddItemToInventory_1, ChangeTerrain_1, Clone_1, ForceSailToCivilization_1, Heal_1, Kill_1, Paint_1, PlaceTemplate_1, Remove_1, RenameIsland_1, SelectionExecute_1, SetGrowingStage_1, SetSkill_1, SetStat_1, SetTamed_1, SetTime_1, SetWeightBonus_1, TeleportEntity_1, ToggleInvulnerable_1, ToggleNoClip_1, TogglePermissions_1, ToggleTilled_1, UpdateStatsAndAttributes_1, Actions_1, IDebugTools_1, LocationSelector_1, AddItemToInventory_2, DebugToolsDialog_1, InspectDialog_1, Temperature_1, UnlockedCameraMovementHandler_1, Version_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                fog: true,
                lighting: true,
            })[key];
        }
        setPlayerData(player, key, value) {
            this.getPlayerData(player, key);
            this.data.playerData[player.identifier][key] = value;
            this.event.emit("playerDataChange", player.id, key, value);
            if (!this.hasPermission() && GameScreen_1.gameScreen) {
                GameScreen_1.gameScreen.closeDialog(this.dialogMain);
                GameScreen_1.gameScreen.closeDialog(this.dialogInspect);
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
            this.unlockedCameraMovementHandler.begin();
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
            fieldOfView.disabled = (localPlayer.isGhost() && !game.getGameOptions().respawn) ? true : this.getPlayerData(localPlayer, "fog") === false;
            game.updateView(IGame_1.RenderSource.Mod, true);
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
            if (!GameScreen_1.gameScreen) {
                return;
            }
            GameScreen_1.gameScreen.openDialog(DebugTools.INSTANCE.dialogInspect)
                .setInspection(what);
            this.event.emit("inspect");
        }
        toggleDialog() {
            if (!this.hasPermission() || !GameScreen_1.gameScreen)
                return;
            GameScreen_1.gameScreen.toggleDialog(this.dialogMain);
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
            ActionExecutor_1.default.get(UpdateStatsAndAttributes_1.default).execute(localPlayer, localPlayer);
            game.updateView(IGame_1.RenderSource.Mod, true);
        }
        debugToolsAccessCommand(player, args) {
            if (!this.hasPermission()) {
                return;
            }
            const targetPlayer = game.getPlayerByName(args);
            if (targetPlayer !== undefined && !targetPlayer.isLocalPlayer()) {
                const newPermissions = !this.getPlayerData(targetPlayer, "permissions");
                ActionExecutor_1.default.get(TogglePermissions_1.default).execute(localPlayer, targetPlayer, newPermissions);
                DebugTools.LOG.info(`Updating permissions for ${targetPlayer.getName().toString()} to ${newPermissions}`);
            }
        }
        postFieldOfView() {
            this.updateFog();
        }
        onGameScreenVisible() {
            AddItemToInventory_2.default.init();
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
        onMove(player, nextX, nextY, tile, direction) {
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
            if (!this.hasPermission() || !(GameScreen_1.gameScreen === null || GameScreen_1.gameScreen === void 0 ? void 0 : GameScreen_1.gameScreen.isMouseWithin()))
                return false;
            this.data.zoomLevel = this.data.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.data.zoomLevel;
            this.data.zoomLevel = api.bindable === Bindable_1.default.GameZoomIn ? Math.min(IDebugTools_1.ZOOM_LEVEL_MAX + 3, ++this.data.zoomLevel) : Math.max(0, --this.data.zoomLevel);
            game.updateZoomLevel();
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
            if (!this.hasPermission() || !(GameScreen_1.gameScreen === null || GameScreen_1.gameScreen === void 0 ? void 0 : GameScreen_1.gameScreen.isMouseWithin()) || !renderer)
                return false;
            const tile = renderer.screenToTile(...InputManager_1.default.mouse.position.xy);
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
            ActionExecutor_1.default.get(Heal_1.default).execute(localPlayer, localPlayer);
            return true;
        }
        onTeleportLocalPlayer(api) {
            if (!this.hasPermission() || !renderer)
                return false;
            const tile = renderer.screenToTile(...api.mouse.position.xy);
            if (!tile)
                return false;
            ActionExecutor_1.default.get(TeleportEntity_1.default).execute(localPlayer, localPlayer, { ...tile.raw(), z: localPlayer.z });
            return true;
        }
        onToggleNoClipOnLocalPlayer() {
            if (!this.hasPermission())
                return false;
            ActionExecutor_1.default.get(ToggleNoClip_1.default).execute(localPlayer, localPlayer, !this.getPlayerData(localPlayer, "noclip"));
            return true;
        }
        getAmbientColor(api) {
            if (this.getPlayerData(localPlayer, "lighting") === false) {
                api.returnValue = Vector3_1.default.ONE.xyz;
                api.cancelled = true;
            }
        }
        getAmbientLightLevel(api, player, z) {
            if (player === localPlayer && this.getPlayerData(localPlayer, "lighting") === false) {
                api.returnValue = 1;
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
        Override
    ], DebugTools.prototype, "event", void 0);
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
        ModRegistry_1.default.interrupt("ConfirmUnlockRecipes")
    ], DebugTools.prototype, "interruptUnlockRecipes", void 0);
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
            group: MenuBarButtonDescriptions_1.MenuBarButtonGroup.Meta,
            bindable: ModRegistry_1.Registry().get("bindableToggleDialog"),
            tooltip: tooltip => tooltip.addText(text => text.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.DialogTitleMain))),
            onCreate: button => {
                button.toggle(DebugTools.INSTANCE.hasPermission());
                DebugTools.INSTANCE.event.subscribe("playerDataChange", () => button.toggle(DebugTools.INSTANCE.hasPermission()));
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
        Override
    ], DebugTools.prototype, "initializeGlobalData", null);
    __decorate([
        Override
    ], DebugTools.prototype, "initializeSaveData", null);
    __decorate([
        Override
    ], DebugTools.prototype, "onInitialize", null);
    __decorate([
        Override
    ], DebugTools.prototype, "onLoad", null);
    __decorate([
        Override
    ], DebugTools.prototype, "onUnload", null);
    __decorate([
        ModRegistry_1.default.command("DebugToolsPermission")
    ], DebugTools.prototype, "debugToolsAccessCommand", null);
    __decorate([
        Override,
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "postFieldOfView", null);
    __decorate([
        Override,
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "onGameScreenVisible", null);
    __decorate([
        EventManager_1.EventHandler(EventBuses_1.EventBus.Game, "getZoomLevel")
    ], DebugTools.prototype, "getZoomLevel", null);
    __decorate([
        EventManager_1.EventHandler(EventBuses_1.EventBus.Game, "getCameraPosition")
    ], DebugTools.prototype, "getCameraPosition", null);
    __decorate([
        EventManager_1.EventHandler(EventBuses_1.EventBus.Players, "damage")
    ], DebugTools.prototype, "onPlayerDamage", null);
    __decorate([
        EventManager_1.EventHandler(Creature_1.default, "canAttack")
    ], DebugTools.prototype, "canCreatureAttack", null);
    __decorate([
        Override,
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "onMove", null);
    __decorate([
        EventManager_1.EventHandler(EventBuses_1.EventBus.Players, "noInput")
    ], DebugTools.prototype, "onNoInputReceived", null);
    __decorate([
        EventManager_1.EventHandler(EventBuses_1.EventBus.Players, "getWeightOrStaminaMovementPenalty")
    ], DebugTools.prototype, "getPlayerWeightOrStaminaMovementPenalty", null);
    __decorate([
        EventManager_1.EventHandler(Human_1.default, "isSwimming")
    ], DebugTools.prototype, "isHumanSwimming", null);
    __decorate([
        EventManager_1.EventHandler(EventBuses_1.EventBus.Players, "getMaxWeight")
    ], DebugTools.prototype, "getPlayerMaxWeight", null);
    __decorate([
        Bind_1.default.onDown(Bindable_1.default.GameZoomIn, EventEmitter_1.Priority.High),
        Bind_1.default.onDown(Bindable_1.default.GameZoomOut, EventEmitter_1.Priority.High)
    ], DebugTools.prototype, "onZoomIn", null);
    __decorate([
        Bind_1.default.onDown(ModRegistry_1.Registry().get("bindableToggleCameraLock"))
    ], DebugTools.prototype, "onToggleCameraLock", null);
    __decorate([
        Bind_1.default.onDown(ModRegistry_1.Registry().get("bindableToggleFullVisibility"))
    ], DebugTools.prototype, "onToggleFullVisibility", null);
    __decorate([
        Bind_1.default.onDown(ModRegistry_1.Registry().get("bindableInspectTile"))
    ], DebugTools.prototype, "onInspectTile", null);
    __decorate([
        Bind_1.default.onDown(ModRegistry_1.Registry().get("bindableInspectLocalPlayer"))
    ], DebugTools.prototype, "onInspectLocalPlayer", null);
    __decorate([
        Bind_1.default.onDown(ModRegistry_1.Registry().get("bindableHealLocalPlayer"))
    ], DebugTools.prototype, "onHealLocalPlayer", null);
    __decorate([
        Bind_1.default.onDown(ModRegistry_1.Registry().get("bindableTeleportLocalPlayer"))
    ], DebugTools.prototype, "onTeleportLocalPlayer", null);
    __decorate([
        Bind_1.default.onDown(ModRegistry_1.Registry().get("bindableToggleNoClipOnLocalPlayer"))
    ], DebugTools.prototype, "onToggleNoClipOnLocalPlayer", null);
    __decorate([
        Inject_1.Inject(WorldRenderer_1.default, "calculateAmbientColor", Inject_1.InjectionPosition.Pre)
    ], DebugTools.prototype, "getAmbientColor", null);
    __decorate([
        Inject_1.Inject(Game_1.default, "calculateAmbientLightLevel", Inject_1.InjectionPosition.Pre)
    ], DebugTools.prototype, "getAmbientLightLevel", null);
    __decorate([
        Inject_1.Inject(Game_1.default, "calculateTileLightLevel", Inject_1.InjectionPosition.Pre)
    ], DebugTools.prototype, "getTileLightLevel", null);
    __decorate([
        Mod_1.default.instance()
    ], DebugTools, "INSTANCE", void 0);
    __decorate([
        Mod_1.default.log()
    ], DebugTools, "LOG", void 0);
    exports.default = DebugTools;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTBFQSxJQUFLLFdBYUo7SUFiRCxXQUFLLFdBQVc7UUFJZixpREFBTSxDQUFBO1FBSU4scURBQVEsQ0FBQTtRQUlSLHlEQUFVLENBQUE7SUFDWCxDQUFDLEVBYkksV0FBVyxLQUFYLFdBQVcsUUFhZjtJQW9CRCxNQUFxQixVQUFXLFNBQVEsYUFBRztRQUEzQzs7WUFxTVMsZ0JBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBb2YxQyxDQUFDO1FBL2VBLElBQVcsZ0JBQWdCO1lBQzFCLE9BQU8sSUFBSSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQ2xELENBQUM7UUFTTSxhQUFhLENBQThCLE1BQWMsRUFBRSxHQUFNO1lBQ3ZFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3hDLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0MsSUFBSSxJQUFJLEVBQUU7Z0JBQ1QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDakI7WUFFRCxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRztnQkFDdkMsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLE1BQU0sRUFBRSxLQUFLO2dCQUNiLFdBQVcsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRTtnQkFDMUMsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsUUFBUSxFQUFFLElBQUk7YUFDZCxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVCxDQUFDO1FBWU0sYUFBYSxDQUE4QixNQUFjLEVBQUUsR0FBTSxFQUFFLEtBQXFCO1lB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
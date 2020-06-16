var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "entity/creature/Creature", "entity/Human", "entity/IEntity", "entity/IHuman", "event/EventBuses", "event/EventManager", "game/Game", "game/IGame", "mod/IHookHost", "mod/Mod", "mod/ModRegistry", "newui/input/Bind", "newui/input/Bindable", "newui/input/IBinding", "newui/input/InputManager", "newui/screen/screens/game/static/menubar/MenuBarButtonDescriptions", "newui/screen/screens/GameScreen", "renderer/IWorldRenderer", "renderer/WorldRenderer", "utilities/Inject", "utilities/math/Vector2", "utilities/math/Vector3", "./action/AddItemToInventory", "./action/ChangeTerrain", "./action/Clone", "./action/Heal", "./action/Kill", "./action/Paint", "./action/PlaceTemplate", "./action/Remove", "./action/RenameIsland", "./action/SelectionExecute", "./action/SetGrowingStage", "./action/SetSkill", "./action/SetStat", "./action/SetTamed", "./action/SetTime", "./action/SetWeightBonus", "./action/TeleportEntity", "./action/ToggleInvulnerable", "./action/ToggleNoClip", "./action/TogglePermissions", "./action/ToggleTilled", "./action/UpdateStatsAndAttributes", "./Actions", "./IDebugTools", "./LocationSelector", "./ui/component/AddItemToInventory", "./ui/DebugToolsDialog", "./ui/InspectDialog", "./ui/inspection/Temperature", "./UnlockedCameraMovementHandler", "./util/Version"], function (require, exports, ActionExecutor_1, Creature_1, Human_1, IEntity_1, IHuman_1, EventBuses_1, EventManager_1, Game_1, IGame_1, IHookHost_1, Mod_1, ModRegistry_1, Bind_1, Bindable_1, IBinding_1, InputManager_1, MenuBarButtonDescriptions_1, GameScreen_1, IWorldRenderer_1, WorldRenderer_1, Inject_1, Vector2_1, Vector3_1, AddItemToInventory_1, ChangeTerrain_1, Clone_1, Heal_1, Kill_1, Paint_1, PlaceTemplate_1, Remove_1, RenameIsland_1, SelectionExecute_1, SetGrowingStage_1, SetSkill_1, SetStat_1, SetTamed_1, SetTime_1, SetWeightBonus_1, TeleportEntity_1, ToggleInvulnerable_1, ToggleNoClip_1, TogglePermissions_1, ToggleTilled_1, UpdateStatsAndAttributes_1, Actions_1, IDebugTools_1, LocationSelector_1, AddItemToInventory_2, DebugToolsDialog_1, InspectDialog_1, Temperature_1, UnlockedCameraMovementHandler_1, Version_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CameraState;
    (function (CameraState) {
        CameraState[CameraState["Locked"] = 0] = "Locked";
        CameraState[CameraState["Unlocked"] = 1] = "Unlocked";
        CameraState[CameraState["Transition"] = 2] = "Transition";
    })(CameraState || (CameraState = {}));
    let DebugTools = (() => {
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
                if (!this.hasPermission()) {
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
                fieldOfView.disabled = this.getPlayerData(localPlayer, "fog") === false;
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
                GameScreen_1.gameScreen.openDialog(DebugTools.INSTANCE.dialogInspect)
                    .setInspection(what);
                this.event.emit("inspect");
            }
            toggleDialog() {
                if (!this.hasPermission())
                    return;
                GameScreen_1.gameScreen.toggleDialog(this.dialogMain);
            }
            hasPermission() {
                return GameScreen_1.gameScreen
                    && (!multiplayer.isConnected() || multiplayer.isServer() || this.getPlayerData(localPlayer, "permissions"));
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
                return undefined;
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
            getPlayerSpriteBatchLayer(_, player, batchLayer) {
                return this.getPlayerData(player, "noclip") ? IWorldRenderer_1.SpriteBatchLayer.CreatureFlying : undefined;
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
                if (!this.hasPermission() || !(GameScreen_1.gameScreen === null || GameScreen_1.gameScreen === void 0 ? void 0 : GameScreen_1.gameScreen.isMouseWithin()))
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
                if (!this.hasPermission())
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
            getAmbientLightLevel(api, z) {
                if (this.getPlayerData(localPlayer, "lighting") === false) {
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
            ModRegistry_1.default.bindable("ToggleDialog", IBinding_1.IBinding.key("Backslash"), IBinding_1.IBinding.key("IntlBackslash"))
        ], DebugTools.prototype, "bindableToggleDialog", void 0);
        __decorate([
            ModRegistry_1.default.bindable("CloseInspectDialog", IBinding_1.IBinding.key("KeyI", "Alt"))
        ], DebugTools.prototype, "bindableCloseInspectDialog", void 0);
        __decorate([
            ModRegistry_1.default.bindable("InspectTile", IBinding_1.IBinding.mouseButton(2, "Alt"))
        ], DebugTools.prototype, "bindableInspectTile", void 0);
        __decorate([
            ModRegistry_1.default.bindable("InspectLocalPlayer", IBinding_1.IBinding.key("KeyP", "Alt"))
        ], DebugTools.prototype, "bindableInspectLocalPlayer", void 0);
        __decorate([
            ModRegistry_1.default.bindable("HealLocalPlayer", IBinding_1.IBinding.key("KeyH", "Alt"))
        ], DebugTools.prototype, "bindableHealLocalPlayer", void 0);
        __decorate([
            ModRegistry_1.default.bindable("TeleportLocalPlayer", IBinding_1.IBinding.mouseButton(0, "Alt"))
        ], DebugTools.prototype, "bindableTeleportLocalPlayer", void 0);
        __decorate([
            ModRegistry_1.default.bindable("ToggleNoClip", IBinding_1.IBinding.key("KeyN", "Alt"))
        ], DebugTools.prototype, "bindableToggleNoClipOnLocalPlayer", void 0);
        __decorate([
            ModRegistry_1.default.bindable("ToggleCameraLock", IBinding_1.IBinding.key("KeyC", "Alt"))
        ], DebugTools.prototype, "bindableToggleCameraLock", void 0);
        __decorate([
            ModRegistry_1.default.bindable("ToggleFullVisibility", IBinding_1.IBinding.key("KeyV", "Alt"))
        ], DebugTools.prototype, "bindableToggleFullVisibility", void 0);
        __decorate([
            ModRegistry_1.default.bindable("Paint", IBinding_1.IBinding.mouseButton(0))
        ], DebugTools.prototype, "bindablePaint", void 0);
        __decorate([
            ModRegistry_1.default.bindable("ErasePaint", IBinding_1.IBinding.mouseButton(2))
        ], DebugTools.prototype, "bindableErasePaint", void 0);
        __decorate([
            ModRegistry_1.default.bindable("ClearPaint", IBinding_1.IBinding.key("Backspace"))
        ], DebugTools.prototype, "bindableClearPaint", void 0);
        __decorate([
            ModRegistry_1.default.bindable("CancelPaint", IBinding_1.IBinding.key("Escape"))
        ], DebugTools.prototype, "bindableCancelPaint", void 0);
        __decorate([
            ModRegistry_1.default.bindable("CompletePaint", IBinding_1.IBinding.key("Enter"))
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
            Mod_1.default.saveData(IDebugTools_1.DEBUG_TOOLS_ID)
        ], DebugTools.prototype, "data", void 0);
        __decorate([
            Mod_1.default.globalData(IDebugTools_1.DEBUG_TOOLS_ID)
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
            Override,
            IHookHost_1.HookMethod
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
            EventManager_1.EventHandler(WorldRenderer_1.default, "getPlayerSpriteBatchLayer")
        ], DebugTools.prototype, "getPlayerSpriteBatchLayer", null);
        __decorate([
            EventManager_1.EventHandler(Human_1.default, "isSwimming")
        ], DebugTools.prototype, "isHumanSwimming", null);
        __decorate([
            EventManager_1.EventHandler(EventBuses_1.EventBus.Players, "getMaxWeight")
        ], DebugTools.prototype, "getPlayerMaxWeight", null);
        __decorate([
            Bind_1.default.onDown(Bindable_1.default.GameZoomIn),
            Bind_1.default.onDown(Bindable_1.default.GameZoomOut)
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
            Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
        ], DebugTools, "INSTANCE", void 0);
        __decorate([
            Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
        ], DebugTools, "LOG", void 0);
        return DebugTools;
    })();
    exports.default = DebugTools;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTBFQSxJQUFLLFdBYUo7SUFiRCxXQUFLLFdBQVc7UUFJZixpREFBTSxDQUFBO1FBSU4scURBQVEsQ0FBQTtRQUlSLHlEQUFVLENBQUE7SUFDWCxDQUFDLEVBYkksV0FBVyxLQUFYLFdBQVcsUUFhZjtJQW9CRDtRQUFBLE1BQXFCLFVBQVcsU0FBUSxhQUFHO1lBQTNDOztnQkFrTVMsZ0JBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1lBd2UxQyxDQUFDO1lBbmVBLElBQVcsZ0JBQWdCO2dCQUMxQixPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLFFBQVEsQ0FBQztZQUNsRCxDQUFDO1lBU00sYUFBYSxDQUE4QixNQUFjLEVBQUUsR0FBTTtnQkFDdkUsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ3hDLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzNDLElBQUksSUFBSSxFQUFFO29CQUNULE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNqQjtnQkFFRCxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRztvQkFDdkMsV0FBVyxFQUFFLENBQUM7b0JBQ2QsWUFBWSxFQUFFLEtBQUs7b0JBQ25CLE1BQU0sRUFBRSxLQUFLO29CQUNiLFdBQVcsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRTtvQkFDMUMsR0FBRyxFQUFFLElBQUk7b0JBQ1QsUUFBUSxFQUFFLElBQUk7aUJBQ2QsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1QsQ0FBQztZQVlNLGFBQWEsQ0FBOEIsTUFBYyxFQUFFLEdBQU0s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
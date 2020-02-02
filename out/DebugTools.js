var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "entity/creature/Creature", "entity/Entity", "entity/Human", "entity/IEntity", "entity/IHuman", "event/EventBuses", "event/EventManager", "game/Game", "game/IGame", "mod/IHookHost", "mod/Mod", "mod/ModRegistry", "newui/BindingManager", "newui/IBindingManager", "newui/screen/screens/game/static/menubar/MenuBarButtonDescriptions", "newui/screen/screens/GameScreen", "renderer/IWorldRenderer", "renderer/WorldRenderer", "utilities/Inject", "utilities/math/Vector2", "utilities/math/Vector3", "./action/AddItemToInventory", "./action/ChangeTerrain", "./action/Clone", "./action/Heal", "./action/Kill", "./action/Paint", "./action/PlaceTemplate", "./action/Remove", "./action/SelectionExecute", "./action/SetGrowingStage", "./action/SetSkill", "./action/SetStat", "./action/SetTamed", "./action/SetTime", "./action/SetWeightBonus", "./action/TeleportEntity", "./action/ToggleInvulnerable", "./action/ToggleNoClip", "./action/TogglePermissions", "./action/ToggleTilled", "./action/UpdateStatsAndAttributes", "./Actions", "./IDebugTools", "./LocationSelector", "./ui/component/AddItemToInventory", "./ui/DebugToolsDialog", "./ui/InspectDialog", "./UnlockedCameraMovementHandler", "./util/Version"], function (require, exports, ActionExecutor_1, Creature_1, Entity_1, Human_1, IEntity_1, IHuman_1, EventBuses_1, EventManager_1, Game_1, IGame_1, IHookHost_1, Mod_1, ModRegistry_1, BindingManager_1, IBindingManager_1, MenuBarButtonDescriptions_1, GameScreen_1, IWorldRenderer_1, WorldRenderer_1, Inject_1, Vector2_1, Vector3_1, AddItemToInventory_1, ChangeTerrain_1, Clone_1, Heal_1, Kill_1, Paint_1, PlaceTemplate_1, Remove_1, SelectionExecute_1, SetGrowingStage_1, SetSkill_1, SetStat_1, SetTamed_1, SetTime_1, SetWeightBonus_1, TeleportEntity_1, ToggleInvulnerable_1, ToggleNoClip_1, TogglePermissions_1, ToggleTilled_1, UpdateStatsAndAttributes_1, Actions_1, IDebugTools_1, LocationSelector_1, AddItemToInventory_2, DebugToolsDialog_1, InspectDialog_1, UnlockedCameraMovementHandler_1, Version_1) {
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
        onLoad() {
            hookManager.register(this.selector, "DebugTools:LocationSelector");
        }
        onUnload() {
            hookManager.deregister(this.selector);
            AddItemToInventory_2.default.init().releaseAndRemove();
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
            if (Entity_1.default.is(enemy, IEntity_1.EntityType.Player)) {
                if (this.getPlayerData(enemy, "invulnerable"))
                    return false;
                if (this.getPlayerData(enemy, "noclip"))
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
            if (Entity_1.default.is(human, IEntity_1.EntityType.NPC))
                return undefined;
            return this.getPlayerData(human, "noclip") ? false : undefined;
        }
        getPlayerMaxWeight(player, weight) {
            return weight + this.getPlayerData(player, "weightBonus");
        }
        onBindLoop(bindPressed, api) {
            if (!this.hasPermission())
                return bindPressed;
            if (api.wasPressed(IBindingManager_1.Bindable.GameZoomIn) && !bindPressed && GameScreen_1.gameScreen.isMouseWithin()) {
                this.data.zoomLevel = this.data.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.data.zoomLevel;
                this.data.zoomLevel = Math.min(11, ++this.data.zoomLevel);
                game.updateZoomLevel();
                bindPressed = IBindingManager_1.Bindable.GameZoomIn;
                api.removePressState(IBindingManager_1.Bindable.GameZoomIn);
            }
            if (api.wasPressed(IBindingManager_1.Bindable.GameZoomOut) && !bindPressed && GameScreen_1.gameScreen.isMouseWithin()) {
                this.data.zoomLevel = this.data.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.data.zoomLevel;
                this.data.zoomLevel = Math.max(0, --this.data.zoomLevel);
                game.updateZoomLevel();
                bindPressed = IBindingManager_1.Bindable.GameZoomOut;
                api.removePressState(IBindingManager_1.Bindable.GameZoomOut);
            }
            if (api.wasPressed(this.bindableToggleCameraLock) && !bindPressed) {
                this.setCameraUnlocked(this.cameraState !== CameraState.Unlocked);
                bindPressed = this.bindableToggleCameraLock;
            }
            if (api.wasPressed(this.bindableToggleFullVisibility) && !bindPressed) {
                const visibility = !(this.getPlayerData(localPlayer, "fog") || this.getPlayerData(localPlayer, "lighting"));
                this.toggleFog(visibility);
                this.toggleLighting(visibility);
                bindPressed = this.bindableToggleFullVisibility;
            }
            if (api.wasPressed(this.bindableInspectTile) && !bindPressed && GameScreen_1.gameScreen.isMouseWithin()) {
                this.inspect(renderer.screenToTile(...BindingManager_1.bindingManager.getMouse().xy));
                bindPressed = this.bindableInspectTile;
            }
            if (api.wasPressed(this.bindableInspectLocalPlayer) && !bindPressed) {
                this.inspect(localPlayer);
                bindPressed = this.bindableInspectLocalPlayer;
            }
            if (api.wasPressed(this.bindableHealLocalPlayer) && !bindPressed) {
                ActionExecutor_1.default.get(Heal_1.default).execute(localPlayer, localPlayer);
                bindPressed = this.bindableHealLocalPlayer;
            }
            if (api.wasPressed(this.bindableTeleportLocalPlayer) && !bindPressed) {
                ActionExecutor_1.default.get(TeleportEntity_1.default).execute(localPlayer, localPlayer, Object.assign(Object.assign({}, renderer.screenToTile(api.mouseX, api.mouseY).raw()), { z: localPlayer.z }));
                bindPressed = this.bindableTeleportLocalPlayer;
            }
            if (api.wasPressed(this.bindableToggleNoClipOnLocalPlayer) && !bindPressed) {
                ActionExecutor_1.default.get(ToggleNoClip_1.default).execute(localPlayer, localPlayer, !this.getPlayerData(localPlayer, "noclip"));
                bindPressed = this.bindableToggleNoClipOnLocalPlayer;
            }
            return this.cameraState === CameraState.Locked ? bindPressed : this.unlockedCameraMovementHandler.handle(bindPressed, api);
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
        ModRegistry_1.default.bindable("ToggleDialog", { key: "Backslash" }, { key: "IntlBackslash" })
    ], DebugTools.prototype, "bindableToggleDialog", void 0);
    __decorate([
        ModRegistry_1.default.bindable("CloseInspectDialog", { key: "KeyI", modifiers: [IBindingManager_1.KeyModifier.Alt] })
    ], DebugTools.prototype, "bindableCloseInspectDialog", void 0);
    __decorate([
        ModRegistry_1.default.bindable("InspectTile", { mouseButton: 2, modifiers: [IBindingManager_1.KeyModifier.Alt] })
    ], DebugTools.prototype, "bindableInspectTile", void 0);
    __decorate([
        ModRegistry_1.default.bindable("InspectLocalPlayer", { key: "KeyP", modifiers: [IBindingManager_1.KeyModifier.Alt] })
    ], DebugTools.prototype, "bindableInspectLocalPlayer", void 0);
    __decorate([
        ModRegistry_1.default.bindable("HealLocalPlayer", { key: "KeyH", modifiers: [IBindingManager_1.KeyModifier.Alt] })
    ], DebugTools.prototype, "bindableHealLocalPlayer", void 0);
    __decorate([
        ModRegistry_1.default.bindable("TeleportLocalPlayer", { mouseButton: 0, modifiers: [IBindingManager_1.KeyModifier.Alt] })
    ], DebugTools.prototype, "bindableTeleportLocalPlayer", void 0);
    __decorate([
        ModRegistry_1.default.bindable("ToggleNoClip", { key: "KeyN", modifiers: [IBindingManager_1.KeyModifier.Alt] })
    ], DebugTools.prototype, "bindableToggleNoClipOnLocalPlayer", void 0);
    __decorate([
        ModRegistry_1.default.bindable("ToggleCameraLock", { key: "KeyC", modifiers: [IBindingManager_1.KeyModifier.Alt] })
    ], DebugTools.prototype, "bindableToggleCameraLock", void 0);
    __decorate([
        ModRegistry_1.default.bindable("ToggleFullVisibility", { key: "KeyV", modifiers: [IBindingManager_1.KeyModifier.Alt] })
    ], DebugTools.prototype, "bindableToggleFullVisibility", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Paint", { mouseButton: 0 })
    ], DebugTools.prototype, "bindablePaint", void 0);
    __decorate([
        ModRegistry_1.default.bindable("ErasePaint", { mouseButton: 2 })
    ], DebugTools.prototype, "bindableErasePaint", void 0);
    __decorate([
        ModRegistry_1.default.bindable("ClearPaint", { key: "Backspace" })
    ], DebugTools.prototype, "bindableClearPaint", void 0);
    __decorate([
        ModRegistry_1.default.bindable("CancelPaint", { key: "Escape" })
    ], DebugTools.prototype, "bindableCancelPaint", void 0);
    __decorate([
        ModRegistry_1.default.bindable("CompletePaint", { key: "Enter" })
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
        ModRegistry_1.default.interrupt("ChoiceTravelAway")
    ], DebugTools.prototype, "interruptTravelAway", void 0);
    __decorate([
        ModRegistry_1.default.interruptChoice("SailToCivilization")
    ], DebugTools.prototype, "choiceSailToCivilization", void 0);
    __decorate([
        ModRegistry_1.default.interruptChoice("TravelAway")
    ], DebugTools.prototype, "choiceTravelAway", void 0);
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
        ModRegistry_1.default.dialog("Main", DebugToolsDialog_1.default.description, DebugToolsDialog_1.default)
    ], DebugTools.prototype, "dialogMain", void 0);
    __decorate([
        ModRegistry_1.default.dialog("Inspect", InspectDialog_1.default.description, InspectDialog_1.default)
    ], DebugTools.prototype, "dialogInspect", void 0);
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
    ], DebugTools.prototype, "onLoad", null);
    __decorate([
        Override
    ], DebugTools.prototype, "onUnload", null);
    __decorate([
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "postFieldOfView", null);
    __decorate([
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "onGameScreenVisible", null);
    __decorate([
        EventManager_1.EventHandler(EventBuses_1.EventBus.Game, "getZoomLevel")
    ], DebugTools.prototype, "getZoomLevel", null);
    __decorate([
        EventManager_1.EventHandler(EventBuses_1.EventBus.Game, "getCameraPosition")
    ], DebugTools.prototype, "getCameraPosition", null);
    __decorate([
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "onPlayerDamage", null);
    __decorate([
        EventManager_1.EventHandler(Creature_1.default, "canAttack")
    ], DebugTools.prototype, "canCreatureAttack", null);
    __decorate([
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "onMove", null);
    __decorate([
        Override, IHookHost_1.HookMethod
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
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "onBindLoop", null);
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
    exports.default = DebugTools;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXVFQSxJQUFLLFdBYUo7SUFiRCxXQUFLLFdBQVc7UUFJZixpREFBTSxDQUFBO1FBSU4scURBQVEsQ0FBQTtRQUlSLHlEQUFVLENBQUE7SUFDWCxDQUFDLEVBYkksV0FBVyxLQUFYLFdBQVcsUUFhZjtJQW9CRCxNQUFxQixVQUFXLFNBQVEsYUFBRztRQUEzQzs7WUFtTVMsZ0JBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBeWMxQyxDQUFDO1FBcGNBLElBQVcsZ0JBQWdCO1lBQzFCLE9BQU8sSUFBSSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQ2xELENBQUM7UUFTTSxhQUFhLENBQThCLE1BQWMsRUFBRSxHQUFNO1lBQ3ZFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3hDLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0MsSUFBSSxJQUFJLEVBQUU7Z0JBQ1QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDakI7WUFFRCxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRztnQkFDdkMsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLE1BQU0sRUFBRSxLQUFLO2dCQUNiLFdBQVcsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRTtnQkFDMUMsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsUUFBUSxFQUFFLElBQUk7YUFDZCxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVCxDQUFDO1FBWU0sYUFBYSxDQUE4QixNQUFjLEVBQUUsR0FBTSxFQUFFLEtBQXFCO1lB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
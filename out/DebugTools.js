var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "entity/Entity", "entity/IEntity", "game/Game", "game/IGame", "mod/IHookHost", "mod/Mod", "mod/ModRegistry", "newui/BindingManager", "newui/screen/screens/game/static/menubar/MenuBarButtonDescriptions", "renderer/IWorldRenderer", "renderer/WorldRenderer", "utilities/Inject", "utilities/math/Vector2", "utilities/math/Vector3", "./action/AddItemToInventory", "./action/ChangeTerrain", "./action/Clone", "./action/Heal", "./action/Kill", "./action/Paint", "./action/PlaceTemplate", "./action/Remove", "./action/SelectionExecute", "./action/SetGrowingStage", "./action/SetSkill", "./action/SetStat", "./action/SetTamed", "./action/SetTime", "./action/SetWeightBonus", "./action/TeleportEntity", "./action/ToggleInvulnerable", "./action/ToggleNoClip", "./action/TogglePermissions", "./action/ToggleTilled", "./action/UnlockRecipes", "./action/UpdateStatsAndAttributes", "./Actions", "./IDebugTools", "./LocationSelector", "./ui/component/AddItemToInventory", "./ui/DebugToolsDialog", "./ui/InspectDialog", "./UnlockedCameraMovementHandler", "./util/Version"], function (require, exports, ActionExecutor_1, Entity_1, IEntity_1, Game_1, IGame_1, IHookHost_1, Mod_1, ModRegistry_1, BindingManager_1, MenuBarButtonDescriptions_1, IWorldRenderer_1, WorldRenderer_1, Inject_1, Vector2_1, Vector3_1, AddItemToInventory_1, ChangeTerrain_1, Clone_1, Heal_1, Kill_1, Paint_1, PlaceTemplate_1, Remove_1, SelectionExecute_1, SetGrowingStage_1, SetSkill_1, SetStat_1, SetTamed_1, SetTime_1, SetWeightBonus_1, TeleportEntity_1, ToggleInvulnerable_1, ToggleNoClip_1, TogglePermissions_1, ToggleTilled_1, UnlockRecipes_1, UpdateStatsAndAttributes_1, Actions_1, IDebugTools_1, LocationSelector_1, AddItemToInventory_2, DebugToolsDialog_1, InspectDialog_1, UnlockedCameraMovementHandler_1, Version_1) {
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
                gameScreen.closeDialog(this.dialogMain);
                gameScreen.closeDialog(this.dialogInspect);
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
            gameScreen.openDialog(DebugTools.INSTANCE.dialogInspect)
                .setInspection(what);
            this.event.emit("inspect");
        }
        toggleDialog() {
            if (!this.hasPermission())
                return;
            gameScreen.toggleDialog(this.dialogMain);
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
            if (this.data.zoomLevel === undefined) {
                return undefined;
            }
            if (this.data.zoomLevel > 3) {
                return this.data.zoomLevel - 3;
            }
            return 1 / 2 ** (4 - this.data.zoomLevel);
        }
        getCameraPosition(position) {
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
                noclip.delay = 10;
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
        getPlayerWeightMovementPenalty(player) {
            return this.getPlayerData(player, "noclip") ? 0 : undefined;
        }
        getPlayerSpriteBatchLayer(player, batchLayer) {
            return this.getPlayerData(player, "noclip") ? IWorldRenderer_1.SpriteBatchLayer.CreatureFlying : undefined;
        }
        isHumanSwimming(human, isSwimming) {
            if (Entity_1.default.is(human, IEntity_1.EntityType.NPC))
                return undefined;
            return this.getPlayerData(human, "noclip") ? false : undefined;
        }
        getPlayerMaxWeight(weight, player) {
            return weight + this.getPlayerData(player, "weightBonus");
        }
        onBindLoop(bindPressed, api) {
            if (!this.hasPermission())
                return bindPressed;
            if (api.wasPressed(BindingManager_1.Bindable.GameZoomIn) && !bindPressed && gameScreen.isMouseWithin()) {
                this.data.zoomLevel = this.data.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.data.zoomLevel;
                this.data.zoomLevel = Math.min(11, ++this.data.zoomLevel);
                game.updateZoomLevel();
                bindPressed = BindingManager_1.Bindable.GameZoomIn;
                api.removePressState(BindingManager_1.Bindable.GameZoomIn);
            }
            if (api.wasPressed(BindingManager_1.Bindable.GameZoomOut) && !bindPressed && gameScreen.isMouseWithin()) {
                this.data.zoomLevel = this.data.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.data.zoomLevel;
                this.data.zoomLevel = Math.max(0, --this.data.zoomLevel);
                game.updateZoomLevel();
                bindPressed = BindingManager_1.Bindable.GameZoomOut;
                api.removePressState(BindingManager_1.Bindable.GameZoomOut);
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
            if (api.wasPressed(this.bindableInspectTile) && !bindPressed && gameScreen.isMouseWithin()) {
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
                ActionExecutor_1.default.get(TeleportEntity_1.default).execute(localPlayer, localPlayer, Object.assign({}, renderer.screenToTile(api.mouseX, api.mouseY).raw(), { z: localPlayer.z }));
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
        ModRegistry_1.default.bindable("CloseInspectDialog", { key: "KeyI", modifiers: [BindingManager_1.KeyModifier.Alt] })
    ], DebugTools.prototype, "bindableCloseInspectDialog", void 0);
    __decorate([
        ModRegistry_1.default.bindable("InspectTile", { mouseButton: 2, modifiers: [BindingManager_1.KeyModifier.Alt] })
    ], DebugTools.prototype, "bindableInspectTile", void 0);
    __decorate([
        ModRegistry_1.default.bindable("InspectLocalPlayer", { key: "KeyP", modifiers: [BindingManager_1.KeyModifier.Alt] })
    ], DebugTools.prototype, "bindableInspectLocalPlayer", void 0);
    __decorate([
        ModRegistry_1.default.bindable("HealLocalPlayer", { key: "KeyH", modifiers: [BindingManager_1.KeyModifier.Alt] })
    ], DebugTools.prototype, "bindableHealLocalPlayer", void 0);
    __decorate([
        ModRegistry_1.default.bindable("TeleportLocalPlayer", { mouseButton: 0, modifiers: [BindingManager_1.KeyModifier.Alt] })
    ], DebugTools.prototype, "bindableTeleportLocalPlayer", void 0);
    __decorate([
        ModRegistry_1.default.bindable("ToggleNoClip", { key: "KeyN", modifiers: [BindingManager_1.KeyModifier.Alt] })
    ], DebugTools.prototype, "bindableToggleNoClipOnLocalPlayer", void 0);
    __decorate([
        ModRegistry_1.default.bindable("ToggleCameraLock", { key: "KeyC", modifiers: [BindingManager_1.KeyModifier.Alt] })
    ], DebugTools.prototype, "bindableToggleCameraLock", void 0);
    __decorate([
        ModRegistry_1.default.bindable("ToggleFullVisibility", { key: "KeyV", modifiers: [BindingManager_1.KeyModifier.Alt] })
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
        ModRegistry_1.default.action("UnlockRecipes", UnlockRecipes_1.default)
    ], DebugTools.prototype, "actionUnlockRecipes", void 0);
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
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "getZoomLevel", null);
    __decorate([
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "getCameraPosition", null);
    __decorate([
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "onPlayerDamage", null);
    __decorate([
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "canCreatureAttack", null);
    __decorate([
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "onMove", null);
    __decorate([
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "onNoInputReceived", null);
    __decorate([
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "getPlayerWeightMovementPenalty", null);
    __decorate([
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "getPlayerSpriteBatchLayer", null);
    __decorate([
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "isHumanSwimming", null);
    __decorate([
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "getPlayerMaxWeight", null);
    __decorate([
        Override, IHookHost_1.HookMethod
    ], DebugTools.prototype, "onBindLoop", null);
    __decorate([
        Inject_1.Inject(WorldRenderer_1.default, "calculateAmbientColor", "pre")
    ], DebugTools.prototype, "getAmbientColor", null);
    __decorate([
        Inject_1.Inject(Game_1.default, "calculateAmbientLightLevel", "pre")
    ], DebugTools.prototype, "getAmbientLightLevel", null);
    __decorate([
        Inject_1.Inject(Game_1.default, "calculateTileLightLevel", "pre")
    ], DebugTools.prototype, "getTileLightLevel", null);
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], DebugTools, "INSTANCE", void 0);
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], DebugTools, "LOG", void 0);
    exports.default = DebugTools;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQW9FQSxJQUFLLFdBYUo7SUFiRCxXQUFLLFdBQVc7UUFJZixpREFBTSxDQUFBO1FBSU4scURBQVEsQ0FBQTtRQUlSLHlEQUFVLENBQUE7SUFDWCxDQUFDLEVBYkksV0FBVyxLQUFYLFdBQVcsUUFhZjtJQW9CRCxNQUFxQixVQUFXLFNBQVEsYUFBRztRQUEzQzs7WUFzTVMsZ0JBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBeWMxQyxDQUFDO1FBcGNBLElBQVcsZ0JBQWdCO1lBQzFCLE9BQU8sSUFBSSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQ2xELENBQUM7UUFTTSxhQUFhLENBQThCLE1BQWMsRUFBRSxHQUFNO1lBQ3ZFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3hDLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0MsSUFBSSxJQUFJLEVBQUU7Z0JBQ1QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDakI7WUFFRCxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRztnQkFDdkMsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLE1BQU0sRUFBRSxLQUFLO2dCQUNiLFdBQVcsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRTtnQkFDMUMsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsUUFBUSxFQUFFLElBQUk7YUFDZCxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVCxDQUFDO1FBWU0sYUFBYSxDQUE4QixNQUFjLEVBQUUsR0FBTSxFQUFFLEtBQXFCO1lB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
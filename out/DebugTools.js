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
    var DebugToolsEvent;
    (function (DebugToolsEvent) {
        DebugToolsEvent["PlayerDataChange"] = "PlayerDataChange";
        DebugToolsEvent["Inspect"] = "Inspect";
        DebugToolsEvent["PermissionsChange"] = "PermissionsChange";
    })(DebugToolsEvent = exports.DebugToolsEvent || (exports.DebugToolsEvent = {}));
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
            this.emit(DebugToolsEvent.PlayerDataChange, player.id, key, value);
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
            this.emit(DebugToolsEvent.Inspect);
        }
        toggleDialog() {
            if (!this.hasPermission())
                return;
            gameScreen.toggleDialog(this.dialogMain);
        }
        hasPermission() {
            return !multiplayer.isConnected() || multiplayer.isServer() || this.getPlayerData(localPlayer, "permissions");
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
                DebugTools.INSTANCE.on(DebugToolsEvent.PlayerDataChange, () => button.toggle(DebugTools.INSTANCE.hasPermission()));
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
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "postFieldOfView", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "onGameScreenVisible", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getZoomLevel", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getCameraPosition", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "onPlayerDamage", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "canCreatureAttack", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "onMove", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "onNoInputReceived", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getPlayerWeightMovementPenalty", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getPlayerSpriteBatchLayer", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "isHumanSwimming", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getPlayerMaxWeight", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "onBindLoop", null);
    __decorate([
        Inject_1.Inject(WorldRenderer_1.default, "calculateAmbientColor", "post")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWtFQSxJQUFLLFdBYUo7SUFiRCxXQUFLLFdBQVc7UUFJZixpREFBTSxDQUFBO1FBSU4scURBQVEsQ0FBQTtRQUlSLHlEQUFVLENBQUE7SUFDWCxDQUFDLEVBYkksV0FBVyxLQUFYLFdBQVcsUUFhZjtJQUVELElBQVksZUFnQlg7SUFoQkQsV0FBWSxlQUFlO1FBTzFCLHdEQUFxQyxDQUFBO1FBSXJDLHNDQUFtQixDQUFBO1FBSW5CLDBEQUF1QyxDQUFBO0lBQ3hDLENBQUMsRUFoQlcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFnQjFCO0lBRUQsTUFBcUIsVUFBVyxTQUFRLGFBQUc7UUFBM0M7O1lBbU1TLGdCQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQXNiMUMsQ0FBQztRQWpiQSxJQUFXLGdCQUFnQjtZQUMxQixPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLFFBQVEsQ0FBQztRQUNsRCxDQUFDO1FBU00sYUFBYSxDQUE4QixNQUFlLEVBQUUsR0FBTTtZQUN4RSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUN4QyxNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNDLElBQUksSUFBSSxFQUFFO2dCQUNULE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2pCO1lBRUQsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUc7Z0JBQ3ZDLFdBQVcsRUFBRSxDQUFDO2dCQUNkLFlBQVksRUFBRSxLQUFLO2dCQUNuQixNQUFNLEVBQUUsS0FBSztnQkFDYixXQUFXLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxR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
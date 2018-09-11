var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IEntity", "Enums", "language/Translation", "mod/IHookHost", "mod/Mod", "mod/ModRegistry", "newui/BindingManager", "newui/screen/IScreen", "newui/screen/screens/game/static/menubar/MenuBarButtonDescriptions", "utilities/math/Vector2", "utilities/math/Vector3", "./Actions", "./IDebugTools", "./LocationSelector", "./ui/component/AddItemToInventory", "./ui/DebugToolsDialog", "./ui/InspectDialog", "./UnlockedCameraMovementHandler", "./util/Version"], function (require, exports, IEntity_1, Enums_1, Translation_1, IHookHost_1, Mod_1, ModRegistry_1, BindingManager_1, IScreen_1, MenuBarButtonDescriptions_1, Vector2_1, Vector3_1, Actions_1, IDebugTools_1, LocationSelector_1, AddItemToInventory_1, DebugToolsDialog_1, InspectDialog_1, UnlockedCameraMovementHandler_1, Version_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function translation(debugToolsTranslation) {
        return new Translation_1.default(DebugTools.INSTANCE.dictionary, debugToolsTranslation);
    }
    exports.translation = translation;
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
            this.data.playerData[player.identifier] = this.data.playerData[player.identifier] || {
                weightBonus: 0,
                invulnerable: false,
                noclip: false,
            };
            return this.data.playerData[player.identifier][key];
        }
        setPlayerData(player, key, value) {
            this.getPlayerData(player, key);
            this.data.playerData[player.identifier][key] = value;
            this.trigger(DebugToolsEvent.PlayerDataChange, player.id, key, value);
        }
        initializeGlobalData(data) {
            const version = new Version_1.default(modManager.getVersion(this.getIndex()));
            const lastLoadVersion = new Version_1.default((data && data.lastVersion) || "0.0.0");
            const upgrade = !data || lastLoadVersion.isOlderThan(version);
            return !upgrade ? data : {
                lastVersion: version.getString(),
            };
        }
        initializeSaveData(data) {
            const version = new Version_1.default(modManager.getVersion(this.getIndex()));
            const lastLoadVersion = new Version_1.default((data && data.lastVersion) || "0.0.0");
            const upgrade = !data || lastLoadVersion.isOlderThan(version);
            return !upgrade ? data : {
                lighting: true,
                playerData: {},
                fog: true,
                lastVersion: version.getString(),
            };
        }
        onLoad() {
            hookManager.register(this.selector, "DebugTools:LocationSelector");
        }
        onUnload() {
            hookManager.deregister(this.selector);
            AddItemToInventory_1.default.get(newui).releaseAndRemove();
        }
        onSave() {
            return this.data;
        }
        updateFog() {
            fieldOfView.disabled = !this.data.fog;
            game.updateView(true);
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
            newui.getScreen(IScreen_1.ScreenId.Game)
                .openDialog(DebugTools.INSTANCE.dialogInspect)
                .setInspection(what);
            this.trigger(DebugToolsEvent.Inspect);
        }
        toggleDialog() {
            newui.getScreen(IScreen_1.ScreenId.Game)
                .toggleDialog(this.dialogMain);
        }
        postFieldOfView() {
            this.updateFog();
        }
        onGameScreenVisible() {
            AddItemToInventory_1.default.get(newui);
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
            if (enemy.entityType === IEntity_1.EntityType.Player) {
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
            player.moveType = Enums_1.MoveType.Flying;
            if (noclip.moving) {
                noclip.delay = Math.max(noclip.delay - 1, 1);
            }
            else {
                noclip.delay = Enums_1.Delay.Movement;
            }
            player.addDelay(noclip.delay, true);
            actionManager.execute(player, Enums_1.ActionType.UpdateDirection, { direction });
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
        getPlayerSpriteBatchLayer(player, batchLayer) {
            return this.getPlayerData(player, "noclip") ? Enums_1.SpriteBatchLayer.CreatureFlying : undefined;
        }
        isPlayerSwimming(player, isSwimming) {
            return this.getPlayerData(player, "noclip") ? false : undefined;
        }
        getPlayerStrength(strength, player) {
            return strength + this.getPlayerData(player, "weightBonus");
        }
        onBindLoop(bindPressed, api) {
            const gameScreen = newui.getScreen(IScreen_1.ScreenId.Game);
            if (api.wasPressed(this.bindableToggleDialog) && !bindPressed) {
                gameScreen.toggleDialog(this.dialogMain);
                bindPressed = this.bindableToggleDialog;
            }
            if (api.wasPressed(Enums_1.Bindable.GameZoomIn) && !bindPressed && gameScreen.isMouseWithin()) {
                this.data.zoomLevel = this.data.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.data.zoomLevel;
                this.data.zoomLevel = Math.min(11, ++this.data.zoomLevel);
                game.updateZoomLevel();
                bindPressed = Enums_1.Bindable.GameZoomIn;
                api.removePressState(Enums_1.Bindable.GameZoomIn);
            }
            if (api.wasPressed(Enums_1.Bindable.GameZoomOut) && !bindPressed && gameScreen.isMouseWithin()) {
                this.data.zoomLevel = this.data.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.data.zoomLevel;
                this.data.zoomLevel = Math.max(0, --this.data.zoomLevel);
                game.updateZoomLevel();
                bindPressed = Enums_1.Bindable.GameZoomOut;
                api.removePressState(Enums_1.Bindable.GameZoomOut);
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
                Actions_1.default.get("heal").execute({ entity: localPlayer });
                bindPressed = this.bindableHealLocalPlayer;
            }
            if (api.wasPressed(this.bindableTeleportLocalPlayer) && !bindPressed) {
                Actions_1.default.get("teleport").execute({
                    entity: localPlayer,
                    position: Object.assign({}, renderer.screenToTile(api.mouseX, api.mouseY).raw(), { z: localPlayer.z }),
                });
                bindPressed = this.bindableTeleportLocalPlayer;
            }
            if (api.wasPressed(this.bindableToggleNoClipOnLocalPlayer) && !bindPressed) {
                Actions_1.default.get("toggleNoclip")
                    .execute({ player: localPlayer, object: !this.getPlayerData(localPlayer, "noclip") });
                bindPressed = this.bindableToggleNoClipOnLocalPlayer;
            }
            return this.cameraState === CameraState.Locked ? bindPressed : this.unlockedCameraMovementHandler.handle(bindPressed, api);
        }
        getAmbientColor(colors) {
            if (!this.data.lighting) {
                return Vector3_1.default.ONE.xyz;
            }
            return undefined;
        }
        getAmbientLightLevel(ambientLight, z) {
            if (!this.data.lighting) {
                return 1;
            }
            return undefined;
        }
        getTileLightLevel(tile, x, y, z) {
            if (!this.data.lighting) {
                return 0;
            }
            return undefined;
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
        ModRegistry_1.default.messageSource("DebugTools")
    ], DebugTools.prototype, "source", void 0);
    __decorate([
        ModRegistry_1.default.interruptChoice("SailToCivilization")
    ], DebugTools.prototype, "choiceSailToCivilization", void 0);
    __decorate([
        ModRegistry_1.default.interruptChoice("TravelAway")
    ], DebugTools.prototype, "choiceTravelAway", void 0);
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
            tooltip: tooltip => tooltip.addText(text => text.setText(translation(IDebugTools_1.DebugToolsTranslation.DialogTitleMain))),
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
    ], DebugTools.prototype, "getPlayerSpriteBatchLayer", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "isPlayerSwimming", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getPlayerStrength", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "onBindLoop", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getAmbientColor", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getAmbientLightLevel", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getTileLightLevel", null);
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], DebugTools, "INSTANCE", void 0);
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], DebugTools, "LOG", void 0);
    exports.default = DebugTools;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWtDQSxTQUFnQixXQUFXLENBQUMscUJBQTRDO1FBQ3ZFLE9BQU8sSUFBSSxxQkFBVyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUZELGtDQUVDO0lBS0QsSUFBSyxXQWFKO0lBYkQsV0FBSyxXQUFXO1FBSWYsaURBQU0sQ0FBQTtRQUlOLHFEQUFRLENBQUE7UUFJUix5REFBVSxDQUFBO0lBQ1gsQ0FBQyxFQWJJLFdBQVcsS0FBWCxXQUFXLFFBYWY7SUFFRCxJQUFZLGVBWVg7SUFaRCxXQUFZLGVBQWU7UUFPMUIsd0RBQXFDLENBQUE7UUFJckMsc0NBQW1CLENBQUE7SUFDcEIsQ0FBQyxFQVpXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBWTFCO0lBRUQsTUFBcUIsVUFBVyxTQUFRLGFBQUc7UUFBM0M7O1lBc0dTLGdCQUFXLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQXFhMUMsQ0FBQztRQWhhQSxJQUFXLGdCQUFnQjtZQUMxQixPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLFFBQVEsQ0FBQztRQUNsRCxDQUFDO1FBU00sYUFBYSxDQUE4QixNQUFlLEVBQUUsR0FBTTtZQUN4RSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJO2dCQUNwRixXQUFXLEVBQUUsQ0FBQztnQkFDZCxZQUFZLEVBQUUsS0FBSztnQkFDbkIsTUFBTSxFQUFFLEtBQUs7YUFDYixDQUFDO1lBRUYsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFN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
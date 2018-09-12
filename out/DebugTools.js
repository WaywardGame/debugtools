var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IEntity", "Enums", "mod/IHookHost", "mod/Mod", "mod/ModRegistry", "newui/BindingManager", "newui/screen/IScreen", "newui/screen/screens/game/static/menubar/MenuBarButtonDescriptions", "utilities/math/Vector2", "utilities/math/Vector3", "./Actions", "./IDebugTools", "./LocationSelector", "./ui/component/AddItemToInventory", "./ui/DebugToolsDialog", "./ui/InspectDialog", "./UnlockedCameraMovementHandler", "./util/Version"], function (require, exports, IEntity_1, Enums_1, IHookHost_1, Mod_1, ModRegistry_1, BindingManager_1, IScreen_1, MenuBarButtonDescriptions_1, Vector2_1, Vector3_1, Actions_1, IDebugTools_1, LocationSelector_1, AddItemToInventory_1, DebugToolsDialog_1, InspectDialog_1, UnlockedCameraMovementHandler_1, Version_1) {
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
            tooltip: tooltip => tooltip.addText(text => text.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.DialogTitleMain))),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWlDQSxJQUFLLFdBYUo7SUFiRCxXQUFLLFdBQVc7UUFJZixpREFBTSxDQUFBO1FBSU4scURBQVEsQ0FBQTtRQUlSLHlEQUFVLENBQUE7SUFDWCxDQUFDLEVBYkksV0FBVyxLQUFYLFdBQVcsUUFhZjtJQUVELElBQVksZUFZWDtJQVpELFdBQVksZUFBZTtRQU8xQix3REFBcUMsQ0FBQTtRQUlyQyxzQ0FBbUIsQ0FBQTtJQUNwQixDQUFDLEVBWlcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFZMUI7SUFFRCxNQUFxQixVQUFXLFNBQVEsYUFBRztRQUEzQzs7WUFpSFMsZ0JBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBcWExQyxDQUFDO1FBaGFBLElBQVcsZ0JBQWdCO1lBQzFCLE9BQU8sSUFBSSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQ2xELENBQUM7UUFTTSxhQUFhLENBQThCLE1BQWUsRUFBRSxHQUFNO1lBQ3hFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUk7Z0JBQ3BGLFdBQVcsRUFBRSxDQUFDO2dCQUNkLFlBQVksRUFBRSxLQUFLO2dCQUNuQixNQUFNLEVBQUUsS0FBSzthQUNiLENBQUM7WUFFRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBWU0sYUFBYSxDQUE4QixNQUFlLEVBQUUsR0FBTSxFQUFFLEtBQXFCO1lBQy9GLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFF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
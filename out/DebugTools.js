var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IEntity", "Enums", "language/Translation", "mod/IHookHost", "mod/Mod", "mod/ModRegistry", "newui/BindingManager", "newui/screen/IScreen", "newui/screen/screens/game/static/menubar/MenuBarButtonDescriptions", "utilities/math/Vector2", "utilities/math/Vector3", "./Actions", "./IDebugTools", "./LocationSelector", "./ui/component/AddItemToInventory", "./ui/DebugToolsDialog", "./ui/InspectDialog", "./UnlockedCameraMovementHandler", "./util/Version"], function (require, exports, IEntity_1, Enums_1, Translation_1, IHookHost_1, Mod_1, ModRegistry_1, BindingManager_1, IScreen_1, MenuBarButtonDescriptions_1, Vector2_1, Vector3_1, Actions_1, IDebugTools_1, LocationSelector_1, AddItemToInventory_1, DebugToolsDialog_1, InspectDialog_1, UnlockedCameraMovementHandler_1, Version_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function translation(id) {
        return new Translation_1.default(DebugTools.INSTANCE.dictionary, id);
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
        DebugToolsEvent[DebugToolsEvent["PlayerDataChange"] = 0] = "PlayerDataChange";
    })(DebugToolsEvent = exports.DebugToolsEvent || (exports.DebugToolsEvent = {}));
    class DebugTools extends Mod_1.default {
        constructor() {
            super(...arguments);
            this.upgrade = false;
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
            this.triggerSync(DebugToolsEvent.PlayerDataChange, player.id, key, value);
        }
        onInitialize(saveDataGlobal) {
            DebugTools.INSTANCE = this;
            DebugTools.LOG = this.getLog();
            const version = new Version_1.default(modManager.getVersion(this.getIndex()));
            const lastLoadVersion = new Version_1.default((saveDataGlobal && saveDataGlobal.lastVersion) || "0.0.0");
            this.upgrade = !saveDataGlobal || lastLoadVersion.isOlderThan(version);
            this.globalData = !this.upgrade ? saveDataGlobal : {
                lastVersion: version.getString(),
            };
        }
        onUninitialize() {
            return this.globalData;
        }
        onLoad(saveData) {
            this.data = saveData && !this.upgrade ? saveData : {
                lighting: true,
                playerData: {},
                fog: true,
            };
            hookManager.register(this.selector, "DebugTools:LocationSelector");
            AddItemToInventory_1.default.get(newui);
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
        }
        toggleDialog() {
            newui.getScreen(IScreen_1.ScreenId.Game).toggleDialog(this.dialogMain);
        }
        postFieldOfView() {
            this.updateFog();
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
        heal(player, args) {
            Actions_1.default.get("heal").execute({ entity: player });
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
        ModRegistry_1.default.bindable("InspectTile", { mouseButton: 2, modifiers: [BindingManager_1.KeyModifier.Control] })
    ], DebugTools.prototype, "bindableInspectTile", void 0);
    __decorate([
        ModRegistry_1.default.bindable("ToggleCameraLock", { key: "KeyU", modifiers: [BindingManager_1.KeyModifier.Alt] })
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
            bindable: ModRegistry_1.registry().get("bindableToggleDialog"),
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
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "postFieldOfView", null);
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
        ModRegistry_1.default.command("heal")
    ], DebugTools.prototype, "heal", null);
    exports.default = DebugTools;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQThCQSxTQUFnQixXQUFXLENBQUMsRUFBeUI7UUFDcEQsT0FBTyxJQUFJLHFCQUFXLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUZELGtDQUVDO0lBRUQsSUFBSyxXQUlKO0lBSkQsV0FBSyxXQUFXO1FBQ2YsaURBQU0sQ0FBQTtRQUNOLHFEQUFRLENBQUE7UUFDUix5REFBVSxDQUFBO0lBQ1gsQ0FBQyxFQUpJLFdBQVcsS0FBWCxXQUFXLFFBSWY7SUFFRCxJQUFZLGVBT1g7SUFQRCxXQUFZLGVBQWU7UUFNMUIsNkVBQWdCLENBQUE7SUFDakIsQ0FBQyxFQVBXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBTzFCO0lBRUQsTUFBcUIsVUFBVyxTQUFRLGFBQUc7UUFBM0M7O1lBcUZTLFlBQU8sR0FBRyxLQUFLLENBQUM7WUFDaEIsZ0JBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBa1MxQyxDQUFDO1FBaFNBLElBQVcsZ0JBQWdCO1lBQzFCLE9BQU8sSUFBSSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQ2xELENBQUM7UUFFTSxhQUFhLENBQThCLE1BQWUsRUFBRSxHQUFNO1lBQ3hFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUk7Z0JBQ3BGLFdBQVcsRUFBRSxDQUFDO2dCQUNkLFlBQVksRUFBRSxLQUFLO2dCQUNuQixNQUFNLEVBQUUsS0FBSzthQUNiLENBQUM7WUFFRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFD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
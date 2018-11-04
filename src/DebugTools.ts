import ActionExecutor from "action/ActionExecutor";
import { ActionType } from "action/IAction";
import { ICreature, IDamageInfo } from "creature/ICreature";
import IBaseHumanEntity from "entity/IBaseHumanEntity";
import { EntityType } from "entity/IEntity";
import { Bindable, Delay, Direction, MoveType, OverlayType, SpriteBatchLayer } from "Enums";
import { Dictionary } from "language/Dictionaries";
import InterruptChoice from "language/dictionary/InterruptChoice";
import Message from "language/dictionary/Message";
import { HookMethod } from "mod/IHookHost";
import InterModRegistry from "mod/InterModRegistry";
import Mod from "mod/Mod";
import Register, { Registry } from "mod/ModRegistry";
import { BindCatcherApi, bindingManager, KeyModifier } from "newui/BindingManager";
import { ScreenId } from "newui/screen/IScreen";
import { DialogId } from "newui/screen/screens/game/Dialogs";
import { MenuBarButtonGroup, MenuBarButtonType } from "newui/screen/screens/game/static/menubar/MenuBarButtonDescriptions";
import GameScreen from "newui/screen/screens/GameScreen";
import { INPC } from "npc/INPC";
import { Source } from "player/IMessageManager";
import IPlayer from "player/IPlayer";
import { ITile } from "tile/ITerrain";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import AddItemToInventory from "./action/AddItemToInventory";
import ChangeTerrain from "./action/ChangeTerrain";
import Clone from "./action/Clone";
import Heal from "./action/Heal";
import Kill from "./action/Kill";
import Paint from "./action/Paint";
import PlaceTemplate from "./action/PlaceTemplate";
import Remove from "./action/Remove";
import SelectionExecute from "./action/SelectionExecute";
import SetGrowingStage from "./action/SetGrowingStage";
import SetSkill from "./action/SetSkill";
import SetStat from "./action/SetStat";
import SetTamed from "./action/SetTamed";
import SetTime from "./action/SetTime";
import SetWeightBonus from "./action/SetWeightBonus";
import TeleportEntity from "./action/TeleportEntity";
import ToggleInvulnerable from "./action/ToggleInvulnerable";
import ToggleNoClip from "./action/ToggleNoClip";
import TogglePermissions from "./action/TogglePermissions";
import ToggleTilled from "./action/ToggleTilled";
import UnlockRecipes from "./action/UnlockRecipes";
import UpdateStatsAndAttributes from "./action/UpdateStatsAndAttributes";
import Actions from "./Actions";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, IPlayerData, ISaveData, ISaveDataGlobal, ModRegistrationInspectDialogEntityInformationSubsection, ModRegistrationInspectDialogInformationSection, ModRegistrationMainDialogPanel, translation } from "./IDebugTools";
import LocationSelector from "./LocationSelector";
import AddItemToInventoryComponent from "./ui/component/AddItemToInventory";
import MainDialog from "./ui/DebugToolsDialog";
import InspectDialog from "./ui/InspectDialog";
import UnlockedCameraMovementHandler from "./UnlockedCameraMovementHandler";
import Version from "./util/Version";

/**
 * An enum representing the possible states of the camera
 */
enum CameraState {
	/**
	 * For when the camera is locked to the player
	 */
	Locked,
	/**
	 * For when the camera is unlocked and free to roam wherever
	 */
	Unlocked,
	/**
	 * For when the camera is in the process of moving back to the player
	 */
	Transition,
}

export enum DebugToolsEvent {
	/**
	 * Emitted when the data of the player is changing.
	 * @param playerId The ID of the player whose data is changing
	 * @param property The name of the property of the player's data which is changing
	 * @param newValue The new value of the changed property in the player's data
	 */
	PlayerDataChange = "PlayerDataChange",
	/**
	 * Emitted when a tile or object is inspected.
	 */
	Inspect = "Inspect",
	/**
	 * Emitted when permissions are changed for this player.
	 */
	PermissionsChange = "PermissionsChange",
}

export default class DebugTools extends Mod {

	////////////////////////////////////
	// Static
	//

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public static readonly INSTANCE: DebugTools;
	@Mod.log(DEBUG_TOOLS_ID)
	public static readonly LOG: Log;

	////////////////////////////////////
	// Registries
	//

	@Register.registry(Actions)
	public readonly actions: Actions;
	@Register.registry(LocationSelector)
	public readonly selector: LocationSelector;
	@Register.registry(UnlockedCameraMovementHandler)
	public readonly unlockedCameraMovementHandler: UnlockedCameraMovementHandler;

	////////////////////////////////////
	// Extension Registries
	//

	@Register.interModRegistry("MainDialogPanel")
	public readonly modRegistryMainDialogPanels: InterModRegistry<ModRegistrationMainDialogPanel>;
	@Register.interModRegistry("InspectDialogPanel")
	public readonly modRegistryInspectDialogPanels: InterModRegistry<ModRegistrationInspectDialogInformationSection>;
	@Register.interModRegistry("InspectDialogEntityInformationSubsection")
	public readonly modRegistryInspectDialogEntityInformationSubsections: InterModRegistry<ModRegistrationInspectDialogEntityInformationSubsection>;

	////////////////////////////////////
	// Bindables
	//

	@Register.bindable("ToggleDialog", { key: "Backslash" }, { key: "IntlBackslash" })
	public readonly bindableToggleDialog: Bindable;
	@Register.bindable("CloseInspectDialog", { key: "KeyI", modifiers: [KeyModifier.Alt] })
	public readonly bindableCloseInspectDialog: Bindable;

	@Register.bindable("InspectTile", { mouseButton: 2, modifiers: [KeyModifier.Alt] })
	public readonly bindableInspectTile: Bindable;
	@Register.bindable("InspectLocalPlayer", { key: "KeyP", modifiers: [KeyModifier.Alt] })
	public readonly bindableInspectLocalPlayer: Bindable;
	@Register.bindable("HealLocalPlayer", { key: "KeyH", modifiers: [KeyModifier.Alt] })
	public readonly bindableHealLocalPlayer: Bindable;
	@Register.bindable("TeleportLocalPlayer", { mouseButton: 0, modifiers: [KeyModifier.Alt] })
	public readonly bindableTeleportLocalPlayer: Bindable;
	@Register.bindable("ToggleNoClip", { key: "KeyN", modifiers: [KeyModifier.Alt] })
	public readonly bindableToggleNoClipOnLocalPlayer: Bindable;

	@Register.bindable("ToggleCameraLock", { key: "KeyC", modifiers: [KeyModifier.Alt] })
	public readonly bindableToggleCameraLock: Bindable;

	@Register.bindable("Paint", { mouseButton: 0 })
	public readonly bindablePaint: Bindable;
	@Register.bindable("ErasePaint", { mouseButton: 2 })
	public readonly bindableErasePaint: Bindable;
	@Register.bindable("ClearPaint", { key: "Backspace" })
	public readonly bindableClearPaint: Bindable;
	@Register.bindable("CancelPaint", { key: "Escape" })
	public readonly bindableCancelPaint: Bindable;
	@Register.bindable("CompletePaint", { key: "Enter" })
	public readonly bindableCompletePaint: Bindable;

	////////////////////////////////////
	// Language
	//

	@Register.dictionary("DebugTools", DebugToolsTranslation)
	public readonly dictionary: Dictionary;

	@Register.message("FailureTileBlocked")
	public readonly messageFailureTileBlocked: Message;

	@Register.messageSource("DebugTools")
	public readonly source: Source;

	@Register.interruptChoice("SailToCivilization")
	public readonly choiceSailToCivilization: InterruptChoice;
	@Register.interruptChoice("TravelAway")
	public readonly choiceTravelAway: InterruptChoice;

	////////////////////////////////////
	// Actions
	//

	@Register.action("PlaceTemplate", PlaceTemplate)
	public readonly actionPlaceTemplate: ActionType;

	@Register.action("SelectionExecute", SelectionExecute)
	public readonly actionSelectionExecute: ActionType;

	@Register.action("TeleportEntity", TeleportEntity)
	public readonly actionTeleportEntity: ActionType;

	@Register.action("Kill", Kill)
	public readonly actionKill: ActionType;

	@Register.action("Clone", Clone)
	public readonly actionClone: ActionType;

	@Register.action("SetTime", SetTime)
	public readonly actionSetTime: ActionType;

	@Register.action("Heal", Heal)
	public readonly actionHeal: ActionType;

	@Register.action("SetStat", SetStat)
	public readonly actionSetStat: ActionType;

	@Register.action("SetTamed", SetTamed)
	public readonly actionSetTamed: ActionType;

	@Register.action("Remove", Remove)
	public readonly actionRemove: ActionType;

	@Register.action("SetWeightBonus", SetWeightBonus)
	public readonly actionSetWeightBonus: ActionType;

	@Register.action("ChangeTerrain", ChangeTerrain)
	public readonly actionChangeTerrain: ActionType;

	@Register.action("ToggleTilled", ToggleTilled)
	public readonly actionToggleTilled: ActionType;

	@Register.action("UpdateStatsAndAttributes", UpdateStatsAndAttributes)
	public readonly actionUpdateStatsAndAttributes: ActionType;

	@Register.action("AddItemToInventory", AddItemToInventory)
	public readonly actionAddItemToInventory: ActionType;

	@Register.action("Paint", Paint)
	public readonly actionPaint: ActionType;

	@Register.action("UnlockRecipes", UnlockRecipes)
	public readonly actionUnlockRecipes: ActionType;

	@Register.action("ToggleInvulnerable", ToggleInvulnerable)
	public readonly actionToggleInvulnerable: ActionType;

	@Register.action("SetSkill", SetSkill)
	public readonly actionSetSkill: ActionType;

	@Register.action("SetGrowingStage", SetGrowingStage)
	public readonly actionSetGrowingStage: ActionType;

	@Register.action("ToggleNoclip", ToggleNoClip)
	public readonly actionToggleNoclip: ActionType;

	@Register.action("TogglePermissions", TogglePermissions)
	public readonly actionTogglePermissions: ActionType;

	////////////////////////////////////
	// UI
	//

	@Register.dialog("Main", MainDialog.description, MainDialog)
	public readonly dialogMain: DialogId;
	@Register.dialog("Inspect", InspectDialog.description, InspectDialog)
	public readonly dialogInspect: DialogId;

	@Register.menuBarButton("Dialog", {
		onActivate: () => DebugTools.INSTANCE.toggleDialog(),
		group: MenuBarButtonGroup.Meta,
		bindable: Registry<DebugTools, Bindable>().get("bindableToggleDialog"),
		tooltip: tooltip => tooltip.addText(text => text.setText(translation(DebugToolsTranslation.DialogTitleMain))),
		onCreate: button => {
			button.toggle(DebugTools.INSTANCE.hasPermission());
			DebugTools.INSTANCE.on(DebugToolsEvent.PlayerDataChange, () => button.toggle(DebugTools.INSTANCE.hasPermission()));
		},
	})
	public readonly menuBarButton: MenuBarButtonType;

	@Register.overlay("Target")
	public readonly overlayTarget: OverlayType;
	@Register.overlay("Paint")
	public readonly overlayPaint: OverlayType;

	////////////////////////////////////
	// Fields & Other Data Storage
	//

	@Mod.saveData<DebugTools>(DEBUG_TOOLS_ID)
	public data: ISaveData;
	@Mod.globalData<DebugTools>(DEBUG_TOOLS_ID)
	public globalData: ISaveDataGlobal;

	private cameraState = CameraState.Locked;

	/**
	 * Retruns true if the camera state is `CameraState.Unlocked`. `CameraState.Transition` is considered "locked"
	 */
	public get isCameraUnlocked() {
		return this.cameraState === CameraState.Unlocked;
	}

	/**
	 * Returns a value from the debug tools player data.
	 * @param player The player to get the data of.
	 * @param key A key in `IPlayerData`, which is the index of the data that will be returned.
	 * 
	 * Note: If the player data doesn't yet exist, it will be created.
	 */
	public getPlayerData<K extends keyof IPlayerData>(player: IPlayer, key: K): IPlayerData[K] {
		this.data.playerData[player.identifier] = this.data.playerData[player.identifier] || {
			weightBonus: 0,
			invulnerable: false,
			noclip: false,
			permissions: players[player.id].isServer(),
		};

		return this.data.playerData[player.identifier][key];
	}

	/**
	 * Sets debug tools player data.
	 * @param player The player to set data for.
	 * @param key The key in `IPlayerData` to set data to.
	 * @param value The value which should be stored in this key on the player data.
	 * 
	 * Note: If the player doesn't have data stored yet, it's created first.
	 * 
	 * Note: Emits `DebugToolsEvent.PlayerDataChange` with the id of the player, the key of the changing data, and the new value.
	 */
	public setPlayerData<K extends keyof IPlayerData>(player: IPlayer, key: K, value: IPlayerData[K]) {
		this.getPlayerData(player, key);
		this.data.playerData[player.identifier][key] = value;
		this.trigger(DebugToolsEvent.PlayerDataChange, player.id, key, value);

		if (!this.hasPermission()) {
			const gameScreen = newui.getScreen<GameScreen>(ScreenId.Game)!;
			gameScreen.closeDialog(this.dialogMain);
			gameScreen.closeDialog(this.dialogInspect);
		}
	}

	////////////////////////////////////
	// Mod Loading Cycle
	//

	/**
	 * If the data doesn't exist or the user upgraded to a new version, we reinitialize the data.
	 */
	public initializeGlobalData(data?: ISaveDataGlobal) {
		const version = new Version(modManager.getVersion(this.getIndex()));
		const lastLoadVersion = new Version((data && data.lastVersion) || "0.0.0");

		const upgrade = !data || lastLoadVersion.isOlderThan(version);

		return !upgrade ? data : {
			lastVersion: version.getString(),
		};
	}

	/**
	 * If the data doesn't exist or the user upgraded to a new version, we reinitialize the data.
	 */
	public initializeSaveData(data?: ISaveData) {
		const version = new Version(modManager.getVersion(this.getIndex()));
		const lastLoadVersion = new Version((data && data.lastVersion) || "0.0.0");

		const upgrade = !data || lastLoadVersion.isOlderThan(version);

		return !upgrade ? data : {
			lighting: true,
			playerData: {},
			fog: true,
			lastVersion: version.getString(),
		};
	}

	/**
	 * Called when Debug Tools is loaded (in a save)
	 * - Registers the `LocationSelector` stored in `this.selector` as a hook host.
	 */
	public onLoad(): void {
		hookManager.register(this.selector, "DebugTools:LocationSelector");
	}

	/**
	 * Called when Debug Tools is unloaded (a save is exited)
	 * - Deregisters `this.selector` as a hook host.
	 * - Removes the `AddItemToInventory` UI Component.
	 */
	public onUnload() {
		hookManager.deregister(this.selector);
		AddItemToInventoryComponent.init(newui).releaseAndRemove();
	}

	/**
	 * Saves the save data for Debug Tools
	 */
	public onSave(): any {
		return this.data;
	}

	////////////////////////////////////
	// Public Methods
	//

	/**
	 * Updates the field of view based on whether it's disabled in the mod.
	 */
	public updateFog() {
		fieldOfView.disabled = !this.data.fog;
		game.updateView(true);
	}

	/**
	 * Sets the camera state.
	 * @param unlocked If true, unlocks the camera. Otherwise, sets the camera state to `CameraState.Transition`, allowing the camera
	 * movement handler to transition it back to the player so it can be locked.
	 */
	public setCameraUnlocked(unlocked: boolean) {
		if (unlocked) {
			this.cameraState = CameraState.Unlocked;
			this.unlockedCameraMovementHandler.position = new Vector2(localPlayer);
			this.unlockedCameraMovementHandler.velocity = Vector2.ZERO;
			this.unlockedCameraMovementHandler.transition = undefined;
			this.unlockedCameraMovementHandler.homingVelocity = 0;

		} else {
			this.cameraState = CameraState.Transition;
			this.unlockedCameraMovementHandler.transition = new Vector2(localPlayer);
		}
	}

	/**
	 * Inspects a tile, creature, player, or NPC.
	 * - Opens the `InspectDialog`.
	 * - Emits `DebugToolsEvent.Inspect`
	 */
	public inspect(what: Vector2 | ICreature | IPlayer | INPC) {
		newui.getScreen<GameScreen>(ScreenId.Game)!
			.openDialog<InspectDialog>(DebugTools.INSTANCE.dialogInspect)
			.setInspection(what);

		this.trigger(DebugToolsEvent.Inspect);
	}

	/**
	 * Toggles the main dialog.
	 */
	public toggleDialog() {
		if (!this.hasPermission()) return;

		newui.getScreen<GameScreen>(ScreenId.Game)!
			.toggleDialog(this.dialogMain);
	}

	public hasPermission() {
		return !multiplayer.isConnected() || multiplayer.isServer() || this.getPlayerData(localPlayer, "permissions");
	}

	////////////////////////////////////
	// Hooks
	//

	/**
	 * When the field of view has initialized, we update the fog (enables/disables it based on the mod save data)
	 */
	@HookMethod
	public postFieldOfView() {
		this.updateFog();
	}

	/**
	 * Called when the game screen becomes visible
	 * - Initializes the `AddItemToInventory` UI Component (it takes a second or two to be created, and there are multiple places in
	 * the UI that use it. We initialize it only once so the slow initialization only happens once.)
	 */
	@HookMethod
	public onGameScreenVisible() {
		AddItemToInventoryComponent.init(newui);
	}

	/**
	 * We allow zooming out much further than normal. To facilitate this we use this hook.
	 * - If the zoom level hasn't been set by this mod, we return `undefined`, let another mod or the base game handle it.
	 * - If our internal zoom level is more than `3`, we subtract 3 and use them as default zoom scales.
	 * - If our internal zoom level is `3`: `0.5`
	 * - If our internal zoom level is `2`: `0.25`
	 * - If our internal zoom level is `1`: `0.125`
	 * - If our internal zoom level is `0`: `0.0625`
	 */
	@HookMethod
	public getZoomLevel() {
		if (this.data.zoomLevel === undefined) {
			return undefined;
		}

		if (this.data.zoomLevel > 3) {
			return this.data.zoomLevel - 3;
		}

		return 1 / 2 ** (4 - this.data.zoomLevel);
	}

	/**
	 * - If the camera state is `Locked`, we return `undefined` — let another mod or the base game handle the camera.
	 * - If the camera state is `Transition`, we:
	 * 	- Update the transition location on the camera movement handler.
	 * 	- Check if the distance between the transition camera position and the local player (locked position) is less than half a tile.
	 * 		- If it is, we lock the camera again and return `undefined`.
	 * 		- Otherwise, we return the transition camera position.
	 */
	@HookMethod
	public getCameraPosition(position: IVector2): IVector2 | undefined {
		if (this.cameraState === CameraState.Locked) {
			return undefined;
		}

		if (this.cameraState === CameraState.Transition) {
			this.unlockedCameraMovementHandler.transition = new Vector2(localPlayer);
			if (Vector2.isDistanceWithin(this.unlockedCameraMovementHandler.position, localPlayer, 0.5)) {
				this.cameraState = CameraState.Locked;
				return undefined;
			}
		}

		return this.unlockedCameraMovementHandler.position;
	}

	/**
	 * We cancel damage to the player if they're set as "invulnerable"
	 */
	@HookMethod
	public onPlayerDamage(player: IPlayer, info: IDamageInfo): number | undefined {
		if (this.getPlayerData(player, "invulnerable")) return 0;
		return undefined;
	}

	/**
	 * We prevent creatures attacking the enemy if the enemy is a player who is set as "invulnerable" or "noclipping"
	 */
	@HookMethod
	public canCreatureAttack(creature: ICreature, enemy: IPlayer | ICreature): boolean | undefined {
		if (enemy.entityType === EntityType.Player) {
			if (this.getPlayerData(enemy, "invulnerable")) return false;
			if (this.getPlayerData(enemy, "noclip")) return false;
		}

		return undefined;
	}

	/**
	 * If the player isn't "noclipping", returns `undefined`.
	 * 
	 * Otherwise: 
	 * - The delay before the next movement is calculated based on the last movement (it goes faster the further you go, with a cap)
	 * - Moves the player to the next tile instantly, then adds the calculated delay.
	 * - Cancels the default movement by returning `false`.
	 */
	@HookMethod
	public onMove(player: IPlayer, nextX: number, nextY: number, tile: ITile, direction: Direction): boolean | undefined {
		const noclip = this.getPlayerData(player, "noclip");
		if (!noclip) return undefined;

		player.moveType = MoveType.Flying;

		if (noclip.moving) {
			noclip.delay = Math.max(noclip.delay - 1, 1);

		} else {
			noclip.delay = Delay.Movement;
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

	/**
	 * Used to reset noclip movement speed.
	 */
	@HookMethod
	public onNoInputReceived(player: IPlayer): void {
		const noclip = this.getPlayerData(player, "noclip");
		if (!noclip) return;

		noclip.moving = false;
	}

	/**
	 * Used to prevent the weight movement penalty while noclipping.
	 */
	@HookMethod
	public getPlayerWeightMovementPenalty(player: IPlayer): number | undefined {
		return this.getPlayerData(player, "noclip") ? 0 : undefined;
	}

	/**
	 * If the player is "noclipping", we put them in `SpriteBatchLayer.CreatureFlying`.
	 * Otherwise we return `undefined` and let the game or other mods handle it.
	 */
	@HookMethod
	public getPlayerSpriteBatchLayer(player: IPlayer, batchLayer: SpriteBatchLayer): SpriteBatchLayer | undefined {
		return this.getPlayerData(player, "noclip") ? SpriteBatchLayer.CreatureFlying : undefined;
	}

	/**
	 * If the player is "noclipping", we return `false` (not swimming). 
	 * Otherwise we return `undefined` and let the game or other mods handle it. 
	 */
	@HookMethod
	public isHumanSwimming(human: IBaseHumanEntity, isSwimming: boolean): boolean | undefined {
		if (human.entityType === EntityType.NPC) return undefined;

		return this.getPlayerData(human as IPlayer, "noclip") ? false : undefined;
	}

	/**
	 * We add the weight bonus from the player's save data to the existing strength.
	 */
	@HookMethod
	public getPlayerStrength(strength: number, player: IPlayer) {
		return strength + this.getPlayerData(player, "weightBonus");
	}

	// tslint:disable cyclomatic-complexity
	@HookMethod
	public onBindLoop(bindPressed: Bindable, api: BindCatcherApi): Bindable {
		if (!this.hasPermission()) return bindPressed;

		const gameScreen = newui.getScreen<GameScreen>(ScreenId.Game)!;

		if (api.wasPressed(Bindable.GameZoomIn) && !bindPressed && gameScreen.isMouseWithin()) {
			this.data.zoomLevel = this.data.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.data.zoomLevel;
			this.data.zoomLevel = Math.min(11, ++this.data.zoomLevel);
			game.updateZoomLevel();
			bindPressed = Bindable.GameZoomIn;
			api.removePressState(Bindable.GameZoomIn);
		}

		if (api.wasPressed(Bindable.GameZoomOut) && !bindPressed && gameScreen.isMouseWithin()) {
			this.data.zoomLevel = this.data.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.data.zoomLevel;
			this.data.zoomLevel = Math.max(0, --this.data.zoomLevel);
			game.updateZoomLevel();
			bindPressed = Bindable.GameZoomOut;
			api.removePressState(Bindable.GameZoomOut);
		}

		if (api.wasPressed(this.bindableToggleCameraLock) && !bindPressed) {
			this.setCameraUnlocked(this.cameraState !== CameraState.Unlocked);
			bindPressed = this.bindableToggleCameraLock;
		}

		if (api.wasPressed(this.bindableInspectTile) && !bindPressed && gameScreen.isMouseWithin()) {
			this.inspect(renderer.screenToTile(...bindingManager.getMouse().xy));
			bindPressed = this.bindableInspectTile;
		}

		if (api.wasPressed(this.bindableInspectLocalPlayer) && !bindPressed) {
			this.inspect(localPlayer);
			bindPressed = this.bindableInspectLocalPlayer;
		}

		if (api.wasPressed(this.bindableHealLocalPlayer) && !bindPressed) {
			ActionExecutor.get(Heal).execute(localPlayer, localPlayer);
			bindPressed = this.bindableHealLocalPlayer;
		}

		if (api.wasPressed(this.bindableTeleportLocalPlayer) && !bindPressed) {
			ActionExecutor.get(TeleportEntity).execute(localPlayer, localPlayer, { ...renderer.screenToTile(api.mouseX, api.mouseY).raw(), z: localPlayer.z });
			bindPressed = this.bindableTeleportLocalPlayer;
		}

		if (api.wasPressed(this.bindableToggleNoClipOnLocalPlayer) && !bindPressed) {
			ActionExecutor.get(ToggleNoClip).execute(localPlayer, localPlayer, !this.getPlayerData(localPlayer, "noclip"));
			bindPressed = this.bindableToggleNoClipOnLocalPlayer;
		}

		// if the camera isn't locked, we let the camera movement handler handle binds
		return this.cameraState === CameraState.Locked ? bindPressed : this.unlockedCameraMovementHandler.handle(bindPressed, api);
	}
	// tslint:enable cyclomatic-complexity

	/**
	 * If lighting is disabled, we return maximum light on all channels.
	 */
	@HookMethod
	public getAmbientColor(colors: [number, number, number]) {
		if (!this.data.lighting) {
			return Vector3.ONE.xyz;
		}

		return undefined;
	}

	/**
	 * If lighting is disabled, we return the maximum light level.
	 */
	@HookMethod
	public getAmbientLightLevel(ambientLight: number, z: number): number | undefined {
		if (!this.data.lighting) {
			return 1;
		}

		return undefined;
	}

	/**
	 * If lighting is disabled, we return the minimum light level.
	 */
	@HookMethod
	public getTileLightLevel(tile: ITile, x: number, y: number, z: number): number | undefined {
		if (!this.data.lighting) {
			return 0;
		}

		return undefined;
	}
}

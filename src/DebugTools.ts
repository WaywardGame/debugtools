import ActionExecutor from "entity/action/ActionExecutor";
import { ActionType } from "entity/action/IAction";
import Creature from "entity/creature/Creature";
import { IDamageInfo } from "entity/creature/ICreature";
import Human from "entity/Human";
import { MoveType } from "entity/IEntity";
import { Delay } from "entity/IHuman";
import NPC from "entity/npc/NPC";
import { Source } from "entity/player/IMessageManager";
import Player from "entity/player/Player";
import { EventBus } from "event/EventBuses";
import { Events, IEventEmitter } from "event/EventEmitter";
import EventManager, { EventHandler } from "event/EventManager";
import Game from "game/Game";
import { RenderSource } from "game/IGame";
import { InspectType } from "game/inspection/IInspection";
import { Dictionary } from "language/Dictionaries";
import Interrupt from "language/dictionary/Interrupt";
import Message from "language/dictionary/Message";
import { HookMethod } from "mod/IHookHost";
import InterModRegistry from "mod/InterModRegistry";
import Mod from "mod/Mod";
import Register, { Registry } from "mod/ModRegistry";
import Bind, { IBindHandlerApi } from "newui/input/Bind";
import Bindable from "newui/input/Bindable";
import { IInput } from "newui/input/IInput";
import InputManager from "newui/input/InputManager";
import { DialogId } from "newui/screen/screens/game/Dialogs";
import { MenuBarButtonGroup, MenuBarButtonType } from "newui/screen/screens/game/static/menubar/MenuBarButtonDescriptions";
import { gameScreen } from "newui/screen/screens/GameScreen";
import WorldRenderer from "renderer/WorldRenderer";
import { ITile, OverlayType } from "tile/ITerrain";
import { IInjectionApi, Inject, InjectionPosition } from "utilities/Inject";
import Log from "utilities/Log";
import { Direction } from "utilities/math/Direction";
import { IVector2 } from "utilities/math/IVector";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import AddItemToInventory from "./action/AddItemToInventory";
import ChangeTerrain from "./action/ChangeTerrain";
import Clone from "./action/Clone";
import ForceSailToCivilization from "./action/ForceSailToCivilization";
import Heal from "./action/Heal";
import Kill from "./action/Kill";
import Paint from "./action/Paint";
import PlaceTemplate from "./action/PlaceTemplate";
import Remove from "./action/Remove";
import RenameIsland from "./action/RenameIsland";
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
import UpdateStatsAndAttributes from "./action/UpdateStatsAndAttributes";
import Actions from "./Actions";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, IGlobalData, IPlayerData, ISaveData, ModRegistrationInspectDialogEntityInformationSubsection, ModRegistrationInspectDialogInformationSection, ModRegistrationMainDialogPanel, translation, ZOOM_LEVEL_MAX } from "./IDebugTools";
import LocationSelector from "./LocationSelector";
import AddItemToInventoryComponent from "./ui/component/AddItemToInventory";
import MainDialog from "./ui/DebugToolsDialog";
import InspectDialog from "./ui/InspectDialog";
import TemperatureInspection from "./ui/inspection/Temperature";
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

interface IDebugToolsEvents extends Events<Mod> {
	/**
	 * Emitted when the data of the player is changing.
	 * @param playerId The ID of the player whose data is changing
	 * @param property The name of the property of the player's data which is changing
	 * @param newValue The new value of the changed property in the player's data
	 */
	playerDataChange<K extends keyof IPlayerData>(playerId: number, property: K, newValue: IPlayerData[K]): any;
	/**
	 * Emitted when a tile or object is inspected.
	 */
	inspect(): any;
	/**
	 * Emitted when permissions are changed for this player.
	 */
	permissionsChange(): any;
}

export default class DebugTools extends Mod {
	@Override public event: IEventEmitter<this, IDebugToolsEvents>;

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

	@Register.bindable("ToggleDialog", IInput.key("Backslash"), IInput.key("IntlBackslash"))
	public readonly bindableToggleDialog: Bindable;
	@Register.bindable("CloseInspectDialog", IInput.key("KeyI", "Alt"))
	public readonly bindableCloseInspectDialog: Bindable;

	@Register.bindable("InspectTile", IInput.mouseButton(2, "Alt"))
	public readonly bindableInspectTile: Bindable;
	@Register.bindable("InspectLocalPlayer", IInput.key("KeyP", "Alt"))
	public readonly bindableInspectLocalPlayer: Bindable;
	@Register.bindable("HealLocalPlayer", IInput.key("KeyH", "Alt"))
	public readonly bindableHealLocalPlayer: Bindable;
	@Register.bindable("TeleportLocalPlayer", IInput.mouseButton(0, "Alt"))
	public readonly bindableTeleportLocalPlayer: Bindable;
	@Register.bindable("ToggleNoClip", IInput.key("KeyN", "Alt"))
	public readonly bindableToggleNoClipOnLocalPlayer: Bindable;

	@Register.bindable("ToggleCameraLock", IInput.key("KeyC", "Alt"))
	public readonly bindableToggleCameraLock: Bindable;
	@Register.bindable("ToggleFullVisibility", IInput.key("KeyV", "Alt"))
	public readonly bindableToggleFullVisibility: Bindable;

	@Register.bindable("Paint", IInput.mouseButton(0))
	public readonly bindablePaint: Bindable;
	@Register.bindable("ErasePaint", IInput.mouseButton(2))
	public readonly bindableErasePaint: Bindable;
	@Register.bindable("ClearPaint", IInput.key("Backspace"))
	public readonly bindableClearPaint: Bindable;
	@Register.bindable("CancelPaint", IInput.key("Escape"))
	public readonly bindableCancelPaint: Bindable;
	@Register.bindable("CompletePaint", IInput.key("Enter"))
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

	@Register.interrupt("ConfirmUnlockRecipes")
	public readonly interruptUnlockRecipes: Interrupt;

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

	@Register.action("RenameIsland", RenameIsland)
	public readonly actionRenameIsland: ActionType;

	@Register.action("ForceSailToCivilization", ForceSailToCivilization)
	public readonly actionForceSailToCivilization: ActionType;

	////////////////////////////////////
	// UI
	//

	@Register.dialog("Main", MainDialog.description, MainDialog)
	public readonly dialogMain: DialogId;
	@Register.dialog("Inspect", InspectDialog.description, InspectDialog)
	public readonly dialogInspect: DialogId;

	@Register.inspectionType("temperature", TemperatureInspection)
	public readonly inspectionTemperature: InspectType;

	@Register.menuBarButton("Dialog", {
		onActivate: () => DebugTools.INSTANCE.toggleDialog(),
		group: MenuBarButtonGroup.Meta,
		bindable: Registry<DebugTools>().get("bindableToggleDialog"),
		tooltip: tooltip => tooltip.addText(text => text.setText(translation(DebugToolsTranslation.DialogTitleMain))),
		onCreate: button => {
			button.toggle(DebugTools.INSTANCE.hasPermission());
			DebugTools.INSTANCE.event.subscribe("playerDataChange", () => button.toggle(DebugTools.INSTANCE.hasPermission()));
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
	public globalData: IGlobalData;

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
	public getPlayerData<K extends keyof IPlayerData>(player: Player, key: K): IPlayerData[K] {
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
	public setPlayerData<K extends keyof IPlayerData>(player: Player, key: K, value: IPlayerData[K]) {
		this.getPlayerData(player, key); // initializes it if it doesn't exist
		this.data.playerData[player.identifier][key] = value;
		this.event.emit("playerDataChange", player.id, key, value);

		if (!this.hasPermission()) {
			gameScreen!.closeDialog(this.dialogMain);
			gameScreen!.closeDialog(this.dialogInspect);
		}
	}

	////////////////////////////////////
	// Mod Loading Cycle
	//

	/**
	 * If the data doesn't exist or the user upgraded to a new version, we reinitialize the data.
	 */
	@Override public initializeGlobalData(data?: IGlobalData) {
		return !this.needsUpgrade(data) ? data : {
			lastVersion: modManager.getVersion(this.getIndex()),
		};
	}

	/**
	 * If the data doesn't exist or the user upgraded to a new version, we reinitialize the data.
	 */
	@Override public initializeSaveData(data?: ISaveData) {
		return !this.needsUpgrade(data) ? data : {
			playerData: {},
			lastVersion: modManager.getVersion(this.getIndex()),
		};
	}

	@Override public onInitialize() {
		translation.setDebugToolsInstance(this);
	}

	/**
	 * Called when Debug Tools is loaded (in a save)
	 * - Registers the `LocationSelector` stored in `this.selector` as a hook host.
	 */
	@Override public onLoad() {
		EventManager.registerEventBusSubscriber(this.selector);
		Bind.registerHandlers(this.selector);
		this.unlockedCameraMovementHandler.begin();
	}

	/**
	 * Called when Debug Tools is unloaded (a save is exited)
	 * - Deregisters `this.selector` as a hook host.
	 * - Removes the `AddItemToInventory` UI Component.
	 */
	@Override public onUnload() {
		AddItemToInventoryComponent.init().releaseAndRemove();
		EventManager.deregisterEventBusSubscriber(this.selector);
		Bind.deregisterHandlers(this.selector);
		this.unlockedCameraMovementHandler.end();
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
		fieldOfView.disabled = (localPlayer.isGhost() && !game.getGameOptions().respawn) ? true : this.getPlayerData(localPlayer, "fog") === false;
		game.updateView(RenderSource.Mod, true);
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
	public inspect(what: Vector2 | Creature | Player | NPC) {
		gameScreen!.openDialog<InspectDialog>(DebugTools.INSTANCE.dialogInspect)
			.setInspection(what);

		this.event.emit("inspect");
	}

	/**
	 * Toggles the main dialog.
	 */
	public toggleDialog() {
		if (!this.hasPermission()) return;

		gameScreen!.toggleDialog(this.dialogMain);
	}

	public hasPermission() {
		return gameScreen
			&& (!multiplayer.isConnected() || multiplayer.isServer() || this.getPlayerData(localPlayer, "permissions"));
	}

	public toggleFog(fog: boolean) {
		this.setPlayerData(localPlayer, "fog", fog);
		this.updateFog();
	}

	public toggleLighting(lighting: boolean) {
		this.setPlayerData(localPlayer, "lighting", lighting);
		ActionExecutor.get(UpdateStatsAndAttributes).execute(localPlayer, localPlayer);
		game.updateView(RenderSource.Mod, true);
	}

	////////////////////////////////////
	// Hooks
	//

	/**
	 * When the field of view has initialized, we update the fog (enables/disables it based on the mod save data)
	 */
	@Override @HookMethod
	public postFieldOfView() {
		this.updateFog();
	}

	/**
	 * Called when the game screen becomes visible
	 * - Initializes the `AddItemToInventory` UI Component (it takes a second or two to be created, and there are multiple places in
	 * the UI that use it. We initialize it only once so the slow initialization only happens once.)
	 */
	@Override @HookMethod
	public onGameScreenVisible() {
		AddItemToInventoryComponent.init();
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
	@EventHandler(EventBus.Game, "getZoomLevel")
	public getZoomLevel() {
		if (this.data.zoomLevel === undefined || !this.hasPermission()) {
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
	@EventHandler(EventBus.Game, "getCameraPosition")
	protected getCameraPosition(_: any, position: IVector2): IVector2 | undefined {
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
	@EventHandler(EventBus.Players, "damage")
	public onPlayerDamage(player: Player, info: IDamageInfo): number | void {
		if (this.getPlayerData(player, "invulnerable"))
			return 0;
	}

	/**
	 * We prevent creatures attacking the enemy if the enemy is a player who is set as "invulnerable" or "noclipping"
	 */
	@EventHandler(Creature, "canAttack")
	protected canCreatureAttack(creature: Creature, enemy: Player | Creature): boolean | undefined {
		if (enemy.asPlayer) {
			if (this.getPlayerData(enemy.asPlayer, "invulnerable")) return false;
			if (this.getPlayerData(enemy.asPlayer, "noclip")) return false;
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
	@Override @HookMethod
	public onMove(player: Player, nextX: number, nextY: number, tile: ITile, direction: Direction): boolean | undefined {
		const noclip = this.getPlayerData(player, "noclip");
		if (!noclip) return undefined;

		player.setMoveType(MoveType.Flying);

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
	@EventHandler(EventBus.Players, "noInput")
	public onNoInputReceived(player: Player): void {
		const noclip = this.getPlayerData(player, "noclip");
		if (!noclip) return;

		noclip.moving = false;
	}

	/**
	 * Used to prevent the weight/stamina movement penalty while noclipping.
	 */
	@EventHandler(EventBus.Players, "getWeightOrStaminaMovementPenalty")
	protected getPlayerWeightOrStaminaMovementPenalty(player: Player): number | undefined {
		return this.getPlayerData(player, "noclip") ? 0 : undefined;
	}

	/**
	 * If the player is "noclipping", we return `false` (not swimming). 
	 * Otherwise we return `undefined` and let the game or other mods handle it. 
	 */
	@EventHandler(Human, "isSwimming")
	protected isHumanSwimming(human: Human, isSwimming: boolean): boolean | undefined {
		if (human.asNPC) return undefined;

		return this.getPlayerData(human as Player, "noclip") ? false : undefined;
	}

	/**
	 * We add the weight bonus from the player's save data to the existing strength.
	 */
	@EventHandler(EventBus.Players, "getMaxWeight")
	protected getPlayerMaxWeight(player: Player, weight: number) {
		return weight + this.getPlayerData(player, "weightBonus");
	}

	@Bind.onDown(Bindable.GameZoomIn)
	@Bind.onDown(Bindable.GameZoomOut)
	public onZoomIn(api: IBindHandlerApi) {
		if (!this.hasPermission() || !gameScreen?.isMouseWithin())
			return false;

		this.data.zoomLevel = this.data.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.data.zoomLevel;
		this.data.zoomLevel = api.bindable === Bindable.GameZoomIn ? Math.min(ZOOM_LEVEL_MAX + 3, ++this.data.zoomLevel) : Math.max(0, --this.data.zoomLevel);
		game.updateZoomLevel();
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableToggleCameraLock"))
	public onToggleCameraLock() {
		if (!this.hasPermission())
			return false;

		this.setCameraUnlocked(this.cameraState !== CameraState.Unlocked);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableToggleFullVisibility"))
	public onToggleFullVisibility() {
		if (!this.hasPermission())
			return false;

		const visibility = !(this.getPlayerData(localPlayer, "fog") || this.getPlayerData(localPlayer, "lighting"));
		this.toggleFog(visibility);
		this.toggleLighting(visibility);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableInspectTile"))
	public onInspectTile() {
		if (!this.hasPermission() || !gameScreen?.isMouseWithin())
			return false;

		const tile = renderer.screenToTile(...InputManager.mouse.position.xy);
		if (!tile)
			return false;

		this.inspect(tile);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableInspectLocalPlayer"))
	public onInspectLocalPlayer() {
		if (!this.hasPermission())
			return false;

		this.inspect(localPlayer);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableHealLocalPlayer"))
	public onHealLocalPlayer() {
		if (!this.hasPermission())
			return false;

		ActionExecutor.get(Heal).execute(localPlayer, localPlayer);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableTeleportLocalPlayer"))
	public onTeleportLocalPlayer(api: IBindHandlerApi) {
		if (!this.hasPermission())
			return false;

		const tile = renderer.screenToTile(...api.mouse.position.xy);
		if (!tile)
			return false;

		ActionExecutor.get(TeleportEntity).execute(localPlayer, localPlayer, { ...tile.raw(), z: localPlayer.z });
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableToggleNoClipOnLocalPlayer"))
	public onToggleNoClipOnLocalPlayer() {
		if (!this.hasPermission())
			return false;

		ActionExecutor.get(ToggleNoClip).execute(localPlayer, localPlayer, !this.getPlayerData(localPlayer, "noclip"));
		return true;
	}

	/**
	 * If lighting is disabled, we return maximum light on all channels.
	 */
	@Inject(WorldRenderer, "calculateAmbientColor", InjectionPosition.Pre)
	public getAmbientColor(api: IInjectionApi<WorldRenderer, "calculateAmbientColor">) {
		if (this.getPlayerData(localPlayer, "lighting") === false) {
			api.returnValue = Vector3.ONE.xyz;
			api.cancelled = true;
		}
	}

	/**
	 * If lighting is disabled, we return the maximum light level.
	 */
	@Inject(Game, "calculateAmbientLightLevel", InjectionPosition.Pre)
	public getAmbientLightLevel(api: IInjectionApi<Game, "calculateAmbientLightLevel">, player: Player | undefined, z: number) {
		if (player === localPlayer && this.getPlayerData(localPlayer, "lighting") === false) {
			api.returnValue = 1;
			api.cancelled = true;
		}
	}

	/**
	 * If lighting is disabled, we return the minimum light level.
	 */
	@Inject(Game, "calculateTileLightLevel", InjectionPosition.Pre)
	public getTileLightLevel(api: IInjectionApi<Game, "calculateTileLightLevel">, tile: ITile, x: number, y: number, z: number) {
		if (this.getPlayerData(localPlayer, "lighting") === false) {
			api.returnValue = 0;
			api.cancelled = true;
		}
	}

	private needsUpgrade(data?: { lastVersion?: string }) {
		if (!data) {
			return true;
		}

		const versionString = modManager.getVersion(this.getIndex());
		const lastLoadVersionString = (data && data.lastVersion) || "0.0.0";

		if (versionString === lastLoadVersionString) {
			return false;
		}

		const version = new Version(versionString);
		const lastLoadVersion = new Version(lastLoadVersionString);

		return lastLoadVersion.isOlderThan(version);
	}
}

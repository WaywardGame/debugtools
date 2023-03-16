import { EventBus } from "event/EventBuses";
import { Events, IEventEmitter } from "event/EventEmitter";
import EventManager, { EventHandler } from "event/EventManager";
import { ActionType } from "game/entity/action/IAction";
import Creature from "game/entity/creature/Creature";
import NPC from "game/entity/npc/NPC";
import { Source } from "game/entity/player/IMessageManager";
import Player from "game/entity/player/Player";
import { InspectType } from "game/inspection/IInspection";
import Island from "game/island/Island";
import { OverlayType } from "game/tile/ITerrain";
import Tile from "game/tile/Tile";
import Dictionary from "language/Dictionary";
import Message from "language/dictionary/Message";
import InterModRegistry from "mod/InterModRegistry";
import Mod from "mod/Mod";
import Register, { Registry } from "mod/ModRegistry";
import { RenderSource, UpdateRenderFlag, ZOOM_LEVEL_MAX } from "renderer/IRenderer";
import Renderer from "renderer/Renderer";
import WorldRenderer from "renderer/world/WorldRenderer";
import Bind, { IBindHandlerApi } from "ui/input/Bind";
import Bindable from "ui/input/Bindable";
import { IInput } from "ui/input/IInput";
import InputManager from "ui/input/InputManager";
import GameScreen from "ui/screen/screens/GameScreen";
import { DialogId } from "ui/screen/screens/game/Dialogs";
import { MenuBarButtonGroup, MenuBarButtonType } from "ui/screen/screens/game/static/menubar/IMenuBarButton";
import { Bound } from "utilities/Decorators";
import Log from "utilities/Log";
import { IInjectionApi, Inject, InjectionPosition } from "utilities/class/Inject";
import { IVector2 } from "utilities/math/IVector";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import Actions from "./Actions";
import { DebugToolsTranslation, IGlobalData, IPlayerData, ISaveData, ModRegistrationInspectDialogEntityInformationSubsection, ModRegistrationInspectDialogInformationSection, ModRegistrationMainDialogPanel, translation } from "./IDebugTools";
import LocationSelector from "./LocationSelector";
import UnlockedCameraMovementHandler from "./UnlockedCameraMovementHandler";
import AddItemToInventory from "./action/AddItemToInventory";
import ChangeLayer from "./action/ChangeLayer";
import ChangeTerrain from "./action/ChangeTerrain";
import ClearInventory from "./action/ClearInventory";
import Clone from "./action/Clone";
import ForceSailToCivilization from "./action/ForceSailToCivilization";
import Heal from "./action/Heal";
import Kill from "./action/Kill";
import MoveToIsland from "./action/MoveToIsland";
import Paint from "./action/Paint";
import PlaceTemplate from "./action/PlaceTemplate";
import Remove from "./action/Remove";
import RenameIsland from "./action/RenameIsland";
import SelectionExecute from "./action/SelectionExecute";
import SetDecayBulk from "./action/SetDecayBulk";
import SetDurabilityBulk from "./action/SetDurabilityBulk";
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
import MainDialog, { DebugToolsDialogPanelClass } from "./ui/DebugToolsDialog";
import InspectDialog from "./ui/InspectDialog";
import Container from "./ui/component/Container";
import DebugToolsPanel from "./ui/component/DebugToolsPanel";
import TemperatureInspection from "./ui/inspection/Temperature";
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
	public override event: IEventEmitter<this, IDebugToolsEvents>;

	////////////////////////////////////
	// Static
	//

	@Mod.instance<DebugTools>()
	public static readonly INSTANCE: DebugTools;
	@Mod.log()
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

	@Register.action("ChangeLayer", ChangeLayer)
	public readonly actionChangeLayer: ActionType;

	@Register.action("ChangeTerrain", ChangeTerrain)
	public readonly actionChangeTerrain: ActionType;

	@Register.action("ToggleTilled", ToggleTilled)
	public readonly actionToggleTilled: ActionType;

	@Register.action("UpdateStatsAndAttributes", UpdateStatsAndAttributes)
	public readonly actionUpdateStatsAndAttributes: ActionType;

	@Register.action("AddItemToInventory", AddItemToInventory)
	public readonly actionAddItemToInventory: ActionType;

	@Register.action("SetDurabilityBulk", SetDurabilityBulk)
	public readonly actionSetDurabilityBulk: ActionType;

	@Register.action("SetDecayBulk", SetDecayBulk)
	public readonly actionSetDecayBulk: ActionType;

	@Register.action("ClearInventory", ClearInventory)
	public readonly actionClearInventory: ActionType;

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

	@Register.action("MoveToIsland", MoveToIsland)
	public readonly actionMoveToIsland: ActionType;

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
		tooltip: tooltip => tooltip.schedule(tooltip => tooltip.getLastBlock().dump())
			.setText(translation(DebugToolsTranslation.DialogTitleMain)),
		onCreate: button => {
			button.toggle(DebugTools.INSTANCE.hasPermission());
			DebugTools.INSTANCE.event.until(DebugTools.INSTANCE, "unload")
				.subscribe("playerDataChange", () => button.toggle(DebugTools.INSTANCE.hasPermission()));
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

	@Mod.saveData<DebugTools>()
	public data: ISaveData;
	@Mod.globalData<DebugTools>()
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
			permissions: player.isServer(),
			fog: undefined,
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

		if (!this.hasPermission() && gameScreen) {
			gameScreen.dialogs.close(this.dialogMain);
			gameScreen.dialogs.close(this.dialogInspect);
		}
	}

	////////////////////////////////////
	// Mod Loading Cycle
	//

	/**
	 * If the data doesn't exist or the user upgraded to a new version, we reinitialize the data.
	 */
	public override initializeGlobalData(data?: IGlobalData) {
		return !this.needsUpgrade(data) ? data : {
			lastVersion: game.modManager.getVersion(this.getIndex()),
		};
	}

	/**
	 * If the data doesn't exist or the user upgraded to a new version, we reinitialize the data.
	 */
	public override initializeSaveData(data?: ISaveData) {
		return !this.needsUpgrade(data) ? data : {
			playerData: {},
			lastVersion: game.modManager.getVersion(this.getIndex()),
		};
	}

	public override onInitialize() {
		translation.setDebugToolsInstance(this);
	}

	/**
	 * Called when Debug Tools is loaded (in a save)
	 * - Registers the `LocationSelector` stored in `this.selector` as a hook host.
	 */
	public override onLoad() {
		EventManager.registerEventBusSubscriber(this.selector);
		Bind.registerHandlers(this.selector);
	}

	/**
	 * Called when Debug Tools is unloaded (a save is exited)
	 * - Deregisters `this.selector` as a hook host.
	 * - Removes the `AddItemToInventory` UI Component.
	 */
	public override onUnload() {
		Container.INSTANCE?.releaseAndRemove();
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
		if (renderer) {
			const fogForceEnabled = this.getPlayerData(localPlayer, "fog");
			if (fogForceEnabled !== undefined && renderer.fieldOfView.disabled !== !fogForceEnabled) {
				renderer.fieldOfView.disabled = !fogForceEnabled;
				localPlayer.updateView(RenderSource.Mod, UpdateRenderFlag.FieldOfView | UpdateRenderFlag.FieldOfViewSkipTransition);
			}
		}
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
	public inspect(what: Tile | Creature | Player | NPC) {
		if (!gameScreen) {
			return;
		}

		gameScreen.dialogs.open<InspectDialog>(DebugTools.INSTANCE.dialogInspect)
			.setInspection(what);

		this.event.emit("inspect");
	}

	/**
	 * Toggles the main dialog.
	 */
	public toggleDialog() {
		if (!this.hasPermission() || !gameScreen) return;

		gameScreen.dialogs.toggle(this.dialogMain);
	}

	public hasPermission() {
		return !multiplayer.isConnected() || multiplayer.isServer() || this.getPlayerData(localPlayer, "permissions");
	}

	public toggleFog(fog: boolean) {
		this.setPlayerData(localPlayer, "fog", fog);
		this.updateFog();
	}

	public toggleLighting(lighting: boolean) {
		this.setPlayerData(localPlayer, "lighting", lighting);
		UpdateStatsAndAttributes.execute(localPlayer, localPlayer);
		localPlayer.updateView(RenderSource.Mod, true);
	}

	////////////////////////////////////
	// Commands
	//

	@Register.command("DebugToolsPermission")
	public debugToolsAccessCommand(_: any, player: Player, args: string) {
		if (!this.hasPermission()) {
			return;
		}

		const targetPlayer = game.playerManager.getByName(args);
		if (targetPlayer !== undefined && !targetPlayer.isLocalPlayer()) {
			const newPermissions = !this.getPlayerData(targetPlayer, "permissions");
			TogglePermissions.execute(localPlayer, targetPlayer, newPermissions);
			DebugTools.LOG.info(`Updating permissions for ${targetPlayer.getName().toString()} to ${newPermissions}`);
		}
	}

	////////////////////////////////////
	// Event Handlers
	//

	/**
	 * When the field of view has initialized, we update the fog (enables/disables it based on the mod save data)
	 */
	@EventHandler(EventBus.Game, "postFieldOfView")
	public postFieldOfView() {
		this.updateFog();
	}

	/**
	 * Called when the game screen becomes visible
	 * - Initializes the `AddItemToInventory` UI Component (it takes a second or two to be created, and there are multiple places in
	 * the UI that use it. We initialize it only once so the slow initialization only happens once.)
	 */
	@EventHandler(GameScreen, "show")
	public onGameScreenVisible() {
		Container.init();
	}

	@EventHandler(EventBus.Game, "play")
	protected onGamePlay() {
		this.unlockedCameraMovementHandler.begin();
	}

	@EventHandler(EventBus.Game, "rendererCreated")
	protected onRendererCreated(_: any, renderer: Renderer) {
		const rendererEventsUntilDeleted = renderer.event.until(renderer, "deleted");
		rendererEventsUntilDeleted?.subscribe("getMaxZoomLevel", this.getMaxZoomLevel);
		rendererEventsUntilDeleted?.subscribe("getZoomLevel", this.getZoomLevel);
		rendererEventsUntilDeleted?.subscribe("getCameraPosition", this.getCameraPosition);
	}

	/**
	 * We allow zooming out much further than normal. To facilitate this we use this hook.
	 * Add 3 more levels
	 */
	@Bound public getMaxZoomLevel(): number | undefined {
		if (!this.hasPermission()) {
			return undefined;
		}

		return ZOOM_LEVEL_MAX + 3;
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
	@Bound public getZoomLevel(_renderer: any, zoomLevel: number) {
		if (!this.hasPermission()) {
			return undefined;
		}

		if (zoomLevel > 3) {
			return zoomLevel - 3;
		}

		return 1 / 2 ** (4 - zoomLevel);
	}

	/**
	 * - If the camera state is `Locked`, we return `undefined` — let another mod or the base game handle the camera.
	 * - If the camera state is `Transition`, we:
	 * 	- Update the transition location on the camera movement handler.
	 * 	- Check if the distance between the transition camera position and the local player (locked position) is less than half a tile.
	 * 		- If it is, we lock the camera again and return `undefined`.
	 * 		- Otherwise, we return the transition camera position.
	 */
	@Bound protected getCameraPosition(_: any, position: IVector2): IVector2 | undefined {
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

	@EventHandler(EventBus.Players, "shouldDie")
	public onPlayerDie(player: Player): false | void {
		if (this.getPlayerData(player, "invulnerable"))
			return false;
	}

	/**
	 * We add the weight bonus from the player's save data to the existing strength.
	 */
	@EventHandler(EventBus.Players, "getMaxWeight")
	protected getPlayerMaxWeight(player: Player, weight: number) {
		return weight + this.getPlayerData(player, "weightBonus");
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
		if (!this.hasPermission() || !gameScreen?.isMouseWithin() || !renderer)
			return false;

		const tile = renderer.worldRenderer.screenToTile(...InputManager.mouse.position.xy);
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

		Heal.execute(localPlayer, localPlayer);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableTeleportLocalPlayer"))
	public onTeleportLocalPlayer(api: IBindHandlerApi) {
		if (!this.hasPermission() || !renderer)
			return false;

		const tile = renderer.worldRenderer.screenToTile(...api.mouse.position.xy);
		if (!tile)
			return false;

		TeleportEntity.execute(localPlayer, localPlayer, tile.point);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableToggleNoClipOnLocalPlayer"))
	public onToggleNoClipOnLocalPlayer() {
		if (!this.hasPermission())
			return false;

		ToggleNoClip.execute(localPlayer, localPlayer);
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
	// @Inject(Renderer, "calculateAmbientLightLevel", InjectionPosition.Pre)
	// public getAmbientLightLevel(api: IInjectionApi<Renderer, "calculateAmbientLightLevel">, entity: Entity, z: number) {
	// 	if (entity === localPlayer && this.getPlayerData(localPlayer, "lighting") === false) {
	// 		api.returnValue = 1;
	// 		api.cancelled = true;
	// 	}
	// }

	/**
	 * If lighting is disabled, we return the minimum light level.
	 */
	@Inject(Island, "calculateTileLightLevel", InjectionPosition.Pre)
	public getTileLightLevel(api: IInjectionApi<Island, "calculateTileLightLevel">, tile: Tile) {
		if (this.getPlayerData(localPlayer, "lighting") === false) {
			api.returnValue = 0;
			api.cancelled = true;
		}
	}

	private needsUpgrade(data?: { lastVersion?: string }) {
		if (!data) {
			return true;
		}

		const versionString = game.modManager.getVersion(this.getIndex());
		const lastLoadVersionString = (data && data.lastVersion) || "0.0.0";

		if (versionString === lastLoadVersionString) {
			return false;
		}

		const version = new Version(versionString);
		const lastLoadVersion = new Version(lastLoadVersionString);

		return lastLoadVersion.isOlderThan(version);
	}
}

export { ModRegistrationMainDialogPanel };
export { DebugToolsPanel, DebugToolsDialogPanelClass };


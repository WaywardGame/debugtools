import { EventBus } from "@wayward/game/event/EventBuses";
import { EventHandler, eventManager } from "@wayward/game/event/EventManager";
import type Entity from "@wayward/game/game/entity/Entity";
import type { ActionType } from "@wayward/game/game/entity/action/IAction";
import type { Source } from "@wayward/game/game/entity/player/IMessageManager";
import type Player from "@wayward/game/game/entity/player/Player";
import type { InspectType } from "@wayward/game/game/inspection/IInspection";
import Island from "@wayward/game/game/island/Island";
import type { OverlayType } from "@wayward/game/game/tile/ITerrain";
import type Tile from "@wayward/game/game/tile/Tile";
import type Dictionary from "@wayward/game/language/Dictionary";
import type Message from "@wayward/game/language/dictionary/Message";
import type InterModRegistry from "@wayward/game/mod/InterModRegistry";
import Mod from "@wayward/game/mod/Mod";
import Register, { Registry } from "@wayward/game/mod/ModRegistry";
import { RenderSource, UpdateRenderFlag, ZOOM_LEVEL_MAX } from "@wayward/game/renderer/IRenderer";
import type { Renderer } from "@wayward/game/renderer/Renderer";
import { WorldRenderer } from "@wayward/game/renderer/world/WorldRenderer";
import type { IBindHandlerApi } from "@wayward/game/ui/input/Bind";
import Bind from "@wayward/game/ui/input/Bind";
import type Bindable from "@wayward/game/ui/input/Bindable";
import { IInput } from "@wayward/game/ui/input/IInput";
import InputManager from "@wayward/game/ui/input/InputManager";
import type { DialogId } from "@wayward/game/ui/screen/screens/game/Dialogs";
import ItemComponent from "@wayward/game/ui/screen/screens/game/component/ItemComponent";
import type { MenuBarButtonType } from "@wayward/game/ui/screen/screens/game/static/menubar/IMenuBarButton";
import { MenuBarButtonGroup } from "@wayward/game/ui/screen/screens/game/static/menubar/IMenuBarButton";
import Draggable from "@wayward/game/ui/util/Draggable";
import type { IVector2 } from "@wayward/game/utilities/math/IVector";
import Vector2 from "@wayward/game/utilities/math/Vector2";
import Vector3 from "@wayward/game/utilities/math/Vector3";
import { Bound } from "@wayward/utilities/Decorators";
import type Log from "@wayward/utilities/Log";
import _ from "@wayward/utilities/_";
import type { IInjectionApi } from "@wayward/utilities/class/Inject";
import { Inject, InjectionPosition } from "@wayward/utilities/class/Inject";
import type { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";
import Actions from "./Actions";
import type { IGlobalData, IPlayerData, ISaveData, ModRegistrationInspectDialogEntityInformationSubsection, ModRegistrationInspectDialogInformationSection } from "./IDebugTools";
import { DebugToolsTranslation, ModRegistrationMainDialogPanel, translation } from "./IDebugTools";
import LocationSelector from "./LocationSelector";
import UnlockedCameraMovementHandler from "./UnlockedCameraMovementHandler";
import AddItemToInventory from "./action/AddItemToInventory";
import ChangeLayer from "./action/ChangeLayer";
import ChangeTerrain from "./action/ChangeTerrain";
import ClearInventory from "./action/ClearInventory";
import ClearNotes from "./action/ClearNotes";
import Clone from "./action/Clone";
import FastForward from "./action/FastForward";
import ForceSailToCivilization from "./action/ForceSailToCivilization";
import Heal from "./action/Heal";
import Kill from "./action/Kill";
import MagicalPropertyActions from "./action/MagicalPropertyActions";
import MoveToIsland from "./action/MoveToIsland";
import Paint from "./action/Paint";
import PlaceTemplate from "./action/PlaceTemplate";
import Remove from "./action/Remove";
import RenameIsland from "./action/RenameIsland";
import ReplacePlayerData from "./action/ReplacePlayerData";
import ResetNPCSpawnInterval from "./action/ResetNPCSpawnInterval";
import SelectionExecute from "./action/SelectionExecute";
import SetDecay from "./action/SetDecay";
import SetDecayBulk from "./action/SetDecayBulk";
import SetDurability from "./action/SetDurability";
import SetDurabilityBulk from "./action/SetDurabilityBulk";
import SetGrowingStage from "./action/SetGrowingStage";
import SetPlayerData from "./action/SetPlayerData";
import SetQuality from "./action/SetQuality";
import SetQualityBulk from "./action/SetQualityBulk";
import SetSkill from "./action/SetSkill";
import SetStat from "./action/SetStat";
import SetStatMax from "./action/SetStatMax";
import SetTamed from "./action/SetTamed";
import SetTime from "./action/SetTime";
import TeleportEntity from "./action/TeleportEntity";
import ToggleAiMask from "./action/ToggleAiMask";
import ToggleAiType from "./action/ToggleAiType";
import ToggleNoClip from "./action/ToggleNoClip";
import ToggleFastMovement from "./action/ToggleFastMovement";
import ToggleTilled from "./action/ToggleTilled";
import { CreatureZoneOverlay, CreatureZoneOverlayMode } from "./overlay/CreatureZoneOverlay";
import { TemperatureOverlay, TemperatureOverlayMode } from "./overlay/TemperatureOverlay";
import AccidentalDeathHelper from "./ui/AccidentalDeathHelper";
import MainDialog, { DebugToolsDialogPanelClass } from "./ui/DebugToolsDialog";
import DebugToolsPrompts from "./ui/DebugToolsPrompts";
import InspectDialog from "./ui/InspectDialog";
import DebugToolsPanel from "./ui/component/DebugToolsPanel";
import TemperatureInspection from "./ui/inspection/Temperature";
import Version from "./util/Version";
import { RendererConstants } from "@wayward/game/renderer/RendererConstants";
import { ItemClasses } from "@wayward/game/ui/screen/screens/game/component/item/IItemComponent";

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
	declare public event: IEventEmitter<this, IDebugToolsEvents>;

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
	@Register.registry(DebugToolsPrompts)
	public readonly prompts: DebugToolsPrompts;

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
	@Register.bindable("InspectItem", IInput.mouseButton(2, "Alt"))
	public readonly bindableInspectItem: Bindable;

	@Register.bindable("HealLocalPlayer", IInput.key("KeyH", "Alt"))
	public readonly bindableHealLocalPlayer: Bindable;
	@Register.bindable("TeleportLocalPlayer", IInput.mouseButton(0, "Alt"))
	public readonly bindableTeleportLocalPlayer: Bindable;
	@Register.bindable("ToggleNoClip", IInput.key("KeyN", "Alt"))
	public readonly bindableToggleNoClipOnLocalPlayer: Bindable;
	@Register.bindable("ToggleFastMovement", IInput.key("KeyN", "Shift"))
	public readonly bindableToggleFastMovementOnLocalPlayer: Bindable;

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

	@Register.action("SetStatMax", SetStatMax)
	public readonly actionSetStatMax: ActionType;

	@Register.action("SetTamed", SetTamed)
	public readonly actionSetTamed: ActionType;

	@Register.action("Remove", Remove)
	public readonly actionRemove: ActionType;

	@Register.action("ChangeLayer", ChangeLayer)
	public readonly actionChangeLayer: ActionType;

	@Register.action("ChangeTerrain", ChangeTerrain)
	public readonly actionChangeTerrain: ActionType;

	@Register.action("ToggleTilled", ToggleTilled)
	public readonly actionToggleTilled: ActionType;

	@Register.action("AddItemToInventory", AddItemToInventory)
	public readonly actionAddItemToInventory: ActionType;

	@Register.action("SetDurability", SetDurability)
	public readonly actionSetDurability: ActionType;

	@Register.action("SetDecay", SetDecay)
	public readonly actionSetDecay: ActionType;

	@Register.action("SetQuality", SetQuality)
	public readonly actionSetQuality: ActionType;

	@Register.action("SetQualityBulk", SetQualityBulk)
	public readonly actionSetQualityBulk: ActionType;

	@Register.action("SetDurabilityBulk", SetDurabilityBulk)
	public readonly actionSetDurabilityBulk: ActionType;

	@Register.action("SetDecayBulk", SetDecayBulk)
	public readonly actionSetDecayBulk: ActionType;

	@Register.action("ClearInventory", ClearInventory)
	public readonly actionClearInventory: ActionType;

	@Register.action("Paint", Paint)
	public readonly actionPaint: ActionType;

	@Register.action("SetSkill", SetSkill)
	public readonly actionSetSkill: ActionType;

	@Register.action("SetGrowingStage", SetGrowingStage)
	public readonly actionSetGrowingStage: ActionType;

	@Register.action("ToggleNoclip", ToggleNoClip)
	public readonly actionToggleNoclip: ActionType;

	@Register.action("ToggleFastMovement", ToggleFastMovement)
	public readonly actionToggleFastMovement: ActionType;

	@Register.action("RenameIsland", RenameIsland)
	public readonly actionRenameIsland: ActionType;

	@Register.action("MoveToIsland", MoveToIsland)
	public readonly actionMoveToIsland: ActionType;

	@Register.action("ForceSailToCivilization", ForceSailToCivilization)
	public readonly actionForceSailToCivilization: ActionType;

	@Register.action("ReplacePlayerData", ReplacePlayerData)
	public readonly actionReplacePlayerData: ActionType;

	@Register.action("FastForward", FastForward)
	public readonly actionFastForward: ActionType;

	@Register.action("ClearNotes", ClearNotes)
	public readonly actionClearNotes: ActionType;

	@Register.action("SetPlayerData", SetPlayerData)
	public readonly actionSetPlayerData: ActionType;

	@Register.action("MagicalPropertyRemove", MagicalPropertyActions.Remove)
	public readonly actionMagicalPropertyRemove: ActionType;

	@Register.action("MagicalPropertyChange", MagicalPropertyActions.Change)
	public readonly actionMagicalPropertyChange: ActionType;

	@Register.action("MagicalPropertyClearAll", MagicalPropertyActions.Clear)
	public readonly actionMagicalPropertyClearAll: ActionType;

	@Register.action("ToggleAiType", ToggleAiType)
	public readonly actionToggleAiType: ActionType;

	@Register.action("ToggleAiMask", ToggleAiMask)
	public readonly actionToggleAiMask: ActionType;

	@Register.action("ResetNPCSpawnInterval", ResetNPCSpawnInterval)
	public readonly actionResetNPCSpawnInterval: ActionType;

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
	// Data Storage
	//

	@Mod.saveData<DebugTools>()
	public data: ISaveData;
	@Mod.globalData<DebugTools>()
	public globalData: IGlobalData;

	////////////////////////////////////
	// Fields
	// 

	public temperatureOverlay = new TemperatureOverlay();
	public creatureZoneOverlay = new CreatureZoneOverlay();
	public accidentalDeathHelper = new AccidentalDeathHelper();
	private cameraState = CameraState.Locked;

	/**
	 * Retruns true if the camera state is `CameraState.Unlocked`. `CameraState.Transition` is considered "locked"
	 */
	public get isCameraUnlocked(): boolean {
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
			unkillable: false,
			noRender: false,
			permissions: player.isServer,
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
	public setPlayerData<K extends keyof IPlayerData>(player: Player, key: K, value: IPlayerData[K]): void {
		this.getPlayerData(player, key); // initializes it if it doesn't exist
		this.data.playerData[player.identifier][key] = value;
		this.event.emit("playerDataChange", player.id, key, value);

		switch (key) {
			case "permissions":
				DebugTools.LOG.info(`Updating permissions for ${player.getName().toString()} to ${value}`);
				break;

			case "weightBonus":
				player.updateStrength();
				player.updateTablesAndWeight("M");

				break;

			case "lighting":
				player.updateStatsAndAttributes();

				if (player.isLocalPlayer) {
					player.updateView(RenderSource.Mod, true);
				}

				break;

			case "fog":
				if (player.isLocalPlayer) {
					this.updateFog();
				}

				break;
		}

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
	public override initializeGlobalData(data?: IGlobalData): IGlobalData | undefined {
		return !this.needsUpgrade(data) ? data : {
			lastVersion: this.mod.version,
		};
	}

	/**
	 * If the data doesn't exist or the user upgraded to a new version, we reinitialize the data.
	 */
	public override initializeSaveData(data?: ISaveData): ISaveData | undefined {
		return !this.needsUpgrade(data) ? data : {
			playerData: {},
			lastVersion: this.mod.version,
		};
	}

	public override onInitialize(): void {
		translation.setDebugToolsInstance(this);
	}

	/**
	 * Called when Debug Tools is loaded (in a save)
	 * - Registers the `LocationSelector` stored in `this.selector` as a hook host.
	 */
	public override onLoad(): void {
		eventManager.registerEventBusSubscriber(this.selector);
		Bind.registerHandlers(this.selector);
		eventManager.registerEventBusSubscriber(this.accidentalDeathHelper);
		this.temperatureOverlay.register();
		this.temperatureOverlay.hide();
		this.creatureZoneOverlay.register();
		this.creatureZoneOverlay.hide();
	}

	/**
	 * Called when Debug Tools is unloaded (a save is exited)
	 * - Deregisters `this.selector` as a hook host.
	 * - Removes the `AddItemToInventory` UI Component.
	 */
	public override onUnload(): void {
		eventManager.deregisterEventBusSubscriber(this.selector);
		Bind.deregisterHandlers(this.selector);
		this.unlockedCameraMovementHandler.end();
		this.temperatureOverlay.deregister();
		this.temperatureOverlay.setMode(TemperatureOverlayMode.None);
		this.creatureZoneOverlay.deregister();
		this.creatureZoneOverlay.setMode(CreatureZoneOverlayMode.None);
		this.accidentalDeathHelper.deregister();
	}

	/**
	 * Saves the save data for Debug Tools
	 */
	public onSave(): ISaveData {
		return this.data;
	}

	////////////////////////////////////
	// Public Methods
	//

	/**
	 * Updates the field of view based on whether it's disabled in the mod.
	 */
	public updateFog(): void {
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
	public setCameraUnlocked(unlocked: boolean): void {
		if (unlocked) {
			this.cameraState = CameraState.Unlocked;
			this.unlockedCameraMovementHandler.position = new Vector2(localPlayer)
				.add(RendererConstants.cameraPositionOffset);
			this.unlockedCameraMovementHandler.velocity = Vector2.ZERO;
			this.unlockedCameraMovementHandler.transition = undefined;
			this.unlockedCameraMovementHandler.homingVelocity = 0;

		} else {
			this.cameraState = CameraState.Transition;
			this.unlockedCameraMovementHandler.transition = new Vector2(localPlayer)
				.add(RendererConstants.cameraPositionOffset);;
		}
	}

	/**
	 * Inspects a tile, creature, player, or NPC.
	 * - Opens the `InspectDialog`.
	 * - Emits `DebugToolsEvent.Inspect`
	 */
	public inspect(what: Tile | Entity): void {
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
	public toggleDialog(): void {
		if (!this.hasPermission() || !gameScreen) {
			return;
		}

		gameScreen.dialogs.toggle(this.dialogMain);
	}

	public hasPermission(player = localPlayer): boolean | undefined {
		return player.isHost || this.getPlayerData(player, "permissions");
	}

	public toggleFog(fog: boolean): void {
		void SetPlayerData.execute(localPlayer, localPlayer, "fog", fog);
	}

	public toggleLighting(lighting: boolean): void {
		void SetPlayerData.execute(localPlayer, localPlayer, "lighting", lighting);
	}

	////////////////////////////////////
	// Commands
	//

	@Register.command("DebugToolsPermission")
	public debugToolsAccessCommand(_: any, player: Player, args: string): void {
		if (!this.hasPermission()) {
			return;
		}

		const targetPlayer = game.playerManager.getByName(args);
		if (targetPlayer !== undefined && !targetPlayer.isLocalPlayer) {
			const newPermissions = !this.getPlayerData(targetPlayer, "permissions");
			void SetPlayerData.execute(localPlayer, targetPlayer, "permissions", newPermissions);
		}
	}

	////////////////////////////////////
	// Event Handlers
	//

	/**
	 * When the field of view has initialized, we update the fog (enables/disables it based on the mod save data)
	 */
	@EventHandler(EventBus.Game, "postFieldOfView")
	public postFieldOfView(): void {
		this.updateFog();
	}

	@EventHandler(EventBus.Game, "play")
	protected onGamePlay(): void {
		this.unlockedCameraMovementHandler.begin();
		this.toggleExtraneousUI(this.data.hideExtraneousUI ?? false);
	}

	@EventHandler(EventBus.Game, "rendererCreated")
	protected onRendererCreated(_: any, renderer: Renderer): void {
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
	@Bound public getZoomLevel(_renderer: any, zoomLevel: number): number | undefined {
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
			this.unlockedCameraMovementHandler.transition = new Vector2(localPlayer)
				.add(RendererConstants.cameraPositionOffset);;
			if (Vector2.isDistanceWithin(this.unlockedCameraMovementHandler.position, localPlayer, 0.5)) {
				this.cameraState = CameraState.Locked;
				return undefined;
			}
		}

		return this.unlockedCameraMovementHandler.position;
	}

	@EventHandler(EventBus.Players, "shouldDie")
	public onPlayerDie(player: Player): false | void {
		if (this.getPlayerData(player, "unkillable")) {
			return false;
		}
	}

	@EventHandler(EventBus.Players, "shouldRender")
	public onPlayerRender(player: Player): false | void {
		if (this.getPlayerData(player, "noRender")) {
			return false;
		}
	}

	/**
	 * We add the weight bonus from the player's save data to the existing strength.
	 */
	@EventHandler(EventBus.Players, "getMaxWeight")
	protected getPlayerMaxWeight(player: Player, weight: number): number {
		return weight + this.getPlayerData(player, "weightBonus");
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableToggleCameraLock"))
	public onToggleCameraLock(): boolean {
		if (!this.hasPermission()) {
			return false;
		}

		this.setCameraUnlocked(this.cameraState !== CameraState.Unlocked);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableToggleFullVisibility"))
	public onToggleFullVisibility(): boolean {
		if (!this.hasPermission()) {
			return false;
		}

		const visibility = !(this.getPlayerData(localPlayer, "fog") || this.getPlayerData(localPlayer, "lighting"));
		this.toggleFog(visibility);
		this.toggleLighting(visibility);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableInspectTile"))
	public onInspectTile(): boolean {
		if (!this.hasPermission() || !gameScreen?.isMouseWithin || !renderer) {
			return false;
		}

		const tile = renderer.worldRenderer.screenToTile(...InputManager.mouse.position.xy);
		if (!tile) {
			return false;
		}

		this.inspect(_
			?? tile.getPlayersOnTile().first()
			?? tile.npc
			?? tile.creature
			?? tile.doodad
			?? (tile.events?.length === 1 ? tile.events.first() : undefined)
			?? tile);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableInspectItem"))
	public onInspectItem(api: IBindHandlerApi): boolean {
		const item = api.mouse.isWithin(`.${ItemClasses.Main}`)?.component?.getAs(ItemComponent)?.handler.getItem?.();
		if (!this.hasPermission() || !item) {
			return false;
		}

		this.inspect(item);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableInspectLocalPlayer"))
	public onInspectLocalPlayer(): boolean {
		if (!this.hasPermission()) {
			return false;
		}

		this.inspect(localPlayer);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableHealLocalPlayer"))
	public onHealLocalPlayer(): boolean {
		if (!this.hasPermission()) {
			return false;
		}

		void Heal.execute(localPlayer, localPlayer);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableTeleportLocalPlayer"))
	public onTeleportLocalPlayer(api: IBindHandlerApi): boolean {
		if (!this.hasPermission() || !renderer || Draggable.isDragging) {
			return false;
		}

		const tile = renderer.worldRenderer.screenToTile(...api.mouse.position.xy);
		if (!tile) {
			return false;
		}

		void TeleportEntity.execute(localPlayer, localPlayer, tile);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableToggleNoClipOnLocalPlayer"))
	public onToggleNoClipOnLocalPlayer(): boolean {
		if (!this.hasPermission()) {
			return false;
		}

		void ToggleNoClip.execute(localPlayer, localPlayer);
		return true;
	}

	@Bind.onDown(Registry<DebugTools>().get("bindableToggleFastMovementOnLocalPlayer"))
	public onToggleFastMovementOnLocalPlayer(): boolean {
		if (!this.hasPermission()) {
			return false;
		}

		void ToggleFastMovement.execute(localPlayer, localPlayer);
		return true;
	}

	/**
	 * If lighting is disabled, we return maximum light on all channels.
	 */
	@Inject(WorldRenderer, "calculateAmbientColor", InjectionPosition.Pre)
	public getAmbientColor(api: IInjectionApi<WorldRenderer, "calculateAmbientColor">): void {
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
	// 	if (entity?.asLocalPlayer && this.getPlayerData(localPlayer, "lighting") === false) {
	// 		api.returnValue = 1;
	// 		api.cancelled = true;
	// 	}
	// }

	/**
	 * If lighting is disabled, we return the minimum light level.
	 */
	@Inject(Island, "calculateTileLightLevel", InjectionPosition.Pre)
	public getTileLightLevel(api: IInjectionApi<Island, "calculateTileLightLevel">, tile: Tile): void {
		if (this.getPlayerData(localPlayer, "lighting") === false) {
			api.returnValue = 0;
			api.cancelled = true;
		}
	}

	private needsUpgrade(data?: { lastVersion?: string }): boolean {
		if (!data) {
			return true;
		}

		const versionString = this.mod.version;
		const lastLoadVersionString = (data?.lastVersion) || "0.0.0";

		if (versionString === lastLoadVersionString) {
			return false;
		}

		const version = new Version(versionString);
		const lastLoadVersion = new Version(lastLoadVersionString);

		return lastLoadVersion.isOlderThan(version);
	}

	public toggleExtraneousUI(checked: boolean): void {
		for (const placeholder of document.getElementsByClassName("game-quadrant-placeholder")) {
			placeholder.classList.toggle("debug-tools-hidden", checked);
		}

		document.getElementById("window-title-text")?.classList.toggle("debug-tools-hidden", checked);
		this.data.hideExtraneousUI = checked;
	}
}

export { DebugToolsDialogPanelClass, DebugToolsPanel, ModRegistrationMainDialogPanel };


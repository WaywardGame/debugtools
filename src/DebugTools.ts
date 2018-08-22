import { ICreature, IDamageInfo } from "creature/ICreature";
import { EntityType } from "entity/IEntity";
import { ActionType, Bindable, Delay, Direction, MoveType, OverlayType, SpriteBatchLayer } from "Enums";
import { Dictionary } from "language/ILanguage";
import Translation from "language/Translation";
import { HookMethod } from "mod/IHookHost";
import Mod from "mod/Mod";
import Register from "mod/ModRegistry";
import { BindCatcherApi, bindingManager, KeyModifier } from "newui/BindingManager";
import { ScreenId } from "newui/screen/IScreen";
import { DialogEvent } from "newui/screen/screens/game/component/Dialog";
import { DialogId } from "newui/screen/screens/game/Dialogs";
import GameScreen from "newui/screen/screens/GameScreen";
import { Source } from "player/IMessageManager";
import IPlayer from "player/IPlayer";
import { ITile } from "tile/ITerrain";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import TileHelpers from "utilities/TileHelpers";
import Actions from "./Actions";
import { DebugToolsTranslation, IPlayerData, ISaveData, ISaveDataGlobal, isSelectedTargetOverlay } from "./IDebugTools";
import LocationSelector from "./LocationSelector";
import MainDialog from "./ui/DebugToolsDialog";
import InspectDialog from "./ui/InspectDialog";
import UnlockedCameraMovementHandler from "./UnlockedCameraMovementHandler";
import Version from "./util/Version";

export function translation(id: DebugToolsTranslation) {
	return new Translation(DebugTools.INSTANCE.dictionary, id);
}

enum CameraState {
	Locked,
	Unlocked,
	Transition,
}

export enum DebugToolsEvent {
	/**
	 * @param playerId The ID of the player whose data is changing
	 * @param property The name of the property of the player's data which is changing
	 * @param newValue The new value of the changed property in the player's data
	 */
	PlayerDataChange,
}

export default class DebugTools extends Mod {

	public static INSTANCE: DebugTools;
	public static LOG: Log;

	public data: ISaveData;
	public globalData: ISaveDataGlobal;

	@Register.registry(Actions)
	public actions: Actions;

	@Register.dialog("Main", MainDialog.description, MainDialog)
	public dialogMain: DialogId;
	@Register.dialog("Inspect", InspectDialog.description, InspectDialog)
	public dialogInspect: DialogId;

	@Register.overlay("Target")
	public overlayTarget: OverlayType;

	@Register.overlay("Paint")
	public overlayPaint: OverlayType;

	@Register.bindable("ToggleDialog", { key: "Backslash" }, { key: "IntlBackslash" })
	public bindableToggleDialog: Bindable;
	@Register.bindable("InspectTile", { mouseButton: 2, modifiers: [KeyModifier.Control] })
	public bindableInspectTile: Bindable;
	@Register.bindable("ToggleCameraLock", { key: "KeyU", modifiers: [KeyModifier.Alt] })
	public bindableToggleCameraLock: Bindable;
	@Register.bindable("Paint", { mouseButton: 0 })
	public bindablePaint: Bindable;
	@Register.bindable("ErasePaint", { mouseButton: 2 })
	public bindableErasePaint: Bindable;
	@Register.bindable("ClearPaint", { key: "Backspace" })
	public bindableClearPaint: Bindable;
	@Register.bindable("CancelPaint", { key: "Escape" })
	public bindableCancelPaint: Bindable;
	@Register.bindable("CompletePaint", { key: "Enter" })
	public bindableCompletePaint: Bindable;

	@Register.dictionary("DebugTools", DebugToolsTranslation)
	public dictionary: Dictionary;

	@Register.messageSource("DebugTools")
	public source: Source;

	@Register.registry(LocationSelector)
	public selector: LocationSelector;

	private upgrade = false;
	private cameraState = CameraState.Locked;
	private inspectingTile?: ITile;

	@Register.registry(UnlockedCameraMovementHandler)
	private unlockedCameraMovementHandler: UnlockedCameraMovementHandler;

	public get isCameraUnlocked() {
		return this.cameraState === CameraState.Unlocked;
	}

	public onInitialize(saveDataGlobal: ISaveDataGlobal): any {
		DebugTools.INSTANCE = this;
		DebugTools.LOG = this.getLog();

		const version = new Version(modManager.getVersion(this.getIndex()));
		const lastLoadVersion = new Version((saveDataGlobal && saveDataGlobal.lastVersion) || "0.0.0");

		this.upgrade = !saveDataGlobal || lastLoadVersion.isOlderThan(version);

		this.globalData = !this.upgrade ? saveDataGlobal : {
			lastVersion: version.getString(),
		};
	}

	public onUninitialize(): any {
		return this.globalData;
	}

	public onLoad(saveData: ISaveData): void {
		this.data = saveData && !this.upgrade ? saveData : {
			lighting: true,
			playerData: {},
			fog: true,
		};

		hookManager.register(this.selector, "DebugTools:LocationSelector");
	}

	public onUnload() {
		hookManager.deregister(this.selector);
	}

	public onSave(): any {
		return this.data;
	}

	public updateFog() {
		fieldOfView.disabled = !this.data.fog;
		game.updateView(true);
	}

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

	public getPlayerData<K extends keyof IPlayerData>(player: IPlayer, key: K): IPlayerData[K] {
		this.data.playerData[player.identifier] = this.data.playerData[player.identifier] || {
			weightBonus: 0,
			invulnerable: false,
			noclip: false,
		};

		return this.data.playerData[player.identifier][key];
	}

	public setPlayerData<K extends keyof IPlayerData>(player: IPlayer, key: K, value: IPlayerData[K]) {
		this.getPlayerData(player, key);
		this.data.playerData[player.identifier][key] = value;
		this.triggerSync(DebugToolsEvent.PlayerDataChange, player.id, key, value);
	}

	public inspectTile(tilePosition: Vector2) {
		const tile = game.getTile(tilePosition.x, tilePosition.y, localPlayer.z);

		// remove old inspection overlay
		if (this.inspectingTile && this.inspectingTile !== tile) {
			TileHelpers.Overlay.remove(this.inspectingTile, isSelectedTargetOverlay);
		}

		// set new inspection overlay
		this.inspectingTile = tile;
		TileHelpers.Overlay.add(tile, {
			type: DebugTools.INSTANCE.overlayTarget,
			red: 0,
			blue: 0,
		}, isSelectedTargetOverlay);
		game.updateView(false);

		newui.getScreen<GameScreen>(ScreenId.Game)!
			.openDialog<InspectDialog>(DebugTools.INSTANCE.dialogInspect)
			.setInspectionTile(tilePosition)
			.on(DialogEvent.Close, () => {
				if (this.inspectingTile) {
					TileHelpers.Overlay.remove(this.inspectingTile, isSelectedTargetOverlay);
					delete this.inspectingTile;
				}

				game.updateView(false);
			});
	}

	///////////////////////////////////////////////////
	// Hooks

	@HookMethod
	public postFieldOfView() {
		this.updateFog();
	}

	@HookMethod
	public getZoomLevel() {
		if (this.data.zoomLevel === undefined) {
			return undefined;
		}

		if (this.data.zoomLevel > 3) {
			return this.data.zoomLevel - 3;
		}

		return 1 / 2 ** (4 - this.data.zoomLevel); // mathematical version of the following commented code:
		/*
		switch (this.data.zoomLevel) {
			case 0: return 0.0625;
			case 1: return 0.125;
			case 2: return 0.25;
			case 3: return 0.5;
		}
		*/
	}

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

	@HookMethod
	public onPlayerDamage(player: IPlayer, info: IDamageInfo): number | undefined {
		if (this.getPlayerData(player, "invulnerable")) return 0;
		return undefined;
	}

	@HookMethod
	public canCreatureAttack(creature: ICreature, enemy: IPlayer | ICreature): boolean | undefined {
		if (enemy.entityType === EntityType.Player) {
			if (this.getPlayerData(enemy, "invulnerable")) return false;
			if (this.getPlayerData(enemy, "noclip")) return false;
		}

		return undefined;
	}

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

		actionManager.execute(player, ActionType.UpdateDirection, { direction });

		player.isMoving = true;
		player.isMovingClientside = true;
		player.nextX = nextX;
		player.nextY = nextY;
		player.nextMoveTime = game.absoluteTime + (noclip.delay * game.interval);

		noclip.moving = true;

		game.passTurn(player);

		// disable default movement
		return false;
	}

	@HookMethod
	public onNoInputReceived(player: IPlayer): void {
		const noclip = this.getPlayerData(player, "noclip");
		if (!noclip) return;

		noclip.moving = false;
	}

	@HookMethod
	public getPlayerSpriteBatchLayer(player: IPlayer, batchLayer: SpriteBatchLayer): SpriteBatchLayer | undefined {
		return this.getPlayerData(player, "noclip") ? SpriteBatchLayer.CreatureFlying : undefined;
	}

	@HookMethod
	public isPlayerSwimming(player: IPlayer, isSwimming: boolean): boolean | undefined {
		return this.getPlayerData(player, "noclip") ? false : undefined;
	}

	@HookMethod
	public getPlayerStrength(strength: number, player: IPlayer) {
		return strength + this.getPlayerData(player, "weightBonus");
	}

	// tslint:disable cyclomatic-complexity
	@HookMethod
	public onBindLoop(bindPressed: Bindable, api: BindCatcherApi): Bindable {
		const gameScreen = newui.getScreen<GameScreen>(ScreenId.Game)!;

		if (api.wasPressed(this.bindableToggleDialog) && !bindPressed) {
			gameScreen.toggleDialog(this.dialogMain);
			bindPressed = this.bindableToggleDialog;
		}

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
			this.inspectTile(renderer.screenToTile(...bindingManager.getMouse().xy));
			bindPressed = this.bindableInspectTile;
		}

		return this.cameraState === CameraState.Locked ? bindPressed : this.unlockedCameraMovementHandler.handle(bindPressed, api);
	}
	// tslint:enable cyclomatic-complexity

	@HookMethod
	public getAmbientColor(colors: [number, number, number]) {
		if (!this.data.lighting) {
			return Vector3.ONE.xyz;
		}

		return undefined;
	}

	@HookMethod
	public getAmbientLightLevel(ambientLight: number, z: number): number | undefined {
		if (!this.data.lighting) {
			return 1;
		}

		return undefined;
	}

	@HookMethod
	public getTileLightLevel(tile: ITile, x: number, y: number, z: number): number | undefined {
		if (!this.data.lighting) {
			return 0;
		}

		return undefined;
	}

	/**
	 * Initializes the options section for Debug Tools.
	 */
	// @Register.optionsSection
	// protected initializeOptionsSection(api: UiApi, section: Component) {
	// 	section.append(new OptionsSection(api));
	// }

	////////////////////////////////////
	// Commands
	//

	@Register.command("heal")
	protected heal(player: IPlayer, args: string) {
		Actions.get("heal").execute({ entity: player });
	}
}

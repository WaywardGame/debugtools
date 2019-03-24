import { ActionType } from "entity/action/IAction";
import { ICreature, IDamageInfo } from "entity/creature/ICreature";
import IHuman from "entity/IHuman";
import { INPC } from "entity/npc/INPC";
import { Source } from "entity/player/IMessageManager";
import IPlayer from "entity/player/IPlayer";
import Game from "game/Game";
import { Dictionary } from "language/Dictionaries";
import Interrupt from "language/dictionary/Interrupt";
import InterruptChoice from "language/dictionary/InterruptChoice";
import Message from "language/dictionary/Message";
import InterModRegistry from "mod/InterModRegistry";
import Mod from "mod/Mod";
import { Bindable, BindCatcherApi } from "newui/BindingManager";
import { DialogId } from "newui/screen/screens/game/Dialogs";
import { MenuBarButtonType } from "newui/screen/screens/game/static/menubar/MenuBarButtonDescriptions";
import { SpriteBatchLayer } from "renderer/IWorldRenderer";
import WorldRenderer from "renderer/WorldRenderer";
import { ITile, OverlayType } from "tile/ITerrain";
import { IInjectionApi } from "utilities/Inject";
import Log from "utilities/Log";
import { Direction } from "utilities/math/Direction";
import { IVector2 } from "utilities/math/IVector";
import Vector2 from "utilities/math/Vector2";
import Actions from "./Actions";
import { IGlobalData, IPlayerData, ISaveData, ModRegistrationInspectDialogEntityInformationSubsection, ModRegistrationInspectDialogInformationSection, ModRegistrationMainDialogPanel } from "./IDebugTools";
import LocationSelector from "./LocationSelector";
import UnlockedCameraMovementHandler from "./UnlockedCameraMovementHandler";
export declare enum DebugToolsEvent {
    PlayerDataChange = "PlayerDataChange",
    Inspect = "Inspect",
    PermissionsChange = "PermissionsChange"
}
export default class DebugTools extends Mod {
    static readonly INSTANCE: DebugTools;
    static readonly LOG: Log;
    readonly actions: Actions;
    readonly selector: LocationSelector;
    readonly unlockedCameraMovementHandler: UnlockedCameraMovementHandler;
    readonly modRegistryMainDialogPanels: InterModRegistry<ModRegistrationMainDialogPanel>;
    readonly modRegistryInspectDialogPanels: InterModRegistry<ModRegistrationInspectDialogInformationSection>;
    readonly modRegistryInspectDialogEntityInformationSubsections: InterModRegistry<ModRegistrationInspectDialogEntityInformationSubsection>;
    readonly bindableToggleDialog: Bindable;
    readonly bindableCloseInspectDialog: Bindable;
    readonly bindableInspectTile: Bindable;
    readonly bindableInspectLocalPlayer: Bindable;
    readonly bindableHealLocalPlayer: Bindable;
    readonly bindableTeleportLocalPlayer: Bindable;
    readonly bindableToggleNoClipOnLocalPlayer: Bindable;
    readonly bindableToggleCameraLock: Bindable;
    readonly bindablePaint: Bindable;
    readonly bindableErasePaint: Bindable;
    readonly bindableClearPaint: Bindable;
    readonly bindableCancelPaint: Bindable;
    readonly bindableCompletePaint: Bindable;
    readonly dictionary: Dictionary;
    readonly messageFailureTileBlocked: Message;
    readonly source: Source;
    readonly interruptUnlockRecipes: Interrupt;
    readonly interruptTravelAway: Interrupt;
    readonly choiceSailToCivilization: InterruptChoice;
    readonly choiceTravelAway: InterruptChoice;
    readonly actionPlaceTemplate: ActionType;
    readonly actionSelectionExecute: ActionType;
    readonly actionTeleportEntity: ActionType;
    readonly actionKill: ActionType;
    readonly actionClone: ActionType;
    readonly actionSetTime: ActionType;
    readonly actionHeal: ActionType;
    readonly actionSetStat: ActionType;
    readonly actionSetTamed: ActionType;
    readonly actionRemove: ActionType;
    readonly actionSetWeightBonus: ActionType;
    readonly actionChangeTerrain: ActionType;
    readonly actionToggleTilled: ActionType;
    readonly actionUpdateStatsAndAttributes: ActionType;
    readonly actionAddItemToInventory: ActionType;
    readonly actionPaint: ActionType;
    readonly actionUnlockRecipes: ActionType;
    readonly actionToggleInvulnerable: ActionType;
    readonly actionSetSkill: ActionType;
    readonly actionSetGrowingStage: ActionType;
    readonly actionToggleNoclip: ActionType;
    readonly actionTogglePermissions: ActionType;
    readonly dialogMain: DialogId;
    readonly dialogInspect: DialogId;
    readonly menuBarButton: MenuBarButtonType;
    readonly overlayTarget: OverlayType;
    readonly overlayPaint: OverlayType;
    data: ISaveData;
    globalData: IGlobalData;
    private cameraState;
    readonly isCameraUnlocked: boolean;
    getPlayerData<K extends keyof IPlayerData>(player: IPlayer, key: K): IPlayerData[K];
    setPlayerData<K extends keyof IPlayerData>(player: IPlayer, key: K, value: IPlayerData[K]): void;
    initializeGlobalData(data?: IGlobalData): IGlobalData | undefined;
    initializeSaveData(data?: ISaveData): ISaveData | undefined;
    onLoad(): void;
    onUnload(): void;
    onSave(): any;
    updateFog(): void;
    setCameraUnlocked(unlocked: boolean): void;
    inspect(what: Vector2 | ICreature | IPlayer | INPC): void;
    toggleDialog(): void;
    hasPermission(): boolean | undefined;
    postFieldOfView(): void;
    onGameScreenVisible(): void;
    getZoomLevel(): number | undefined;
    getCameraPosition(position: IVector2): IVector2 | undefined;
    onPlayerDamage(player: IPlayer, info: IDamageInfo): number | undefined;
    canCreatureAttack(creature: ICreature, enemy: IPlayer | ICreature): boolean | undefined;
    onMove(player: IPlayer, nextX: number, nextY: number, tile: ITile, direction: Direction): boolean | undefined;
    onNoInputReceived(player: IPlayer): void;
    getPlayerWeightMovementPenalty(player: IPlayer): number | undefined;
    getPlayerSpriteBatchLayer(player: IPlayer, batchLayer: SpriteBatchLayer): SpriteBatchLayer | undefined;
    isHumanSwimming(human: IHuman, isSwimming: boolean): boolean | undefined;
    getPlayerMaxWeight(weight: number, player: IPlayer): number;
    onBindLoop(bindPressed: Bindable, api: BindCatcherApi): Bindable;
    getAmbientColor(api: IInjectionApi<WorldRenderer, "calculateAmbientColor">): void;
    getAmbientLightLevel(api: IInjectionApi<Game, "calculateAmbientLightLevel">, z: number): void;
    getTileLightLevel(api: IInjectionApi<Game, "calculateTileLightLevel">, tile: ITile, x: number, y: number, z: number): void;
    private needsUpgrade;
}

import Translation from "language/Translation";
import DebugToolsPanel from "./ui/component/DebugToolsPanel";
import InspectEntityInformationSubsection from "./ui/component/InspectEntityInformationSubsection";
import InspectInformationSection from "./ui/component/InspectInformationSection";
import { DebugToolsDialogPanelClass } from "./ui/DebugToolsDialog";
import { InspectDialogEntityInformationSubsectionClass } from "./ui/inspect/Entity";
import { InspectDialogInformationSectionClass } from "./ui/InspectDialog";
export declare const DEBUG_TOOLS_ID = "Debug Tools";
export declare const ZOOM_LEVEL_MAX: number;
export declare function translation(debugToolsTranslation: DebugToolsTranslation | Translation): Translation;
export declare enum DebugToolsTranslation {
    OptionsAutoOpen = 0,
    DialogTitleMain = 1,
    PanelGeneral = 2,
    LabelTime = 3,
    ButtonInspect = 4,
    ButtonInspectLocalPlayer = 5,
    ButtonRemoveAllCreatures = 6,
    ButtonRemoveAllNPCs = 7,
    ButtonTravelAway = 8,
    InterruptChoiceTravelAway = 9,
    ButtonAudio = 10,
    ButtonParticle = 11,
    PanelDisplay = 12,
    ButtonToggleFog = 13,
    ButtonToggleLighting = 14,
    LabelZoomLevel = 15,
    ZoomLevel = 16,
    ButtonUnlockCamera = 17,
    ButtonResetWebGL = 18,
    ButtonReloadShaders = 19,
    PanelPaint = 20,
    ButtonPaint = 21,
    PaintNoChange = 22,
    PaintRemove = 23,
    PaintRadius = 24,
    PaintRadiusTooltip = 25,
    LabelTerrain = 26,
    ButtonPaintClear = 27,
    TooltipPaintClear = 28,
    ButtonPaintComplete = 29,
    TooltipPaintComplete = 30,
    LabelCreature = 31,
    ButtonToggleAberrant = 32,
    LabelNPC = 33,
    LabelDoodad = 34,
    LabelCorpse = 35,
    ButtonReplaceExisting = 36,
    LabelTileEvent = 37,
    ResetPaintSection = 38,
    PanelSelection = 39,
    SelectionMethod = 40,
    SelectionFilter = 41,
    SelectionAction = 42,
    SelectionMatches = 43,
    SelectionAll = 44,
    MethodAll = 45,
    MethodNearest = 46,
    MethodRandom = 47,
    FilterCreatures = 48,
    FilterNPCs = 49,
    FilterTileEvents = 50,
    FilterDoodads = 51,
    FilterCorpses = 52,
    FilterPlayers = 53,
    ActionRemove = 54,
    ButtonExecute = 55,
    PanelTemplates = 56,
    LabelTemplateType = 57,
    LabelTemplate = 58,
    ButtonMirrorVertically = 59,
    ButtonMirrorHorizontally = 60,
    ButtonPlace = 61,
    LabelRotate = 62,
    RangeRotateDegrees = 63,
    LabelDegrade = 64,
    RangeDegradeAmount = 65,
    DialogTitleInspect = 66,
    InspectTileTitle = 67,
    InspectTerrain = 68,
    LabelChangeTerrain = 69,
    ButtonToggleTilled = 70,
    EntityName = 71,
    ButtonKillEntity = 72,
    ButtonHealEntity = 73,
    ButtonTeleportEntity = 74,
    ButtonCloneEntity = 75,
    KillEntityDeathMessage = 76,
    CorpseName = 77,
    ButtonResurrectCorpse = 78,
    ButtonRemoveThing = 79,
    ButtonTameCreature = 80,
    LabelWeightBonus = 81,
    LabelItem = 82,
    LabelMalignity = 83,
    LabelBenignity = 84,
    OptionTeleportSelectLocation = 85,
    OptionTeleportToLocalPlayer = 86,
    OptionTeleportToHost = 87,
    OptionTeleportToPlayer = 88,
    ButtonToggleInvulnerable = 89,
    ButtonToggleNoClip = 90,
    LabelSkill = 91,
    None = 92,
    LabelQuality = 93,
    AddToInventory = 94,
    DoodadName = 95,
    TabItemStack = 96,
    UnlockInspection = 97,
    LockInspection = 98,
    TileEventName = 99,
    ItemName = 100,
    ButtonTogglePermissions = 101,
    ButtonSetGrowthStage = 102,
    ActionResurrect = 103,
    ActionClone = 104,
    ActionTeleport = 105,
    To = 106
}
export interface ISaveData {
    lastVersion: string;
    zoomLevel?: number;
    playerData: {
        [key: string]: IPlayerData;
    };
}
export interface IPlayerData {
    weightBonus: number;
    invulnerable?: boolean;
    lighting?: boolean;
    fog?: boolean;
    noclip: false | {
        moving: boolean;
        delay: number;
    };
    permissions?: boolean;
}
export interface IGlobalData {
    lastVersion: string;
}
export declare type ModRegistrationMainDialogPanel = (cls: typeof DebugToolsPanel) => DebugToolsDialogPanelClass;
export declare type ModRegistrationInspectDialogInformationSection = (cls: typeof InspectInformationSection) => InspectDialogInformationSectionClass;
export declare type ModRegistrationInspectDialogEntityInformationSubsection = (cls: typeof InspectEntityInformationSubsection) => InspectDialogEntityInformationSubsectionClass;

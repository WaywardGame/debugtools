import Translation from "language/Translation";
import DebugToolsPanel from "./ui/component/DebugToolsPanel";
import InspectEntityInformationSubsection from "./ui/component/InspectEntityInformationSubsection";
import InspectInformationSection from "./ui/component/InspectInformationSection";
import { DebugToolsDialogPanelClass } from "./ui/DebugToolsDialog";
import { InspectDialogEntityInformationSubsectionClass } from "./ui/inspect/Entity";
import { InspectDialogInformationSectionClass } from "./ui/InspectDialog";
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
    LabelTerrain = 24,
    ButtonPaintClear = 25,
    TooltipPaintClear = 26,
    ButtonPaintComplete = 27,
    TooltipPaintComplete = 28,
    LabelCreature = 29,
    ButtonToggleAberrant = 30,
    LabelNPC = 31,
    LabelDoodad = 32,
    LabelCorpse = 33,
    ButtonReplaceExisting = 34,
    LabelTileEvent = 35,
    ResetPaintSection = 36,
    PanelSelection = 37,
    SelectionMethod = 38,
    SelectionFilter = 39,
    SelectionAction = 40,
    SelectionMatches = 41,
    SelectionAll = 42,
    MethodAll = 43,
    MethodNearest = 44,
    MethodRandom = 45,
    FilterCreatures = 46,
    FilterNPCs = 47,
    FilterTileEvents = 48,
    FilterDoodads = 49,
    FilterCorpses = 50,
    FilterPlayers = 51,
    ActionRemove = 52,
    ButtonExecute = 53,
    PanelTemplates = 54,
    LabelTemplateType = 55,
    LabelTemplate = 56,
    ButtonMirrorVertically = 57,
    ButtonMirrorHorizontally = 58,
    ButtonPlace = 59,
    LabelRotate = 60,
    RangeRotateDegrees = 61,
    LabelDegrade = 62,
    RangeDegradeAmount = 63,
    DialogTitleInspect = 64,
    InspectTileTitle = 65,
    InspectTerrain = 66,
    LabelChangeTerrain = 67,
    ButtonToggleTilled = 68,
    EntityName = 69,
    ButtonKillEntity = 70,
    ButtonHealEntity = 71,
    ButtonTeleportEntity = 72,
    ButtonCloneEntity = 73,
    KillEntityDeathMessage = 74,
    CorpseName = 75,
    ButtonResurrectCorpse = 76,
    ButtonRemoveThing = 77,
    ButtonTameCreature = 78,
    LabelWeightBonus = 79,
    LabelItem = 80,
    LabelMalignity = 81,
    LabelBenignity = 82,
    OptionTeleportSelectLocation = 83,
    OptionTeleportToLocalPlayer = 84,
    OptionTeleportToHost = 85,
    OptionTeleportToPlayer = 86,
    ButtonToggleInvulnerable = 87,
    ButtonToggleNoClip = 88,
    LabelSkill = 89,
    None = 90,
    LabelQuality = 91,
    AddToInventory = 92,
    DoodadName = 93,
    TabItemStack = 94,
    UnlockInspection = 95,
    LockInspection = 96,
    TileEventName = 97,
    ItemName = 98,
    ButtonTogglePermissions = 99,
    ButtonSetGrowthStage = 100,
    ActionResurrect = 101,
    ActionClone = 102,
    ActionTeleport = 103,
    ActionTeleportTo = 104
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
export declare const DEBUG_TOOLS_ID = "Debug Tools";
export declare function translation(debugToolsTranslation: DebugToolsTranslation | Translation): Translation;

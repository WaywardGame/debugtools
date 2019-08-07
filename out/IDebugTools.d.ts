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
    MethodAll = 42,
    MethodNearest = 43,
    MethodRandom = 44,
    FilterCreatures = 45,
    FilterNPCs = 46,
    FilterTileEvents = 47,
    ActionRemove = 48,
    ButtonExecute = 49,
    PanelTemplates = 50,
    LabelTemplateType = 51,
    LabelTemplate = 52,
    ButtonMirrorVertically = 53,
    ButtonMirrorHorizontally = 54,
    ButtonPlace = 55,
    LabelRotate = 56,
    RangeRotateDegrees = 57,
    LabelDegrade = 58,
    RangeDegradeAmount = 59,
    DialogTitleInspect = 60,
    InspectTileTitle = 61,
    InspectTerrain = 62,
    LabelChangeTerrain = 63,
    ButtonToggleTilled = 64,
    EntityName = 65,
    ButtonKillEntity = 66,
    ButtonHealEntity = 67,
    ButtonTeleportEntity = 68,
    ButtonCloneEntity = 69,
    KillEntityDeathMessage = 70,
    CorpseName = 71,
    ButtonResurrectCorpse = 72,
    ButtonRemoveThing = 73,
    ButtonTameCreature = 74,
    LabelWeightBonus = 75,
    LabelItem = 76,
    LabelMalignity = 77,
    LabelBenignity = 78,
    OptionTeleportSelectLocation = 79,
    OptionTeleportToLocalPlayer = 80,
    OptionTeleportToHost = 81,
    OptionTeleportToPlayer = 82,
    ButtonToggleInvulnerable = 83,
    ButtonToggleNoClip = 84,
    LabelSkill = 85,
    None = 86,
    LabelQuality = 87,
    AddToInventory = 88,
    DoodadName = 89,
    TabItemStack = 90,
    UnlockInspection = 91,
    LockInspection = 92,
    TileEventName = 93,
    ItemName = 94,
    ButtonTogglePermissions = 95,
    ButtonSetGrowthStage = 96,
    ActionResurrect = 97,
    ActionClone = 98,
    ActionTeleport = 99
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

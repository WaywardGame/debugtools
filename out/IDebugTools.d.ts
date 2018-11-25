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
    ButtonUnlockRecipes = 6,
    InterruptConfirmationUnlockRecipes = 7,
    InterruptConfirmationUnlockRecipesDescription = 8,
    ButtonRemoveAllCreatures = 9,
    ButtonRemoveAllNPCs = 10,
    ButtonTravelAway = 11,
    InterruptChoiceTravelAway = 12,
    ButtonAudio = 13,
    ButtonParticle = 14,
    PanelDisplay = 15,
    ButtonToggleFog = 16,
    ButtonToggleLighting = 17,
    LabelZoomLevel = 18,
    ZoomLevel = 19,
    ButtonUnlockCamera = 20,
    ButtonResetWebGL = 21,
    ButtonReloadShaders = 22,
    PanelPaint = 23,
    ButtonPaint = 24,
    PaintNoChange = 25,
    PaintRemove = 26,
    LabelTerrain = 27,
    ButtonPaintClear = 28,
    TooltipPaintClear = 29,
    ButtonPaintComplete = 30,
    TooltipPaintComplete = 31,
    LabelCreature = 32,
    ButtonToggleAberrant = 33,
    LabelNPC = 34,
    LabelDoodad = 35,
    LabelCorpse = 36,
    ButtonReplaceExisting = 37,
    LabelTileEvent = 38,
    ResetPaintSection = 39,
    PanelSelection = 40,
    SelectionMethod = 41,
    SelectionFilter = 42,
    SelectionAction = 43,
    SelectionMatches = 44,
    MethodAll = 45,
    MethodNearest = 46,
    MethodRandom = 47,
    FilterCreatures = 48,
    FilterNPCs = 49,
    FilterTileEvents = 50,
    ActionRemove = 51,
    ButtonExecute = 52,
    PanelTemplates = 53,
    LabelTemplateType = 54,
    LabelTemplate = 55,
    ButtonMirrorVertically = 56,
    ButtonMirrorHorizontally = 57,
    ButtonPlace = 58,
    LabelRotate = 59,
    RangeRotateDegrees = 60,
    LabelDegrade = 61,
    RangeDegradeAmount = 62,
    DialogTitleInspect = 63,
    InspectTileTitle = 64,
    InspectTerrain = 65,
    LabelChangeTerrain = 66,
    ButtonToggleTilled = 67,
    EntityName = 68,
    ButtonKillEntity = 69,
    ButtonHealEntity = 70,
    ButtonTeleportEntity = 71,
    ButtonCloneEntity = 72,
    KillEntityDeathMessage = 73,
    CorpseName = 74,
    ButtonResurrectCorpse = 75,
    ButtonRemoveThing = 76,
    ButtonTameCreature = 77,
    LabelWeightBonus = 78,
    LabelItem = 79,
    LabelMalignity = 80,
    LabelBenignity = 81,
    OptionTeleportSelectLocation = 82,
    OptionTeleportToLocalPlayer = 83,
    OptionTeleportToHost = 84,
    OptionTeleportToPlayer = 85,
    ButtonToggleInvulnerable = 86,
    ButtonToggleNoClip = 87,
    LabelSkill = 88,
    None = 89,
    LabelQuality = 90,
    AddToInventory = 91,
    DoodadName = 92,
    TabItemStack = 93,
    UnlockInspection = 94,
    LockInspection = 95,
    TileEventName = 96,
    ItemName = 97,
    ButtonTogglePermissions = 98,
    ButtonSetGrowthStage = 99,
    ActionResurrect = 100,
    ActionClone = 101,
    ActionTeleport = 102
}
export interface ISaveData {
    lastVersion: string;
    lighting: boolean;
    fog: boolean;
    zoomLevel?: number;
    playerData: {
        [key: string]: IPlayerData;
    };
}
export interface IPlayerData {
    invulnerable: boolean;
    noclip: false | {
        moving: boolean;
        delay: number;
    };
    permissions?: boolean;
}
export interface ISaveDataGlobal {
    lastVersion: string;
}
export declare type ModRegistrationMainDialogPanel = (cls: typeof DebugToolsPanel) => DebugToolsDialogPanelClass;
export declare type ModRegistrationInspectDialogInformationSection = (cls: typeof InspectInformationSection) => InspectDialogInformationSectionClass;
export declare type ModRegistrationInspectDialogEntityInformationSubsection = (cls: typeof InspectEntityInformationSubsection) => InspectDialogEntityInformationSubsectionClass;
export declare const DEBUG_TOOLS_ID = "Debug Tools";
export declare function translation(debugToolsTranslation: DebugToolsTranslation | Translation): Translation;

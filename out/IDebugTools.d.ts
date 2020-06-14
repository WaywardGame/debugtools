import Translation from "language/Translation";
import { RenderLayerFlag } from "renderer/IWorldRenderer";
import type DebugTools from "./DebugTools";
import type DebugToolsPanel from "./ui/component/DebugToolsPanel";
import type InspectEntityInformationSubsection from "./ui/component/InspectEntityInformationSubsection";
import type InspectInformationSection from "./ui/component/InspectInformationSection";
import type { DebugToolsDialogPanelClass } from "./ui/DebugToolsDialog";
import type { InspectDialogEntityInformationSubsectionClass } from "./ui/inspect/Entity";
import type { InspectDialogInformationSectionClass } from "./ui/InspectDialog";
export declare const DEBUG_TOOLS_ID = "Debug Tools";
export declare const ZOOM_LEVEL_MAX: number;
export declare function translation(debugToolsTranslation: DebugToolsTranslation | Translation): Translation;
export declare module translation {
    function setDebugToolsInstance(instance: DebugTools): void;
}
export declare enum DebugToolsTranslation {
    OptionsAutoOpen = 0,
    DialogTitleMain = 1,
    PanelGeneral = 2,
    LabelTime = 3,
    ButtonInspect = 4,
    ButtonInspectLocalPlayer = 5,
    ButtonRemoveAllCreatures = 6,
    ButtonRemoveAllNPCs = 7,
    ButtonAudio = 8,
    ButtonParticle = 9,
    LabelLayer = 10,
    OptionLayer = 11,
    HeadingIslandCurrent = 12,
    Island = 13,
    LabelTravel = 14,
    OptionTravelNewIsland = 15,
    OptionTravelCivilization = 16,
    OptionTravelRandomIsland = 17,
    ButtonTravel = 18,
    PanelDisplay = 19,
    ButtonToggleFog = 20,
    ButtonToggleLighting = 21,
    LabelZoomLevel = 22,
    ZoomLevel = 23,
    ButtonUnlockCamera = 24,
    ButtonResetWebGL = 25,
    ButtonReloadShaders = 26,
    HeadingLayers = 27,
    ButtonToggleLayer = 28,
    PanelPaint = 29,
    ButtonPaint = 30,
    PaintNoChange = 31,
    PaintRemove = 32,
    PaintRadius = 33,
    PaintRadiusTooltip = 34,
    LabelTerrain = 35,
    ButtonPaintClear = 36,
    TooltipPaintClear = 37,
    ButtonPaintComplete = 38,
    TooltipPaintComplete = 39,
    LabelCreature = 40,
    ButtonToggleAberrant = 41,
    LabelNPC = 42,
    LabelDoodad = 43,
    LabelCorpse = 44,
    ButtonReplaceExisting = 45,
    LabelTileEvent = 46,
    ResetPaintSection = 47,
    PanelSelection = 48,
    SelectionMethod = 49,
    SelectionFilter = 50,
    SelectionAction = 51,
    SelectionMatches = 52,
    SelectionAll = 53,
    MethodAll = 54,
    MethodNearest = 55,
    MethodRandom = 56,
    FilterCreatures = 57,
    FilterNPCs = 58,
    FilterTileEvents = 59,
    FilterDoodads = 60,
    FilterCorpses = 61,
    FilterPlayers = 62,
    ActionRemove = 63,
    ButtonExecute = 64,
    PanelTemplates = 65,
    LabelTemplateType = 66,
    LabelTemplate = 67,
    ButtonMirrorVertically = 68,
    ButtonMirrorHorizontally = 69,
    ButtonPlace = 70,
    LabelRotate = 71,
    RangeRotateDegrees = 72,
    LabelDegrade = 73,
    RangeDegradeAmount = 74,
    DialogTitleInspect = 75,
    InspectTileTitle = 76,
    InspectTerrain = 77,
    LabelChangeTerrain = 78,
    ButtonToggleTilled = 79,
    ButtonIncludeNeighbors = 80,
    ButtonRefreshTile = 81,
    EntityName = 82,
    ButtonKillEntity = 83,
    ButtonHealEntity = 84,
    ButtonTeleportEntity = 85,
    ButtonHealLocalPlayer = 86,
    ButtonTeleportLocalPlayer = 87,
    ButtonCloneEntity = 88,
    KillEntityDeathMessage = 89,
    CorpseName = 90,
    ButtonResurrectCorpse = 91,
    ButtonRemoveThing = 92,
    ButtonTameCreature = 93,
    LabelWeightBonus = 94,
    LabelItem = 95,
    LabelMalignity = 96,
    LabelBenignity = 97,
    OptionTeleportSelectLocation = 98,
    OptionTeleportToLocalPlayer = 99,
    OptionTeleportToHost = 100,
    OptionTeleportToPlayer = 101,
    ButtonToggleInvulnerable = 102,
    ButtonToggleNoClip = 103,
    LabelSkill = 104,
    None = 105,
    LabelQuality = 106,
    AddToInventory = 107,
    DoodadName = 108,
    TabItemStack = 109,
    UnlockInspection = 110,
    LockInspection = 111,
    TileEventName = 112,
    ItemName = 113,
    ButtonTogglePermissions = 114,
    ButtonSetGrowthStage = 115,
    InspectionTemperatureCalculated = 116,
    InspectionTemperatureCalculatedHeat = 117,
    InspectionTemperatureCalculatedCold = 118,
    InspectionTemperatureProducedHeat = 119,
    InspectionTemperatureProducedCold = 120,
    ActionResurrect = 121,
    ActionClone = 122,
    ActionTeleport = 123,
    To = 124
}
export interface ISaveData {
    lastVersion: string;
    zoomLevel?: number;
    playerData: {
        [key: string]: IPlayerData;
    };
    renderLayerFlags?: RenderLayerFlag;
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

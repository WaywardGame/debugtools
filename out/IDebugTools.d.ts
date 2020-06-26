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
    ButtonReloadUIImages = 27,
    HeadingLayers = 28,
    ButtonToggleLayer = 29,
    PanelPaint = 30,
    ButtonPaint = 31,
    PaintNoChange = 32,
    PaintRemove = 33,
    PaintRadius = 34,
    PaintRadiusTooltip = 35,
    LabelTerrain = 36,
    ButtonPaintClear = 37,
    TooltipPaintClear = 38,
    ButtonPaintComplete = 39,
    TooltipPaintComplete = 40,
    LabelCreature = 41,
    ButtonToggleAberrant = 42,
    LabelNPC = 43,
    LabelDoodad = 44,
    LabelCorpse = 45,
    ButtonReplaceExisting = 46,
    LabelTileEvent = 47,
    ResetPaintSection = 48,
    PanelSelection = 49,
    SelectionMethod = 50,
    SelectionFilter = 51,
    SelectionAction = 52,
    SelectionMatches = 53,
    SelectionAll = 54,
    MethodAll = 55,
    MethodNearest = 56,
    MethodRandom = 57,
    FilterCreatures = 58,
    FilterNPCs = 59,
    FilterTileEvents = 60,
    FilterDoodads = 61,
    FilterCorpses = 62,
    FilterPlayers = 63,
    ActionRemove = 64,
    ButtonExecute = 65,
    PanelTemplates = 66,
    LabelTemplateType = 67,
    LabelTemplate = 68,
    ButtonMirrorVertically = 69,
    ButtonMirrorHorizontally = 70,
    ButtonPlace = 71,
    LabelRotate = 72,
    RangeRotateDegrees = 73,
    LabelDegrade = 74,
    RangeDegradeAmount = 75,
    DialogTitleInspect = 76,
    InspectTileTitle = 77,
    InspectTerrain = 78,
    LabelChangeTerrain = 79,
    ButtonToggleTilled = 80,
    ButtonIncludeNeighbors = 81,
    ButtonRefreshTile = 82,
    EntityName = 83,
    ButtonKillEntity = 84,
    ButtonHealEntity = 85,
    ButtonTeleportEntity = 86,
    ButtonHealLocalPlayer = 87,
    ButtonTeleportLocalPlayer = 88,
    ButtonCloneEntity = 89,
    KillEntityDeathMessage = 90,
    CorpseName = 91,
    ButtonResurrectCorpse = 92,
    ButtonRemoveThing = 93,
    ButtonTameCreature = 94,
    LabelWeightBonus = 95,
    LabelItem = 96,
    LabelMalignity = 97,
    LabelBenignity = 98,
    OptionTeleportSelectLocation = 99,
    OptionTeleportToLocalPlayer = 100,
    OptionTeleportToHost = 101,
    OptionTeleportToPlayer = 102,
    ButtonToggleInvulnerable = 103,
    ButtonToggleNoClip = 104,
    LabelSkill = 105,
    None = 106,
    LabelQuality = 107,
    AddToInventory = 108,
    DoodadName = 109,
    TabItemStack = 110,
    UnlockInspection = 111,
    LockInspection = 112,
    TileEventName = 113,
    ItemName = 114,
    ButtonTogglePermissions = 115,
    ButtonSetGrowthStage = 116,
    InspectionTemperatureCalculated = 117,
    InspectionTemperatureCalculatedHeat = 118,
    InspectionTemperatureCalculatedCold = 119,
    InspectionTemperatureProducedHeat = 120,
    InspectionTemperatureProducedCold = 121,
    ActionResurrect = 122,
    ActionClone = 123,
    ActionTeleport = 124,
    To = 125
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

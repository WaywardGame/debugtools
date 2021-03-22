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
    ActionSelect = 65,
    ButtonExecute = 66,
    SelectionCount = 67,
    LabelSelectionCount = 68,
    SelectionFilterNamed = 69,
    SelectionFilterAll = 70,
    SelectionAllPlayers = 71,
    PanelTemplates = 72,
    LabelTemplateType = 73,
    LabelTemplate = 74,
    ButtonMirrorVertically = 75,
    ButtonMirrorHorizontally = 76,
    ButtonOverlap = 77,
    ButtonPlace = 78,
    LabelRotate = 79,
    RangeRotateDegrees = 80,
    LabelDegrade = 81,
    RangeDegradeAmount = 82,
    DialogTitleInspect = 83,
    InspectTileTitle = 84,
    InspectTerrain = 85,
    LabelChangeTerrain = 86,
    ButtonToggleTilled = 87,
    ButtonIncludeNeighbors = 88,
    ButtonRefreshTile = 89,
    EntityName = 90,
    ButtonKillEntity = 91,
    ButtonHealEntity = 92,
    ButtonTeleportEntity = 93,
    ButtonHealLocalPlayer = 94,
    ButtonTeleportLocalPlayer = 95,
    ButtonCloneEntity = 96,
    KillEntityDeathMessage = 97,
    CorpseName = 98,
    ButtonResurrectCorpse = 99,
    ButtonRemoveThing = 100,
    ButtonTameCreature = 101,
    LabelWeightBonus = 102,
    LabelItem = 103,
    LabelMalignity = 104,
    LabelBenignity = 105,
    OptionTeleportSelectLocation = 106,
    OptionTeleportToLocalPlayer = 107,
    OptionTeleportToHost = 108,
    OptionTeleportToPlayer = 109,
    ButtonToggleInvulnerable = 110,
    ButtonToggleNoClip = 111,
    LabelSkill = 112,
    None = 113,
    LabelQuality = 114,
    AddToInventory = 115,
    DoodadName = 116,
    TabItemStack = 117,
    UnlockInspection = 118,
    LockInspection = 119,
    TileEventName = 120,
    ItemName = 121,
    ButtonTogglePermissions = 122,
    ButtonSetGrowthStage = 123,
    InspectionTemperature = 124,
    InspectionTemperatureBiome = 125,
    InspectionTemperatureTimeModifier = 126,
    InspectionTemperatureLayerModifier = 127,
    InspectionTemperatureTileCalculated = 128,
    InspectionTemperatureTileCalculatedHeat = 129,
    InspectionTemperatureTileCalculatedCold = 130,
    InspectionTemperatureTileProducedHeat = 131,
    InspectionTemperatureTileProducedCold = 132,
    ActionResurrect = 133,
    ActionClone = 134,
    ActionTeleport = 135,
    To = 136
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

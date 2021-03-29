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
    ButtonRefreshTiles = 26,
    ButtonReloadShaders = 27,
    ButtonReloadUIImages = 28,
    HeadingLayers = 29,
    ButtonToggleLayer = 30,
    PanelPaint = 31,
    ButtonPaint = 32,
    PaintNoChange = 33,
    PaintRemove = 34,
    PaintRadius = 35,
    PaintRadiusTooltip = 36,
    LabelTerrain = 37,
    ButtonPaintClear = 38,
    TooltipPaintClear = 39,
    ButtonPaintComplete = 40,
    TooltipPaintComplete = 41,
    LabelCreature = 42,
    ButtonToggleAberrant = 43,
    LabelNPC = 44,
    LabelDoodad = 45,
    LabelCorpse = 46,
    ButtonReplaceExisting = 47,
    LabelTileEvent = 48,
    ResetPaintSection = 49,
    PanelSelection = 50,
    SelectionMethod = 51,
    SelectionFilter = 52,
    SelectionAction = 53,
    SelectionMatches = 54,
    SelectionAll = 55,
    MethodAll = 56,
    MethodNearest = 57,
    MethodRandom = 58,
    FilterCreatures = 59,
    FilterNPCs = 60,
    FilterTileEvents = 61,
    FilterDoodads = 62,
    FilterCorpses = 63,
    FilterPlayers = 64,
    ActionRemove = 65,
    ActionSelect = 66,
    ButtonExecute = 67,
    SelectionCount = 68,
    LabelSelectionCount = 69,
    SelectionFilterNamed = 70,
    SelectionFilterAll = 71,
    SelectionAllPlayers = 72,
    PanelTemplates = 73,
    LabelTemplateType = 74,
    LabelTemplate = 75,
    ButtonMirrorVertically = 76,
    ButtonMirrorHorizontally = 77,
    ButtonOverlap = 78,
    ButtonPlace = 79,
    LabelRotate = 80,
    RangeRotateDegrees = 81,
    LabelDegrade = 82,
    RangeDegradeAmount = 83,
    DialogTitleInspect = 84,
    InspectTileTitle = 85,
    InspectTerrain = 86,
    LabelChangeTerrain = 87,
    ButtonToggleTilled = 88,
    ButtonIncludeNeighbors = 89,
    ButtonRefreshTile = 90,
    EntityName = 91,
    ButtonKillEntity = 92,
    ButtonHealEntity = 93,
    ButtonTeleportEntity = 94,
    ButtonHealLocalPlayer = 95,
    ButtonTeleportLocalPlayer = 96,
    ButtonCloneEntity = 97,
    KillEntityDeathMessage = 98,
    CorpseName = 99,
    ButtonResurrectCorpse = 100,
    ButtonRemoveThing = 101,
    ButtonTameCreature = 102,
    LabelWeightBonus = 103,
    LabelItem = 104,
    LabelMalignity = 105,
    LabelBenignity = 106,
    OptionTeleportSelectLocation = 107,
    OptionTeleportToLocalPlayer = 108,
    OptionTeleportToHost = 109,
    OptionTeleportToPlayer = 110,
    ButtonToggleInvulnerable = 111,
    ButtonToggleNoClip = 112,
    LabelSkill = 113,
    None = 114,
    LabelQuality = 115,
    AddToInventory = 116,
    DoodadName = 117,
    TabItemStack = 118,
    UnlockInspection = 119,
    LockInspection = 120,
    TileEventName = 121,
    ItemName = 122,
    ButtonTogglePermissions = 123,
    ButtonSetGrowthStage = 124,
    InspectionTemperature = 125,
    InspectionTemperatureBiome = 126,
    InspectionTemperatureTimeModifier = 127,
    InspectionTemperatureLayerModifier = 128,
    InspectionTemperatureTileCalculated = 129,
    InspectionTemperatureTileCalculatedHeat = 130,
    InspectionTemperatureTileCalculatedCold = 131,
    InspectionTemperatureTileProducedHeat = 132,
    InspectionTemperatureTileProducedCold = 133,
    ActionResurrect = 134,
    ActionClone = 135,
    ActionTeleport = 136,
    To = 137
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

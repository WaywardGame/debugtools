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
    ButtonPlace = 77,
    LabelRotate = 78,
    RangeRotateDegrees = 79,
    LabelDegrade = 80,
    RangeDegradeAmount = 81,
    DialogTitleInspect = 82,
    InspectTileTitle = 83,
    InspectTerrain = 84,
    LabelChangeTerrain = 85,
    ButtonToggleTilled = 86,
    ButtonIncludeNeighbors = 87,
    ButtonRefreshTile = 88,
    EntityName = 89,
    ButtonKillEntity = 90,
    ButtonHealEntity = 91,
    ButtonTeleportEntity = 92,
    ButtonHealLocalPlayer = 93,
    ButtonTeleportLocalPlayer = 94,
    ButtonCloneEntity = 95,
    KillEntityDeathMessage = 96,
    CorpseName = 97,
    ButtonResurrectCorpse = 98,
    ButtonRemoveThing = 99,
    ButtonTameCreature = 100,
    LabelWeightBonus = 101,
    LabelItem = 102,
    LabelMalignity = 103,
    LabelBenignity = 104,
    OptionTeleportSelectLocation = 105,
    OptionTeleportToLocalPlayer = 106,
    OptionTeleportToHost = 107,
    OptionTeleportToPlayer = 108,
    ButtonToggleInvulnerable = 109,
    ButtonToggleNoClip = 110,
    LabelSkill = 111,
    None = 112,
    LabelQuality = 113,
    AddToInventory = 114,
    DoodadName = 115,
    TabItemStack = 116,
    UnlockInspection = 117,
    LockInspection = 118,
    TileEventName = 119,
    ItemName = 120,
    ButtonTogglePermissions = 121,
    ButtonSetGrowthStage = 122,
    InspectionTemperature = 123,
    InspectionTemperatureBiome = 124,
    InspectionTemperatureTimeModifier = 125,
    InspectionTemperatureLayerModifier = 126,
    InspectionTemperatureTileCalculated = 127,
    InspectionTemperatureTileCalculatedHeat = 128,
    InspectionTemperatureTileCalculatedCold = 129,
    InspectionTemperatureTileProducedHeat = 130,
    InspectionTemperatureTileProducedCold = 131,
    ActionResurrect = 132,
    ActionClone = 133,
    ActionTeleport = 134,
    To = 135
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

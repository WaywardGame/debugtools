import Translation from "language/Translation";
import { RenderLayerFlag } from "renderer/world/IWorldRenderer";
import type DebugTools from "./DebugTools";
import type { DebugToolsDialogPanelClass } from "./ui/DebugToolsDialog";
import type { InspectDialogInformationSectionClass } from "./ui/InspectDialog";
import type DebugToolsPanel from "./ui/component/DebugToolsPanel";
import type InspectEntityInformationSubsection from "./ui/component/InspectEntityInformationSubsection";
import type InspectInformationSection from "./ui/component/InspectInformationSection";
import type { InspectDialogEntityInformationSubsectionClass } from "./ui/inspect/Entity";
export declare const DEBUG_TOOLS_ID = "Debug Tools";
export declare function translation(debugToolsTranslation: DebugToolsTranslation | Translation): import("../node_modules/@wayward/types/definitions/game/language/impl/TranslationImpl").default;
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
    ButtonToggleTemperature = 22,
    LabelZoomLevel = 23,
    ZoomLevel = 24,
    ButtonUnlockCamera = 25,
    ButtonResetRenderer = 26,
    ButtonRefreshTiles = 27,
    ButtonReloadShaders = 28,
    ButtonReloadUIImages = 29,
    HeadingLayers = 30,
    ButtonToggleLayer = 31,
    PanelPaint = 32,
    ButtonPaint = 33,
    PaintNoChange = 34,
    PaintRemove = 35,
    PaintRadius = 36,
    PaintRadiusTooltip = 37,
    LabelTerrain = 38,
    ButtonPaintClear = 39,
    TooltipPaintClear = 40,
    ButtonPaintComplete = 41,
    TooltipPaintComplete = 42,
    LabelCreature = 43,
    ButtonToggleAberrant = 44,
    LabelNPC = 45,
    LabelDoodad = 46,
    LabelCorpse = 47,
    ButtonReplaceExisting = 48,
    LabelTileEvent = 49,
    ResetPaintSection = 50,
    PanelSelection = 51,
    SelectionMethod = 52,
    SelectionFilter = 53,
    SelectionAction = 54,
    SelectionMatches = 55,
    SelectionAll = 56,
    MethodAll = 57,
    MethodNearest = 58,
    MethodRandom = 59,
    FilterCreatures = 60,
    FilterNPCs = 61,
    FilterTileEvents = 62,
    FilterDoodads = 63,
    FilterCorpses = 64,
    FilterPlayers = 65,
    ActionRemove = 66,
    ActionSelect = 67,
    ButtonExecute = 68,
    SelectionPreview = 69,
    LabelSelectionPreview = 70,
    SelectionFilterNamed = 71,
    SelectionFilterAll = 72,
    SelectionAllPlayers = 73,
    PanelTemplates = 74,
    LabelTemplateType = 75,
    LabelTemplate = 76,
    ButtonMirrorVertically = 77,
    ButtonMirrorHorizontally = 78,
    ButtonOverlap = 79,
    ButtonPlace = 80,
    LabelRotate = 81,
    RangeRotateDegrees = 82,
    LabelDegrade = 83,
    RangeDegradeAmount = 84,
    DialogTitleInspect = 85,
    InspectTileTitle = 86,
    InspectTerrain = 87,
    LabelChangeTerrain = 88,
    ButtonToggleTilled = 89,
    ButtonIncludeNeighbors = 90,
    ButtonRefreshTile = 91,
    EntityName = 92,
    ButtonKillEntity = 93,
    ButtonHealEntity = 94,
    ButtonTeleportEntity = 95,
    ButtonHealLocalPlayer = 96,
    ButtonTeleportLocalPlayer = 97,
    ButtonCloneEntity = 98,
    ButtonClearInventory = 99,
    KillEntityDeathMessage = 100,
    CorpseName = 101,
    ButtonResurrectCorpse = 102,
    ButtonRemoveThing = 103,
    ButtonTameCreature = 104,
    LabelWeightBonus = 105,
    LabelItem = 106,
    LabelMalignity = 107,
    LabelBenignity = 108,
    OptionTeleportSelectLocation = 109,
    OptionTeleportToLocalPlayer = 110,
    OptionTeleportToHost = 111,
    OptionTeleportToPlayer = 112,
    ButtonToggleInvulnerable = 113,
    ButtonToggleNoClip = 114,
    LabelSkill = 115,
    None = 116,
    LabelQuality = 117,
    LabelQuantity = 118,
    LabelDurability = 119,
    LabelDecay = 120,
    ButtonApply = 121,
    AddToInventory = 122,
    DoodadName = 123,
    TabItemStack = 124,
    UnlockInspection = 125,
    LockInspection = 126,
    TileEventName = 127,
    ButtonTogglePermissions = 128,
    ButtonSetGrowthStage = 129,
    LabelItemDetails = 130,
    LabelBulkItemOperations = 131,
    InspectionTemperature = 132,
    InspectionTemperatureBiome = 133,
    InspectionTemperatureTimeModifier = 134,
    InspectionTemperatureLayerModifier = 135,
    InspectionTemperatureTileCalculated = 136,
    InspectionTemperatureTileCalculatedHeat = 137,
    InspectionTemperatureTileCalculatedCold = 138,
    InspectionTemperatureTileProducedHeat = 139,
    InspectionTemperatureTileProducedCold = 140,
    ActionResurrect = 141,
    ActionClone = 142,
    ActionTeleport = 143,
    To = 144
}
export interface ISaveData {
    lastVersion: string;
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
    permissions?: boolean;
}
export interface IGlobalData {
    lastVersion: string;
}
export type ModRegistrationMainDialogPanel = (cls: typeof DebugToolsPanel) => DebugToolsDialogPanelClass;
export type ModRegistrationInspectDialogInformationSection = (cls: typeof InspectInformationSection) => InspectDialogInformationSectionClass;
export type ModRegistrationInspectDialogEntityInformationSubsection = (cls: typeof InspectEntityInformationSubsection) => InspectDialogEntityInformationSubsectionClass;

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
    LabelZoomLevel = 22,
    ZoomLevel = 23,
    ButtonUnlockCamera = 24,
    ButtonResetRenderer = 25,
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
    SelectionPreview = 68,
    LabelSelectionPreview = 69,
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
    PanelTemperature = 84,
    HeadingTemperatureOverlay = 85,
    TemperatureOverlayModeProduced = 86,
    TemperatureOverlayModeCalculated = 87,
    DialogTitleInspect = 88,
    InspectTileTitle = 89,
    InspectTerrain = 90,
    LabelChangeTerrain = 91,
    ButtonToggleTilled = 92,
    ButtonIncludeNeighbors = 93,
    ButtonRefreshTile = 94,
    EntityName = 95,
    ButtonKillEntity = 96,
    ButtonHealEntity = 97,
    ButtonTeleportEntity = 98,
    ButtonHealLocalPlayer = 99,
    ButtonTeleportLocalPlayer = 100,
    ButtonCloneEntity = 101,
    ButtonClearInventory = 102,
    KillEntityDeathMessage = 103,
    CorpseName = 104,
    ButtonResurrectCorpse = 105,
    ButtonRemoveThing = 106,
    ButtonTameCreature = 107,
    LabelWeightBonus = 108,
    LabelItem = 109,
    LabelMalignity = 110,
    LabelBenignity = 111,
    OptionTeleportSelectLocation = 112,
    OptionTeleportToLocalPlayer = 113,
    OptionTeleportToHost = 114,
    OptionTeleportToPlayer = 115,
    ButtonToggleInvulnerable = 116,
    ButtonToggleNoClip = 117,
    LabelSkill = 118,
    None = 119,
    LabelQuality = 120,
    LabelQuantity = 121,
    LabelDurability = 122,
    LabelDecay = 123,
    ButtonApply = 124,
    AddToInventory = 125,
    DoodadName = 126,
    TabItemStack = 127,
    UnlockInspection = 128,
    LockInspection = 129,
    TileEventName = 130,
    ButtonTogglePermissions = 131,
    ButtonSetGrowthStage = 132,
    LabelItemDetails = 133,
    LabelBulkItemOperations = 134,
    InspectionTemperature = 135,
    InspectionTemperatureBiome = 136,
    InspectionTemperatureBiomeTimeModifier = 137,
    InspectionTemperatureLayerModifier = 138,
    InspectionTemperatureLayerTimeModifier = 139,
    InspectionTemperatureTileCalculated = 140,
    InspectionTemperatureTileCalculatedHeat = 141,
    InspectionTemperatureTileCalculatedCold = 142,
    InspectionTemperatureTileProducedHeat = 143,
    InspectionTemperatureTileProducedCold = 144,
    ActionResurrect = 145,
    ActionClone = 146,
    ActionTeleport = 147,
    To = 148,
    RevertDeath = 149
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

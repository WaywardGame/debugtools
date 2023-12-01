/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
import Translation from "@wayward/game/language/Translation";
import { RenderLayerFlag } from "@wayward/game/renderer/world/IWorldRenderer";
import type DebugTools from "./DebugTools";
import type { DebugToolsDialogPanelClass } from "./ui/DebugToolsDialog";
import type { InspectDialogInformationSectionClass } from "./ui/InspectDialog";
import type DebugToolsPanel from "./ui/component/DebugToolsPanel";
import type InspectEntityInformationSubsection from "./ui/component/InspectEntityInformationSubsection";
import type InspectInformationSection from "./ui/component/InspectInformationSection";
import type { InspectDialogEntityInformationSubsectionClass } from "./ui/inspect/EntityInformation";
import TranslationImpl from "@wayward/game/language/impl/TranslationImpl";
export declare const DEBUG_TOOLS_ID = "Debug Tools";
export declare function translation(debugToolsTranslation: DebugToolsTranslation | Translation): TranslationImpl;
export declare namespace translation {
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
    ButtonLoseWebGlContext = 26,
    ButtonRefreshTiles = 27,
    ButtonReloadShaders = 28,
    ButtonReloadTextures = 29,
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
    FilterTreasure = 66,
    ActionRemove = 67,
    ActionSelect = 68,
    ButtonExecute = 69,
    SelectionPreview = 70,
    LabelSelectionPreview = 71,
    SelectionFilterNamed = 72,
    SelectionFilterAll = 73,
    SelectionAllPlayers = 74,
    PanelTemplates = 75,
    LabelTemplateType = 76,
    LabelTemplate = 77,
    ButtonMirrorVertically = 78,
    ButtonMirrorHorizontally = 79,
    ButtonOverlap = 80,
    ButtonPlace = 81,
    LabelRotate = 82,
    RangeRotateDegrees = 83,
    LabelDegrade = 84,
    RangeDegradeAmount = 85,
    PanelTemperature = 86,
    HeadingTemperatureOverlay = 87,
    TemperatureOverlayModeProduced = 88,
    TemperatureOverlayModeCalculated = 89,
    DialogTitleInspect = 90,
    InspectTileTitle = 91,
    InspectTerrain = 92,
    LabelChangeTerrain = 93,
    ButtonToggleTilled = 94,
    ButtonIncludeNeighbors = 95,
    ButtonRefreshTile = 96,
    EntityName = 97,
    ButtonKillEntity = 98,
    ButtonHealEntity = 99,
    ButtonTeleportEntity = 100,
    ButtonHealLocalPlayer = 101,
    ButtonTeleportLocalPlayer = 102,
    ButtonCloneEntity = 103,
    ButtonClearInventory = 104,
    KillEntityDeathMessage = 105,
    CorpseName = 106,
    ButtonResurrectCorpse = 107,
    ButtonRemoveThing = 108,
    ButtonTameCreature = 109,
    LabelWeightBonus = 110,
    LabelItem = 111,
    LabelEvilAlignment = 112,
    LabelGoodAlignment = 113,
    OptionTeleportSelectLocation = 114,
    OptionTeleportToLocalPlayer = 115,
    OptionTeleportToHost = 116,
    OptionTeleportToPlayer = 117,
    ButtonToggleUnkillable = 118,
    ButtonToggleNoClip = 119,
    LabelSkill = 120,
    None = 121,
    LabelQuality = 122,
    LabelQuantity = 123,
    LabelDurability = 124,
    LabelDecay = 125,
    ButtonApply = 126,
    AddToInventory = 127,
    DoodadName = 128,
    VehicleName = 129,
    TabItemStack = 130,
    UnlockInspection = 131,
    LockInspection = 132,
    TileEventName = 133,
    ButtonTogglePermissions = 134,
    ButtonSetGrowthStage = 135,
    LabelItemDetails = 136,
    LabelBulkItemOperations = 137,
    ButtonPreviousItems = 138,
    ButtonNextItems = 139,
    LabelItems = 140,
    LabelReplaceData = 141,
    ButtonReplace = 142,
    LabelMax = 143,
    InspectionTemperature = 144,
    InspectionTemperatureBiome = 145,
    InspectionTemperatureBiomeTimeModifier = 146,
    InspectionTemperatureLayerModifier = 147,
    InspectionTemperatureLayerTimeModifier = 148,
    InspectionTemperatureTileCalculated = 149,
    InspectionTemperatureTileCalculatedHeat = 150,
    InspectionTemperatureTileCalculatedCold = 151,
    InspectionTemperatureTileProducedHeat = 152,
    InspectionTemperatureTileProducedCold = 153,
    ActionResurrect = 154,
    ActionClone = 155,
    ActionTeleport = 156,
    To = 157,
    RevertDeath = 158,
    StatsPercentage = 159
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
    unkillable?: boolean;
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

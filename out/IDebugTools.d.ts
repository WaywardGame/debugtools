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
import TranslationImpl from "@wayward/game/language/impl/TranslationImpl";
import { RenderLayerFlag } from "@wayward/game/renderer/world/IWorldRenderer";
import type DebugTools from "./DebugTools";
import type { DebugToolsDialogPanelClass } from "./ui/DebugToolsDialog";
import type { InspectDialogInformationSectionClass } from "./ui/InspectDialog";
import type DebugToolsPanel from "./ui/component/DebugToolsPanel";
import type InspectEntityInformationSubsection from "./ui/component/InspectEntityInformationSubsection";
import type InspectInformationSection from "./ui/component/InspectInformationSection";
import type { InspectDialogEntityInformationSubsectionClass } from "./ui/inspect/EntityInformation";
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
    LabelFastForward = 4,
    ButtonInspect = 5,
    ButtonInspectLocalPlayer = 6,
    ButtonRemoveAllCreatures = 7,
    ButtonRemoveAllNPCs = 8,
    ButtonAudio = 9,
    ButtonParticle = 10,
    LabelLayer = 11,
    OptionLayer = 12,
    HeadingIslandCurrent = 13,
    Island = 14,
    LabelTravel = 15,
    OptionTravelNewIsland = 16,
    OptionTravelCivilization = 17,
    OptionTravelRandomIsland = 18,
    ButtonTravel = 19,
    PanelDisplay = 20,
    ButtonToggleFog = 21,
    ButtonToggleLighting = 22,
    LabelZoomLevel = 23,
    ZoomLevel = 24,
    ButtonUnlockCamera = 25,
    ButtonResetRenderer = 26,
    ButtonLoseWebGlContext = 27,
    ButtonRefreshTiles = 28,
    ButtonReloadShaders = 29,
    ButtonReloadTextures = 30,
    HeadingLayers = 31,
    ButtonToggleLayer = 32,
    PanelPaint = 33,
    ButtonPaint = 34,
    PaintNoChange = 35,
    PaintRemove = 36,
    PaintRadius = 37,
    PaintRadiusTooltip = 38,
    LabelTerrain = 39,
    ButtonPaintClear = 40,
    TooltipPaintClear = 41,
    ButtonPaintComplete = 42,
    TooltipPaintComplete = 43,
    LabelCreature = 44,
    ButtonToggleAberrant = 45,
    LabelNPC = 46,
    LabelDoodad = 47,
    LabelCorpse = 48,
    ButtonReplaceExisting = 49,
    LabelTileEvent = 50,
    ResetPaintSection = 51,
    PanelSelection = 52,
    SelectionMethod = 53,
    SelectionFilter = 54,
    SelectionAction = 55,
    SelectionMatches = 56,
    SelectionAll = 57,
    MethodAll = 58,
    MethodNearest = 59,
    MethodRandom = 60,
    FilterCreatures = 61,
    FilterNPCs = 62,
    FilterTileEvents = 63,
    FilterDoodads = 64,
    FilterCorpses = 65,
    FilterPlayers = 66,
    FilterTreasure = 67,
    ActionRemove = 68,
    ActionSelect = 69,
    ButtonExecute = 70,
    SelectionPreview = 71,
    LabelSelectionPreview = 72,
    SelectionFilterNamed = 73,
    SelectionFilterAll = 74,
    SelectionAllPlayers = 75,
    PanelTemplates = 76,
    LabelTemplateType = 77,
    LabelTemplate = 78,
    ButtonMirrorVertically = 79,
    ButtonMirrorHorizontally = 80,
    ButtonOverlap = 81,
    ButtonPlace = 82,
    LabelRotate = 83,
    RangeRotateDegrees = 84,
    LabelDegrade = 85,
    RangeDegradeAmount = 86,
    PanelTemperature = 87,
    HeadingTemperatureOverlay = 88,
    TemperatureOverlayModeProduced = 89,
    TemperatureOverlayModeCalculated = 90,
    DialogTitleInspect = 91,
    InspectTileTitle = 92,
    InspectTerrain = 93,
    LabelChangeTerrain = 94,
    ButtonToggleTilled = 95,
    ButtonIncludeNeighbors = 96,
    ButtonRefreshTile = 97,
    EntityName = 98,
    ButtonKillEntity = 99,
    ButtonHealEntity = 100,
    ButtonTeleportEntity = 101,
    ButtonHealLocalPlayer = 102,
    ButtonTeleportLocalPlayer = 103,
    ButtonCloneEntity = 104,
    ButtonClearInventory = 105,
    KillEntityDeathMessage = 106,
    CorpseName = 107,
    ButtonResurrectCorpse = 108,
    ButtonRemoveThing = 109,
    ButtonTameCreature = 110,
    LabelWeightBonus = 111,
    LabelItem = 112,
    LabelEvilAlignment = 113,
    LabelGoodAlignment = 114,
    OptionTeleportSelectLocation = 115,
    OptionTeleportToLocalPlayer = 116,
    OptionTeleportToHost = 117,
    OptionTeleportToPlayer = 118,
    ButtonToggleUnkillable = 119,
    ButtonToggleNoClip = 120,
    LabelSkill = 121,
    None = 122,
    LabelQuality = 123,
    LabelQuantity = 124,
    LabelDurability = 125,
    LabelDecay = 126,
    ButtonApply = 127,
    AddToInventory = 128,
    DoodadName = 129,
    VehicleName = 130,
    TabItemStack = 131,
    UnlockInspection = 132,
    LockInspection = 133,
    TileEventName = 134,
    ButtonTogglePermissions = 135,
    ButtonSetGrowthStage = 136,
    LabelItemDetails = 137,
    LabelBulkItemOperations = 138,
    ButtonPreviousItems = 139,
    ButtonNextItems = 140,
    LabelItems = 141,
    LabelReplaceData = 142,
    ButtonReplace = 143,
    LabelMax = 144,
    InspectionTemperature = 145,
    InspectionTemperatureBiome = 146,
    InspectionTemperatureBiomeTimeModifier = 147,
    InspectionTemperatureLayerModifier = 148,
    InspectionTemperatureLayerTimeModifier = 149,
    InspectionTemperatureTileCalculated = 150,
    InspectionTemperatureTileCalculatedHeat = 151,
    InspectionTemperatureTileCalculatedCold = 152,
    InspectionTemperatureTileProducedHeat = 153,
    InspectionTemperatureTileProducedCold = 154,
    ActionResurrect = 155,
    ActionClone = 156,
    ActionTeleport = 157,
    To = 158,
    RevertDeath = 159,
    StatsPercentage = 160
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

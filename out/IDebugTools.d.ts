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
    PanelHistory = 91,
    Tick = 92,
    DialogTitleInspect = 93,
    InspectTileTitle = 94,
    InspectTerrain = 95,
    LabelChangeTerrain = 96,
    ButtonToggleTilled = 97,
    ButtonIncludeNeighbors = 98,
    ButtonRefreshTile = 99,
    EntityName = 100,
    ButtonKillEntity = 101,
    ButtonHealEntity = 102,
    ButtonTeleportEntity = 103,
    ButtonHealLocalPlayer = 104,
    ButtonTeleportLocalPlayer = 105,
    ButtonCloneEntity = 106,
    ButtonClearInventory = 107,
    KillEntityDeathMessage = 108,
    CorpseName = 109,
    ButtonResurrectCorpse = 110,
    ButtonRemoveThing = 111,
    ButtonTameCreature = 112,
    LabelWeightBonus = 113,
    LabelItem = 114,
    LabelEvilAlignment = 115,
    LabelGoodAlignment = 116,
    OptionTeleportSelectLocation = 117,
    OptionTeleportToLocalPlayer = 118,
    OptionTeleportToHost = 119,
    OptionTeleportToPlayer = 120,
    ButtonToggleUnkillable = 121,
    ButtonToggleNoClip = 122,
    LabelSkill = 123,
    None = 124,
    LabelQuality = 125,
    LabelQuantity = 126,
    LabelDurability = 127,
    LabelDecay = 128,
    ButtonApply = 129,
    AddToInventory = 130,
    DoodadName = 131,
    VehicleName = 132,
    TabItemStack = 133,
    UnlockInspection = 134,
    LockInspection = 135,
    TileEventName = 136,
    ButtonTogglePermissions = 137,
    ButtonSetGrowthStage = 138,
    LabelItemDetails = 139,
    LabelBulkItemOperations = 140,
    ButtonPreviousItems = 141,
    ButtonNextItems = 142,
    LabelItems = 143,
    LabelReplaceData = 144,
    ButtonReplace = 145,
    LabelMax = 146,
    ButtonClearNotes = 147,
    InspectionTemperature = 148,
    InspectionTemperatureBiome = 149,
    InspectionTemperatureBiomeTimeModifier = 150,
    InspectionTemperatureLayerModifier = 151,
    InspectionTemperatureLayerTimeModifier = 152,
    InspectionTemperatureTileCalculated = 153,
    InspectionTemperatureTileCalculatedHeat = 154,
    InspectionTemperatureTileCalculatedCold = 155,
    InspectionTemperatureTileProducedHeat = 156,
    InspectionTemperatureTileProducedCold = 157,
    ActionResurrect = 158,
    ActionClone = 159,
    ActionTeleport = 160,
    To = 161,
    RevertDeath = 162,
    StatsPercentage = 163
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

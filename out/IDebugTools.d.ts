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
import Translation from "language/Translation";
import { RenderLayerFlag } from "renderer/world/IWorldRenderer";
import type DebugTools from "./DebugTools";
import type { DebugToolsDialogPanelClass } from "./ui/DebugToolsDialog";
import type { InspectDialogInformationSectionClass } from "./ui/InspectDialog";
import type DebugToolsPanel from "./ui/component/DebugToolsPanel";
import type InspectEntityInformationSubsection from "./ui/component/InspectEntityInformationSubsection";
import type InspectInformationSection from "./ui/component/InspectInformationSection";
import type { InspectDialogEntityInformationSubsectionClass } from "./ui/inspect/EntityInformation";
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
    FilterTreasure = 65,
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
    PanelTemperature = 85,
    HeadingTemperatureOverlay = 86,
    TemperatureOverlayModeProduced = 87,
    TemperatureOverlayModeCalculated = 88,
    DialogTitleInspect = 89,
    InspectTileTitle = 90,
    InspectTerrain = 91,
    LabelChangeTerrain = 92,
    ButtonToggleTilled = 93,
    ButtonIncludeNeighbors = 94,
    ButtonRefreshTile = 95,
    EntityName = 96,
    ButtonKillEntity = 97,
    ButtonHealEntity = 98,
    ButtonTeleportEntity = 99,
    ButtonHealLocalPlayer = 100,
    ButtonTeleportLocalPlayer = 101,
    ButtonCloneEntity = 102,
    ButtonClearInventory = 103,
    KillEntityDeathMessage = 104,
    CorpseName = 105,
    ButtonResurrectCorpse = 106,
    ButtonRemoveThing = 107,
    ButtonTameCreature = 108,
    LabelWeightBonus = 109,
    LabelItem = 110,
    LabelMalignity = 111,
    LabelBenignity = 112,
    OptionTeleportSelectLocation = 113,
    OptionTeleportToLocalPlayer = 114,
    OptionTeleportToHost = 115,
    OptionTeleportToPlayer = 116,
    ButtonToggleInvulnerable = 117,
    ButtonToggleNoClip = 118,
    LabelSkill = 119,
    None = 120,
    LabelQuality = 121,
    LabelQuantity = 122,
    LabelDurability = 123,
    LabelDecay = 124,
    ButtonApply = 125,
    AddToInventory = 126,
    DoodadName = 127,
    TabItemStack = 128,
    UnlockInspection = 129,
    LockInspection = 130,
    TileEventName = 131,
    ButtonTogglePermissions = 132,
    ButtonSetGrowthStage = 133,
    LabelItemDetails = 134,
    LabelBulkItemOperations = 135,
    ButtonPreviousItems = 136,
    ButtonNextItems = 137,
    LabelItems = 138,
    InspectionTemperature = 139,
    InspectionTemperatureBiome = 140,
    InspectionTemperatureBiomeTimeModifier = 141,
    InspectionTemperatureLayerModifier = 142,
    InspectionTemperatureLayerTimeModifier = 143,
    InspectionTemperatureTileCalculated = 144,
    InspectionTemperatureTileCalculatedHeat = 145,
    InspectionTemperatureTileCalculatedCold = 146,
    InspectionTemperatureTileProducedHeat = 147,
    InspectionTemperatureTileProducedCold = 148,
    ActionResurrect = 149,
    ActionClone = 150,
    ActionTeleport = 151,
    To = 152,
    RevertDeath = 153,
    StatsPercentage = 154
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

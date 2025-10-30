import Translation from "@wayward/game/language/Translation";
import type TranslationImpl from "@wayward/game/language/impl/TranslationImpl";
import type { RenderLayerFlag } from "@wayward/game/renderer/world/IWorldRenderer";
import type DebugTools from "./DebugTools";
import type { DebugToolsDialogPanelClass } from "./ui/DebugToolsDialog";
import type { InspectDialogInformationSectionClass } from "./ui/InspectDialog";
import type DebugToolsPanel from "./ui/component/DebugToolsPanel";
import type InspectEntityInformationSubsection from "./ui/component/InspectEntityInformationSubsection";
import type InspectInformationSection from "./ui/component/InspectInformationSection";
import type { InspectDialogEntityInformationSubsectionClass } from "./ui/inspect/EntityInformation";

export const DEBUG_TOOLS_ID = "Debug Tools";

let debugTools: DebugTools | undefined;

/**
 * Returns a translation object using the `DebugToolsTranslation` dictionary
 * @param debugToolsTranslation The `DebugToolsTranslation` to get a `Translation` instance of
 */
export function translation(debugToolsTranslation: DebugToolsTranslation | Translation): TranslationImpl {
	return !debugTools ? Translation.empty()
		: typeof debugToolsTranslation !== "number" ? debugToolsTranslation : Translation.get(debugTools.dictionary, debugToolsTranslation);
}

export namespace translation {
	export function setDebugToolsInstance(instance: DebugTools): void {
		debugTools = instance;
	}
}

export enum DebugToolsTranslation {
	////////////////////////////////////
	// Options
	//
	OptionsAutoOpen,
	////////////////////////////////////
	// Main Dialog
	//
	DialogTitleMain,
	// General
	PanelGeneral,
	LabelTime,
	LabelFastForward,
	ButtonInspect,
	ButtonInspectLocalPlayer,
	ButtonRemoveAllCreatures,
	ButtonRemoveAllNPCs,
	ButtonAudio,
	ButtonParticle,
	LabelLayer,
	OptionLayer,
	HeadingIslandCurrent,
	Island,
	LabelTravel,
	OptionTravelNewIsland,
	OptionTravelCivilization,
	OptionTravelRandomIsland,
	ButtonTravel,
	// Display
	PanelDisplay,
	ButtonToggleFog,
	ButtonToggleLighting,
	LabelZoomLevel,
	ZoomLevel,
	ButtonUnlockCamera,
	ButtonResetRenderer,
	ButtonLoseWebGlContext,
	ButtonRefreshTiles,
	ButtonReloadShaders,
	ButtonReloadTextures,
	HeadingLayers,
	ButtonToggleLayer,
	CreatureZoneOverlayModeActive,
	CreatureZoneOverlayModeAll,
	CreatureZoneOverlayModeFollowingEntity,
	ButtonHideExtraneousUI,

	// Manipulation
	PanelPaint,
	ButtonPaint,
	PaintNoChange,
	PaintRemove,
	PaintRadius,
	PaintRadiusTooltip,
	LabelTerrain,
	ButtonPaintClear,
	TooltipPaintClear,
	ButtonPaintComplete,
	TooltipPaintComplete,
	LabelCreature,
	ButtonToggleAberrant,
	LabelNPC,
	LabelDoodad,
	LabelCorpse,
	ButtonReplaceExisting,
	LabelTileEvent,
	ResetPaintSection,

	// Selection
	PanelSelection,
	SelectionMethod,
	SelectionFilter,
	SelectionAction,
	SelectionMatches,
	SelectionAll,
	MethodAll,
	MethodNearest,
	MethodRandom,
	FilterCreatures,
	FilterNPCs,
	FilterTileEvents,
	FilterDoodads,
	FilterCorpses,
	FilterPlayers,
	FilterTreasure,
	ActionRemove,
	ActionSelect,
	// ActionCount,
	ButtonExecute,
	SelectionPreview,
	LabelSelectionPreview,
	SelectionFilterNamed,
	SelectionFilterAll,
	SelectionAllPlayers,

	// Templates
	PanelTemplates,
	LabelTemplateType,
	LabelTemplate,
	ButtonMirrorVertically,
	ButtonMirrorHorizontally,
	ButtonOverlap,
	ButtonPlace,
	LabelRotate,
	RangeRotateDegrees,
	LabelDegrade,
	RangeDegradeAmount,

	// Temperature
	PanelTemperature,
	HeadingTemperatureOverlay,
	TemperatureOverlayModeProduced,
	TemperatureOverlayModeCalculated,

	// history
	PanelHistory,
	Tick,

	// zones
	PanelZones,
	HeadingZonesOverlay,

	// npcs
	PanelNPCs,
	HeadingNPCInterval,
	LabelNPCIntervalTimeUntil,
	LabelNPCIntervalLength,
	LabelNPCIntervalSpawned,
	LabelNPCIntervalChancesWere,
	NPCIntervalInactive,
	ResetSpawnInterval,
	LabelNPCCount,

	// curse
	PanelCurse,
	SetNight,
	SetDay,
	SpawnCurseEvent,
	ClearCurseEvents,
	SkipCurseEventTimers,
	CurseOverride,
	RevealCurseEvents,

	////////////////////////////////////
	// Inspect Dialog
	//
	DialogTitleInspect,
	InspectTileTitle,
	InspectTerrain,
	LabelChangeTerrain,
	ButtonToggleTilled,
	ButtonIncludeNeighbors,
	ButtonRefreshTile,
	EntityName,
	ButtonKillEntity,
	ButtonHealEntity,
	ButtonTeleportEntity,
	ButtonHealLocalPlayer,
	ButtonTeleportLocalPlayer,
	ButtonCloneEntity,
	ButtonClearInventory,
	KillEntityDeathMessage,
	CorpseName,
	ButtonResurrectCorpse,
	ButtonRemoveThing,
	ButtonTameCreature,
	LabelWeightBonus,
	LabelItem,
	OptionTeleportSelectLocation,
	OptionTeleportToLocalPlayer,
	OptionTeleportToHost,
	OptionTeleportToPlayer,
	ButtonToggleUnkillable,
	ButtonToggleNoRender,
	ButtonToggleNoClip,
	ButtonToggleFastMovement,
	LabelSkill,
	None,
	LabelQuality,
	LabelQuantity,
	LabelDurability,
	LabelDecay,
	ButtonApply,
	AddToInventory,
	DoodadName,
	VehicleName,
	TabItemStack,
	UnlockInspection,
	LockInspection,
	TileEventName,
	ButtonTogglePermissions,
	ButtonSetGrowthStage,
	LabelItemDetails,
	LabelBulkItemOperations,
	ButtonPreviousItems,
	ButtonNextItems,
	LabelItems,
	LabelReplaceData,
	ButtonReplace,
	LabelMax,
	ButtonClearNotes,
	ButtonLoadMore,
	LabelValue,
	LabelCurse,
	LabelMagicalPropertyAdd,
	ButtonRemoveAllMagicalProperties,
	LabelAi,
	LabelBaseAi,
	LabelAiMasks,
	LabelIncludes,
	LabelExcludes,
	LabelCondition,
	ConditionMet,
	ConditionUnmet,
	ConditionAlwaysActive,
	LabelWanderIntent,
	ButtonCreatureZone,
	////////////////////////////////////
	// Inspection
	//
	InspectionTemperature,
	InspectionTemperatureBiome,
	InspectionTemperatureBiomeTimeModifier,
	InspectionTemperatureLayerModifier,
	InspectionTemperatureLayerTimeModifier,
	InspectionTemperatureLayerInjectModifier,
	InspectionTemperatureTileCalculated,
	InspectionTemperatureTileCalculatedHeat,
	InspectionTemperatureTileCalculatedCold,
	InspectionTemperatureTileProducedHeat,
	InspectionTemperatureTileProducedCold,
	////////////////////////////////////
	// Misc
	//
	ActionResurrect,
	ActionClone,
	ActionTeleport,
	To,
	RevertDeath,
	StatsPercentage,
}

export interface ISaveData {
	lastVersion: string;
	/**
	 * Data for each player in this save, indexed by their IDs.
	 */
	playerData: Record<string, IPlayerData>;
	/**
	 * Layers to render
	 */
	renderLayerFlags?: RenderLayerFlag;
	/**
	 * Hide extraneous UI
	 */
	hideExtraneousUI?: boolean;
}

export interface IPlayerData {
	/**
	 * Added to the player's strength
	 */
	weightBonus: number;

	/**
	 * Whether the player cannot die from negative damage
	 */
	unkillable?: boolean;

	/**
	 * Whether lighting is enabled
	 */
	lighting?: boolean;

	/**
	 * Whether the fog/field of view/fog of war is enabled
	 */
	fog?: boolean;

	/**
	 * Whether the player can use Debug Tools.
	 */
	permissions?: boolean;

	/**
	 * Whether the player has no render enabled
	 */
	noRender?: boolean;

	/**
	 * An override for curse level (0.0 - 1.0)
	 */
	curseOverride?: number;
}

export interface IGlobalData {
	lastVersion: string;
}

export type ModRegistrationMainDialogPanel = (cls: typeof DebugToolsPanel) => DebugToolsDialogPanelClass;
export type ModRegistrationInspectDialogInformationSection = (cls: typeof InspectInformationSection) => InspectDialogInformationSectionClass;
export type ModRegistrationInspectDialogEntityInformationSubsection = (cls: typeof InspectEntityInformationSubsection) => InspectDialogEntityInformationSubsectionClass;

import * as Consts from "game/IGame";
import Translation from "language/Translation";
import { RenderLayerFlag } from "renderer/IWorldRenderer";
import type DebugTools from "./DebugTools";
import type DebugToolsPanel from "./ui/component/DebugToolsPanel";
import type InspectEntityInformationSubsection from "./ui/component/InspectEntityInformationSubsection";
import type InspectInformationSection from "./ui/component/InspectInformationSection";
import type { DebugToolsDialogPanelClass } from "./ui/DebugToolsDialog";
import type { InspectDialogEntityInformationSubsectionClass } from "./ui/inspect/Entity";
import type { InspectDialogInformationSectionClass } from "./ui/InspectDialog";

export const DEBUG_TOOLS_ID = "Debug Tools";
export const ZOOM_LEVEL_MAX = Math.max(Consts.ZOOM_LEVEL_MAX, 16);

let debugTools: DebugTools | undefined;

/**
 * Returns a translation object using the `DebugToolsTranslation` dictionary
 * @param debugToolsTranslation The `DebugToolsTranslation` to get a `Translation` instance of
 */
export function translation(debugToolsTranslation: DebugToolsTranslation | Translation) {
	return !debugTools ? Translation.empty()
		: typeof debugToolsTranslation !== "number" ? debugToolsTranslation : new Translation(debugTools.dictionary, debugToolsTranslation);
}

export module translation {
	export function setDebugToolsInstance(instance: DebugTools) {
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
	ButtonResetWebGL,
	ButtonReloadShaders,
	ButtonReloadUIImages,
	HeadingLayers,
	ButtonToggleLayer,
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
	ActionRemove,
	ActionSelect,
	// ActionCount,
	ButtonExecute,
	SelectionCount,
	LabelSelectionCount,
	SelectionFilterNamed,
	SelectionFilterAll,
	SelectionAllPlayers,

	// Templates
	PanelTemplates,
	LabelTemplateType,
	LabelTemplate,
	ButtonMirrorVertically,
	ButtonMirrorHorizontally,
	ButtonPlace,
	LabelRotate,
	RangeRotateDegrees,
	LabelDegrade,
	RangeDegradeAmount,
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
	KillEntityDeathMessage,
	CorpseName,
	ButtonResurrectCorpse,
	ButtonRemoveThing,
	ButtonTameCreature,
	LabelWeightBonus,
	LabelItem,
	LabelMalignity,
	LabelBenignity,
	OptionTeleportSelectLocation,
	OptionTeleportToLocalPlayer,
	OptionTeleportToHost,
	OptionTeleportToPlayer,
	ButtonToggleInvulnerable,
	ButtonToggleNoClip,
	LabelSkill,
	None,
	LabelQuality,
	AddToInventory,
	DoodadName,
	TabItemStack,
	UnlockInspection,
	LockInspection,
	TileEventName,
	ItemName,
	ButtonTogglePermissions,
	ButtonSetGrowthStage,
	////////////////////////////////////
	// Inspection
	//
	InspectionTemperature,
	InspectionTemperatureBiome,
	InspectionTemperatureTimeModifier,
	InspectionTemperatureLayerModifier,
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
}

export interface ISaveData {
	lastVersion: string;
	/**
	 * 1 pixel in the renderer is equivalent to `this number ** 2`
	 */
	zoomLevel?: number;
	/**
	 * Data for each player in this save, indexed by their IDs.
	 */
	playerData: { [key: string]: IPlayerData };
	/**
	 * Layers to render
	 */
	renderLayerFlags?: RenderLayerFlag;
}

export interface IPlayerData {
	/**
	 * Added to the player's strength
	 */
	weightBonus: number;
	/**
	 * Whether the player is immune to damage
	 */
	invulnerable?: boolean;
	/**
	 * Whether lighting is enabled
	 */
	lighting?: boolean;
	/**
	 * Whether the fog/field of view/fog of war is enabled
	 */
	fog?: boolean;
	/**
	 * False if the player is not "noclipping", an object otherwise.
	 */
	noclip: false | {
		/**
		 * Whether the player is currently moving
		 */
		moving: boolean;
		/**
		 * The current delay between movements.
		 */
		delay: number;
	};
	/**
	 * Whether the player can use Debug Tools.
	 */
	permissions?: boolean;
}

export interface IGlobalData {
	lastVersion: string;
}

export type ModRegistrationMainDialogPanel = (cls: typeof DebugToolsPanel) => DebugToolsDialogPanelClass;
export type ModRegistrationInspectDialogInformationSection = (cls: typeof InspectInformationSection) => InspectDialogInformationSectionClass;
export type ModRegistrationInspectDialogEntityInformationSubsection = (cls: typeof InspectEntityInformationSubsection) => InspectDialogEntityInformationSubsectionClass;

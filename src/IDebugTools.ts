import Translation from "language/Translation";
import DebugTools from "./DebugTools";
import DebugToolsPanel from "./ui/component/DebugToolsPanel";
import InspectEntityInformationSubsection from "./ui/component/InspectEntityInformationSubsection";
import InspectInformationSection from "./ui/component/InspectInformationSection";
import { DebugToolsDialogPanelClass } from "./ui/DebugToolsDialog";
import { InspectDialogEntityInformationSubsectionClass } from "./ui/inspect/Entity";
import { InspectDialogInformationSectionClass } from "./ui/InspectDialog";

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
	ButtonUnlockRecipes,
	InterruptConfirmationUnlockRecipes,
	InterruptConfirmationUnlockRecipesDescription,
	ButtonRemoveAllCreatures,
	ButtonRemoveAllNPCs,
	ButtonTravelAway,
	InterruptChoiceTravelAway,
	ButtonAudio,
	ButtonParticle,
	// Display
	PanelDisplay,
	ButtonToggleFog,
	ButtonToggleLighting,
	LabelZoomLevel,
	ZoomLevel,
	ButtonUnlockCamera,
	ButtonResetWebGL,
	ButtonReloadShaders,
	// Manipulation
	PanelPaint,
	ButtonPaint,
	PaintNoChange,
	PaintRemove,
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
	MethodAll,
	MethodNearest,
	MethodRandom,
	FilterCreatures,
	FilterNPCs,
	FilterTileEvents,
	ActionRemove,
	ButtonExecute,
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
	EntityName,
	ButtonKillEntity,
	ButtonHealEntity,
	ButtonTeleportEntity,
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
	// Misc
	//
	ActionResurrect,
	ActionClone,
	ActionTeleport,
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
}

export interface IPlayerData {
	/**
	 * Added to the player's strength
	 */
	weightBonus: number;
	/**
	 * Whether the player is immune to damage
	 */
	invulnerable: boolean;
	/**
	 * Whether lighting is enabled
	 */
	lighting: boolean;
	/**
	 * Whether the fog/field of view/fog of war is enabled
	 */
	fog: boolean;
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

export const DEBUG_TOOLS_ID = "Debug Tools";

/**
 * Returns a translation object using the `DebugToolsTranslation` dictionary
 * @param debugToolsTranslation The `DebugToolsTranslation` to get a `Translation` instance of
 */
export function translation(debugToolsTranslation: DebugToolsTranslation | Translation) {
	return typeof debugToolsTranslation === "number" ? new Translation(DebugTools.INSTANCE.dictionary, debugToolsTranslation) : debugToolsTranslation;
}

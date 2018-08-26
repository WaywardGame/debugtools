import { IOverlayInfo } from "tile/ITerrain";
import DebugTools from "./DebugTools";

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
	ButtonChangeTerrain,
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

	////////////////////////////////////
	// Misc
	//

	ActionResurrect,
	ActionClone,
	ActionTeleport,
}

export interface ISaveData {
	lighting: boolean;
	fog: boolean;
	playerData: { [key: string]: IPlayerData };
	zoomLevel?: number;
}

export interface IPlayerData {
	weightBonus: number;
	invulnerable: boolean;
	noclip: false | {
		moving: boolean;
		delay: number;
	};
}

export interface ISaveDataGlobal {
	lastVersion: string;
}

export function isPaintOverlay(overlay: IOverlayInfo) {
	return overlay.type === DebugTools.INSTANCE.overlayPaint;
}

export function isHoverTargetOverlay(overlay: IOverlayInfo) {
	return overlay.type === DebugTools.INSTANCE.overlayTarget && !("red" in overlay);
}

export function isSelectedTargetOverlay(overlay: IOverlayInfo) {
	return overlay.type === DebugTools.INSTANCE.overlayTarget && "red" in overlay;
}

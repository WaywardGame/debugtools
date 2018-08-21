import { IOverlayInfo } from "tile/ITerrain";
export declare enum DebugToolsTranslation {
    OptionsAutoOpen = 0,
    DialogTitleMain = 1,
    PanelGeneral = 2,
    LabelTime = 3,
    ButtonInspect = 4,
    ButtonInspectLocalPlayer = 5,
    ButtonUnlockRecipes = 6,
    InterruptConfirmationUnlockRecipes = 7,
    InterruptConfirmationUnlockRecipesDescription = 8,
    ButtonRemoveAllCreatures = 9,
    ButtonRemoveAllNPCs = 10,
    PanelDisplay = 11,
    ButtonToggleFog = 12,
    ButtonToggleLighting = 13,
    LabelZoomLevel = 14,
    ZoomLevel = 15,
    ButtonUnlockCamera = 16,
    ButtonResetWebGL = 17,
    ButtonReloadShaders = 18,
    PanelPaint = 19,
    ButtonPaint = 20,
    PaintNoChange = 21,
    PaintRemove = 22,
    LabelTerrain = 23,
    ButtonPaintClear = 24,
    ButtonPaintComplete = 25,
    LabelCreature = 26,
    ButtonToggleAberrant = 27,
    LabelNPC = 28,
    LabelDoodad = 29,
    LabelCorpse = 30,
    ButtonReplaceExisting = 31,
    LabelTileEvent = 32,
    DialogTitleInspect = 33,
    InspectTileTitle = 34,
    InspectTerrain = 35,
    ButtonChangeTerrain = 36,
    ButtonToggleTilled = 37,
    EntityName = 38,
    ButtonKillEntity = 39,
    ButtonHealEntity = 40,
    ButtonTeleportEntity = 41,
    ButtonCloneEntity = 42,
    KillEntityDeathMessage = 43,
    CorpseName = 44,
    ButtonResurrectCorpse = 45,
    ButtonRemoveThing = 46,
    ButtonTameCreature = 47,
    LabelWeightBonus = 48,
    LabelItem = 49,
    LabelMalignity = 50,
    LabelBenignity = 51,
    OptionTeleportSelectLocation = 52,
    OptionTeleportToLocalPlayer = 53,
    OptionTeleportToHost = 54,
    OptionTeleportToPlayer = 55,
    ButtonToggleInvulnerable = 56,
    ButtonToggleNoClip = 57,
    LabelSkill = 58,
    None = 59,
    LabelQuality = 60,
    AddToInventory = 61,
    ActionResurrect = 62,
    ActionClone = 63
}
export interface ISaveData {
    lighting: boolean;
    fog: boolean;
    playerData: {
        [key: string]: IPlayerData;
    };
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
export declare enum DebugToolsEvent {
    UpdateSpectateState = "UpdateSpectateState"
}
export declare function isPaintOverlay(overlay: IOverlayInfo): boolean;
export declare function isHoverTargetOverlay(overlay: IOverlayInfo): boolean;
export declare function isSelectedTargetOverlay(overlay: IOverlayInfo): boolean;

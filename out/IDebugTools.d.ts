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
    TooltipPaintClear = 25,
    ButtonPaintComplete = 26,
    TooltipPaintComplete = 27,
    LabelCreature = 28,
    ButtonToggleAberrant = 29,
    LabelNPC = 30,
    LabelDoodad = 31,
    LabelCorpse = 32,
    ButtonReplaceExisting = 33,
    LabelTileEvent = 34,
    ResetPaintSection = 35,
    DialogTitleInspect = 36,
    InspectTileTitle = 37,
    InspectTerrain = 38,
    ButtonChangeTerrain = 39,
    ButtonToggleTilled = 40,
    EntityName = 41,
    ButtonKillEntity = 42,
    ButtonHealEntity = 43,
    ButtonTeleportEntity = 44,
    ButtonCloneEntity = 45,
    KillEntityDeathMessage = 46,
    CorpseName = 47,
    ButtonResurrectCorpse = 48,
    ButtonRemoveThing = 49,
    ButtonTameCreature = 50,
    LabelWeightBonus = 51,
    LabelItem = 52,
    LabelMalignity = 53,
    LabelBenignity = 54,
    OptionTeleportSelectLocation = 55,
    OptionTeleportToLocalPlayer = 56,
    OptionTeleportToHost = 57,
    OptionTeleportToPlayer = 58,
    ButtonToggleInvulnerable = 59,
    ButtonToggleNoClip = 60,
    LabelSkill = 61,
    None = 62,
    LabelQuality = 63,
    AddToInventory = 64,
    DoodadName = 65,
    TabItemStack = 66,
    UnlockInspection = 67,
    LockInspection = 68,
    TileEventName = 69,
    ActionResurrect = 70,
    ActionClone = 71,
    ActionTeleport = 72
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
export declare function isPaintOverlay(overlay: IOverlayInfo): boolean;
export declare function isHoverTargetOverlay(overlay: IOverlayInfo): boolean;
export declare function isSelectedTargetOverlay(overlay: IOverlayInfo): boolean;

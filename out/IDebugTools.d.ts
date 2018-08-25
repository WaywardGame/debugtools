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
    ButtonTravelAway = 11,
    InterruptChoiceTravelAway = 12,
    PanelDisplay = 13,
    ButtonToggleFog = 14,
    ButtonToggleLighting = 15,
    LabelZoomLevel = 16,
    ZoomLevel = 17,
    ButtonUnlockCamera = 18,
    ButtonResetWebGL = 19,
    ButtonReloadShaders = 20,
    PanelPaint = 21,
    ButtonPaint = 22,
    PaintNoChange = 23,
    PaintRemove = 24,
    LabelTerrain = 25,
    ButtonPaintClear = 26,
    TooltipPaintClear = 27,
    ButtonPaintComplete = 28,
    TooltipPaintComplete = 29,
    LabelCreature = 30,
    ButtonToggleAberrant = 31,
    LabelNPC = 32,
    LabelDoodad = 33,
    LabelCorpse = 34,
    ButtonReplaceExisting = 35,
    LabelTileEvent = 36,
    ResetPaintSection = 37,
    DialogTitleInspect = 38,
    InspectTileTitle = 39,
    InspectTerrain = 40,
    ButtonChangeTerrain = 41,
    ButtonToggleTilled = 42,
    EntityName = 43,
    ButtonKillEntity = 44,
    ButtonHealEntity = 45,
    ButtonTeleportEntity = 46,
    ButtonCloneEntity = 47,
    KillEntityDeathMessage = 48,
    CorpseName = 49,
    ButtonResurrectCorpse = 50,
    ButtonRemoveThing = 51,
    ButtonTameCreature = 52,
    LabelWeightBonus = 53,
    LabelItem = 54,
    LabelMalignity = 55,
    LabelBenignity = 56,
    OptionTeleportSelectLocation = 57,
    OptionTeleportToLocalPlayer = 58,
    OptionTeleportToHost = 59,
    OptionTeleportToPlayer = 60,
    ButtonToggleInvulnerable = 61,
    ButtonToggleNoClip = 62,
    LabelSkill = 63,
    None = 64,
    LabelQuality = 65,
    AddToInventory = 66,
    DoodadName = 67,
    TabItemStack = 68,
    UnlockInspection = 69,
    LockInspection = 70,
    TileEventName = 71,
    ActionResurrect = 72,
    ActionClone = 73,
    ActionTeleport = 74
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

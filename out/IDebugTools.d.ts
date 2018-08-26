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
    ButtonAudio = 13,
    ButtonParticle = 14,
    PanelDisplay = 15,
    ButtonToggleFog = 16,
    ButtonToggleLighting = 17,
    LabelZoomLevel = 18,
    ZoomLevel = 19,
    ButtonUnlockCamera = 20,
    ButtonResetWebGL = 21,
    ButtonReloadShaders = 22,
    PanelPaint = 23,
    ButtonPaint = 24,
    PaintNoChange = 25,
    PaintRemove = 26,
    LabelTerrain = 27,
    ButtonPaintClear = 28,
    TooltipPaintClear = 29,
    ButtonPaintComplete = 30,
    TooltipPaintComplete = 31,
    LabelCreature = 32,
    ButtonToggleAberrant = 33,
    LabelNPC = 34,
    LabelDoodad = 35,
    LabelCorpse = 36,
    ButtonReplaceExisting = 37,
    LabelTileEvent = 38,
    ResetPaintSection = 39,
    PanelSelection = 40,
    SelectionMethod = 41,
    SelectionFilter = 42,
    SelectionAction = 43,
    SelectionMatches = 44,
    MethodAll = 45,
    MethodNearest = 46,
    MethodRandom = 47,
    FilterCreatures = 48,
    FilterNPCs = 49,
    ActionRemove = 50,
    ButtonExecute = 51,
    PanelTemplates = 52,
    LabelTemplateType = 53,
    LabelTemplate = 54,
    ButtonMirrorVertically = 55,
    ButtonMirrorHorizontally = 56,
    ButtonPlace = 57,
    LabelRotate = 58,
    RangeRotateDegrees = 59,
    LabelDegrade = 60,
    RangeDegradeAmount = 61,
    DialogTitleInspect = 62,
    InspectTileTitle = 63,
    InspectTerrain = 64,
    ButtonChangeTerrain = 65,
    ButtonToggleTilled = 66,
    EntityName = 67,
    ButtonKillEntity = 68,
    ButtonHealEntity = 69,
    ButtonTeleportEntity = 70,
    ButtonCloneEntity = 71,
    KillEntityDeathMessage = 72,
    CorpseName = 73,
    ButtonResurrectCorpse = 74,
    ButtonRemoveThing = 75,
    ButtonTameCreature = 76,
    LabelWeightBonus = 77,
    LabelItem = 78,
    LabelMalignity = 79,
    LabelBenignity = 80,
    OptionTeleportSelectLocation = 81,
    OptionTeleportToLocalPlayer = 82,
    OptionTeleportToHost = 83,
    OptionTeleportToPlayer = 84,
    ButtonToggleInvulnerable = 85,
    ButtonToggleNoClip = 86,
    LabelSkill = 87,
    None = 88,
    LabelQuality = 89,
    AddToInventory = 90,
    DoodadName = 91,
    TabItemStack = 92,
    UnlockInspection = 93,
    LockInspection = 94,
    TileEventName = 95,
    ItemName = 96,
    ActionResurrect = 97,
    ActionClone = 98,
    ActionTeleport = 99
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

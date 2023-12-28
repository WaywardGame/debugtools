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
define(["require", "exports", "@wayward/game/language/Translation"], function (require, exports, Translation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DebugToolsTranslation = exports.translation = exports.DEBUG_TOOLS_ID = void 0;
    exports.DEBUG_TOOLS_ID = "Debug Tools";
    let debugTools;
    function translation(debugToolsTranslation) {
        return !debugTools ? Translation_1.default.empty()
            : typeof debugToolsTranslation !== "number" ? debugToolsTranslation : Translation_1.default.get(debugTools.dictionary, debugToolsTranslation);
    }
    exports.translation = translation;
    (function (translation) {
        function setDebugToolsInstance(instance) {
            debugTools = instance;
        }
        translation.setDebugToolsInstance = setDebugToolsInstance;
    })(translation || (exports.translation = translation = {}));
    var DebugToolsTranslation;
    (function (DebugToolsTranslation) {
        DebugToolsTranslation[DebugToolsTranslation["OptionsAutoOpen"] = 0] = "OptionsAutoOpen";
        DebugToolsTranslation[DebugToolsTranslation["DialogTitleMain"] = 1] = "DialogTitleMain";
        DebugToolsTranslation[DebugToolsTranslation["PanelGeneral"] = 2] = "PanelGeneral";
        DebugToolsTranslation[DebugToolsTranslation["LabelTime"] = 3] = "LabelTime";
        DebugToolsTranslation[DebugToolsTranslation["LabelFastForward"] = 4] = "LabelFastForward";
        DebugToolsTranslation[DebugToolsTranslation["ButtonInspect"] = 5] = "ButtonInspect";
        DebugToolsTranslation[DebugToolsTranslation["ButtonInspectLocalPlayer"] = 6] = "ButtonInspectLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRemoveAllCreatures"] = 7] = "ButtonRemoveAllCreatures";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRemoveAllNPCs"] = 8] = "ButtonRemoveAllNPCs";
        DebugToolsTranslation[DebugToolsTranslation["ButtonAudio"] = 9] = "ButtonAudio";
        DebugToolsTranslation[DebugToolsTranslation["ButtonParticle"] = 10] = "ButtonParticle";
        DebugToolsTranslation[DebugToolsTranslation["LabelLayer"] = 11] = "LabelLayer";
        DebugToolsTranslation[DebugToolsTranslation["OptionLayer"] = 12] = "OptionLayer";
        DebugToolsTranslation[DebugToolsTranslation["HeadingIslandCurrent"] = 13] = "HeadingIslandCurrent";
        DebugToolsTranslation[DebugToolsTranslation["Island"] = 14] = "Island";
        DebugToolsTranslation[DebugToolsTranslation["LabelTravel"] = 15] = "LabelTravel";
        DebugToolsTranslation[DebugToolsTranslation["OptionTravelNewIsland"] = 16] = "OptionTravelNewIsland";
        DebugToolsTranslation[DebugToolsTranslation["OptionTravelCivilization"] = 17] = "OptionTravelCivilization";
        DebugToolsTranslation[DebugToolsTranslation["OptionTravelRandomIsland"] = 18] = "OptionTravelRandomIsland";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTravel"] = 19] = "ButtonTravel";
        DebugToolsTranslation[DebugToolsTranslation["PanelDisplay"] = 20] = "PanelDisplay";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleFog"] = 21] = "ButtonToggleFog";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleLighting"] = 22] = "ButtonToggleLighting";
        DebugToolsTranslation[DebugToolsTranslation["LabelZoomLevel"] = 23] = "LabelZoomLevel";
        DebugToolsTranslation[DebugToolsTranslation["ZoomLevel"] = 24] = "ZoomLevel";
        DebugToolsTranslation[DebugToolsTranslation["ButtonUnlockCamera"] = 25] = "ButtonUnlockCamera";
        DebugToolsTranslation[DebugToolsTranslation["ButtonResetRenderer"] = 26] = "ButtonResetRenderer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonLoseWebGlContext"] = 27] = "ButtonLoseWebGlContext";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRefreshTiles"] = 28] = "ButtonRefreshTiles";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReloadShaders"] = 29] = "ButtonReloadShaders";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReloadTextures"] = 30] = "ButtonReloadTextures";
        DebugToolsTranslation[DebugToolsTranslation["HeadingLayers"] = 31] = "HeadingLayers";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleLayer"] = 32] = "ButtonToggleLayer";
        DebugToolsTranslation[DebugToolsTranslation["PanelPaint"] = 33] = "PanelPaint";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaint"] = 34] = "ButtonPaint";
        DebugToolsTranslation[DebugToolsTranslation["PaintNoChange"] = 35] = "PaintNoChange";
        DebugToolsTranslation[DebugToolsTranslation["PaintRemove"] = 36] = "PaintRemove";
        DebugToolsTranslation[DebugToolsTranslation["PaintRadius"] = 37] = "PaintRadius";
        DebugToolsTranslation[DebugToolsTranslation["PaintRadiusTooltip"] = 38] = "PaintRadiusTooltip";
        DebugToolsTranslation[DebugToolsTranslation["LabelTerrain"] = 39] = "LabelTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaintClear"] = 40] = "ButtonPaintClear";
        DebugToolsTranslation[DebugToolsTranslation["TooltipPaintClear"] = 41] = "TooltipPaintClear";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaintComplete"] = 42] = "ButtonPaintComplete";
        DebugToolsTranslation[DebugToolsTranslation["TooltipPaintComplete"] = 43] = "TooltipPaintComplete";
        DebugToolsTranslation[DebugToolsTranslation["LabelCreature"] = 44] = "LabelCreature";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleAberrant"] = 45] = "ButtonToggleAberrant";
        DebugToolsTranslation[DebugToolsTranslation["LabelNPC"] = 46] = "LabelNPC";
        DebugToolsTranslation[DebugToolsTranslation["LabelDoodad"] = 47] = "LabelDoodad";
        DebugToolsTranslation[DebugToolsTranslation["LabelCorpse"] = 48] = "LabelCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReplaceExisting"] = 49] = "ButtonReplaceExisting";
        DebugToolsTranslation[DebugToolsTranslation["LabelTileEvent"] = 50] = "LabelTileEvent";
        DebugToolsTranslation[DebugToolsTranslation["ResetPaintSection"] = 51] = "ResetPaintSection";
        DebugToolsTranslation[DebugToolsTranslation["PanelSelection"] = 52] = "PanelSelection";
        DebugToolsTranslation[DebugToolsTranslation["SelectionMethod"] = 53] = "SelectionMethod";
        DebugToolsTranslation[DebugToolsTranslation["SelectionFilter"] = 54] = "SelectionFilter";
        DebugToolsTranslation[DebugToolsTranslation["SelectionAction"] = 55] = "SelectionAction";
        DebugToolsTranslation[DebugToolsTranslation["SelectionMatches"] = 56] = "SelectionMatches";
        DebugToolsTranslation[DebugToolsTranslation["SelectionAll"] = 57] = "SelectionAll";
        DebugToolsTranslation[DebugToolsTranslation["MethodAll"] = 58] = "MethodAll";
        DebugToolsTranslation[DebugToolsTranslation["MethodNearest"] = 59] = "MethodNearest";
        DebugToolsTranslation[DebugToolsTranslation["MethodRandom"] = 60] = "MethodRandom";
        DebugToolsTranslation[DebugToolsTranslation["FilterCreatures"] = 61] = "FilterCreatures";
        DebugToolsTranslation[DebugToolsTranslation["FilterNPCs"] = 62] = "FilterNPCs";
        DebugToolsTranslation[DebugToolsTranslation["FilterTileEvents"] = 63] = "FilterTileEvents";
        DebugToolsTranslation[DebugToolsTranslation["FilterDoodads"] = 64] = "FilterDoodads";
        DebugToolsTranslation[DebugToolsTranslation["FilterCorpses"] = 65] = "FilterCorpses";
        DebugToolsTranslation[DebugToolsTranslation["FilterPlayers"] = 66] = "FilterPlayers";
        DebugToolsTranslation[DebugToolsTranslation["FilterTreasure"] = 67] = "FilterTreasure";
        DebugToolsTranslation[DebugToolsTranslation["ActionRemove"] = 68] = "ActionRemove";
        DebugToolsTranslation[DebugToolsTranslation["ActionSelect"] = 69] = "ActionSelect";
        DebugToolsTranslation[DebugToolsTranslation["ButtonExecute"] = 70] = "ButtonExecute";
        DebugToolsTranslation[DebugToolsTranslation["SelectionPreview"] = 71] = "SelectionPreview";
        DebugToolsTranslation[DebugToolsTranslation["LabelSelectionPreview"] = 72] = "LabelSelectionPreview";
        DebugToolsTranslation[DebugToolsTranslation["SelectionFilterNamed"] = 73] = "SelectionFilterNamed";
        DebugToolsTranslation[DebugToolsTranslation["SelectionFilterAll"] = 74] = "SelectionFilterAll";
        DebugToolsTranslation[DebugToolsTranslation["SelectionAllPlayers"] = 75] = "SelectionAllPlayers";
        DebugToolsTranslation[DebugToolsTranslation["PanelTemplates"] = 76] = "PanelTemplates";
        DebugToolsTranslation[DebugToolsTranslation["LabelTemplateType"] = 77] = "LabelTemplateType";
        DebugToolsTranslation[DebugToolsTranslation["LabelTemplate"] = 78] = "LabelTemplate";
        DebugToolsTranslation[DebugToolsTranslation["ButtonMirrorVertically"] = 79] = "ButtonMirrorVertically";
        DebugToolsTranslation[DebugToolsTranslation["ButtonMirrorHorizontally"] = 80] = "ButtonMirrorHorizontally";
        DebugToolsTranslation[DebugToolsTranslation["ButtonOverlap"] = 81] = "ButtonOverlap";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPlace"] = 82] = "ButtonPlace";
        DebugToolsTranslation[DebugToolsTranslation["LabelRotate"] = 83] = "LabelRotate";
        DebugToolsTranslation[DebugToolsTranslation["RangeRotateDegrees"] = 84] = "RangeRotateDegrees";
        DebugToolsTranslation[DebugToolsTranslation["LabelDegrade"] = 85] = "LabelDegrade";
        DebugToolsTranslation[DebugToolsTranslation["RangeDegradeAmount"] = 86] = "RangeDegradeAmount";
        DebugToolsTranslation[DebugToolsTranslation["PanelTemperature"] = 87] = "PanelTemperature";
        DebugToolsTranslation[DebugToolsTranslation["HeadingTemperatureOverlay"] = 88] = "HeadingTemperatureOverlay";
        DebugToolsTranslation[DebugToolsTranslation["TemperatureOverlayModeProduced"] = 89] = "TemperatureOverlayModeProduced";
        DebugToolsTranslation[DebugToolsTranslation["TemperatureOverlayModeCalculated"] = 90] = "TemperatureOverlayModeCalculated";
        DebugToolsTranslation[DebugToolsTranslation["PanelHistory"] = 91] = "PanelHistory";
        DebugToolsTranslation[DebugToolsTranslation["Tick"] = 92] = "Tick";
        DebugToolsTranslation[DebugToolsTranslation["DialogTitleInspect"] = 93] = "DialogTitleInspect";
        DebugToolsTranslation[DebugToolsTranslation["InspectTileTitle"] = 94] = "InspectTileTitle";
        DebugToolsTranslation[DebugToolsTranslation["InspectTerrain"] = 95] = "InspectTerrain";
        DebugToolsTranslation[DebugToolsTranslation["LabelChangeTerrain"] = 96] = "LabelChangeTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleTilled"] = 97] = "ButtonToggleTilled";
        DebugToolsTranslation[DebugToolsTranslation["ButtonIncludeNeighbors"] = 98] = "ButtonIncludeNeighbors";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRefreshTile"] = 99] = "ButtonRefreshTile";
        DebugToolsTranslation[DebugToolsTranslation["EntityName"] = 100] = "EntityName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonKillEntity"] = 101] = "ButtonKillEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonHealEntity"] = 102] = "ButtonHealEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTeleportEntity"] = 103] = "ButtonTeleportEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonHealLocalPlayer"] = 104] = "ButtonHealLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTeleportLocalPlayer"] = 105] = "ButtonTeleportLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonCloneEntity"] = 106] = "ButtonCloneEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonClearInventory"] = 107] = "ButtonClearInventory";
        DebugToolsTranslation[DebugToolsTranslation["KillEntityDeathMessage"] = 108] = "KillEntityDeathMessage";
        DebugToolsTranslation[DebugToolsTranslation["CorpseName"] = 109] = "CorpseName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonResurrectCorpse"] = 110] = "ButtonResurrectCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRemoveThing"] = 111] = "ButtonRemoveThing";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTameCreature"] = 112] = "ButtonTameCreature";
        DebugToolsTranslation[DebugToolsTranslation["LabelWeightBonus"] = 113] = "LabelWeightBonus";
        DebugToolsTranslation[DebugToolsTranslation["LabelItem"] = 114] = "LabelItem";
        DebugToolsTranslation[DebugToolsTranslation["LabelEvilAlignment"] = 115] = "LabelEvilAlignment";
        DebugToolsTranslation[DebugToolsTranslation["LabelGoodAlignment"] = 116] = "LabelGoodAlignment";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportSelectLocation"] = 117] = "OptionTeleportSelectLocation";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToLocalPlayer"] = 118] = "OptionTeleportToLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToHost"] = 119] = "OptionTeleportToHost";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToPlayer"] = 120] = "OptionTeleportToPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleUnkillable"] = 121] = "ButtonToggleUnkillable";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleNoClip"] = 122] = "ButtonToggleNoClip";
        DebugToolsTranslation[DebugToolsTranslation["LabelSkill"] = 123] = "LabelSkill";
        DebugToolsTranslation[DebugToolsTranslation["None"] = 124] = "None";
        DebugToolsTranslation[DebugToolsTranslation["LabelQuality"] = 125] = "LabelQuality";
        DebugToolsTranslation[DebugToolsTranslation["LabelQuantity"] = 126] = "LabelQuantity";
        DebugToolsTranslation[DebugToolsTranslation["LabelDurability"] = 127] = "LabelDurability";
        DebugToolsTranslation[DebugToolsTranslation["LabelDecay"] = 128] = "LabelDecay";
        DebugToolsTranslation[DebugToolsTranslation["ButtonApply"] = 129] = "ButtonApply";
        DebugToolsTranslation[DebugToolsTranslation["AddToInventory"] = 130] = "AddToInventory";
        DebugToolsTranslation[DebugToolsTranslation["DoodadName"] = 131] = "DoodadName";
        DebugToolsTranslation[DebugToolsTranslation["VehicleName"] = 132] = "VehicleName";
        DebugToolsTranslation[DebugToolsTranslation["TabItemStack"] = 133] = "TabItemStack";
        DebugToolsTranslation[DebugToolsTranslation["UnlockInspection"] = 134] = "UnlockInspection";
        DebugToolsTranslation[DebugToolsTranslation["LockInspection"] = 135] = "LockInspection";
        DebugToolsTranslation[DebugToolsTranslation["TileEventName"] = 136] = "TileEventName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTogglePermissions"] = 137] = "ButtonTogglePermissions";
        DebugToolsTranslation[DebugToolsTranslation["ButtonSetGrowthStage"] = 138] = "ButtonSetGrowthStage";
        DebugToolsTranslation[DebugToolsTranslation["LabelItemDetails"] = 139] = "LabelItemDetails";
        DebugToolsTranslation[DebugToolsTranslation["LabelBulkItemOperations"] = 140] = "LabelBulkItemOperations";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPreviousItems"] = 141] = "ButtonPreviousItems";
        DebugToolsTranslation[DebugToolsTranslation["ButtonNextItems"] = 142] = "ButtonNextItems";
        DebugToolsTranslation[DebugToolsTranslation["LabelItems"] = 143] = "LabelItems";
        DebugToolsTranslation[DebugToolsTranslation["LabelReplaceData"] = 144] = "LabelReplaceData";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReplace"] = 145] = "ButtonReplace";
        DebugToolsTranslation[DebugToolsTranslation["LabelMax"] = 146] = "LabelMax";
        DebugToolsTranslation[DebugToolsTranslation["ButtonClearNotes"] = 147] = "ButtonClearNotes";
        DebugToolsTranslation[DebugToolsTranslation["ButtonLoadMore"] = 148] = "ButtonLoadMore";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperature"] = 149] = "InspectionTemperature";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureBiome"] = 150] = "InspectionTemperatureBiome";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureBiomeTimeModifier"] = 151] = "InspectionTemperatureBiomeTimeModifier";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureLayerModifier"] = 152] = "InspectionTemperatureLayerModifier";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureLayerTimeModifier"] = 153] = "InspectionTemperatureLayerTimeModifier";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileCalculated"] = 154] = "InspectionTemperatureTileCalculated";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileCalculatedHeat"] = 155] = "InspectionTemperatureTileCalculatedHeat";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileCalculatedCold"] = 156] = "InspectionTemperatureTileCalculatedCold";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileProducedHeat"] = 157] = "InspectionTemperatureTileProducedHeat";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileProducedCold"] = 158] = "InspectionTemperatureTileProducedCold";
        DebugToolsTranslation[DebugToolsTranslation["ActionResurrect"] = 159] = "ActionResurrect";
        DebugToolsTranslation[DebugToolsTranslation["ActionClone"] = 160] = "ActionClone";
        DebugToolsTranslation[DebugToolsTranslation["ActionTeleport"] = 161] = "ActionTeleport";
        DebugToolsTranslation[DebugToolsTranslation["To"] = 162] = "To";
        DebugToolsTranslation[DebugToolsTranslation["RevertDeath"] = 163] = "RevertDeath";
        DebugToolsTranslation[DebugToolsTranslation["StatsPercentage"] = 164] = "StatsPercentage";
    })(DebugToolsTranslation || (exports.DebugToolsTranslation = DebugToolsTranslation = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURlYnVnVG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvSURlYnVnVG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7OztJQWFVLFFBQUEsY0FBYyxHQUFHLGFBQWEsQ0FBQztJQUU1QyxJQUFJLFVBQWtDLENBQUM7SUFNdkMsU0FBZ0IsV0FBVyxDQUFDLHFCQUEwRDtRQUNyRixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLEtBQUssRUFBRTtZQUN2QyxDQUFDLENBQUMsT0FBTyxxQkFBcUIsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDdEksQ0FBQztJQUhELGtDQUdDO0lBRUQsV0FBaUIsV0FBVztRQUMzQixTQUFnQixxQkFBcUIsQ0FBQyxRQUFvQjtZQUN6RCxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7UUFGZSxpQ0FBcUIsd0JBRXBDLENBQUE7SUFDRixDQUFDLEVBSmdCLFdBQVcsMkJBQVgsV0FBVyxRQUkzQjtJQUVELElBQVkscUJBa01YO0lBbE1ELFdBQVkscUJBQXFCO1FBSWhDLHVGQUFlLENBQUE7UUFJZix1RkFBZSxDQUFBO1FBRWYsaUZBQVksQ0FBQTtRQUNaLDJFQUFTLENBQUE7UUFDVCx5RkFBZ0IsQ0FBQTtRQUNoQixtRkFBYSxDQUFBO1FBQ2IseUdBQXdCLENBQUE7UUFDeEIseUdBQXdCLENBQUE7UUFDeEIsK0ZBQW1CLENBQUE7UUFDbkIsK0VBQVcsQ0FBQTtRQUNYLHNGQUFjLENBQUE7UUFDZCw4RUFBVSxDQUFBO1FBQ1YsZ0ZBQVcsQ0FBQTtRQUNYLGtHQUFvQixDQUFBO1FBQ3BCLHNFQUFNLENBQUE7UUFDTixnRkFBVyxDQUFBO1FBQ1gsb0dBQXFCLENBQUE7UUFDckIsMEdB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
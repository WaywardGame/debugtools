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
        DebugToolsTranslation[DebugToolsTranslation["DialogTitleInspect"] = 91] = "DialogTitleInspect";
        DebugToolsTranslation[DebugToolsTranslation["InspectTileTitle"] = 92] = "InspectTileTitle";
        DebugToolsTranslation[DebugToolsTranslation["InspectTerrain"] = 93] = "InspectTerrain";
        DebugToolsTranslation[DebugToolsTranslation["LabelChangeTerrain"] = 94] = "LabelChangeTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleTilled"] = 95] = "ButtonToggleTilled";
        DebugToolsTranslation[DebugToolsTranslation["ButtonIncludeNeighbors"] = 96] = "ButtonIncludeNeighbors";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRefreshTile"] = 97] = "ButtonRefreshTile";
        DebugToolsTranslation[DebugToolsTranslation["EntityName"] = 98] = "EntityName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonKillEntity"] = 99] = "ButtonKillEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonHealEntity"] = 100] = "ButtonHealEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTeleportEntity"] = 101] = "ButtonTeleportEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonHealLocalPlayer"] = 102] = "ButtonHealLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTeleportLocalPlayer"] = 103] = "ButtonTeleportLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonCloneEntity"] = 104] = "ButtonCloneEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonClearInventory"] = 105] = "ButtonClearInventory";
        DebugToolsTranslation[DebugToolsTranslation["KillEntityDeathMessage"] = 106] = "KillEntityDeathMessage";
        DebugToolsTranslation[DebugToolsTranslation["CorpseName"] = 107] = "CorpseName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonResurrectCorpse"] = 108] = "ButtonResurrectCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRemoveThing"] = 109] = "ButtonRemoveThing";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTameCreature"] = 110] = "ButtonTameCreature";
        DebugToolsTranslation[DebugToolsTranslation["LabelWeightBonus"] = 111] = "LabelWeightBonus";
        DebugToolsTranslation[DebugToolsTranslation["LabelItem"] = 112] = "LabelItem";
        DebugToolsTranslation[DebugToolsTranslation["LabelEvilAlignment"] = 113] = "LabelEvilAlignment";
        DebugToolsTranslation[DebugToolsTranslation["LabelGoodAlignment"] = 114] = "LabelGoodAlignment";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportSelectLocation"] = 115] = "OptionTeleportSelectLocation";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToLocalPlayer"] = 116] = "OptionTeleportToLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToHost"] = 117] = "OptionTeleportToHost";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToPlayer"] = 118] = "OptionTeleportToPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleUnkillable"] = 119] = "ButtonToggleUnkillable";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleNoClip"] = 120] = "ButtonToggleNoClip";
        DebugToolsTranslation[DebugToolsTranslation["LabelSkill"] = 121] = "LabelSkill";
        DebugToolsTranslation[DebugToolsTranslation["None"] = 122] = "None";
        DebugToolsTranslation[DebugToolsTranslation["LabelQuality"] = 123] = "LabelQuality";
        DebugToolsTranslation[DebugToolsTranslation["LabelQuantity"] = 124] = "LabelQuantity";
        DebugToolsTranslation[DebugToolsTranslation["LabelDurability"] = 125] = "LabelDurability";
        DebugToolsTranslation[DebugToolsTranslation["LabelDecay"] = 126] = "LabelDecay";
        DebugToolsTranslation[DebugToolsTranslation["ButtonApply"] = 127] = "ButtonApply";
        DebugToolsTranslation[DebugToolsTranslation["AddToInventory"] = 128] = "AddToInventory";
        DebugToolsTranslation[DebugToolsTranslation["DoodadName"] = 129] = "DoodadName";
        DebugToolsTranslation[DebugToolsTranslation["VehicleName"] = 130] = "VehicleName";
        DebugToolsTranslation[DebugToolsTranslation["TabItemStack"] = 131] = "TabItemStack";
        DebugToolsTranslation[DebugToolsTranslation["UnlockInspection"] = 132] = "UnlockInspection";
        DebugToolsTranslation[DebugToolsTranslation["LockInspection"] = 133] = "LockInspection";
        DebugToolsTranslation[DebugToolsTranslation["TileEventName"] = 134] = "TileEventName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTogglePermissions"] = 135] = "ButtonTogglePermissions";
        DebugToolsTranslation[DebugToolsTranslation["ButtonSetGrowthStage"] = 136] = "ButtonSetGrowthStage";
        DebugToolsTranslation[DebugToolsTranslation["LabelItemDetails"] = 137] = "LabelItemDetails";
        DebugToolsTranslation[DebugToolsTranslation["LabelBulkItemOperations"] = 138] = "LabelBulkItemOperations";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPreviousItems"] = 139] = "ButtonPreviousItems";
        DebugToolsTranslation[DebugToolsTranslation["ButtonNextItems"] = 140] = "ButtonNextItems";
        DebugToolsTranslation[DebugToolsTranslation["LabelItems"] = 141] = "LabelItems";
        DebugToolsTranslation[DebugToolsTranslation["LabelReplaceData"] = 142] = "LabelReplaceData";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReplace"] = 143] = "ButtonReplace";
        DebugToolsTranslation[DebugToolsTranslation["LabelMax"] = 144] = "LabelMax";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperature"] = 145] = "InspectionTemperature";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureBiome"] = 146] = "InspectionTemperatureBiome";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureBiomeTimeModifier"] = 147] = "InspectionTemperatureBiomeTimeModifier";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureLayerModifier"] = 148] = "InspectionTemperatureLayerModifier";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureLayerTimeModifier"] = 149] = "InspectionTemperatureLayerTimeModifier";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileCalculated"] = 150] = "InspectionTemperatureTileCalculated";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileCalculatedHeat"] = 151] = "InspectionTemperatureTileCalculatedHeat";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileCalculatedCold"] = 152] = "InspectionTemperatureTileCalculatedCold";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileProducedHeat"] = 153] = "InspectionTemperatureTileProducedHeat";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileProducedCold"] = 154] = "InspectionTemperatureTileProducedCold";
        DebugToolsTranslation[DebugToolsTranslation["ActionResurrect"] = 155] = "ActionResurrect";
        DebugToolsTranslation[DebugToolsTranslation["ActionClone"] = 156] = "ActionClone";
        DebugToolsTranslation[DebugToolsTranslation["ActionTeleport"] = 157] = "ActionTeleport";
        DebugToolsTranslation[DebugToolsTranslation["To"] = 158] = "To";
        DebugToolsTranslation[DebugToolsTranslation["RevertDeath"] = 159] = "RevertDeath";
        DebugToolsTranslation[DebugToolsTranslation["StatsPercentage"] = 160] = "StatsPercentage";
    })(DebugToolsTranslation || (exports.DebugToolsTranslation = DebugToolsTranslation = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURlYnVnVG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvSURlYnVnVG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7OztJQWFVLFFBQUEsY0FBYyxHQUFHLGFBQWEsQ0FBQztJQUU1QyxJQUFJLFVBQWtDLENBQUM7SUFNdkMsU0FBZ0IsV0FBVyxDQUFDLHFCQUEwRDtRQUNyRixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLEtBQUssRUFBRTtZQUN2QyxDQUFDLENBQUMsT0FBTyxxQkFBcUIsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDdEksQ0FBQztJQUhELGtDQUdDO0lBRUQsV0FBaUIsV0FBVztRQUMzQixTQUFnQixxQkFBcUIsQ0FBQyxRQUFvQjtZQUN6RCxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7UUFGZSxpQ0FBcUIsd0JBRXBDLENBQUE7SUFDRixDQUFDLEVBSmdCLFdBQVcsMkJBQVgsV0FBVyxRQUkzQjtJQUVELElBQVkscUJBNExYO0lBNUxELFdBQVkscUJBQXFCO1FBSWhDLHVGQUFlLENBQUE7UUFJZix1RkFBZSxDQUFBO1FBRWYsaUZBQVksQ0FBQTtRQUNaLDJFQUFTLENBQUE7UUFDVCx5RkFBZ0IsQ0FBQTtRQUNoQixtRkFBYSxDQUFBO1FBQ2IseUdBQXdCLENBQUE7UUFDeEIseUdBQXdCLENBQUE7UUFDeEIsK0ZBQW1CLENBQUE7UUFDbkIsK0VBQVcsQ0FBQTtRQUNYLHNGQUFjLENBQUE7UUFDZCw4RUFBVSxDQUFBO1FBQ1YsZ0ZBQVcsQ0FBQTtRQUNYLGtHQUFvQixDQUFBO1FBQ3BCLHNFQUFNLENBQUE7UUFDTixnRkFBVyxDQUFBO1FBQ1gsb0dBQXFCLENBQUE7UUFDckIsMEdB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
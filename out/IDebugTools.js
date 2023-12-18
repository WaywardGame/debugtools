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
        DebugToolsTranslation[DebugToolsTranslation["ButtonInspect"] = 4] = "ButtonInspect";
        DebugToolsTranslation[DebugToolsTranslation["ButtonInspectLocalPlayer"] = 5] = "ButtonInspectLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRemoveAllCreatures"] = 6] = "ButtonRemoveAllCreatures";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRemoveAllNPCs"] = 7] = "ButtonRemoveAllNPCs";
        DebugToolsTranslation[DebugToolsTranslation["ButtonAudio"] = 8] = "ButtonAudio";
        DebugToolsTranslation[DebugToolsTranslation["ButtonParticle"] = 9] = "ButtonParticle";
        DebugToolsTranslation[DebugToolsTranslation["LabelLayer"] = 10] = "LabelLayer";
        DebugToolsTranslation[DebugToolsTranslation["OptionLayer"] = 11] = "OptionLayer";
        DebugToolsTranslation[DebugToolsTranslation["HeadingIslandCurrent"] = 12] = "HeadingIslandCurrent";
        DebugToolsTranslation[DebugToolsTranslation["Island"] = 13] = "Island";
        DebugToolsTranslation[DebugToolsTranslation["LabelTravel"] = 14] = "LabelTravel";
        DebugToolsTranslation[DebugToolsTranslation["OptionTravelNewIsland"] = 15] = "OptionTravelNewIsland";
        DebugToolsTranslation[DebugToolsTranslation["OptionTravelCivilization"] = 16] = "OptionTravelCivilization";
        DebugToolsTranslation[DebugToolsTranslation["OptionTravelRandomIsland"] = 17] = "OptionTravelRandomIsland";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTravel"] = 18] = "ButtonTravel";
        DebugToolsTranslation[DebugToolsTranslation["PanelDisplay"] = 19] = "PanelDisplay";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleFog"] = 20] = "ButtonToggleFog";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleLighting"] = 21] = "ButtonToggleLighting";
        DebugToolsTranslation[DebugToolsTranslation["LabelZoomLevel"] = 22] = "LabelZoomLevel";
        DebugToolsTranslation[DebugToolsTranslation["ZoomLevel"] = 23] = "ZoomLevel";
        DebugToolsTranslation[DebugToolsTranslation["ButtonUnlockCamera"] = 24] = "ButtonUnlockCamera";
        DebugToolsTranslation[DebugToolsTranslation["ButtonResetRenderer"] = 25] = "ButtonResetRenderer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonLoseWebGlContext"] = 26] = "ButtonLoseWebGlContext";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRefreshTiles"] = 27] = "ButtonRefreshTiles";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReloadShaders"] = 28] = "ButtonReloadShaders";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReloadTextures"] = 29] = "ButtonReloadTextures";
        DebugToolsTranslation[DebugToolsTranslation["HeadingLayers"] = 30] = "HeadingLayers";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleLayer"] = 31] = "ButtonToggleLayer";
        DebugToolsTranslation[DebugToolsTranslation["PanelPaint"] = 32] = "PanelPaint";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaint"] = 33] = "ButtonPaint";
        DebugToolsTranslation[DebugToolsTranslation["PaintNoChange"] = 34] = "PaintNoChange";
        DebugToolsTranslation[DebugToolsTranslation["PaintRemove"] = 35] = "PaintRemove";
        DebugToolsTranslation[DebugToolsTranslation["PaintRadius"] = 36] = "PaintRadius";
        DebugToolsTranslation[DebugToolsTranslation["PaintRadiusTooltip"] = 37] = "PaintRadiusTooltip";
        DebugToolsTranslation[DebugToolsTranslation["LabelTerrain"] = 38] = "LabelTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaintClear"] = 39] = "ButtonPaintClear";
        DebugToolsTranslation[DebugToolsTranslation["TooltipPaintClear"] = 40] = "TooltipPaintClear";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaintComplete"] = 41] = "ButtonPaintComplete";
        DebugToolsTranslation[DebugToolsTranslation["TooltipPaintComplete"] = 42] = "TooltipPaintComplete";
        DebugToolsTranslation[DebugToolsTranslation["LabelCreature"] = 43] = "LabelCreature";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleAberrant"] = 44] = "ButtonToggleAberrant";
        DebugToolsTranslation[DebugToolsTranslation["LabelNPC"] = 45] = "LabelNPC";
        DebugToolsTranslation[DebugToolsTranslation["LabelDoodad"] = 46] = "LabelDoodad";
        DebugToolsTranslation[DebugToolsTranslation["LabelCorpse"] = 47] = "LabelCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReplaceExisting"] = 48] = "ButtonReplaceExisting";
        DebugToolsTranslation[DebugToolsTranslation["LabelTileEvent"] = 49] = "LabelTileEvent";
        DebugToolsTranslation[DebugToolsTranslation["ResetPaintSection"] = 50] = "ResetPaintSection";
        DebugToolsTranslation[DebugToolsTranslation["PanelSelection"] = 51] = "PanelSelection";
        DebugToolsTranslation[DebugToolsTranslation["SelectionMethod"] = 52] = "SelectionMethod";
        DebugToolsTranslation[DebugToolsTranslation["SelectionFilter"] = 53] = "SelectionFilter";
        DebugToolsTranslation[DebugToolsTranslation["SelectionAction"] = 54] = "SelectionAction";
        DebugToolsTranslation[DebugToolsTranslation["SelectionMatches"] = 55] = "SelectionMatches";
        DebugToolsTranslation[DebugToolsTranslation["SelectionAll"] = 56] = "SelectionAll";
        DebugToolsTranslation[DebugToolsTranslation["MethodAll"] = 57] = "MethodAll";
        DebugToolsTranslation[DebugToolsTranslation["MethodNearest"] = 58] = "MethodNearest";
        DebugToolsTranslation[DebugToolsTranslation["MethodRandom"] = 59] = "MethodRandom";
        DebugToolsTranslation[DebugToolsTranslation["FilterCreatures"] = 60] = "FilterCreatures";
        DebugToolsTranslation[DebugToolsTranslation["FilterNPCs"] = 61] = "FilterNPCs";
        DebugToolsTranslation[DebugToolsTranslation["FilterTileEvents"] = 62] = "FilterTileEvents";
        DebugToolsTranslation[DebugToolsTranslation["FilterDoodads"] = 63] = "FilterDoodads";
        DebugToolsTranslation[DebugToolsTranslation["FilterCorpses"] = 64] = "FilterCorpses";
        DebugToolsTranslation[DebugToolsTranslation["FilterPlayers"] = 65] = "FilterPlayers";
        DebugToolsTranslation[DebugToolsTranslation["FilterTreasure"] = 66] = "FilterTreasure";
        DebugToolsTranslation[DebugToolsTranslation["ActionRemove"] = 67] = "ActionRemove";
        DebugToolsTranslation[DebugToolsTranslation["ActionSelect"] = 68] = "ActionSelect";
        DebugToolsTranslation[DebugToolsTranslation["ButtonExecute"] = 69] = "ButtonExecute";
        DebugToolsTranslation[DebugToolsTranslation["SelectionPreview"] = 70] = "SelectionPreview";
        DebugToolsTranslation[DebugToolsTranslation["LabelSelectionPreview"] = 71] = "LabelSelectionPreview";
        DebugToolsTranslation[DebugToolsTranslation["SelectionFilterNamed"] = 72] = "SelectionFilterNamed";
        DebugToolsTranslation[DebugToolsTranslation["SelectionFilterAll"] = 73] = "SelectionFilterAll";
        DebugToolsTranslation[DebugToolsTranslation["SelectionAllPlayers"] = 74] = "SelectionAllPlayers";
        DebugToolsTranslation[DebugToolsTranslation["PanelTemplates"] = 75] = "PanelTemplates";
        DebugToolsTranslation[DebugToolsTranslation["LabelTemplateType"] = 76] = "LabelTemplateType";
        DebugToolsTranslation[DebugToolsTranslation["LabelTemplate"] = 77] = "LabelTemplate";
        DebugToolsTranslation[DebugToolsTranslation["ButtonMirrorVertically"] = 78] = "ButtonMirrorVertically";
        DebugToolsTranslation[DebugToolsTranslation["ButtonMirrorHorizontally"] = 79] = "ButtonMirrorHorizontally";
        DebugToolsTranslation[DebugToolsTranslation["ButtonOverlap"] = 80] = "ButtonOverlap";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPlace"] = 81] = "ButtonPlace";
        DebugToolsTranslation[DebugToolsTranslation["LabelRotate"] = 82] = "LabelRotate";
        DebugToolsTranslation[DebugToolsTranslation["RangeRotateDegrees"] = 83] = "RangeRotateDegrees";
        DebugToolsTranslation[DebugToolsTranslation["LabelDegrade"] = 84] = "LabelDegrade";
        DebugToolsTranslation[DebugToolsTranslation["RangeDegradeAmount"] = 85] = "RangeDegradeAmount";
        DebugToolsTranslation[DebugToolsTranslation["PanelTemperature"] = 86] = "PanelTemperature";
        DebugToolsTranslation[DebugToolsTranslation["HeadingTemperatureOverlay"] = 87] = "HeadingTemperatureOverlay";
        DebugToolsTranslation[DebugToolsTranslation["TemperatureOverlayModeProduced"] = 88] = "TemperatureOverlayModeProduced";
        DebugToolsTranslation[DebugToolsTranslation["TemperatureOverlayModeCalculated"] = 89] = "TemperatureOverlayModeCalculated";
        DebugToolsTranslation[DebugToolsTranslation["DialogTitleInspect"] = 90] = "DialogTitleInspect";
        DebugToolsTranslation[DebugToolsTranslation["InspectTileTitle"] = 91] = "InspectTileTitle";
        DebugToolsTranslation[DebugToolsTranslation["InspectTerrain"] = 92] = "InspectTerrain";
        DebugToolsTranslation[DebugToolsTranslation["LabelChangeTerrain"] = 93] = "LabelChangeTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleTilled"] = 94] = "ButtonToggleTilled";
        DebugToolsTranslation[DebugToolsTranslation["ButtonIncludeNeighbors"] = 95] = "ButtonIncludeNeighbors";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRefreshTile"] = 96] = "ButtonRefreshTile";
        DebugToolsTranslation[DebugToolsTranslation["EntityName"] = 97] = "EntityName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonKillEntity"] = 98] = "ButtonKillEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonHealEntity"] = 99] = "ButtonHealEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTeleportEntity"] = 100] = "ButtonTeleportEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonHealLocalPlayer"] = 101] = "ButtonHealLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTeleportLocalPlayer"] = 102] = "ButtonTeleportLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonCloneEntity"] = 103] = "ButtonCloneEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonClearInventory"] = 104] = "ButtonClearInventory";
        DebugToolsTranslation[DebugToolsTranslation["KillEntityDeathMessage"] = 105] = "KillEntityDeathMessage";
        DebugToolsTranslation[DebugToolsTranslation["CorpseName"] = 106] = "CorpseName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonResurrectCorpse"] = 107] = "ButtonResurrectCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRemoveThing"] = 108] = "ButtonRemoveThing";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTameCreature"] = 109] = "ButtonTameCreature";
        DebugToolsTranslation[DebugToolsTranslation["LabelWeightBonus"] = 110] = "LabelWeightBonus";
        DebugToolsTranslation[DebugToolsTranslation["LabelItem"] = 111] = "LabelItem";
        DebugToolsTranslation[DebugToolsTranslation["LabelEvilAlignment"] = 112] = "LabelEvilAlignment";
        DebugToolsTranslation[DebugToolsTranslation["LabelGoodAlignment"] = 113] = "LabelGoodAlignment";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportSelectLocation"] = 114] = "OptionTeleportSelectLocation";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToLocalPlayer"] = 115] = "OptionTeleportToLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToHost"] = 116] = "OptionTeleportToHost";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToPlayer"] = 117] = "OptionTeleportToPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleUnkillable"] = 118] = "ButtonToggleUnkillable";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleNoClip"] = 119] = "ButtonToggleNoClip";
        DebugToolsTranslation[DebugToolsTranslation["LabelSkill"] = 120] = "LabelSkill";
        DebugToolsTranslation[DebugToolsTranslation["None"] = 121] = "None";
        DebugToolsTranslation[DebugToolsTranslation["LabelQuality"] = 122] = "LabelQuality";
        DebugToolsTranslation[DebugToolsTranslation["LabelQuantity"] = 123] = "LabelQuantity";
        DebugToolsTranslation[DebugToolsTranslation["LabelDurability"] = 124] = "LabelDurability";
        DebugToolsTranslation[DebugToolsTranslation["LabelDecay"] = 125] = "LabelDecay";
        DebugToolsTranslation[DebugToolsTranslation["ButtonApply"] = 126] = "ButtonApply";
        DebugToolsTranslation[DebugToolsTranslation["AddToInventory"] = 127] = "AddToInventory";
        DebugToolsTranslation[DebugToolsTranslation["DoodadName"] = 128] = "DoodadName";
        DebugToolsTranslation[DebugToolsTranslation["VehicleName"] = 129] = "VehicleName";
        DebugToolsTranslation[DebugToolsTranslation["TabItemStack"] = 130] = "TabItemStack";
        DebugToolsTranslation[DebugToolsTranslation["UnlockInspection"] = 131] = "UnlockInspection";
        DebugToolsTranslation[DebugToolsTranslation["LockInspection"] = 132] = "LockInspection";
        DebugToolsTranslation[DebugToolsTranslation["TileEventName"] = 133] = "TileEventName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTogglePermissions"] = 134] = "ButtonTogglePermissions";
        DebugToolsTranslation[DebugToolsTranslation["ButtonSetGrowthStage"] = 135] = "ButtonSetGrowthStage";
        DebugToolsTranslation[DebugToolsTranslation["LabelItemDetails"] = 136] = "LabelItemDetails";
        DebugToolsTranslation[DebugToolsTranslation["LabelBulkItemOperations"] = 137] = "LabelBulkItemOperations";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPreviousItems"] = 138] = "ButtonPreviousItems";
        DebugToolsTranslation[DebugToolsTranslation["ButtonNextItems"] = 139] = "ButtonNextItems";
        DebugToolsTranslation[DebugToolsTranslation["LabelItems"] = 140] = "LabelItems";
        DebugToolsTranslation[DebugToolsTranslation["LabelReplaceData"] = 141] = "LabelReplaceData";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReplace"] = 142] = "ButtonReplace";
        DebugToolsTranslation[DebugToolsTranslation["LabelMax"] = 143] = "LabelMax";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperature"] = 144] = "InspectionTemperature";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureBiome"] = 145] = "InspectionTemperatureBiome";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureBiomeTimeModifier"] = 146] = "InspectionTemperatureBiomeTimeModifier";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureLayerModifier"] = 147] = "InspectionTemperatureLayerModifier";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureLayerTimeModifier"] = 148] = "InspectionTemperatureLayerTimeModifier";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileCalculated"] = 149] = "InspectionTemperatureTileCalculated";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileCalculatedHeat"] = 150] = "InspectionTemperatureTileCalculatedHeat";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileCalculatedCold"] = 151] = "InspectionTemperatureTileCalculatedCold";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileProducedHeat"] = 152] = "InspectionTemperatureTileProducedHeat";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileProducedCold"] = 153] = "InspectionTemperatureTileProducedCold";
        DebugToolsTranslation[DebugToolsTranslation["ActionResurrect"] = 154] = "ActionResurrect";
        DebugToolsTranslation[DebugToolsTranslation["ActionClone"] = 155] = "ActionClone";
        DebugToolsTranslation[DebugToolsTranslation["ActionTeleport"] = 156] = "ActionTeleport";
        DebugToolsTranslation[DebugToolsTranslation["To"] = 157] = "To";
        DebugToolsTranslation[DebugToolsTranslation["RevertDeath"] = 158] = "RevertDeath";
        DebugToolsTranslation[DebugToolsTranslation["StatsPercentage"] = 159] = "StatsPercentage";
    })(DebugToolsTranslation || (exports.DebugToolsTranslation = DebugToolsTranslation = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURlYnVnVG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvSURlYnVnVG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7OztJQWFVLFFBQUEsY0FBYyxHQUFHLGFBQWEsQ0FBQztJQUU1QyxJQUFJLFVBQWtDLENBQUM7SUFNdkMsU0FBZ0IsV0FBVyxDQUFDLHFCQUEwRDtRQUNyRixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLEtBQUssRUFBRTtZQUN2QyxDQUFDLENBQUMsT0FBTyxxQkFBcUIsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDdEksQ0FBQztJQUhELGtDQUdDO0lBRUQsV0FBaUIsV0FBVztRQUMzQixTQUFnQixxQkFBcUIsQ0FBQyxRQUFvQjtZQUN6RCxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7UUFGZSxpQ0FBcUIsd0JBRXBDLENBQUE7SUFDRixDQUFDLEVBSmdCLFdBQVcsMkJBQVgsV0FBVyxRQUkzQjtJQUVELElBQVkscUJBMkxYO0lBM0xELFdBQVkscUJBQXFCO1FBSWhDLHVGQUFlLENBQUE7UUFJZix1RkFBZSxDQUFBO1FBRWYsaUZBQVksQ0FBQTtRQUNaLDJFQUFTLENBQUE7UUFDVCxtRkFBYSxDQUFBO1FBQ2IseUdBQXdCLENBQUE7UUFDeEIseUdBQXdCLENBQUE7UUFDeEIsK0ZBQW1CLENBQUE7UUFDbkIsK0VBQVcsQ0FBQTtRQUNYLHFGQUFjLENBQUE7UUFDZCw4RUFBVSxDQUFBO1FBQ1YsZ0ZBQVcsQ0FBQTtRQUNYLGtHQUFvQixDQUFBO1FBQ3BCLHNFQUFNLENBQUE7UUFDTixnRkFBVyxDQUFBO1FBQ1gsb0dBQXFCLENBQUE7UUFDckIsMEdBQXdCLENBQUE7UUFDeEIsMEdB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
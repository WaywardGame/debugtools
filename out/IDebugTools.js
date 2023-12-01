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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURlYnVnVG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvSURlYnVnVG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7OztJQWFVLFFBQUEsY0FBYyxHQUFHLGFBQWEsQ0FBQztJQUU1QyxJQUFJLFVBQWtDLENBQUM7SUFNdkMsU0FBZ0IsV0FBVyxDQUFDLHFCQUEwRDtRQUNyRixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLEtBQUssRUFBRTtZQUN2QyxDQUFDLENBQUMsT0FBTyxxQkFBcUIsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDdEksQ0FBQztJQUhELGtDQUdDO0lBRUQsV0FBYyxXQUFXO1FBQ3hCLFNBQWdCLHFCQUFxQixDQUFDLFFBQW9CO1lBQ3pELFVBQVUsR0FBRyxRQUFRLENBQUM7UUFDdkIsQ0FBQztRQUZlLGlDQUFxQix3QkFFcEMsQ0FBQTtJQUNGLENBQUMsRUFKYSxXQUFXLDJCQUFYLFdBQVcsUUFJeEI7SUFFRCxJQUFZLHFCQTJMWDtJQTNMRCxXQUFZLHFCQUFxQjtRQUloQyx1RkFBZSxDQUFBO1FBSWYsdUZBQWUsQ0FBQTtRQUVmLGlGQUFZLENBQUE7UUFDWiwyRUFBUyxDQUFBO1FBQ1QsbUZBQWEsQ0FBQTtRQUNiLHlHQUF3QixDQUFBO1FBQ3hCLHlHQUF3QixDQUFBO1FBQ3hCLCtGQUFtQixDQUFBO1FBQ25CLCtFQUFXLENBQUE7UUFDWCxxRkFBYyxDQUFBO1FBQ2QsOEVBQVUsQ0FBQTtRQUNWLGdGQUFXLENBQUE7UUFDWCxrR0FBb0IsQ0FBQTtRQUNwQixzRUFBTSxDQUFBO1FBQ04sZ0ZBQVcsQ0FBQTtRQUNYLG9HQUFxQixDQUFBO1FBQ3JCLDBHQUF3QixDQUFBO1FBQ3hCLDBHQUF3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
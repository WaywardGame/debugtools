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
define(["require", "exports", "language/Translation"], function (require, exports, Translation_1) {
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
        DebugToolsTranslation[DebugToolsTranslation["ButtonRefreshTiles"] = 26] = "ButtonRefreshTiles";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReloadShaders"] = 27] = "ButtonReloadShaders";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReloadUIImages"] = 28] = "ButtonReloadUIImages";
        DebugToolsTranslation[DebugToolsTranslation["HeadingLayers"] = 29] = "HeadingLayers";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleLayer"] = 30] = "ButtonToggleLayer";
        DebugToolsTranslation[DebugToolsTranslation["PanelPaint"] = 31] = "PanelPaint";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaint"] = 32] = "ButtonPaint";
        DebugToolsTranslation[DebugToolsTranslation["PaintNoChange"] = 33] = "PaintNoChange";
        DebugToolsTranslation[DebugToolsTranslation["PaintRemove"] = 34] = "PaintRemove";
        DebugToolsTranslation[DebugToolsTranslation["PaintRadius"] = 35] = "PaintRadius";
        DebugToolsTranslation[DebugToolsTranslation["PaintRadiusTooltip"] = 36] = "PaintRadiusTooltip";
        DebugToolsTranslation[DebugToolsTranslation["LabelTerrain"] = 37] = "LabelTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaintClear"] = 38] = "ButtonPaintClear";
        DebugToolsTranslation[DebugToolsTranslation["TooltipPaintClear"] = 39] = "TooltipPaintClear";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaintComplete"] = 40] = "ButtonPaintComplete";
        DebugToolsTranslation[DebugToolsTranslation["TooltipPaintComplete"] = 41] = "TooltipPaintComplete";
        DebugToolsTranslation[DebugToolsTranslation["LabelCreature"] = 42] = "LabelCreature";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleAberrant"] = 43] = "ButtonToggleAberrant";
        DebugToolsTranslation[DebugToolsTranslation["LabelNPC"] = 44] = "LabelNPC";
        DebugToolsTranslation[DebugToolsTranslation["LabelDoodad"] = 45] = "LabelDoodad";
        DebugToolsTranslation[DebugToolsTranslation["LabelCorpse"] = 46] = "LabelCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReplaceExisting"] = 47] = "ButtonReplaceExisting";
        DebugToolsTranslation[DebugToolsTranslation["LabelTileEvent"] = 48] = "LabelTileEvent";
        DebugToolsTranslation[DebugToolsTranslation["ResetPaintSection"] = 49] = "ResetPaintSection";
        DebugToolsTranslation[DebugToolsTranslation["PanelSelection"] = 50] = "PanelSelection";
        DebugToolsTranslation[DebugToolsTranslation["SelectionMethod"] = 51] = "SelectionMethod";
        DebugToolsTranslation[DebugToolsTranslation["SelectionFilter"] = 52] = "SelectionFilter";
        DebugToolsTranslation[DebugToolsTranslation["SelectionAction"] = 53] = "SelectionAction";
        DebugToolsTranslation[DebugToolsTranslation["SelectionMatches"] = 54] = "SelectionMatches";
        DebugToolsTranslation[DebugToolsTranslation["SelectionAll"] = 55] = "SelectionAll";
        DebugToolsTranslation[DebugToolsTranslation["MethodAll"] = 56] = "MethodAll";
        DebugToolsTranslation[DebugToolsTranslation["MethodNearest"] = 57] = "MethodNearest";
        DebugToolsTranslation[DebugToolsTranslation["MethodRandom"] = 58] = "MethodRandom";
        DebugToolsTranslation[DebugToolsTranslation["FilterCreatures"] = 59] = "FilterCreatures";
        DebugToolsTranslation[DebugToolsTranslation["FilterNPCs"] = 60] = "FilterNPCs";
        DebugToolsTranslation[DebugToolsTranslation["FilterTileEvents"] = 61] = "FilterTileEvents";
        DebugToolsTranslation[DebugToolsTranslation["FilterDoodads"] = 62] = "FilterDoodads";
        DebugToolsTranslation[DebugToolsTranslation["FilterCorpses"] = 63] = "FilterCorpses";
        DebugToolsTranslation[DebugToolsTranslation["FilterPlayers"] = 64] = "FilterPlayers";
        DebugToolsTranslation[DebugToolsTranslation["FilterTreasure"] = 65] = "FilterTreasure";
        DebugToolsTranslation[DebugToolsTranslation["ActionRemove"] = 66] = "ActionRemove";
        DebugToolsTranslation[DebugToolsTranslation["ActionSelect"] = 67] = "ActionSelect";
        DebugToolsTranslation[DebugToolsTranslation["ButtonExecute"] = 68] = "ButtonExecute";
        DebugToolsTranslation[DebugToolsTranslation["SelectionPreview"] = 69] = "SelectionPreview";
        DebugToolsTranslation[DebugToolsTranslation["LabelSelectionPreview"] = 70] = "LabelSelectionPreview";
        DebugToolsTranslation[DebugToolsTranslation["SelectionFilterNamed"] = 71] = "SelectionFilterNamed";
        DebugToolsTranslation[DebugToolsTranslation["SelectionFilterAll"] = 72] = "SelectionFilterAll";
        DebugToolsTranslation[DebugToolsTranslation["SelectionAllPlayers"] = 73] = "SelectionAllPlayers";
        DebugToolsTranslation[DebugToolsTranslation["PanelTemplates"] = 74] = "PanelTemplates";
        DebugToolsTranslation[DebugToolsTranslation["LabelTemplateType"] = 75] = "LabelTemplateType";
        DebugToolsTranslation[DebugToolsTranslation["LabelTemplate"] = 76] = "LabelTemplate";
        DebugToolsTranslation[DebugToolsTranslation["ButtonMirrorVertically"] = 77] = "ButtonMirrorVertically";
        DebugToolsTranslation[DebugToolsTranslation["ButtonMirrorHorizontally"] = 78] = "ButtonMirrorHorizontally";
        DebugToolsTranslation[DebugToolsTranslation["ButtonOverlap"] = 79] = "ButtonOverlap";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPlace"] = 80] = "ButtonPlace";
        DebugToolsTranslation[DebugToolsTranslation["LabelRotate"] = 81] = "LabelRotate";
        DebugToolsTranslation[DebugToolsTranslation["RangeRotateDegrees"] = 82] = "RangeRotateDegrees";
        DebugToolsTranslation[DebugToolsTranslation["LabelDegrade"] = 83] = "LabelDegrade";
        DebugToolsTranslation[DebugToolsTranslation["RangeDegradeAmount"] = 84] = "RangeDegradeAmount";
        DebugToolsTranslation[DebugToolsTranslation["PanelTemperature"] = 85] = "PanelTemperature";
        DebugToolsTranslation[DebugToolsTranslation["HeadingTemperatureOverlay"] = 86] = "HeadingTemperatureOverlay";
        DebugToolsTranslation[DebugToolsTranslation["TemperatureOverlayModeProduced"] = 87] = "TemperatureOverlayModeProduced";
        DebugToolsTranslation[DebugToolsTranslation["TemperatureOverlayModeCalculated"] = 88] = "TemperatureOverlayModeCalculated";
        DebugToolsTranslation[DebugToolsTranslation["DialogTitleInspect"] = 89] = "DialogTitleInspect";
        DebugToolsTranslation[DebugToolsTranslation["InspectTileTitle"] = 90] = "InspectTileTitle";
        DebugToolsTranslation[DebugToolsTranslation["InspectTerrain"] = 91] = "InspectTerrain";
        DebugToolsTranslation[DebugToolsTranslation["LabelChangeTerrain"] = 92] = "LabelChangeTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleTilled"] = 93] = "ButtonToggleTilled";
        DebugToolsTranslation[DebugToolsTranslation["ButtonIncludeNeighbors"] = 94] = "ButtonIncludeNeighbors";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRefreshTile"] = 95] = "ButtonRefreshTile";
        DebugToolsTranslation[DebugToolsTranslation["EntityName"] = 96] = "EntityName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonKillEntity"] = 97] = "ButtonKillEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonHealEntity"] = 98] = "ButtonHealEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTeleportEntity"] = 99] = "ButtonTeleportEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonHealLocalPlayer"] = 100] = "ButtonHealLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTeleportLocalPlayer"] = 101] = "ButtonTeleportLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonCloneEntity"] = 102] = "ButtonCloneEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonClearInventory"] = 103] = "ButtonClearInventory";
        DebugToolsTranslation[DebugToolsTranslation["KillEntityDeathMessage"] = 104] = "KillEntityDeathMessage";
        DebugToolsTranslation[DebugToolsTranslation["CorpseName"] = 105] = "CorpseName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonResurrectCorpse"] = 106] = "ButtonResurrectCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRemoveThing"] = 107] = "ButtonRemoveThing";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTameCreature"] = 108] = "ButtonTameCreature";
        DebugToolsTranslation[DebugToolsTranslation["LabelWeightBonus"] = 109] = "LabelWeightBonus";
        DebugToolsTranslation[DebugToolsTranslation["LabelItem"] = 110] = "LabelItem";
        DebugToolsTranslation[DebugToolsTranslation["LabelMalignity"] = 111] = "LabelMalignity";
        DebugToolsTranslation[DebugToolsTranslation["LabelBenignity"] = 112] = "LabelBenignity";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportSelectLocation"] = 113] = "OptionTeleportSelectLocation";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToLocalPlayer"] = 114] = "OptionTeleportToLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToHost"] = 115] = "OptionTeleportToHost";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToPlayer"] = 116] = "OptionTeleportToPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleInvulnerable"] = 117] = "ButtonToggleInvulnerable";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleNoClip"] = 118] = "ButtonToggleNoClip";
        DebugToolsTranslation[DebugToolsTranslation["LabelSkill"] = 119] = "LabelSkill";
        DebugToolsTranslation[DebugToolsTranslation["None"] = 120] = "None";
        DebugToolsTranslation[DebugToolsTranslation["LabelQuality"] = 121] = "LabelQuality";
        DebugToolsTranslation[DebugToolsTranslation["LabelQuantity"] = 122] = "LabelQuantity";
        DebugToolsTranslation[DebugToolsTranslation["LabelDurability"] = 123] = "LabelDurability";
        DebugToolsTranslation[DebugToolsTranslation["LabelDecay"] = 124] = "LabelDecay";
        DebugToolsTranslation[DebugToolsTranslation["ButtonApply"] = 125] = "ButtonApply";
        DebugToolsTranslation[DebugToolsTranslation["AddToInventory"] = 126] = "AddToInventory";
        DebugToolsTranslation[DebugToolsTranslation["DoodadName"] = 127] = "DoodadName";
        DebugToolsTranslation[DebugToolsTranslation["TabItemStack"] = 128] = "TabItemStack";
        DebugToolsTranslation[DebugToolsTranslation["UnlockInspection"] = 129] = "UnlockInspection";
        DebugToolsTranslation[DebugToolsTranslation["LockInspection"] = 130] = "LockInspection";
        DebugToolsTranslation[DebugToolsTranslation["TileEventName"] = 131] = "TileEventName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTogglePermissions"] = 132] = "ButtonTogglePermissions";
        DebugToolsTranslation[DebugToolsTranslation["ButtonSetGrowthStage"] = 133] = "ButtonSetGrowthStage";
        DebugToolsTranslation[DebugToolsTranslation["LabelItemDetails"] = 134] = "LabelItemDetails";
        DebugToolsTranslation[DebugToolsTranslation["LabelBulkItemOperations"] = 135] = "LabelBulkItemOperations";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPreviousItems"] = 136] = "ButtonPreviousItems";
        DebugToolsTranslation[DebugToolsTranslation["ButtonNextItems"] = 137] = "ButtonNextItems";
        DebugToolsTranslation[DebugToolsTranslation["LabelItems"] = 138] = "LabelItems";
        DebugToolsTranslation[DebugToolsTranslation["LabelReplaceData"] = 139] = "LabelReplaceData";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReplace"] = 140] = "ButtonReplace";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperature"] = 141] = "InspectionTemperature";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureBiome"] = 142] = "InspectionTemperatureBiome";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureBiomeTimeModifier"] = 143] = "InspectionTemperatureBiomeTimeModifier";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureLayerModifier"] = 144] = "InspectionTemperatureLayerModifier";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureLayerTimeModifier"] = 145] = "InspectionTemperatureLayerTimeModifier";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileCalculated"] = 146] = "InspectionTemperatureTileCalculated";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileCalculatedHeat"] = 147] = "InspectionTemperatureTileCalculatedHeat";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileCalculatedCold"] = 148] = "InspectionTemperatureTileCalculatedCold";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileProducedHeat"] = 149] = "InspectionTemperatureTileProducedHeat";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileProducedCold"] = 150] = "InspectionTemperatureTileProducedCold";
        DebugToolsTranslation[DebugToolsTranslation["ActionResurrect"] = 151] = "ActionResurrect";
        DebugToolsTranslation[DebugToolsTranslation["ActionClone"] = 152] = "ActionClone";
        DebugToolsTranslation[DebugToolsTranslation["ActionTeleport"] = 153] = "ActionTeleport";
        DebugToolsTranslation[DebugToolsTranslation["To"] = 154] = "To";
        DebugToolsTranslation[DebugToolsTranslation["RevertDeath"] = 155] = "RevertDeath";
        DebugToolsTranslation[DebugToolsTranslation["StatsPercentage"] = 156] = "StatsPercentage";
    })(DebugToolsTranslation || (exports.DebugToolsTranslation = DebugToolsTranslation = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURlYnVnVG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvSURlYnVnVG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7OztJQVlVLFFBQUEsY0FBYyxHQUFHLGFBQWEsQ0FBQztJQUU1QyxJQUFJLFVBQWtDLENBQUM7SUFNdkMsU0FBZ0IsV0FBVyxDQUFDLHFCQUEwRDtRQUNyRixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLEtBQUssRUFBRTtZQUN2QyxDQUFDLENBQUMsT0FBTyxxQkFBcUIsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDdEksQ0FBQztJQUhELGtDQUdDO0lBRUQsV0FBYyxXQUFXO1FBQ3hCLFNBQWdCLHFCQUFxQixDQUFDLFFBQW9CO1lBQ3pELFVBQVUsR0FBRyxRQUFRLENBQUM7UUFDdkIsQ0FBQztRQUZlLGlDQUFxQix3QkFFcEMsQ0FBQTtJQUNGLENBQUMsRUFKYSxXQUFXLDJCQUFYLFdBQVcsUUFJeEI7SUFFRCxJQUFZLHFCQXdMWDtJQXhMRCxXQUFZLHFCQUFxQjtRQUloQyx1RkFBZSxDQUFBO1FBSWYsdUZBQWUsQ0FBQTtRQUVmLGlGQUFZLENBQUE7UUFDWiwyRUFBUyxDQUFBO1FBQ1QsbUZBQWEsQ0FBQTtRQUNiLHlHQUF3QixDQUFBO1FBQ3hCLHlHQUF3QixDQUFBO1FBQ3hCLCtGQUFtQixDQUFBO1FBQ25CLCtFQUFXLENBQUE7UUFDWCxxRkFBYyxDQUFBO1FBQ2QsOEVBQVUsQ0FBQTtRQUNWLGdGQUFXLENBQUE7UUFDWCxrR0FBb0IsQ0FBQTtRQUNwQixzRUFBTSxDQUFBO1FBQ04sZ0ZBQVcsQ0FBQTtRQUNYLG9HQUFxQixDQUFBO1FBQ3JCLDBHQUF3QixDQUFBO1FBQ3hCLDBHQUF3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
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
    })(translation = exports.translation || (exports.translation = {}));
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
        DebugToolsTranslation[DebugToolsTranslation["ActionRemove"] = 65] = "ActionRemove";
        DebugToolsTranslation[DebugToolsTranslation["ActionSelect"] = 66] = "ActionSelect";
        DebugToolsTranslation[DebugToolsTranslation["ButtonExecute"] = 67] = "ButtonExecute";
        DebugToolsTranslation[DebugToolsTranslation["SelectionPreview"] = 68] = "SelectionPreview";
        DebugToolsTranslation[DebugToolsTranslation["LabelSelectionPreview"] = 69] = "LabelSelectionPreview";
        DebugToolsTranslation[DebugToolsTranslation["SelectionFilterNamed"] = 70] = "SelectionFilterNamed";
        DebugToolsTranslation[DebugToolsTranslation["SelectionFilterAll"] = 71] = "SelectionFilterAll";
        DebugToolsTranslation[DebugToolsTranslation["SelectionAllPlayers"] = 72] = "SelectionAllPlayers";
        DebugToolsTranslation[DebugToolsTranslation["PanelTemplates"] = 73] = "PanelTemplates";
        DebugToolsTranslation[DebugToolsTranslation["LabelTemplateType"] = 74] = "LabelTemplateType";
        DebugToolsTranslation[DebugToolsTranslation["LabelTemplate"] = 75] = "LabelTemplate";
        DebugToolsTranslation[DebugToolsTranslation["ButtonMirrorVertically"] = 76] = "ButtonMirrorVertically";
        DebugToolsTranslation[DebugToolsTranslation["ButtonMirrorHorizontally"] = 77] = "ButtonMirrorHorizontally";
        DebugToolsTranslation[DebugToolsTranslation["ButtonOverlap"] = 78] = "ButtonOverlap";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPlace"] = 79] = "ButtonPlace";
        DebugToolsTranslation[DebugToolsTranslation["LabelRotate"] = 80] = "LabelRotate";
        DebugToolsTranslation[DebugToolsTranslation["RangeRotateDegrees"] = 81] = "RangeRotateDegrees";
        DebugToolsTranslation[DebugToolsTranslation["LabelDegrade"] = 82] = "LabelDegrade";
        DebugToolsTranslation[DebugToolsTranslation["RangeDegradeAmount"] = 83] = "RangeDegradeAmount";
        DebugToolsTranslation[DebugToolsTranslation["PanelTemperature"] = 84] = "PanelTemperature";
        DebugToolsTranslation[DebugToolsTranslation["HeadingTemperatureOverlay"] = 85] = "HeadingTemperatureOverlay";
        DebugToolsTranslation[DebugToolsTranslation["TemperatureOverlayModeProduced"] = 86] = "TemperatureOverlayModeProduced";
        DebugToolsTranslation[DebugToolsTranslation["TemperatureOverlayModeCalculated"] = 87] = "TemperatureOverlayModeCalculated";
        DebugToolsTranslation[DebugToolsTranslation["DialogTitleInspect"] = 88] = "DialogTitleInspect";
        DebugToolsTranslation[DebugToolsTranslation["InspectTileTitle"] = 89] = "InspectTileTitle";
        DebugToolsTranslation[DebugToolsTranslation["InspectTerrain"] = 90] = "InspectTerrain";
        DebugToolsTranslation[DebugToolsTranslation["LabelChangeTerrain"] = 91] = "LabelChangeTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleTilled"] = 92] = "ButtonToggleTilled";
        DebugToolsTranslation[DebugToolsTranslation["ButtonIncludeNeighbors"] = 93] = "ButtonIncludeNeighbors";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRefreshTile"] = 94] = "ButtonRefreshTile";
        DebugToolsTranslation[DebugToolsTranslation["EntityName"] = 95] = "EntityName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonKillEntity"] = 96] = "ButtonKillEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonHealEntity"] = 97] = "ButtonHealEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTeleportEntity"] = 98] = "ButtonTeleportEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonHealLocalPlayer"] = 99] = "ButtonHealLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTeleportLocalPlayer"] = 100] = "ButtonTeleportLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonCloneEntity"] = 101] = "ButtonCloneEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonClearInventory"] = 102] = "ButtonClearInventory";
        DebugToolsTranslation[DebugToolsTranslation["KillEntityDeathMessage"] = 103] = "KillEntityDeathMessage";
        DebugToolsTranslation[DebugToolsTranslation["CorpseName"] = 104] = "CorpseName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonResurrectCorpse"] = 105] = "ButtonResurrectCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRemoveThing"] = 106] = "ButtonRemoveThing";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTameCreature"] = 107] = "ButtonTameCreature";
        DebugToolsTranslation[DebugToolsTranslation["LabelWeightBonus"] = 108] = "LabelWeightBonus";
        DebugToolsTranslation[DebugToolsTranslation["LabelItem"] = 109] = "LabelItem";
        DebugToolsTranslation[DebugToolsTranslation["LabelMalignity"] = 110] = "LabelMalignity";
        DebugToolsTranslation[DebugToolsTranslation["LabelBenignity"] = 111] = "LabelBenignity";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportSelectLocation"] = 112] = "OptionTeleportSelectLocation";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToLocalPlayer"] = 113] = "OptionTeleportToLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToHost"] = 114] = "OptionTeleportToHost";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToPlayer"] = 115] = "OptionTeleportToPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleInvulnerable"] = 116] = "ButtonToggleInvulnerable";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleNoClip"] = 117] = "ButtonToggleNoClip";
        DebugToolsTranslation[DebugToolsTranslation["LabelSkill"] = 118] = "LabelSkill";
        DebugToolsTranslation[DebugToolsTranslation["None"] = 119] = "None";
        DebugToolsTranslation[DebugToolsTranslation["LabelQuality"] = 120] = "LabelQuality";
        DebugToolsTranslation[DebugToolsTranslation["LabelQuantity"] = 121] = "LabelQuantity";
        DebugToolsTranslation[DebugToolsTranslation["LabelDurability"] = 122] = "LabelDurability";
        DebugToolsTranslation[DebugToolsTranslation["LabelDecay"] = 123] = "LabelDecay";
        DebugToolsTranslation[DebugToolsTranslation["ButtonApply"] = 124] = "ButtonApply";
        DebugToolsTranslation[DebugToolsTranslation["AddToInventory"] = 125] = "AddToInventory";
        DebugToolsTranslation[DebugToolsTranslation["DoodadName"] = 126] = "DoodadName";
        DebugToolsTranslation[DebugToolsTranslation["TabItemStack"] = 127] = "TabItemStack";
        DebugToolsTranslation[DebugToolsTranslation["UnlockInspection"] = 128] = "UnlockInspection";
        DebugToolsTranslation[DebugToolsTranslation["LockInspection"] = 129] = "LockInspection";
        DebugToolsTranslation[DebugToolsTranslation["TileEventName"] = 130] = "TileEventName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTogglePermissions"] = 131] = "ButtonTogglePermissions";
        DebugToolsTranslation[DebugToolsTranslation["ButtonSetGrowthStage"] = 132] = "ButtonSetGrowthStage";
        DebugToolsTranslation[DebugToolsTranslation["LabelItemDetails"] = 133] = "LabelItemDetails";
        DebugToolsTranslation[DebugToolsTranslation["LabelBulkItemOperations"] = 134] = "LabelBulkItemOperations";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPreviousItems"] = 135] = "ButtonPreviousItems";
        DebugToolsTranslation[DebugToolsTranslation["ButtonNextItems"] = 136] = "ButtonNextItems";
        DebugToolsTranslation[DebugToolsTranslation["LabelItems"] = 137] = "LabelItems";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperature"] = 138] = "InspectionTemperature";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureBiome"] = 139] = "InspectionTemperatureBiome";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureBiomeTimeModifier"] = 140] = "InspectionTemperatureBiomeTimeModifier";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureLayerModifier"] = 141] = "InspectionTemperatureLayerModifier";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureLayerTimeModifier"] = 142] = "InspectionTemperatureLayerTimeModifier";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileCalculated"] = 143] = "InspectionTemperatureTileCalculated";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileCalculatedHeat"] = 144] = "InspectionTemperatureTileCalculatedHeat";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileCalculatedCold"] = 145] = "InspectionTemperatureTileCalculatedCold";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileProducedHeat"] = 146] = "InspectionTemperatureTileProducedHeat";
        DebugToolsTranslation[DebugToolsTranslation["InspectionTemperatureTileProducedCold"] = 147] = "InspectionTemperatureTileProducedCold";
        DebugToolsTranslation[DebugToolsTranslation["ActionResurrect"] = 148] = "ActionResurrect";
        DebugToolsTranslation[DebugToolsTranslation["ActionClone"] = 149] = "ActionClone";
        DebugToolsTranslation[DebugToolsTranslation["ActionTeleport"] = 150] = "ActionTeleport";
        DebugToolsTranslation[DebugToolsTranslation["To"] = 151] = "To";
        DebugToolsTranslation[DebugToolsTranslation["RevertDeath"] = 152] = "RevertDeath";
        DebugToolsTranslation[DebugToolsTranslation["StatsPercentage"] = 153] = "StatsPercentage";
    })(DebugToolsTranslation = exports.DebugToolsTranslation || (exports.DebugToolsTranslation = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURlYnVnVG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvSURlYnVnVG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7OztJQVlVLFFBQUEsY0FBYyxHQUFHLGFBQWEsQ0FBQztJQUU1QyxJQUFJLFVBQWtDLENBQUM7SUFNdkMsU0FBZ0IsV0FBVyxDQUFDLHFCQUEwRDtRQUNyRixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLEtBQUssRUFBRTtZQUN2QyxDQUFDLENBQUMsT0FBTyxxQkFBcUIsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDdEksQ0FBQztJQUhELGtDQUdDO0lBRUQsV0FBYyxXQUFXO1FBQ3hCLFNBQWdCLHFCQUFxQixDQUFDLFFBQW9CO1lBQ3pELFVBQVUsR0FBRyxRQUFRLENBQUM7UUFDdkIsQ0FBQztRQUZlLGlDQUFxQix3QkFFcEMsQ0FBQTtJQUNGLENBQUMsRUFKYSxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQUl4QjtJQUVELElBQVkscUJBcUxYO0lBckxELFdBQVkscUJBQXFCO1FBSWhDLHVGQUFlLENBQUE7UUFJZix1RkFBZSxDQUFBO1FBRWYsaUZBQVksQ0FBQTtRQUNaLDJFQUFTLENBQUE7UUFDVCxtRkFBYSxDQUFBO1FBQ2IseUdBQXdCLENBQUE7UUFDeEIseUdBQXdCLENBQUE7UUFDeEIsK0ZBQW1CLENBQUE7UUFDbkIsK0VBQVcsQ0FBQTtRQUNYLHFGQUFjLENBQUE7UUFDZCw4RUFBVSxDQUFBO1FBQ1YsZ0ZBQVcsQ0FBQTtRQUNYLGtHQUFvQixDQUFBO1FBQ3BCLHNFQUFNLENBQUE7UUFDTixnRkFBVyxDQUFBO1FBQ1gsb0dBQXFCLENBQUE7UUFDckIsMEdBQXdCLENBQUE7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
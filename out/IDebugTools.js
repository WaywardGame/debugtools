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
    })(DebugToolsTranslation || (exports.DebugToolsTranslation = DebugToolsTranslation = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURlYnVnVG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvSURlYnVnVG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7OztJQVlVLFFBQUEsY0FBYyxHQUFHLGFBQWEsQ0FBQztJQUU1QyxJQUFJLFVBQWtDLENBQUM7SUFNdkMsU0FBZ0IsV0FBVyxDQUFDLHFCQUEwRDtRQUNyRixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLEtBQUssRUFBRTtZQUN2QyxDQUFDLENBQUMsT0FBTyxxQkFBcUIsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDdEksQ0FBQztJQUhELGtDQUdDO0lBRUQsV0FBYyxXQUFXO1FBQ3hCLFNBQWdCLHFCQUFxQixDQUFDLFFBQW9CO1lBQ3pELFVBQVUsR0FBRyxRQUFRLENBQUM7UUFDdkIsQ0FBQztRQUZlLGlDQUFxQix3QkFFcEMsQ0FBQTtJQUNGLENBQUMsRUFKYSxXQUFXLDJCQUFYLFdBQVcsUUFJeEI7SUFFRCxJQUFZLHFCQXFMWDtJQXJMRCxXQUFZLHFCQUFxQjtRQUloQyx1RkFBZSxDQUFBO1FBSWYsdUZBQWUsQ0FBQTtRQUVmLGlGQUFZLENBQUE7UUFDWiwyRUFBUyxDQUFBO1FBQ1QsbUZBQWEsQ0FBQTtRQUNiLHlHQUF3QixDQUFBO1FBQ3hCLHlHQUF3QixDQUFBO1FBQ3hCLCtGQUFtQixDQUFBO1FBQ25CLCtFQUFXLENBQUE7UUFDWCxxRkFBYyxDQUFBO1FBQ2QsOEVBQVUsQ0FBQTtRQUNWLGdGQUFXLENBQUE7UUFDWCxrR0FBb0IsQ0FBQTtRQUNwQixzRUFBTSxDQUFBO1FBQ04sZ0ZBQVcsQ0FBQTtRQUNYLG9HQUFxQixDQUFBO1FBQ3JCLDBHQUF3QixDQUFBO1FBQ3hCLDBHQUF3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
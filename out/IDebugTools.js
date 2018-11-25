define(["require", "exports", "language/Translation", "./DebugTools"], function (require, exports, Translation_1, DebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DebugToolsTranslation;
    (function (DebugToolsTranslation) {
        DebugToolsTranslation[DebugToolsTranslation["OptionsAutoOpen"] = 0] = "OptionsAutoOpen";
        DebugToolsTranslation[DebugToolsTranslation["DialogTitleMain"] = 1] = "DialogTitleMain";
        DebugToolsTranslation[DebugToolsTranslation["PanelGeneral"] = 2] = "PanelGeneral";
        DebugToolsTranslation[DebugToolsTranslation["LabelTime"] = 3] = "LabelTime";
        DebugToolsTranslation[DebugToolsTranslation["ButtonInspect"] = 4] = "ButtonInspect";
        DebugToolsTranslation[DebugToolsTranslation["ButtonInspectLocalPlayer"] = 5] = "ButtonInspectLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonUnlockRecipes"] = 6] = "ButtonUnlockRecipes";
        DebugToolsTranslation[DebugToolsTranslation["InterruptConfirmationUnlockRecipes"] = 7] = "InterruptConfirmationUnlockRecipes";
        DebugToolsTranslation[DebugToolsTranslation["InterruptConfirmationUnlockRecipesDescription"] = 8] = "InterruptConfirmationUnlockRecipesDescription";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRemoveAllCreatures"] = 9] = "ButtonRemoveAllCreatures";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRemoveAllNPCs"] = 10] = "ButtonRemoveAllNPCs";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTravelAway"] = 11] = "ButtonTravelAway";
        DebugToolsTranslation[DebugToolsTranslation["InterruptChoiceTravelAway"] = 12] = "InterruptChoiceTravelAway";
        DebugToolsTranslation[DebugToolsTranslation["ButtonAudio"] = 13] = "ButtonAudio";
        DebugToolsTranslation[DebugToolsTranslation["ButtonParticle"] = 14] = "ButtonParticle";
        DebugToolsTranslation[DebugToolsTranslation["PanelDisplay"] = 15] = "PanelDisplay";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleFog"] = 16] = "ButtonToggleFog";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleLighting"] = 17] = "ButtonToggleLighting";
        DebugToolsTranslation[DebugToolsTranslation["LabelZoomLevel"] = 18] = "LabelZoomLevel";
        DebugToolsTranslation[DebugToolsTranslation["ZoomLevel"] = 19] = "ZoomLevel";
        DebugToolsTranslation[DebugToolsTranslation["ButtonUnlockCamera"] = 20] = "ButtonUnlockCamera";
        DebugToolsTranslation[DebugToolsTranslation["ButtonResetWebGL"] = 21] = "ButtonResetWebGL";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReloadShaders"] = 22] = "ButtonReloadShaders";
        DebugToolsTranslation[DebugToolsTranslation["PanelPaint"] = 23] = "PanelPaint";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaint"] = 24] = "ButtonPaint";
        DebugToolsTranslation[DebugToolsTranslation["PaintNoChange"] = 25] = "PaintNoChange";
        DebugToolsTranslation[DebugToolsTranslation["PaintRemove"] = 26] = "PaintRemove";
        DebugToolsTranslation[DebugToolsTranslation["LabelTerrain"] = 27] = "LabelTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaintClear"] = 28] = "ButtonPaintClear";
        DebugToolsTranslation[DebugToolsTranslation["TooltipPaintClear"] = 29] = "TooltipPaintClear";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaintComplete"] = 30] = "ButtonPaintComplete";
        DebugToolsTranslation[DebugToolsTranslation["TooltipPaintComplete"] = 31] = "TooltipPaintComplete";
        DebugToolsTranslation[DebugToolsTranslation["LabelCreature"] = 32] = "LabelCreature";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleAberrant"] = 33] = "ButtonToggleAberrant";
        DebugToolsTranslation[DebugToolsTranslation["LabelNPC"] = 34] = "LabelNPC";
        DebugToolsTranslation[DebugToolsTranslation["LabelDoodad"] = 35] = "LabelDoodad";
        DebugToolsTranslation[DebugToolsTranslation["LabelCorpse"] = 36] = "LabelCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReplaceExisting"] = 37] = "ButtonReplaceExisting";
        DebugToolsTranslation[DebugToolsTranslation["LabelTileEvent"] = 38] = "LabelTileEvent";
        DebugToolsTranslation[DebugToolsTranslation["ResetPaintSection"] = 39] = "ResetPaintSection";
        DebugToolsTranslation[DebugToolsTranslation["PanelSelection"] = 40] = "PanelSelection";
        DebugToolsTranslation[DebugToolsTranslation["SelectionMethod"] = 41] = "SelectionMethod";
        DebugToolsTranslation[DebugToolsTranslation["SelectionFilter"] = 42] = "SelectionFilter";
        DebugToolsTranslation[DebugToolsTranslation["SelectionAction"] = 43] = "SelectionAction";
        DebugToolsTranslation[DebugToolsTranslation["SelectionMatches"] = 44] = "SelectionMatches";
        DebugToolsTranslation[DebugToolsTranslation["MethodAll"] = 45] = "MethodAll";
        DebugToolsTranslation[DebugToolsTranslation["MethodNearest"] = 46] = "MethodNearest";
        DebugToolsTranslation[DebugToolsTranslation["MethodRandom"] = 47] = "MethodRandom";
        DebugToolsTranslation[DebugToolsTranslation["FilterCreatures"] = 48] = "FilterCreatures";
        DebugToolsTranslation[DebugToolsTranslation["FilterNPCs"] = 49] = "FilterNPCs";
        DebugToolsTranslation[DebugToolsTranslation["FilterTileEvents"] = 50] = "FilterTileEvents";
        DebugToolsTranslation[DebugToolsTranslation["ActionRemove"] = 51] = "ActionRemove";
        DebugToolsTranslation[DebugToolsTranslation["ButtonExecute"] = 52] = "ButtonExecute";
        DebugToolsTranslation[DebugToolsTranslation["PanelTemplates"] = 53] = "PanelTemplates";
        DebugToolsTranslation[DebugToolsTranslation["LabelTemplateType"] = 54] = "LabelTemplateType";
        DebugToolsTranslation[DebugToolsTranslation["LabelTemplate"] = 55] = "LabelTemplate";
        DebugToolsTranslation[DebugToolsTranslation["ButtonMirrorVertically"] = 56] = "ButtonMirrorVertically";
        DebugToolsTranslation[DebugToolsTranslation["ButtonMirrorHorizontally"] = 57] = "ButtonMirrorHorizontally";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPlace"] = 58] = "ButtonPlace";
        DebugToolsTranslation[DebugToolsTranslation["LabelRotate"] = 59] = "LabelRotate";
        DebugToolsTranslation[DebugToolsTranslation["RangeRotateDegrees"] = 60] = "RangeRotateDegrees";
        DebugToolsTranslation[DebugToolsTranslation["LabelDegrade"] = 61] = "LabelDegrade";
        DebugToolsTranslation[DebugToolsTranslation["RangeDegradeAmount"] = 62] = "RangeDegradeAmount";
        DebugToolsTranslation[DebugToolsTranslation["DialogTitleInspect"] = 63] = "DialogTitleInspect";
        DebugToolsTranslation[DebugToolsTranslation["InspectTileTitle"] = 64] = "InspectTileTitle";
        DebugToolsTranslation[DebugToolsTranslation["InspectTerrain"] = 65] = "InspectTerrain";
        DebugToolsTranslation[DebugToolsTranslation["LabelChangeTerrain"] = 66] = "LabelChangeTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleTilled"] = 67] = "ButtonToggleTilled";
        DebugToolsTranslation[DebugToolsTranslation["EntityName"] = 68] = "EntityName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonKillEntity"] = 69] = "ButtonKillEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonHealEntity"] = 70] = "ButtonHealEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTeleportEntity"] = 71] = "ButtonTeleportEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonCloneEntity"] = 72] = "ButtonCloneEntity";
        DebugToolsTranslation[DebugToolsTranslation["KillEntityDeathMessage"] = 73] = "KillEntityDeathMessage";
        DebugToolsTranslation[DebugToolsTranslation["CorpseName"] = 74] = "CorpseName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonResurrectCorpse"] = 75] = "ButtonResurrectCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRemoveThing"] = 76] = "ButtonRemoveThing";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTameCreature"] = 77] = "ButtonTameCreature";
        DebugToolsTranslation[DebugToolsTranslation["LabelWeightBonus"] = 78] = "LabelWeightBonus";
        DebugToolsTranslation[DebugToolsTranslation["LabelItem"] = 79] = "LabelItem";
        DebugToolsTranslation[DebugToolsTranslation["LabelMalignity"] = 80] = "LabelMalignity";
        DebugToolsTranslation[DebugToolsTranslation["LabelBenignity"] = 81] = "LabelBenignity";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportSelectLocation"] = 82] = "OptionTeleportSelectLocation";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToLocalPlayer"] = 83] = "OptionTeleportToLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToHost"] = 84] = "OptionTeleportToHost";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToPlayer"] = 85] = "OptionTeleportToPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleInvulnerable"] = 86] = "ButtonToggleInvulnerable";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleNoClip"] = 87] = "ButtonToggleNoClip";
        DebugToolsTranslation[DebugToolsTranslation["LabelSkill"] = 88] = "LabelSkill";
        DebugToolsTranslation[DebugToolsTranslation["None"] = 89] = "None";
        DebugToolsTranslation[DebugToolsTranslation["LabelQuality"] = 90] = "LabelQuality";
        DebugToolsTranslation[DebugToolsTranslation["AddToInventory"] = 91] = "AddToInventory";
        DebugToolsTranslation[DebugToolsTranslation["DoodadName"] = 92] = "DoodadName";
        DebugToolsTranslation[DebugToolsTranslation["TabItemStack"] = 93] = "TabItemStack";
        DebugToolsTranslation[DebugToolsTranslation["UnlockInspection"] = 94] = "UnlockInspection";
        DebugToolsTranslation[DebugToolsTranslation["LockInspection"] = 95] = "LockInspection";
        DebugToolsTranslation[DebugToolsTranslation["TileEventName"] = 96] = "TileEventName";
        DebugToolsTranslation[DebugToolsTranslation["ItemName"] = 97] = "ItemName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTogglePermissions"] = 98] = "ButtonTogglePermissions";
        DebugToolsTranslation[DebugToolsTranslation["ButtonSetGrowthStage"] = 99] = "ButtonSetGrowthStage";
        DebugToolsTranslation[DebugToolsTranslation["ActionResurrect"] = 100] = "ActionResurrect";
        DebugToolsTranslation[DebugToolsTranslation["ActionClone"] = 101] = "ActionClone";
        DebugToolsTranslation[DebugToolsTranslation["ActionTeleport"] = 102] = "ActionTeleport";
    })(DebugToolsTranslation = exports.DebugToolsTranslation || (exports.DebugToolsTranslation = {}));
    exports.DEBUG_TOOLS_ID = "Debug Tools";
    function translation(debugToolsTranslation) {
        return typeof debugToolsTranslation === "number" ? new Translation_1.default(DebugTools_1.default.INSTANCE.dictionary, debugToolsTranslation) : debugToolsTranslation;
    }
    exports.translation = translation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURlYnVnVG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvSURlYnVnVG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBU0EsSUFBWSxxQkF5SFg7SUF6SEQsV0FBWSxxQkFBcUI7UUFJaEMsdUZBQWUsQ0FBQTtRQUlmLHVGQUFlLENBQUE7UUFFZixpRkFBWSxDQUFBO1FBQ1osMkVBQVMsQ0FBQTtRQUNULG1GQUFhLENBQUE7UUFDYix5R0FBd0IsQ0FBQTtRQUN4QiwrRkFBbUIsQ0FBQTtRQUNuQiw2SEFBa0MsQ0FBQTtRQUNsQyxtSkFBNkMsQ0FBQTtRQUM3Qyx5R0FBd0IsQ0FBQTtRQUN4QixnR0FBbUIsQ0FBQTtRQUNuQiwwRkFBZ0IsQ0FBQTtRQUNoQiw0R0FBeUIsQ0FBQTtRQUN6QixnRkFBVyxDQUFBO1FBQ1gsc0ZBQWMsQ0FBQTtRQUVkLGtGQUFZLENBQUE7UUFDWix3RkFBZSxDQUFBO1FBQ2Ysa0dBQW9CLENBQUE7UUFDcEIsc0ZBQWMsQ0FBQTtRQUNkLDRFQUFTLENBQUE7UUFDVCw4RkFBa0IsQ0FBQTtRQUNsQiwwRkFBZ0IsQ0FBQTtRQUNoQixnR0FBbUIsQ0FBQTtRQUVuQiw4RUFBVSxDQUFBO1FBQ1YsZ0ZBQVcsQ0FBQTtRQUNYLG9GQUFhLENBQUE7UUFDYixnRkFBVyxDQUFBO1FBQ1gsa0ZBQVksQ0FBQTtRQUNaLDBGQUFnQixDQUFBO1FBQ2hCLDRGQUFpQixDQUFBO1FBQ2pCLGdHQUFtQixDQUFBO1FBQ25CLGtHQUFvQixDQUFBO1FBQ3BCLG9GQUFhLENBQUE7UUFDYixrR0FBb0IsQ0FBQTtRQUNwQiwwRUFBUSxDQUFBO1FBQ1IsZ0ZBQVcsQ0FBQTtRQUNYLGdGQUFXLENBQUE7UUFDWCxvR0FBcUIsQ0FBQTtRQUNyQixzRkFBYyxDQUFBO1FBQ2QsNEZBQWlCLENBQUE7UUFFakIsc0ZBQWMsQ0FBQTtRQUNkLHdGQUFlLENBQUE7UUFDZix3RkFBZSxDQUFBO1FBQ2Ysd0ZBQWUsQ0FBQTtRQUNmLDBGQUFnQixDQUFBO1FBQ2hCLDRFQUFTLENBQUE7UUFDVCxvRkFBYSxDQUFBO1FBQ2Isa0ZBQVksQ0FBQTtRQUNaLHdGQUFlLENBQUE7UUFDZiw4RUFBVSxDQUFBO1FBQ1YsMEZBQWdCLENBQUE7UUFDaEIsa0ZBQVksQ0FBQTtRQUNaLG9GQUFhLENBQUE7UUFFYixzRkFBYyxDQUFBO1FBQ2QsNEZBQWlCLENBQUE7UUFDakIsb0ZBQWEsQ0FBQTtRQUNiLHNHQUFzQixDQUFBO1FBQ3RCLDBHQUF3QixDQUFBO1FBQ3hCLGdGQUFXLENBQUE7UUFDWCxnRkFBVyxDQUFBO1FBQ1gsOEZBQWtCLENBQUE7UUFDbEIsa0ZBQVksQ0FBQTtRQUNaLDhGQUFrQixDQUFBO1FBSWxCLDhGQUFrQixDQUFBO1FBQ2xCLDBGQUFnQixDQUFBO1FBQ2hCLHNGQUFjLENBQUE7UUFDZCw4RkFBa0IsQ0FBQTtRQUNsQiw4RkFBa0IsQ0FBQTtRQUNsQiw4RUFBVSxDQUFBO1FBQ1YsMEZBQWdCLENBQUE7UUFDaEIsMEZBQWdCLENBQUE7UUFDaEIsa0dBQW9CLENBQUE7UUFDcEIsNEZBQWlCLENBQUE7UUFDakIsc0dBQXNCLENBQUE7UUFDdEIsOEVBQVUsQ0FBQTtRQUNWLG9HQUFxQixDQUFBO1FBQ3JCLDRGQUFpQixDQUFBO1FBQ2pCLDhGQUFrQixDQUFBO1FBQ2xCLDBGQUFnQixDQUFBO1FBQ2hCLDRFQUFTLENBQUE7UUFDVCxzRkFBYyxDQUFBO1FBQ2Qsc0ZBQWMsQ0FBQTtRQUNkLGtIQUE0QixDQUFBO1FBQzVCLGdIQUEyQixDQUFBO1FBQzNCLGtHQUFvQixDQUFBO1FBQ3BCLHNHQUFzQixDQUFBO1FBQ3RCLDBHQUF3QixDQUFBO1FBQ3hCLDhGQUFrQixDQUFBO1FBQ2xCLDhFQUFVLENBQUE7UUFDVixrRUFBSSxDQUFBO1FBQ0osa0ZBQVksQ0FBQTtRQUNaLHNGQUFjLENBQUE7UUFDZCw4RUFBVSxDQUFBO1FBQ1Ysa0ZBQVksQ0FBQTtRQUNaLDBGQUFnQixDQUFBO1FBQ2hCLHNGQUFjLENBQUE7UUFDZCxvRkFBYSxDQUFBO1FBQ2IsMEVBQVEsQ0FBQTtRQUNSLHdHQUF1QixDQUFBO1FBQ3ZCLGtHQUFvQixDQUFBO1FBSXBCLHlGQUFlLENBQUE7UUFDZixpRkFBVyxDQUFBO1FBQ1gsdUZBQWMsQ0FBQTtJQUNmLENBQUMsRUF6SFcscUJBQXFCLEdBQXJCLDZCQUFxQixLQUFyQiw2QkFBcUIsUUF5SGhDO0lBc0RZLFFBQUEsY0FBYyxHQUFHLGFBQWEsQ0FBQztJQU01QyxTQUFnQixXQUFXLENBQUMscUJBQTBEO1FBQ3JGLE9BQU8sT0FBTyxxQkFBcUIsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUkscUJBQVcsQ0FBQyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUM7SUFDbkosQ0FBQztJQUZELGtDQUVDIn0=
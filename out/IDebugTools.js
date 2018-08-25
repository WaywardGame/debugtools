define(["require", "exports", "./DebugTools"], function (require, exports, DebugTools_1) {
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
        DebugToolsTranslation[DebugToolsTranslation["PanelDisplay"] = 13] = "PanelDisplay";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleFog"] = 14] = "ButtonToggleFog";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleLighting"] = 15] = "ButtonToggleLighting";
        DebugToolsTranslation[DebugToolsTranslation["LabelZoomLevel"] = 16] = "LabelZoomLevel";
        DebugToolsTranslation[DebugToolsTranslation["ZoomLevel"] = 17] = "ZoomLevel";
        DebugToolsTranslation[DebugToolsTranslation["ButtonUnlockCamera"] = 18] = "ButtonUnlockCamera";
        DebugToolsTranslation[DebugToolsTranslation["ButtonResetWebGL"] = 19] = "ButtonResetWebGL";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReloadShaders"] = 20] = "ButtonReloadShaders";
        DebugToolsTranslation[DebugToolsTranslation["PanelPaint"] = 21] = "PanelPaint";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaint"] = 22] = "ButtonPaint";
        DebugToolsTranslation[DebugToolsTranslation["PaintNoChange"] = 23] = "PaintNoChange";
        DebugToolsTranslation[DebugToolsTranslation["PaintRemove"] = 24] = "PaintRemove";
        DebugToolsTranslation[DebugToolsTranslation["LabelTerrain"] = 25] = "LabelTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaintClear"] = 26] = "ButtonPaintClear";
        DebugToolsTranslation[DebugToolsTranslation["TooltipPaintClear"] = 27] = "TooltipPaintClear";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaintComplete"] = 28] = "ButtonPaintComplete";
        DebugToolsTranslation[DebugToolsTranslation["TooltipPaintComplete"] = 29] = "TooltipPaintComplete";
        DebugToolsTranslation[DebugToolsTranslation["LabelCreature"] = 30] = "LabelCreature";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleAberrant"] = 31] = "ButtonToggleAberrant";
        DebugToolsTranslation[DebugToolsTranslation["LabelNPC"] = 32] = "LabelNPC";
        DebugToolsTranslation[DebugToolsTranslation["LabelDoodad"] = 33] = "LabelDoodad";
        DebugToolsTranslation[DebugToolsTranslation["LabelCorpse"] = 34] = "LabelCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReplaceExisting"] = 35] = "ButtonReplaceExisting";
        DebugToolsTranslation[DebugToolsTranslation["LabelTileEvent"] = 36] = "LabelTileEvent";
        DebugToolsTranslation[DebugToolsTranslation["ResetPaintSection"] = 37] = "ResetPaintSection";
        DebugToolsTranslation[DebugToolsTranslation["DialogTitleInspect"] = 38] = "DialogTitleInspect";
        DebugToolsTranslation[DebugToolsTranslation["InspectTileTitle"] = 39] = "InspectTileTitle";
        DebugToolsTranslation[DebugToolsTranslation["InspectTerrain"] = 40] = "InspectTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonChangeTerrain"] = 41] = "ButtonChangeTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleTilled"] = 42] = "ButtonToggleTilled";
        DebugToolsTranslation[DebugToolsTranslation["EntityName"] = 43] = "EntityName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonKillEntity"] = 44] = "ButtonKillEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonHealEntity"] = 45] = "ButtonHealEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTeleportEntity"] = 46] = "ButtonTeleportEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonCloneEntity"] = 47] = "ButtonCloneEntity";
        DebugToolsTranslation[DebugToolsTranslation["KillEntityDeathMessage"] = 48] = "KillEntityDeathMessage";
        DebugToolsTranslation[DebugToolsTranslation["CorpseName"] = 49] = "CorpseName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonResurrectCorpse"] = 50] = "ButtonResurrectCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRemoveThing"] = 51] = "ButtonRemoveThing";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTameCreature"] = 52] = "ButtonTameCreature";
        DebugToolsTranslation[DebugToolsTranslation["LabelWeightBonus"] = 53] = "LabelWeightBonus";
        DebugToolsTranslation[DebugToolsTranslation["LabelItem"] = 54] = "LabelItem";
        DebugToolsTranslation[DebugToolsTranslation["LabelMalignity"] = 55] = "LabelMalignity";
        DebugToolsTranslation[DebugToolsTranslation["LabelBenignity"] = 56] = "LabelBenignity";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportSelectLocation"] = 57] = "OptionTeleportSelectLocation";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToLocalPlayer"] = 58] = "OptionTeleportToLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToHost"] = 59] = "OptionTeleportToHost";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToPlayer"] = 60] = "OptionTeleportToPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleInvulnerable"] = 61] = "ButtonToggleInvulnerable";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleNoClip"] = 62] = "ButtonToggleNoClip";
        DebugToolsTranslation[DebugToolsTranslation["LabelSkill"] = 63] = "LabelSkill";
        DebugToolsTranslation[DebugToolsTranslation["None"] = 64] = "None";
        DebugToolsTranslation[DebugToolsTranslation["LabelQuality"] = 65] = "LabelQuality";
        DebugToolsTranslation[DebugToolsTranslation["AddToInventory"] = 66] = "AddToInventory";
        DebugToolsTranslation[DebugToolsTranslation["DoodadName"] = 67] = "DoodadName";
        DebugToolsTranslation[DebugToolsTranslation["TabItemStack"] = 68] = "TabItemStack";
        DebugToolsTranslation[DebugToolsTranslation["UnlockInspection"] = 69] = "UnlockInspection";
        DebugToolsTranslation[DebugToolsTranslation["LockInspection"] = 70] = "LockInspection";
        DebugToolsTranslation[DebugToolsTranslation["TileEventName"] = 71] = "TileEventName";
        DebugToolsTranslation[DebugToolsTranslation["ActionResurrect"] = 72] = "ActionResurrect";
        DebugToolsTranslation[DebugToolsTranslation["ActionClone"] = 73] = "ActionClone";
        DebugToolsTranslation[DebugToolsTranslation["ActionTeleport"] = 74] = "ActionTeleport";
    })(DebugToolsTranslation = exports.DebugToolsTranslation || (exports.DebugToolsTranslation = {}));
    function isPaintOverlay(overlay) {
        return overlay.type === DebugTools_1.default.INSTANCE.overlayPaint;
    }
    exports.isPaintOverlay = isPaintOverlay;
    function isHoverTargetOverlay(overlay) {
        return overlay.type === DebugTools_1.default.INSTANCE.overlayTarget && !("red" in overlay);
    }
    exports.isHoverTargetOverlay = isHoverTargetOverlay;
    function isSelectedTargetOverlay(overlay) {
        return overlay.type === DebugTools_1.default.INSTANCE.overlayTarget && "red" in overlay;
    }
    exports.isSelectedTargetOverlay = isSelectedTargetOverlay;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURlYnVnVG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvSURlYnVnVG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBR0EsSUFBWSxxQkF5R1g7SUF6R0QsV0FBWSxxQkFBcUI7UUFLaEMsdUZBQWUsQ0FBQTtRQU1mLHVGQUFlLENBQUE7UUFHZixpRkFBWSxDQUFBO1FBRVosMkVBQVMsQ0FBQTtRQUNULG1GQUFhLENBQUE7UUFDYix5R0FBd0IsQ0FBQTtRQUN4QiwrRkFBbUIsQ0FBQTtRQUNuQiw2SEFBa0MsQ0FBQTtRQUNsQyxtSkFBNkMsQ0FBQTtRQUM3Qyx5R0FBd0IsQ0FBQTtRQUN4QixnR0FBbUIsQ0FBQTtRQUNuQiwwRkFBZ0IsQ0FBQTtRQUNoQiw0R0FBeUIsQ0FBQTtRQUd6QixrRkFBWSxDQUFBO1FBRVosd0ZBQWUsQ0FBQTtRQUNmLGtHQUFvQixDQUFBO1FBQ3BCLHNGQUFjLENBQUE7UUFDZCw0RUFBUyxDQUFBO1FBQ1QsOEZBQWtCLENBQUE7UUFDbEIsMEZBQWdCLENBQUE7UUFDaEIsZ0dBQW1CLENBQUE7UUFHbkIsOEVBQVUsQ0FBQTtRQUVWLGdGQUFXLENBQUE7UUFDWCxvRkFBYSxDQUFBO1FBQ2IsZ0ZBQVcsQ0FBQTtRQUNYLGtGQUFZLENBQUE7UUFDWiwwRkFBZ0IsQ0FBQTtRQUNoQiw0RkFBaUIsQ0FBQTtRQUNqQixnR0FBbUIsQ0FBQTtRQUNuQixrR0FBb0IsQ0FBQTtRQUNwQixvRkFBYSxDQUFBO1FBQ2Isa0dBQW9CLENBQUE7UUFDcEIsMEVBQVEsQ0FBQTtRQUNSLGdGQUFXLENBQUE7UUFDWCxnRkFBVyxDQUFBO1FBQ1gsb0dBQXFCLENBQUE7UUFDckIsc0ZBQWMsQ0FBQTtRQUNkLDRGQUFpQixDQUFBO1FBTWpCLDhGQUFrQixDQUFBO1FBRWxCLDBGQUFnQixDQUFBO1FBQ2hCLHNGQUFjLENBQUE7UUFDZCxnR0FBbUIsQ0FBQTtRQUNuQiw4RkFBa0IsQ0FBQTtRQUNsQiw4RUFBVSxDQUFBO1FBQ1YsMEZBQWdCLENBQUE7UUFDaEIsMEZBQWdCLENBQUE7UUFDaEIsa0dBQW9CLENBQUE7UUFDcEIsNEZBQWlCLENBQUE7UUFDakIsc0dBQXNCLENBQUE7UUFDdEIsOEVBQVUsQ0FBQTtRQUNWLG9HQUFxQixDQUFBO1FBQ3JCLDRGQUFpQixDQUFBO1FBQ2pCLDhGQUFrQixDQUFBO1FBQ2xCLDBGQUFnQixDQUFBO1FBQ2hCLDRFQUFTLENBQUE7UUFDVCxzRkFBYyxDQUFBO1FBQ2Qsc0ZBQWMsQ0FBQTtRQUNkLGtIQUE0QixDQUFBO1FBQzVCLGdIQUEyQixDQUFBO1FBQzNCLGtHQUFvQixDQUFBO1FBQ3BCLHNHQUFzQixDQUFBO1FBQ3RCLDBHQUF3QixDQUFBO1FBQ3hCLDhGQUFrQixDQUFBO1FBQ2xCLDhFQUFVLENBQUE7UUFDVixrRUFBSSxDQUFBO1FBQ0osa0ZBQVksQ0FBQTtRQUNaLHNGQUFjLENBQUE7UUFDZCw4RUFBVSxDQUFBO1FBQ1Ysa0ZBQVksQ0FBQTtRQUNaLDBGQUFnQixDQUFBO1FBQ2hCLHNGQUFjLENBQUE7UUFDZCxvRkFBYSxDQUFBO1FBTWIsd0ZBQWUsQ0FBQTtRQUNmLGdGQUFXLENBQUE7UUFDWCxzRkFBYyxDQUFBO0lBQ2YsQ0FBQyxFQXpHVyxxQkFBcUIsR0FBckIsNkJBQXFCLEtBQXJCLDZCQUFxQixRQXlHaEM7SUFzQkQsU0FBZ0IsY0FBYyxDQUFDLE9BQXFCO1FBQ25ELE9BQU8sT0FBTyxDQUFDLElBQUksS0FBSyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7SUFDMUQsQ0FBQztJQUZELHdDQUVDO0lBRUQsU0FBZ0Isb0JBQW9CLENBQUMsT0FBcUI7UUFDekQsT0FBTyxPQUFPLENBQUMsSUFBSSxLQUFLLG9CQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFGRCxvREFFQztJQUVELFNBQWdCLHVCQUF1QixDQUFDLE9BQXFCO1FBQzVELE9BQU8sT0FBTyxDQUFDLElBQUksS0FBSyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxhQUFhLElBQUksS0FBSyxJQUFJLE9BQU8sQ0FBQztJQUMvRSxDQUFDO0lBRkQsMERBRUMifQ==
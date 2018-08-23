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
        DebugToolsTranslation[DebugToolsTranslation["PanelDisplay"] = 11] = "PanelDisplay";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleFog"] = 12] = "ButtonToggleFog";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleLighting"] = 13] = "ButtonToggleLighting";
        DebugToolsTranslation[DebugToolsTranslation["LabelZoomLevel"] = 14] = "LabelZoomLevel";
        DebugToolsTranslation[DebugToolsTranslation["ZoomLevel"] = 15] = "ZoomLevel";
        DebugToolsTranslation[DebugToolsTranslation["ButtonUnlockCamera"] = 16] = "ButtonUnlockCamera";
        DebugToolsTranslation[DebugToolsTranslation["ButtonResetWebGL"] = 17] = "ButtonResetWebGL";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReloadShaders"] = 18] = "ButtonReloadShaders";
        DebugToolsTranslation[DebugToolsTranslation["PanelPaint"] = 19] = "PanelPaint";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaint"] = 20] = "ButtonPaint";
        DebugToolsTranslation[DebugToolsTranslation["PaintNoChange"] = 21] = "PaintNoChange";
        DebugToolsTranslation[DebugToolsTranslation["PaintRemove"] = 22] = "PaintRemove";
        DebugToolsTranslation[DebugToolsTranslation["LabelTerrain"] = 23] = "LabelTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaintClear"] = 24] = "ButtonPaintClear";
        DebugToolsTranslation[DebugToolsTranslation["TooltipPaintClear"] = 25] = "TooltipPaintClear";
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaintComplete"] = 26] = "ButtonPaintComplete";
        DebugToolsTranslation[DebugToolsTranslation["TooltipPaintComplete"] = 27] = "TooltipPaintComplete";
        DebugToolsTranslation[DebugToolsTranslation["LabelCreature"] = 28] = "LabelCreature";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleAberrant"] = 29] = "ButtonToggleAberrant";
        DebugToolsTranslation[DebugToolsTranslation["LabelNPC"] = 30] = "LabelNPC";
        DebugToolsTranslation[DebugToolsTranslation["LabelDoodad"] = 31] = "LabelDoodad";
        DebugToolsTranslation[DebugToolsTranslation["LabelCorpse"] = 32] = "LabelCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReplaceExisting"] = 33] = "ButtonReplaceExisting";
        DebugToolsTranslation[DebugToolsTranslation["LabelTileEvent"] = 34] = "LabelTileEvent";
        DebugToolsTranslation[DebugToolsTranslation["ResetPaintSection"] = 35] = "ResetPaintSection";
        DebugToolsTranslation[DebugToolsTranslation["DialogTitleInspect"] = 36] = "DialogTitleInspect";
        DebugToolsTranslation[DebugToolsTranslation["InspectTileTitle"] = 37] = "InspectTileTitle";
        DebugToolsTranslation[DebugToolsTranslation["InspectTerrain"] = 38] = "InspectTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonChangeTerrain"] = 39] = "ButtonChangeTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleTilled"] = 40] = "ButtonToggleTilled";
        DebugToolsTranslation[DebugToolsTranslation["EntityName"] = 41] = "EntityName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonKillEntity"] = 42] = "ButtonKillEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonHealEntity"] = 43] = "ButtonHealEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTeleportEntity"] = 44] = "ButtonTeleportEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonCloneEntity"] = 45] = "ButtonCloneEntity";
        DebugToolsTranslation[DebugToolsTranslation["KillEntityDeathMessage"] = 46] = "KillEntityDeathMessage";
        DebugToolsTranslation[DebugToolsTranslation["CorpseName"] = 47] = "CorpseName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonResurrectCorpse"] = 48] = "ButtonResurrectCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRemoveThing"] = 49] = "ButtonRemoveThing";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTameCreature"] = 50] = "ButtonTameCreature";
        DebugToolsTranslation[DebugToolsTranslation["LabelWeightBonus"] = 51] = "LabelWeightBonus";
        DebugToolsTranslation[DebugToolsTranslation["LabelItem"] = 52] = "LabelItem";
        DebugToolsTranslation[DebugToolsTranslation["LabelMalignity"] = 53] = "LabelMalignity";
        DebugToolsTranslation[DebugToolsTranslation["LabelBenignity"] = 54] = "LabelBenignity";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportSelectLocation"] = 55] = "OptionTeleportSelectLocation";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToLocalPlayer"] = 56] = "OptionTeleportToLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToHost"] = 57] = "OptionTeleportToHost";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToPlayer"] = 58] = "OptionTeleportToPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleInvulnerable"] = 59] = "ButtonToggleInvulnerable";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleNoClip"] = 60] = "ButtonToggleNoClip";
        DebugToolsTranslation[DebugToolsTranslation["LabelSkill"] = 61] = "LabelSkill";
        DebugToolsTranslation[DebugToolsTranslation["None"] = 62] = "None";
        DebugToolsTranslation[DebugToolsTranslation["LabelQuality"] = 63] = "LabelQuality";
        DebugToolsTranslation[DebugToolsTranslation["AddToInventory"] = 64] = "AddToInventory";
        DebugToolsTranslation[DebugToolsTranslation["DoodadName"] = 65] = "DoodadName";
        DebugToolsTranslation[DebugToolsTranslation["TabItemStack"] = 66] = "TabItemStack";
        DebugToolsTranslation[DebugToolsTranslation["UnlockInspection"] = 67] = "UnlockInspection";
        DebugToolsTranslation[DebugToolsTranslation["LockInspection"] = 68] = "LockInspection";
        DebugToolsTranslation[DebugToolsTranslation["TileEventName"] = 69] = "TileEventName";
        DebugToolsTranslation[DebugToolsTranslation["ActionResurrect"] = 70] = "ActionResurrect";
        DebugToolsTranslation[DebugToolsTranslation["ActionClone"] = 71] = "ActionClone";
        DebugToolsTranslation[DebugToolsTranslation["ActionTeleport"] = 72] = "ActionTeleport";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURlYnVnVG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvSURlYnVnVG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBR0EsSUFBWSxxQkF1R1g7SUF2R0QsV0FBWSxxQkFBcUI7UUFLaEMsdUZBQWUsQ0FBQTtRQU1mLHVGQUFlLENBQUE7UUFHZixpRkFBWSxDQUFBO1FBRVosMkVBQVMsQ0FBQTtRQUNULG1GQUFhLENBQUE7UUFDYix5R0FBd0IsQ0FBQTtRQUN4QiwrRkFBbUIsQ0FBQTtRQUNuQiw2SEFBa0MsQ0FBQTtRQUNsQyxtSkFBNkMsQ0FBQTtRQUM3Qyx5R0FBd0IsQ0FBQTtRQUN4QixnR0FBbUIsQ0FBQTtRQUduQixrRkFBWSxDQUFBO1FBRVosd0ZBQWUsQ0FBQTtRQUNmLGtHQUFvQixDQUFBO1FBQ3BCLHNGQUFjLENBQUE7UUFDZCw0RUFBUyxDQUFBO1FBQ1QsOEZBQWtCLENBQUE7UUFDbEIsMEZBQWdCLENBQUE7UUFDaEIsZ0dBQW1CLENBQUE7UUFHbkIsOEVBQVUsQ0FBQTtRQUVWLGdGQUFXLENBQUE7UUFDWCxvRkFBYSxDQUFBO1FBQ2IsZ0ZBQVcsQ0FBQTtRQUNYLGtGQUFZLENBQUE7UUFDWiwwRkFBZ0IsQ0FBQTtRQUNoQiw0RkFBaUIsQ0FBQTtRQUNqQixnR0FBbUIsQ0FBQTtRQUNuQixrR0FBb0IsQ0FBQTtRQUNwQixvRkFBYSxDQUFBO1FBQ2Isa0dBQW9CLENBQUE7UUFDcEIsMEVBQVEsQ0FBQTtRQUNSLGdGQUFXLENBQUE7UUFDWCxnRkFBVyxDQUFBO1FBQ1gsb0dBQXFCLENBQUE7UUFDckIsc0ZBQWMsQ0FBQTtRQUNkLDRGQUFpQixDQUFBO1FBTWpCLDhGQUFrQixDQUFBO1FBRWxCLDBGQUFnQixDQUFBO1FBQ2hCLHNGQUFjLENBQUE7UUFDZCxnR0FBbUIsQ0FBQTtRQUNuQiw4RkFBa0IsQ0FBQTtRQUNsQiw4RUFBVSxDQUFBO1FBQ1YsMEZBQWdCLENBQUE7UUFDaEIsMEZBQWdCLENBQUE7UUFDaEIsa0dBQW9CLENBQUE7UUFDcEIsNEZBQWlCLENBQUE7UUFDakIsc0dBQXNCLENBQUE7UUFDdEIsOEVBQVUsQ0FBQTtRQUNWLG9HQUFxQixDQUFBO1FBQ3JCLDRGQUFpQixDQUFBO1FBQ2pCLDhGQUFrQixDQUFBO1FBQ2xCLDBGQUFnQixDQUFBO1FBQ2hCLDRFQUFTLENBQUE7UUFDVCxzRkFBYyxDQUFBO1FBQ2Qsc0ZBQWMsQ0FBQTtRQUNkLGtIQUE0QixDQUFBO1FBQzVCLGdIQUEyQixDQUFBO1FBQzNCLGtHQUFvQixDQUFBO1FBQ3BCLHNHQUFzQixDQUFBO1FBQ3RCLDBHQUF3QixDQUFBO1FBQ3hCLDhGQUFrQixDQUFBO1FBQ2xCLDhFQUFVLENBQUE7UUFDVixrRUFBSSxDQUFBO1FBQ0osa0ZBQVksQ0FBQTtRQUNaLHNGQUFjLENBQUE7UUFDZCw4RUFBVSxDQUFBO1FBQ1Ysa0ZBQVksQ0FBQTtRQUNaLDBGQUFnQixDQUFBO1FBQ2hCLHNGQUFjLENBQUE7UUFDZCxvRkFBYSxDQUFBO1FBTWIsd0ZBQWUsQ0FBQTtRQUNmLGdGQUFXLENBQUE7UUFDWCxzRkFBYyxDQUFBO0lBQ2YsQ0FBQyxFQXZHVyxxQkFBcUIsR0FBckIsNkJBQXFCLEtBQXJCLDZCQUFxQixRQXVHaEM7SUFzQkQsU0FBZ0IsY0FBYyxDQUFDLE9BQXFCO1FBQ25ELE9BQU8sT0FBTyxDQUFDLElBQUksS0FBSyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7SUFDMUQsQ0FBQztJQUZELHdDQUVDO0lBRUQsU0FBZ0Isb0JBQW9CLENBQUMsT0FBcUI7UUFDekQsT0FBTyxPQUFPLENBQUMsSUFBSSxLQUFLLG9CQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFGRCxvREFFQztJQUVELFNBQWdCLHVCQUF1QixDQUFDLE9BQXFCO1FBQzVELE9BQU8sT0FBTyxDQUFDLElBQUksS0FBSyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxhQUFhLElBQUksS0FBSyxJQUFJLE9BQU8sQ0FBQztJQUMvRSxDQUFDO0lBRkQsMERBRUMifQ==
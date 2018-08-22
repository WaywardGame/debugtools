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
        DebugToolsTranslation[DebugToolsTranslation["ButtonPaintComplete"] = 25] = "ButtonPaintComplete";
        DebugToolsTranslation[DebugToolsTranslation["LabelCreature"] = 26] = "LabelCreature";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleAberrant"] = 27] = "ButtonToggleAberrant";
        DebugToolsTranslation[DebugToolsTranslation["LabelNPC"] = 28] = "LabelNPC";
        DebugToolsTranslation[DebugToolsTranslation["LabelDoodad"] = 29] = "LabelDoodad";
        DebugToolsTranslation[DebugToolsTranslation["LabelCorpse"] = 30] = "LabelCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonReplaceExisting"] = 31] = "ButtonReplaceExisting";
        DebugToolsTranslation[DebugToolsTranslation["LabelTileEvent"] = 32] = "LabelTileEvent";
        DebugToolsTranslation[DebugToolsTranslation["DialogTitleInspect"] = 33] = "DialogTitleInspect";
        DebugToolsTranslation[DebugToolsTranslation["InspectTileTitle"] = 34] = "InspectTileTitle";
        DebugToolsTranslation[DebugToolsTranslation["InspectTerrain"] = 35] = "InspectTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonChangeTerrain"] = 36] = "ButtonChangeTerrain";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleTilled"] = 37] = "ButtonToggleTilled";
        DebugToolsTranslation[DebugToolsTranslation["EntityName"] = 38] = "EntityName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonKillEntity"] = 39] = "ButtonKillEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonHealEntity"] = 40] = "ButtonHealEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTeleportEntity"] = 41] = "ButtonTeleportEntity";
        DebugToolsTranslation[DebugToolsTranslation["ButtonCloneEntity"] = 42] = "ButtonCloneEntity";
        DebugToolsTranslation[DebugToolsTranslation["KillEntityDeathMessage"] = 43] = "KillEntityDeathMessage";
        DebugToolsTranslation[DebugToolsTranslation["CorpseName"] = 44] = "CorpseName";
        DebugToolsTranslation[DebugToolsTranslation["ButtonResurrectCorpse"] = 45] = "ButtonResurrectCorpse";
        DebugToolsTranslation[DebugToolsTranslation["ButtonRemoveThing"] = 46] = "ButtonRemoveThing";
        DebugToolsTranslation[DebugToolsTranslation["ButtonTameCreature"] = 47] = "ButtonTameCreature";
        DebugToolsTranslation[DebugToolsTranslation["LabelWeightBonus"] = 48] = "LabelWeightBonus";
        DebugToolsTranslation[DebugToolsTranslation["LabelItem"] = 49] = "LabelItem";
        DebugToolsTranslation[DebugToolsTranslation["LabelMalignity"] = 50] = "LabelMalignity";
        DebugToolsTranslation[DebugToolsTranslation["LabelBenignity"] = 51] = "LabelBenignity";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportSelectLocation"] = 52] = "OptionTeleportSelectLocation";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToLocalPlayer"] = 53] = "OptionTeleportToLocalPlayer";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToHost"] = 54] = "OptionTeleportToHost";
        DebugToolsTranslation[DebugToolsTranslation["OptionTeleportToPlayer"] = 55] = "OptionTeleportToPlayer";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleInvulnerable"] = 56] = "ButtonToggleInvulnerable";
        DebugToolsTranslation[DebugToolsTranslation["ButtonToggleNoClip"] = 57] = "ButtonToggleNoClip";
        DebugToolsTranslation[DebugToolsTranslation["LabelSkill"] = 58] = "LabelSkill";
        DebugToolsTranslation[DebugToolsTranslation["None"] = 59] = "None";
        DebugToolsTranslation[DebugToolsTranslation["LabelQuality"] = 60] = "LabelQuality";
        DebugToolsTranslation[DebugToolsTranslation["AddToInventory"] = 61] = "AddToInventory";
        DebugToolsTranslation[DebugToolsTranslation["ActionResurrect"] = 62] = "ActionResurrect";
        DebugToolsTranslation[DebugToolsTranslation["ActionClone"] = 63] = "ActionClone";
        DebugToolsTranslation[DebugToolsTranslation["ActionTeleport"] = 64] = "ActionTeleport";
    })(DebugToolsTranslation = exports.DebugToolsTranslation || (exports.DebugToolsTranslation = {}));
    var DebugToolsEvent;
    (function (DebugToolsEvent) {
        DebugToolsEvent["UpdateSpectateState"] = "UpdateSpectateState";
    })(DebugToolsEvent = exports.DebugToolsEvent || (exports.DebugToolsEvent = {}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSURlYnVnVG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvSURlYnVnVG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBR0EsSUFBWSxxQkErRlg7SUEvRkQsV0FBWSxxQkFBcUI7UUFLaEMsdUZBQWUsQ0FBQTtRQU1mLHVGQUFlLENBQUE7UUFHZixpRkFBWSxDQUFBO1FBRVosMkVBQVMsQ0FBQTtRQUNULG1GQUFhLENBQUE7UUFDYix5R0FBd0IsQ0FBQTtRQUN4QiwrRkFBbUIsQ0FBQTtRQUNuQiw2SEFBa0MsQ0FBQTtRQUNsQyxtSkFBNkMsQ0FBQTtRQUM3Qyx5R0FBd0IsQ0FBQTtRQUN4QixnR0FBbUIsQ0FBQTtRQUduQixrRkFBWSxDQUFBO1FBRVosd0ZBQWUsQ0FBQTtRQUNmLGtHQUFvQixDQUFBO1FBQ3BCLHNGQUFjLENBQUE7UUFDZCw0RUFBUyxDQUFBO1FBQ1QsOEZBQWtCLENBQUE7UUFDbEIsMEZBQWdCLENBQUE7UUFDaEIsZ0dBQW1CLENBQUE7UUFHbkIsOEVBQVUsQ0FBQTtRQUVWLGdGQUFXLENBQUE7UUFDWCxvRkFBYSxDQUFBO1FBQ2IsZ0ZBQVcsQ0FBQTtRQUNYLGtGQUFZLENBQUE7UUFDWiwwRkFBZ0IsQ0FBQTtRQUNoQixnR0FBbUIsQ0FBQTtRQUNuQixvRkFBYSxDQUFBO1FBQ2Isa0dBQW9CLENBQUE7UUFDcEIsMEVBQVEsQ0FBQTtRQUNSLGdGQUFXLENBQUE7UUFDWCxnRkFBVyxDQUFBO1FBQ1gsb0dBQXFCLENBQUE7UUFDckIsc0ZBQWMsQ0FBQTtRQU1kLDhGQUFrQixDQUFBO1FBRWxCLDBGQUFnQixDQUFBO1FBQ2hCLHNGQUFjLENBQUE7UUFDZCxnR0FBbUIsQ0FBQTtRQUNuQiw4RkFBa0IsQ0FBQTtRQUNsQiw4RUFBVSxDQUFBO1FBQ1YsMEZBQWdCLENBQUE7UUFDaEIsMEZBQWdCLENBQUE7UUFDaEIsa0dBQW9CLENBQUE7UUFDcEIsNEZBQWlCLENBQUE7UUFDakIsc0dBQXNCLENBQUE7UUFDdEIsOEVBQVUsQ0FBQTtRQUNWLG9HQUFxQixDQUFBO1FBQ3JCLDRGQUFpQixDQUFBO1FBQ2pCLDhGQUFrQixDQUFBO1FBQ2xCLDBGQUFnQixDQUFBO1FBQ2hCLDRFQUFTLENBQUE7UUFDVCxzRkFBYyxDQUFBO1FBQ2Qsc0ZBQWMsQ0FBQTtRQUNkLGtIQUE0QixDQUFBO1FBQzVCLGdIQUEyQixDQUFBO1FBQzNCLGtHQUFvQixDQUFBO1FBQ3BCLHNHQUFzQixDQUFBO1FBQ3RCLDBHQUF3QixDQUFBO1FBQ3hCLDhGQUFrQixDQUFBO1FBQ2xCLDhFQUFVLENBQUE7UUFDVixrRUFBSSxDQUFBO1FBQ0osa0ZBQVksQ0FBQTtRQUNaLHNGQUFjLENBQUE7UUFNZCx3RkFBZSxDQUFBO1FBQ2YsZ0ZBQVcsQ0FBQTtRQUNYLHNGQUFjLENBQUE7SUFDZixDQUFDLEVBL0ZXLHFCQUFxQixHQUFyQiw2QkFBcUIsS0FBckIsNkJBQXFCLFFBK0ZoQztJQXNCRCxJQUFZLGVBRVg7SUFGRCxXQUFZLGVBQWU7UUFDMUIsOERBQTJDLENBQUE7SUFDNUMsQ0FBQyxFQUZXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBRTFCO0lBRUQsU0FBZ0IsY0FBYyxDQUFDLE9BQXFCO1FBQ25ELE9BQU8sT0FBTyxDQUFDLElBQUksS0FBSyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7SUFDMUQsQ0FBQztJQUZELHdDQUVDO0lBRUQsU0FBZ0Isb0JBQW9CLENBQUMsT0FBcUI7UUFDekQsT0FBTyxPQUFPLENBQUMsSUFBSSxLQUFLLG9CQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFGRCxvREFFQztJQUVELFNBQWdCLHVCQUF1QixDQUFDLE9BQXFCO1FBQzVELE9BQU8sT0FBTyxDQUFDLElBQUksS0FBSyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxhQUFhLElBQUksS0FBSyxJQUFJLE9BQU8sQ0FBQztJQUMvRSxDQUFDO0lBRkQsMERBRUMifQ==
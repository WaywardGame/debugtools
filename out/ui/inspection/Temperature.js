var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventBuses", "event/EventManager", "game/inspection/IInfoProvider", "game/inspection/IInspection", "game/inspection/InfoProvider", "game/inspection/Inspection", "game/temperature/ITemperature", "game/temperature/TemperatureManager", "language/dictionary/Misc", "language/Translation", "mod/Mod", "ui/component/Text", "../../IDebugTools"], function (require, exports, EventBuses_1, EventManager_1, IInfoProvider_1, IInspection_1, InfoProvider_1, Inspection_1, ITemperature_1, TemperatureManager_1, Misc_1, Translation_1, Mod_1, Text_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TemperatureInspection extends Inspection_1.default {
        constructor(tile) {
            super(TemperatureInspection.DEBUG_TOOLS.inspectionTemperature, tile);
        }
        static getFromTile(position) {
            return TemperatureInspection.DEBUG_TOOLS ? new TemperatureInspection(position) : [];
        }
        getId() {
            return this.createIdFromVector3(this.value);
        }
        getPriority() {
            return IInspection_1.basicInspectionPriorities[IInspection_1.InspectType.Tile] + 100;
        }
        hasContent() {
            return game.playing && this.getTileMod() !== "?";
        }
        get(context) {
            return [
                InfoProvider_1.InfoProvider.create()
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.NonExtra)
                    .add((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperature)
                    .addArgs(localIsland.temperature.get(this.value.x, this.value.y, this.value.z, undefined))),
                InfoProvider_1.InfoProvider.title()
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Extra)
                    .add((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperature)
                    .addArgs(localIsland.temperature.get(this.value.x, this.value.y, this.value.z, undefined))),
                InfoProvider_1.InfoProvider.create()
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Extra)
                    .setComponent(Text_1.Paragraph)
                    .setChildComponent(Text_1.Paragraph)
                    .add((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureBiome)
                    .addArgs(localIsland.temperature.getBase()))
                    .add((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureLayerModifier)
                    .addArgs(Translation_1.default.misc(Misc_1.MiscTranslation.Difference)
                    .addArgs(localIsland.temperature.getLayer(this.value.z)))),
                InfoProvider_1.InfoProvider.create()
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Extra)
                    .setComponent(Text_1.Paragraph)
                    .setChildComponent(Text_1.Paragraph)
                    .add((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileCalculated)
                    .addArgs(this.getTileMod())),
                InfoProvider_1.InfoProvider.create()
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Verbose)
                    .setComponent(Text_1.Paragraph)
                    .setChildComponent(Text_1.Paragraph)
                    .add((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileCalculatedHeat)
                    .addArgs(this.getTemperature(ITemperature_1.TempType.Heat, "calculated")))
                    .add((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileCalculatedCold)
                    .addArgs(this.getTemperature(ITemperature_1.TempType.Cold, "calculated")))
                    .add((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileProducedHeat)
                    .addArgs(this.getTemperature(ITemperature_1.TempType.Heat, "produced")))
                    .add((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileProducedCold)
                    .addArgs(this.getTemperature(ITemperature_1.TempType.Cold, "produced"))),
            ];
        }
        onTickEnd() {
            if (localPlayer.isResting()) {
                return;
            }
            this.refresh();
        }
        getTemperature(tempType, calcOrProduce) {
            var _a;
            const temp = (_a = localIsland.temperature) === null || _a === void 0 ? void 0 : _a[calcOrProduce === "calculated" ? "getCachedCalculated" : "getCachedProduced"](this.value.x, this.value.y, this.value.z, tempType);
            return temp === TemperatureManager_1.TEMPERATURE_INVALID || temp === undefined ? "?" : temp;
        }
        getTileMod() {
            const heat = this.getTemperature(ITemperature_1.TempType.Heat, "calculated");
            const cold = this.getTemperature(ITemperature_1.TempType.Cold, "calculated");
            if (heat === "?" || cold === "?")
                return "?";
            return Translation_1.default.misc(Misc_1.MiscTranslation.Difference)
                .addArgs(heat - cold);
        }
    }
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Game, "tickEnd")
    ], TemperatureInspection.prototype, "onTickEnd", null);
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], TemperatureInspection, "DEBUG_TOOLS", void 0);
    exports.default = TemperatureInspection;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdGlvbi9UZW1wZXJhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFpQkEsTUFBcUIscUJBQXNCLFNBQVEsb0JBQW9CO1FBU3RFLFlBQW1CLElBQWM7WUFDaEMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBTk0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFrQjtZQUMzQyxPQUFPLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3JGLENBQUM7UUFNZSxLQUFLO1lBQ3BCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRWUsV0FBVztZQUMxQixPQUFPLHVDQUF5QixDQUFDLHlCQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQzFELENBQUM7UUFNZSxVQUFVO1lBQ3pCLE9BQU8sSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssR0FBRyxDQUFDO1FBQ2xELENBQUM7UUFFZSxHQUFHLENBQUMsT0FBNEI7WUFDL0MsT0FBTztnQkFDTiwyQkFBWSxDQUFDLE1BQU0sRUFBRTtxQkFDbkIsZUFBZSxDQUFDLGdDQUFnQixDQUFDLFFBQVEsQ0FBQztxQkFDMUMsR0FBRyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxxQkFBcUIsQ0FBQztxQkFDM0QsT0FBTyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMs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
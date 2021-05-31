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
            return this.getTileMod() !== "?";
        }
        get(context) {
            return [
                InfoProvider_1.InfoProvider.create()
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.NonExtra)
                    .add(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperature)
                    .addArgs(island.temperature.get(this.value.x, this.value.y, this.value.z, undefined))),
                InfoProvider_1.InfoProvider.title()
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Extra)
                    .add(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperature)
                    .addArgs(island.temperature.get(this.value.x, this.value.y, this.value.z, undefined))),
                InfoProvider_1.InfoProvider.create()
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Extra)
                    .setComponent(Text_1.Paragraph)
                    .setChildComponent(Text_1.Paragraph)
                    .add(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureBiome)
                    .addArgs(island.temperature.getBase()))
                    .add(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureLayerModifier)
                    .addArgs(Translation_1.default.misc(Misc_1.MiscTranslation.Difference)
                    .addArgs(island.temperature.getLayer(this.value.z)))),
                InfoProvider_1.InfoProvider.create()
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Extra)
                    .setComponent(Text_1.Paragraph)
                    .setChildComponent(Text_1.Paragraph)
                    .add(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileCalculated)
                    .addArgs(this.getTileMod())),
                InfoProvider_1.InfoProvider.create()
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Verbose)
                    .setComponent(Text_1.Paragraph)
                    .setChildComponent(Text_1.Paragraph)
                    .add(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileCalculatedHeat)
                    .addArgs(this.getTemperature(ITemperature_1.TempType.Heat, "calculated")))
                    .add(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileCalculatedCold)
                    .addArgs(this.getTemperature(ITemperature_1.TempType.Cold, "calculated")))
                    .add(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileProducedHeat)
                    .addArgs(this.getTemperature(ITemperature_1.TempType.Heat, "produced")))
                    .add(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileProducedCold)
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
            const temp = (_a = island.temperature) === null || _a === void 0 ? void 0 : _a[calcOrProduce === "calculated" ? "getCachedCalculated" : "getCachedProduced"](this.value.x, this.value.y, this.value.z, tempType);
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
        Override
    ], TemperatureInspection.prototype, "getId", null);
    __decorate([
        Override
    ], TemperatureInspection.prototype, "getPriority", null);
    __decorate([
        Override
    ], TemperatureInspection.prototype, "hasContent", null);
    __decorate([
        Override
    ], TemperatureInspection.prototype, "get", null);
    __decorate([
        EventManager_1.EventHandler(EventBuses_1.EventBus.Game, "tickEnd")
    ], TemperatureInspection.prototype, "onTickEnd", null);
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], TemperatureInspection, "DEBUG_TOOLS", void 0);
    exports.default = TemperatureInspection;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdGlvbi9UZW1wZXJhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFpQkEsTUFBcUIscUJBQXNCLFNBQVEsb0JBQW9CO1FBU3RFLFlBQW1CLElBQWM7WUFDaEMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBTk0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFrQjtZQUMzQyxPQUFPLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3JGLENBQUM7UUFNZ0IsS0FBSztZQUNyQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUVnQixXQUFXO1lBQzNCLE9BQU8sdUNBQXlCLENBQUMseUJBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDMUQsQ0FBQztRQU1nQixVQUFVO1lBQzFCLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLEdBQUcsQ0FBQztRQUNsQyxDQUFDO1FBRWdCLEdBQUcsQ0FBQyxPQUE0QjtZQUNoRCxPQUFPO2dCQUNOLDJCQUFZLENBQUMsTUFBTSxFQUFFO3FCQUNuQixlQUFlLENBQUMsZ0NBQWdCLENBQUMsUUFBUSxDQUFDO3FCQUMxQyxHQUFHLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxxQkFBcUIsQ0FBQztxQkFDM0QsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxL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
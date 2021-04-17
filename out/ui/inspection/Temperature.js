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
            return new TemperatureInspection(position);
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
                    .addArgs(island.temperature.get(this.value.x, this.value.y, this.value.z, true))),
                InfoProvider_1.InfoProvider.title()
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Extra)
                    .add(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperature)
                    .addArgs(island.temperature.get(this.value.x, this.value.y, this.value.z, true))),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdGlvbi9UZW1wZXJhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFpQkEsTUFBcUIscUJBQXNCLFNBQVEsb0JBQW9CO1FBU3RFLFlBQW1CLElBQWM7WUFDaEMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBTk0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFrQjtZQUMzQyxPQUFPLElBQUkscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQU1nQixLQUFLO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRWdCLFdBQVc7WUFDM0IsT0FBTyx1Q0FBeUIsQ0FBQyx5QkFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUMxRCxDQUFDO1FBTWdCLFVBQVU7WUFDMUIsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssR0FBRyxDQUFDO1FBQ2xDLENBQUM7UUFFZ0IsR0FBRyxDQUFDLE9BQTRCO1lBQ2hELE9BQU87Z0JBQ04sMkJBQVksQ0FBQyxNQUFNLEVBQUU7cUJBQ25CLGVBQWUsQ0FBQyxnQ0FBZ0IsQ0FBQyxRQUFRLENBQUM7cUJBQzFDLEdBQUcsQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLHFCQUFxQixDQUFDO3FCQUMzRCxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbkYsMkJBQVks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
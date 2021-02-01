var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventBuses", "event/EventManager", "game/inspection/IInfoProvider", "game/inspection/IInspection", "game/inspection/InfoProvider", "game/inspection/Inspection", "game/temperature/TemperatureManager", "language/Translation", "mod/Mod", "newui/component/Text", "../../IDebugTools"], function (require, exports, EventBuses_1, EventManager_1, IInfoProvider_1, IInspection_1, InfoProvider_1, Inspection_1, TemperatureManager_1, Translation_1, Mod_1, Text_1, IDebugTools_1) {
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
            return this.getTemperature(TemperatureManager_1.TempType.Heat, "calculated") !== -1;
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
                    .addArgs(Translation_1.default.difference(island.temperature.getLayer(this.value.z)))),
                InfoProvider_1.InfoProvider.create()
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Extra)
                    .setComponent(Text_1.Paragraph)
                    .setChildComponent(Text_1.Paragraph)
                    .add(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileCalculated)
                    .addArgs(Translation_1.default.difference(this.getTemperature(TemperatureManager_1.TempType.Heat, "calculated") - this.getTemperature(TemperatureManager_1.TempType.Cold, "calculated")))),
                InfoProvider_1.InfoProvider.create()
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Verbose)
                    .setComponent(Text_1.Paragraph)
                    .setChildComponent(Text_1.Paragraph)
                    .add(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileCalculatedHeat)
                    .addArgs(this.getTemperature(TemperatureManager_1.TempType.Heat, "calculated")))
                    .add(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileCalculatedCold)
                    .addArgs(this.getTemperature(TemperatureManager_1.TempType.Cold, "calculated")))
                    .add(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileProducedHeat)
                    .addArgs(this.getTemperature(TemperatureManager_1.TempType.Heat, "produced")))
                    .add(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileProducedCold)
                    .addArgs(this.getTemperature(TemperatureManager_1.TempType.Cold, "produced"))),
            ];
        }
        onTickEnd() {
            this.refresh();
        }
        getTemperature(tempType, calcOrProduce) {
            var _a, _b;
            return (_b = (_a = island.temperature) === null || _a === void 0 ? void 0 : _a[calcOrProduce === "calculated" ? "getCachedCalculated" : "getCachedProduced"](this.value.x, this.value.y, this.value.z, tempType)) !== null && _b !== void 0 ? _b : -1;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdGlvbi9UZW1wZXJhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFjQSxNQUFxQixxQkFBc0IsU0FBUSxvQkFBb0I7UUFTdEUsWUFBbUIsSUFBYztZQUNoQyxLQUFLLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RFLENBQUM7UUFOTSxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQWtCO1lBQzNDLE9BQU8sSUFBSSxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxDQUFDO1FBTWdCLEtBQUs7WUFDckIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFFZ0IsV0FBVztZQUMzQixPQUFPLHVDQUF5QixDQUFDLHlCQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQzFELENBQUM7UUFNZ0IsVUFBVTtZQUMxQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsNkJBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUVnQixHQUFHLENBQUMsT0FBNEI7WUFDaEQsT0FBTztnQkFDTiwyQkFBWSxDQUFDLE1BQU0sRUFBRTtxQkFDbkIsZUFBZSxDQUFDLGdDQUFnQixDQUFDLFFBQVEsQ0FBQztxQkFDMUMsR0FBRyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMscUJBQXFCLENBQUM7cUJBQzNELE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFB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
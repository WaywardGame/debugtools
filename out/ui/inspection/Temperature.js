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
        static getFromTile(position) {
            return TemperatureInspection.DEBUG_TOOLS ? new TemperatureInspection(position) : [];
        }
        constructor(tile) {
            super(TemperatureInspection.DEBUG_TOOLS.inspectionTemperature, tile);
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
            const tempValue = localIsland.temperature.get(localIsland.getTileFromPoint(this.value), undefined);
            return [
                InfoProvider_1.InfoProvider.create()
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.NonExtra)
                    .add((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperature)
                    .addArgs(tempValue)),
                InfoProvider_1.InfoProvider.title()
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Extra)
                    .add((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperature)
                    .addArgs(tempValue)),
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
            const temp = localIsland.temperature?.[calcOrProduce === "calculated" ? "getCachedCalculated" : "getCachedProduced"](this.value, tempType);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdGlvbi9UZW1wZXJhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFpQkEsTUFBcUIscUJBQXNCLFNBQVEsb0JBQW9CO1FBSy9ELE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBa0I7WUFDM0MsT0FBTyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUkscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNyRixDQUFDO1FBRUQsWUFBbUIsSUFBYztZQUNoQyxLQUFLLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RFLENBQUM7UUFFZSxLQUFLO1lBQ3BCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRWUsV0FBVztZQUMxQixPQUFPLHVDQUF5QixDQUFDLHlCQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQzFELENBQUM7UUFNZSxVQUFVO1lBQ3pCLE9BQU8sSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssR0FBRyxDQUFDO1FBQ2xELENBQUM7UUFFZSxHQUFHLENBQUMsT0FBNEI7WUFDL0MsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNuRyxPQUFPO2dCQUNOLDJCQUFZLENBQUMsTUFBTSxFQUFFO3FCQUNuQixlQUFlLENBQUMsZ0NBQWdCLENBQUMsUUFBUSxDQUFDO3FCQUMxQyxHQUFHLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixD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
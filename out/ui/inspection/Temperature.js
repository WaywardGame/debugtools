var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventBuses", "event/EventManager", "game/inspection/IInfoProvider", "game/inspection/IInspection", "game/inspection/Inspection", "game/inspection/infoProviders/LabelledValue", "game/inspection/infoProviders/MagicalPropertyValue", "game/temperature/ITemperature", "game/temperature/TemperatureManager", "language/Translation", "language/dictionary/Misc", "mod/Mod", "ui/component/Text", "../../IDebugTools"], function (require, exports, EventBuses_1, EventManager_1, IInfoProvider_1, IInspection_1, Inspection_1, LabelledValue_1, MagicalPropertyValue_1, ITemperature_1, TemperatureManager_1, Translation_1, Misc_1, Mod_1, Text_1, IDebugTools_1) {
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
                LabelledValue_1.default.label((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperature))
                    .add(new MagicalPropertyValue_1.default(tempValue))
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.NonExtra)
                    .setComponent(Text_1.Paragraph),
                LabelledValue_1.default.label((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperature))
                    .add(new MagicalPropertyValue_1.default(tempValue))
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Extra)
                    .addClasses(IInfoProvider_1.InfoClass.Title)
                    .setComponent(Text_1.Heading),
                LabelledValue_1.default.label((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureBiome))
                    .add(new MagicalPropertyValue_1.default(localIsland.temperature.getBiomeBase()))
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Extra)
                    .setComponent(Text_1.Paragraph),
                LabelledValue_1.default.label((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureBiomeTimeModifier))
                    .add(new MagicalPropertyValue_1.default(localIsland.temperature.getBiomeTimeModifier()))
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Extra)
                    .setComponent(Text_1.Paragraph),
                LabelledValue_1.default.label((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureLayerModifier))
                    .add(new MagicalPropertyValue_1.default(localIsland.temperature.getLayerBase(this.value.z)))
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Extra)
                    .setComponent(Text_1.Paragraph),
                LabelledValue_1.default.label((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureLayerTimeModifier))
                    .add(new MagicalPropertyValue_1.default(localIsland.temperature.getLayerTimeModifier(this.value.z)))
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Extra)
                    .setComponent(Text_1.Paragraph),
                LabelledValue_1.default.label((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileCalculated))
                    .add(Translation_1.default.colorizeImportance("primary")
                    .addArgs(this.getTileMod()))
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Extra)
                    .setComponent(Text_1.Paragraph),
                LabelledValue_1.default.label((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileCalculatedHeat))
                    .add(Translation_1.default.colorizeImportance("primary")
                    .addArgs(this.getTemperature(ITemperature_1.TempType.Heat, "calculated")))
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Verbose)
                    .setComponent(Text_1.Paragraph),
                LabelledValue_1.default.label((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileCalculatedCold))
                    .add(Translation_1.default.colorizeImportance("primary")
                    .addArgs(this.getTemperature(ITemperature_1.TempType.Cold, "calculated")))
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Verbose)
                    .setComponent(Text_1.Paragraph),
                LabelledValue_1.default.label((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileProducedHeat))
                    .add(Translation_1.default.colorizeImportance("primary")
                    .addArgs(this.getTemperature(ITemperature_1.TempType.Heat, "produced")))
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Verbose)
                    .setComponent(Text_1.Paragraph),
                LabelledValue_1.default.label((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureTileProducedCold))
                    .add(Translation_1.default.colorizeImportance("primary")
                    .addArgs(this.getTemperature(ITemperature_1.TempType.Cold, "produced")))
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.Verbose)
                    .setComponent(Text_1.Paragraph),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdGlvbi9UZW1wZXJhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFrQkEsTUFBcUIscUJBQXNCLFNBQVEsb0JBQW9CO1FBSy9ELE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBa0I7WUFDM0MsT0FBTyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUkscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNyRixDQUFDO1FBRUQsWUFBbUIsSUFBYztZQUNoQyxLQUFLLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RFLENBQUM7UUFFZSxLQUFLO1lBQ3BCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRWUsV0FBVztZQUMxQixPQUFPLHVDQUF5QixDQUFDLHlCQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQzFELENBQUM7UUFNZSxVQUFVO1lBQ3pCLE9BQU8sSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssR0FBRyxDQUFDO1FBQ2xELENBQUM7UUFFZSxHQUFHLENBQUMsT0FBNEI7WUFDL0MsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNuRyxPQUFPO2dCQUNOLHVCQUFhLENBQUMsS0FBSyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO3FCQUMzRSxHQUFHLENBQUMsSUFBSSw4QkFBb0IsQ0FBQyxT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
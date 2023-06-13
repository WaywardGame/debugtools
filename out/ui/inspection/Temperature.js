/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
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
        static getFromTile(tile) {
            return TemperatureInspection.DEBUG_TOOLS ? new TemperatureInspection(tile) : [];
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
            this.tempValue = localIsland.temperature.get(this.value, undefined);
            return [
                LabelledValue_1.default.label((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperature))
                    .add(new MagicalPropertyValue_1.default(this.tempValue))
                    .setDisplayLevel(IInfoProvider_1.InfoDisplayLevel.NonExtra)
                    .setComponent(Text_1.Paragraph),
                LabelledValue_1.default.label((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectionTemperature))
                    .add(new MagicalPropertyValue_1.default(this.tempValue))
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
            const newTempValue = localIsland.temperature.get(this.value, undefined);
            if (this.tempValue !== newTempValue) {
                this.refresh();
            }
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
    exports.default = TemperatureInspection;
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Game, "tickEnd")
    ], TemperatureInspection.prototype, "onTickEnd", null);
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], TemperatureInspection, "DEBUG_TOOLS", void 0);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdGlvbi9UZW1wZXJhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUFvQkgsTUFBcUIscUJBQXNCLFNBQVEsb0JBQWdCO1FBTzNELE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBVTtZQUNuQyxPQUFPLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2pGLENBQUM7UUFFRCxZQUFtQixJQUFVO1lBQzVCLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUVlLEtBQUs7WUFDcEIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFFZSxXQUFXO1lBQzFCLE9BQU8sdUNBQXlCLENBQUMseUJBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDMUQsQ0FBQztRQU1lLFVBQVU7WUFDekIsT0FBTyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxHQUFHLENBQUM7UUFDbEQsQ0FBQztRQUVlLEdBQUcsQ0FBQyxPQUE0QjtZQUMvQyxJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDcEUsT0FBTztnQkFDTix1QkFBYSxDQUFDLEtBQUssQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMscUJBQXFCLENBQUMsQ0FBQztxQkFDM0UsR0FBRyxDQUFDLElBQUksOEJBQW9CLENBQUMsSUFBSSxD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
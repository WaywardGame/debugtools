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
define(["require", "exports", "@wayward/game/event/EventBuses", "@wayward/game/event/EventManager", "@wayward/game/game/inspection/IInfoProvider", "@wayward/game/game/inspection/IInspection", "@wayward/game/game/inspection/Inspection", "@wayward/game/game/inspection/infoProviders/LabelledValue", "@wayward/game/game/inspection/infoProviders/MagicalPropertyValue", "@wayward/game/game/temperature/ITemperature", "@wayward/game/game/temperature/TemperatureManager", "@wayward/game/language/Translation", "@wayward/game/language/dictionary/Misc", "@wayward/game/mod/Mod", "@wayward/game/ui/component/Text", "../../IDebugTools"], function (require, exports, EventBuses_1, EventManager_1, IInfoProvider_1, IInspection_1, Inspection_1, LabelledValue_1, MagicalPropertyValue_1, ITemperature_1, TemperatureManager_1, Translation_1, Misc_1, Mod_1, Text_1, IDebugTools_1) {
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
        onTickEnd(island) {
            if (!island.isLocalIsland || localPlayer.isResting) {
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
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Island, "tickEnd")
    ], TemperatureInspection.prototype, "onTickEnd", null);
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], TemperatureInspection, "DEBUG_TOOLS", void 0);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdGlvbi9UZW1wZXJhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUFzQkgsTUFBcUIscUJBQXNCLFNBQVEsb0JBQWdCO1FBTzNELE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBVTtZQUNuQyxPQUFPLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2pGLENBQUM7UUFFRCxZQUFtQixJQUFVO1lBQzVCLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUVlLEtBQUs7WUFDcEIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFFZSxXQUFXO1lBQzFCLE9BQU8sdUNBQXlCLENBQUMseUJBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDMUQsQ0FBQztRQU1lLFVBQVU7WUFDekIsT0FBTyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxHQUFHLENBQUM7UUFDbEQsQ0FBQztRQUVlLEdBQUcsQ0FBQyxPQUE0QjtZQUMvQyxJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDcEUsT0FBTztnQkFDTix1QkFBYSxDQUFDLEtBQUssQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMscUJBQXFCLENBQUMsQ0FBQztxQkFDM0UsR0FBRyxDQUFDLElBQUksOEJBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3FCQUM3QyxlQUFlLENBQUMsZ0NBQWdCLENBQUMsUUFBUSxDQUFDO3FCQUMxQyxZQUFZLENBQUMsZ0JBQVMsQ0FBQztnQkFDekIsdUJBQWEsQ0FBQyxLQUFLLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLHFCQUFxQixDQUFDLENBQUM7cUJBQzNFLEdBQUcsQ0FBQyxJQUFJLDhCQUFvQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztxQkFDN0MsZUFBZSxDQUFDLGdDQUFnQixDQUFDLEtBQUssQ0FBQztxQkFDdkMsVUFBVSxDQUFDLHlCQUFTLENBQUMsS0FBSyxDQUFDO3FCQUMzQixZQUFZLENBQUMsY0FBTyxDQUFDO2dCQUN2Qix1QkFBYSxDQUFDLEtBQUssQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsMEJBQTBCLENBQUMsQ0FBQztxQkFDaEYsR0FBRyxDQUFDLElBQUksOEJBQW9CLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO3FCQUNyRSxlQUFlLENBQUMsZ0NBQWdCLENBQUMsS0FBSyxDQUFDO3FCQUN2QyxZQUFZLENBQUMsZ0JBQVMsQ0FBQztnQkFDekIsdUJBQWEsQ0FBQyxLQUFLLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLHNDQUFzQyxDQUFDLENBQUM7cUJBQzVGLEdBQUcsQ0FBQyxJQUFJLDhCQUFvQixDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO3FCQUM3RSxlQUFlLENBQUMsZ0NBQWdCLENBQUMsS0FBSyxDQUFDO3FCQUN2QyxZQUFZLENBQUMsZ0JBQVMsQ0FBQztnQkFDekIsdUJBQWEsQ0FBQyxLQUFLLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGtDQUFrQyxDQUFDLENBQUM7cUJBQ3hGLEdBQUcsQ0FBQyxJQUFJLDhCQUFvQixDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDakYsZUFBZSxDQUFDLGdDQUFnQixDQUFDLEtBQUssQ0FBQztxQkFDdkMsWUFBWSxDQUFDLGdCQUFTLENBQUM7Z0JBQ3pCLHVCQUFhLENBQUMsS0FBSyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO3FCQUM1RixHQUFHLENBQUMsSUFBSSw4QkFBb0IsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDekYsZUFBZSxDQUFDLGdDQUFnQixDQUFDLEtBQUssQ0FBQztxQkFDdkMsWUFBWSxDQUFDLGdCQUFTLENBQUM7Z0JBQ3pCLHVCQUFhLENBQUMsS0FBSyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO3FCQUN6RixHQUFHLENBQUMscUJBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7cUJBQzVDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztxQkFDNUIsZUFBZSxDQUFDLGdDQUFnQixDQUFDLEtBQUssQ0FBQztxQkFDdkMsWUFBWSxDQUFDLGdCQUFTLENBQUM7Z0JBQ3pCLHVCQUFhLENBQUMsS0FBSyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO3FCQUM3RixHQUFHLENBQUMscUJBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7cUJBQzVDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLHVCQUFRLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7cUJBQzNELGVBQWUsQ0FBQyxnQ0FBZ0IsQ0FBQyxPQUFPLENBQUM7cUJBQ3pDLFlBQVksQ0FBQyxnQkFBUyxDQUFDO2dCQUN6Qix1QkFBYSxDQUFDLEtBQUssQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsdUNBQXVDLENBQUMsQ0FBQztxQkFDN0YsR0FBRyxDQUFDLHFCQUFXLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDO3FCQUM1QyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyx1QkFBUSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO3FCQUMzRCxlQUFlLENBQUMsZ0NBQWdCLENBQUMsT0FBTyxDQUFDO3FCQUN6QyxZQUFZLENBQUMsZ0JBQVMsQ0FBQztnQkFDekIsdUJBQWEsQ0FBQyxLQUFLLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLHFDQUFxQyxDQUFDLENBQUM7cUJBQzNGLEdBQUcsQ0FBQyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQztxQkFDNUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsdUJBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztxQkFDekQsZUFBZSxDQUFDLGdDQUFnQixDQUFDLE9BQU8sQ0FBQztxQkFDekMsWUFBWSxDQUFDLGdCQUFTLENBQUM7Z0JBQ3pCLHVCQUFhLENBQUMsS0FBSyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO3FCQUMzRixHQUFHLENBQUMscUJBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7cUJBQzVDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLHVCQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7cUJBQ3pELGVBQWUsQ0FBQyxnQ0FBZ0IsQ0FBQyxPQUFPLENBQUM7cUJBQ3pDLFlBQVksQ0FBQyxnQkFBUyxDQUFDO2FBQ3pCLENBQUM7UUFDSCxDQUFDO1FBT00sU0FBUyxDQUFDLE1BQWM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNwRCxPQUFPO1lBQ1IsQ0FBQztZQUVELE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDeEUsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFlBQVksRUFBRSxDQUFDO2dCQUNyQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDaEIsQ0FBQztRQUNGLENBQUM7UUFNTyxjQUFjLENBQUMsUUFBa0IsRUFBRSxhQUF3QztZQUNsRixNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUMsYUFBYSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMzSSxPQUFPLElBQUksS0FBSyx3Q0FBbUIsSUFBSSxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN4RSxDQUFDO1FBRU8sVUFBVTtZQUNqQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLHVCQUFRLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzlELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsdUJBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDOUQsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksS0FBSyxHQUFHO2dCQUFFLE9BQU8sR0FBRyxDQUFDO1lBQzdDLE9BQU8scUJBQVcsQ0FBQyxJQUFJLENBQUMsc0JBQWUsQ0FBQyxVQUFVLENBQUM7aUJBQ2pELE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDeEIsQ0FBQztLQUNEO0lBdkhELHdDQXVIQztJQTNCTztRQUROLElBQUEsMkJBQVksRUFBQyxxQkFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUM7MERBVXhDO0lBaEdzQjtRQUR0QixhQUFHLENBQUMsUUFBUSxDQUFhLDRCQUFjLENBQUM7b0RBQ00ifQ==
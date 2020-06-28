/*!
 * Copyright Unlok, Vaughn Royko 2011-2019
 * http://www.unlok.ca
 *
 * Credits & Thanks:
 * http://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://waywardgame.github.io/
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventManager", "game/inspection/Inspection", "game/temperature/TemperatureManager", "mod/Mod", "renderer/World", "../../IDebugTools"], function (require, exports, EventManager_1, Inspection_1, TemperatureManager_1, Mod_1, World_1, IDebugTools_1) {
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
        get(context) {
            return [
                IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureCalculated)
                    .addArgs(this.getTemperature(TemperatureManager_1.TempType.Heat, "calculated") - this.getTemperature(TemperatureManager_1.TempType.Cold, "calculated")),
                IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureCalculatedHeat)
                    .addArgs(this.getTemperature(TemperatureManager_1.TempType.Heat, "calculated")),
                IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureCalculatedCold)
                    .addArgs(this.getTemperature(TemperatureManager_1.TempType.Cold, "calculated")),
                IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureProducedHeat)
                    .addArgs(this.getTemperature(TemperatureManager_1.TempType.Heat, "produced")),
                IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectionTemperatureProducedCold)
                    .addArgs(this.getTemperature(TemperatureManager_1.TempType.Cold, "produced")),
            ];
        }
        onUpdateTile(_, x, y, z) {
            if (x === this.value.x && y === this.value.y && z === this.value.z) {
                this.refresh();
            }
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
    ], TemperatureInspection.prototype, "get", null);
    __decorate([
        EventManager_1.EventHandler(World_1.default, "updateTile")
    ], TemperatureInspection.prototype, "onUpdateTile", null);
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], TemperatureInspection, "DEBUG_TOOLS", void 0);
    exports.default = TemperatureInspection;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdGlvbi9UZW1wZXJhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUFZSCxNQUFxQixxQkFBc0IsU0FBUSxvQkFBb0I7UUFTdEUsWUFBbUIsSUFBYztZQUNoQyxLQUFLLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RFLENBQUM7UUFOTSxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQWtCO1lBQzNDLE9BQU8sSUFBSSxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxDQUFDO1FBTWdCLEtBQUs7WUFDckIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFVZ0IsR0FBRyxDQUFDLE9BQWdCO1lBQ3BDLE9BQU87Z0JBQ04seUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQywrQkFBK0IsQ0FBQztxQkFDaEUsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsNkJBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyw2QkFBUSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDOUcseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxtQ0FBbUMsQ0FBQztxQkFDcEUsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsNkJBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQzNELHlCQUFXLENBQUMsbUNBQXFCLENBQUMsbUNBQW1DLENBQUM7cUJBQ3BFLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLDZCQUFRLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUMzRCx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGlDQUFpQyxDQUFDO3FCQUNsRSxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyw2QkFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDekQseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxpQ0FBaUMsQ0FBQztxQkFDbEUsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsNkJBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7YUFDekQsQ0FBQztRQUNILENBQUM7UUFPTSxZQUFZLENBQUMsQ0FBTSxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUztZQUMxRCxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUNuRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDZjtRQUNGLENBQUM7UUFNTyxjQUFjLENBQUMsUUFBa0IsRUFBRSxhQUF3Qzs7WUFDbEYsbUJBQU8sTUFBTSxDQUFDLFdBQVcsMENBQUcsYUFBYSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixFQUN0RyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLG9DQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzdELENBQUM7S0FDRDtJQTlDVTtRQUFULFFBQVE7c0RBRVI7SUFVUztRQUFULFFBQVE7b0RBYVI7SUFPRDtRQURDLDJCQUFZLENBQUMsZUFBSyxFQUFFLFlBQVksQ0FBQzs2REFLakM7SUE5Q0Q7UUFEQyxhQUFHLENBQUMsUUFBUSxDQUFhLDRCQUFjLENBQUM7b0RBQ007SUFIaEQsd0NBMkRDIn0=
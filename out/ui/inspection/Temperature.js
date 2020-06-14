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
    let TemperatureInspection = (() => {
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
                return island.temperature[calcOrProduce === "calculated" ? "getCachedCalculated" : "getCachedProduced"](this.value.x, this.value.y, this.value.z, tempType);
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
        return TemperatureInspection;
    })();
    exports.default = TemperatureInspection;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdGlvbi9UZW1wZXJhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUFZSDtRQUFBLE1BQXFCLHFCQUFzQixTQUFRLG9CQUFvQjtZQVN0RSxZQUFtQixJQUFjO2dCQUNoQyxLQUFLLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3RFLENBQUM7WUFOTSxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQWtCO2dCQUMzQyxPQUFPLElBQUkscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUMsQ0FBQztZQU1nQixLQUFLO2dCQUNyQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0MsQ0FBQztZQVVnQixHQUFHLENBQUMsT0FBZ0I7Z0JBQ3BDLE9BQU87b0JBQ04seUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQywrQkFBK0IsQ0FBQzt5QkFDaEUsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsNkJBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyw2QkFBUSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDOUcseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxtQ0FBbUMsQ0FBQzt5QkFDcEUsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsNkJBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7b0JBQzNELHlCQUFXLENBQUMsbUNBQXFCLENBQUMsbUNBQW1DLENBQUM7eUJBQ3BFLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLDZCQUFRLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUMzRCx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGlDQUFpQyxDQUFDO3lCQUNsRSxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyw2QkFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFDekQseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxpQ0FBaUMsQ0FBQzt5QkFDbEUsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsNkJBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7aUJBQ3pELENBQUM7WUFDSCxDQUFDO1lBT00sWUFBWSxDQUFDLENBQU0sRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7Z0JBQzFELElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQ25FLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDZjtZQUNGLENBQUM7WUFNTyxjQUFjLENBQUMsUUFBa0IsRUFBRSxhQUF3QztnQkFDbEYsT0FBTyxNQUFNLENBQUMsV0FBVyxDQUFDLGFBQWEsS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUNyRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN2RCxDQUFDO1NBQ0Q7UUE5Q1U7WUFBVCxRQUFROzBEQUVSO1FBVVM7WUFBVCxRQUFRO3dEQWFSO1FBT0Q7WUFEQywyQkFBWSxDQUFDLGVBQUssRUFBRSxZQUFZLENBQUM7aUVBS2pDO1FBOUNEO1lBREMsYUFBRyxDQUFDLFFBQVEsQ0FBYSw0QkFBYyxDQUFDO3dEQUNNO1FBd0RoRCw0QkFBQztTQUFBO3NCQTNEb0IscUJBQXFCIn0=
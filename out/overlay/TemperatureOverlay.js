var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventBuses", "event/EventEmitter", "event/EventManager", "game/temperature/ITemperature", "game/temperature/TemperatureManager", "game/tile/ITerrain", "renderer/overlay/GenericOverlay", "utilities/Color", "utilities/math/Math2", "utilities/math/Vector2"], function (require, exports, EventBuses_1, EventEmitter_1, EventManager_1, ITemperature_1, TemperatureManager_1, ITerrain_1, GenericOverlay_1, Color_1, Math2_1, Vector2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemperatureOverlay = exports.TemperatureOverlayMode = void 0;
    const COLOR_COOL = Color_1.default.fromInt(0x00B5FF);
    const COLOR_COLD = Color_1.default.fromInt(0x78FFFF);
    const COLOR_WARM = Color_1.default.fromInt(0xFFA600);
    const COLOR_HOT = Color_1.default.fromInt(0xFF1C00);
    var TemperatureOverlayMode;
    (function (TemperatureOverlayMode) {
        TemperatureOverlayMode[TemperatureOverlayMode["None"] = 0] = "None";
        TemperatureOverlayMode[TemperatureOverlayMode["Produced"] = 1] = "Produced";
        TemperatureOverlayMode[TemperatureOverlayMode["Calculated"] = 2] = "Calculated";
    })(TemperatureOverlayMode = exports.TemperatureOverlayMode || (exports.TemperatureOverlayMode = {}));
    class TemperatureOverlay extends GenericOverlay_1.default {
        constructor() {
            super();
            this.mode = TemperatureOverlayMode.None;
            this.scheduledInvalidations = [];
            EventManager_1.default.registerEventBusSubscriber(this);
        }
        getMode() {
            return this.mode;
        }
        setMode(mode) {
            if (this.mode === mode)
                return this;
            if (mode === TemperatureOverlayMode.None)
                this.hide();
            else if (this.mode === TemperatureOverlayMode.None)
                this.show();
            this.mode = mode;
            this.onTickEnd();
            return this;
        }
        generateOverlayInfo(tile) {
            const temperature = this.getTileMod(tile);
            if (temperature === "?") {
                return {
                    type: ITerrain_1.OverlayType.QuestionMark,
                    size: 16,
                    alpha: this.alpha ? 150 : 0,
                };
            }
            let color;
            let alpha = 0;
            if (temperature < 0) {
                alpha = 1 - (temperature + 100) / 100;
                color = Color_1.default.blend(COLOR_COOL, COLOR_COLD, alpha);
            }
            else if (temperature > 0) {
                alpha = temperature / 100;
                color = Color_1.default.blend(COLOR_WARM, COLOR_HOT, alpha);
            }
            if (color) {
                return {
                    type: ITerrain_1.OverlayType.Full,
                    size: 16,
                    ...Color_1.default.getFullNames(color),
                    alpha: Math.floor(Math2_1.default.lerp(0, this.alpha, Math2_1.default.curve2(0, 1, alpha))),
                };
            }
        }
        updateOverlayAlpha(tile) {
            return this.generateOverlayInfo(tile);
        }
        onTickEnd() {
            this.clear();
            const invalidations = this.scheduledInvalidations.splice(0, Infinity);
            if (!this.alpha) {
                return;
            }
            for (const { tile, range } of invalidations) {
                Vector2_1.default.forRange(tile, range ?? 0, TemperatureManager_1.TEMPERATURE_BOUNDARY_MIN_VEC2, localIsland.temperature.temperatureBoundaryMaxVector, true, vec => this.addOrUpdate(tile.island.getTile(vec.x, vec.y, tile.z)));
            }
            const topLeft = renderer?.worldRenderer.screenToVector(0, 0) ?? Vector2_1.default.ZERO;
            const bottomRight = renderer?.worldRenderer.screenToVector(window.innerWidth, window.innerHeight) ?? Vector2_1.default.ZERO;
            for (let y = topLeft.y; y < bottomRight.y; y++) {
                for (let x = topLeft.x; x < bottomRight.x; x++) {
                    const tile = localIsland.getTile(x, y, localPlayer.z);
                    this.addOrUpdate(tile);
                }
            }
        }
        onUpdateProduced(temperatureManager, tile, invalidateRange) {
            this.scheduledInvalidations.push({ tile, range: invalidateRange });
        }
        getTemperature(tile, tempType) {
            const temp = tile.island.temperature?.getCachedCalculated(tile, tempType);
            return temp === TemperatureManager_1.TEMPERATURE_INVALID || temp === undefined ? "?" : temp;
        }
        getTileMod(tile) {
            const heat = this.getTemperature(tile, ITemperature_1.TempType.Heat);
            const cold = this.getTemperature(tile, ITemperature_1.TempType.Cold);
            if (heat === "?" || cold === "?")
                return "?";
            let tileTemp = heat - cold;
            if (this.mode === TemperatureOverlayMode.Produced)
                return tileTemp;
            const base = tile.island.temperature.getBiomeBase();
            const time = tile.island.temperature.getBiomeTimeModifier();
            const layer = tile.island.temperature.getLayer(tile.z);
            return Math2_1.default.clamp(ITemperature_1.Temperature.Coldest, ITemperature_1.Temperature.Hottest, base + time + layer + tileTemp);
        }
    }
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Game, "tickEnd", EventEmitter_1.Priority.Lowest - 1)
    ], TemperatureOverlay.prototype, "onTickEnd", null);
    __decorate([
        (0, EventManager_1.EventHandler)(TemperatureManager_1.default, "updateProducedTile")
    ], TemperatureOverlay.prototype, "onUpdateProduced", null);
    exports.TemperatureOverlay = TemperatureOverlay;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmVPdmVybGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL292ZXJsYXkvVGVtcGVyYXR1cmVPdmVybGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFZQSxNQUFNLFVBQVUsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLE1BQU0sVUFBVSxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFM0MsTUFBTSxVQUFVLEdBQUcsZUFBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzQyxNQUFNLFNBQVMsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTFDLElBQVksc0JBSVg7SUFKRCxXQUFZLHNCQUFzQjtRQUNqQyxtRUFBSSxDQUFBO1FBQ0osMkVBQVEsQ0FBQTtRQUNSLCtFQUFVLENBQUE7SUFDWCxDQUFDLEVBSlcsc0JBQXNCLEdBQXRCLDhCQUFzQixLQUF0Qiw4QkFBc0IsUUFJakM7SUFFRCxNQUFhLGtCQUFtQixTQUFRLHdCQUFjO1FBSXJEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFIRCxTQUFJLEdBQUcsc0JBQXNCLENBQUMsSUFBSSxDQUFDO1lBc0ZuQywyQkFBc0IsR0FBcUMsRUFBRSxDQUFDO1lBbEZyRSxzQkFBWSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUFFTSxPQUFPO1lBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2xCLENBQUM7UUFFTSxPQUFPLENBQUMsSUFBNEI7WUFDMUMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUk7Z0JBQ3JCLE9BQU8sSUFBSSxDQUFDO1lBRWIsSUFBSSxJQUFJLEtBQUssc0JBQXNCLENBQUMsSUFBSTtnQkFDdkMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNSLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxzQkFBc0IsQ0FBQyxJQUFJO2dCQUNqRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFYixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUVqQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDakIsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRWtCLG1CQUFtQixDQUFDLElBQVU7WUFDaEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQyxJQUFJLFdBQVcsS0FBSyxHQUFHLEVBQUU7Z0JBQ3hCLE9BQU87b0JBQ04sSUFBSSxFQUFFLHNCQUFXLENBQUMsWUFBWTtvQkFDOUIsSUFBSSxFQUFFLEVBQUU7b0JBQ1IsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDM0IsQ0FBQzthQUNGO1lBRUQsSUFBSSxLQUF1QixDQUFDO1lBRTVCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUksV0FBVyxHQUFHLENBQUMsRUFBRTtnQkFDcEIsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQ3RDLEtBQUssR0FBRyxlQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFFbkQ7aUJBQU0sSUFBSSxXQUFXLEdBQUcsQ0FBQyxFQUFFO2dCQUMzQixLQUFLLEdBQUcsV0FBVyxHQUFHLEdBQUcsQ0FBQztnQkFDMUIsS0FBSyxHQUFHLGVBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNsRDtZQUVELElBQUksS0FBSyxFQUFFO2dCQUNWLE9BQU87b0JBQ04sSUFBSSxFQUFFLHNCQUFXLENBQUMsSUFBSTtvQkFDdEIsSUFBSSxFQUFFLEVBQUU7b0JBQ1IsR0FBRyxlQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztvQkFDNUIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztpQkFDdkUsQ0FBQzthQUNGO1FBQ0YsQ0FBQztRQUVrQixrQkFBa0IsQ0FBQyxJQUFVO1lBQy9DLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFHUyxTQUFTO1lBQ2xCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUViLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3RFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNoQixPQUFPO2FBQ1A7WUFFRCxLQUFLLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksYUFBYSxFQUFFO2dCQUM1QyxpQkFBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRSxrREFBNkIsRUFBRSxXQUFXLENBQUMsV0FBVyxDQUFDLDRCQUE0QixFQUFFLElBQUksRUFDM0gsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3JFO1lBRUQsTUFBTSxPQUFPLEdBQUcsUUFBUSxFQUFFLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLGlCQUFPLENBQUMsSUFBSSxDQUFDO1lBQzdFLE1BQU0sV0FBVyxHQUFHLFFBQVEsRUFBRSxhQUFhLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLGlCQUFPLENBQUMsSUFBSSxDQUFDO1lBQ2xILEtBQUssSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDL0MsS0FBSyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUMvQyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0RCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN2QjthQUNEO1FBQ0YsQ0FBQztRQUtTLGdCQUFnQixDQUFDLGtCQUFzQyxFQUFFLElBQVUsRUFBRSxlQUF3QjtZQUN0RyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7UUFFTyxjQUFjLENBQUMsSUFBVSxFQUFFLFFBQWtCO1lBQ3BELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLG1CQUFtQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMxRSxPQUFPLElBQUksS0FBSyx3Q0FBbUIsSUFBSSxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN4RSxDQUFDO1FBRU8sVUFBVSxDQUFDLElBQVU7WUFDNUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsdUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSx1QkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RELElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEtBQUssR0FBRztnQkFBRSxPQUFPLEdBQUcsQ0FBQztZQUU3QyxJQUFJLFFBQVEsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQzNCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxzQkFBc0IsQ0FBQyxRQUFRO2dCQUNoRCxPQUFPLFFBQVEsQ0FBQztZQUVqQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNwRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQzVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdkQsT0FBTyxlQUFLLENBQUMsS0FBSyxDQUFDLDBCQUFXLENBQUMsT0FBTyxFQUFFLDBCQUFXLENBQUMsT0FBTyxFQUFFLElBQUksR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1FBQzlGLENBQUM7S0FFRDtJQW5EVTtRQURULElBQUEsMkJBQVksRUFBQyxxQkFBUSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsdUJBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3VEQXNCM0Q7SUFLUztRQURULElBQUEsMkJBQVksRUFBQyw0QkFBa0IsRUFBRSxvQkFBb0IsQ0FBQzs4REFHdEQ7SUE3RkYsZ0RBb0hDIn0=
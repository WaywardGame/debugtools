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
define(["require", "exports", "game/temperature/ITemperature", "game/temperature/TemperatureManager", "game/tile/ITerrain", "renderer/overlay/UniversalOverlay", "utilities/Color", "utilities/Decorators", "utilities/math/Math2"], function (require, exports, ITemperature_1, TemperatureManager_1, ITerrain_1, UniversalOverlay_1, Color_1, Decorators_1, Math2_1) {
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
    })(TemperatureOverlayMode || (exports.TemperatureOverlayMode = TemperatureOverlayMode = {}));
    class TemperatureOverlay extends UniversalOverlay_1.default {
        constructor() {
            super(...arguments);
            this.mode = TemperatureOverlayMode.None;
        }
        get minVector() {
            return TemperatureManager_1.TEMPERATURE_BOUNDARY_MIN_VEC2;
        }
        get maxVector() {
            return localIsland.temperature.temperatureBoundaryMaxVector;
        }
        getMode() {
            return this.mode;
        }
        setMode(mode) {
            if (this.mode === mode) {
                return this;
            }
            if (this.mode === TemperatureOverlayMode.None) {
                this.show();
            }
            this.mode = mode;
            if (this.mode === TemperatureOverlayMode.None) {
                this.hide();
            }
            this.refresh();
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
        onPreMoveToIsland() {
            super.onPreMoveToIsland();
            localIsland.temperature.event.unsubscribe("updateProducedTile", this.onUpdateProduced);
            localIsland.temperature.event.unsubscribe("recalculate", this.recalculateTile);
        }
        onLoadOnIsland() {
            super.onLoadOnIsland();
            localIsland.temperature.event.subscribe("updateProducedTile", this.onUpdateProduced);
            localIsland.temperature.event.subscribe("recalculate", this.recalculateTile);
        }
        onUpdateProduced(temperatureManager, tile, invalidateRange) {
            this.invalidate(tile, invalidateRange);
        }
        recalculateTile(temperatureManager, x, y, z, tempType) {
            this.addOrUpdate(localIsland.getTile(x, y, z));
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
    exports.TemperatureOverlay = TemperatureOverlay;
    __decorate([
        Decorators_1.Bound
    ], TemperatureOverlay.prototype, "onUpdateProduced", null);
    __decorate([
        Decorators_1.Bound
    ], TemperatureOverlay.prototype, "recalculateTile", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmVPdmVybGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL292ZXJsYXkvVGVtcGVyYXR1cmVPdmVybGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7Ozs7Ozs7SUFZSCxNQUFNLFVBQVUsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLE1BQU0sVUFBVSxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFM0MsTUFBTSxVQUFVLEdBQUcsZUFBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzQyxNQUFNLFNBQVMsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTFDLElBQVksc0JBSVg7SUFKRCxXQUFZLHNCQUFzQjtRQUNqQyxtRUFBSSxDQUFBO1FBQ0osMkVBQVEsQ0FBQTtRQUNSLCtFQUFVLENBQUE7SUFDWCxDQUFDLEVBSlcsc0JBQXNCLHNDQUF0QixzQkFBc0IsUUFJakM7SUFFRCxNQUFhLGtCQUFtQixTQUFRLDBCQUFnQjtRQUF4RDs7WUFVUyxTQUFJLEdBQUcsc0JBQXNCLENBQUMsSUFBSSxDQUFDO1FBcUc1QyxDQUFDO1FBN0dBLElBQW9CLFNBQVM7WUFDNUIsT0FBTyxrREFBNkIsQ0FBQztRQUN0QyxDQUFDO1FBRUQsSUFBb0IsU0FBUztZQUM1QixPQUFPLFdBQVcsQ0FBQyxXQUFXLENBQUMsNEJBQTRCLENBQUM7UUFDN0QsQ0FBQztRQUlNLE9BQU87WUFDYixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbEIsQ0FBQztRQUVNLE9BQU8sQ0FBQyxJQUE0QjtZQUMxQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO2dCQUN2QixPQUFPLElBQUksQ0FBQzthQUNaO1lBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLHNCQUFzQixDQUFD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
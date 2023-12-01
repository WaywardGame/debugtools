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
define(["require", "exports", "@wayward/game/game/temperature/ITemperature", "@wayward/game/game/temperature/TemperatureManager", "@wayward/game/game/tile/ITerrain", "@wayward/game/renderer/overlay/UniversalOverlay", "@wayward/utilities/Color", "@wayward/utilities/Decorators", "@wayward/utilities/math/Math2"], function (require, exports, ITemperature_1, TemperatureManager_1, ITerrain_1, UniversalOverlay_1, Color_1, Decorators_1, Math2_1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmVPdmVybGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL292ZXJsYXkvVGVtcGVyYXR1cmVPdmVybGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7Ozs7Ozs7SUFZSCxNQUFNLFVBQVUsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLE1BQU0sVUFBVSxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFM0MsTUFBTSxVQUFVLEdBQUcsZUFBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzQyxNQUFNLFNBQVMsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTFDLElBQVksc0JBSVg7SUFKRCxXQUFZLHNCQUFzQjtRQUNqQyxtRUFBSSxDQUFBO1FBQ0osMkVBQVEsQ0FBQTtRQUNSLCtFQUFVLENBQUE7SUFDWCxDQUFDLEVBSlcsc0JBQXNCLHNDQUF0QixzQkFBc0IsUUFJakM7SUFFRCxNQUFhLGtCQUFtQixTQUFRLDBCQUFnQjtRQUF4RDs7WUFVUyxTQUFJLEdBQUcsc0JBQXNCLENBQUMsSUFBSSxDQUFDO1FBcUc1QyxDQUFDO1FBN0dBLElBQW9CLFNBQVM7WUFDNUIsT0FBTyxrREFBNkIsQ0FBQztRQUN0QyxDQUFDO1FBRUQsSUFBb0IsU0FBUztZQUM1QixPQUFPLFdBQVcsQ0FBQyxXQUFXLENBQUMsNEJBQTRCLENBQUM7UUFDN0QsQ0FBQztRQUlNLE9BQU87WUFDYixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbEIsQ0FBQztRQUVNLE9BQU8sQ0FBQyxJQUE0QjtZQUMxQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFLENBQUM7Z0JBQ3hCLE9BQU8sSUFBSSxDQUFDO1lBQ2IsQ0FBQztZQUVELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxz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
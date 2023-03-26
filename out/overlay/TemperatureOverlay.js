var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventBuses", "event/EventManager", "game/temperature/ITemperature", "game/temperature/TemperatureManager", "game/tile/ITerrain", "utilities/Color", "utilities/Decorators", "utilities/math/Math2", "utilities/math/Vector2"], function (require, exports, EventBuses_1, EventManager_1, ITemperature_1, TemperatureManager_1, ITerrain_1, Color_1, Decorators_1, Math2_1, Vector2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemperatureOverlay = void 0;
    const COLOR_COLD = Color_1.default.fromInt(0x00B5FF);
    const COLOR_NEUTRAL = Color_1.default.fromInt(0xFFFFFF);
    const COLOR_HOT = Color_1.default.fromInt(0xFF1C00);
    class TemperatureOverlay {
        constructor() {
            this.overlay = new Map();
            this.alpha = 0;
            this.scheduledInvalidations = [];
            EventManager_1.default.registerEventBusSubscriber(this);
        }
        show() {
            this.updateAlpha(200);
        }
        hide() {
            this.updateAlpha(0);
        }
        addOrUpdate(tile) {
            const key = `${tile.x},${tile.y},${tile.z}`;
            let overlay = this.overlay.get(key);
            if (overlay) {
                tile.removeOverlay(overlay);
            }
            if (!this.alpha) {
                return;
            }
            const temperature = this.getTileMod(tile);
            if (temperature !== "?") {
                let color;
                let alpha = 0;
                if (temperature < 0) {
                    alpha = 1 - (temperature + 100) / 100;
                    color = Color_1.default.blend(COLOR_NEUTRAL, COLOR_COLD, alpha);
                }
                else {
                    alpha = temperature / 100;
                    color = Color_1.default.blend(COLOR_NEUTRAL, COLOR_HOT, alpha);
                }
                overlay = {
                    type: ITerrain_1.OverlayType.Full,
                    size: 16,
                    ...Color_1.default.getFullNames(color),
                    alpha: Math.floor(Math2_1.default.lerp(0, this.alpha, alpha)),
                };
            }
            else {
                overlay = {
                    type: ITerrain_1.OverlayType.QuestionMark,
                    size: 16,
                    alpha: this.alpha ? 150 : 0,
                };
            }
            this.overlay.set(key, overlay);
            tile.addOverlay(overlay);
        }
        clear() {
            if (localIsland) {
                for (const [key, overlay] of this.overlay.entries()) {
                    const [x, y, z] = key.split(",");
                    localIsland.getTile(+x, +y, +z).removeOverlay(overlay);
                }
            }
            this.overlay.clear();
        }
        updateAlpha(alpha) {
            this.alpha = alpha;
            for (const [, overlay] of this.overlay.entries()) {
                overlay.alpha = this.alpha;
            }
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
            return heat - cold;
        }
    }
    __decorate([
        Decorators_1.Bound
    ], TemperatureOverlay.prototype, "addOrUpdate", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Game, "tickEnd")
    ], TemperatureOverlay.prototype, "onTickEnd", null);
    __decorate([
        (0, EventManager_1.EventHandler)(TemperatureManager_1.default, "updateProducedTile")
    ], TemperatureOverlay.prototype, "onUpdateProduced", null);
    exports.TemperatureOverlay = TemperatureOverlay;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmVPdmVybGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL292ZXJsYXkvVGVtcGVyYXR1cmVPdmVybGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFXQSxNQUFNLFVBQVUsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLE1BQU0sYUFBYSxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUMsTUFBTSxTQUFTLEdBQUcsZUFBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUUxQyxNQUFhLGtCQUFrQjtRQU05QjtZQUppQixZQUFPLEdBQThCLElBQUksR0FBRyxFQUFFLENBQUM7WUFFeEQsVUFBSyxHQUFHLENBQUMsQ0FBQztZQXNHViwyQkFBc0IsR0FBcUMsRUFBRSxDQUFDO1lBbkdyRSxzQkFBWSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUFFTSxJQUFJO1lBQ1YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBRU0sSUFBSTtZQUNWLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUVhLFdBQVcsQ0FBQyxJQUFVO1lBQ25DLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUU1QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNwQyxJQUFJLE9BQU8sRUFBRTtnQkFDWixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzVCO1lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hCLE9BQU87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
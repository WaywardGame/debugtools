var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventBuses", "event/EventEmitter", "event/EventManager", "game/temperature/ITemperature", "game/temperature/TemperatureManager", "game/tile/ITerrain", "renderer/IRenderer", "renderer/overlay/GenericOverlay", "utilities/Color", "utilities/Decorators", "utilities/math/Math2", "utilities/math/Vector2"], function (require, exports, EventBuses_1, EventEmitter_1, EventManager_1, ITemperature_1, TemperatureManager_1, ITerrain_1, IRenderer_1, GenericOverlay_1, Color_1, Decorators_1, Math2_1, Vector2_1) {
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
            super(...arguments);
            this.mode = TemperatureOverlayMode.None;
            this.scheduledInvalidations = [];
        }
        subscribeEvents(island = localIsland) {
            EventManager_1.default.registerEventBusSubscriber(this);
            island.temperature.event.subscribe("updateProducedTile", this.onUpdateProduced);
            island.temperature.event.subscribe("recalculate", this.recalculateTile);
        }
        unsubscribeEvents(island = localIsland) {
            EventManager_1.default.deregisterEventBusSubscriber(this);
            island.temperature.event.unsubscribe("updateProducedTile", this.onUpdateProduced);
            island.temperature.event.unsubscribe("recalculate", this.recalculateTile);
        }
        getMode() {
            return this.mode;
        }
        setMode(mode) {
            if (this.mode === mode) {
                return this;
            }
            this.mode = mode;
            this.refresh();
            renderers.updateRender(undefined, IRenderer_1.RenderSource.Mod, IRenderer_1.UpdateRenderFlag.World);
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
            if (this.mode === TemperatureOverlayMode.None || !this.alpha) {
                return;
            }
            for (const { tile, range } of this.scheduledInvalidations) {
                if (tile.z !== localPlayer.z) {
                    continue;
                }
                Vector2_1.default.forRange(tile, range ?? 0, TemperatureManager_1.TEMPERATURE_BOUNDARY_MIN_VEC2, localIsland.temperature.temperatureBoundaryMaxVector, true, vec => this.addOrUpdate(tile.island.getTile(vec.x, vec.y, tile.z)));
            }
        }
        onPreMoveToIsland() {
            this.clear();
        }
        onChangeZOrIsland() {
            this.refresh();
        }
        onUpdateProduced(temperatureManager, tile, invalidateRange) {
            this.scheduledInvalidations.push({ tile, range: invalidateRange });
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
        refresh() {
            this.clear();
            this.scheduledInvalidations.length = 0;
            if (this.mode === TemperatureOverlayMode.None || !localIsland) {
                return;
            }
            for (let y = 0; y < localIsland.mapSize; y++) {
                for (let x = 0; x < localIsland.mapSize; x++) {
                    const tile = localIsland.getTileSafe(x, y, localPlayer.z);
                    if (tile) {
                        this.addOrUpdate(tile);
                    }
                }
            }
        }
    }
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Game, "tickEnd", EventEmitter_1.Priority.Lowest - 1)
    ], TemperatureOverlay.prototype, "onTickEnd", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "preMoveToIsland")
    ], TemperatureOverlay.prototype, "onPreMoveToIsland", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "changeZ"),
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "moveToIsland")
    ], TemperatureOverlay.prototype, "onChangeZOrIsland", null);
    __decorate([
        Decorators_1.Bound
    ], TemperatureOverlay.prototype, "onUpdateProduced", null);
    __decorate([
        Decorators_1.Bound
    ], TemperatureOverlay.prototype, "recalculateTile", null);
    exports.TemperatureOverlay = TemperatureOverlay;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmVPdmVybGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL292ZXJsYXkvVGVtcGVyYXR1cmVPdmVybGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFjQSxNQUFNLFVBQVUsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLE1BQU0sVUFBVSxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFM0MsTUFBTSxVQUFVLEdBQUcsZUFBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzQyxNQUFNLFNBQVMsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTFDLElBQVksc0JBSVg7SUFKRCxXQUFZLHNCQUFzQjtRQUNqQyxtRUFBSSxDQUFBO1FBQ0osMkVBQVEsQ0FBQTtRQUNSLCtFQUFVLENBQUE7SUFDWCxDQUFDLEVBSlcsc0JBQXNCLEdBQXRCLDhCQUFzQixLQUF0Qiw4QkFBc0IsUUFJakM7SUFFRCxNQUFhLGtCQUFtQixTQUFRLHdCQUFjO1FBQXREOztZQUVTLFNBQUksR0FBRyxzQkFBc0IsQ0FBQyxJQUFJLENBQUM7WUFpR25DLDJCQUFzQixHQUFxQyxFQUFFLENBQUM7UUFpRHZFLENBQUM7UUFoSk8sZUFBZSxDQUFDLE1BQU0sR0FBRyxXQUFXO1lBQzFDLHNCQUFZLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ2hGLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3pFLENBQUM7UUFFTSxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcs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
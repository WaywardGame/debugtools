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
            this.subscribed = false;
            this.scheduledInvalidations = [];
        }
        subscribeEvents(island = localIsland) {
            if (this.subscribed) {
                return;
            }
            this.subscribed = true;
            EventManager_1.default.registerEventBusSubscriber(this);
            island.temperature.event.subscribe("updateProducedTile", this.onUpdateProduced);
            island.temperature.event.subscribe("recalculate", this.recalculateTile);
        }
        unsubscribeEvents(island = localIsland) {
            if (!this.subscribed) {
                return;
            }
            this.subscribed = false;
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
            if (this.mode === TemperatureOverlayMode.None) {
                this.subscribeEvents();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGVyYXR1cmVPdmVybGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL292ZXJsYXkvVGVtcGVyYXR1cmVPdmVybGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFjQSxNQUFNLFVBQVUsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLE1BQU0sVUFBVSxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFM0MsTUFBTSxVQUFVLEdBQUcsZUFBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzQyxNQUFNLFNBQVMsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTFDLElBQVksc0JBSVg7SUFKRCxXQUFZLHNCQUFzQjtRQUNqQyxtRUFBSSxDQUFBO1FBQ0osMkVBQVEsQ0FBQTtRQUNSLCtFQUFVLENBQUE7SUFDWCxDQUFDLEVBSlcsc0JBQXNCLEdBQXRCLDhCQUFzQixLQUF0Qiw4QkFBc0IsUUFJakM7SUFFRCxNQUFhLGtCQUFtQixTQUFRLHdCQUFjO1FBQXREOztZQUVTLFNBQUksR0FBRyxzQkFBc0IsQ0FBQyxJQUFJLENBQUM7WUFFbkMsZUFBVSxHQUFHLEtBQUssQ0FBQztZQWlIbkIsMkJBQXNCLEdBQXFDLEVBQUUsQ0FBQztRQWlEdkUsQ0FBQztRQWhLTyxlQUFlLENBQUMsTUFBTSxHQUFHLFdBQVc7WUFDMUMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNwQixPQUFPO2FBQ1A7WUFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUV2QixzQkFBWSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNoRixNQUFN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
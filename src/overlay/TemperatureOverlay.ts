import { EventBus } from "event/EventBuses";
import { Priority } from "event/EventEmitter";
import EventManager, { EventHandler } from "event/EventManager";
import { TempType, Temperature } from "game/temperature/ITemperature";
import TemperatureManager, { TEMPERATURE_BOUNDARY_MIN_VEC2, TEMPERATURE_INVALID } from "game/temperature/TemperatureManager";
import { IOverlayInfo, OverlayType } from "game/tile/ITerrain";
import Tile from "game/tile/Tile";
import { RenderSource, UpdateRenderFlag } from "renderer/IRenderer";
import GenericOverlay from "renderer/overlay/GenericOverlay";
import Color, { IRGB } from "utilities/Color";
import { Bound } from "utilities/Decorators";
import Math2 from "utilities/math/Math2";
import Vector2 from "utilities/math/Vector2";

const COLOR_COOL = Color.fromInt(0x00B5FF);
const COLOR_COLD = Color.fromInt(0x78FFFF);
// const COLOR_NEUTRAL = Color.fromInt(0xFFFFFF);
const COLOR_WARM = Color.fromInt(0xFFA600);
const COLOR_HOT = Color.fromInt(0xFF1C00);

export enum TemperatureOverlayMode {
	None,
	Produced,
	Calculated,
}

export class TemperatureOverlay extends GenericOverlay {

	private mode = TemperatureOverlayMode.None;

	private subscribed = false;

	public subscribeEvents(island = localIsland) {
		if (this.subscribed) {
			return;
		}

		this.subscribed = true;

		EventManager.registerEventBusSubscriber(this);
		island.temperature.event.subscribe("updateProducedTile", this.onUpdateProduced);
		island.temperature.event.subscribe("recalculate", this.recalculateTile);
	}

	public unsubscribeEvents(island = localIsland) {
		if (!this.subscribed) {
			return;
		}

		this.subscribed = false;

		EventManager.deregisterEventBusSubscriber(this);
		island.temperature.event.unsubscribe("updateProducedTile", this.onUpdateProduced);
		island.temperature.event.unsubscribe("recalculate", this.recalculateTile);
	}

	public getMode() {
		return this.mode;
	}

	public setMode(mode: TemperatureOverlayMode) {
		if (this.mode === mode) {
			return this;
		}

		if (this.mode === TemperatureOverlayMode.None) {
			this.subscribeEvents();
		}

		this.mode = mode;

		this.refresh();

		renderers.updateRender(undefined, RenderSource.Mod, UpdateRenderFlag.World);

		return this;
	}

	protected override generateOverlayInfo(tile: Tile): IOverlayInfo | undefined {
		const temperature = this.getTileMod(tile);
		if (temperature === "?") {
			return {
				type: OverlayType.QuestionMark,
				size: 16,
				alpha: this.alpha ? 150 : 0,
			};
		}

		let color: IRGB | undefined;

		let alpha = 0;
		if (temperature < 0) {
			alpha = 1 - (temperature + 100) / 100;
			color = Color.blend(COLOR_COOL, COLOR_COLD, alpha);

		} else if (temperature > 0) {
			alpha = temperature / 100;
			color = Color.blend(COLOR_WARM, COLOR_HOT, alpha);
		}

		if (color) {
			return {
				type: OverlayType.Full,
				size: 16,
				...Color.getFullNames(color),
				alpha: Math.floor(Math2.lerp(0, this.alpha, Math2.curve2(0, 1, alpha))),
			};
		}
	}

	protected override updateOverlayAlpha(tile: Tile): IOverlayInfo | undefined {
		return this.generateOverlayInfo(tile);
	}

	@EventHandler(EventBus.Game, "tickEnd", Priority.Lowest - 1)
	protected onTickEnd() {
		if (this.mode === TemperatureOverlayMode.None || !this.alpha) {
			return;
		}

		// update overlays for tiles that had changes
		for (const { tile, range } of this.scheduledInvalidations) {
			if (tile.z !== localPlayer.z) {
				continue;
			}

			Vector2.forRange(tile, range ?? 0, TEMPERATURE_BOUNDARY_MIN_VEC2, localIsland.temperature.temperatureBoundaryMaxVector, true,
				vec => this.addOrUpdate(tile.island.getTile(vec.x, vec.y, tile.z)));
		}
	}

	@EventHandler(EventBus.LocalPlayer, "preMoveToIsland")
	protected onPreMoveToIsland() {
		// clear all existing overlays since we're leaving
		this.clear();
	}

	@EventHandler(EventBus.LocalPlayer, "changeZ")
	@EventHandler(EventBus.LocalPlayer, "moveToIsland")
	protected onChangeZOrIsland() {
		this.refresh();
	}

	private scheduledInvalidations: { tile: Tile, range?: number }[] = [];

	@Bound protected onUpdateProduced(temperatureManager: TemperatureManager, tile: Tile, invalidateRange?: number) {
		this.scheduledInvalidations.push({ tile, range: invalidateRange });
	}

	@Bound protected recalculateTile(temperatureManager: TemperatureManager, x: number, y: number, z: number, tempType: TempType) {
		this.addOrUpdate(localIsland.getTile(x, y, z));
	}

	private getTemperature(tile: Tile, tempType: TempType) {
		const temp = tile.island.temperature?.getCachedCalculated(tile, tempType);
		return temp === TEMPERATURE_INVALID || temp === undefined ? "?" : temp;
	}

	private getTileMod(tile: Tile) {
		const heat = this.getTemperature(tile, TempType.Heat);
		const cold = this.getTemperature(tile, TempType.Cold);
		if (heat === "?" || cold === "?") return "?";

		let tileTemp = heat - cold;
		if (this.mode === TemperatureOverlayMode.Produced)
			return tileTemp;

		const base = tile.island.temperature.getBiomeBase();
		const time = tile.island.temperature.getBiomeTimeModifier();
		const layer = tile.island.temperature.getLayer(tile.z);

		return Math2.clamp(Temperature.Coldest, Temperature.Hottest, base + time + layer + tileTemp);
	}

	private refresh() {
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

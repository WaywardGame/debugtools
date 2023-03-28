import { EventBus } from "event/EventBuses";
import { Priority } from "event/EventEmitter";
import EventManager, { EventHandler } from "event/EventManager";
import { TempType, Temperature } from "game/temperature/ITemperature";
import TemperatureManager, { TEMPERATURE_BOUNDARY_MIN_VEC2, TEMPERATURE_INVALID } from "game/temperature/TemperatureManager";
import { IOverlayInfo, OverlayType } from "game/tile/ITerrain";
import Tile from "game/tile/Tile";
import GenericOverlay from "renderer/overlay/GenericOverlay";
import Color, { IRGB } from "utilities/Color";
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

	public constructor() {
		super();
		EventManager.registerEventBusSubscriber(this);
	}

	public getMode() {
		return this.mode;
	}

	public setMode(mode: TemperatureOverlayMode) {
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
		this.clear();

		const invalidations = this.scheduledInvalidations.splice(0, Infinity);
		if (!this.alpha) {
			return;
		}

		for (const { tile, range } of invalidations) {
			Vector2.forRange(tile, range ?? 0, TEMPERATURE_BOUNDARY_MIN_VEC2, localIsland.temperature.temperatureBoundaryMaxVector, true,
				vec => this.addOrUpdate(tile.island.getTile(vec.x, vec.y, tile.z)));
		}

		const topLeft = renderer?.worldRenderer.screenToVector(0, 0) ?? Vector2.ZERO;
		const bottomRight = renderer?.worldRenderer.screenToVector(window.innerWidth, window.innerHeight) ?? Vector2.ZERO;
		for (let y = topLeft.y; y < bottomRight.y; y++) {
			for (let x = topLeft.x; x < bottomRight.x; x++) {
				const tile = localIsland.getTile(x, y, localPlayer.z);
				this.addOrUpdate(tile);
			}
		}
	}

	private scheduledInvalidations: { tile: Tile, range?: number }[] = [];

	@EventHandler(TemperatureManager, "updateProducedTile")
	protected onUpdateProduced(temperatureManager: TemperatureManager, tile: Tile, invalidateRange?: number) {
		this.scheduledInvalidations.push({ tile, range: invalidateRange });
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

}

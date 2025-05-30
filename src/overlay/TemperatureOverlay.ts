import { TempType, Temperature } from "@wayward/game/game/temperature/ITemperature";
import type TemperatureManager from "@wayward/game/game/temperature/TemperatureManager";
import { TEMPERATURE_BOUNDARY_MIN_VEC2, TEMPERATURE_INVALID } from "@wayward/game/game/temperature/TemperatureManager";
import type { IOverlayInfo } from "@wayward/game/game/tile/ITerrain";
import { OverlayType } from "@wayward/game/game/tile/ITerrain";
import type Tile from "@wayward/game/game/tile/Tile";
import UniversalOverlay from "@wayward/game/renderer/overlay/UniversalOverlay";
import type { IRGB } from "@wayward/utilities/Color";
import Color from "@wayward/utilities/Color";
import { Bound } from "@wayward/utilities/Decorators";
import Math2 from "@wayward/utilities/math/Math2";
import type Vector2 from "@wayward/game/utilities/math/Vector2";

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

export class TemperatureOverlay extends UniversalOverlay {

	public override get minVector(): Vector2 {
		return TEMPERATURE_BOUNDARY_MIN_VEC2;
	}

	public override get maxVector(): Vector2 {
		return localIsland.temperature.temperatureBoundaryMaxVector;
	}

	private mode = TemperatureOverlayMode.None;

	public getMode(): TemperatureOverlayMode {
		return this.mode;
	}

	public setMode(mode: TemperatureOverlayMode): this {
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

	protected override onPreMoveToIsland(): void {
		super.onPreMoveToIsland();
		localIsland.temperature.event.unsubscribe("updateProducedTile", this.onUpdateProduced);
		localIsland.temperature.event.unsubscribe("recalculate", this.recalculateTile);
	}

	protected override onLoadOnIsland(): void {
		super.onLoadOnIsland();
		localIsland.temperature.event.subscribe("updateProducedTile", this.onUpdateProduced);
		localIsland.temperature.event.subscribe("recalculate", this.recalculateTile);
	}

	@Bound protected onUpdateProduced(temperatureManager: TemperatureManager, tile: Tile, invalidateRange?: number): void {
		this.invalidate(tile, invalidateRange);
	}

	@Bound protected recalculateTile(temperatureManager: TemperatureManager, x: number, y: number, z: number, tempType: TempType): void {
		this.addOrUpdate(localIsland.getTile(x, y, z));
	}

	private getTemperature(tile: Tile, tempType: TempType): number | "?" {
		const temp = tile.island.temperature?.getCachedCalculated(tile, tempType);
		return temp === TEMPERATURE_INVALID || temp === undefined ? "?" : temp;
	}

	private getTileMod(tile: Tile): number | "?" {
		const heat = this.getTemperature(tile, TempType.Heat);
		const cold = this.getTemperature(tile, TempType.Cold);
		if (heat === "?" || cold === "?") {
			return "?";
		}

		const tileTemp = heat - cold;
		if (this.mode === TemperatureOverlayMode.Produced) {
			return tileTemp;
		}

		const base = tile.island.temperature.getBiomeBase();
		const time = tile.island.temperature.getBiomeTimeModifier();
		const layer = tile.island.temperature.getLayer(tile.z);

		return Math2.clamp(Temperature.Coldest, Temperature.Hottest, base + time + layer + tileTemp);
	}
}

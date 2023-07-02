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

import { TempType, Temperature } from "game/temperature/ITemperature";
import TemperatureManager, { TEMPERATURE_BOUNDARY_MIN_VEC2, TEMPERATURE_INVALID } from "game/temperature/TemperatureManager";
import { IOverlayInfo, OverlayType } from "game/tile/ITerrain";
import Tile from "game/tile/Tile";
import UniversalOverlay from "renderer/overlay/UniversalOverlay";
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

export class TemperatureOverlay extends UniversalOverlay {

	public override get minVector(): Vector2 {
		return TEMPERATURE_BOUNDARY_MIN_VEC2;
	}

	public override get maxVector(): Vector2 {
		return localIsland.temperature.temperatureBoundaryMaxVector;
	}

	private mode = TemperatureOverlayMode.None;

	public getMode() {
		return this.mode;
	}

	public setMode(mode: TemperatureOverlayMode) {
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

	protected override onPreMoveToIsland() {
		super.onPreMoveToIsland();
		localIsland.temperature.event.unsubscribe("updateProducedTile", this.onUpdateProduced);
		localIsland.temperature.event.unsubscribe("recalculate", this.recalculateTile);
	}

	protected override onLoadOnIsland(): void {
		super.onLoadOnIsland();
		localIsland.temperature.event.subscribe("updateProducedTile", this.onUpdateProduced);
		localIsland.temperature.event.subscribe("recalculate", this.recalculateTile);
	}

	@Bound protected onUpdateProduced(temperatureManager: TemperatureManager, tile: Tile, invalidateRange?: number) {
		this.invalidate(tile, invalidateRange);
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
}

import { EventBus } from "event/EventBuses";
import EventManager, { EventHandler } from "event/EventManager";
import { TempType } from "game/temperature/ITemperature";
import TemperatureManager, { TEMPERATURE_BOUNDARY_MIN_VEC2, TEMPERATURE_INVALID } from "game/temperature/TemperatureManager";
import { IOverlayInfo, OverlayType } from "game/tile/ITerrain";
import Tile from "game/tile/Tile";
import Color, { IRGB } from "utilities/Color";
import { Bound } from "utilities/Decorators";
import Math2 from "utilities/math/Math2";
import Vector2 from "utilities/math/Vector2";

const COLOR_COLD = Color.fromInt(0x00B5FF);
const COLOR_NEUTRAL = Color.fromInt(0xFFFFFF);
const COLOR_HOT = Color.fromInt(0xFF1C00);

export class TemperatureOverlay {

	private readonly overlay: Map<string, IOverlayInfo> = new Map();

	private alpha = 0;

	public constructor() {
		EventManager.registerEventBusSubscriber(this);
	}

	public show() {
		this.updateAlpha(200);
	}

	public hide() {
		this.updateAlpha(0);
	}

	@Bound public addOrUpdate(tile: Tile) {
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
			let color: IRGB;

			let alpha = 0;
			if (temperature < 0) {
				alpha = 1 - (temperature + 100) / 100;
				color = Color.blend(COLOR_NEUTRAL, COLOR_COLD, alpha);

			} else {
				alpha = temperature / 100;
				color = Color.blend(COLOR_NEUTRAL, COLOR_HOT, alpha);
			}

			overlay = {
				type: OverlayType.Full,
				size: 16,
				...Color.getFullNames(color),
				alpha: Math.floor(Math2.lerp(0, this.alpha, alpha)),
			};

		} else {
			overlay = {
				type: OverlayType.QuestionMark,
				size: 16,
				alpha: this.alpha ? 150 : 0,
			};
		}

		this.overlay.set(key, overlay);
		tile.addOverlay(overlay);
	}

	public clear() {
		if (localIsland) {
			for (const [key, overlay] of this.overlay.entries()) {
				const [x, y, z] = key.split(",");
				localIsland.getTile(+x, +y, +z).removeOverlay(overlay);
			}
		}

		this.overlay.clear();
	}

	private updateAlpha(alpha: number) {
		this.alpha = alpha;

		for (const [, overlay] of this.overlay.entries()) {
			overlay.alpha = this.alpha;
		}
	}

	@EventHandler(EventBus.Game, "tickEnd")
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
		return heat - cold;
	}

}

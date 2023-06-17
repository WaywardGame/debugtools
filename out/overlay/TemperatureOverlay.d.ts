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
import { TempType } from "game/temperature/ITemperature";
import TemperatureManager from "game/temperature/TemperatureManager";
import { IOverlayInfo } from "game/tile/ITerrain";
import Tile from "game/tile/Tile";
import UniversalOverlay from "renderer/overlay/UniversalOverlay";
import Vector2 from "utilities/math/Vector2";
export declare enum TemperatureOverlayMode {
    None = 0,
    Produced = 1,
    Calculated = 2
}
export declare class TemperatureOverlay extends UniversalOverlay {
    get minVector(): Vector2;
    get maxVector(): Vector2;
    private mode;
    getMode(): TemperatureOverlayMode;
    setMode(mode: TemperatureOverlayMode): this;
    protected generateOverlayInfo(tile: Tile): IOverlayInfo | undefined;
    protected updateOverlayAlpha(tile: Tile): IOverlayInfo | undefined;
    protected onPreMoveToIsland(): void;
    protected onLoadOnIsland(): void;
    protected onUpdateProduced(temperatureManager: TemperatureManager, tile: Tile, invalidateRange?: number): void;
    protected recalculateTile(temperatureManager: TemperatureManager, x: number, y: number, z: number, tempType: TempType): void;
    private getTemperature;
    private getTileMod;
}

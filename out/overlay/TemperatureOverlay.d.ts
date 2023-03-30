import TemperatureManager from "game/temperature/TemperatureManager";
import { IOverlayInfo } from "game/tile/ITerrain";
import Tile from "game/tile/Tile";
import GenericOverlay from "renderer/overlay/GenericOverlay";
export declare enum TemperatureOverlayMode {
    None = 0,
    Produced = 1,
    Calculated = 2
}
export declare class TemperatureOverlay extends GenericOverlay {
    private mode;
    constructor();
    getMode(): TemperatureOverlayMode;
    setMode(mode: TemperatureOverlayMode): this;
    protected generateOverlayInfo(tile: Tile): IOverlayInfo | undefined;
    protected updateOverlayAlpha(tile: Tile): IOverlayInfo | undefined;
    protected onTickEnd(): void;
    protected onChangeZOrIsland(): void;
    private scheduledInvalidations;
    protected onUpdateProduced(temperatureManager: TemperatureManager, tile: Tile, invalidateRange?: number): void;
    private getTemperature;
    private getTileMod;
    private refresh;
}

import TemperatureManager from "game/temperature/TemperatureManager";
import Tile from "game/tile/Tile";
export declare class TemperatureOverlay {
    private readonly overlay;
    private alpha;
    constructor();
    show(): void;
    hide(): void;
    addOrUpdate(tile: Tile): void;
    clear(): void;
    private updateAlpha;
    protected onTickEnd(): void;
    private scheduledInvalidations;
    protected onUpdateProduced(temperatureManager: TemperatureManager, tile: Tile, invalidateRange?: number): void;
    private getTemperature;
    private getTileMod;
}

import { TempType } from "game/temperature/ITemperature";
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
    private subscribed;
    subscribeEvents(island?: import("../../node_modules/@wayward/types/definitions/game/game/island/Island").default): void;
    unsubscribeEvents(island?: import("../../node_modules/@wayward/types/definitions/game/game/island/Island").default): void;
    getMode(): TemperatureOverlayMode;
    setMode(mode: TemperatureOverlayMode): this;
    protected generateOverlayInfo(tile: Tile): IOverlayInfo | undefined;
    protected updateOverlayAlpha(tile: Tile): IOverlayInfo | undefined;
    protected onTickEnd(): void;
    protected onPreMoveToIsland(): void;
    protected onChangeZOrIsland(): void;
    private scheduledInvalidations;
    protected onUpdateProduced(temperatureManager: TemperatureManager, tile: Tile, invalidateRange?: number): void;
    protected recalculateTile(temperatureManager: TemperatureManager, x: number, y: number, z: number, tempType: TempType): void;
    private getTemperature;
    private getTileMod;
    private refresh;
}

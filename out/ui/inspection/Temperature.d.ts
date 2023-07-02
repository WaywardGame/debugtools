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
import { InfoProviderContext } from "game/inspection/InfoProviderContext";
import Inspection from "game/inspection/Inspection";
import LabelledValue from "game/inspection/infoProviders/LabelledValue";
import DebugTools from "../../DebugTools";
import Tile from "game/tile/Tile";
export default class TemperatureInspection extends Inspection<Tile> {
    private tempValue?;
    static readonly DEBUG_TOOLS: DebugTools;
    static getFromTile(tile: Tile): never[] | TemperatureInspection;
    constructor(tile: Tile);
    getId(): string;
    getPriority(): number;
    hasContent(): boolean;
    get(context: InfoProviderContext): LabelledValue[];
    onTickEnd(): void;
    private getTemperature;
    private getTileMod;
}

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
import { InfoProviderContext } from "@wayward/game/game/inspection/InfoProviderContext";
import Inspection from "@wayward/game/game/inspection/Inspection";
import LabelledValue from "@wayward/game/game/inspection/infoProviders/LabelledValue";
import DebugTools from "../../DebugTools";
import Tile from "@wayward/game/game/tile/Tile";
import Island from "@wayward/game/game/island/Island";
export default class TemperatureInspection extends Inspection<Tile> {
    private tempValue?;
    static readonly DEBUG_TOOLS: DebugTools;
    static getFromTile(tile: Tile): never[] | TemperatureInspection;
    constructor(tile: Tile);
    getId(): string;
    getPriority(): number;
    hasContent(): boolean;
    get(context: InfoProviderContext): LabelledValue[];
    onTickEnd(island: Island): void;
    private getTemperature;
    private getTileMod;
}

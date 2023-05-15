import { InfoProviderContext } from "game/inspection/InfoProviderContext";
import Inspection from "game/inspection/Inspection";
import LabelledValue from "game/inspection/infoProviders/LabelledValue";
import DebugTools from "../../DebugTools";
import Tile from "game/tile/Tile";
export default class TemperatureInspection extends Inspection<Tile> {
    static readonly DEBUG_TOOLS: DebugTools;
    static getFromTile(tile: Tile): TemperatureInspection | never[];
    constructor(tile: Tile);
    getId(): string;
    getPriority(): number;
    hasContent(): boolean;
    get(context: InfoProviderContext): LabelledValue[];
    onTickEnd(): void;
    private getTemperature;
    private getTileMod;
}

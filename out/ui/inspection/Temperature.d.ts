import { InfoProviderContext } from "game/inspection/InfoProvider";
import Inspection from "game/inspection/Inspection";
import { IVector3 } from "utilities/math/IVector";
import DebugTools from "../../DebugTools";
export default class TemperatureInspection extends Inspection<IVector3> {
    static readonly DEBUG_TOOLS: DebugTools;
    static getFromTile(position: IVector3): TemperatureInspection;
    constructor(tile: IVector3);
    getId(): string;
    getPriority(): number;
    hasContent(): boolean;
    get(context: InfoProviderContext): import("../../../node_modules/@wayward/types/definitions/game/inspection/InfoProvider").SimpleInfoProvider[];
    onTickEnd(): void;
    private getTemperature;
}

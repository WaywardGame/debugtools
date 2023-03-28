import { InfoProviderContext } from "game/inspection/InfoProviderContext";
import Inspection from "game/inspection/Inspection";
import LabelledValue from "game/inspection/infoProviders/LabelledValue";
import { IVector3 } from "utilities/math/IVector";
import DebugTools from "../../DebugTools";
export default class TemperatureInspection extends Inspection<IVector3> {
    static readonly DEBUG_TOOLS: DebugTools;
    static getFromTile(position: IVector3): never[] | TemperatureInspection;
    constructor(tile: IVector3);
    getId(): string;
    getPriority(): number;
    hasContent(): boolean;
    get(context: InfoProviderContext): LabelledValue[];
    onTickEnd(): void;
    private getTemperature;
    private getTileMod;
}

import { ActionUsability } from "entity/action/IAction";
import Log from "utilities/Log";
import DebugTools from "./DebugTools";
export declare const defaultUsability: ActionUsability[];
export default class Actions {
    static readonly DEBUG_TOOLS: DebugTools;
    static readonly LOG: Log;
}

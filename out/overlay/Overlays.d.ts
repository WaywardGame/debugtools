import { IOverlayInfo } from "game/tile/ITerrain";
import DebugTools from "../DebugTools";
export default class Overlays {
    static readonly DEBUG_TOOLS: DebugTools;
    static isPaint(overlay: IOverlayInfo): boolean;
    static isHoverTarget(overlay: IOverlayInfo): boolean;
    static isSelectedTarget(overlay: IOverlayInfo): boolean;
}

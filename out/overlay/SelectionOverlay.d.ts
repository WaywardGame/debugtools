import Tile from "game/tile/Tile";
import DebugTools from "../DebugTools";
export default class SelectionOverlay {
    static readonly debugTools: DebugTools;
    static add(tile: Tile): boolean;
    static remove(tile: Tile): boolean;
}

import Tile from "game/tile/Tile";
import DebugTools from "../DebugTools";
export default class SelectionOverlay {
    private static readonly overlays;
    private static readonly subTileOverlays;
    static readonly debugTools: DebugTools;
    static add(tile: Tile): boolean;
    static remove(tile: Tile): boolean;
    private static updateSelectionOverlay;
    private static getPaintOverlayConnections;
}

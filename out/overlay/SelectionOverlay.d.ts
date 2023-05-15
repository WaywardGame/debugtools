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

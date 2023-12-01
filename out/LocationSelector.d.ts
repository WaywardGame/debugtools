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
import Tile from "@wayward/game/game/tile/Tile";
import Bindable from "@wayward/game/ui/input/Bindable";
import DebugTools from "./DebugTools";
import CancelablePromise from "@wayward/utilities/promise/CancelablePromise";
export default class SelectLocation {
    readonly DEBUG_TOOLS: DebugTools;
    readonly bindableSelectLocation: Bindable;
    readonly bindableCancelSelectLocation: Bindable;
    get selecting(): boolean;
    private hoverTile?;
    private selectTileHeld;
    private selectionPromise;
    select(): CancelablePromise<Tile>;
    protected canClientMove(): false | undefined;
    protected onSelectOrCancelSelectLocation(): boolean;
    protected onStopSelectLocation(): boolean;
    private selectionTick;
    private cancel;
    private selectTile;
}

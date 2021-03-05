import Bindable from "ui/input/Bindable";
import Vector2 from "utilities/math/Vector2";
import DebugTools from "./DebugTools";
import CancelablePromise from "./util/CancelablePromise";
export default class SelectLocation {
    readonly DEBUG_TOOLS: DebugTools;
    readonly bindableSelectLocation: Bindable;
    readonly bindableCancelSelectLocation: Bindable;
    private _selecting;
    get selecting(): boolean;
    private hoverTile?;
    private selectTileHeld;
    private selectionPromise;
    select(): CancelablePromise<Vector2>;
    protected canClientMove(): false | undefined;
    protected onSelectOrCancelSelectLocation(): boolean;
    protected onStopSelectLocation(): boolean;
    private selectionTick;
    private cancel;
    private selectTile;
}

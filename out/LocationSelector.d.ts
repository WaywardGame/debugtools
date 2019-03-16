import { IHookHost } from "mod/IHookHost";
import { Bindable, BindCatcherApi } from "newui/BindingManager";
import Vector2 from "utilities/math/Vector2";
import DebugTools from "./DebugTools";
import CancelablePromise from "./util/CancelablePromise";
export default class SelectLocation implements IHookHost {
    readonly DEBUG_TOOLS: DebugTools;
    readonly bindableSelectLocation: Bindable;
    readonly bindableCancelSelectLocation: Bindable;
    private _selecting;
    readonly selecting: boolean;
    private hoverTile?;
    private selectTileHeld;
    private selectionPromise;
    select(): CancelablePromise<Vector2>;
    onBindLoop(bindPressed: Bindable, api: BindCatcherApi): Bindable;
    canClientMove(api: BindCatcherApi): false | undefined;
    private cancel;
    private selectTile;
}

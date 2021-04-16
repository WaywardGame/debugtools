import { ITile } from "game/tile/ITerrain";
import { IVector2, IVector3 } from "utilities/math/IVector";
import DebugTools from "../DebugTools";
export default class SelectionOverlay {
    static readonly debugTools: DebugTools;
    static add(tilePosition: IVector2 | IVector3, tile?: ITile): void;
    static remove(tilePosition: IVector2 | IVector3, tile?: ITile): void;
}

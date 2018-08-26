import { ITile } from "tile/ITerrain";
import { IVector2, IVector3 } from "utilities/math/IVector";
declare module Selection {
    function add(tilePosition: IVector2 | IVector3, tile?: ITile): void;
    function remove(tilePosition: IVector2 | IVector3, tile?: ITile): void;
}
export default Selection;

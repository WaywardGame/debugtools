import { IHookHost } from "mod/IHookHost";
import Component from "newui/component/Component";
import Dialog from "newui/screen/screens/game/component/Dialog";
import { DialogId, IDialogDescription } from "newui/screen/screens/game/Dialogs";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import Vector2 from "utilities/math/Vector2";
export interface IInspectInformationSection extends Component {
    update(position: IVector2, tile: ITile): void;
}
export default class InspectDialog extends Dialog implements IHookHost {
    static description: IDialogDescription;
    private title;
    private infoSections;
    private tilePosition?;
    private tile?;
    constructor(gsapi: IGameScreenApi, id: DialogId);
    getName(): import("language/Translation").default;
    setInspectionTile(tilePosition: Vector2): this;
    onGameTickEnd(): void;
    private update;
}

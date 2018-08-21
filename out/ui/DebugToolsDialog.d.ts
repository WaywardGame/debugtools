import { Bindable, CreatureType, DoodadType, NPCType, TerrainType } from "Enums";
import { IHookHost } from "mod/IHookHost";
import { BindCatcherApi } from "newui/BindingManager";
import Component from "newui/component/Component";
import Dialog from "newui/screen/screens/game/component/Dialog";
import { DialogId, IDialogDescription } from "newui/screen/screens/game/Dialogs";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { TileEventType } from "tile/ITileEvent";
export interface IPaintData {
    terrain?: {
        type: TerrainType;
        tilled: boolean;
    };
    creature?: {
        type: CreatureType | "remove";
        aberrant: boolean;
    };
    npc?: {
        type: NPCType | "remove";
    };
    doodad?: {
        type: DoodadType | "remove";
    };
    corpse?: {
        type: CreatureType | "remove" | undefined;
        aberrant: boolean;
        replaceExisting: boolean;
    };
    tileEvent?: {
        type: TileEventType | "remove" | undefined;
        replaceExisting: boolean;
    };
}
export interface IPaintSection extends Component {
    getTilePaintData(): Partial<IPaintData> | undefined;
}
export default class DebugToolsDialog extends Dialog implements IHookHost {
    static description: IDialogDescription;
    private readonly saveData;
    private readonly subpanels;
    private readonly subpanelLinkWrapper;
    private readonly panelWrapper;
    private zoomRange;
    private timeRange;
    private spectateButton;
    private inspectButton;
    private selectionPromise;
    private painting;
    private readonly paintTiles;
    private readonly paintSections;
    private paintButton;
    constructor(gsapi: IGameScreenApi, id: DialogId);
    getName(): import("language/Translation").default;
    getZoomLevel(): number | undefined;
    onGameTickEnd(): void;
    onBindLoop(bindPressed: Bindable, api: BindCatcherApi): Bindable;
    canClientMove(api: BindCatcherApi): false | undefined;
    private showSubPanel;
    private showGeneralPanel;
    private unlockRecipes;
    private removeAllCreatures;
    private removeAllNPCs;
    private showDisplayPanel;
    private showPaintPanel;
    private completePaint;
    private clearPaint;
    private toggleFog;
    private toggleLighting;
    private inspectLocalPlayer;
    private inspectTile;
    private resetWebGL;
    private reloadShaders;
    private updatePaintOverlay;
    private getNeighborTiles;
    private getPaintOverlayConnections;
}

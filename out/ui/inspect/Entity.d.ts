import { ICreature } from "creature/ICreature";
import { UiApi } from "newui/INewUi";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import { ITile } from "tile/ITerrain";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import DebugTools from "../../DebugTools";
import InspectInformationSection from "../component/InspectInformationSection";
export default class EntityInformation extends InspectInformationSection {
    readonly DEBUG_TOOLS: DebugTools;
    readonly LOG: Log;
    private readonly subsections;
    private readonly statWrapper;
    private readonly statComponents;
    private entities;
    private entity;
    constructor(api: UiApi);
    getTabs(): [number, () => import("utilities/string/Interpolator").IStringSection[]][];
    setTab(entity: number): this;
    update(position: IVector2, tile: ITile): void;
    getIndex(entity: ICreature | INPC | IPlayer): number;
    getEntity(index: number): ICreature | INPC | IPlayer;
    logUpdate(): void;
    private initializeStats;
    private onStatChange;
    private openTeleportMenu;
    private createTeleportToPlayerMenu;
    private selectTeleportLocation;
    private teleport;
    private kill;
    private cloneEntity;
    private heal;
    private setStat;
}

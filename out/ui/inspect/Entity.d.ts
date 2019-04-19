import { ICreature } from "entity/creature/ICreature";
import { INPC } from "entity/npc/INPC";
import IPlayer from "entity/player/IPlayer";
import { ITile } from "tile/ITerrain";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import DebugTools from "../../DebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
import InspectInformationSection from "../component/InspectInformationSection";
export declare type InspectDialogEntityInformationSubsectionClass = new () => InspectEntityInformationSubsection;
export default class EntityInformation extends InspectInformationSection {
    readonly DEBUG_TOOLS: DebugTools;
    readonly LOG: Log;
    private readonly subsections;
    private readonly statWrapper;
    private readonly statComponents;
    private entities;
    private entity;
    constructor();
    getTabs(): [number, () => import("../../../mod-reference/definitions/utilities/string/Interpolator").IStringSection[]][];
    setTab(entity: number): this;
    update(position: IVector2, tile: ITile): void;
    getEntityIndex(entity: ICreature | INPC | IPlayer): number;
    getEntity(index: number): import("../../../mod-reference/definitions/entity/IEntity").EntityPlayerCreatureNpc;
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

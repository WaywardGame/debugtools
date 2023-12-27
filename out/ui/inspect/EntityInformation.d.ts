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
import Entity from "@wayward/game/game/entity/Entity";
import { EntityReferenceTypes } from "@wayward/game/game/reference/IReferenceManager";
import Tile from "@wayward/game/game/tile/Tile";
import { IStringSection } from "@wayward/game/utilities/string/Interpolator";
import Log from "@wayward/utilities/Log";
import DebugTools from "../../DebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
import InspectInformationSection from "../component/InspectInformationSection";
export type InspectDialogEntityInformationSubsectionClass = new () => InspectEntityInformationSubsection;
export default class EntityInformation extends InspectInformationSection {
    readonly DEBUG_TOOLS: DebugTools;
    readonly LOG: Log;
    private readonly subsections;
    private readonly statWrapper;
    private readonly statComponents;
    private readonly statMaxComponents;
    private readonly buttonHeal;
    private readonly buttonTeleport;
    private readonly actionHistoryWrapper;
    private actionHistory?;
    private entities;
    private entity?;
    constructor();
    getTabs(): [number, () => IStringSection[]][];
    setTab(entity: number): this;
    update(tile: Tile): void;
    getEntityIndex(entity: Entity): number;
    getEntity(index: number): Entity<unknown, number, EntityReferenceTypes, unknown>;
    logUpdate(): void;
    private initializeStats;
    private onStatChange;
    private onStatMaxChanged;
    private openTeleportMenu;
    private createTeleportToPlayerMenu;
    private selectTeleportLocation;
    private teleport;
    private kill;
    private cloneEntity;
    private heal;
    private setStat;
    private setStatMax;
}

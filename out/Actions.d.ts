import { IActionArgument, IActionResult } from "action/IAction";
import IBaseHumanEntity from "entity/IBaseHumanEntity";
import { Stat } from "entity/IStats";
import { ActionType, ItemQuality, ItemType, PlayerState, SkillType, TerrainType } from "Enums";
import { Message } from "language/IMessages";
import IPlayer from "player/IPlayer";
import DebugTools from "./DebugTools";
import { IPaintData } from "./ui/DebugToolsDialog";
export declare enum RemovalType {
    Corpse = 0
}
export default class Actions {
    private readonly mod;
    static get<K extends keyof Actions>(name: K): ActionType;
    messageFailureTileBlocked: Message;
    constructor(mod: DebugTools);
    select(player: IPlayer, argument: IActionArgument<any>, result: IActionResult): void;
    teleport(player: IPlayer, { object: xyz, creature, npc }: IActionArgument<[number, number, number]>, result: IActionResult): void;
    removeAllCreatures(player: IPlayer, argument: IActionArgument, result: IActionResult): void;
    removeAllNPCs(player: IPlayer, argument: IActionArgument, result: IActionResult): void;
    updateStatsAndAttributes(player: IPlayer, argument: IActionArgument, result: IActionResult): void;
    toggleSpectating(player: IPlayer, { object: [isSpectating, playerState] }: IActionArgument<[boolean, PlayerState?]>, result: IActionResult): void;
    kill(player: IPlayer, { creature, npc }: IActionArgument, result: IActionResult): void;
    clone(player: IPlayer, { creature, npc, point }: IActionArgument, result: IActionResult): void;
    setTime(player: IPlayer, argument: IActionArgument<number>, result: IActionResult): void;
    heal(player: IPlayer, { creature, npc, object: corpseId }: IActionArgument<number>, result: IActionResult): void;
    setStat(player: IPlayer, { object: [stat, value], creature, npc }: IActionArgument<[Stat, number]>, result: IActionResult): void;
    setTamed(player: IPlayer, { creature, object: tamed }: IActionArgument<boolean>, result: IActionResult): void;
    remove(player: IPlayer, { creature, npc, object: otherRemoval }: IActionArgument<[RemovalType, number]>, result: IActionResult): void;
    setWeightBonus(player: IPlayer, { object: weightBonus }: IActionArgument<number>, result: IActionResult): void;
    changeTerrain(player: IPlayer, { object: terrain, point }: IActionArgument<TerrainType>, result: IActionResult): void;
    toggleTilled(player: IPlayer, { object: tilled, point }: IActionArgument<boolean>, result: IActionResult): void;
    addItemToInventory(human: IBaseHumanEntity, { object: [item, quality] }: IActionArgument<[ItemType, ItemQuality]>, result: IActionResult): void;
    paint(player: IPlayer, { object: [tiles, data] }: IActionArgument<[number[], IPaintData]>, result: IActionResult): void;
    unlockRecipes(player: IPlayer, argument: IActionArgument, result: IActionResult): void;
    toggleInvulnerable(player: IPlayer, { object: invulnerable }: IActionArgument<boolean>, result: IActionResult): void;
    setSkill(player: IPlayer, { object: [skill, value] }: IActionArgument<[SkillType, number]>, result: IActionResult): void;
    toggleNoclip(player: IPlayer, { object: noclip }: IActionArgument<boolean>, result: IActionResult): void;
    private removeInternal;
    private resurrectCorpse;
    private setTilled;
    private getPosition;
    private copyStats;
    private cloneInventory;
}

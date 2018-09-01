import { IActionArgument, IActionResult } from "action/IAction";
import { Stat } from "entity/IStats";
import { ItemQuality, ItemType, SkillType, TerrainType } from "Enums";
import { Message } from "language/IMessages";
import { ITemplateOptions } from "mapgen/MapGenHelpers";
import IPlayer from "player/IPlayer";
import { TileTemplateType } from "tile/ITerrain";
import Log from "utilities/Log";
import DebugTools from "./DebugTools";
import { DebugToolsTranslation } from "./IDebugTools";
import { IPaintData } from "./ui/panel/PaintPanel";
import { SelectionType } from "./ui/panel/SelectionPanel";
export declare enum RemovalType {
    Corpse = 0,
    TileEvent = 1
}
declare type ExecuteFunction<F extends any> = F extends (player: IPlayer, argument: IActionArgument<infer X>, result: IActionResult) => void ? (undefined extends Extract<X, undefined> ? (argument?: IActionArgument<X>) => void : (argument: IActionArgument<X>) => void) : never;
export default class Actions {
    private readonly mod;
    static readonly debugTools: DebugTools;
    static readonly log: Log;
    static get<K extends keyof Actions, F extends Actions[K]>(name: K): {
        execute: ExecuteFunction<F>;
    };
    readonly messageFailureTileBlocked: Message;
    constructor(mod: DebugTools);
    placeTemplate(executor: IPlayer, { point, object: [type, options] }: IActionArgument<[TileTemplateType, ITemplateOptions]>, result: IActionResult): void;
    executeOnSelection(executor: IPlayer, { object: [action, selection] }: IActionArgument<[DebugToolsTranslation, [SelectionType, number][]]>, result: IActionResult): void;
    teleport(executor: IPlayer, { entity, position }: IActionArgument, result: IActionResult): void;
    kill(executor: IPlayer, { entity }: IActionArgument, result: IActionResult): void;
    clone(executor: IPlayer, { entity, doodad, position }: IActionArgument, result: IActionResult): void;
    setTime(player: IPlayer, { object: time }: IActionArgument<number>, result: IActionResult): void;
    heal(executor: IPlayer, { entity, object: corpseId }: IActionArgument<number | undefined>, result: IActionResult): void;
    setStat(executor: IPlayer, { entity, object: [stat, value] }: IActionArgument<[Stat, number]>, result: IActionResult): void;
    setTamed(player: IPlayer, { creature, object: tamed }: IActionArgument<boolean>, result: IActionResult): void;
    remove(player: IPlayer, { creature, npc, item, doodad, object: otherRemoval }: IActionArgument<[RemovalType, number] | undefined>, result: IActionResult): void;
    setWeightBonus(executor: IPlayer, { player, object: weightBonus }: IActionArgument<number>, result: IActionResult): void;
    changeTerrain(player: IPlayer, { object: terrain, position }: IActionArgument<TerrainType>, result: IActionResult): void;
    toggleTilled(player: IPlayer, { position, object: tilled }: IActionArgument<boolean>, result: IActionResult): void;
    updateStatsAndAttributes(player: IPlayer, argument: IActionArgument, result: IActionResult): void;
    addItemToInventory(executor: IPlayer, { doodad, human, point, object: [item, quality] }: IActionArgument<[ItemType, ItemQuality]>, result: IActionResult): void;
    paint(player: IPlayer, { object: [tiles, data] }: IActionArgument<[number[], IPaintData]>, result: IActionResult): void;
    unlockRecipes(player: IPlayer, argument: IActionArgument, result: IActionResult): void;
    toggleInvulnerable(executor: IPlayer, { player, object: invulnerable }: IActionArgument<boolean>, result: IActionResult): void;
    setSkill(executor: IPlayer, { player, object: [skill, value] }: IActionArgument<[SkillType, number]>, result: IActionResult): void;
    toggleNoclip(executor: IPlayer, { player, object: noclip }: IActionArgument<boolean>, result: IActionResult): void;
    private removeInternal;
    private removeItem;
    private resurrectCorpse;
    private setTilled;
    private getPosition;
    private copyStats;
    private cloneEntity;
    private cloneInventory;
    private cloneDoodad;
    private cloneContainedItems;
}
export {};

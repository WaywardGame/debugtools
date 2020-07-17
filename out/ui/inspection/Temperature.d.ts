/*!
 * Copyright Unlok, Vaughn Royko 2011-2019
 * http://www.unlok.ca
 *
 * Credits & Thanks:
 * http://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://waywardgame.github.io/
 */
import { Context } from "game/inspection/InfoProvider";
import Inspection from "game/inspection/Inspection";
import { IVector3 } from "utilities/math/IVector";
import DebugTools from "../../DebugTools";
export default class TemperatureInspection extends Inspection<IVector3> {
    static readonly DEBUG_TOOLS: DebugTools;
    static getFromTile(position: IVector3): TemperatureInspection;
    constructor(tile: IVector3);
    getId(): string;
    getPriority(): number;
    get(context: Context): import("../../../node_modules/@wayward/types/definitions/language/Translation").default[];
    onUpdateTile(_: any, x: number, y: number, z: number): void;
    private getTemperature;
}

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
import { ActionUsability, IActionHandlerApi } from "@wayward/game/game/entity/action/IAction";
import Log from "@wayward/utilities/Log";
import DebugTools from "./DebugTools";
import Human from "@wayward/game/game/entity/Human";
export declare const defaultUsability: ActionUsability[];
export declare const defaultCanUseHandler: (action: IActionHandlerApi<Human>) => {
    usable: boolean;
};
export default class Actions {
    static readonly DEBUG_TOOLS: DebugTools;
    static readonly LOG: Log;
}

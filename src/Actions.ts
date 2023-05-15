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

import { ActionUsability } from "game/entity/action/IAction";
import Mod from "mod/Mod";
import Log from "utilities/Log";
import DebugTools from "./DebugTools";
import { DEBUG_TOOLS_ID } from "./IDebugTools";


export const defaultUsability: ActionUsability[] = [ActionUsability.Ghost, ActionUsability.Paused, ActionUsability.Delayed, ActionUsability.Moving];

export default class Actions {
	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public static readonly DEBUG_TOOLS: DebugTools;
	@Mod.log(DEBUG_TOOLS_ID)
	public static readonly LOG: Log;
}

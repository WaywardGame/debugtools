import type { IActionHandlerApi } from "@wayward/game/game/entity/action/IAction";
import Mod from "@wayward/game/mod/Mod";
import type Log from "@wayward/utilities/Log";
import type DebugTools from "./DebugTools";
import { DEBUG_TOOLS_ID } from "./IDebugTools";
import type Human from "@wayward/game/game/entity/Human";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const defaultCanUseHandler = (action: IActionHandlerApi<Human>) => {
	if (!Actions.DEBUG_TOOLS.hasPermission(action.executor.asPlayer)) {
		return { usable: false };
	}

	return { usable: true };
};

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class Actions {
	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public static readonly DEBUG_TOOLS: DebugTools;
	@Mod.log(DEBUG_TOOLS_ID)
	public static readonly LOG: Log;
}

import type { IActionHandlerApi } from "@wayward/game/game/entity/action/IAction";
import Mod from "@wayward/game/mod/Mod";
import type Human from "@wayward/game/game/entity/Human";
import type DebugToolsMod from "./DebugTools";

const DebugTools = Mod.get<DebugToolsMod>();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const defaultCanUseHandler = (action: IActionHandlerApi<Human>) => {
	if (!DebugTools?.instance?.hasPermission(action.executor.asPlayer)) {
		return { usable: false };
	}

	return { usable: true };
};

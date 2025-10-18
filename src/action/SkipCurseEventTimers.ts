import type { CurseEventInstance } from "@wayward/game/game/curse/Curse";
import Curse from "@wayward/game/game/curse/Curse";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { defaultCanUseHandler } from "../Actions";

type ScriptProcessState = Exclude<CurseEventInstance["scriptProcesses"], undefined>[number];
export default new Action()
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler(action => {
		for (const curse of action.executor.island.curse.events ?? []) {
			for (const script of curse.scriptProcesses ?? []) {
				skipIntervals(script);
			}

			Curse.tickCurse(action.executor.island, action.executor.island.getPlayers(true));
		}

		function skipIntervals(state: ScriptProcessState) {
			for (const childProcess of state.childProcesses ?? []) {
				skipIntervals(childProcess);
			}

			if (state.iterationsRemaining && state.iterationsRemaining < 9999999) {
				state.iterationsRemaining = 0;
			}
		}
	});

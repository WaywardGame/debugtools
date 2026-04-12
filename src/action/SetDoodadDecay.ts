import type Doodad from "@wayward/game/game/doodad/Doodad";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import Mod from "@wayward/game/mod/Mod";
import { defaultCanUseHandler } from "../Actions";
import type DebugTools from "../DebugTools";

const DEBUG_TOOLS = Mod.get<DebugTools>();

export default new Action(ActionArgument.Doodad, ActionArgument.Integer32)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, doodad, decay) => {
		setDoodadDecay(doodad, decay);
		action.setUpdateView(true);
	})
	.modRegistration("SetDoodadDecay");

export function setDoodadDecay(doodad: Doodad, decay: number): void {
	doodad.decay = decay;
	if (!doodad.startingDecay || decay > doodad.startingDecay) {
		doodad.startingDecay = decay;
	}

	doodad.computeLights();

	DEBUG_TOOLS?.instance?.getInspectDialog()?.update();
}

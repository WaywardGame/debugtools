import type Doodad from "@wayward/game/game/doodad/Doodad";
import { Quality } from "@wayward/game/game/IObject";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import Mod from "@wayward/game/mod/Mod";
import { defaultCanUseHandler } from "../Actions";
import type DebugTools from "../DebugTools";
import { RenderSource } from "@wayward/game/renderer/IRenderer";

const DEBUG_TOOLS = Mod.get<DebugTools>();

export default new Action(ActionArgument.Doodad, ActionArgument.ENUM(Quality))
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, doodad, quality) => setDoodadQuality(doodad, quality))
	.modRegistration("SetDoodadQuality");

export function setDoodadQuality(doodad: Doodad, quality: Quality): void {
	doodad.setQuality(quality);
	localPlayer.updateView(RenderSource.Mod);
	DEBUG_TOOLS?.instance?.getInspectDialog()?.update();
}

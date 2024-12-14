import { Quality } from "@wayward/game/game/IObject";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { defaultCanUseHandler } from "../Actions";
import { setQuality } from "./SetQuality";

/**
 * Sets the quality of all items in a human's inventory
 */
export default new Action(ActionArgument.Container, ActionArgument.ENUM(Quality))
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, target, quality) => setQuality(action, quality, ...target.containedItems));

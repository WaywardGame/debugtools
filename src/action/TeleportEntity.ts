import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { defaultUsability } from "../Actions";
import { teleportEntity } from "./helpers/TeleportEntity";

/**
 * Teleports an entity to a position.
 */
export default new Action(ActionArgument.Entity, ActionArgument.Tile)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler(teleportEntity);

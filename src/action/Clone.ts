import Doodad from "game/doodad/Doodad";
import { Action } from "game/entity/action/Action";
import { ActionArgument, anyOf } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { IVector3 } from "utilities/math/IVector";
import { defaultUsability } from "../Actions";
import { DebugToolsTranslation, translation } from "../IDebugTools";
import CloneDoodad from "./helpers/CloneDoodad";
import CloneEntity from "./helpers/CloneEntity";
import GetPosition from "./helpers/GetPosition";

/**
 * Clones an entity or doodad to a new location. If given a player, an NPC with the appearance, items, and stats of the player is cloned.
 */
export default new Action(anyOf(ActionArgument.Entity, ActionArgument.Doodad), ActionArgument.Vector3)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, toClone, position: IVector3 | undefined) => {

		position = GetPosition(action.executor, position!, () => translation(DebugToolsTranslation.ActionClone)
			.get(toClone.getName()));

		if (!position) return;

		if (toClone instanceof Doodad) {
			CloneDoodad(toClone, position);

		} else {
			CloneEntity(toClone, position);
		}

		renderer?.computeSpritesInViewport();
		action.setUpdateRender();
	});

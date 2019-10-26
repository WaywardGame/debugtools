import { Action } from "entity/action/Action";
import { ActionArgument } from "entity/action/IAction";
import { EntityType } from "entity/IEntity";
import Actions, { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Player, ActionArgument.Number)
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, player, weightBonus) => {
		Actions.DEBUG_TOOLS.setPlayerData(player, "weightBonus", weightBonus);
		player.updateStrength();
		player.updateTablesAndWeight();
	});

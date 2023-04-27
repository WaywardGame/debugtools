import { Action } from "game/entity/action/Action";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import Actions, { defaultUsability } from "../Actions";

export default new Action(ActionArgument.Player, ActionArgument.Float64)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setHandler((action, player, weightBonus) => {
		Actions.DEBUG_TOOLS.setPlayerData(player, "weightBonus", weightBonus);
		player.updateStrength();
		player.updateTablesAndWeight("M");
	});

import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Stat } from "@wayward/game/game/entity/IStats";
import { ScreenId } from "@wayward/game/ui/screen/IScreen";
import { defaultCanUseHandler, defaultUsability } from "../Actions";

export default new Action(ActionArgument.Entity, ActionArgument.Integer32, ActionArgument.Float64)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(...defaultUsability)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, entity, stat: Stat, value) => {
		entity?.asEntityWithStats?.stat.set(stat, value);
		if (entity.asLocalPlayer && stat === Stat.Health) {
			ui.screens.get(ScreenId.Game)?.["refreshHealthBasedEffects"]();
		}
	});

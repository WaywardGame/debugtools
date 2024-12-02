import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Stat } from "@wayward/game/game/entity/IStats";
import { ScreenId } from "@wayward/game/ui/screen/IScreen";
import { defaultCanUseHandler } from "../Actions";

export default new Action(ActionArgument.Entity, ActionArgument.Integer32, ActionArgument.Float64)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, entity, stat: Stat, value) => {
		entity?.asEntityWithStats?.stat.setMax(stat, value);
		if (entity.asLocalPlayer && stat === Stat.Health) {
			entity?.asEntityWithStats?.stat.setValue(Stat.Strength, value); // Health is handled via strength, so we need to update its value too
			ui.screens.get(ScreenId.Game)?.["refreshHealthBasedEffects"]();
		}
	});

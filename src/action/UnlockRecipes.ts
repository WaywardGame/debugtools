import { Action } from "entity/action/Action";
import { EntityType } from "entity/IEntity";
import { ItemType } from "item/IItem";
import itemDescriptions from "item/Items";
import Enums from "utilities/enum/Enums";
import { defaultUsability } from "../Actions";

export default new Action()
	.setUsableBy(EntityType.Player)
	.setUsableWhen(...defaultUsability)
	.setHandler(action => {
		const itemTypes = Enums.values(ItemType);

		for (const itemType of itemTypes) {
			const desc = itemDescriptions[itemType];
			if (desc && desc.recipe && desc.craftable !== false && !game.crafted[itemType]) {
				game.crafted[itemType] = {
					newUnlock: true,
					unlockTime: Date.now(),
				};
			}
		}

		game.updateTablesAndWeight();
	});

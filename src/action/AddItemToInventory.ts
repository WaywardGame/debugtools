import { Quality } from "@wayward/game/game/IObject";
import Human from "@wayward/game/game/entity/Human";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { ItemType, ItemTypeGroup } from "@wayward/game/game/item/IItem";
import type Item from "@wayward/game/game/item/Item";
import ItemManager from "@wayward/game/game/item/ItemManager";
import Dictionary from "@wayward/game/language/Dictionary";
import Translation from "@wayward/game/language/Translation";
import Enums from "@wayward/game/utilities/enum/Enums";
import Arrays from "@wayward/utilities/collection/Arrays";
import { Tuple } from "@wayward/utilities/collection/Tuple";
import StackMap from "@wayward/utilities/collection/map/StackMap";
import { defaultCanUseHandler } from "../Actions";
import InspectDialog from "../ui/InspectDialog";

export const ADD_ITEM_RANDOM = 1000000001;
export const ADD_ITEM_ALL = 1000000002;

const FILTER_REGEX_CACHE = new StackMap<string, RegExp>(undefined, 500);
const WORD_TO_GROUPS_MAP = new StackMap<string, ItemTypeGroup[]>(undefined, 100);
const GROUP_REGEX = new RegExp("^group:(.*)$");
let GROUP_MAP: Map<string, ItemTypeGroup> | undefined;

function itemMatchesWord(word: string, item: ItemType, text: string): boolean {
	const baseRegex = FILTER_REGEX_CACHE.getOrDefault(word, () =>
		new RegExp(`\\b${word.replace("\\", "\\\\")}`), true);
	if (baseRegex.test(text)) {
		return true;
	}

	const groups = WORD_TO_GROUPS_MAP.getOrDefault(word, () => {
		const [, groupName] = word.match(GROUP_REGEX) ?? Arrays.EMPTY;

		GROUP_MAP ??= Enums.values(ItemTypeGroup)
			.map(group => Tuple(Translation.get(Dictionary.ItemGroup, group).getString().toLowerCase().replace(/\s*/g, ""), group))
			.toMap();

		return !groupName ? [] : GROUP_MAP.entryStream()
			.filter(([name]) => name.startsWith(groupName))
			.toArray(([, data]) => data);
	}, true);

	if (!groups.length) {
		return false;
	}

	return groups.some(group => ItemManager.isInGroup(item, group));
}

/**
 * Adds an item to the inventory of a doodad, human, or tile.
 */
export default new Action(ActionArgument.Container, ActionArgument.ANY(ActionArgument.Integer32, ActionArgument.String), ActionArgument.ENUM(Quality), ActionArgument.Integer32)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse(defaultCanUseHandler)
	.setHandler((action, target, item: ItemType | typeof ADD_ITEM_RANDOM | typeof ADD_ITEM_ALL | string, quality, quantity) => {
		const containerObject = action.executor.island.items.resolveContainer(target);

		let items = Enums.values(ItemType);
		if (typeof item === "string") {
			const filterBy = item;
			const filterWords = filterBy.split(" ");
			items = items.filter(item => {
				const text = Translation.get(Dictionary.Item, item).getString();
				return text.includes(filterBy) || filterWords.every(word =>
					itemMatchesWord(word, item, text));
			});
		}

		const createdItems: Item[] = [];
		function addItem(item: ItemType): void {
			const createdItem = action.executor.island.items.create(item, undefined, quality);
			createdItems.push(createdItem);
		}

		for (let i = 0; i < quantity; i++) {
			if (item === ADD_ITEM_ALL || typeof item === "string") {
				for (const item of items) {
					addItem(item);
				}
			} else if (item === ADD_ITEM_RANDOM) {
				addItem(action.executor.island.seededRandom.choice(...items));
			} else {
				addItem(item);
			}
		}

		action.executor.island.items.moveItemsToContainer(action.executor, createdItems, target, { skipDrop: true });

		if (containerObject instanceof Human) {
			containerObject.updateTablesAndWeight("M");
		} else {
			action.setUpdateView();
		}

		InspectDialog.INSTANCE?.update();
	});

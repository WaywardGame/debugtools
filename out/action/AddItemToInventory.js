/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
define(["require", "exports", "@wayward/game/game/IObject", "@wayward/game/game/entity/Human", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "@wayward/game/game/item/IItem", "@wayward/game/game/item/ItemManager", "@wayward/game/language/Dictionary", "@wayward/game/language/Translation", "@wayward/game/utilities/enum/Enums", "@wayward/utilities/collection/Arrays", "@wayward/utilities/collection/Tuple", "@wayward/utilities/collection/map/StackMap", "../Actions", "../ui/InspectDialog"], function (require, exports, IObject_1, Human_1, IEntity_1, Action_1, IAction_1, IItem_1, ItemManager_1, Dictionary_1, Translation_1, Enums_1, Arrays_1, Tuple_1, StackMap_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ADD_ITEM_ALL = exports.ADD_ITEM_RANDOM = void 0;
    exports.ADD_ITEM_RANDOM = 1000000001;
    exports.ADD_ITEM_ALL = 1000000002;
    const FILTER_REGEX_CACHE = new StackMap_1.default(undefined, 500);
    const WORD_TO_GROUPS_MAP = new StackMap_1.default(undefined, 100);
    const GROUP_REGEX = new RegExp(`^group:(.*)$`);
    let GROUP_MAP;
    function itemMatchesWord(word, item, text) {
        const baseRegex = FILTER_REGEX_CACHE.getOrDefault(word, () => new RegExp(`\\b${word.replace("\\", "\\\\")}`), true);
        if (baseRegex.test(text)) {
            return true;
        }
        const groups = WORD_TO_GROUPS_MAP.getOrDefault(word, () => {
            const [, groupName] = word.match(GROUP_REGEX) ?? Arrays_1.default.EMPTY;
            GROUP_MAP ??= Enums_1.default.values(IItem_1.ItemTypeGroup)
                .map(group => (0, Tuple_1.Tuple)(Translation_1.default.get(Dictionary_1.default.ItemGroup, group).getString().toLowerCase().replace(/\s*/g, ""), group))
                .toMap();
            return !groupName ? [] : GROUP_MAP.entryStream()
                .filter(([name]) => name.startsWith(groupName))
                .toArray(([, data]) => data);
        }, true);
        if (!groups.length) {
            return false;
        }
        return groups.some(group => ItemManager_1.default.isInGroup(item, group));
    }
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Container, IAction_1.ActionArgument.ANY(IAction_1.ActionArgument.Integer32, IAction_1.ActionArgument.String), IAction_1.ActionArgument.ENUM(IObject_1.Quality), IAction_1.ActionArgument.Integer32)
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(Actions_1.defaultCanUseHandler)
        .setHandler((action, target, item, quality, quantity) => {
        const containerObject = action.executor.island.items.resolveContainer(target);
        let items = Enums_1.default.values(IItem_1.ItemType);
        if (typeof item === "string") {
            const filterBy = item;
            const filterWords = filterBy.split(" ");
            items = items.filter(item => {
                const text = Translation_1.default.get(Dictionary_1.default.Item, item).getString();
                return text.includes(filterBy) || filterWords.every(word => itemMatchesWord(word, item, text));
            });
        }
        const createdItems = [];
        function addItem(item) {
            const createdItem = action.executor.island.items.create(item, undefined, quality);
            createdItems.push(createdItem);
        }
        for (let i = 0; i < quantity; i++) {
            if (item === exports.ADD_ITEM_ALL || typeof item === "string") {
                for (const item of items) {
                    addItem(item);
                }
            }
            else if (item === exports.ADD_ITEM_RANDOM) {
                addItem(action.executor.island.seededRandom.choice(...items));
            }
            else {
                addItem(item);
            }
        }
        action.executor.island.items.moveItemsToContainer(action.executor, createdItems, target);
        if (containerObject instanceof Human_1.default) {
            containerObject.updateTablesAndWeight("M");
        }
        else {
            action.setUpdateView();
        }
        InspectDialog_1.default.INSTANCE?.update();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkSXRlbVRvSW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbi9BZGRJdGVtVG9JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7OztJQW1CVSxRQUFBLGVBQWUsR0FBRyxVQUFVLENBQUM7SUFDN0IsUUFBQSxZQUFZLEdBQUcsVUFBVSxDQUFDO0lBRXZDLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxrQkFBUSxDQUFpQixTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDeEUsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLGtCQUFRLENBQTBCLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNqRixNQUFNLFdBQVcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUMvQyxJQUFJLFNBQWlELENBQUM7SUFFdEQsU0FBUyxlQUFlLENBQUMsSUFBWSxFQUFFLElBQWMsRUFBRSxJQUFZO1FBQ2xFLE1BQU0sU0FBUyxHQUFHLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQzVELElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZELElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQzFCLE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUVELE1BQU0sTUFBTSxHQUFHLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO1lBQ3pELE1BQU0sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksZ0JBQU0sQ0FBQyxLQUFLLENBQUM7WUFFOUQsU0FBUyxLQUFLLGVBQUssQ0FBQyxNQUFNLENBQUMscUJBQWEsQ0FBQztpQkFDdkMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBQSxhQUFLLEVBQUMscUJBQVcsQ0FBQyxHQUFHLENBQUMsb0JBQVUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDdEgsS0FBSyxFQUFFLENBQUM7WUFFVixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUU7aUJBQzlDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQzlDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRVQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNwQixPQUFPLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxxQkFBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBS0Qsa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxTQUFTLEVBQUUsd0JBQWMsQ0FBQyxHQUFHLENBQUMsd0JBQWMsQ0FBQyxTQUFTLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSx3QkFBYyxDQUFDLElBQUksQ0FBQyxpQkFBTyxDQUFDLEVBQUUsd0JBQWMsQ0FBQyxTQUFTLENBQUM7U0FDOUssV0FBVyxDQUFDLG9CQUFVLENBQUMsS0FBSyxDQUFDO1NBQzdCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFNBQVMsQ0FBQyw4QkFBb0IsQ0FBQztTQUMvQixVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQXNFLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFO1FBQ3pILE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5RSxJQUFJLEtBQUssR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFRLENBQUMsQ0FBQztRQUNuQyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQzlCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQztZQUN0QixNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hDLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUMzQixNQUFNLElBQUksR0FBRyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxvQkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDaEUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDMUQsZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQTtRQUNILENBQUM7UUFFRCxNQUFNLFlBQVksR0FBVyxFQUFFLENBQUM7UUFDaEMsU0FBUyxPQUFPLENBQUMsSUFBYztZQUM5QixNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDbEYsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ25DLElBQUksSUFBSSxLQUFLLG9CQUFZLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFLENBQUM7Z0JBQ3ZELEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7b0JBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDZixDQUFDO1lBQ0YsQ0FBQztpQkFBTSxJQUFJLElBQUksS0FBSyx1QkFBZSxFQUFFLENBQUM7Z0JBQ3JDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMvRCxDQUFDO2lCQUFNLENBQUM7Z0JBQ1AsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2YsQ0FBQztRQUNGLENBQUM7UUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFekYsSUFBSSxlQUFlLFlBQVksZUFBSyxFQUFFLENBQUM7WUFDdEMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLENBQUM7YUFBTSxDQUFDO1lBQ1AsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3hCLENBQUM7UUFFRCx1QkFBYSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQyJ9
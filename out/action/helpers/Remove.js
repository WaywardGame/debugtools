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
define(["require", "exports", "@wayward/game/game/doodad/Doodad", "@wayward/game/game/entity/creature/corpse/Corpse", "@wayward/game/game/entity/creature/Creature", "@wayward/game/game/entity/npc/NPC", "@wayward/game/game/item/Item", "@wayward/game/game/tile/TileEvent", "./RemoveItem"], function (require, exports, Doodad_1, Corpse_1, Creature_1, NPC_1, Item_1, TileEvent_1, RemoveItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    function default_1(action, target) {
        if (target instanceof Creature_1.default)
            return action.executor.island.creatures.remove(target);
        if (target instanceof NPC_1.default)
            return action.executor.island.npcs.remove(target);
        if (target instanceof Doodad_1.default)
            return action.executor.island.doodads.remove(target);
        if (target instanceof Item_1.default)
            return (0, RemoveItem_1.default)(action, target);
        if (target instanceof TileEvent_1.default)
            return action.executor.island.tileEvents.remove(target);
        if (target instanceof Corpse_1.default)
            return action.executor.island.corpses.remove(target);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3ZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL1JlbW92ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7SUFhSCw0QkFPQztJQVBELG1CQUF5QixNQUF5QixFQUFFLE1BQTJEO1FBQzlHLElBQUksTUFBTSxZQUFZLGtCQUFRO1lBQUUsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZGLElBQUksTUFBTSxZQUFZLGFBQUc7WUFBRSxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0UsSUFBSSxNQUFNLFlBQVksZ0JBQU07WUFBRSxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkYsSUFBSSxNQUFNLFlBQVksY0FBSTtZQUFFLE9BQU8sSUFBQSxvQkFBVSxFQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM5RCxJQUFJLE1BQU0sWUFBWSxtQkFBUztZQUFFLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RixJQUFJLE1BQU0sWUFBWSxnQkFBTTtZQUFFLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwRixDQUFDIn0=
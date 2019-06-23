define(["require", "exports", "doodad/Doodad", "entity/creature/Creature", "entity/npc/BaseNPC", "item/Item", "./RemoveItem"], function (require, exports, Doodad_1, Creature_1, BaseNPC_1, Item_1, RemoveItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(action, target) {
        if (target instanceof Creature_1.default)
            return creatureManager.remove(target);
        else if (target instanceof BaseNPC_1.default)
            return npcManager.remove(target);
        else if (target instanceof Doodad_1.default)
            return doodadManager.remove(target, true);
        else if (target instanceof Item_1.default)
            return RemoveItem_1.default(action, target);
        else if (tileEventManager.is(target))
            return tileEventManager.remove(target);
        else if (corpseManager.is(target))
            return corpseManager.remove(target);
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3ZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL1JlbW92ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFjQSxtQkFBeUIsTUFBMkIsRUFBRSxNQUFpRTtRQUN0SCxJQUFJLE1BQU0sWUFBWSxrQkFBUTtZQUFFLE9BQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNqRSxJQUFJLE1BQU0sWUFBWSxpQkFBTztZQUFFLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNoRSxJQUFJLE1BQU0sWUFBWSxnQkFBTTtZQUFFLE9BQU8sYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDeEUsSUFBSSxNQUFNLFlBQVksY0FBSTtZQUFFLE9BQU8sb0JBQVUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDOUQsSUFBSSxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDO1lBQUUsT0FBTyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDeEUsSUFBSSxhQUFhLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQztZQUFFLE9BQU8sYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBUEQsNEJBT0MifQ==
define(["require", "exports", "doodad/Doodad", "entity/creature/Creature", "entity/npc/BaseNPC", "item/Item", "./RemoveItem"], function (require, exports, Doodad_1, Creature_1, BaseNPC_1, Item_1, RemoveItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(action, target) {
        if (target instanceof Creature_1.default)
            return creatureManager.remove(target);
        if (target instanceof BaseNPC_1.default)
            return npcManager.remove(target);
        if (target instanceof Doodad_1.default)
            return doodadManager.remove(target, true);
        if (target instanceof Item_1.default)
            return RemoveItem_1.default(action, target);
        if (tileEventManager.is(target))
            return tileEventManager.remove(target);
        if (corpseManager.is(target))
            return corpseManager.remove(target);
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3ZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL1JlbW92ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFlQSxtQkFBeUIsTUFBMEIsRUFBRSxNQUFpRTtRQUNySCxJQUFJLE1BQU0sWUFBWSxrQkFBUTtZQUFFLE9BQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RSxJQUFJLE1BQU0sWUFBWSxpQkFBTztZQUFFLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRSxJQUFJLE1BQU0sWUFBWSxnQkFBTTtZQUFFLE9BQU8sYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEUsSUFBSSxNQUFNLFlBQVksY0FBSTtZQUFFLE9BQU8sb0JBQVUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUQsSUFBSSxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDO1lBQUUsT0FBTyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEUsSUFBSSxhQUFhLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQztZQUFFLE9BQU8sYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBUEQsNEJBT0MifQ==
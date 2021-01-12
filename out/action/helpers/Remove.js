define(["require", "exports", "doodad/Doodad", "entity/creature/Creature", "entity/npc/NPC", "item/Item", "./RemoveItem"], function (require, exports, Doodad_1, Creature_1, NPC_1, Item_1, RemoveItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(action, target) {
        if (target instanceof Creature_1.default)
            return creatureManager.remove(target);
        if (target instanceof NPC_1.default)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3ZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL1JlbW92ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFXQSxtQkFBeUIsTUFBMEIsRUFBRSxNQUEyRDtRQUMvRyxJQUFJLE1BQU0sWUFBWSxrQkFBUTtZQUFFLE9BQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RSxJQUFJLE1BQU0sWUFBWSxhQUFHO1lBQUUsT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVELElBQUksTUFBTSxZQUFZLGdCQUFNO1lBQUUsT0FBTyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RSxJQUFJLE1BQU0sWUFBWSxjQUFJO1lBQUUsT0FBTyxvQkFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM5RCxJQUFJLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7WUFBRSxPQUFPLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RSxJQUFJLGFBQWEsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDO1lBQUUsT0FBTyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFQRCw0QkFPQyJ9
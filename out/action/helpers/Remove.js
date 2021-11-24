define(["require", "exports", "game/doodad/Doodad", "game/entity/creature/corpse/Corpse", "game/entity/creature/Creature", "game/entity/npc/NPC", "game/item/Item", "game/tile/TileEvent", "./RemoveItem"], function (require, exports, Doodad_1, Corpse_1, Creature_1, NPC_1, Item_1, TileEvent_1, RemoveItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(action, target) {
        if (target instanceof Creature_1.default)
            return action.executor.island.creatures.remove(target);
        if (target instanceof NPC_1.default)
            return action.executor.island.npcs.remove(target);
        if (target instanceof Doodad_1.default)
            return action.executor.island.doodads.remove(target, true);
        if (target instanceof Item_1.default)
            return (0, RemoveItem_1.default)(action, target);
        if (target instanceof TileEvent_1.default)
            return action.executor.island.tileEvents.remove(target);
        if (target instanceof Corpse_1.default)
            return action.executor.island.corpses.remove(target);
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3ZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL1JlbW92ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFXQSxtQkFBeUIsTUFBMEIsRUFBRSxNQUEyRDtRQUMvRyxJQUFJLE1BQU0sWUFBWSxrQkFBUTtZQUFFLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2RixJQUFJLE1BQU0sWUFBWSxhQUFHO1lBQUUsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdFLElBQUksTUFBTSxZQUFZLGdCQUFNO1lBQUUsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6RixJQUFJLE1BQU0sWUFBWSxjQUFJO1lBQUUsT0FBTyxJQUFBLG9CQUFVLEVBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlELElBQUksTUFBTSxZQUFZLG1CQUFTO1lBQUUsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pGLElBQUksTUFBTSxZQUFZLGdCQUFNO1lBQUUsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFQRCw0QkFPQyJ9
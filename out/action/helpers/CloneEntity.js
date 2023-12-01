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
define(["require", "exports", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/npc/INPCs", "@wayward/game/utilities/math/Direction", "@wayward/game/utilities/math/Vector2", "./CloneInventory", "./CopyStats"], function (require, exports, IEntity_1, INPCs_1, Direction_1, Vector2_1, CloneInventory_1, CopyStats_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(entity, tile) {
        let clone;
        const creature = entity.asCreature;
        const human = entity.asHuman;
        if (creature) {
            clone = entity.island.creatures.spawn(creature.type, tile, true, creature.aberrant, undefined, true);
            if (creature.isTamed)
                clone.tame(creature.getOwner());
            clone.renamed = entity.renamed;
            clone.ai = creature.ai;
            clone.enemy = creature.enemy;
        }
        else if (human) {
            clone = entity.island.npcs.create(INPCs_1.NPCType.Merchant, tile);
            clone.customization = { ...human.customization };
            clone.renamed = entity.getName().getString();
            (0, CloneInventory_1.default)(human, clone);
        }
        if (!clone)
            return;
        const entityMovable = entity.asEntityMovable;
        if (entityMovable) {
            clone.direction = entityMovable.direction?.copy() ?? Vector2_1.default.ZERO;
            clone.facingDirection = entityMovable.facingDirection ?? Direction_1.Direction.South;
        }
        if (entity.asEntityWithStats) {
            (0, CopyStats_1.default)(entity, clone);
        }
        if (clone.asNPC) {
            clone.ai = IEntity_1.AiType.Neutral;
        }
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVFbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7O0lBaUJILG1CQUF5QixNQUFjLEVBQUUsSUFBVTtRQUNsRCxJQUFJLEtBQWlDLENBQUM7UUFFdEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksUUFBUSxFQUFFLENBQUM7WUFDZCxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUUsQ0FBQztZQUV0RyxJQUFJLFFBQVEsQ0FBQyxPQUFPO2dCQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRyxDQUFDLENBQUM7WUFDdkQsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQy9CLEtBQUssQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFFOUIsQ0FBQzthQUFNLElBQUksS0FBSyxFQUFFLENBQUM7WUFDbEIsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBRSxDQUFDO1lBQzNELEtBQUssQ0FBQyxhQUFhLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNqRCxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUM3QyxJQUFBLHdCQUFjLEVBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFFRCxJQUFJLENBQUMsS0FBSztZQUNULE9BQU87UUFFUixNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDO1FBQzdDLElBQUksYUFBYSxFQUFFLENBQUM7WUFDbkIsS0FBSyxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLGlCQUFPLENBQUMsSUFBSSxDQUFDO1lBQ2xFLEtBQUssQ0FBQyxlQUFlLEdBQUcsYUFBYSxDQUFDLGVBQWUsSUFBSSxxQkFBUyxDQUFDLEtBQUssQ0FBQztRQUMxRSxDQUFDO1FBRUQsSUFBSSxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUM5QixJQUFBLG1CQUFTLEVBQUMsTUFBeUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRUQsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDakIsS0FBSyxDQUFDLEVBQUUsR0FBRyxnQkFBTSxDQUFDLE9BQU8sQ0FBQztRQUMzQixDQUFDO0lBQ0YsQ0FBQztJQXBDRCw0QkFvQ0MifQ==
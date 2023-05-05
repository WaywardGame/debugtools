define(["require", "exports", "game/entity/IEntity", "game/entity/npc/INPCs", "utilities/math/Direction", "utilities/math/Vector2", "./CloneInventory", "./CopyStats"], function (require, exports, IEntity_1, INPCs_1, Direction_1, Vector2_1, CloneInventory_1, CopyStats_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(entity, tile) {
        let clone;
        const creature = entity.asCreature;
        const human = entity.asHuman;
        if (creature) {
            clone = entity.island.creatures.spawn(creature.type, tile, true, creature.aberrant, undefined, true);
            if (creature.isTamed())
                clone.tame(creature.getOwner());
            clone.renamed = entity.renamed;
            clone.ai = creature.ai;
            clone.enemy = creature.enemy;
        }
        else if (human) {
            clone = entity.island.npcs.spawn(INPCs_1.NPCType.Merchant, tile);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVFbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBZUEsbUJBQXlCLE1BQWMsRUFBRSxJQUFVO1FBQ2xELElBQUksS0FBaUMsQ0FBQztRQUV0QyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ25DLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxRQUFRLEVBQUU7WUFDYixLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUUsQ0FBQztZQUV0RyxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUU7Z0JBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFHLENBQUMsQ0FBQztZQUN6RCxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDL0IsS0FBSyxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQ3ZCLEtBQUssQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztTQUU3QjthQUFNLElBQUksS0FBSyxFQUFFO1lBQ2pCLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUUsQ0FBQztZQUMxRCxLQUFLLENBQUMsYUFBYSxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDakQsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDN0MsSUFBQSx3QkFBYyxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM3QjtRQUVELElBQUksQ0FBQyxLQUFLO1lBQ1QsT0FBTztRQUVSLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7UUFDN0MsSUFBSSxhQUFhLEVBQUU7WUFDbEIsS0FBSyxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLGlCQUFPLENBQUMsSUFBSSxDQUFDO1lBQ2xFLEtBQUssQ0FBQyxlQUFlLEdBQUcsYUFBYSxDQUFDLGVBQWUsSUFBSSxxQkFBUyxDQUFDLEtBQUssQ0FBQztTQUN6RTtRQUVELElBQUksTUFBTSxDQUFDLGlCQUFpQixFQUFFO1lBQzdCLElBQUEsbUJBQVMsRUFBQyxNQUF5QixFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzVDO1FBRUQsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQ2hCLEtBQUssQ0FBQyxFQUFFLEdBQUcsZ0JBQU0sQ0FBQyxPQUFPLENBQUM7U0FDMUI7SUFDRixDQUFDO0lBcENELDRCQW9DQyJ9
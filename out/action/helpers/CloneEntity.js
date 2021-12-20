define(["require", "exports", "game/entity/IEntity", "game/entity/npc/INPCs", "./CloneInventory", "./CopyStats"], function (require, exports, IEntity_1, INPCs_1, CloneInventory_1, CopyStats_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(entity, position) {
        let clone;
        const creature = entity.asCreature;
        if (creature) {
            clone = entity.island.creatures.spawn(creature.type, position.x, position.y, position.z, true, creature.aberrant, undefined, true);
            if (creature.isTamed())
                clone.tame(creature.getOwner());
            clone.renamed = entity.renamed;
            clone.ai = creature.ai;
            clone.enemy = creature.enemy;
            clone.enemyAttempts = creature.enemyAttempts;
            clone.enemyIsPlayer = creature.enemyIsPlayer;
        }
        else {
            const npc = entity.asNPC;
            clone = entity.island.npcs.spawn(INPCs_1.NPCType.Merchant, position.x, position.y, position.z);
            clone.customization = { ...npc.customization };
            clone.renamed = entity.getName().getString();
            (0, CloneInventory_1.default)(npc, clone);
        }
        clone.direction = entity.direction.copy();
        clone.facingDirection = entity.facingDirection;
        (0, CopyStats_1.default)(entity, clone);
        if (clone.asNPC) {
            clone.ai = IEntity_1.AiType.Neutral;
        }
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVFbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBWUEsbUJBQXlCLE1BQWMsRUFBRSxRQUFrQjtRQUMxRCxJQUFJLEtBQXFCLENBQUM7UUFFMUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFJLFFBQVEsRUFBRTtZQUNiLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFFLENBQUM7WUFFcEksSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFO2dCQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRyxDQUFDLENBQUM7WUFDekQsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQy9CLEtBQUssQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFDN0IsS0FBSyxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO1lBQzdDLEtBQUssQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztTQUU3QzthQUFNO1lBQ04sTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQU0sQ0FBQztZQUMxQixLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUUsQ0FBQztZQUN4RixLQUFLLENBQUMsYUFBYSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDL0MsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDN0MsSUFBQSx3QkFBYyxFQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMzQjtRQUVELEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMxQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7UUFFL0MsSUFBQSxtQkFBUyxFQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV6QixJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7WUFDaEIsS0FBSyxDQUFDLEVBQUUsR0FBRyxnQkFBTSxDQUFDLE9BQU8sQ0FBQztTQUMxQjtJQUNGLENBQUM7SUE5QkQsNEJBOEJDIn0=
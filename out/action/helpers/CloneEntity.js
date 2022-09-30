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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVFbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBWUEsbUJBQXlCLE1BQWMsRUFBRSxRQUFrQjtRQUMxRCxJQUFJLEtBQXFCLENBQUM7UUFFMUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFJLFFBQVEsRUFBRTtZQUNiLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFFLENBQUM7WUFFcEksSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFO2dCQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRyxDQUFDLENBQUM7WUFDekQsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQy9CLEtBQUssQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7U0FFN0I7YUFBTTtZQUNOLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFNLENBQUM7WUFDMUIsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFFLENBQUM7WUFDeEYsS0FBSyxDQUFDLGFBQWEsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQy9DLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQzdDLElBQUEsd0JBQWMsRUFBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDM0I7UUFFRCxLQUFLLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDO1FBRS9DLElBQUEsbUJBQVMsRUFBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFekIsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQ2hCLEtBQUssQ0FBQyxFQUFFLEdBQUcsZ0JBQU0sQ0FBQyxPQUFPLENBQUM7U0FDMUI7SUFDRixDQUFDO0lBNUJELDRCQTRCQyJ9
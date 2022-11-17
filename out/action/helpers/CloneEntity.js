define(["require", "exports", "game/entity/IEntity", "game/entity/npc/INPCs", "./CloneInventory", "./CopyStats"], function (require, exports, IEntity_1, INPCs_1, CloneInventory_1, CopyStats_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(entity, position) {
        let clone;
        const creature = entity.asCreature;
        const human = entity.asHuman;
        if (creature) {
            clone = entity.island.creatures.spawn(creature.type, position.x, position.y, position.z, true, creature.aberrant, undefined, true);
            if (creature.isTamed())
                clone.tame(creature.getOwner());
            clone.renamed = entity.renamed;
            clone.ai = creature.ai;
            clone.enemy = creature.enemy;
        }
        else if (human) {
            clone = entity.island.npcs.spawn(INPCs_1.NPCType.Merchant, position.x, position.y, position.z);
            clone.customization = { ...human.customization };
            clone.renamed = entity.getName().getString();
            (0, CloneInventory_1.default)(human, clone);
        }
        if (!clone)
            return;
        clone.direction = entity.direction.copy();
        clone.facingDirection = entity.facingDirection;
        (0, CopyStats_1.default)(entity, clone);
        if (clone.asNPC) {
            clone.ai = IEntity_1.AiType.Neutral;
        }
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVFbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBWUEsbUJBQXlCLE1BQWMsRUFBRSxRQUFrQjtRQUMxRCxJQUFJLEtBQWlDLENBQUM7UUFFdEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksUUFBUSxFQUFFO1lBQ2IsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUUsQ0FBQztZQUVwSSxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUU7Z0JBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFHLENBQUMsQ0FBQztZQUN6RCxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDL0IsS0FBSyxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQ3ZCLEtBQUssQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztTQUU3QjthQUFNLElBQUksS0FBSyxFQUFFO1lBQ2pCLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDO1lBQ3hGLEtBQUssQ0FBQyxhQUFhLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNqRCxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUM3QyxJQUFBLHdCQUFjLEVBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzdCO1FBRUQsSUFBSSxDQUFDLEtBQUs7WUFDVCxPQUFPO1FBRVIsS0FBSyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQztRQUUvQyxJQUFBLG1CQUFTLEVBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXpCLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtZQUNoQixLQUFLLENBQUMsRUFBRSxHQUFHLGdCQUFNLENBQUMsT0FBTyxDQUFDO1NBQzFCO0lBQ0YsQ0FBQztJQS9CRCw0QkErQkMifQ==
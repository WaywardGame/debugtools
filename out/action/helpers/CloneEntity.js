define(["require", "exports", "entity/Entity", "entity/IEntity", "entity/npc/NPCS", "utilities/math/Vector2", "./CloneInventory", "./CopyStats"], function (require, exports, Entity_1, IEntity_1, NPCS_1, Vector2_1, CloneInventory_1, CopyStats_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(entity, position) {
        let clone;
        if (Entity_1.default.is(entity, IEntity_1.EntityType.Creature)) {
            clone = creatureManager.spawn(entity.type, position.x, position.y, position.z, true, entity.aberrant, undefined, true);
            if (entity.isTamed())
                clone.tame(entity.getOwner());
            clone.renamed = entity.renamed;
            clone.ai = entity.ai;
            clone.enemy = entity.enemy;
            clone.enemyAttempts = entity.enemyAttempts;
            clone.enemyIsPlayer = entity.enemyIsPlayer;
        }
        else {
            clone = npcManager.spawn(NPCS_1.NPCType.Merchant, position.x, position.y, position.z);
            clone.customization = Object.assign({}, entity.customization);
            clone.renamed = entity.getName().getString();
            CloneInventory_1.default(entity, clone);
        }
        clone.direction = new Vector2_1.default(entity.direction).raw();
        clone.facingDirection = entity.facingDirection;
        CopyStats_1.default(entity, clone);
        if (Entity_1.default.is(clone, IEntity_1.EntityType.NPC)) {
            clone.ai = IEntity_1.AiType.Neutral;
        }
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVFbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBZUEsbUJBQXlCLE1BQStCLEVBQUUsUUFBa0I7UUFDM0UsSUFBSSxLQUE4QixDQUFDO1FBRW5DLElBQUksZ0JBQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLG9CQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDM0MsS0FBSyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFFLENBQUM7WUFFeEgsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO2dCQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRyxDQUFDLENBQUM7WUFDckQsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQy9CLEtBQUssQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUNyQixLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDM0IsS0FBSyxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDO1lBQzNDLEtBQUssQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztTQUUzQzthQUFNO1lBQ04sS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsY0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDO1lBQ2hGLEtBQUssQ0FBQyxhQUFhLHFCQUFRLE1BQU0sQ0FBQyxhQUFhLENBQUUsQ0FBQztZQUNsRCxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUM3Qyx3QkFBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM5QjtRQUVELEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN0RCxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7UUFFL0MsbUJBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFekIsSUFBSSxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsb0JBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNyQyxLQUFLLENBQUMsRUFBRSxHQUFHLGdCQUFNLENBQUMsT0FBTyxDQUFDO1NBQzFCO0lBQ0YsQ0FBQztJQTVCRCw0QkE0QkMifQ==
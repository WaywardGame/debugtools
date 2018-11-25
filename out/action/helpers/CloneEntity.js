define(["require", "exports", "entity/Entity", "entity/IEntity", "Enums", "utilities/math/Vector2", "./CloneInventory", "./CopyStats"], function (require, exports, Entity_1, IEntity_1, Enums_1, Vector2_1, CloneInventory_1, CopyStats_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(entity, position) {
        let clone;
        if (Entity_1.default.is(entity, IEntity_1.EntityType.Creature)) {
            clone = creatureManager.spawn(entity.type, position.x, position.y, position.z, true, entity.aberrant);
            if (entity.isTamed())
                clone.tame(entity.getOwner());
            clone.renamed = entity.renamed;
            clone.ai = entity.ai;
            clone.enemy = entity.enemy;
            clone.enemyAttempts = entity.enemyAttempts;
            clone.enemyIsPlayer = entity.enemyIsPlayer;
        }
        else {
            clone = npcManager.spawn(Enums_1.NPCType.Merchant, position.x, position.y, position.z);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVFbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBY0EsbUJBQXlCLE1BQWtDLEVBQUUsUUFBa0I7UUFDOUUsSUFBSSxLQUFpQyxDQUFDO1FBRXRDLElBQUksZ0JBQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLG9CQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDM0MsS0FBSyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBRSxDQUFDO1lBRXZHLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtnQkFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUcsQ0FBQyxDQUFDO1lBQ3JELEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUMvQixLQUFLLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDckIsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQzNCLEtBQUssQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztZQUMzQyxLQUFLLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUM7U0FFM0M7YUFBTTtZQUNOLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLGVBQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUUsQ0FBQztZQUNoRixLQUFLLENBQUMsYUFBYSxxQkFBUSxNQUFNLENBQUMsYUFBYSxDQUFFLENBQUM7WUFDbEQsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDN0Msd0JBQWMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDOUI7UUFFRCxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksaUJBQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdEQsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDO1FBRS9DLG1CQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXpCLElBQUksZ0JBQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLG9CQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDckMsS0FBSyxDQUFDLEVBQUUsR0FBRyxnQkFBTSxDQUFDLE9BQU8sQ0FBQztTQUMxQjtJQUNGLENBQUM7SUE1QkQsNEJBNEJDIn0=
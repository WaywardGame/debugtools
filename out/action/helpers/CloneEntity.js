define(["require", "exports", "entity/IEntity", "entity/npc/NPCS", "utilities/math/Vector2", "./CloneInventory", "./CopyStats"], function (require, exports, IEntity_1, NPCS_1, Vector2_1, CloneInventory_1, CopyStats_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(entity, position) {
        let clone;
        const creature = entity.asCreature;
        if (creature) {
            clone = creatureManager.spawn(creature.type, position.x, position.y, position.z, true, creature.aberrant, undefined, true);
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
            clone = npcManager.spawn(NPCS_1.NPCType.Merchant, position.x, position.y, position.z);
            clone.customization = Object.assign({}, npc.customization);
            clone.renamed = entity.getName().getString();
            CloneInventory_1.default(npc, clone);
        }
        clone.direction = new Vector2_1.default(entity.direction).raw();
        clone.facingDirection = entity.facingDirection;
        CopyStats_1.default(entity, clone);
        if (clone.asNPC) {
            clone.ai = IEntity_1.AiType.Neutral;
        }
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVFbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBYUEsbUJBQXlCLE1BQWMsRUFBRSxRQUFrQjtRQUMxRCxJQUFJLEtBQXFCLENBQUM7UUFFMUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFJLFFBQVEsRUFBRTtZQUNiLEtBQUssR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBRSxDQUFDO1lBRTVILElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRTtnQkFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUcsQ0FBQyxDQUFDO1lBQ3pELEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUMvQixLQUFLLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7WUFDdkIsS0FBSyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQzdCLEtBQUssQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztZQUM3QyxLQUFLLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7U0FFN0M7YUFBTTtZQUNOLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFNLENBQUM7WUFDMUIsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsY0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDO1lBQ2hGLEtBQUssQ0FBQyxhQUFhLHFCQUFRLEdBQUcsQ0FBQyxhQUFhLENBQUUsQ0FBQztZQUMvQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUM3Qyx3QkFBYyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMzQjtRQUVELEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN0RCxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7UUFFL0MsbUJBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFekIsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQ2hCLEtBQUssQ0FBQyxFQUFFLEdBQUcsZ0JBQU0sQ0FBQyxPQUFPLENBQUM7U0FDMUI7SUFDRixDQUFDO0lBOUJELDRCQThCQyJ9
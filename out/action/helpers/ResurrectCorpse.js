define(["require", "exports", "entity/creature/ICreature", "utilities/math/Vector3", "../../IDebugTools", "./GetPosition"], function (require, exports, ICreature_1, Vector3_1, IDebugTools_1, GetPosition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(player, corpse) {
        if (corpse.type === ICreature_1.CreatureType.Blood || corpse.type === ICreature_1.CreatureType.WaterBlood) {
            return false;
        }
        const location = GetPosition_1.default(player, new Vector3_1.default(corpse), () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionResurrect)
            .get(corpseManager.getName(corpse)));
        if (!location)
            return false;
        const creature = creatureManager.spawn(corpse.type, corpse.x, corpse.y, corpse.z, true, corpse.aberrant);
        creature.renamed = corpse.renamed;
        corpseManager.remove(corpse);
        renderer.computeSpritesInViewport();
        return true;
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzdXJyZWN0Q29ycHNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL1Jlc3VycmVjdENvcnBzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFPQSxtQkFBeUIsTUFBZSxFQUFFLE1BQWU7UUFFeEQsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLHdCQUFZLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssd0JBQVksQ0FBQyxVQUFVLEVBQUU7WUFDbEYsT0FBTyxLQUFLLENBQUM7U0FDYjtRQUdELE1BQU0sUUFBUSxHQUFHLHFCQUFXLENBQUMsTUFBTSxFQUFFLElBQUksaUJBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGVBQWUsQ0FBQzthQUNoSCxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEMsSUFBSSxDQUFDLFFBQVE7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUU1QixNQUFNLFFBQVEsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6RyxRQUFTLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbkMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU3QixRQUFRLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUNwQyxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFsQkQsNEJBa0JDIn0=
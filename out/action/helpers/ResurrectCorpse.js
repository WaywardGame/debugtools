define(["require", "exports", "utilities/math/Vector3", "../../IDebugTools", "./GetPosition"], function (require, exports, Vector3_1, IDebugTools_1, GetPosition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(player, corpse) {
        const location = (0, GetPosition_1.default)(player, new Vector3_1.default(corpse), () => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionResurrect)
            .get(player.island.corpses.getName(corpse)));
        if (!location)
            return false;
        const creature = player.island.creatures.spawn(corpse.type, corpse.x, corpse.y, corpse.z, true, corpse.aberrant, undefined, true);
        creature.renamed = corpse.renamed;
        player.island.corpses.remove(corpse);
        renderer?.computeSpritesInViewport();
        return true;
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzdXJyZWN0Q29ycHNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL1Jlc3VycmVjdENvcnBzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFRQSxtQkFBeUIsTUFBYyxFQUFFLE1BQWM7UUFFdEQsTUFBTSxRQUFRLEdBQUcsSUFBQSxxQkFBVyxFQUFDLE1BQU0sRUFBRSxJQUFJLGlCQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGVBQWUsQ0FBQzthQUNoSCxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU5QyxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRTVCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsSSxRQUFTLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXJDLFFBQVEsRUFBRSx3QkFBd0IsRUFBRSxDQUFDO1FBQ3JDLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQWJELDRCQWFDIn0=
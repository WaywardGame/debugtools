define(["require", "exports", "utilities/math/Vector3", "../../IDebugTools", "./GetPosition"], function (require, exports, Vector3_1, IDebugTools_1, GetPosition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(human, corpse) {
        const location = (0, GetPosition_1.default)(human, new Vector3_1.default(corpse), () => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionResurrect)
            .get(human.island.corpses.getName(corpse)));
        if (!location)
            return false;
        const creature = human.island.creatures.spawn(corpse.type, corpse.tile, true, corpse.aberrant, undefined, true);
        creature.renamed = corpse.renamed;
        human.island.corpses.remove(corpse);
        renderers.computeSpritesInViewport(corpse);
        return true;
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzdXJyZWN0Q29ycHNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL1Jlc3VycmVjdENvcnBzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFPQSxtQkFBeUIsS0FBWSxFQUFFLE1BQWM7UUFFcEQsTUFBTSxRQUFRLEdBQUcsSUFBQSxxQkFBVyxFQUFDLEtBQUssRUFBRSxJQUFJLGlCQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGVBQWUsQ0FBQzthQUMvRyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRTVCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hILFFBQVMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNuQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFcEMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQWJELDRCQWFDIn0=
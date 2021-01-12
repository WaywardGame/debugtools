define(["require", "exports", "utilities/math/Vector3", "../../IDebugTools", "./GetPosition"], function (require, exports, Vector3_1, IDebugTools_1, GetPosition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(player, corpse) {
        const location = GetPosition_1.default(player, new Vector3_1.default(corpse), () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionResurrect)
            .get(corpseManager.getName(corpse)));
        if (!location)
            return false;
        const creature = creatureManager.spawn(corpse.type, corpse.x, corpse.y, corpse.z, true, corpse.aberrant, undefined, true);
        creature.renamed = corpse.renamed;
        corpseManager.remove(corpse);
        renderer === null || renderer === void 0 ? void 0 : renderer.computeSpritesInViewport();
        return true;
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzdXJyZWN0Q29ycHNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL1Jlc3VycmVjdENvcnBzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFRQSxtQkFBeUIsTUFBYyxFQUFFLE1BQWM7UUFFdEQsTUFBTSxRQUFRLEdBQUcscUJBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsZUFBZSxDQUFDO2FBQ2hILEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRTVCLE1BQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUgsUUFBUyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25DLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0IsUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLHdCQUF3QixHQUFHO1FBQ3JDLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQWJELDRCQWFDIn0=
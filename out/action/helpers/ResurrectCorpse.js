/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
define(["require", "exports", "../../IDebugTools", "./GetTile"], function (require, exports, IDebugTools_1, GetTile_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    function default_1(human, corpse) {
        const tile = (0, GetTile_1.getTile)(human, corpse.tile, () => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionResurrect)
            .get(human.island.corpses.getName(corpse)));
        if (!tile)
            return false;
        const creature = human.island.creatures.spawn(corpse.type, tile, true, corpse.aberrant, undefined, true);
        creature.renamed = corpse.renamed;
        human.island.corpses.remove(corpse);
        renderers.computeSpritesInViewport(corpse);
        return true;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzdXJyZWN0Q29ycHNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL1Jlc3VycmVjdENvcnBzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7SUFPSCw0QkFhQztJQWJELG1CQUF5QixLQUFZLEVBQUUsTUFBYztRQUVwRCxNQUFNLElBQUksR0FBRyxJQUFBLGlCQUFPLEVBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGVBQWUsQ0FBQzthQUMvRixHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRXhCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekcsUUFBUyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25DLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVwQyxTQUFTLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDIn0=
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
define(["require", "exports", "@wayward/game/game/IGame"], function (require, exports, IGame_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    function default_1(island, tile, tilled) {
        const tileType = tile.type;
        if (!tile.description?.tillable) {
            return;
        }
        const tileData = tile.getOrCreateTileData();
        if (tileData.length === 0) {
            tileData.push({
                type: tileType,
                tilled,
            });
        }
        else {
            tileData[0].tilled = tilled;
        }
        tile.updateWorldTile(IGame_1.TileUpdateType.Tilled);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0VGlsbGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL1NldFRpbGxlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7SUFNSCw0QkFrQkM7SUFsQkQsbUJBQXlCLE1BQWMsRUFBRSxJQUFVLEVBQUUsTUFBZTtRQUNuRSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxDQUFDO1lBQ2pDLE9BQU87UUFDUixDQUFDO1FBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDNUMsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzNCLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQ2IsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsTUFBTTthQUNOLENBQUMsQ0FBQztRQUVKLENBQUM7YUFBTSxDQUFDO1lBQ1AsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDN0IsQ0FBQztRQUVELElBQUksQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxDQUFDIn0=
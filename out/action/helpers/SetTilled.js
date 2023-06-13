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
define(["require", "exports", "game/IGame"], function (require, exports, IGame_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        island.world.updateTile(tile, IGame_1.TileUpdateType.Tilled);
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0VGlsbGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL1NldFRpbGxlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7SUFNSCxtQkFBeUIsTUFBYyxFQUFFLElBQVUsRUFBRSxNQUFlO1FBQ25FLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFO1lBQ2hDLE9BQU87U0FDUDtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzVDLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDMUIsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDYixJQUFJLEVBQUUsUUFBUTtnQkFDZCxNQUFNO2FBQ04sQ0FBQyxDQUFDO1NBRUg7YUFBTTtZQUNOLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1NBQzVCO1FBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLHNCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQWxCRCw0QkFrQkMifQ==
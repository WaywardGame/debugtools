define(["require", "exports", "game/IGame", "game/tile/Terrains"], function (require, exports, IGame_1, Terrains_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(island, tile, tilled) {
        const tileType = tile.type;
        if (!Terrains_1.default[tileType].tillable) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0VGlsbGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL1NldFRpbGxlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFLQSxtQkFBeUIsTUFBYyxFQUFFLElBQVUsRUFBRSxNQUFlO1FBQ25FLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLGtCQUFtQixDQUFDLFFBQVEsQ0FBRSxDQUFDLFFBQVEsRUFBRTtZQUM3QyxPQUFPO1NBQ1A7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUM1QyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzFCLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQ2IsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsTUFBTTthQUNOLENBQUMsQ0FBQztTQUVIO2FBQU07WUFDTixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztTQUM1QjtRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxzQkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFsQkQsNEJBa0JDIn0=
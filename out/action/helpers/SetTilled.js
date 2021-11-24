define(["require", "exports", "game/IGame", "game/tile/Terrains", "utilities/game/TileHelpers"], function (require, exports, IGame_1, Terrains_1, TileHelpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(island, x, y, z, tilled) {
        const tile = island.getTile(x, y, z);
        const tileType = TileHelpers_1.default.getType(tile);
        if (!Terrains_1.default[tileType].tillable) {
            return;
        }
        const tileData = island.getOrCreateTileData(x, y, z);
        if (tileData.length === 0) {
            tileData.push({
                type: tileType,
                tilled,
            });
        }
        else {
            tileData[0].tilled = tilled;
        }
        TileHelpers_1.default.setTilled(tile, tilled);
        island.world.updateTile(x, y, z, tile, IGame_1.TileUpdateType.Tilled);
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0VGlsbGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL1NldFRpbGxlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFLQSxtQkFBeUIsTUFBYyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLE1BQWU7UUFDeEYsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXJDLE1BQU0sUUFBUSxHQUFHLHFCQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxrQkFBbUIsQ0FBQyxRQUFRLENBQUUsQ0FBQyxRQUFRLEVBQUU7WUFDN0MsT0FBTztTQUNQO1FBRUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckQsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMxQixRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUNiLElBQUksRUFBRSxRQUFRO2dCQUNkLE1BQU07YUFDTixDQUFDLENBQUM7U0FFSDthQUFNO1lBQ04sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7U0FDNUI7UUFFRCxxQkFBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFcEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLHNCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQXRCRCw0QkFzQkMifQ==
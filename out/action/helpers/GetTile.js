define(["require", "exports", "game/entity/IEntity", "game/entity/player/IMessageManager", "ui/component/Text", "../../Actions"], function (require, exports, IEntity_1, IMessageManager_1, Text_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTile = void 0;
    function getTile(human, tile, actionName) {
        if (tile.isOpenTile || human.getMoveType() === IEntity_1.MoveType.Flying) {
            return tile;
        }
        const openTile = tile?.findMatchingTile((tile) => !tile.isTileBlocked);
        if (!openTile) {
            human.messages.source(Actions_1.default.DEBUG_TOOLS.source)
                .type(IMessageManager_1.MessageType.Bad)
                .send(Actions_1.default.DEBUG_TOOLS.messageFailureTileBlocked, Text_1.default.resolve(actionName));
        }
        return openTile;
    }
    exports.getTile = getTile;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0VGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb24vaGVscGVycy9HZXRUaWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFjQSxTQUFnQixPQUFPLENBQUMsS0FBWSxFQUFFLElBQVUsRUFBRSxVQUFnQztRQUNqRixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLGtCQUFRLENBQUMsTUFBTSxFQUFFO1lBQy9ELE9BQU8sSUFBSSxDQUFDO1NBQ1o7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZCxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxpQkFBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7aUJBQy9DLElBQUksQ0FBQyw2QkFBVyxDQUFDLEdBQUcsQ0FBQztpQkFDckIsSUFBSSxDQUFDLGlCQUFPLENBQUMsV0FBVyxDQUFDLHlCQUF5QixFQUFFLGNBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUNoRjtRQUVELE9BQU8sUUFBUSxDQUFDO0lBQ2pCLENBQUM7SUFiRCwwQkFhQyJ9
define(["require", "exports", "game/entity/IEntity", "game/entity/player/IMessageManager", "ui/component/Text", "../../Actions"], function (require, exports, IEntity_1, IMessageManager_1, Text_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(human, position, actionName) {
        const tile = human.island.getTileSafe(position.x, position.y, position.z);
        if (tile && (tile.isOpenTile || human.getMoveType() === IEntity_1.MoveType.Flying)) {
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
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0UG9zaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvR2V0UG9zaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBZUEsbUJBQXlCLEtBQVksRUFBRSxRQUFrQixFQUFFLFVBQWdDO1FBQzFGLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUUsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxrQkFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3pFLE9BQU8sSUFBSSxDQUFDO1NBQ1o7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZCxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxpQkFBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7aUJBQy9DLElBQUksQ0FBQyw2QkFBVyxDQUFDLEdBQUcsQ0FBQztpQkFDckIsSUFBSSxDQUFDLGlCQUFPLENBQUMsV0FBVyxDQUFDLHlCQUF5QixFQUFFLGNBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUNoRjtRQUVELE9BQU8sUUFBUSxDQUFDO0lBQ2pCLENBQUM7SUFkRCw0QkFjQyJ9
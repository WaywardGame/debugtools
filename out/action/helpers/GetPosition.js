define(["require", "exports", "newui/component/Text", "player/MessageManager", "utilities/TileHelpers", "../../Actions", "Enums"], function (require, exports, Text_1, MessageManager_1, TileHelpers_1, Actions_1, Enums_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(player, position, actionName) {
        if (TileHelpers_1.default.isOpenTile(position, game.getTile(position.x, position.y, position.z)) ||
            player.getMoveType() === Enums_1.MoveType.Flying) {
            return position;
        }
        const openTile = TileHelpers_1.default.findMatchingTile(position, TileHelpers_1.default.isOpenTile);
        if (!openTile) {
            player.messages.source(Actions_1.default.DEBUG_TOOLS.source)
                .type(MessageManager_1.MessageType.Bad)
                .send(Actions_1.default.DEBUG_TOOLS.messageFailureTileBlocked, Text_1.default.resolve(actionName));
        }
        return openTile;
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0UG9zaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvR2V0UG9zaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBZUEsbUJBQXlCLE1BQWUsRUFBRSxRQUFrQixFQUFFLFVBQWdDO1FBQzdGLElBQUkscUJBQVcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyRixNQUFNLENBQUMsV0FBVyxFQUFFLEtBQUssZ0JBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDMUMsT0FBTyxRQUFRLENBQUM7U0FDaEI7UUFFRCxNQUFNLFFBQVEsR0FBRyxxQkFBVyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxxQkFBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWhGLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxpQkFBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7aUJBQ2hELElBQUksQ0FBQyw0QkFBVyxDQUFDLEdBQUcsQ0FBQztpQkFDckIsSUFBSSxDQUFDLGlCQUFPLENBQUMsV0FBVyxDQUFDLHlCQUF5QixFQUFFLGNBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUNoRjtRQUVELE9BQU8sUUFBUSxDQUFDO0lBQ2pCLENBQUM7SUFmRCw0QkFlQyJ9
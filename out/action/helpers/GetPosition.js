define(["require", "exports", "game/entity/IEntity", "game/entity/player/IMessageManager", "ui/component/Text", "utilities/game/TileHelpers", "../../Actions"], function (require, exports, IEntity_1, IMessageManager_1, Text_1, TileHelpers_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(player, position, actionName) {
        if (TileHelpers_1.default.isOpenTile(position, game.getTile(position.x, position.y, position.z)) ||
            player.getMoveType() === IEntity_1.MoveType.Flying) {
            return position;
        }
        const openTile = TileHelpers_1.default.findMatchingTile(position, TileHelpers_1.default.isOpenTile);
        if (!openTile) {
            player.messages.source(Actions_1.default.DEBUG_TOOLS.source)
                .type(IMessageManager_1.MessageType.Bad)
                .send(Actions_1.default.DEBUG_TOOLS.messageFailureTileBlocked, Text_1.default.resolve(actionName));
        }
        return openTile;
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0UG9zaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvR2V0UG9zaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBZ0JBLG1CQUF5QixNQUFjLEVBQUUsUUFBa0IsRUFBRSxVQUFnQztRQUM1RixJQUFJLHFCQUFXLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckYsTUFBTSxDQUFDLFdBQVcsRUFBRSxLQUFLLGtCQUFRLENBQUMsTUFBTSxFQUFFO1lBQzFDLE9BQU8sUUFBUSxDQUFDO1NBQ2hCO1FBRUQsTUFBTSxRQUFRLEdBQUcscUJBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUscUJBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVoRixJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsaUJBQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO2lCQUNoRCxJQUFJLENBQUMsNkJBQVcsQ0FBQyxHQUFHLENBQUM7aUJBQ3JCLElBQUksQ0FBQyxpQkFBTyxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRSxjQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDaEY7UUFFRCxPQUFPLFFBQVEsQ0FBQztJQUNqQixDQUFDO0lBZkQsNEJBZUMifQ==
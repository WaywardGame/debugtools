define(["require", "exports", "newui/component/Text", "player/MessageManager", "utilities/TileHelpers", "../../Actions"], function (require, exports, Text_1, MessageManager_1, TileHelpers_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(player, position, actionName) {
        if (TileHelpers_1.default.isOpenTile(position, game.getTile(position.x, position.y, position.z)))
            return position;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0UG9zaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvR2V0UG9zaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBY0EsbUJBQXlCLE1BQWUsRUFBRSxRQUFrQixFQUFFLFVBQWdDO1FBQzdGLElBQUkscUJBQVcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUFFLE9BQU8sUUFBUSxDQUFDO1FBRXhHLE1BQU0sUUFBUSxHQUFHLHFCQUFXLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLHFCQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEYsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNkLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGlCQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztpQkFDaEQsSUFBSSxDQUFDLDRCQUFXLENBQUMsR0FBRyxDQUFDO2lCQUNyQixJQUFJLENBQUMsaUJBQU8sQ0FBQyxXQUFXLENBQUMseUJBQXlCLEVBQUUsY0FBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1NBQ2hGO1FBRUQsT0FBTyxRQUFRLENBQUM7SUFDakIsQ0FBQztJQVpELDRCQVlDIn0=
define(["require", "exports", "game/entity/IEntity", "game/entity/player/IMessageManager", "ui/component/Text", "utilities/game/TileHelpers", "../../Actions"], function (require, exports, IEntity_1, IMessageManager_1, Text_1, TileHelpers_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(human, position, actionName) {
        if (TileHelpers_1.default.isOpenTile(human.island, position, human.island.getTile(position.x, position.y, position.z)) ||
            human.getMoveType() === IEntity_1.MoveType.Flying) {
            return position;
        }
        const openTile = TileHelpers_1.default.findMatchingTile(human.island, position, TileHelpers_1.default.isOpenTile);
        if (!openTile) {
            human.messages.source(Actions_1.default.DEBUG_TOOLS.source)
                .type(IMessageManager_1.MessageType.Bad)
                .send(Actions_1.default.DEBUG_TOOLS.messageFailureTileBlocked, Text_1.default.resolve(actionName));
        }
        return openTile;
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0UG9zaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvR2V0UG9zaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBZUEsbUJBQXlCLEtBQVksRUFBRSxRQUFrQixFQUFFLFVBQWdDO1FBQzFGLElBQUkscUJBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssa0JBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDekMsT0FBTyxRQUFRLENBQUM7U0FDaEI7UUFFRCxNQUFNLFFBQVEsR0FBRyxxQkFBVyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLHFCQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFOUYsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNkLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGlCQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztpQkFDL0MsSUFBSSxDQUFDLDZCQUFXLENBQUMsR0FBRyxDQUFDO2lCQUNyQixJQUFJLENBQUMsaUJBQU8sQ0FBQyxXQUFXLENBQUMseUJBQXlCLEVBQUUsY0FBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1NBQ2hGO1FBRUQsT0FBTyxRQUFRLENBQUM7SUFDakIsQ0FBQztJQWZELDRCQWVDIn0=
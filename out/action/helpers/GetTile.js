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
define(["require", "exports", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/player/IMessageManager", "@wayward/game/ui/component/Text", "../../Actions"], function (require, exports, IEntity_1, IMessageManager_1, Text_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTile = void 0;
    function getTile(human, tile, actionName) {
        if (tile.isOpen || human.getMoveType() === IEntity_1.MoveType.Flying) {
            return tile;
        }
        const openTile = tile?.findMatchingTile((tile) => !tile.isBlocked);
        if (!openTile) {
            human.messages.source(Actions_1.default.DEBUG_TOOLS.source)
                .type(IMessageManager_1.MessageType.Bad)
                .send(Actions_1.default.DEBUG_TOOLS.messageFailureTileBlocked, Text_1.default.resolve(actionName).sections);
        }
        return openTile;
    }
    exports.getTile = getTile;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0VGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb24vaGVscGVycy9HZXRUaWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7SUFnQkgsU0FBZ0IsT0FBTyxDQUFDLEtBQVksRUFBRSxJQUFVLEVBQUUsVUFBZ0M7UUFDakYsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxrQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzVELE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2YsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsaUJBQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO2lCQUMvQyxJQUFJLENBQUMsNkJBQVcsQ0FBQyxHQUFHLENBQUM7aUJBQ3JCLElBQUksQ0FBQyxpQkFBTyxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRSxjQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFGLENBQUM7UUFFRCxPQUFPLFFBQVEsQ0FBQztJQUNqQixDQUFDO0lBYkQsMEJBYUMifQ==
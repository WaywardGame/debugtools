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
    exports.getTile = getTile;
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0VGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb24vaGVscGVycy9HZXRUaWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7OztJQWdCSCwwQkFhQztJQWJELFNBQWdCLE9BQU8sQ0FBQyxLQUFZLEVBQUUsSUFBVSxFQUFFLFVBQWdDO1FBQ2pGLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssa0JBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM1RCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNmLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGlCQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztpQkFDL0MsSUFBSSxDQUFDLDZCQUFXLENBQUMsR0FBRyxDQUFDO2lCQUNyQixJQUFJLENBQUMsaUJBQU8sQ0FBQyxXQUFXLENBQUMseUJBQXlCLEVBQUUsY0FBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRixDQUFDO1FBRUQsT0FBTyxRQUFRLENBQUM7SUFDakIsQ0FBQyJ9
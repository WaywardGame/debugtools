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
define(["require", "exports", "@wayward/game/game/IGame", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "../Actions"], function (require, exports, IGame_1, IEntity_1, Action_1, IAction_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Integer32, IAction_1.ActionArgument.OPTIONAL(IAction_1.ActionArgument.FLAGS(IGame_1.TickFlag)))
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(Actions_1.defaultCanUseHandler)
        .setHandler((action, ticks, tickFlags) => {
        multiplayer.runSafely(() => action.executor.island.fastForward({
            ticks,
            tickFlags,
            playingHumans: action.executor.island.getPlayers(true),
        }), {
            isSynced: true,
            pauseIncomingPacketProcessing: true,
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmFzdEZvcndhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0Zhc3RGb3J3YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7OztJQVFILGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsU0FBUyxFQUFFLHdCQUFjLENBQUMsUUFBUSxDQUFDLHdCQUFjLENBQUMsS0FBSyxDQUFDLGdCQUFRLENBQUMsQ0FBQyxDQUFDO1NBQzFHLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxTQUFTLENBQUMsOEJBQW9CLENBQUM7U0FDL0IsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRTtRQUN4QyxXQUFXLENBQUMsU0FBUyxDQUNwQixHQUFHLEVBQUUsQ0FDSixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDbEMsS0FBSztZQUNMLFNBQVM7WUFDVCxhQUFhLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztTQUN0RCxDQUFDLEVBQ0g7WUFDQyxRQUFRLEVBQUUsSUFBSTtZQUNkLDZCQUE2QixFQUFFLElBQUk7U0FDbkMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUMifQ==
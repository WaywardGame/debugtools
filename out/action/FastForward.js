define(["require", "exports", "@wayward/game/game/IGame", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "../Actions"], function (require, exports, IGame_1, IEntity_1, Action_1, IAction_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Integer32, IAction_1.ActionArgument.OPTIONAL(IAction_1.ActionArgument.FLAGS(IGame_1.TickFlag)))
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(action => {
        if (!Actions_1.default.DEBUG_TOOLS.hasPermission(action.executor)) {
            return { usable: false };
        }
        return { usable: true };
    })
        .setHandler((action, ticks, flags) => {
        multiplayer.runSafely(() => action.executor.island.fastForward(ticks, flags), {
            isSynced: true,
            pauseIncomingPacketProcessing: true,
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmFzdEZvcndhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0Zhc3RGb3J3YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQU1BLGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsU0FBUyxFQUFFLHdCQUFjLENBQUMsUUFBUSxDQUFDLHdCQUFjLENBQUMsS0FBSyxDQUFDLGdCQUFRLENBQUMsQ0FBQyxDQUFDO1NBQzFHLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDbkIsSUFBSSxDQUFDLGlCQUFPLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztZQUN6RCxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQzFCLENBQUM7UUFFRCxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ3pCLENBQUMsQ0FBQztTQUNELFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDcEMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQzdFLFFBQVEsRUFBRSxJQUFJO1lBQ2QsNkJBQTZCLEVBQUUsSUFBSTtTQUNuQyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQyJ9
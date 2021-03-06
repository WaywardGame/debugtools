define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "game/entity/IHuman", "game/IGame", "../Actions"], function (require, exports, Action_1, IAction_1, IEntity_1, IHuman_1, IGame_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Player, IAction_1.ActionArgument.Boolean)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, player, noclip) => {
        if (!player)
            return;
        Actions_1.default.DEBUG_TOOLS.setPlayerData(player, "noclip", noclip ? {
            moving: false,
            delay: IHuman_1.Delay.Movement,
        } : false);
        player.setMoveType(noclip ? IEntity_1.MoveType.Flying : IEntity_1.MoveType.Land);
        game.updateView(IGame_1.RenderSource.Mod, true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9nZ2xlTm9DbGlwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbi9Ub2dnbGVOb0NsaXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBT0Esa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxPQUFPLENBQUM7U0FDdEUsV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFFdEMsSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPO1FBRXBCLGlCQUFPLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDNUQsTUFBTSxFQUFFLEtBQUs7WUFDYixLQUFLLEVBQUUsY0FBSyxDQUFDLFFBQVE7U0FDckIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFWCxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsa0JBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGtCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBWSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsQ0FBQyJ9
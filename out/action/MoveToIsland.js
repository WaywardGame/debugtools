define(["require", "exports", "game/entity/action/Action", "game/entity/action/IAction", "game/entity/IEntity", "../Actions"], function (require, exports, Action_1, IAction_1, IEntity_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.String, IAction_1.ActionArgument.Integer32)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, islandId, biome) => {
        action.executor.moveToIslandId(islandId, { newWorldBiomeTypeOverride: biome });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW92ZVRvSXNsYW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbi9Nb3ZlVG9Jc2xhbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBT0Esa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxTQUFTLENBQUM7U0FDckUsV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDcEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBb0IsRUFBRSxFQUFFLHlCQUF5QixFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDL0YsQ0FBQyxDQUFDLENBQUMifQ==
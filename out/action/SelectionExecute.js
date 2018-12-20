define(["require", "exports", "action/Action", "action/IAction", "entity/IEntity", "../Actions", "../IDebugTools", "../ui/panel/SelectionPanel", "./helpers/Remove"], function (require, exports, Action_1, IAction_1, IEntity_1, Actions_1, IDebugTools_1, SelectionPanel_1, Remove_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Number, IAction_1.ActionArgument.Array)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, executionType, selection) => {
        for (const [type, id] of selection) {
            let target;
            switch (type) {
                case SelectionPanel_1.SelectionType.Creature:
                    target = game.creatures[id];
                    break;
                case SelectionPanel_1.SelectionType.NPC:
                    target = game.npcs[id];
                    break;
                case SelectionPanel_1.SelectionType.TileEvent:
                    target = game.tileEvents[id];
                    break;
            }
            if (!target) {
                continue;
            }
            switch (executionType) {
                case IDebugTools_1.DebugToolsTranslation.ActionRemove:
                    Remove_1.default(action, target);
                    break;
            }
        }
        renderer.computeSpritesInViewport();
        action.setUpdateRender();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uRXhlY3V0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vU2VsZWN0aW9uRXhlY3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFnQkEsa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxLQUFLLENBQUM7U0FDcEUsV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxhQUFvQyxFQUFFLFNBQW9DLEVBQUUsRUFBRTtRQUNsRyxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksU0FBUyxFQUFFO1lBQ25DLElBQUksTUFBaUQsQ0FBQztZQUV0RCxRQUFRLElBQUksRUFBRTtnQkFDYixLQUFLLDhCQUFhLENBQUMsUUFBUTtvQkFDMUIsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzVCLE1BQU07Z0JBQ1AsS0FBSyw4QkFBYSxDQUFDLEdBQUc7b0JBQ3JCLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN2QixNQUFNO2dCQUNQLEtBQUssOEJBQWEsQ0FBQyxTQUFTO29CQUMzQixNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDN0IsTUFBTTthQUNQO1lBRUQsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDWixTQUFTO2FBQ1Q7WUFFRCxRQUFRLGFBQWEsRUFBRTtnQkFDdEIsS0FBSyxtQ0FBcUIsQ0FBQyxZQUFZO29CQUN0QyxnQkFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDdkIsTUFBTTthQUNQO1NBQ0Q7UUFFRCxRQUFRLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUNwQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUMifQ==
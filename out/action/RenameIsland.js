define(["require", "exports", "entity/action/Action", "entity/action/IAction", "entity/IEntity", "../Actions"], function (require, exports, Action_1, IAction_1, IEntity_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.String)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler((action, name) => {
        if (!name || island.name === name)
            return;
        island.name = name === island.id ? undefined : name;
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVuYW1lSXNsYW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbi9SZW5hbWVJc2xhbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBS0Esa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxNQUFNLENBQUM7U0FDOUMsV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUM1QixJQUFJLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSTtZQUNoQyxPQUFPO1FBRVIsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLEtBQUssTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDckQsQ0FBQyxDQUFDLENBQUMifQ==
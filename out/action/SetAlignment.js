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
define(["require", "exports", "@wayward/game/game/deity/Deity", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "../Actions"], function (require, exports, Deity_1, IEntity_1, Action_1, IAction_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Integer32, IAction_1.ActionArgument.Integer32)
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(Actions_1.defaultCanUseHandler)
        .setHandler((action, entity, deity, value) => {
        entity?.asHuman?.alignment[deity === Deity_1.Deity.Good ? "setGood" : "setEvil"](value);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0QWxpZ25tZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbi9TZXRBbGlnbm1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7O0lBUUgsa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxTQUFTLEVBQUUsd0JBQWMsQ0FBQyxTQUFTLENBQUM7U0FDbEcsV0FBVyxDQUFDLG9CQUFVLENBQUMsS0FBSyxDQUFDO1NBQzdCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO1NBQ2xDLFNBQVMsQ0FBQyw4QkFBb0IsQ0FBQztTQUMvQixVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQVksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUNuRCxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxLQUFLLEtBQUssYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRixDQUFDLENBQUMsQ0FBQyJ9
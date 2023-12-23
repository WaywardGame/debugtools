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
define(["require", "exports", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "@wayward/game/game/entity/player/Player", "../Actions", "./helpers/Remove"], function (require, exports, IEntity_1, Action_1, IAction_1, Player_1, Actions_1, Remove_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.ANY(IAction_1.ActionArgument.Entity, IAction_1.ActionArgument.Doodad, IAction_1.ActionArgument.Corpse, IAction_1.ActionArgument.TileEvent, IAction_1.ActionArgument.Item))
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(Actions_1.defaultCanUseHandler)
        .setHandler((action, toRemove) => {
        if (toRemove instanceof Player_1.default) {
            return;
        }
        (0, Remove_1.default)(action, toRemove);
        renderers.computeSpritesInViewport(toRemove);
        action.setUpdateRender();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3ZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbi9SZW1vdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7O0lBWUgsa0JBQWUsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxHQUFHLENBQUMsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxTQUFTLEVBQUUsd0JBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMvSixXQUFXLENBQUMsb0JBQVUsQ0FBQyxLQUFLLENBQUM7U0FDN0IsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsU0FBUyxDQUFDLDhCQUFvQixDQUFDO1NBQy9CLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRTtRQUNoQyxJQUFJLFFBQVEsWUFBWSxnQkFBTSxFQUFFLENBQUM7WUFDaEMsT0FBTztRQUNSLENBQUM7UUFFRCxJQUFBLGdCQUFNLEVBQUMsTUFBTSxFQUFFLFFBQWUsQ0FBQyxDQUFDO1FBRWhDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUMifQ==
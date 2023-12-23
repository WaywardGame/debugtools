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
define(["require", "exports", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "../Actions", "../ui/InspectDialog"], function (require, exports, IEntity_1, Action_1, IAction_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setDecay = void 0;
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Item, IAction_1.ActionArgument.Float64)
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(Actions_1.defaultCanUseHandler)
        .setHandler((action, item, decay) => setDecay(action, decay, item));
    function setDecay(action, decay, ...items) {
        const canUse = action.canUse();
        if (!canUse.usable) {
            return;
        }
        let owner;
        for (const item of items) {
            owner ??= item.getCurrentOwner();
            if (item.canDecay()) {
                item.setDecayTime(Number.isInteger(decay) || decay > 1 ? decay : Math.ceil((item.startingDecay ?? 1) * decay));
                if (!item.startingDecay || item.getDecayTime() > item.startingDecay)
                    item.startingDecay = item.getDecayTime();
            }
        }
        if (owner)
            owner.updateTablesAndWeight("M");
        else
            action.setUpdateView();
        InspectDialog_1.default.INSTANCE?.update();
    }
    exports.setDecay = setDecay;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0RGVjYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL1NldERlY2F5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7SUFhSCxrQkFBZSxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLElBQUksRUFBRSx3QkFBYyxDQUFDLE9BQU8sQ0FBQztTQUNwRSxXQUFXLENBQUMsb0JBQVUsQ0FBQyxLQUFLLENBQUM7U0FDN0IsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsU0FBUyxDQUFDLDhCQUFvQixDQUFDO1NBQy9CLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXJFLFNBQWdCLFFBQVEsQ0FBQyxNQUFnQyxFQUFFLEtBQWEsRUFBRSxHQUFHLEtBQWE7UUFDekYsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDcEIsT0FBTztRQUNSLENBQUM7UUFFRCxJQUFJLEtBQXdCLENBQUM7UUFDN0IsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUMxQixLQUFLLEtBQUssSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ2pDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQy9HLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUcsR0FBRyxJQUFJLENBQUMsYUFBYTtvQkFDbkUsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDM0MsQ0FBQztRQUNGLENBQUM7UUFFRCxJQUFJLEtBQUs7WUFDUixLQUFLLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUM7O1lBRWpDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUV4Qix1QkFBYSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBdEJELDRCQXNCQyJ9
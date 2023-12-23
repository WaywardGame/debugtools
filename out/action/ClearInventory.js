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
define(["require", "exports", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "@wayward/game/game/entity/Human", "@wayward/game/game/entity/IEntity", "../Actions", "../ui/InspectDialog"], function (require, exports, Action_1, IAction_1, Human_1, IEntity_1, Actions_1, InspectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action(IAction_1.ActionArgument.Container)
        .setUsableBy(IEntity_1.EntityType.Human)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setCanUse(Actions_1.defaultCanUseHandler)
        .setHandler((action, container) => {
        action.executor.island.items.removeContainerItems(container, { removeContainedItems: true });
        const containerObject = action.executor.island?.items.resolveContainer(container);
        if (containerObject instanceof Human_1.default)
            containerObject.updateTablesAndWeight("M");
        else
            action.setUpdateView();
        InspectDialog_1.default.INSTANCE?.update();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xlYXJJbnZlbnRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9uL0NsZWFySW52ZW50b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7OztJQVlILGtCQUFlLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsU0FBUyxDQUFDO1NBQ2pELFdBQVcsQ0FBQyxvQkFBVSxDQUFDLEtBQUssQ0FBQztTQUM3QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQztTQUNsQyxTQUFTLENBQUMsOEJBQW9CLENBQUM7U0FDL0IsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFO1FBQ2pDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTdGLE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsRixJQUFJLGVBQWUsWUFBWSxlQUFLO1lBQ25DLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7WUFFM0MsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXhCLHVCQUFhLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDIn0=
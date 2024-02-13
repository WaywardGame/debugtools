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
define(["require", "exports", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/action/Action", "@wayward/game/game/entity/action/IAction", "@wayward/game/game/entity/action/argument/ActionArgumentCustom", "@wayward/game/game/magic/MagicalPropertyManager", "@wayward/game/game/magic/MagicalPropertyType", "@wayward/game/utilities/enum/Enums", "../Actions"], function (require, exports, IEntity_1, Action_1, IAction_1, ActionArgumentCustom_1, MagicalPropertyManager_1, MagicalPropertyType_1, Enums_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MagicalPropertyIdentityArgument = void 0;
    class MagicalPropertyIdentityArgument extends ActionArgumentCustom_1.ActionArgumentCustom {
        validate(executor, value) {
            if (!Array.isArray(value) || !Enums_1.default.isValid(MagicalPropertyType_1.MagicalPropertyType, value[0]))
                return false;
            if (value[1] === undefined)
                return true;
            const subTypeEnum = MagicalPropertyType_1.magicalPropertyDescriptions[value[0]]?.subTypeEnum;
            if (!subTypeEnum)
                return true;
            return Enums_1.default.isValid(subTypeEnum, value[1]);
        }
        read() {
            const hash = this.readString();
            const identity = MagicalPropertyManager_1.MagicalPropertyIdentity.unhash(hash);
            if (!identity)
                throw new Error(`Failed to resolve MagicalPropertyIdentity from: ${hash}`);
            return identity;
        }
        write(executor, value) {
            this.writeString(MagicalPropertyManager_1.MagicalPropertyIdentity.hash(...value));
        }
    }
    exports.MagicalPropertyIdentityArgument = MagicalPropertyIdentityArgument;
    var MagicalPropertyActions;
    (function (MagicalPropertyActions) {
        MagicalPropertyActions.Remove = new Action_1.Action(IAction_1.ActionArgument.ANY(IAction_1.ActionArgument.Item, IAction_1.ActionArgument.Doodad), new MagicalPropertyIdentityArgument())
            .setUsableBy(IEntity_1.EntityType.Human)
            .setUsableWhen(...Actions_1.defaultUsability)
            .setCanUse(Actions_1.defaultCanUseHandler)
            .setHandler((action, itemOrDoodad, identity) => {
            itemOrDoodad.magic?.remove(...identity);
        });
        MagicalPropertyActions.Change = new Action_1.Action(IAction_1.ActionArgument.ANY(IAction_1.ActionArgument.Item, IAction_1.ActionArgument.Doodad), new MagicalPropertyIdentityArgument(), IAction_1.ActionArgument.Float64)
            .setUsableBy(IEntity_1.EntityType.Human)
            .setUsableWhen(...Actions_1.defaultUsability)
            .setCanUse(Actions_1.defaultCanUseHandler)
            .setHandler((action, itemOrDoodad, identity, value) => {
            itemOrDoodad.asItem?.initializeMagicalPropertyManager();
            if (MagicalPropertyManager_1.MagicalPropertyIdentity.isNormalProperty(identity))
                itemOrDoodad.magic?.set(identity[0], value);
            else if (MagicalPropertyManager_1.MagicalPropertyIdentity.isSubProperty(identity))
                itemOrDoodad.magic?.set(identity[0], identity[1], value);
        });
        MagicalPropertyActions.Clear = new Action_1.Action(IAction_1.ActionArgument.ANY(IAction_1.ActionArgument.Item, IAction_1.ActionArgument.Doodad))
            .setUsableBy(IEntity_1.EntityType.Human)
            .setUsableWhen(...Actions_1.defaultUsability)
            .setCanUse(Actions_1.defaultCanUseHandler)
            .setHandler((action, itemOrDoodad) => {
            itemOrDoodad.removeMagic();
        });
    })(MagicalPropertyActions || (MagicalPropertyActions = {}));
    exports.default = MagicalPropertyActions;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFnaWNhbFByb3BlcnR5QWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vTWFnaWNhbFByb3BlcnR5QWN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7O0lBWUgsTUFBYSwrQkFBZ0MsU0FBUSwyQ0FBNkM7UUFFakYsUUFBUSxDQUFDLFFBQTRCLEVBQUUsS0FBYztZQUNwRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQUssQ0FBQyxPQUFPLENBQUMseUNBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RSxPQUFPLEtBQUssQ0FBQztZQUVkLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVM7Z0JBQ3pCLE9BQU8sSUFBSSxDQUFDO1lBRWIsTUFBTSxXQUFXLEdBQUcsaURBQTJCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBd0IsQ0FBQyxFQUFFLFdBQVcsQ0FBQztZQUM5RixJQUFJLENBQUMsV0FBVztnQkFDZixPQUFPLElBQUksQ0FBQztZQUViLE9BQU8sZUFBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUVlLElBQUk7WUFDbkIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBaUMsQ0FBQztZQUM5RCxNQUFNLFFBQVEsR0FBRyxnREFBdUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLFFBQVE7Z0JBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUM1RSxPQUFPLFFBQVEsQ0FBQztRQUNqQixDQUFDO1FBRWUsS0FBSyxDQUFDLFFBQTRCLEVBQUUsS0FBOEI7WUFDakYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnREFBdUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzFELENBQUM7S0FDRDtJQTNCRCwwRUEyQkM7SUFFRCxJQUFVLHNCQUFzQixDQThCL0I7SUE5QkQsV0FBVSxzQkFBc0I7UUFFbEIsNkJBQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLEdBQUcsQ0FBQyx3QkFBYyxDQUFDLElBQUksRUFBRSx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksK0JBQStCLEVBQUUsQ0FBQzthQUNySSxXQUFXLENBQUMsb0JBQVUsQ0FBQyxLQUFLLENBQUM7YUFDN0IsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7YUFDbEMsU0FBUyxDQUFDLDhCQUFvQixDQUFDO2FBQy9CLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUU7WUFDOUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVTLDZCQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxHQUFHLENBQUMsd0JBQWMsQ0FBQyxJQUFJLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLCtCQUErQixFQUFFLEVBQUUsd0JBQWMsQ0FBQyxPQUFPLENBQUM7YUFDN0osV0FBVyxDQUFDLG9CQUFVLENBQUMsS0FBSyxDQUFDO2FBQzdCLGFBQWEsQ0FBQyxHQUFHLDBCQUFnQixDQUFDO2FBQ2xDLFNBQVMsQ0FBQyw4QkFBb0IsQ0FBQzthQUMvQixVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNyRCxZQUFZLENBQUMsTUFBTSxFQUFFLGdDQUFnQyxFQUFFLENBQUM7WUFDeEQsSUFBSSxnREFBdUIsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7Z0JBQ3JELFlBQVksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDeEMsSUFBSSxnREFBdUIsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO2dCQUN2RCxZQUFZLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO1FBRVMsNEJBQUssR0FBRyxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLEdBQUcsQ0FBQyx3QkFBYyxDQUFDLElBQUksRUFBRSx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzdGLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLEtBQUssQ0FBQzthQUM3QixhQUFhLENBQUMsR0FBRywwQkFBZ0IsQ0FBQzthQUNsQyxTQUFTLENBQUMsOEJBQW9CLENBQUM7YUFDL0IsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxFQUFFO1lBQ3BDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztJQUVMLENBQUMsRUE5QlMsc0JBQXNCLEtBQXRCLHNCQUFzQixRQThCL0I7SUFFRCxrQkFBZSxzQkFBc0IsQ0FBQyJ9
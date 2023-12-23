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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@wayward/game/game/entity/action/IAction", "@wayward/game/mod/Mod", "./IDebugTools"], function (require, exports, IAction_1, Mod_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultCanUseHandler = exports.defaultUsability = void 0;
    exports.defaultUsability = [IAction_1.ActionUsability.Ghost, IAction_1.ActionUsability.Paused, IAction_1.ActionUsability.Delayed, IAction_1.ActionUsability.Moving];
    const defaultCanUseHandler = (action) => {
        if (!Actions.DEBUG_TOOLS.hasPermission(action.executor.asPlayer)) {
            return { usable: false };
        }
        return { usable: true };
    };
    exports.defaultCanUseHandler = defaultCanUseHandler;
    class Actions {
    }
    exports.default = Actions;
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], Actions, "DEBUG_TOOLS", void 0);
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], Actions, "LOG", void 0);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7Ozs7Ozs7SUFTVSxRQUFBLGdCQUFnQixHQUFzQixDQUFDLHlCQUFlLENBQUMsS0FBSyxFQUFFLHlCQUFlLENBQUMsTUFBTSxFQUFFLHlCQUFlLENBQUMsT0FBTyxFQUFFLHlCQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFN0ksTUFBTSxvQkFBb0IsR0FBRyxDQUFDLE1BQWdDLEVBQUUsRUFBRTtRQUN4RSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQ2xFLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUVELE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDekIsQ0FBQyxDQUFDO0lBTlcsUUFBQSxvQkFBb0Isd0JBTS9CO0lBRUYsTUFBcUIsT0FBTztLQUszQjtJQUxELDBCQUtDO0lBSHVCO1FBRHRCLGFBQUcsQ0FBQyxRQUFRLENBQWEsNEJBQWMsQ0FBQztzQ0FDTTtJQUV4QjtRQUR0QixhQUFHLENBQUMsR0FBRyxDQUFDLDRCQUFjLENBQUM7OEJBQ1EifQ==
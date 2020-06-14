var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/IAction", "mod/Mod", "./IDebugTools"], function (require, exports, IAction_1, Mod_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultUsability = void 0;
    exports.defaultUsability = [IAction_1.ActionUsability.Ghost, IAction_1.ActionUsability.Paused, IAction_1.ActionUsability.Delayed, IAction_1.ActionUsability.Moving];
    let Actions = (() => {
        class Actions {
        }
        __decorate([
            Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
        ], Actions, "DEBUG_TOOLS", void 0);
        __decorate([
            Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
        ], Actions, "LOG", void 0);
        return Actions;
    })();
    exports.default = Actions;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFPYSxRQUFBLGdCQUFnQixHQUFzQixDQUFDLHlCQUFlLENBQUMsS0FBSyxFQUFFLHlCQUFlLENBQUMsTUFBTSxFQUFFLHlCQUFlLENBQUMsT0FBTyxFQUFFLHlCQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFcEo7UUFBQSxNQUFxQixPQUFPO1NBSzNCO1FBSEE7WUFEQyxhQUFHLENBQUMsUUFBUSxDQUFhLDRCQUFjLENBQUM7MENBQ007UUFFL0M7WUFEQyxhQUFHLENBQUMsR0FBRyxDQUFDLDRCQUFjLENBQUM7a0NBQ1E7UUFDakMsY0FBQztTQUFBO3NCQUxvQixPQUFPIn0=
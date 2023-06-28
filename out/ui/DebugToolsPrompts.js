var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "mod/ModRegistry"], function (require, exports, Mod_1, ModRegistry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DebugToolsPrompts {
    }
    exports.default = DebugToolsPrompts;
    __decorate([
        Mod_1.default.instance("Debug Tools")
    ], DebugToolsPrompts.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        ModRegistry_1.default.prompt("ReplacePlayerData", (type, prompt) => prompt.confirm(type))
    ], DebugToolsPrompts.prototype, "promptReplacePlayerData", void 0);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29sc1Byb21wdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdWkvRGVidWdUb29sc1Byb21wdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBTUEsTUFBcUIsaUJBQWlCO0tBUXJDO0lBUkQsb0NBUUM7SUFMZ0I7UUFEZixhQUFHLENBQUMsUUFBUSxDQUFhLGFBQWEsQ0FBQzswREFDQTtJQUd4QjtRQURmLHFCQUFRLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBNkIsSUFBSSxDQUFDLENBQUM7c0VBQ1YifQ==
define(["require", "exports", "newui/component/Component"], function (require, exports, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DebugToolsPanelEvent;
    (function (DebugToolsPanelEvent) {
        DebugToolsPanelEvent["SwitchTo"] = "SwitchTo";
        DebugToolsPanelEvent["SwitchAway"] = "SwitchAway";
    })(DebugToolsPanelEvent = exports.DebugToolsPanelEvent || (exports.DebugToolsPanelEvent = {}));
    class DebugToolsPanel extends Component_1.default {
        constructor(gsapi) {
            super(gsapi.uiApi);
            this.gsapi = gsapi;
        }
    }
    exports.default = DebugToolsPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29sc1BhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9EZWJ1Z1Rvb2xzUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBS0EsSUFBWSxvQkFHWDtJQUhELFdBQVksb0JBQW9CO1FBQy9CLDZDQUFxQixDQUFBO1FBQ3JCLGlEQUF5QixDQUFBO0lBQzFCLENBQUMsRUFIVyxvQkFBb0IsR0FBcEIsNEJBQW9CLEtBQXBCLDRCQUFvQixRQUcvQjtJQUVELE1BQThCLGVBQWdCLFNBQVEsbUJBQVM7UUFDOUQsWUFBc0MsS0FBcUI7WUFDMUQsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQURrQixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUUzRCxDQUFDO0tBR0Q7SUFORCxrQ0FNQyJ9
define(["require", "exports", "../../IDebugTools", "../ActionHistory", "../component/DebugToolsPanel"], function (require, exports, IDebugTools_1, ActionHistory_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HistoryPanel extends DebugToolsPanel_1.default {
        constructor() {
            super();
            new ActionHistory_1.default().appendTo(this);
        }
        getTranslation() {
            return IDebugTools_1.DebugToolsTranslation.PanelHistory;
        }
    }
    exports.default = HistoryPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGlzdG9yeVBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0hpc3RvcnlQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFLQSxNQUFxQixZQUFhLFNBQVEseUJBQWU7UUFFeEQ7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksdUJBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBRWUsY0FBYztZQUM3QixPQUFPLG1DQUFxQixDQUFDLFlBQVksQ0FBQztRQUMzQyxDQUFDO0tBQ0Q7SUFWRCwrQkFVQyJ9
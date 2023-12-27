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
define(["require", "exports", "@wayward/utilities/event/EventManager", "../../IDebugTools", "../ActionHistory", "../component/DebugToolsPanel"], function (require, exports, EventManager_1, IDebugTools_1, ActionHistory_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HistoryPanel extends DebugToolsPanel_1.default {
        getTranslation() {
            return IDebugTools_1.DebugToolsTranslation.PanelHistory;
        }
        onSwitchTo() {
            this.actionHistory?.remove();
            this.actionHistory = new ActionHistory_1.default().appendTo(this);
        }
        onSwitchAway() {
            this.actionHistory?.remove();
            delete this.actionHistory;
        }
    }
    exports.default = HistoryPanel;
    __decorate([
        (0, EventManager_1.OwnEventHandler)(HistoryPanel, "switchTo")
    ], HistoryPanel.prototype, "onSwitchTo", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(HistoryPanel, "switchAway")
    ], HistoryPanel.prototype, "onSwitchAway", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGlzdG9yeVBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0hpc3RvcnlQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUFRSCxNQUFxQixZQUFhLFNBQVEseUJBQWU7UUFJeEMsY0FBYztZQUM3QixPQUFPLG1DQUFxQixDQUFDLFlBQVksQ0FBQztRQUMzQyxDQUFDO1FBR1MsVUFBVTtZQUNuQixJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSx1QkFBYSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFHUyxZQUFZO1lBQ3JCLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLENBQUM7WUFDN0IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQzNCLENBQUM7S0FDRDtJQW5CRCwrQkFtQkM7SUFWVTtRQURULElBQUEsOEJBQWUsRUFBQyxZQUFZLEVBQUUsVUFBVSxDQUFDO2tEQUl6QztJQUdTO1FBRFQsSUFBQSw4QkFBZSxFQUFDLFlBQVksRUFBRSxZQUFZLENBQUM7b0RBSTNDIn0=
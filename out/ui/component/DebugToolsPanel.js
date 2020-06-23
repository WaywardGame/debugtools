var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventManager", "newui/component/Component"], function (require, exports, EventManager_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DebugToolsPanel extends Component_1.default {
        onPanelShow() {
            this.registerEventBusSubscriber("switchAway", "remove");
        }
    }
    __decorate([
        Override
    ], DebugToolsPanel.prototype, "event", void 0);
    __decorate([
        EventManager_1.OwnEventHandler(DebugToolsPanel, "switchTo")
    ], DebugToolsPanel.prototype, "onPanelShow", null);
    exports.default = DebugToolsPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29sc1BhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2NvbXBvbmVudC9EZWJ1Z1Rvb2xzUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBV0EsTUFBOEIsZUFBZ0IsU0FBUSxtQkFBUztRQU1wRCxXQUFXO1lBQ3BCLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDekQsQ0FBQztLQUNEO0lBUlU7UUFBVCxRQUFRO2tEQUEyRDtJQUtwRTtRQURDLDhCQUFlLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQztzREFHNUM7SUFSRixrQ0FTQyJ9
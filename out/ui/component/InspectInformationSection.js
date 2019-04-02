var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/Component"], function (require, exports, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class InspectInformationSection extends Component_1.default {
        constructor() {
            super(...arguments);
            this.shouldLog = false;
        }
        get willLog() { return this.shouldLog; }
        setTab(tab) { return this; }
        setShouldLog() { this.shouldLog = true; }
        resetWillLog() { this.shouldLog = false; }
    }
    __decorate([
        Override
    ], InspectInformationSection.prototype, "event", void 0);
    exports.default = InspectInformationSection;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdEluZm9ybWF0aW9uU2VjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9jb21wb25lbnQvSW5zcGVjdEluZm9ybWF0aW9uU2VjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFlQSxNQUE4Qix5QkFBMEIsU0FBUSxtQkFBUztRQUF6RTs7WUFHUyxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBVTNCLENBQUM7UUFUQSxJQUFXLE9BQU8sS0FBSyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBRXhDLE1BQU0sQ0FBQyxHQUFXLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLFlBQVksS0FBSyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDekMsWUFBWSxLQUFLLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUtqRDtJQVpVO1FBQVQsUUFBUTs0REFBaUY7SUFEM0YsNENBYUMifQ==
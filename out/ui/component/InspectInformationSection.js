define(["require", "exports", "ui/screen/screens/game/component/TabDialogPanel"], function (require, exports, TabDialogPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class InspectInformationSection extends TabDialogPanel_1.default {
        constructor() {
            super(...arguments);
            this.shouldLog = false;
        }
        get willLog() { return this.shouldLog; }
        setTab(tab) { return this; }
        setShouldLog() { this.shouldLog = true; }
        resetWillLog() { this.shouldLog = false; }
    }
    exports.default = InspectInformationSection;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdEluZm9ybWF0aW9uU2VjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9jb21wb25lbnQvSW5zcGVjdEluZm9ybWF0aW9uU2VjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFlQSxNQUE4Qix5QkFBMEIsU0FBUSx3QkFBYztRQUE5RTs7WUFHUyxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBVTNCLENBQUM7UUFUQSxJQUFXLE9BQU8sS0FBSyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBRXhDLE1BQU0sQ0FBQyxHQUFXLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLFlBQVksS0FBSyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDekMsWUFBWSxLQUFLLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUtqRDtJQWJELDRDQWFDIn0=
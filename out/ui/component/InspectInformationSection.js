var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/Component"], function (require, exports, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let InspectInformationSection = (() => {
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
        return InspectInformationSection;
    })();
    exports.default = InspectInformationSection;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdEluZm9ybWF0aW9uU2VjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9jb21wb25lbnQvSW5zcGVjdEluZm9ybWF0aW9uU2VjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFnQkE7UUFBQSxNQUE4Qix5QkFBMEIsU0FBUSxtQkFBUztZQUF6RTs7Z0JBR1MsY0FBUyxHQUFHLEtBQUssQ0FBQztZQVUzQixDQUFDO1lBVEEsSUFBVyxPQUFPLEtBQUssT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUV4QyxNQUFNLENBQUMsR0FBVyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNwQyxZQUFZLEtBQUssSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLFlBQVksS0FBSyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FLakQ7UUFaVTtZQUFULFFBQVE7Z0VBQXFFO1FBWS9FLGdDQUFDO1NBQUE7c0JBYjZCLHlCQUF5QiJ9
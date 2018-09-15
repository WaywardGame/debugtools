define(["require", "exports", "newui/component/Component"], function (require, exports, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class InspectInformationSection extends Component_1.default {
        constructor(gsapi) {
            super(gsapi.uiApi);
            this.gsapi = gsapi;
            this.shouldLog = false;
        }
        get willLog() { return this.shouldLog; }
        setTab(tab) { return this; }
        setShouldLog() { this.shouldLog = true; }
        resetWillLog() { this.shouldLog = false; }
    }
    exports.default = InspectInformationSection;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdEluZm9ybWF0aW9uU2VjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9jb21wb25lbnQvSW5zcGVjdEluZm9ybWF0aW9uU2VjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFRQSxNQUE4Qix5QkFBMEIsU0FBUSxtQkFBUztRQUl4RSxZQUFzQyxLQUFxQjtZQUMxRCxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRGtCLFVBQUssR0FBTCxLQUFLLENBQWdCO1lBSG5ELGNBQVMsR0FBRyxLQUFLLENBQUM7UUFLMUIsQ0FBQztRQUpELElBQVcsT0FBTyxLQUFLLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFNeEMsTUFBTSxDQUFDLEdBQVcsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEMsWUFBWSxLQUFLLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN6QyxZQUFZLEtBQUssSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBS2pEO0lBZkQsNENBZUMifQ==
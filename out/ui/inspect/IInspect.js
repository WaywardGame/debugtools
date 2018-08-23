define(["require", "exports", "newui/component/Component"], function (require, exports, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class InspectInformationSection extends Component_1.default {
        setTab(tab) { return this; }
    }
    exports.InspectInformationSection = InspectInformationSection;
    class InspectEntityInformationSubsection extends Component_1.default {
        constructor(api) {
            super(api);
            this.classes.add("debug-tools-inspect-entity-sub-section");
        }
        getImmutableStats() { return []; }
    }
    exports.InspectEntityInformationSubsection = InspectEntityInformationSubsection;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSUluc3BlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9JSW5zcGVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFZQSxNQUFzQix5QkFBMEIsU0FBUSxtQkFBUztRQUd6RCxNQUFNLENBQUMsR0FBVyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztLQUMzQztJQUpELDhEQUlDO0lBRUQsTUFBc0Isa0NBQW1DLFNBQVEsbUJBQVM7UUFDekUsWUFBbUIsR0FBVTtZQUM1QixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFJTSxpQkFBaUIsS0FBYSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDakQ7SUFURCxnRkFTQyJ9
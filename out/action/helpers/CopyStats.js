define(["require", "exports", "entity/IEntity", "entity/IStats"], function (require, exports, IEntity_1, IStats_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(from, to) {
        for (const statName in from.stats) {
            const stat = IStats_1.Stat[statName];
            const statObject = from.getStat(stat);
            to.setStat(stat, statObject.value);
            const cloneStatObject = to.getStat(stat);
            if ("max" in statObject)
                to.setStatMax(stat, statObject.max);
            if ("canExceedMax" in statObject)
                cloneStatObject.canExceedMax = statObject.canExceedMax;
            if ("bonus" in statObject)
                to.setStatBonus(stat, statObject.bonus);
            if ("changeTimer" in statObject) {
                to.setStatChangeTimer(stat, statObject.changeTimer, statObject.changeAmount);
                cloneStatObject.nextChangeTimer = statObject.nextChangeTimer;
            }
        }
        for (const statusEffect of from.statuses()) {
            to.setStatus(statusEffect, true, IEntity_1.StatusEffectChangeReason.Gained);
        }
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29weVN0YXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL0NvcHlTdGF0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFNQSxtQkFBeUIsSUFBYSxFQUFFLEVBQVc7UUFDbEQsS0FBSyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2xDLE1BQU0sSUFBSSxHQUFHLGFBQUksQ0FBQyxRQUE2QixDQUFDLENBQUM7WUFDakQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsQ0FBQztZQUN2QyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkMsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsQ0FBQztZQUMxQyxJQUFJLEtBQUssSUFBSSxVQUFVO2dCQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxHQUFJLENBQUMsQ0FBQztZQUM5RCxJQUFJLGNBQWMsSUFBSSxVQUFVO2dCQUFFLGVBQWUsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQztZQUN6RixJQUFJLE9BQU8sSUFBSSxVQUFVO2dCQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxLQUFNLENBQUMsQ0FBQztZQUNwRSxJQUFJLGFBQWEsSUFBSSxVQUFVLEVBQUU7Z0JBQ2hDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLFdBQVksRUFBRSxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzdFLGVBQXVCLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQyxlQUFnQixDQUFDO2FBQ3ZFO1NBQ0Q7UUFFRCxLQUFLLE1BQU0sWUFBWSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUMzQyxFQUFFLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsa0NBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbEU7SUFDRixDQUFDO0lBbEJELDRCQWtCQyJ9
define(["require", "exports", "entity/IEntity", "entity/IStats"], function (require, exports, IEntity_1, IStats_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(from, to) {
        for (const statName in from.stats) {
            const stat = IStats_1.Stat[statName];
            const statObject = from.stat.get(stat);
            to.stat.set(stat, statObject.value);
            const cloneStatObject = to.stat.get(stat);
            if ("max" in statObject)
                to.stat.setMax(stat, statObject.max);
            if ("canExceedMax" in statObject)
                cloneStatObject.canExceedMax = statObject.canExceedMax;
            if ("bonus" in statObject)
                to.stat.setBonus(stat, statObject.bonus);
            if ("changeTimer" in statObject) {
                to.stat.setChangeTimer(stat, statObject.changeTimer, statObject.changeAmount);
                cloneStatObject.nextChangeTimer = statObject.nextChangeTimer;
            }
        }
        for (const statusEffect of from.statuses()) {
            to.setStatus(statusEffect, true, IEntity_1.StatusEffectChangeReason.Gained);
        }
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29weVN0YXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL0NvcHlTdGF0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFPQSxtQkFBeUIsSUFBWSxFQUFFLEVBQVU7UUFDaEQsS0FBSyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2xDLE1BQU0sSUFBSSxHQUFHLGFBQUksQ0FBQyxRQUE2QixDQUFDLENBQUM7WUFDakQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFFLENBQUM7WUFDeEMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUUsQ0FBQztZQUMzQyxJQUFJLEtBQUssSUFBSSxVQUFVO2dCQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsR0FBSSxDQUFDLENBQUM7WUFDL0QsSUFBSSxjQUFjLElBQUksVUFBVTtnQkFBRSxlQUFlLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUM7WUFDekYsSUFBSSxPQUFPLElBQUksVUFBVTtnQkFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQyxDQUFDO1lBQ3JFLElBQUksYUFBYSxJQUFJLFVBQVUsRUFBRTtnQkFDaEMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxXQUFZLEVBQUUsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUM5RSxlQUF1QixDQUFDLGVBQWUsR0FBRyxVQUFVLENBQUMsZUFBZ0IsQ0FBQzthQUN2RTtTQUNEO1FBRUQsS0FBSyxNQUFNLFlBQVksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDM0MsRUFBRSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLGtDQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2xFO0lBQ0YsQ0FBQztJQWxCRCw0QkFrQkMifQ==
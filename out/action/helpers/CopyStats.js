define(["require", "exports", "entity/IBaseEntity", "entity/IStats"], function (require, exports, IBaseEntity_1, IStats_1) {
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
            to.setStatus(statusEffect, true, IBaseEntity_1.StatusEffectChangeReason.Gained);
        }
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29weVN0YXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL0NvcHlTdGF0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFNQSxtQkFBeUIsSUFBaUIsRUFBRSxFQUFlO1FBQzFELEtBQUssTUFBTSxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNsQyxNQUFNLElBQUksR0FBRyxhQUFJLENBQUMsUUFBNkIsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLENBQUM7WUFDdkMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25DLE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLENBQUM7WUFDMUMsSUFBSSxLQUFLLElBQUksVUFBVTtnQkFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsR0FBSSxDQUFDLENBQUM7WUFDOUQsSUFBSSxjQUFjLElBQUksVUFBVTtnQkFBRSxlQUFlLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUM7WUFDekYsSUFBSSxPQUFPLElBQUksVUFBVTtnQkFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBTSxDQUFDLENBQUM7WUFDcEUsSUFBSSxhQUFhLElBQUksVUFBVSxFQUFFO2dCQUNoQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxXQUFZLEVBQUUsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUM3RSxlQUF1QixDQUFDLGVBQWUsR0FBRyxVQUFVLENBQUMsZUFBZ0IsQ0FBQzthQUN2RTtTQUNEO1FBRUQsS0FBSyxNQUFNLFlBQVksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDM0MsRUFBRSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLHNDQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2xFO0lBQ0YsQ0FBQztJQWxCRCw0QkFrQkMifQ==
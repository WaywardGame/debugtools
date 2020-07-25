define(["require", "exports", "entity/IEntity", "entity/IStats"], function (require, exports, IEntity_1, IStats_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(from, to) {
        for (const statName of Object.keys(from.stats)) {
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
                to.stat.setChangeTimer(stat, statObject.changeTimer, t => t.setAmount(statObject.changeAmount));
                cloneStatObject.nextChangeTimer = statObject.nextChangeTimer;
            }
        }
        for (const statusEffect of from.getStatuses()) {
            to.setStatus(statusEffect.type, true, IEntity_1.StatusEffectChangeReason.Gained);
        }
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29weVN0YXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL0NvcHlTdGF0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFPQSxtQkFBeUIsSUFBWSxFQUFFLEVBQVU7UUFDaEQsS0FBSyxNQUFNLFFBQVEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMvQyxNQUFNLElBQUksR0FBRyxhQUFJLENBQUMsUUFBNkIsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBRSxDQUFDO1lBQ3hDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEMsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFFLENBQUM7WUFDM0MsSUFBSSxLQUFLLElBQUksVUFBVTtnQkFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEdBQUksQ0FBQyxDQUFDO1lBQy9ELElBQUksY0FBYyxJQUFJLFVBQVU7Z0JBQUUsZUFBZSxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDO1lBQ3pGLElBQUksT0FBTyxJQUFJLFVBQVU7Z0JBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxLQUFNLENBQUMsQ0FBQztZQUNyRSxJQUFJLGFBQWEsSUFBSSxVQUFVLEVBQUU7Z0JBQ2hDLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsV0FBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDaEcsZUFBdUIsQ0FBQyxlQUFlLEdBQUcsVUFBVSxDQUFDLGVBQWdCLENBQUM7YUFDdkU7U0FDRDtRQUVELEtBQUssTUFBTSxZQUFZLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQzlDLEVBQUUsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsa0NBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkU7SUFDRixDQUFDO0lBbEJELDRCQWtCQyJ9
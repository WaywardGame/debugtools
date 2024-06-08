/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
define(["require", "exports", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/IStats"], function (require, exports, IEntity_1, IStats_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29weVN0YXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL0NvcHlTdGF0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7SUFTSCw0QkFrQkM7SUFsQkQsbUJBQXlCLElBQXFCLEVBQUUsRUFBbUI7UUFDbEUsS0FBSyxNQUFNLFFBQVEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ2hELE1BQU0sSUFBSSxHQUFHLGFBQUksQ0FBQyxRQUE2QixDQUFDLENBQUM7WUFDakQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFFLENBQUM7WUFDeEMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUUsQ0FBQztZQUMzQyxJQUFJLEtBQUssSUFBSSxVQUFVO2dCQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsR0FBSSxDQUFDLENBQUM7WUFDL0QsSUFBSSxjQUFjLElBQUksVUFBVTtnQkFBRSxlQUFlLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUM7WUFDekYsSUFBSSxPQUFPLElBQUksVUFBVTtnQkFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQyxDQUFDO1lBQ3JFLElBQUksYUFBYSxJQUFJLFVBQVUsRUFBRSxDQUFDO2dCQUNqQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLFdBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ2hHLGVBQXVCLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQyxlQUFnQixDQUFDO1lBQ3hFLENBQUM7UUFDRixDQUFDO1FBRUQsS0FBSyxNQUFNLFlBQVksSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztZQUMvQyxFQUFFLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLGtDQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hFLENBQUM7SUFDRixDQUFDIn0=
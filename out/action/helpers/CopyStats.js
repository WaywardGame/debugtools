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
define(["require", "exports", "game/entity/IEntity", "game/entity/IStats"], function (require, exports, IEntity_1, IStats_1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29weVN0YXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FjdGlvbi9oZWxwZXJzL0NvcHlTdGF0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7SUFTSCxtQkFBeUIsSUFBcUIsRUFBRSxFQUFtQjtRQUNsRSxLQUFLLE1BQU0sUUFBUSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQy9DLE1BQU0sSUFBSSxHQUFHLGFBQUksQ0FBQyxRQUE2QixDQUFDLENBQUM7WUFDakQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFFLENBQUM7WUFDeEMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUUsQ0FBQztZQUMzQyxJQUFJLEtBQUssSUFBSSxVQUFVO2dCQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsR0FBSSxDQUFDLENBQUM7WUFDL0QsSUFBSSxjQUFjLElBQUksVUFBVTtnQkFBRSxlQUFlLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUM7WUFDekYsSUFBSSxPQUFPLElBQUksVUFBVTtnQkFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQyxDQUFDO1lBQ3JFLElBQUksYUFBYSxJQUFJLFVBQVUsRUFBRTtnQkFDaEMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxXQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNoRyxlQUF1QixDQUFDLGVBQWUsR0FBRyxVQUFVLENBQUMsZUFBZ0IsQ0FBQzthQUN2RTtTQUNEO1FBRUQsS0FBSyxNQUFNLFlBQVksSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDOUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxrQ0FBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN2RTtJQUNGLENBQUM7SUFsQkQsNEJBa0JDIn0=
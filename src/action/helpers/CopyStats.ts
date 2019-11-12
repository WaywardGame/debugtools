import Entity from "entity/Entity";
import { StatusEffectChangeReason } from "entity/IEntity";
import { Stat } from "entity/IStats";

/**
 * Copies stats and status effects from one entity to another.
 */
export default function (from: Entity, to: Entity) {
	for (const statName in from.stats) {
		const stat = Stat[statName as keyof typeof Stat];
		const statObject = from.stat.get(stat)!;
		to.stat.set(stat, statObject.value);
		const cloneStatObject = to.stat.get(stat)!;
		if ("max" in statObject) to.stat.setMax(stat, statObject.max!);
		if ("canExceedMax" in statObject) cloneStatObject.canExceedMax = statObject.canExceedMax;
		if ("bonus" in statObject) to.stat.setBonus(stat, statObject.bonus!);
		if ("changeTimer" in statObject) {
			to.stat.setChangeTimer(stat, statObject.changeTimer!, statObject.changeAmount);
			(cloneStatObject as any).nextChangeTimer = statObject.nextChangeTimer!;
		}
	}

	for (const statusEffect of from.statuses()) {
		to.setStatus(statusEffect, true, StatusEffectChangeReason.Gained);
	}
}

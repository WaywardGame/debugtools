import IBaseEntity, { StatusEffectChangeReason } from "entity/IBaseEntity";
import { Stat } from "entity/IStats";

/**
 * Copies stats and status effects from one entity to another.
 */
export default function (from: IBaseEntity, to: IBaseEntity) {
	for (const statName in from.stats) {
		const stat = Stat[statName as keyof typeof Stat];
		const statObject = from.getStat(stat)!;
		to.setStat(stat, statObject.value);
		const cloneStatObject = to.getStat(stat)!;
		if ("max" in statObject) to.setStatMax(stat, statObject.max!);
		if ("canExceedMax" in statObject) cloneStatObject.canExceedMax = statObject.canExceedMax;
		if ("bonus" in statObject) to.setStatBonus(stat, statObject.bonus!);
		if ("changeTimer" in statObject) {
			to.setStatChangeTimer(stat, statObject.changeTimer!, statObject.changeAmount);
			(cloneStatObject as any).nextChangeTimer = statObject.nextChangeTimer!;
		}
	}

	for (const statusEffect of from.statuses()) {
		to.setStatus(statusEffect, true, StatusEffectChangeReason.Gained);
	}
}

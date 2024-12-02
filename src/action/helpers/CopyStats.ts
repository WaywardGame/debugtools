import type EntityWithStats from "@wayward/game/game/entity/EntityWithStats";
import { StatusChangeReason } from "@wayward/game/game/entity/IEntity";
import { Stat } from "@wayward/game/game/entity/IStats";

/**
 * Copies stats and status effects from one entity to another.
 */
export default function (from: EntityWithStats, to: EntityWithStats): void {
	for (const statName of Object.keys(from.stats)) {
		const stat = Stat[statName as keyof typeof Stat];
		const statObject = from.stat.get(stat)!;
		to.stat.set(stat, statObject.value);
		const cloneStatObject = to.stat.get(stat)!;
		if ("max" in statObject) {
			to.stat.setMax(stat, statObject.max!);
		}

		if ("canExceedMax" in statObject) {
			cloneStatObject.canExceedMax = statObject.canExceedMax;
		}

		if ("bonus" in statObject) {
			to.stat.setBonus(stat, statObject.bonus!);
		}

		if ("changeTimer" in statObject) {
			to.stat.setChangeTimer(stat, statObject.changeTimer!, t => t.setAmount(statObject.changeAmount));
			(cloneStatObject as any).nextChangeTimer = statObject.nextChangeTimer!;
		}
	}

	for (const status of from.getStatuses()) {
		to.setStatus(status.type, true, StatusChangeReason.Gained);
	}
}

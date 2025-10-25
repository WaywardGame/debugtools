import { StatusChangeReason } from "@wayward/game/game/entity/IEntity";
import { StatusType } from "@wayward/game/game/entity/status/IStatus";
import type Island from "@wayward/game/game/island/Island";

namespace CurseHelpers {
	export function updateStatuses(island: Island): void {
		for (const human of island.getPlayers(true)) {
			const status = human.getStatus(StatusType.Cursed);
			status?.refresh();
			const level = status?.description?.getLevel?.(status, 0) ?? 0;

			human.event.emit("statusChange", StatusType.Cursed, level, StatusChangeReason.Gained, level);
		}
	}
}

export default CurseHelpers;

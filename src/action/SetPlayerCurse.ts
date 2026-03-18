import { CURSE_CAP, CumulativeEvilCrafting, CumulativeKilling, Obliviousness, Sleeplessness } from "@wayward/game/game/curse/Curse";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import DataComponent, { DataComponentType } from "@wayward/game/game/entity/data/DataComponent";
import Objects from "@wayward/utilities/object/Objects";
import { defaultCanUseHandler } from "../Actions";

export enum PlayerCurseValueType {
	InitialCurseModifier,
	CumulativeEvilCrafting,
	CumulativeKilling,
	Sleeplessness,
	HighestAttack,
	HighestDefense,
	ObliviousnessDays,
	ObliviousnessThisNightInvalidated,
}

const HighestAttack = DataComponent<number>(DataComponentType.CurseHighestAttack);
const HighestDefense = DataComponent<number>(DataComponentType.CurseHighestDefense);

export default new Action(ActionArgument.Player, ActionArgument.ENUM(PlayerCurseValueType), ActionArgument.Object)
	.setUsableBy(EntityType.Human)
	.setUsableWhen(ActionUsability.Always)
	.setCanUse((action, _player, type: PlayerCurseValueType) => {
		const usable = defaultCanUseHandler(action).usable && (type !== PlayerCurseValueType.InitialCurseModifier || action.executor.isHost);
		return { usable };
	})
	.setHandler((action, player, type: PlayerCurseValueType, value) => {
		switch (type) {
			case PlayerCurseValueType.InitialCurseModifier: {
				if (typeof value !== "number") {
					return;
				}

				const gameOptions = Objects.deepClone(game.getGameOptions());
				gameOptions.player.initialCurse = value / CURSE_CAP * 100;
				game.updateGameOptions(gameOptions);

				for (const gamePlayer of game.playerManager.getAll(true, true)) {
					gamePlayer.updateCurseRate();
				}

				return;
			}

			case PlayerCurseValueType.CumulativeEvilCrafting:
				if (typeof value === "number") {
					CumulativeEvilCrafting.set(player, value);
				}

				break;

			case PlayerCurseValueType.CumulativeKilling:
				if (typeof value === "number") {
					CumulativeKilling.set(player, value);
				}

				break;

			case PlayerCurseValueType.Sleeplessness:
				if (typeof value === "number") {
					Sleeplessness.set(player, value);
				}

				break;

			case PlayerCurseValueType.HighestAttack:
				if (typeof value === "number") {
					HighestAttack.set(player, value);
				}

				break;

			case PlayerCurseValueType.HighestDefense:
				if (typeof value === "number") {
					HighestDefense.set(player, value);
				}

				break;

			case PlayerCurseValueType.ObliviousnessDays:
				if (typeof value === "number") {
					Obliviousness.set(player, { ...Obliviousness.get(player), days: value });
				}

				break;

			case PlayerCurseValueType.ObliviousnessThisNightInvalidated:
				if (typeof value === "boolean") {
					Obliviousness.set(player, { ...Obliviousness.get(player), thisNightInvalidated: value });
				}

				break;
		}

		player.updateCurseRate();
	})
	.modRegistration("SetPlayerCurse");

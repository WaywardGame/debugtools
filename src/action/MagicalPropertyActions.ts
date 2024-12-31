import type Entity from "@wayward/game/game/entity/Entity";
import { EntityType } from "@wayward/game/game/entity/IEntity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument, ActionUsability } from "@wayward/game/game/entity/action/IAction";
import { ActionArgumentCustom } from "@wayward/game/game/entity/action/argument/ActionArgumentCustom";
import MagicalPropertyType, { magicalPropertyDescriptions } from "@wayward/game/game/magic/MagicalPropertyType";
import Enums from "@wayward/game/utilities/enum/Enums";
import { defaultCanUseHandler } from "../Actions";
import type { MagicalPropertyIdentityHash } from "@wayward/game/game/magic/IMagicalProperty";
import { MagicalPropertyIdentity } from "@wayward/game/game/magic/IMagicalProperty";

export class MagicalPropertyIdentityArgument extends ActionArgumentCustom<MagicalPropertyIdentity> {

	public override validate(executor: Entity | undefined, value: unknown): value is MagicalPropertyIdentity {
		if (!Array.isArray(value) || !Enums.isValid(MagicalPropertyType, value[0])) {
			return false;
		}

		if (value[1] === undefined) {
			return true;
		}

		const subTypeEnum = magicalPropertyDescriptions[value[0] as MagicalPropertyType]?.subTypeEnum;
		if (!subTypeEnum) {
			return true;
		}

		return Enums.isValid(subTypeEnum, value[1]);
	}

	public override read(): MagicalPropertyIdentity {
		const hash = this.readString() as MagicalPropertyIdentityHash;
		const identity = MagicalPropertyIdentity.unhash(hash);
		if (!identity) {
			throw new Error(`Failed to resolve MagicalPropertyIdentity from: ${hash}`);
		}

		return identity;
	}

	public override write(executor: Entity | undefined, value: MagicalPropertyIdentity): void {
		this.writeString(MagicalPropertyIdentity.hash(...value));
	}
}

namespace MagicalPropertyActions {

	export const Remove = new Action(ActionArgument.ANY(ActionArgument.Item, ActionArgument.Doodad), new MagicalPropertyIdentityArgument())
		.setUsableBy(EntityType.Human)
		.setUsableWhen(ActionUsability.Always)
		.setCanUse(defaultCanUseHandler)
		.setHandler((action, itemOrDoodad, identity) => {
			itemOrDoodad.magic?.remove(...identity);
		});

	export const Change = new Action(ActionArgument.ANY(ActionArgument.Item, ActionArgument.Doodad), new MagicalPropertyIdentityArgument(), ActionArgument.Float64)
		.setUsableBy(EntityType.Human)
		.setUsableWhen(ActionUsability.Always)
		.setCanUse(defaultCanUseHandler)
		.setHandler((action, itemOrDoodad, identity, value) => {
			itemOrDoodad.asItem?.initializeMagicalPropertyManager();
			if (MagicalPropertyIdentity.isNormalProperty(identity)) {
				itemOrDoodad.magic?.set(identity[0], value);
			} else if (MagicalPropertyIdentity.isSubProperty(identity)) {
				itemOrDoodad.magic?.set(identity[0], identity[1], value);
			}
		});

	export const Clear = new Action(ActionArgument.ANY(ActionArgument.Item, ActionArgument.Doodad))
		.setUsableBy(EntityType.Human)
		.setUsableWhen(ActionUsability.Always)
		.setCanUse(defaultCanUseHandler)
		.setHandler((action, itemOrDoodad) => {
			itemOrDoodad.removeMagic();
		});

}

export default MagicalPropertyActions;

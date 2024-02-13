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
import Entity from "@wayward/game/game/entity/Entity";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
import { ActionArgumentCustom } from "@wayward/game/game/entity/action/argument/ActionArgumentCustom";
import { MagicalPropertyIdentity } from "@wayward/game/game/magic/MagicalPropertyManager";
export declare class MagicalPropertyIdentityArgument extends ActionArgumentCustom<MagicalPropertyIdentity> {
    validate(executor: Entity | undefined, value: unknown): value is MagicalPropertyIdentity;
    read(): MagicalPropertyIdentity;
    write(executor: Entity | undefined, value: MagicalPropertyIdentity): void;
}
declare namespace MagicalPropertyActions {
    const Remove: Action<[[ActionArgument.Item, ActionArgument.Doodad], MagicalPropertyIdentityArgument], import("@wayward/game/game/entity/Human").default<number, import("@wayward/game/game/reference/IReferenceManager").ReferenceType.NPC | import("@wayward/game/game/reference/IReferenceManager").ReferenceType.Player>, void, import("@wayward/game/game/entity/action/IAction").IActionUsable, [import("@wayward/game/game/doodad/Doodad").default | import("@wayward/game/game/item/Item").default, MagicalPropertyIdentity]>;
    const Change: Action<[[ActionArgument.Item, ActionArgument.Doodad], MagicalPropertyIdentityArgument, ActionArgument.Float64], import("@wayward/game/game/entity/Human").default<number, import("@wayward/game/game/reference/IReferenceManager").ReferenceType.NPC | import("@wayward/game/game/reference/IReferenceManager").ReferenceType.Player>, void, import("@wayward/game/game/entity/action/IAction").IActionUsable, [import("@wayward/game/game/doodad/Doodad").default | import("@wayward/game/game/item/Item").default, MagicalPropertyIdentity, number]>;
    const Clear: Action<[[ActionArgument.Item, ActionArgument.Doodad]], import("@wayward/game/game/entity/Human").default<number, import("@wayward/game/game/reference/IReferenceManager").ReferenceType.NPC | import("@wayward/game/game/reference/IReferenceManager").ReferenceType.Player>, void, import("@wayward/game/game/entity/action/IAction").IActionUsable, [import("@wayward/game/game/doodad/Doodad").default | import("@wayward/game/game/item/Item").default]>;
}
export default MagicalPropertyActions;

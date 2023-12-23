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
import { TickFlag } from "@wayward/game/game/IGame";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
declare const _default: Action<[ActionArgument.Integer32, [ActionArgument.Undefined, import("@wayward/game/game/entity/action/argument/ActionArgumentEnum").default<TickFlag, "None" | "All" | "Timers" | "WaterContamination" | "TileEvents" | "Corpses" | "Doodads" | "Creatures" | "NPCs" | "RandomEvents" | "StatusEffects" | "FlowFields" | "PlayerNotes" | "Items" | "IslandFastForward">]], import("@wayward/game/game/entity/player/Player").default, void, import("@wayward/game/game/entity/action/IAction").IActionUsable, [number, (TickFlag | undefined)?]>;
export default _default;

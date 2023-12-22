import { TickFlag } from "@wayward/game/game/IGame";
import { Action } from "@wayward/game/game/entity/action/Action";
import { ActionArgument } from "@wayward/game/game/entity/action/IAction";
declare const _default: Action<[ActionArgument.Integer32, [ActionArgument.Undefined, import("@wayward/game/game/entity/action/argument/ActionArgumentEnum").default<TickFlag, "None" | "All" | "Timers" | "WaterContamination" | "TileEvents" | "Corpses" | "Doodads" | "Creatures" | "NPCs" | "RandomEvents" | "StatusEffects" | "FlowFields" | "PlayerNotes" | "Items" | "IslandFastForward">]], import("@wayward/game/game/entity/player/Player").default, void, import("@wayward/game/game/entity/action/IAction").IActionUsable, [number, (TickFlag | undefined)?]>;
export default _default;

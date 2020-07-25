/*!
 * Copyright Unlok, Vaughn Royko 2011-2020
 * http://www.unlok.ca
 *
 * Credits & Thanks:
 * http://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { EventHandler } from "event/EventManager";
import { basicInspectionPriorities, InspectType } from "game/inspection/IInspection";
import { Context } from "game/inspection/InfoProvider";
import Inspection from "game/inspection/Inspection";
import { TempType } from "game/temperature/TemperatureManager";
import Mod from "mod/Mod";
import World from "renderer/World";
import { IVector3 } from "utilities/math/IVector";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";

export default class TemperatureInspection extends Inspection<IVector3> {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public static readonly DEBUG_TOOLS: DebugTools;

	public static getFromTile(position: IVector3) {
		return new TemperatureInspection(position);
	}

	public constructor(tile: IVector3) {
		super(TemperatureInspection.DEBUG_TOOLS.inspectionTemperature, tile);
	}

	@Override public getId() {
		return this.createIdFromVector3(this.value);
	}

	@Override public getPriority() {
		return basicInspectionPriorities[InspectType.Tile] + 100;
	}

	// @Override public getBorder() {
	// 	return quality && `var(--item-quality-${quality})`;
	// }

	////////////////////////////////////
	// Content
	//

	@Override public get(context: Context) {
		return [
			translation(DebugToolsTranslation.InspectionTemperatureCalculated)
				.addArgs(this.getTemperature(TempType.Heat, "calculated") - this.getTemperature(TempType.Cold, "calculated")),
			translation(DebugToolsTranslation.InspectionTemperatureCalculatedHeat)
				.addArgs(this.getTemperature(TempType.Heat, "calculated")),
			translation(DebugToolsTranslation.InspectionTemperatureCalculatedCold)
				.addArgs(this.getTemperature(TempType.Cold, "calculated")),
			translation(DebugToolsTranslation.InspectionTemperatureProducedHeat)
				.addArgs(this.getTemperature(TempType.Heat, "produced")),
			translation(DebugToolsTranslation.InspectionTemperatureProducedCold)
				.addArgs(this.getTemperature(TempType.Cold, "produced")),
		];
	}

	////////////////////////////////////
	// Event Handlers
	//

	@EventHandler(World, "updateTile")
	public onUpdateTile(_: any, x: number, y: number, z: number) {
		if (x === this.value.x && y === this.value.y && z === this.value.z) {
			this.refresh();
		}
	}

	////////////////////////////////////
	// Internals
	//

	private getTemperature(tempType: TempType, calcOrProduce: "calculated" | "produced") {
		return island.temperature?.[calcOrProduce === "calculated" ? "getCachedCalculated" : "getCachedProduced"]
			(this.value.x, this.value.y, this.value.z, tempType) ?? -1;
	}
}

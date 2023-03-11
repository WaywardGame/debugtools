import { EventBus } from "event/EventBuses";
import { EventHandler } from "event/EventManager";
import { InfoDisplayLevel } from "game/inspection/IInfoProvider";
import { basicInspectionPriorities, InspectType } from "game/inspection/IInspection";
import { InfoProvider } from "game/inspection/InfoProvider";
import { InfoProviderContext } from "game/inspection/InfoProviderContext";
import Inspection from "game/inspection/Inspection";
import { TempType } from "game/temperature/ITemperature";
import { TEMPERATURE_INVALID } from "game/temperature/TemperatureManager";
import { MiscTranslation } from "language/dictionary/Misc";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import { Paragraph } from "ui/component/Text";
import { IVector3 } from "utilities/math/IVector";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";

export default class TemperatureInspection extends Inspection<IVector3> {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public static readonly DEBUG_TOOLS: DebugTools;

	public static getFromTile(position: IVector3) {
		return TemperatureInspection.DEBUG_TOOLS ? new TemperatureInspection(position) : [];
	}

	public constructor(tile: IVector3) {
		super(TemperatureInspection.DEBUG_TOOLS.inspectionTemperature, tile);
	}

	public override getId() {
		return this.createIdFromVector3(this.value);
	}

	public override getPriority() {
		return basicInspectionPriorities[InspectType.Tile] + 100;
	}

	////////////////////////////////////
	// Content
	//

	public override hasContent() {
		return game.playing && this.getTileMod() !== "?";
	}

	public override get(context: InfoProviderContext) {
		const tempValue = localIsland.temperature.get(localIsland.getTileFromPoint(this.value), undefined);
		return [
			InfoProvider.create()
				.setDisplayLevel(InfoDisplayLevel.NonExtra)
				.add(translation(DebugToolsTranslation.InspectionTemperature)
					.addArgs(tempValue)),
			InfoProvider.title()
				.setDisplayLevel(InfoDisplayLevel.Extra)
				.add(translation(DebugToolsTranslation.InspectionTemperature)
					.addArgs(tempValue)),
			InfoProvider.create()
				.setDisplayLevel(InfoDisplayLevel.Extra)
				.setComponent(Paragraph)
				.setChildComponent(Paragraph)
				.add(translation(DebugToolsTranslation.InspectionTemperatureBiome)
					.addArgs(localIsland.temperature.getBase()))
				// the following bit is only used for if biomes themselves have time modifiers,
				// but so far we only use layer-specific time modifiers so it's not very useful hence hidden!
				// .add(translation(DebugToolsTranslation.InspectionTemperatureTimeModifier)
				// 	.addArgs(Translation.difference(island.temperature.getTime())))
				.add(translation(DebugToolsTranslation.InspectionTemperatureLayerModifier)
					.addArgs(Translation.misc(MiscTranslation.Difference)
						.addArgs(localIsland.temperature.getLayer(this.value.z)))),
			InfoProvider.create()
				.setDisplayLevel(InfoDisplayLevel.Extra)
				.setComponent(Paragraph)
				.setChildComponent(Paragraph)
				.add(translation(DebugToolsTranslation.InspectionTemperatureTileCalculated)
					.addArgs(this.getTileMod())),
			InfoProvider.create()
				.setDisplayLevel(InfoDisplayLevel.Verbose)
				.setComponent(Paragraph)
				.setChildComponent(Paragraph)
				.add(translation(DebugToolsTranslation.InspectionTemperatureTileCalculatedHeat)
					.addArgs(this.getTemperature(TempType.Heat, "calculated")))
				.add(translation(DebugToolsTranslation.InspectionTemperatureTileCalculatedCold)
					.addArgs(this.getTemperature(TempType.Cold, "calculated")))
				.add(translation(DebugToolsTranslation.InspectionTemperatureTileProducedHeat)
					.addArgs(this.getTemperature(TempType.Heat, "produced")))
				.add(translation(DebugToolsTranslation.InspectionTemperatureTileProducedCold)
					.addArgs(this.getTemperature(TempType.Cold, "produced"))),
		];
	}

	////////////////////////////////////
	// Event Handlers
	//

	// @EventHandler(World, "updateTile")
	// public onUpdateTile(_: any, x: number, y: number, z: number) {
	// 	if (x === this.value.x && y === this.value.y && z === this.value.z) {
	// 		this.refresh();
	// 	}
	// }

	@EventHandler(EventBus.Game, "tickEnd")
	public onTickEnd() {
		// todo: only refresh when changes occur?
		if (localPlayer.isResting()) {
			return;
		}

		this.refresh();
	}

	////////////////////////////////////
	// Internals
	//

	private getTemperature(tempType: TempType, calcOrProduce: "calculated" | "produced") {
		const temp = localIsland.temperature?.[calcOrProduce === "calculated" ? "getCachedCalculated" : "getCachedProduced"](this.value, tempType);
		return temp === TEMPERATURE_INVALID || temp === undefined ? "?" : temp;
	}

	private getTileMod() {
		const heat = this.getTemperature(TempType.Heat, "calculated");
		const cold = this.getTemperature(TempType.Cold, "calculated");
		if (heat === "?" || cold === "?") return "?";
		return Translation.misc(MiscTranslation.Difference)
			.addArgs(heat - cold);
	}
}

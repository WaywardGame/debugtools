import { EventBus } from "event/EventBuses";
import { EventHandler } from "event/EventManager";
import { InfoClass, InfoDisplayLevel } from "game/inspection/IInfoProvider";
import { InspectType, basicInspectionPriorities } from "game/inspection/IInspection";
import { InfoProviderContext } from "game/inspection/InfoProviderContext";
import Inspection from "game/inspection/Inspection";
import LabelledValue from "game/inspection/infoProviders/LabelledValue";
import MagicalPropertyValue from "game/inspection/infoProviders/MagicalPropertyValue";
import { TempType } from "game/temperature/ITemperature";
import { TEMPERATURE_INVALID } from "game/temperature/TemperatureManager";
import Translation from "language/Translation";
import { MiscTranslation } from "language/dictionary/Misc";
import Mod from "mod/Mod";
import { Heading, Paragraph } from "ui/component/Text";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import Tile from "game/tile/Tile";

export default class TemperatureInspection extends Inspection<Tile> {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public static readonly DEBUG_TOOLS: DebugTools;

	public static getFromTile(tile: Tile) {
		return TemperatureInspection.DEBUG_TOOLS ? new TemperatureInspection(tile) : [];
	}

	public constructor(tile: Tile) {
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
		const tempValue = localIsland.temperature.get(this.value, undefined);
		return [
			LabelledValue.label(translation(DebugToolsTranslation.InspectionTemperature))
				.add(new MagicalPropertyValue(tempValue))
				.setDisplayLevel(InfoDisplayLevel.NonExtra)
				.setComponent(Paragraph),
			LabelledValue.label(translation(DebugToolsTranslation.InspectionTemperature))
				.add(new MagicalPropertyValue(tempValue))
				.setDisplayLevel(InfoDisplayLevel.Extra)
				.addClasses(InfoClass.Title)
				.setComponent(Heading),
			LabelledValue.label(translation(DebugToolsTranslation.InspectionTemperatureBiome))
				.add(new MagicalPropertyValue(localIsland.temperature.getBiomeBase()))
				.setDisplayLevel(InfoDisplayLevel.Extra)
				.setComponent(Paragraph),
			LabelledValue.label(translation(DebugToolsTranslation.InspectionTemperatureBiomeTimeModifier))
				.add(new MagicalPropertyValue(localIsland.temperature.getBiomeTimeModifier()))
				.setDisplayLevel(InfoDisplayLevel.Extra)
				.setComponent(Paragraph),
			LabelledValue.label(translation(DebugToolsTranslation.InspectionTemperatureLayerModifier))
				.add(new MagicalPropertyValue(localIsland.temperature.getLayerBase(this.value.z)))
				.setDisplayLevel(InfoDisplayLevel.Extra)
				.setComponent(Paragraph),
			LabelledValue.label(translation(DebugToolsTranslation.InspectionTemperatureLayerTimeModifier))
				.add(new MagicalPropertyValue(localIsland.temperature.getLayerTimeModifier(this.value.z)))
				.setDisplayLevel(InfoDisplayLevel.Extra)
				.setComponent(Paragraph),
			LabelledValue.label(translation(DebugToolsTranslation.InspectionTemperatureTileCalculated))
				.add(Translation.colorizeImportance("primary")
					.addArgs(this.getTileMod()))
				.setDisplayLevel(InfoDisplayLevel.Extra)
				.setComponent(Paragraph),
			LabelledValue.label(translation(DebugToolsTranslation.InspectionTemperatureTileCalculatedHeat))
				.add(Translation.colorizeImportance("primary")
					.addArgs(this.getTemperature(TempType.Heat, "calculated")))
				.setDisplayLevel(InfoDisplayLevel.Verbose)
				.setComponent(Paragraph),
			LabelledValue.label(translation(DebugToolsTranslation.InspectionTemperatureTileCalculatedCold))
				.add(Translation.colorizeImportance("primary")
					.addArgs(this.getTemperature(TempType.Cold, "calculated")))
				.setDisplayLevel(InfoDisplayLevel.Verbose)
				.setComponent(Paragraph),
			LabelledValue.label(translation(DebugToolsTranslation.InspectionTemperatureTileProducedHeat))
				.add(Translation.colorizeImportance("primary")
					.addArgs(this.getTemperature(TempType.Heat, "produced")))
				.setDisplayLevel(InfoDisplayLevel.Verbose)
				.setComponent(Paragraph),
			LabelledValue.label(translation(DebugToolsTranslation.InspectionTemperatureTileProducedCold))
				.add(Translation.colorizeImportance("primary")
					.addArgs(this.getTemperature(TempType.Cold, "produced")))
				.setDisplayLevel(InfoDisplayLevel.Verbose)
				.setComponent(Paragraph),
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

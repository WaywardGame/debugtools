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

	private tempValue?: number;

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
		this.tempValue = localIsland.temperature.get(this.value, undefined);
		return [
			LabelledValue.label(translation(DebugToolsTranslation.InspectionTemperature))
				.add(new MagicalPropertyValue(this.tempValue))
				.setDisplayLevel(InfoDisplayLevel.NonExtra)
				.setComponent(Paragraph),
			LabelledValue.label(translation(DebugToolsTranslation.InspectionTemperature))
				.add(new MagicalPropertyValue(this.tempValue))
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

	@EventHandler(EventBus.Game, "tickEnd")
	public onTickEnd() {
		if (localPlayer.isResting()) {
			return;
		}

		const newTempValue = localIsland.temperature.get(this.value, undefined);
		if (this.tempValue !== newTempValue) {
			this.refresh();
		}
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

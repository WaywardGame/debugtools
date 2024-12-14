import { EventBus } from "@wayward/game/event/EventBuses";
import { EventHandler } from "@wayward/game/event/EventManager";
import { InfoClass, InfoDisplayLevel } from "@wayward/game/game/inspection/IInfoProvider";
import { InspectType, basicInspectionPriorities } from "@wayward/game/game/inspection/IInspection";
import type { InfoProvider, SimpleInfoProvider } from "@wayward/game/game/inspection/InfoProvider";
import type { InfoProviderContext } from "@wayward/game/game/inspection/InfoProviderContext";
import Inspection from "@wayward/game/game/inspection/Inspection";
import LabelledValue from "@wayward/game/game/inspection/infoProviders/LabelledValue";
import MagicalPropertyValue from "@wayward/game/game/inspection/infoProviders/MagicalPropertyValue";
import type Island from "@wayward/game/game/island/Island";
import { TempType } from "@wayward/game/game/temperature/ITemperature";
import { TEMPERATURE_INVALID } from "@wayward/game/game/temperature/TemperatureManager";
import type Tile from "@wayward/game/game/tile/Tile";
import Translation from "@wayward/game/language/Translation";
import { MiscTranslation } from "@wayward/game/language/dictionary/Misc";
import type TranslationImpl from "@wayward/game/language/impl/TranslationImpl";
import Mod from "@wayward/game/mod/Mod";
import type { TranslationGenerator } from "@wayward/game/ui/component/IComponent";
import { Heading, Paragraph } from "@wayward/game/ui/component/Text";
import type DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";

export default class TemperatureInspection extends Inspection<Tile> {

	private tempValue?: number;

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public static readonly DEBUG_TOOLS: DebugTools;

	public static getFromTile(tile: Tile, context?: InfoProviderContext): never[] | TemperatureInspection {
		return TemperatureInspection.DEBUG_TOOLS ? new TemperatureInspection(tile, context) : [];
	}

	public constructor(tile: Tile, context?: InfoProviderContext) {
		super(TemperatureInspection.DEBUG_TOOLS.inspectionTemperature, tile, context);
	}

	public override getId(): string {
		return this.createIdFromVector3(this.value);
	}

	public override getPriority(): number {
		return basicInspectionPriorities[InspectType.Tile] + 100;
	}

	////////////////////////////////////
	// Content
	//

	public override hasContent(): boolean {
		return game.playing && this.getTileMod() !== "?";
	}

	protected override getTitle(context: InfoProviderContext): Translation | SimpleInfoProvider | undefined {
		return undefined;
	}

	protected override getSubtitle(context: InfoProviderContext): Translation | SimpleInfoProvider | undefined {
		return undefined;
	}

	protected override getContent(context: InfoProviderContext): ArrayOr<TranslationGenerator | InfoProvider | undefined> {
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

	@EventHandler(EventBus.Island, "tickEnd")
	public onTickEnd(island: Island): void {
		if (!island.isLocalIsland || localPlayer.isResting) {
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

	private getTemperature(tempType: TempType, calcOrProduce: "calculated" | "produced"): number | "?" {
		const temp = localIsland.temperature?.[calcOrProduce === "calculated" ? "getCachedCalculated" : "getCachedProduced"](this.value, tempType);
		return temp === TEMPERATURE_INVALID || temp === undefined ? "?" : temp;
	}

	private getTileMod(): TranslationImpl | "?" {
		const heat = this.getTemperature(TempType.Heat, "calculated");
		const cold = this.getTemperature(TempType.Cold, "calculated");
		if (heat === "?" || cold === "?") {
			return "?";
		}

		return Translation.misc(MiscTranslation.Difference)
			.addArgs(heat - cold);
	}
}

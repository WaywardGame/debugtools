import type { DoodadType } from "@wayward/game/game/doodad/IDoodad";
import type { CreatureType } from "@wayward/game/game/entity/creature/ICreature";
import type { CreatureZone } from "@wayward/game/game/entity/creature/zone/CreatureZone";
import type { IBiomeCreatureCombo, IBiomeCreatureCombos, IBiomeCreatureZoneSpawnGroup, IBiomeCreatureZoneTiers, IBiomeDoodadReplacement, IBiomeDoodadReplacements, IBiomeGuardianZoneTier, IBiomeGuardianZoneTiers, IBiomeTileReplacement, IBiomeTileReplacements } from "@wayward/game/game/entity/creature/zone/ICreatureZone";
import type { ItemType } from "@wayward/game/game/item/IItem";
import type { TerrainType } from "@wayward/game/game/tile/ITerrain";
import type Tile from "@wayward/game/game/tile/Tile";
import type { TileEventType } from "@wayward/game/game/tile/ITileEvent";
import type { PartOfDay } from "@wayward/game/game/time/ITimeManager";
import Dictionary from "@wayward/game/language/Dictionary";
import { TextContext } from "@wayward/game/language/ITranslation";
import Translation from "@wayward/game/language/Translation";
import Mod from "@wayward/game/mod/Mod";
import Component from "@wayward/game/ui/component/Component";
import Details from "@wayward/game/ui/component/Details";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import Text from "@wayward/game/ui/component/Text";
import type Log from "@wayward/utilities/Log";
import type WorldZ from "@wayward/utilities/game/WorldZ";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import type { TabInformation } from "../component/InspectInformationSection";
import InspectInformationSection from "../component/InspectInformationSection";

export default class CreatureZoneInformation extends InspectInformationSection {

	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private zone: CreatureZone | undefined;
	private updateKey: string | undefined;
	private readonly content = new Component()
		.appendTo(this);

	public override getTabs(): TabInformation[] {
		return this.zone ? [
			[0, () => translation(DebugToolsTranslation.InspectCreatureZone)],
		] : [];
	}

	public override update(tile: Tile): void {
		const zone = tile.zone;
		const updateKey = zone ? `${zone.zonePoint.x},${zone.zonePoint.y},${zone.zonePoint.z}:${zone.getTier()}:${game.time.getPartOfDay()}` : undefined;
		if (zone === this.zone && updateKey === this.updateKey) {
			return;
		}

		this.zone = zone;
		this.updateKey = updateKey;
		this.render();
		this.setShouldLog();
	}

	public override logUpdate(): void {
		if (this.zone) {
			this.LOG.info("Creature Zone:", this.zone);
		}
	}

	private render(): void {
		this.content.dump();

		const zone = this.zone;
		if (!zone) {
			return;
		}

		this.addLabelledRow(DebugToolsTranslation.LabelCreatureZonePoint, `${zone.zonePoint.x}, ${zone.zonePoint.y}, ${zone.zonePoint.z}`);
		this.addLabelledRow(DebugToolsTranslation.LabelCreatureZoneTier, zone.getTier());
		this.addLabelledRow(DebugToolsTranslation.LabelCreatureZoneLayer, this.layerName(zone.zonePoint.z));
		this.addLabelledRow(DebugToolsTranslation.LabelCreatureZoneCurrentSpawns, this.creatureList(zone.getCreatureSet()));

		const description = zone.description;
		if (!description) {
			return;
		}

		this.addCreatureDescriptions(description.creatures);
		this.addGuardianDescriptions(description.guardians);
		this.addTileReplacementDescriptions(description.tileReplacements);
		this.addDoodadReplacementDescriptions(description.doodadReplacements);
		this.addCreatureComboDescriptions(description.creatureCombos);
	}

	private addCreatureDescriptions(tiers: IBiomeCreatureZoneTiers | undefined): void {
		const details = this.addDetails(this.content, DebugToolsTranslation.LabelCreatureZoneCreatures);
		if (!tiers) {
			this.addNone(details);
			return;
		}

		for (const [tier, tierDescription] of this.getTierEntries(tiers)) {
			const tierDetails = this.addDetails(details, DebugToolsTranslation.CreatureZoneTier, tier);
			for (const [z, spawnGroups] of tierDescription.entries()) {
				const layerDetails = this.addDetails(tierDetails, DebugToolsTranslation.CreatureZoneLayer, this.layerName(z));
				spawnGroups.forEach((group, groupIndex) => this.addCreatureSpawnGroup(layerDetails, group, groupIndex));
			}
		}
	}

	private addCreatureSpawnGroup(parent: Component, group: IBiomeCreatureZoneSpawnGroup, groupIndex: number): void {
		const groupDetails = this.addDetails(parent, DebugToolsTranslation.LabelCreatureZoneGroup, groupIndex + 1);
		for (const [partOfDay, sets] of Object.entries(group) as Array<[`${PartOfDay}`, CreatureType[][]]>) {
			new Text()
				.setText(Translation.labelled(this.partOfDayName(+partOfDay), sets
					.map(set => this.creatureList(set))
					.collect(Translation.formatList)))
				.appendTo(groupDetails);
		}
	}

	private addGuardianDescriptions(tiers: IBiomeGuardianZoneTiers | undefined): void {
		const details = this.addDetails(this.content, DebugToolsTranslation.LabelCreatureZoneGuardians);
		if (!tiers) {
			this.addNone(details);
			return;
		}

		for (const [tier, tierDescription] of this.getTierEntries(tiers)) {
			const tierDetails = this.addDetails(details, DebugToolsTranslation.CreatureZoneTier, tier);
			for (const [z, creatures] of this.getLayerEntries(tierDescription)) {
				new Text()
					.setText(Translation.labelled(this.layerName(z), this.creatureList(creatures)))
					.appendTo(tierDetails);
			}
		}
	}

	private addTileReplacementDescriptions(tiers: IBiomeTileReplacements | undefined): void {
		const details = this.addDetails(this.content, DebugToolsTranslation.LabelCreatureZoneTileReplacements);
		if (!tiers) {
			this.addNone(details);
			return;
		}

		for (const [tier, replacements] of this.getTierEntries(tiers)) {
			const tierDetails = this.addDetails(details, DebugToolsTranslation.CreatureZoneTier, tier);
			for (const replacement of replacements) {
				this.addReplacement(tierDetails, replacement, Dictionary.Terrain, replacement.replaceWith);
			}
		}
	}

	private addDoodadReplacementDescriptions(tiers: IBiomeDoodadReplacements | undefined): void {
		const details = this.addDetails(this.content, DebugToolsTranslation.LabelCreatureZoneDoodadReplacements);
		if (!tiers) {
			this.addNone(details);
			return;
		}

		for (const [tier, replacements] of this.getTierEntries(tiers)) {
			const tierDetails = this.addDetails(details, DebugToolsTranslation.CreatureZoneTier, tier);
			for (const replacement of replacements) {
				this.addReplacement(tierDetails, replacement, Dictionary.Doodad, replacement.replaceWith);
			}
		}
	}

	private addReplacement(parent: Component, replacement: IBiomeTileReplacement, dictionary: Dictionary.Terrain, replaceWith: TerrainType | null): void;
	private addReplacement(parent: Component, replacement: IBiomeDoodadReplacement, dictionary: Dictionary.Doodad, replaceWith: DoodadType | null): void;
	private addReplacement(parent: Component, replacement: IBiomeTileReplacement | IBiomeDoodadReplacement, dictionary: Dictionary.Terrain | Dictionary.Doodad, replaceWith: TerrainType | DoodadType | null): void {
		const where = dictionary === Dictionary.Terrain
			? this.nameList(Dictionary.Terrain, this.normalizeArray((replacement as IBiomeTileReplacement).where))
			: this.nameList(Dictionary.Doodad, this.normalizeArray((replacement as IBiomeDoodadReplacement).where));

		const replacementName = replaceWith === null
			? translation(DebugToolsTranslation.None)
			: dictionary === Dictionary.Terrain
				? this.name(Dictionary.Terrain, replaceWith as TerrainType)
				: this.name(Dictionary.Doodad, replaceWith as DoodadType);

		new Text()
			.setText(translation(DebugToolsTranslation.CreatureZoneReplacement)
				.addArgs(
					where,
					replacementName,
					Math.round((replacement.chance ?? 1) * 100)))
			.appendTo(parent);
	}

	private addCreatureComboDescriptions(combos: IBiomeCreatureCombos | undefined): void {
		const details = this.addDetails(this.content, DebugToolsTranslation.LabelCreatureZoneCreatureCombos);
		if (!combos) {
			this.addNone(details);
			return;
		}

		for (const [creatureType, creatureCombos] of Object.entries(combos) as Array<[`${CreatureType}`, IBiomeCreatureCombo[]]>) {
			const creatureDetails = this.addDetails(details, DebugToolsTranslation.LabelCreatureZoneCreatureComboSource, this.creatureName(+creatureType));
			for (const combo of creatureCombos) {
				new Text()
					.setText(this.creatureComboText(combo))
					.appendTo(creatureDetails);
			}
		}
	}

	private creatureComboText(combo: IBiomeCreatureCombo): Translation {
		return translation(DebugToolsTranslation.CreatureZoneCreatureCombo)
			.addArgs(
				combo.doodad === undefined ? undefined : Translation.labelled(translation(DebugToolsTranslation.LabelCreatureZoneDoodad), this.name(Dictionary.Doodad, combo.doodad)),
				combo.tileEvent === undefined ? undefined : Translation.labelled(translation(DebugToolsTranslation.LabelCreatureZoneTileEvent), this.name(Dictionary.TileEvent, combo.tileEvent)),
				combo.item === undefined ? undefined : Translation.labelled(translation(DebugToolsTranslation.LabelCreatureZoneItem), this.name(Dictionary.Item, combo.item)),
				Math.round((combo.chance ?? 1) * 100),
				combo.attempts ?? 1);
	}

	private addLabelledRow(label: DebugToolsTranslation, value: any): void {
		new LabelledRow()
			.setLabel(labelComponent => labelComponent.setText(translation(label)))
			.append(new Text().setText(Translation.colorizeImportance("primary").addArgs(value)))
			.appendTo(this.content);
	}

	private addDetails(parent: Component, label: DebugToolsTranslation, ...args: any[]): Details {
		return new Details()
			.setSummary(summary => summary.setText(translation(label).addArgs(...args)))
			.appendTo(parent);
	}

	private addNone(parent: Component): void {
		new Text()
			.setText(translation(DebugToolsTranslation.None))
			.appendTo(parent);
	}

	private getTierEntries<T>(tiers: PartialRecord<`tier${number}`, T>): Array<[number, T]> {
		return Object.entries(tiers)
			.map(([tier, description]) => [Number(tier.slice(4)), description] as [number, T])
			.sort(([a], [b]) => a - b);
	}

	private getLayerEntries(tierDescription: IBiomeGuardianZoneTier): Array<[WorldZ, CreatureType[]]> {
		return Object.entries(tierDescription)
			.map(([z, creatures]) => [+z as WorldZ, creatures] as [WorldZ, CreatureType[]])
			.sort(([a], [b]) => a - b);
	}

	private normalizeArray<T>(value: ArrayOr<T>): T[] {
		return Array.isArray(value) ? value : [value];
	}

	private creatureList(creatures: CreatureType[]): Translation {
		return creatures.length === 0 ? translation(DebugToolsTranslation.None)
			: creatures.map(creature => this.creatureName(creature)).collect(Translation.formatList);
	}

	private creatureName(creature: CreatureType): Translation {
		return this.name(Dictionary.Creature, creature);
	}

	private partOfDayName(partOfDay: PartOfDay): Translation {
		return Translation.get(Dictionary.PartOfDay, partOfDay).inContext(TextContext.Title);
	}

	private layerName(z: WorldZ): Translation {
		return translation(DebugToolsTranslation.CreatureZoneLayerName)
			.addArgs(z, Translation.get(Dictionary.WorldLayer, z).inContext(TextContext.Title));
	}

	private name(dictionary: Dictionary.Creature, type: CreatureType): Translation;
	private name(dictionary: Dictionary.Doodad, type: DoodadType): Translation;
	private name(dictionary: Dictionary.Item, type: ItemType): Translation;
	private name(dictionary: Dictionary.Terrain, type: TerrainType): Translation;
	private name(dictionary: Dictionary.TileEvent, type: TileEventType): Translation;
	private name(dictionary: Dictionary, type: number): Translation {
		return Translation.get(dictionary, type).inContext(TextContext.Title);
	}

	private nameList(dictionary: Dictionary.Terrain, types: TerrainType[]): Translation;
	private nameList(dictionary: Dictionary.Doodad, types: DoodadType[]): Translation;
	private nameList(dictionary: Dictionary.Terrain | Dictionary.Doodad, types: Array<TerrainType | DoodadType>): Translation {
		return types.map(type => this.name(dictionary as Dictionary.Terrain, type as TerrainType)).collect(Translation.formatList);
	}
}

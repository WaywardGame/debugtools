import type Deity from "@wayward/game/game/deity/Deity";
import { ActionType } from "@wayward/game/game/entity/action/IAction";
import type Human from "@wayward/game/game/entity/Human";
import type { DamageType } from "@wayward/game/game/entity/IEntity";
import type { SkillType } from "@wayward/game/game/entity/skill/ISkills";
import { Quality } from "@wayward/game/game/IObject";
import type { IContainer, IItemDescription, IMagicalPropertyInfo } from "@wayward/game/game/item/IItem";
import { consumables, ItemType, ItemTypeGroup } from "@wayward/game/game/item/IItem";
import Item from "@wayward/game/game/item/Item";
import { itemDescriptions } from "@wayward/game/game/item/ItemDescriptions";
import ItemManager from "@wayward/game/game/item/ItemManager";
import type Island from "@wayward/game/game/island/Island";
import { MagicalPropertyIdentity } from "@wayward/game/game/magic/IMagicalProperty";
import type { MagicalSubPropertySubTypes } from "@wayward/game/game/magic/IMagicalProperty";
import MagicalPropertyManager from "@wayward/game/game/magic/MagicalPropertyManager";
import { magicalPropertyDescriptions } from "@wayward/game/game/magic/MagicalPropertyDescriptions";
import type { MagicalPropertyStat } from "@wayward/game/game/magic/MagicalPropertyType";
import MagicalPropertyType from "@wayward/game/game/magic/MagicalPropertyType";
import Enums from "@wayward/game/utilities/enum/Enums";
import Math2 from "@wayward/utilities/math/Math2";

interface IAnalysisItemCandidate {
	itemType: ItemType;
	item: Item;
	description: IItemDescription;
	validProperties: ReadonlySet<MagicalPropertyType>;
	validPropertyCount: number;
	specialPenalty: number;
	complexity: number;
	relicEligible: boolean;
	hasDurability: boolean;
	hasDecay: boolean;
	isAttack: boolean;
	isBuildable: boolean;
	isConsumable: boolean;
	isContainer: boolean;
	isDefense: boolean;
	isEquipment: boolean;
	isGrowingItem: boolean;
	isLit: boolean;
	isOffer: boolean;
	isDirectRecipeIngredient: boolean;
	isRecipeIngredientWhenBuilt: boolean;
	isRevert: boolean;
	isRanged: boolean;
	isScarecrow: boolean;
	isTradable: boolean;
	isTrap: boolean;
	civilizationScore: number;
	stokeValue?: number;
}

export const enum MagicalPropertySpecimenValueKind {
	Min,
	Max,
	ExpandedMax,
}

export interface IMagicalPropertySpecimenPlanEntry {
	itemType: ItemType;
	identity: MagicalPropertyIdentity;
	note: string;
	quality: Quality.Exceptional | Quality.Relic;
	valueKind: MagicalPropertySpecimenValueKind;
	curse?: true;
}

const candidateCache = new WeakMap<Island, readonly IAnalysisItemCandidate[]>();

export function getMagicalPropertySpecimenPlan(island: Island): IMagicalPropertySpecimenPlanEntry[] {
	const candidates = getCandidates(island);
	const propertyTypes = Enums.values(MagicalPropertyType)
		.filter((type): type is MagicalPropertyType => magicalPropertyDescriptions[type] !== undefined);
	const chosenItemTypes = chooseUniqueItemTypes(candidates, propertyTypes);
	const plan: IMagicalPropertySpecimenPlanEntry[] = [];
	const chosenTypeValues = new Set(chosenItemTypes.values());

	for (const type of propertyTypes) {
		const description = magicalPropertyDescriptions[type];
		if (!description) {
			continue;
		}

		if (type === MagicalPropertyType.Aptitude_CraftingBonus) {
			const defaultItemType = chosenItemTypes.get(type);
			const usedItemTypes = new Set(chosenTypeValues);
			if (defaultItemType !== undefined) {
				usedItemTypes.delete(defaultItemType);
			}

			const ingredientItemType = chooseDedicatedItemType(candidates, type, usedItemTypes,
				candidate => candidate.isDirectRecipeIngredient && !candidate.isBuildable,
				"ingredient-only");
			usedItemTypes.add(ingredientItemType);

			const buildableItemType = chooseDedicatedItemType(candidates, type, usedItemTypes,
				candidate => candidate.isBuildable && !candidate.isDirectRecipeIngredient,
				"buildable-only");

			plan.push(...createPropertyPlanEntries(island, ingredientItemType, type, "ingredient-only"));
			plan.push(...createPropertyPlanEntries(island, buildableItemType, type, "buildable-only"));
			continue;
		}

		const itemType = chosenItemTypes.get(type);
		if (itemType === undefined) {
			throw new Error(`Unable to resolve a unique item type for magical property ${type}`);
		}

		plan.push(...createPropertyPlanEntries(island, itemType, type));
	}

	return plan;
}

function createPropertyPlanEntries(island: Island, itemType: ItemType, type: MagicalPropertyType, noteVariant?: string): IMagicalPropertySpecimenPlanEntry[] {
	const description = magicalPropertyDescriptions[type];
	if (!description) {
		return [];
	}

	const entries: IMagicalPropertySpecimenPlanEntry[] = [];
	for (const identity of getIdentities(type)) {
		for (const valueKind of getUniqueValueKinds(island, itemType, identity)) {
			entries.push(createPlanEntry(itemType, identity, valueKind === MagicalPropertySpecimenValueKind.ExpandedMax ? Quality.Relic : Quality.Exceptional, valueKind, undefined, noteVariant));

			if (!description.disableCurse) {
				entries.push(createPlanEntry(itemType, identity, valueKind === MagicalPropertySpecimenValueKind.ExpandedMax ? Quality.Relic : Quality.Exceptional, valueKind, true, noteVariant));
			}
		}
	}

	return entries;
}

export function createMagicalPropertySpecimens(executor: Human, container: IContainer): Item[] {
	const createdItems: Item[] = [];

	for (const specimen of getMagicalPropertySpecimenPlan(executor.island)) {
		const item = executor.island.items.create(specimen.itemType, undefined, Quality.None);
		item.removeMagic();
		item.setQuality(executor, specimen.quality);
		item.note = specimen.note;

		const info = item.getMagicalPropertyInfo(specimen.identity[0]);
		if (!info) {
			executor.island.items.remove(item);
			continue;
		}

		setSpecimenProperty(item, specimen.identity, getSpecimenValue(item, info, specimen.valueKind), specimen.curse);
		createdItems.push(item);
	}

	executor.island.items.moveItemsToContainer(executor, createdItems, container, { skipDrop: true, skipWeightChecks: true });
	return createdItems;
}

function getCandidates(island: Island): readonly IAnalysisItemCandidate[] {
	let cached = candidateCache.get(island);
	if (cached) {
		return cached;
	}

	// Use manually populated analysis items so candidate selection never consumes live island RNG.
	cached = Enums.values(ItemType)
		.map(itemType => createCandidate(island, itemType))
		.filter((candidate): candidate is IAnalysisItemCandidate => candidate !== undefined);

	candidateCache.set(island, cached);
	return cached;
}

function chooseUniqueItemTypes(candidates: readonly IAnalysisItemCandidate[], propertyTypes: readonly MagicalPropertyType[]): Map<MagicalPropertyType, ItemType> {
	const orderedTypes = propertyTypes
		.map(type => ({
			type,
			candidates: candidates
				.filter(candidate => candidate.validProperties.has(type))
				.sort((a, b) => compareCandidates(a, b, type, !!magicalPropertyDescriptions[type]?.getInfo(a.item, a.description)?.expandable)),
		}))
		.sort((a, b) => a.candidates.length - b.candidates.length || a.type - b.type);

	const chosenItemTypes = new Map<MagicalPropertyType, ItemType>();
	const usedItemTypes = new Set<ItemType>();

	for (const { type, candidates: propertyCandidates } of orderedTypes) {
		const chosenCandidate = propertyCandidates.find(candidate => !usedItemTypes.has(candidate.itemType));
		if (!chosenCandidate) {
			throw new Error(`Unable to find a unique item type candidate for magical property ${type}`);
		}

		chosenItemTypes.set(type, chosenCandidate.itemType);
		usedItemTypes.add(chosenCandidate.itemType);
	}

	return chosenItemTypes;
}

function chooseDedicatedItemType(candidates: readonly IAnalysisItemCandidate[], type: MagicalPropertyType, usedItemTypes: ReadonlySet<ItemType>, predicate: (candidate: IAnalysisItemCandidate) => boolean, label: string): ItemType {
	const chosenCandidate = candidates
		.filter(candidate => candidate.validProperties.has(type))
		.filter(predicate)
		.sort((a, b) => compareCandidates(a, b, type, !!magicalPropertyDescriptions[type]?.getInfo(a.item, a.description)?.expandable))
		.find(candidate => !usedItemTypes.has(candidate.itemType));

	if (!chosenCandidate) {
		throw new Error(`Unable to find a unique ${label} specimen candidate for magical property ${type}`);
	}

	return chosenCandidate.itemType;
}

function createCandidate(island: Island, itemType: ItemType): IAnalysisItemCandidate | undefined {
	const description = itemDescriptions[itemType];
	if (!description) {
		return undefined;
	}

	const item = createAnalysisItem(island, itemType);
	const validProperties = new Set(item.getValidMagicalProperties());
	const hasDurability = description.durability !== undefined;
	const hasDecay = description.decayMax !== undefined || description.storeDecay !== undefined || description.canDecayWhenLit === true;
	const isAttack = !!description.attack;
	const isBuildable = !!description.onUse?.[ActionType.Build];
	const isConsumable = description.use?.some(use => consumables.has(use)) ?? false;
	const isContainer = item.getWeightCapacity() !== undefined;
	const isDefense = !!description.defense;
	const isEquipment = !!description.equip;
	const isGrowingItem = island.items.isItemUsedForGrowingPlants(itemType);
	const isLit = !!description.lit;
	const isOffer = island.items.isItemAcceptedAsOffer(itemType);
	const isDirectRecipeIngredient = island.items.isItemUsedInRecipe(itemType);
	const isRecipeIngredientWhenBuilt = island.items.isItemUsedInRecipeWhenBuilt(itemType);
	const isRevert = description.revert !== undefined;
	const isRanged = !!description.ranged;
	const isScarecrow = item.isInGroup(ItemTypeGroup.Scarecrow);
	const isTradable = description.worth !== undefined && !item.isInGroup(ItemTypeGroup.Untradable) && !isLit;
	const isTrap = item.isInGroup(ItemTypeGroup.Trap);
	const civilizationScore = Math.max(item.getCivilizationScore(ActionType.Build) ?? 0, item.getCivilizationScore(ActionType.SetDown) ?? 0);
	const stokeValue = item.getStokeFireValue();
	const specialPenalty = Number(!!description.canHaveAllMagicalProperties) * 100
		+ Number(!!description.magicInert) * 50
		+ Number(!!description.alwaysGetMagicalProperty) * 25
		+ Number(description.use?.includes(ActionType.Exude)) * 25;
	const complexity = [isAttack, isBuildable, isContainer, isDefense, isEquipment, isLit, isRanged, isRevert].filter(Boolean).length;

	return {
		itemType,
		item,
		description,
		validProperties,
		validPropertyCount: validProperties.size,
		specialPenalty,
		complexity,
		relicEligible: ItemManager.canItemBeRelic(itemType),
		hasDurability,
		hasDecay,
		isAttack,
		isBuildable,
		isConsumable,
		isContainer,
		isDefense,
		isEquipment,
		isGrowingItem,
		isLit,
		isOffer,
		isDirectRecipeIngredient,
		isRecipeIngredientWhenBuilt,
		isRevert,
		isRanged,
		isScarecrow,
		isTradable,
		isTrap,
		civilizationScore,
		stokeValue,
	};
}

function createAnalysisItem(island: Island, itemType: ItemType): Item {
	const item = new Item();
	item.type = itemType;
	item.islandId = island.id;
	item.quality = Quality.None;
	item.weight = island.items.getWeight(itemType);

	if (item.getWeightCapacity() !== undefined) {
		item.containedItems = [];
	}

	return item;
}

function createPlanEntry(itemType: ItemType, identity: MagicalPropertyIdentity, quality: Quality.Exceptional | Quality.Relic, valueKind: MagicalPropertySpecimenValueKind, curse?: true, noteVariant?: string): IMagicalPropertySpecimenPlanEntry {
	return {
		itemType,
		identity,
		note: getSpecimenNote(identity, valueKind, curse, noteVariant),
		quality,
		valueKind,
		curse,
	};
}

function getSpecimenNote(identity: MagicalPropertyIdentity, valueKind: MagicalPropertySpecimenValueKind, curse?: true, noteVariant?: string): string {
	const valueText = valueKind === MagicalPropertySpecimenValueKind.Min ? "min"
		: valueKind === MagicalPropertySpecimenValueKind.Max ? "max"
			: "expandable max";
	const propertyText = identity[0] === MagicalPropertyType.Fanaticism_Deity ? getSpecimenPropertyText(identity) : MagicalPropertyManager.translate(...identity).getString();
	const variantText = noteVariant ? `${noteVariant} ` : "";
	return `Magic specimen: ${variantText}${curse ? `cursed ${valueText}` : valueText} ${propertyText}`;
}

function getSpecimenPropertyText(identity: MagicalPropertyIdentity): string {
	const [type, subType] = identity;
	const propertyText = MagicalPropertyManager.translate(type).getString();
	if (subType === undefined) {
		return propertyText;
	}

	const subTypeEnum = magicalPropertyDescriptions[type]?.subTypeEnum;
	const subTypeText = MagicalPropertyIdentity.getSubTypeTranslationDictionaryAndKey(identity)?.getString()
		?? (subTypeEnum ? String(subTypeEnum[subType as unknown as keyof typeof subTypeEnum]) : undefined);

	return subTypeText ? `${propertyText}: ${subTypeText}` : propertyText;
}

function compareCandidates(a: IAnalysisItemCandidate, b: IAnalysisItemCandidate, type: MagicalPropertyType, prefersRelicEligible: boolean): number {
	const fitnessDifference = getPropertyFitness(type, b) - getPropertyFitness(type, a);
	if (fitnessDifference !== 0) {
		return fitnessDifference;
	}

	const validPropertyDifference = a.validPropertyCount - b.validPropertyCount;
	if (validPropertyDifference !== 0) {
		return validPropertyDifference;
	}

	const penaltyDifference = a.specialPenalty - b.specialPenalty;
	if (penaltyDifference !== 0) {
		return penaltyDifference;
	}

	const complexityDifference = a.complexity - b.complexity;
	if (complexityDifference !== 0) {
		return complexityDifference;
	}

	if (prefersRelicEligible) {
		const relicDifference = Number(b.relicEligible) - Number(a.relicEligible);
		if (relicDifference !== 0) {
			return relicDifference;
		}
	}

	const maxDifference = getCandidateMax(a, type) - getCandidateMax(b, type);
	if (maxDifference !== 0) {
		return maxDifference;
	}

	return a.itemType - b.itemType;
}

function getCandidateMax(candidate: IAnalysisItemCandidate, type: MagicalPropertyType): number {
	return candidate.item.getMagicalPropertyInfo(type)?.max ?? Number.MAX_SAFE_INTEGER;
}

function getPropertyFitness(type: MagicalPropertyType, candidate: IAnalysisItemCandidate): number {
	switch (type) {
		case MagicalPropertyType.Power_Attack:
			return score(candidate.isAttack, 8) + score(!candidate.isRanged, 3) + score(!candidate.isLit && !candidate.isRevert, 2);

		case MagicalPropertyType.Guarding_Defense:
			return equipmentFitness(candidate) + score(candidate.isDefense, 4);

		case MagicalPropertyType.Illumination_LightItemLightBonus:
			return score(candidate.isLit || candidate.isRevert, 10) + score(candidate.isEquipment, 2);

		case MagicalPropertyType.Magnitude_WeightCapacity:
			return score(candidate.isContainer, 10);

		case MagicalPropertyType.Featherweight:
			return score((candidate.item.weight ?? 0) > 0.1, 8) + score(!candidate.isBuildable && !candidate.isContainer, 2);

		case MagicalPropertyType.Stat:
		case MagicalPropertyType.Skill:
		case MagicalPropertyType.Fanaticism_Deity:
		case MagicalPropertyType.Lightening_PlayerWeightMax:
		case MagicalPropertyType.Glowing_EquipmentLightBonus:
		case MagicalPropertyType.Fortune_Luck:
		case MagicalPropertyType.Warding_CurseReduction:
		case MagicalPropertyType.StatPotency_EquipmentImproveConsumableStats:
			return equipmentFitness(candidate);

		case MagicalPropertyType.Range:
			return score(candidate.isRanged, 10) + score(candidate.isAttack, 2);

		case MagicalPropertyType.Potency_ImproveConsumableStats:
			return score(candidate.isConsumable, 10) + score(!candidate.isEquipment && !candidate.isAttack, 2);

		case MagicalPropertyType.Worth:
			return score(candidate.isTradable, 8) + score(candidate.isConsumable, 2) + score(!candidate.isEquipment && !candidate.isAttack, 1);

		case MagicalPropertyType.Ensnaring_TrapDamage:
			return score(candidate.isTrap, 10) + score(candidate.isBuildable, 2);

		case MagicalPropertyType.Storing_ContainedItemsWeight:
			return score(candidate.isContainer, 10) + score(candidate.description.reducedStoredItemsWeight !== undefined && candidate.description.reducedStoredItemsWeight !== 0, 2);

		case MagicalPropertyType.Preservation_ContainedItemsDecayRate:
			return score(candidate.isContainer, 10) + score(candidate.description.preservationChance !== undefined, 2);

		case MagicalPropertyType.Hoarding_MaxDecay:
		case MagicalPropertyType.Perpetuity_DecayLossChance:
			return score(candidate.hasDecay, 10) + score(!candidate.isLit && !candidate.isRevert, 2);

		case MagicalPropertyType.Endurance_DurabilityLossChance:
		case MagicalPropertyType.Regeneration_DurabilityRegen:
		case MagicalPropertyType.Persistence_MaxDurability:
			return score(candidate.hasDurability, 10) + score(candidate.isEquipment || candidate.isAttack, 2);

		case MagicalPropertyType.Stoking:
			return score(candidate.stokeValue !== undefined, 10) + score((candidate.stokeValue ?? Number.MAX_SAFE_INTEGER) <= 100, 1);

		case MagicalPropertyType.Insulation:
			return score(candidate.isContainer, 8) + score(candidate.description.equippedInsulation !== undefined, 4);

		case MagicalPropertyType.Hurling_ThrowDamage:
			return score(!candidate.isEquipment && !candidate.isAttack && !candidate.isContainer, 8) + score(candidate.isConsumable || candidate.isTradable, 2);

		case MagicalPropertyType.Offering:
			return score(candidate.isOffer, 10) + score(candidate.isConsumable, 1);

		case MagicalPropertyType.Aptitude_CraftingBonus:
			return score(candidate.isDirectRecipeIngredient, 10) + score(!candidate.isEquipment && !candidate.isAttack && !candidate.isBuildable, 2);

		case MagicalPropertyType.Progress_CivScore:
			return score(candidate.civilizationScore > 0, 10) + score(candidate.isBuildable, 2);

		case MagicalPropertyType.Prosperity_TerrainGrowingSpeed:
			return score(candidate.isGrowingItem, 10);

		case MagicalPropertyType.Encircling_DoodadSkill:
			return score(candidate.isBuildable && !candidate.isEquipment, 10) + score(candidate.civilizationScore > 0, 1);

		case MagicalPropertyType.ElementalDamage:
			return score(candidate.isAttack, 10) + score(!candidate.isLit && !candidate.isRevert, 2);

		case MagicalPropertyType.Terror_ScareRadius:
			return score(candidate.isScarecrow, 10) + score(candidate.isBuildable, 2);
	}

	return 0;
}

function equipmentFitness(candidate: IAnalysisItemCandidate): number {
	return score(candidate.isEquipment, 10) + score(candidate.isDefense, 2) + score(!candidate.isLit && !candidate.isRevert, 1);
}

function score(condition: boolean, value: number): number {
	return condition ? value : 0;
}

function getIdentities(type: MagicalPropertyType): MagicalPropertyIdentity[] {
	const subTypes = getSubTypes(type);
	if (!subTypes.length) {
		return [[type] as MagicalPropertyIdentity];
	}

	if (isCollapsedSubType(type)) {
		return [[type, subTypes[0]] as MagicalPropertyIdentity];
	}

	return subTypes.map(subType => [type, subType] as MagicalPropertyIdentity);
}

function getSubTypes(type: MagicalPropertyType): MagicalSubPropertySubTypes[] {
	const description = magicalPropertyDescriptions[type];
	if (!description?.subTypeEnum) {
		return [];
	}

	return Enums.values(description.subTypeEnum)
		.filter((subType): subType is number => typeof subType === "number")
		.filter(subType => description.isValidEnum?.(subType) ?? true) as MagicalSubPropertySubTypes[];
}

function isCollapsedSubType(type: MagicalPropertyType): boolean {
	return type === MagicalPropertyType.Stat
		|| type === MagicalPropertyType.Skill
		|| type === MagicalPropertyType.Encircling_DoodadSkill
		|| type === MagicalPropertyType.StatPotency_EquipmentImproveConsumableStats;
}

function getAnalysisItemInfo(island: Island, itemType: ItemType, type: MagicalPropertyType): IMagicalPropertyInfo | undefined {
	return createAnalysisItem(island, itemType).getMagicalPropertyInfo(type);
}

function getUniqueValueKinds(island: Island, itemType: ItemType, identity: MagicalPropertyIdentity): MagicalPropertySpecimenValueKind[] {
	const info = getAnalysisItemInfo(island, itemType, identity[0]);
	if (!info) {
		return [];
	}

	const item = createAnalysisItem(island, itemType);
	const orderedValueKinds = [
		MagicalPropertySpecimenValueKind.Min,
		MagicalPropertySpecimenValueKind.Max,
		...(info.expandable ? [MagicalPropertySpecimenValueKind.ExpandedMax] : []),
	];
	const uniqueValueKinds: MagicalPropertySpecimenValueKind[] = [];
	const seenValues = new Set<number>();

	for (const valueKind of orderedValueKinds) {
		const value = getSpecimenValue(item, info, valueKind);
		if (seenValues.has(value)) {
			continue;
		}

		seenValues.add(value);
		uniqueValueKinds.push(valueKind);
	}

	return uniqueValueKinds;
}

function getSpecimenValue(item: Item, info: IMagicalPropertyInfo, valueKind: MagicalPropertySpecimenValueKind): number {
	if (item.description?.magicInert) {
		return valueKind === MagicalPropertySpecimenValueKind.Min ? 0 : 1;
	}

	switch (valueKind) {
		case MagicalPropertySpecimenValueKind.Min:
			return roundPropertyValue(info.min, info.precision);

		case MagicalPropertySpecimenValueKind.ExpandedMax:
			return roundPropertyValue(info.max * 2, info.precision);

		case MagicalPropertySpecimenValueKind.Max:
		default:
			return roundPropertyValue(info.max, info.precision);
	}
}

function roundPropertyValue(value: number, precision: number | undefined): number {
	return precision === undefined ? value : Math2.roundNumber(value, precision);
}

function setSpecimenProperty(item: Item, identity: MagicalPropertyIdentity, value: number, curse?: true): void {
	const magic = item.initializeMagicalPropertyManager();
	if (identity[1] !== undefined) {
		magic.set(identity[0] as MagicalPropertyType.Stat | MagicalPropertyType.Skill | MagicalPropertyType.Fanaticism_Deity | MagicalPropertyType.Encircling_DoodadSkill | MagicalPropertyType.ElementalDamage | MagicalPropertyType.StatPotency_EquipmentImproveConsumableStats, identity[1] as Deity | DamageType | MagicalPropertyStat | SkillType, value, curse);
		return;
	}

	magic.set(identity[0], value, curse);
}

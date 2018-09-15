import { ActionCallback, IActionArgument, IActionDescriptionNamed, IActionResult } from "action/IAction";
import { ICorpse } from "creature/corpse/ICorpse";
import { ICreature } from "creature/ICreature";
import { IDoodad } from "doodad/IDoodad";
import IBaseEntity from "entity/IBaseEntity";
import IBaseHumanEntity from "entity/IBaseHumanEntity";
import { AiType, EntityType } from "entity/IEntity";
import { IStatMax, Stat } from "entity/IStats";
import { CreatureType, DamageType, Delay, ItemQuality, ItemType, MoveType, NPCType, PlayerState, SentenceCaseStyle, SkillType, StatusType, TerrainType } from "Enums";
import { IContainer, IItem } from "item/IItem";
import itemDescriptions from "item/Items";
import { Message, MessageType } from "language/IMessages";
import { ITemplateOptions, spawnTemplate } from "mapgen/MapGenHelpers";
import Mod from "mod/Mod";
import Register, { Registry } from "mod/ModRegistry";
import { TranslationGenerator } from "newui/component/IComponent";
import Text from "newui/component/Text";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import { TileTemplateType } from "tile/ITerrain";
import terrainDescriptions from "tile/Terrains";
import Enums from "utilities/enum/Enums";
import Log from "utilities/Log";
import { IVector3 } from "utilities/math/IVector";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import TileHelpers from "utilities/TileHelpers";
import DebugTools from "./DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "./IDebugTools";
import InspectDialog from "./ui/InspectDialog";
import { IPaintData } from "./ui/panel/PaintPanel";
import { SelectionType } from "./ui/panel/SelectionPanel";
import { getTilePosition } from "./util/TilePosition";

export enum RemovalType {
	Corpse,
	TileEvent,
}

function description(name: string): IActionDescriptionNamed {
	return { name, usableAsGhost: true, usableWhenPaused: true, ignoreHasDelay: true, ignoreIsMoving: true };
}

type ExecuteFunction<F extends any> = F extends (player: IPlayer, argument: IActionArgument<infer X>, result: IActionResult) => void ? (undefined extends Extract<X, undefined> ?
	(argument?: IActionArgument<X>) => void : (argument: IActionArgument<X>) => void) : never;

export default class Actions {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public static readonly debugTools: DebugTools;
	@Mod.log(DEBUG_TOOLS_ID)
	public static readonly log: Log;

	/**
	 * Returns an action by its method name.
	 */
	public static get<K extends keyof Actions, F extends Actions[K]>(name: K): { execute: ExecuteFunction<F> } {
		return {
			execute: (argument: IActionArgument) => {
				const action = this.debugTools.actions[name];
				if (typeof action !== "function") {
					this.log.error(`Action ${name} is invalid`);
					return;
				}

				actionManager.execute(localPlayer, Registry.id(action as ActionCallback), argument);
			},
		} as any;
	}

	////////////////////////////////////
	// Registrations
	//

	@Register.message("FailureTileBlocked")
	public readonly messageFailureTileBlocked: Message;

	public constructor(private readonly mod: DebugTools) { }

	////////////////////////////////////
	// Actions
	//

	@Register.action<[TileTemplateType, ITemplateOptions]>(description("Place Template"))
	public placeTemplate(executor: IPlayer, { point, object: [type, options] }: IActionArgument<[TileTemplateType, ITemplateOptions]>, result: IActionResult) {
		spawnTemplate(type, point!.x, point!.y, executor.z, options);

		result.updateView = true;
	}

	/**
	 * Runs a miscellaneous command on a selection of things.
	 * @param actionArgument.object[0] A `DebugToolsTranslation` naming what command to perform.
	 * @param actionArgument.object[1] An array of `[SelectionType, number]` tuples. Each represents a selected thing, such as a creature and its ID. 
	 */
	@Register.action<[DebugToolsTranslation, [SelectionType, number][]]>(description("Execute on Selection"))
	public executeOnSelection(executor: IPlayer, { object: [action, selection] }: IActionArgument<[DebugToolsTranslation, [SelectionType, number][]]>, result: IActionResult) {
		for (const [type, id] of selection) {
			let creature: ICreature | undefined;
			let npc: INPC | undefined;
			let otherRemoval: [RemovalType, number] | undefined;

			switch (type) {
				case SelectionType.Creature:
					creature = game.creatures[id]!;
					break;
				case SelectionType.NPC:
					npc = game.npcs[id]!;
					break;
				case SelectionType.TileEvent:
					otherRemoval = [RemovalType.TileEvent, id];
					break;
			}

			switch (action) {
				case DebugToolsTranslation.ActionRemove:
					this.removeInternal(result, otherRemoval || [] as any, creature, npc);
					break;
			}
		}

		renderer.computeSpritesInViewport();
		result.updateRender = true;
	}

	/**
	 * Teleports an entity to a position.
	 */
	@Register.action(description("Teleport Entity"))
	public teleport(executor: IPlayer, { entity, position }: IActionArgument, result: IActionResult) {
		position = this.getPosition(executor, position!, () => translation(DebugToolsTranslation.ActionTeleport)
			.get(game.getName(entity)));

		if (!entity || !position) return;

		if (entity.entityType === EntityType.Creature) {
			const tile = game.getTile(entity.x, entity.y, entity.z);
			delete tile.creature;
		}

		if (entity.entityType === EntityType.NPC) {
			const tile = game.getTile(entity.x, entity.y, entity.z);
			delete tile.npc;
		}

		if (entity.entityType === EntityType.Player) {
			entity.setPosition(position);

		} else {
			entity.x = entity.fromX = position.x;
			entity.y = entity.fromY = position.y;
			entity.z = position.z;
		}

		if (entity.entityType === EntityType.Creature) {
			const tile = game.getTile(entity.x, entity.y, entity.z);
			tile.creature = entity;
		}

		if (entity.entityType === EntityType.NPC) {
			const tile = game.getTile(entity.x, entity.y, entity.z);
			tile.npc = entity;
		}

		game.updateView(true);
	}

	/**
	 * Kills an entity by dealing `Infinity` true damage to it.
	 */
	@Register.action(description("Kill"))
	public kill(executor: IPlayer, { entity }: IActionArgument, result: IActionResult) {
		entity!.damage({
			type: DamageType.True,
			amount: Infinity,
			damageMessage: translation(DebugToolsTranslation.KillEntityDeathMessage).getString(),
		});

		renderer.computeSpritesInViewport();
		result.updateRender = true;
	}

	/**
	 * Clones an entity or doodad to a new location. If given a player, an NPC with the appearance, items, and stats of the player is cloned.
	 */
	@Register.action(description("Clone"))
	public clone(executor: IPlayer, { entity, doodad, position }: IActionArgument, result: IActionResult) {
		position = this.getPosition(executor, position!, () => translation(DebugToolsTranslation.ActionClone)
			.get(game.getName(entity)));

		if (!position) return;

		if (entity) {
			this.cloneEntity(entity, position);

		} else if (doodad) {
			this.cloneDoodad(doodad, position);
		}

		renderer.computeSpritesInViewport();
		result.updateRender = true;
	}

	@Register.action<number>(description("Set Time"))
	public setTime(player: IPlayer, { object: time }: IActionArgument<number>, result: IActionResult) {
		game.time.setTime(time);
		game.updateRender = true;
		fieldOfView.compute();
	}

	/**
	 * The core stats, namely, Health, Stamina, Hunger, and Thirst, are all set to their maximum values. Any status effects are removed.
	 */
	@Register.action<number | undefined>(description("Heal"))
	public heal(executor: IPlayer, { entity, object: corpseId }: IActionArgument<number | undefined>, result: IActionResult) {
		// resurrect corpses
		if (!entity) {
			result.updateRender = this.resurrectCorpse(executor, game.corpses[corpseId!]!);
			return;
		}

		const health = entity.getStat<IStatMax>(Stat.Health);
		const stamina = entity.getStat<IStatMax>(Stat.Stamina);
		const hunger = entity.getStat<IStatMax>(Stat.Hunger);
		const thirst = entity.getStat<IStatMax>(Stat.Thirst);

		entity.setStat(health, entity.entityType === EntityType.Player ? entity.getMaxHealth() : health.max);
		if (stamina) entity.setStat(stamina, stamina.max);
		if (hunger) entity.setStat(hunger, hunger.max);
		if (thirst) entity.setStat(thirst, thirst.max);

		entity.setStatus(StatusType.Bleeding, false);
		entity.setStatus(StatusType.Burned, false);
		entity.setStatus(StatusType.Poisoned, false);

		if (entity.entityType === EntityType.Player) {
			entity.state = PlayerState.None;
			entity.updateStatsAndAttributes();
		}

		result.updateRender = true;
	}

	@Register.action<[Stat, number]>(description("Set Stat"))
	public setStat(executor: IPlayer, { entity, object: [stat, value] }: IActionArgument<[Stat, number]>, result: IActionResult) {
		entity!.setStat(stat, value);
	}

	@Register.action<boolean>(description("Set Tamed"))
	public setTamed(player: IPlayer, { creature, object: tamed }: IActionArgument<boolean>, result: IActionResult) {
		if (tamed) creature!.tame(player);
		else creature!.release();
	}

	/**
	 * Removes a creature, NPC, item, doodad, corpse, or tile event.
	 */
	@Register.action<[RemovalType, number] | undefined>(description("Remove"))
	public remove(player: IPlayer, { creature, npc, item, doodad, object: otherRemoval }: IActionArgument<[RemovalType, number] | undefined>, result: IActionResult) {
		this.removeInternal(result, otherRemoval || [] as any, creature, npc, item, doodad);

		renderer.computeSpritesInViewport();
		result.updateRender = true;
	}

	@Register.action<number>(description("Set Weight Bonus"))
	public setWeightBonus(executor: IPlayer, { player, object: weightBonus }: IActionArgument<number>, result: IActionResult) {
		this.mod.setPlayerData(player!, "weightBonus", weightBonus);
		player!.updateStrength();
		player!.updateTablesAndWeight();
	}

	@Register.action<TerrainType>(description("Change Terrain"))
	public changeTerrain(player: IPlayer, { object: terrain, position }: IActionArgument<TerrainType>, result: IActionResult) {
		if (!position) return;

		game.changeTile(terrain, position.x, position.y, position.z, false);
		this.setTilled(position.x, position.y, position.z, false);

		renderer.computeSpritesInViewport();
		result.updateRender = true;
	}

	@Register.action<boolean>(description("Toggle Tilled"))
	public toggleTilled(player: IPlayer, { position, object: tilled }: IActionArgument<boolean>, result: IActionResult) {
		if (!position) return;

		this.setTilled(position.x, position.y, position.z, tilled);

		renderer.computeSpritesInViewport();
		result.updateRender = true;
	}

	@Register.action(description("Update Stats and Attributes"))
	public updateStatsAndAttributes(player: IPlayer, argument: IActionArgument, result: IActionResult) {
		player.updateStatsAndAttributes();
	}

	/**
	 * Adds an item to the inventory of a doodad, human, or tile.
	 */
	@Register.action<[ItemType, ItemQuality]>(description("Add Item to Inventory"))
	public addItemToInventory(executor: IPlayer, { doodad, human, point, object: [item, quality] }: IActionArgument<[ItemType, ItemQuality]>, result: IActionResult) {
		if (human) {
			human!.createItemInInventory(item, quality);

			if (human!.entityType === EntityType.Player) {
				(human as IPlayer).updateTablesAndWeight();
			}

		} else if (doodad) {
			itemManager.create(item, doodad as IContainer, quality);

		} else if (point) {
			itemManager.create(item, itemManager.getTileContainer(point.x, point.y, executor.z), quality);
			result.updateView = true;
		}

		if (InspectDialog.INSTANCE) InspectDialog.INSTANCE.update();
	}

	/**
	 * Places terrain, creatures, NPCs, doodads, corpses, and/or tile events on the given tiles.
	 * @param actionArgument.object[0] An array of tile IDs
	 * @param actionArgument.object[1] The data to paint (terrain, creature, npc, etc)
	 */
	// tslint:disable cyclomatic-complexity
	@Register.action<[number[], IPaintData]>(description("Paint"))
	public paint(player: IPlayer, { object: [tiles, data] }: IActionArgument<[number[], IPaintData]>, result: IActionResult) {
		for (const tileId of tiles) {
			const [x, y, z] = getTilePosition(tileId);
			// const tile = game.getTile(x, y, z);
			for (const k in data) {
				const paintType = k as keyof IPaintData;
				switch (paintType) {
					case "terrain": {
						game.changeTile(data.terrain!.type, x, y, z, false);
						if (data.terrain!.tilled !== undefined) this.setTilled(x, y, z, data.terrain!.tilled);
						break;
					}
					case "creature": {
						const creature = game.getTile(x, y, z).creature;
						if (creature) creatureManager.remove(creature);

						const type = data.creature!.type;
						if (type !== "remove") {
							creatureManager.spawn(type, x, y, z, true, data.creature!.aberrant);
						}

						break;
					}
					case "npc": {
						const npc = game.getTile(x, y, z).npc;
						if (npc) npcManager.remove(npc);

						const type = data.npc!.type;
						if (type !== "remove") {
							npcManager.spawn(type, x, y, z);
						}

						break;
					}
					case "doodad": {
						const doodad = game.getTile(x, y, z).doodad;
						if (doodad) doodadManager.remove(doodad);

						const type = data.doodad!.type;
						if (type !== "remove") {
							doodadManager.create(type, x, y, z);
						}

						break;
					}
					case "corpse": {
						if (data.corpse!.replaceExisting || data.corpse!.type === "remove") {
							const corpses = game.getTile(x, y, z).corpses;
							if (corpses) {
								for (const corpse of corpses) {
									corpseManager.remove(corpse);
								}
							}
						}

						const type = data.corpse!.type;
						if (type !== undefined && type !== "remove") {
							corpseManager.create(type, x, y, z, undefined, data.corpse!.aberrant);
						}

						break;
					}
					case "tileEvent": {
						if (data.tileEvent!.replaceExisting || data.tileEvent!.type === "remove") {
							const tileEvents = game.getTile(x, y, z).events;
							if (tileEvents) {
								for (const event of tileEvents) {
									tileEventManager.remove(event);
								}
							}
						}

						const type = data.tileEvent!.type;
						if (type !== undefined && type !== "remove") {
							tileEventManager.create(type, x, y, z);
						}

						break;
					}
				}
			}
		}
	}
	// tslint:enable cyclomatic-complexity

	@Register.action(description("Unlock Recipes"))
	public unlockRecipes(player: IPlayer, argument: IActionArgument, result: IActionResult) {
		const itemTypes = Enums.values(ItemType);

		for (const itemType of itemTypes) {
			const desc = itemDescriptions[itemType];
			if (desc && desc.recipe && desc.craftable !== false && !game.crafted[itemType]) {
				game.crafted[itemType] = {
					newUnlock: true,
					unlockTime: Date.now(),
				};
			}
		}

		game.updateTablesAndWeight();
	}

	@Register.action<boolean>(description("Toggle Invulnerable"))
	public toggleInvulnerable(executor: IPlayer, { player, object: invulnerable }: IActionArgument<boolean>, result: IActionResult) {
		Actions.debugTools.setPlayerData(player!, "invulnerable", invulnerable);
	}

	@Register.action<[SkillType, number]>(description("Set Skill"))
	public setSkill(executor: IPlayer, { player, object: [skill, value] }: IActionArgument<[SkillType, number]>, result: IActionResult) {
		if (!player) return;

		player.skills[skill].core = value;
		player.skills[skill].percent = player.skills[skill].bonus + value;
	}

	@Register.action<boolean>(description("Toggle Noclip"))
	public toggleNoclip(executor: IPlayer, { player, object: noclip }: IActionArgument<boolean>, result: IActionResult) {
		if (!player) return;

		Actions.debugTools.setPlayerData(player, "noclip", noclip ? {
			moving: false,
			delay: Delay.Movement,
		} : false);

		player.moveType = noclip ? MoveType.Flying : MoveType.Land;

		game.updateView(true);
	}

	@Register.action<boolean>(description("Toggle Permissions"))
	public togglePermissions(executor: IPlayer, { player, object: permissions }: IActionArgument<boolean>, result: IActionResult) {
		if (!player) return;

		Actions.debugTools.setPlayerData(player, "permissions", permissions);
	}

	////////////////////////////////////
	// Helpers
	//

	private removeInternal(result: IActionResult, [type, id]: [RemovalType, number], creature?: ICreature | false, npc?: INPC | false, item?: IItem | false, doodad?: IDoodad | false) {
		if (creature) return creatureManager.remove(creature);
		if (npc) return npcManager.remove(npc);
		if (doodad) return doodadManager.remove(doodad, true);
		if (item) return this.removeItem(result, item);
		if (type === RemovalType.Corpse) return corpseManager.remove(game.corpses[id]!);
		if (type === RemovalType.TileEvent) return tileEventManager.remove(game.tileEvents[id]!);
	}

	private removeItem(result: IActionResult, item: IItem) {
		const container = item!.containedWithin;
		itemManager.remove(item!);

		if (container) {
			if ("data" in container) {
				result.updateView = true; // we removed the item from a tile

			} else if ("entityType" in container) {
				const entity = container as IBaseEntity;
				if (entity.entityType === EntityType.Player) {
					(entity as IPlayer).updateTablesAndWeight();
				}
			}
		}

		if (InspectDialog.INSTANCE) InspectDialog.INSTANCE.update();
	}

	private resurrectCorpse(player: IPlayer, corpse: ICorpse) {
		// blood can't be resurrected
		if (corpse.type === CreatureType.Blood || corpse.type === CreatureType.WaterBlood) {
			return false;
		}

		// fail if the location is blocked
		const location = this.getPosition(player, new Vector3(corpse), () => translation(DebugToolsTranslation.ActionResurrect)
			.get(game.getName(corpse, SentenceCaseStyle.Sentence, true)));

		if (!location) return false;

		const creature = creatureManager.spawn(corpse.type, corpse.x, corpse.y, corpse.z, true, corpse.aberrant);
		creature!.renamed = corpse.renamed;
		corpseManager.remove(corpse);

		renderer.computeSpritesInViewport();
		return true;
	}

	private setTilled(x: number, y: number, z: number, tilled: boolean) {
		const tile = game.getTile(x, y, z);

		const tileType = TileHelpers.getType(tile);
		if (!terrainDescriptions[tileType]!.tillable) {
			return;
		}

		const tileData = game.getOrCreateTileData(x, y, z);
		if (tileData.length === 0) {
			tileData.push({
				type: tileType,
				tilled,
			});

		} else {
			tileData[0].tilled = tilled;
		}

		TileHelpers.setTilled(tile, tilled);

		world.updateTile(x, y, z, tile);
	}

	/**
	 * Given a position, finds an open tile, or sends an error message to executing player.
	 * @param player The executing player of an action.
	 * @param position The position to start looking for an open tile.
	 * @param actionName The name of the action the player is attempting to execute. This is printed in the error message.
	 */
	private getPosition(player: IPlayer, position: IVector3, actionName: TranslationGenerator) {
		if (TileHelpers.isOpenTile(position, game.getTile(position.x, position.y, position.z))) return position;

		const openTile = TileHelpers.findMatchingTile(position, TileHelpers.isOpenTile);

		if (!openTile) {
			player.messages.source(Actions.debugTools.source)
				.type(MessageType.Bad)
				.send(this.messageFailureTileBlocked, Text.resolve(actionName));
		}

		return openTile;
	}

	/**
	 * Copies stats and status effects from one entity to another.
	 */
	private copyStats(from: IBaseEntity, to: IBaseEntity) {
		for (const statName in from.stats) {
			const stat = Stat[statName as keyof typeof Stat];
			const statObject = from.getStat(stat)!;
			to.setStat(stat, statObject.value);
			const cloneStatObject = to.getStat(stat)!;
			if ("max" in statObject) to.setStatMax(stat, statObject.max!);
			if ("canExceedMax" in statObject) cloneStatObject.canExceedMax = statObject.canExceedMax;
			if ("bonus" in statObject) to.setStatBonus(stat, statObject.bonus!);
			if ("changeTimer" in statObject) {
				to.setStatChangeTimer(stat, statObject.changeTimer!, statObject.changeAmount);
				(cloneStatObject as any).nextChangeTimer = statObject.nextChangeTimer!;
			}
		}

		for (const statusEffect of from.statuses()) {
			to.setStatus(statusEffect, true);
		}
	}

	/**
	 * Clones an entity to another position. Given a player, clones a matching NPC.
	 */
	private cloneEntity(entity: ICreature | INPC | IPlayer, position: IVector3) {
		let clone: ICreature | INPC | IPlayer;

		if (entity.entityType === EntityType.Creature) {
			clone = creatureManager.spawn(entity.type, position.x, position.y, position.z, true, entity.aberrant)!;

			if (entity.isTamed()) clone.tame(entity.getOwner()!);
			clone.renamed = entity.renamed;
			clone.ai = entity.ai;
			clone.enemy = entity.enemy;
			clone.enemyAttempts = entity.enemyAttempts;
			clone.enemyIsPlayer = entity.enemyIsPlayer;

		} else {
			clone = npcManager.spawn(NPCType.Merchant, position.x, position.y, position.z)!;
			clone.customization = { ...entity.customization };
			clone.renamed = entity.getName();
			this.cloneInventory(entity, clone);
		}

		clone.direction = new Vector2(entity.direction).raw();
		clone.facingDirection = entity.facingDirection;

		this.copyStats(entity, clone);

		if (clone.entityType === EntityType.NPC) {
			clone.ai = AiType.Neutral;
		}
	}

	/**
	 * Clones the inventory from one human entity to another.
	 */
	private cloneInventory(from: IBaseHumanEntity, to: IBaseHumanEntity) {
		for (const item of to.inventory.containedItems) {
			itemManager.remove(item);
		}

		for (const item of to.getEquippedItems()) {
			itemManager.remove(item);
		}

		for (const item of from.inventory.containedItems) {
			const clone = to.createItemInInventory(item.type, item.quality);
			clone.ownerIdentifier = item.ownerIdentifier;
			clone.minDur = item.minDur;
			clone.maxDur = item.maxDur;
			clone.renamed = item.renamed;
			clone.weight = item.weight;
			clone.weightCapacity = item.weightCapacity;
			clone.legendary = item.legendary && { ...item.legendary };
			if (item.isEquipped()) to.equip(clone, item.getEquipSlot()!);
		}
	}

	/**
	 * Clones a doodad to another position.
	 */
	private cloneDoodad(doodad: IDoodad, position: IVector3) {
		const clone = doodadManager.create(doodad.type, position.x, position.y, position.z, {
			gatherReady: doodad.gatherReady,
			gfx: doodad.gfx,
			spread: doodad.spread,
			treasure: doodad.treasure,
			weight: doodad.weight,
			legendary: doodad.legendary ? { ...doodad.legendary } : undefined,
			disassembly: !doodad.disassembly ? undefined : doodad.disassembly
				.map(item => itemManager.createFake(item.type, item.quality)),
			ownerIdentifier: doodad.ownerIdentifier,
			item: !doodad.item ? undefined : itemManager.createFake(doodad.item.type, doodad.item.quality),
			step: doodad.step,
		});

		if (!clone) return;

		if (doodad.containedItems) {
			this.cloneContainedItems(doodad, clone);
		}
	}

	/**
	 * Clones the items in one container to another. If a container is empty or invalid, returns silently.
	 */
	private cloneContainedItems(from: Partial<IContainer>, to: Partial<IContainer>) {
		if (!("containedItems" in from) || !("containedItems" in to)) return;

		for (const item of from.containedItems || []) {
			const clone = itemManager.create(item.type, to as IContainer, item.quality);
			clone.ownerIdentifier = item.ownerIdentifier;
			clone.minDur = item.minDur;
			clone.maxDur = item.maxDur;
			clone.renamed = item.renamed;
			clone.weight = item.weight;
			clone.weightCapacity = item.weightCapacity;
			clone.legendary = item.legendary && { ...item.legendary };
		}
	}
}

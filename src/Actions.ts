import { ActionCallback, IActionArgument, IActionDescription, IActionResult } from "action/IAction";
import { ICorpse } from "creature/corpse/ICorpse";
import { ICreature } from "creature/ICreature";
import IBaseEntity from "entity/IBaseEntity";
import IBaseHumanEntity from "entity/IBaseHumanEntity";
import { AiType, EntityType } from "entity/IEntity";
import { IStatMax, Stat } from "entity/IStats";
import { ActionType, CreatureType, DamageType, Delay, ItemQuality, ItemType, MoveType, NPCType, PlayerState, SentenceCaseStyle, SkillType, StatusType, TerrainType } from "Enums";
import itemDescriptions from "item/Items";
import { Message, MessageType } from "language/IMessages";
import { spawnTemplate } from "mapgen/MapGenHelpers";
import Register, { Registry } from "mod/ModRegistry";
import { TranslationGenerator } from "newui/component/IComponent";
import Text from "newui/component/Text";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import terrainDescriptions from "tile/Terrains";
import Enums from "utilities/enum/Enums";
import { IVector3 } from "utilities/math/IVector";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import TileHelpers from "utilities/TileHelpers";
import DebugTools, { translation } from "./DebugTools";
import { DebugToolsTranslation } from "./IDebugTools";
import { IPaintData } from "./ui/DebugToolsDialog";
import { getTilePosition } from "./util/TilePosition";

export enum RemovalType {
	Corpse,
}

function description(name: string): IActionDescription {
	return { name, usableAsGhost: true, usableWhenPaused: true, ignoreHasDelay: true };
}

export default class Actions {

	public static get<K extends keyof Actions>(name: K): ActionType {
		const action = DebugTools.INSTANCE.actions[name];
		if (typeof action !== "function") {
			return undefined as any;
		}

		return Registry.id(action as ActionCallback) as any;
	}

	@Register.message("FailureTileBlocked")
	public messageFailureTileBlocked: Message;

	public constructor(private readonly mod: DebugTools) { }

	@Register.action<any>(description("Select"))
	public select(player: IPlayer, argument: IActionArgument<any>, result: IActionResult) {
		const selectAction = argument.object as {
			type: string;
			id: number;
		};

		const { x, y, z } = player.getFacingPoint();

		switch (selectAction.type) {
			case "change-tile":
				game.changeTile({ type: selectAction.id }, x, y, z, false);
				break;

			case "spawn-creature":
				creatureManager.spawn(selectAction.id, x, y, z, true);
				break;

			case "spawn-npc":
				npcManager.spawn(selectAction.id, x, y, z);
				break;

			case "item-get":
				player.createItemInInventory(selectAction.id);
				player.updateTablesAndWeight();
				break;

			case "place-env-item":
				// Remove if Doodad already there
				const tile = game.getTile(x, y, z);
				if (tile.doodad) {
					doodadManager.remove(tile.doodad);
				}

				doodadManager.create(selectAction.id, x, y, z);
				break;

			case "place-tile-event":
				tileEventManager.create(selectAction.id, x, y, z);
				break;

			case "place-corpse":
				corpseManager.create(selectAction.id, x, y, z);
				break;

			case "spawn-template":
				spawnTemplate(selectAction.id, x, y, z);
				break;
		}

		player.updateStatsAndAttributes();

		result.updateView = true;
	}

	////////////////////////////////////
	// New Actions
	//

	@Register.action<[number, number, number]>(description("Teleport Entity"))
	public teleport(player: IPlayer, { object: xyz, creature, npc }: IActionArgument<[number, number, number]>, result: IActionResult) {
		const entity = creature || npc || player;

		let position: IVector3 = new Vector3(xyz);

		if (!TileHelpers.isOpenTile(position, game.getTile(...new Vector3(position).xyz))) {
			position = TileHelpers.findMatchingTile(position, TileHelpers.isOpenTile)!;
		}

		if (entity.entityType === EntityType.Creature) {
			const tile = game.getTile(entity.x, entity.y, entity.z);
			delete tile.creature;
		}

		if (entity.entityType === EntityType.NPC) {
			const tile = game.getTile(entity.x, entity.y, entity.z);
			delete tile.npc;
		}

		entity.x = entity.fromX = position.x;
		entity.y = entity.fromY = position.y;
		entity.z = position.z;

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

	@Register.action(description("Remove All Creatures"))
	public removeAllCreatures(player: IPlayer, argument: IActionArgument, result: IActionResult) {
		for (let i = 0; i < game.creatures.length; i++) {
			if (game.creatures[i] !== undefined) {
				creatureManager.remove(game.creatures[i]!);
			}
		}

		game.creatures = [];

		game.updateView(false);
	}

	@Register.action(description("Remove All NPCs"))
	public removeAllNPCs(player: IPlayer, argument: IActionArgument, result: IActionResult) {
		for (let i = 0; i < game.npcs.length; i++) {
			if (game.npcs[i] !== undefined) {
				npcManager.remove(game.npcs[i]!);
			}
		}

		game.npcs = [];

		game.updateView(false);
	}

	@Register.action(description("Update Stats and Attributes"))
	public updateStatsAndAttributes(player: IPlayer, argument: IActionArgument, result: IActionResult) {
		player.updateStatsAndAttributes();
	}

	@Register.action<[boolean, PlayerState?]>(description("Toggle Spectating"))
	public toggleSpectating(player: IPlayer, { object: [isSpectating, playerState] }: IActionArgument<[boolean, PlayerState?]>, result: IActionResult) {
		if (isSpectating) {
			player.state = PlayerState.Ghost;

		} else {
			player.state = playerState!;
		}
	}

	@Register.action(description("Kill"))
	public kill(player: IPlayer, { creature, npc }: IActionArgument, result: IActionResult) {
		const entity = creature || npc || player;

		entity.damage({
			type: DamageType.True,
			amount: Infinity,
			damageMessage: translation(DebugToolsTranslation.KillEntityDeathMessage).getString(),
		});

		renderer.computeSpritesInViewport();
		result.updateRender = true;
	}

	@Register.action(description("Clone"))
	public clone(player: IPlayer, { creature, npc, point }: IActionArgument, result: IActionResult) {
		const entity = creature || npc || player;
		let clone: ICreature | INPC | IPlayer;

		const pos = this.getPosition(new Vector3(point!.x, point!.y, entity.z), () => translation(DebugToolsTranslation.ActionClone)
			.get(game.getName(entity)));

		if (!pos) return;

		if (entity.entityType === EntityType.Creature) {
			clone = creatureManager.spawn(entity.type, pos.x, pos.y, pos.z, true, entity.aberrant)!;

			if (entity.isTamed()) clone.tame(entity.getOwner()!);
			clone.renamed = entity.renamed;
			clone.ai = entity.ai;
			clone.enemy = entity.enemy;
			clone.enemyAttempts = entity.enemyAttempts;
			clone.enemyIsPlayer = entity.enemyIsPlayer;

		} else {
			clone = npcManager.spawn(NPCType.Merchant, point!.x, point!.y, entity.z)!;
			clone.customization = { ...entity.customization };
			clone.renamed = entity.getName();
			this.cloneInventory(entity, clone);
		}

		clone.direction = new Vector2(entity.direction);
		clone.facingDirection = entity.facingDirection;

		this.copyStats(entity, clone);

		if (clone.entityType === EntityType.NPC) {
			clone.ai = AiType.Neutral;
		}

		renderer.computeSpritesInViewport();
		result.updateRender = true;
	}

	@Register.action<number>(description("Set Time"))
	public setTime(player: IPlayer, argument: IActionArgument<number>, result: IActionResult) {
		game.time.setTime(argument.object);
		game.updateRender = true;
		fieldOfView.compute();
	}

	@Register.action<number>(description("Heal"))
	public heal(player: IPlayer, { creature, npc, object: corpseId }: IActionArgument<number>, result: IActionResult) {
		const entity = creature || npc || game.corpses[corpseId] || player;

		// resurrect corpses
		if (!("entityType" in entity)) {
			result.updateRender = this.resurrectCorpse(entity);
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
	public setStat(player: IPlayer, { object: [stat, value], creature, npc }: IActionArgument<[Stat, number]>, result: IActionResult) {
		(creature || npc || player).setStat(stat, value);
	}

	@Register.action<boolean>(description("Set Tamed"))
	public setTamed(player: IPlayer, { creature, object: tamed }: IActionArgument<boolean>, result: IActionResult) {
		if (tamed) creature!.tame(player);
		else creature!.release();
	}

	@Register.action<[RemovalType, number]>(description("Remove"))
	public remove(player: IPlayer, { creature, npc, object: otherRemoval }: IActionArgument<[RemovalType, number]>, result: IActionResult) {
		this.removeInternal(otherRemoval || [] as any, creature, npc);

		renderer.computeSpritesInViewport();
		result.updateRender = true;
	}

	@Register.action<number>(description("Set Weight Bonus"))
	public setWeightBonus(player: IPlayer, { object: weightBonus }: IActionArgument<number>, result: IActionResult) {
		this.mod.setPlayerData(player, "weightBonus", weightBonus);
		player.updateStrength();

		game.updateTablesAndWeight();
	}

	@Register.action<TerrainType>(description("Change Terrain"))
	public changeTerrain(player: IPlayer, { object: terrain, point }: IActionArgument<TerrainType>, result: IActionResult) {
		game.changeTile(terrain, point!.x, point!.y, player.z, false);
		this.setTilled(point!.x, point!.y, player.z, false);

		renderer.computeSpritesInViewport();
		result.updateRender = true;
	}

	@Register.action<boolean>(description("Toggle Tilled"))
	public toggleTilled(player: IPlayer, { object: tilled, point }: IActionArgument<boolean>, result: IActionResult) {
		this.setTilled(point!.x, point!.y, player.z, tilled);

		renderer.computeSpritesInViewport();
		result.updateRender = true;
	}

	@Register.action<[ItemType, ItemQuality]>(description("Add Item to Inventory"))
	public addItemToInventory(human: IBaseHumanEntity, { object: [item, quality] }: IActionArgument<[ItemType, ItemQuality]>, result: IActionResult) {
		human.createItemInInventory(item, quality);

		game.updateTablesAndWeight();
	}

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
	public toggleInvulnerable(player: IPlayer, { object: invulnerable }: IActionArgument<boolean>, result: IActionResult) {
		DebugTools.INSTANCE.setPlayerData(player, "invulnerable", invulnerable);
	}

	@Register.action<[SkillType, number]>(description("Set Skill"))
	public setSkill(player: IPlayer, { object: [skill, value] }: IActionArgument<[SkillType, number]>, result: IActionResult) {
		player.skills[skill].core = value;
		player.skills[skill].percent = player.skills[skill].bonus + value;
	}

	@Register.action<boolean>(description("Toggle Noclip"))
	public toggleNoclip(player: IPlayer, { object: noclip }: IActionArgument<boolean>, result: IActionResult) {
		DebugTools.INSTANCE.setPlayerData(player, "noclip", noclip ? {
			moving: false,
			delay: Delay.Movement,
		} : false);

		player.moveType = noclip ? MoveType.Flying : MoveType.Land;

		game.updateView(true);
	}

	////////////////////////////////////
	// Helpers
	//

	private removeInternal([type, id]: [RemovalType, number], creature?: ICreature, npc?: INPC) {
		if (creature) return creatureManager.remove(creature);
		if (npc) return npcManager.remove(npc);
		if (type === RemovalType.Corpse) return corpseManager.remove(game.corpses[id]!);
	}

	private resurrectCorpse(corpse: ICorpse) {
		// blood can't be resurrected
		if (corpse.type === CreatureType.Blood || corpse.type === CreatureType.WaterBlood) {
			return false;
		}

		// fail if the location is blocked
		const location = this.getPosition(new Vector3(corpse), () => translation(DebugToolsTranslation.ActionResurrect)
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

	private getPosition(position: Vector3, actionName: TranslationGenerator) {
		if (TileHelpers.isOpenTile(position, game.getTile(...position.xyz))) return position;

		const openTile = TileHelpers.findMatchingTile(position, TileHelpers.isOpenTile);

		if (!openTile) {
			localPlayer.messages.source(DebugTools.INSTANCE.source)
				.type(MessageType.Bad)
				.send(this.messageFailureTileBlocked, Text.resolve(actionName));
		}

		return openTile;
	}

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

	private cloneInventory(from: IBaseHumanEntity, to: IBaseHumanEntity) {
		for (const item of to.inventory.containedItems) {
			itemManager.remove(item);
		}

		for (const item of to.getEquippedItems()) {
			itemManager.remove(item);
		}

		for (const item of from.inventory.containedItems) {
			const clone = itemManager.create(item.type, to.inventory, item.quality);
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
}

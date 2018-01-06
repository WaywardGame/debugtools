import Corpses from "creature/corpse/Corpses";
import Creatures from "creature/Creatures";
import { ICreature } from "creature/ICreature";
import Doodads from "doodad/Doodads";
import { ActionType, CreatureType, Delay, DoodadType, FacingDirection, ItemType, MoveType, PlayerState, SfxType, Source, TerrainType, WorldZ } from "Enums";
import Items from "item/Items";
import * as MapGenHelpers from "mapgen/MapGenHelpers";
import Mod from "mod/Mod";
import IPlayer from "Player/IPlayer";
import { ParticleType } from "renderer/particle/IParticle";
import Particles from "renderer/particle/Particles";
import * as Shaders from "renderer/Shaders";
import { ITile, TileTemplateType } from "tile/ITerrain";
import { TileEventType } from "tile/ITileEvent";
import Terrains from "tile/Terrains";
import TerrainTemplates from "tile/TerrainTemplates";
import TileEvents from "tile/TileEvents";
import * as Utilities from "Utilities";

import { IActionArgument, IActionResult } from "action/IAction";
import { BindCatcherApi } from "newui/BindingManager";
import { CheckButton } from "newui/util/CheckButton";
import { DevToolsMessage } from "./IDeveloperTools";
import { Inspection } from "./Inspection";

interface SelectAction {
	type: string;
	id: number;
}

interface ISaveData {
	loadedCount: number;
	playerData: { [index: string]: IPlayerData };
}

interface IPlayerData {
	inMove: boolean;
	noclipDelay: number;
}

interface ISaveDataGlobal {
	initializedCount: number;
	autoOpen: boolean;
}

export default class DeveloperTools extends Mod {
	private elementDialog: JQuery;
	private keyBindDialog: number;
	private keyBindSelectLocation: number;
	private elementContainer: JQuery;
	private elementInner: JQuery;
	private elementDayNightTime: JQuery;
	private elementReputationValue: JQuery;
	private elementWeightBonusValue: JQuery;
	private inspection: Inspection;
	private isPlayingAudio = false;
	private audioToPlay: number;
	private isCreatingParticle = false;
	private particleToCreate: number;

	private dictionary: number;

	private selectAction: number;
	private setTimeAction: number;
	private setReputationAction: number;
	private setWeightBonusAction: number;
	private refreshStatsAction: number;
	private killAllCreaturesAction: number;
	private unlockRecipesAction: number;
	private reloadShadersAction: number;
	private noclipAction: number;
	private toggleTilledAction: number;
	private teleportToHostAction: number;
	private tameCreatureAction: number;

	private data: ISaveData;
	private globalData: ISaveDataGlobal;

	public onInitialize(saveDataGlobal: any): any {
		this.keyBindDialog = this.addBindable("Toggle", { key: "Backslash" });
		this.keyBindSelectLocation = this.addBindable("SelectLocation", { mouseButton: 0 });
		this.dictionary = this.addDictionary("DeveloperTools", DevToolsMessage);

		this.globalData = saveDataGlobal ? saveDataGlobal : {
			initializedCount: 0,
			autoOpen: false
		};
		this.globalData.initializedCount++;

		Utilities.Console.log(Source.Mod, `Initialized developer tools ${this.globalData.initializedCount} times.`);

		this.createOptionsSection((uiApi, section) => {
			new CheckButton(uiApi, {
				text: {
					dictionary: this.dictionary,
					entry: DevToolsMessage.OptionsAutoOpen
				},
				refresh: () => !!this.globalData.autoOpen,
				onChange: (_, checked) => {
					this.globalData.autoOpen = checked;
				}
			}).appendTo(section);
		});
	}

	public onUninitialize(): any {
		Utilities.Console.log(Source.Mod, "Uninitialized developer tools!");

		return this.globalData;
	}

	public onLoad(saveData: any): void {
		this.data = saveData;

		if (!this.data || !this.data.loadedCount) {
			this.data = {
				loadedCount: 0,
				playerData: {}
			};
		}

		this.data.playerData = this.data.playerData || {};

		this.inspection = new Inspection(this.dictionary);

		Utilities.Console.log(Source.Mod, `Loaded developer tools ${this.data.loadedCount} times.`, this.data);

		this.addCommand("refresh", (player: IPlayer) => {
			actionManager.execute(player, this.refreshStatsAction);
		});

		this.selectAction = this.addActionType({ name: "Select", usableAsGhost: true }, (player: IPlayer, argument: IActionArgument, result: IActionResult) => {
			const selectAction = argument.object as SelectAction;

			switch (selectAction.type) {
				case "change-tile":
					game.changeTile({ type: selectAction.id }, player.x + player.direction.x, player.y + player.direction.y, player.z, false);
					break;

				case "spawn-creature":
					creatureManager.spawn(selectAction.id, player.x + player.direction.x, player.y + player.direction.y, player.z, true);
					break;

				case "item-get":
					player.createItemInInventory(selectAction.id);
					player.updateTablesAndWeight();
					break;

				case "place-env-item":
					// Remove if Doodad already there
					const tile = game.getTile(player.x + player.direction.x, player.y + player.direction.y, player.z);
					if (tile.doodad) {
						doodadManager.remove(tile.doodad);
					}

					doodadManager.create(selectAction.id, player.x + player.direction.x, player.y + player.direction.y, player.z);
					break;

				case "place-tile-event":
					tileEventManager.create(selectAction.id, player.x + player.direction.x, player.y + player.direction.y, player.z);
					break;

				case "place-corpse":
					corpseManager.create(selectAction.id, player.x + player.direction.x, player.y + player.direction.y, player.z);
					break;

				case "spawn-template":
					MapGenHelpers.spawnTemplate(selectAction.id, player.x + player.direction.x, player.y + player.direction.y, player.z);
					break;
			}

			player.updateStatsAndAttributes();

			result.updateView = true;
		});

		this.setTimeAction = this.addActionType({ name: "Set Time", usableAsGhost: true }, (player: IPlayer, argument: IActionArgument, result: IActionResult) => {
			game.time.setTime(argument.object);

			game.updateRender = true;

			fieldOfView.compute();

			if (player.isLocalPlayer()) {
				this.updateSliders();
			}
		});

		this.setReputationAction = this.addActionType({ name: "Set Reputation", usableAsGhost: true }, (player: IPlayer, argument: IActionArgument, result: IActionResult) => {
			player.benignity = 0;
			player.malignity = 0;

			player.updateReputation(argument.object);

			if (player.isLocalPlayer()) {
				this.updateSliders();
				ui.refreshAttributes();
			}
		});

		this.setWeightBonusAction = this.addActionType({ name: "Set Weight Bonus", usableAsGhost: true }, (player: IPlayer, argument: IActionArgument, result: IActionResult) => {

			player.weightBonus = argument.object;

			if (player.isLocalPlayer()) {
				this.updateSliders();
				ui.refreshAttributes();
			}

			game.updateTablesAndWeight();
		});

		this.refreshStatsAction = this.addActionType({ name: "Refresh Stats", usableAsGhost: true }, (player: IPlayer, argument: IActionArgument, result: IActionResult) => {
			player.stats.health.value = player.getMaxHealth();
			player.stats.stamina.value = player.dexterity;
			player.stats.hunger.value = player.starvation;
			player.stats.thirst.value = player.dehydration;
			player.status.bleeding = false;
			player.status.burned = false;
			player.status.poisoned = false;
			player.state = PlayerState.None;
			player.updateStatsAndAttributes();
		});

		this.killAllCreaturesAction = this.addActionType({ name: "Kill All Creatures", usableAsGhost: true }, (player: IPlayer, argument: IActionArgument, result: IActionResult) => {
			for (let i = 0; i < game.creatures.length; i++) {
				if (game.creatures[i] !== undefined) {
					creatureManager.remove(game.creatures[i]);
				}
			}

			game.creatures = [];

			game.updateView(false);
		});

		this.unlockRecipesAction = this.addActionType({ name: "Unlock Recipes", usableAsGhost: true }, (player: IPlayer, argument: IActionArgument, result: IActionResult) => {
			const itemTypes = Utilities.Enums.getValues(ItemType);

			for (const itemType of itemTypes) {
				const description = Items[itemType];
				if (description && description.recipe && description.craftable !== false && !game.crafted[itemType]) {
					game.crafted[itemType] = {
						newUnlock: true,
						unlockTime: Date.now()
					};
				}
			}

			game.updateTablesAndWeight();
		});

		this.reloadShadersAction = this.addActionType({ name: "Reload Shaders", usableAsGhost: true }, (player: IPlayer, argument: IActionArgument, result: IActionResult) => {
			Shaders.loadShaders(() => {
				Shaders.compileShaders();
				game.updateView(true);
			});
		});

		this.noclipAction = this.addActionType({ name: "Noclip" }, (player: IPlayer, argument: IActionArgument, result: IActionResult) => {
			if (player.moveType === MoveType.Flying) {
				player.moveType = MoveType.Land;

			} else {
				player.moveType = MoveType.Flying;
			}

			game.updateView(true);
		});

		this.toggleTilledAction = this.addActionType({ name: "Toggle Tilled", usableAsGhost: true }, (player: IPlayer, argument: IActionArgument, result: IActionResult) => {
			const x = player.x + player.direction.x;
			const y = player.y + player.direction.y;
			const z = player.z;
			const tile = game.getTile(x, y, z);

			const tileType = Utilities.TileHelpers.getType(tile);
			if (!Terrains[tileType].tillable) {
				return;
			}

			game.tileData[x] = game.tileData[x] || [];
			game.tileData[x][y] = game.tileData[x][y] || [];
			game.tileData[x][y][player.z] = game.tileData[x][y][z] || [];

			const tileData = game.tileData[x][y][z];
			if (tileData.length === 0) {
				tileData.push({
					type: tileType,
					tilled: true
				});

			} else {
				tileData[0].tilled = tileData[0].tilled ? false : true;
			}

			Utilities.TileHelpers.setTilled(tile, tileData[0].tilled);

			world.updateTile(x, y, z, tile);

			renderer.computeSpritesInViewport();
			game.updateRender = true;
		});

		this.teleportToHostAction = this.addActionType({ name: "Teleport to Host", usableAsGhost: true }, (player: IPlayer, argument: IActionArgument, result: IActionResult) => {
			if (players.length < 0) {
				return;
			}

			// assume host is pid 0
			const nearbyOpenTile = Utilities.TileHelpers.findMatchingTile(players[0], Utilities.TileHelpers.isOpenTile);

			player.x = player.fromX = nearbyOpenTile.x;
			player.y = player.fromY = nearbyOpenTile.y;
			player.z = nearbyOpenTile.z;

			game.updateView(true);
		});

		this.tameCreatureAction = this.addActionType({ name: "Force Tame Creature", usableAsGhost: true }, (player: IPlayer, argument: IActionArgument, result: IActionResult) => {
			const tile = game.getTileInFrontOfPlayer(player);
			if (!tile) {
				return;
			}

			const creature = tile.creature;
			if (creature === undefined) {
				return;
			}

			creature.tame(player);

			creature.queueSoundEffect(SfxType.CreatureNoise);

			creature.happiness = 9999999;

			Utilities.Console.log(Source.Mod, "Tamed creature", creature);
		});
	}

	public onSave(): any {
		this.data.loadedCount++;
		return this.data;
	}

	///////////////////////////////////////////////////
	// Hooks

	public onGameStart(isLoadingSave: boolean): void {
		// disable hints/notes
		saveDataGlobal.options.openNotesAutomatically = false;
	}

	public isPlayerSwimming(player: IPlayer, isSwimming: boolean): boolean {
		return player.moveType === MoveType.Flying ? false : undefined;
	}

	public onShowInGameScreen(): void {
		this.elementContainer = $("<div></div>");
		this.elementInner = $('<div class="inner"></div>');
		this.elementContainer.append(this.elementInner);

		let html = this.generateSelect(TerrainType, Terrains, "change-tile", "Change Tile");
		html += this.generateSelect(CreatureType, Creatures, "spawn-creature", "Spawn Creature");
		html += this.generateSelect(ItemType, Items, "item-get", "Get Item");
		html += this.generateSelect(DoodadType, Doodads, "place-env-item", "Place Doodad");
		html += this.generateSelect(TileEventType, TileEvents, "place-tile-event", "Place Tile Event");
		html += this.generateSelect(CreatureType, Corpses, "place-corpse", "Place Corpse");
		html += this.generateSelect(TileTemplateType, TerrainTemplates, "spawn-template", "Spawn Template");
		html += this.generateSelect(SfxType, undefined, "play-audio", "Play Audio");
		html += this.generateSelect(ParticleType, undefined, "create-particle", "Create Particle");

		html += '<br />Time: <div id="daynighttime"></div><input id="daynightslider" type="range" min="0.0" max="1.0" step="0.01" data-range-id="daynight" />';

		html += '<br />Reputation: <div id="reputationslidervalue"></div><input id="reputationslider" type="range" min="-64000" max="64000" step="1" data-range-id="reputation" />';

		html += '<br />Weight Bonus: <div id="weightbonusvalue"></div><input id="weightbonusslider" type="range" min="0" max="2500" step="1" data-range-id="weightbonus" />';

		this.elementInner.append(html);
		this.elementDayNightTime = this.elementInner.find("#daynighttime");
		this.elementReputationValue = this.elementInner.find("#reputationslidervalue");
		this.elementWeightBonusValue = this.elementInner.find("#weightbonusvalue");

		this.elementInner.on("click", ".select-control", function () {
			$(`.${$(this).data("control")}`).trigger("change");
		});

		const self = this;

		this.elementInner.on("input change", "#daynightslider", function () {
			actionManager.execute(localPlayer, self.setTimeAction, {
				object: parseFloat($(this).val())
			});
		});

		this.elementInner.on("input change", "#reputationslider", function () {
			actionManager.execute(localPlayer, self.setReputationAction, {
				object: parseFloat($(this).val())
			});
		});

		this.elementInner.on("input change", "#weightbonusslider", function () {
			actionManager.execute(localPlayer, self.setWeightBonusAction, {
				object: parseFloat($(this).val())
			});
		});

		this.elementInner.on("change", "select", function () {
			const id = parseInt($(this).find("option:selected").data("id"), 10);
			if (id < 0) {
				return;
			}

			const selectId = $(this).data("selectid");
			if (selectId) {
				if (selectId === "play-audio") {
					self.isPlayingAudio = !self.isPlayingAudio;
					$("[data-control='play-audio']").toggleClass("active", self.isPlayingAudio);
					self.audioToPlay = id;

				} else if (selectId === "create-particle") {
					self.isCreatingParticle = !self.isCreatingParticle;
					$("[data-control='create-particle']").toggleClass("active", self.isCreatingParticle);
					self.particleToCreate = id;

				} else {
					actionManager.execute(localPlayer, self.selectAction, {
						object: {
							type: selectId,
							id: id
						} as SelectAction
					});
				}
			}
		});

		this.elementInner.append(
			$("<button>Inspect</button>").click(() => this.inspection.queryInspection()),
			$("<button>Refresh Stats</button>").click(() => actionManager.execute(localPlayer, this.refreshStatsAction)),
			$("<button>Kill All Creatures</button>").click(() => actionManager.execute(localPlayer, this.killAllCreaturesAction)),
			$("<button>Unlock Recipes</button>").click(() => actionManager.execute(localPlayer, this.unlockRecipesAction)),
			$("<button>Reload Shaders</button>").click(() => actionManager.execute(localPlayer, this.reloadShadersAction)),
			$("<button>Noclip</button>").click(() => actionManager.execute(localPlayer, this.noclipAction)),

			$("<button>Toggle FOV</button>").click(() => {
				fieldOfView.disabled = !fieldOfView.disabled;
				game.updateView(true);
			}),

			$("<button>Zoom Out</button>").click(() => {
				renderer.setTileScale(0.15);
				renderer.computeSpritesInViewport();
				game.updateRender = true;
			}),

			$("<button>Toggle Tilled</button>").click(() => actionManager.execute(localPlayer, this.toggleTilledAction)),

			$("<button>Travel Away</button>").click(() => {
				if (multiplayer.isConnected()) {
					return;
				}

				const teleportToSea = () => {
					for (let y = 0; y < game.mapSize; y++) {
						for (let x = 0; x < game.mapSize; x++) {
							const tile = game.getTile(x, y, WorldZ.Overworld);
							if (Utilities.TileHelpers.getType(tile) === TerrainType.DeepSeawater) {
								localPlayer.x = localPlayer.fromX = x;
								localPlayer.y = localPlayer.fromY = y;
								localPlayer.z = WorldZ.Overworld;

								game.updateView(true);
								return;
							}
						}
					}
				};

				teleportToSea();

				localPlayer.createItemInInventory(ItemType.GoldCoins);
				localPlayer.createItemInInventory(ItemType.GoldenChalice);
				localPlayer.createItemInInventory(ItemType.GoldenKey);
				localPlayer.createItemInInventory(ItemType.GoldenRing);
				localPlayer.createItemInInventory(ItemType.GoldenSword);

				const boat = localPlayer.createItemInInventory(ItemType.Sailboat);

				actionManager.execute(localPlayer, ActionType.TraverseTheSea, { item: boat });
			}),

			$("<button>Teleport to Host</button>").click(() => actionManager.execute(localPlayer, this.teleportToHostAction)),

			$("<button>Tame</button>").click(() => actionManager.execute(localPlayer, this.tameCreatureAction)),

			$("<button>Reset WebGL</button>").click(() => {
				game.resetWebGL();
			})
		);

		this.elementDialog = this.createDialog(this.elementContainer, {
			id: this.getName(),
			title: "Developer Tools",
			open: this.globalData.autoOpen,
			x: 20,
			y: 180,
			width: 490,
			height: "auto",
			resizable: false,
			onOpen: () => {
				this.updateSliders();
			}
		});
	}

	public onGameTickEnd() {
		this.inspection.update();
		this.updateSliders();
	}

	public canClientMove(): false | undefined {
		if (this.inspection.isQueryingInspection() || this.isPlayingAudio || this.isCreatingParticle) {
			return false;
		}

		return undefined;
	}

	public onBindLoop(bindPressed: true | undefined, api: BindCatcherApi): true | undefined {
		if (api.wasPressed(this.keyBindDialog) && !bindPressed) {
			ui.toggleDialog(this.elementDialog);
			bindPressed = true;
		}

		if (api.wasPressed(this.keyBindSelectLocation) && !bindPressed) {
			if (this.inspection.isQueryingInspection()) {
				bindPressed = true;
				this.inspection.inspect(api.mouseX, api.mouseY, this.createDialog);

			} else if (this.isPlayingAudio) {
				bindPressed = true;
				const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);

				if (tilePosition.x < 0) {
					tilePosition.x += game.mapSize;
				}

				if (tilePosition.y < 0) {
					tilePosition.y += game.mapSize;
				}

				audio.queueEffect(this.audioToPlay, tilePosition.x, tilePosition.y, localPlayer.z);

			} else if (this.isCreatingParticle) {
				bindPressed = true;
				const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);
				if (tilePosition.x < 0) {
					tilePosition.x += game.mapSize;
				}

				if (tilePosition.y < 0) {
					tilePosition.y += game.mapSize;
				}

				game.particle.create(tilePosition.x, tilePosition.y, localPlayer.z, Particles[this.particleToCreate]);
			}
		}

		return bindPressed;
	}

	public canCreatureAttack(creature: ICreature, enemy: IPlayer | ICreature): boolean {
		return (enemy as any).moveType === MoveType.Flying ? false : null;
	}

	public onMove(player: IPlayer, nextX: number, nextY: number, tile: ITile, direction: FacingDirection): boolean | undefined {
		if (player.moveType !== MoveType.Flying) {
			return undefined;
		}

		// todo: convert this to use dev tools mod save data
		let playerData = this.data.playerData[player.identifier];
		if (!playerData) {
			playerData = this.data.playerData[player.identifier] = {
				inMove: false,
				noclipDelay: Delay.Movement
			};
		}

		if (playerData.inMove) {
			playerData.noclipDelay = Math.max(playerData.noclipDelay - 1, 1);

		} else {
			playerData.noclipDelay = Delay.Movement;
		}

		player.addDelay(playerData.noclipDelay, true);

		actionManager.execute(player, ActionType.UpdateDirection, {
			direction: direction
		});

		player.isMoving = true;
		player.isMovingClientside = true;
		player.nextX = nextX;
		player.nextY = nextY;
		player.nextMoveTime = game.absoluteTime + (playerData.noclipDelay * game.interval);

		playerData.inMove = true;

		game.passTurn(player);

		// disable default movement
		return false;
	}

	public onNoInputReceived(player: IPlayer): void {
		if (player.moveType !== MoveType.Flying) {
			return;
		}

		const playerData = this.data.playerData[player.identifier];
		if (playerData) {
			playerData.inMove = false;
		}
	}

	///////////////////////////////////////////////////
	// Helper functions

	private generateSelect(enums: any, objects: SaferDescription<any> | undefined, className: string, labelName: string): string {
		let html = `<select class="${className}" data-selectid="${className}"><option selected disabled>${labelName}</option>`;

		const sorted = new Array<any>();
		const makePretty = (str: string): string => {
			let result = str[0];
			for (let i = 1; i < str.length; i++) {
				if (str[i] === str[i].toUpperCase()) {
					result += " ";
				}

				result += str[i];
			}

			return result;
		};

		Utilities.Enums.forEach(enums, (name, value) => {
			if (objects === undefined || objects[value]) {
				sorted.push({ id: value, name: makePretty(name) });
			}
		});

		sorted.sort((a: any, b: any): number => a.name.localeCompare(b.name));

		for (let i = 0; i < sorted.length; i++) {
			html += `<option data-id="${sorted[i].id}">${sorted[i].name}</option>`;
		}

		html += `</select><button class="select-control" data-control="${className}">></button>`;

		return html;
	}

	private updateSliders() {
		const time = game.time.getTime();

		if (!this.elementDayNightTime) {
			return;
		}

		this.elementDayNightTime.text(game.time.getTimeFormat(time));
		this.elementReputationValue.text(localPlayer.getReputation());
		this.elementWeightBonusValue.text(localPlayer.weightBonus);
		document.getElementById("daynightslider")
			.style.setProperty("--percent", `${game.time.getTime() * 100}`);
		document.getElementById("reputationslider")
			.style.setProperty("--percent", `${(localPlayer.getReputation() + 64000) / 128000 * 100}`);
		document.getElementById("weightbonusslider")
			.style.setProperty("--percent", `${(localPlayer.weightBonus / 2500 * 100)}`);
	}
}

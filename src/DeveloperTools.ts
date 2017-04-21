import Corpses from "creature/corpse/Corpses";
import { ICorpse } from "creature/corpse/ICorpse";
import Creatures from "creature/Creatures";
import { ICreature } from "creature/ICreature";
import Doodads from "doodad/Doodads";
import { ActionType, CreatureType, Delay, DoodadType, FacingDirection, ItemType, KeyBind, MoveType, SfxType, Source, TerrainType } from "Enums";
import Items from "item/Items";
import * as MapGenHelpers from "mapgen/MapGenHelpers";
import Mod from "mod/Mod";
import IPlayer from "Player/IPlayer";
import * as Shaders from "renderer/Shaders";
import { TileTemplateType } from "tile/ITerrain";
import { ITile } from "tile/ITerrain";
import { TileEventType } from "tile/ITileEvent";
import Terrains from "tile/Terrains";
import TileEvents from "tile/TileEvents";
import * as Utilities from "Utilities";
import { IInspectionMessageDelegate, IInspectionMessages, Inspection } from "./Inspection";

export default class DeveloperTools extends Mod implements IInspectionMessageDelegate {

	public inspectionMessages: IInspectionMessages;

	private elementDialog: JQuery;
	private elementModRefreshSection: JQuery;
	private keyBind: number;
	private noclipEnabled: boolean;
	private noclipDelay: number;
	private inMove: boolean;
	private elementContainer: JQuery;
	private elementInner: JQuery;
	private elementDayNightTime: JQuery;
	private inspection: Inspection;
	private isPlayingAudio = false;
	private audioToPlay: number;

	private data: {
		loadedCount: number;
	};

	private globalData: {
		initializedCount: number;
	};

	public onInitialize(saveDataGlobal: any): any {
		this.keyBind = this.addKeyBind(this.getName(), 220);

		if (!saveDataGlobal) {
			saveDataGlobal = { initializedCount: 1 };
		}

		Utilities.Console.log(Source.Mod, `Initialized developer tools ${saveDataGlobal.initializedCount} times.`);

		this.globalData = saveDataGlobal;
		this.globalData.initializedCount++;
	}

	public onUninitialize(): any {
		Utilities.Console.log(Source.Mod, `Uninitialized developer tools!`);

		return this.globalData;
	}

	public onLoad(saveData: any): void {
		this.data = saveData;

		if (!this.data || !this.data.loadedCount) {
			this.data = {
				loadedCount: 0
			};
		}

		this.noclipDelay = Delay.Movement;
		this.inMove = false;

		if (!this.elementModRefreshSection) {
			this.elementModRefreshSection = this.createOptionsSection("Mod Refresh");
		}

		this.elementModRefreshSection.find(".mods-list").remove();

		this.elementModRefreshSection.append(`<ul class="mods-list"></ul>`);

		const list = this.elementModRefreshSection.find("ul");

		const mods = modManager.getMods();
		for (let i = 0; i < mods.length; i++) {
			const name = modManager.getName(i);

			const row = $(`<li>${name} - </li>`);

			$("<button>Refresh</button>").click(() => {
				modManager.reload(i);
			}).appendTo(row);

			list.append(row);
		}

		this.inspectionMessages = {
			QueryInspection: this.addMessage("QueryInspection", "Choose an object to inspect by clicking on its tile."),
			QueryObjectNotFound: this.addMessage("QueryObjectNotFound", "The selected tile contains no object that can be inspected.")
		};

		this.inspection = new Inspection(this);

		Utilities.Console.log(Source.Mod, `Loaded developer tools ${this.data.loadedCount} times.`, this.data);
	}

	public onSave(): any {
		this.data.loadedCount++;
		return this.data;
	}

	public onUnload(): void {
		this.removeOptionsSection("Mod Refresh");
		this.elementModRefreshSection = null;
	}

	///////////////////////////////////////////////////
	// Hooks

	public onGameStart(isLoadingSave: boolean): void {
		// disable hints
		saveDataGlobal.options.hints = false;
		this.noclipEnabled = false;
	}

	public isPlayerSwimming(localPlayer: IPlayer, isSwimming: boolean): boolean {
		if (this.noclipEnabled) {
			return false;
		} else {
			return undefined;
		}
	}

	public onShowInGameScreen(): void {
		this.elementContainer = $("<div></div>");
		this.elementInner = $(`<div class="inner"></div>`);
		this.elementContainer.append(this.elementInner);

		let html = this.generateSelect(TerrainType, Terrains, "change-tile", "Change Tile");
		html += this.generateSelect(CreatureType, Creatures, "spawn-creature", "Spawn Creature");
		html += this.generateSelect(ItemType, Items, "item-get", "Get Item");
		html += this.generateSelect(DoodadType, Doodads, "place-env-item", "Place Doodad");
		html += this.generateSelect(TileEventType, TileEvents, "place-tile-event", "Place Tile Event");
		html += this.generateSelect(CreatureType, Corpses, "place-corpse", "Place Corpse");
		html += this.generateSelect(TileTemplateType, undefined, "spawn-template", "Spawn Template");
		html += this.generateSelect(SfxType, undefined, "play-audio", "Play Audio");

		html += `<br />Time: <input id="daynightslider" type ="range" min="0.0" max="1.0" step ="0.01" data-range-id="daynight" />`;
		html += `<div id="daynighttime"></div>`;

		this.elementInner.append(html);
		this.elementDayNightTime = $("<div id='daynighttime'>").appendTo(this.elementInner);

		this.elementInner.on("click", ".select-control", function () {
			$(`.${$(this).data("control")}`).trigger("change");
		});

		const self = this;
		this.elementInner.on("input change", "#daynightslider", function () {
			game.time.setTime(parseFloat($(this).val()));
			self.elementDayNightTime.text(game.time.getTimeFormat());
			game.updateRender = true;
			fieldOfView.compute();
			if (ui.setRangeValue) {
				ui.setRangeValue("daynight", game.time.getTime());
			}
		});

		this.elementInner.on("change", "select", function () {
			const id = parseInt($(this).find("option:selected").data("id"), 10);
			if (id >= 0) {
				if ($(this).hasClass("change-tile")) {
					game.changeTile({ type: id }, localPlayer.x + localPlayer.direction.x, localPlayer.y + localPlayer.direction.y, localPlayer.z, false);

				} else if ($(this).hasClass("spawn-creature")) {
					creatureManager.spawn(id, localPlayer.x + localPlayer.direction.x, localPlayer.y + localPlayer.direction.y, localPlayer.z, true);

				} else if ($(this).hasClass("item-get")) {
					localPlayer.createItemInInventory(id);
					game.updateCraftTableAndWeight();

				} else if ($(this).hasClass("place-env-item")) {
					// Remove if Doodad already there
					const tile = game.getTile(localPlayer.x + localPlayer.direction.x, localPlayer.y + localPlayer.direction.y, localPlayer.z);
					if (tile.doodadId !== undefined) {
						doodadManager.remove(game.doodads[tile.doodadId]);
					}

					const doodad = doodadManager.create(id, localPlayer.x + localPlayer.direction.x, localPlayer.y + localPlayer.direction.y, localPlayer.z);

					// Set defaults for growing doodads
					if (Doodads[id].growing) {
						for (const value of Utilities.Enums.getValues(DoodadType)) {
							const doodadDescription = Doodads[value];
							if (doodadDescription && doodadDescription.growth && doodadDescription.growth === id) {
								doodad.growInto = value;
								break;
							}
						}
					}

				} else if ($(this).hasClass("place-tile-event")) {
					tileEventManager.create(id, localPlayer.x + localPlayer.direction.x, localPlayer.y + localPlayer.direction.y, localPlayer.z);

				} else if ($(this).hasClass("place-corpse")) {
					const corpse: ICorpse = {
						type: id,
						x: localPlayer.x + localPlayer.direction.x,
						y: localPlayer.y + localPlayer.direction.y,
						z: localPlayer.z,
						aberrant: false,
						decay: Corpses[id].decay
					};

					corpseManager.create(corpse);

				} else if ($(this).hasClass("spawn-template")) {
					MapGenHelpers.spawnTemplate(id, localPlayer.x + localPlayer.direction.x, localPlayer.y + localPlayer.direction.y, localPlayer.z);

				} else if ($(this).hasClass("play-audio")) {
					self.isPlayingAudio = !self.isPlayingAudio;
					$("[data-control='play-audio']").toggleClass("active", self.isPlayingAudio);
					self.audioToPlay = id;
				}

				game.updateGame();
			}
		});

		this.elementInner.append(
			$("<button>Inspect</button>").click(() => {
				this.inspection.queryInspection();
			}),

			$("<button>Refresh Stats</button>").click(() => {
				localPlayer.stats.health.value = localPlayer.getMaxHealth();
				localPlayer.stats.stamina.value = localPlayer.dexterity;
				localPlayer.stats.hunger.value = localPlayer.starvation;
				localPlayer.stats.thirst.value = localPlayer.dehydration;
				localPlayer.status.bleeding = false;
				localPlayer.status.burned = false;
				localPlayer.status.poisoned = false;
				game.updateGame();
			}),

			$("<button>Kill All Creatures</button>").click(() => {
				for (let i = 0; i < game.creatures.length; i++) {
					if (game.creatures[i] !== undefined) {
						creatureManager.remove(game.creatures[i]);
					}
				}
				game.creatures = [];
				game.updateGame();
			}),

			$("<button>Unlock Recipes</button>").click(() => {
				const itemTypes = Utilities.Enums.getValues(ItemType);
				for (const itemType of itemTypes) {
					const description = Items[itemType];
					if (description && description.recipe && description.craftable !== false) {
						game.crafted[itemType] = true;
					}
				}

				game.updateCraftTableAndWeight();
				game.updateGame();
			}),

			$("<button>Reload Shaders</button>").click(() => {
				Shaders.loadShaders(() => {
					Shaders.compileShaders();
					game.updateGame();
				});
			}),

			$("<button>Noclip</button>").click(() => {
				this.noclipEnabled = !this.noclipEnabled;
				if (this.noclipEnabled) {
					localPlayer.moveType = MoveType.Flying;
				} else {
					localPlayer.moveType = MoveType.Land;
				}
				game.updateGame();
			}),

			$("<button>Toggle FOV</button>").click(() => {
				fieldOfView.disabled = !fieldOfView.disabled;
				fieldOfView.compute();
				game.updateGame();
			}),

			$("<button>Zoom Out</button>").click(() => {
				renderer.setTileScale(0.15);
				renderer.computeSpritesInViewport();
				game.updateRender = true;
			}),

			$("<button>Toggle Tilled</button>").click(() => {
				const x = localPlayer.x;
				const y = localPlayer.y;
				const z = localPlayer.z;
				const tile = game.getTile(x, y, z);

				game.tileData[x] = game.tileData[x] || [];
				game.tileData[x][y] = game.tileData[x][y] || [];
				game.tileData[x][y][localPlayer.z] = game.tileData[x][y][z] || [];

				const tileData = game.tileData[x][y][z];
				if (tileData.length === 0) {
					tileData.push({
						type: Utilities.TileHelpers.getType(tile),
						tilled: true
					});
				} else {
					tileData[0].tilled = tileData[0].tilled ? false : true;
				}

				Utilities.TileHelpers.setTilled(tile, tileData[0].tilled);

				world.updateTile(x, y, z, tile);

				renderer.computeSpritesInViewport();
				game.updateRender = true;
			})
		);

		this.elementDialog = this.createDialog(this.elementContainer, {
			id: this.getName(),
			title: "Developer Tools",
			x: 20,
			y: 180,
			width: 440,
			height: "auto",
			resizable: false,
			onOpen: () => {
				if (ui.setRangeValue) {
					ui.setRangeValue("daynight", game.time.getTime());
				}
			}
		});
	}

	public onTurnComplete() {
		this.inspection.update();
		if (ui.setRangeValue) {
			const time = game.time.getTime();
			ui.setRangeValue("daynight", time);
			this.elementDayNightTime.text(game.time.getTimeFormat(time));
		}
	}

	public onMouseDown(event: JQueryEventObject): boolean {
		if (this.inspection.isQueryingInspection()) {
			const mousePosition = ui.getMousePositionFromMouseEvent(event);
			this.inspection.inspect(mousePosition.x, mousePosition.y, this.createDialog);
			return false;
		} else if (this.isPlayingAudio) {
			const mousePosition = ui.getMousePositionFromMouseEvent(event);
			const tilePosition = renderer.screenToTile(mousePosition.x, mousePosition.y);
			audio.queueEffect(this.audioToPlay, tilePosition.x, tilePosition.y, localPlayer.z);
			return false;
		}
	}

	public onKeyBindPress(keyBind: KeyBind): boolean {
		switch (keyBind) {
			case this.keyBind:
				ui.toggleDialog(this.elementDialog);
				return false;
		}
		return undefined;
	}

	public canCreatureAttack(creatureId: number, creature: ICreature): boolean {
		return this.noclipEnabled ? false : null;
	}

	public onMove(nextX: number, nextY: number, tile: ITile, direction: FacingDirection): boolean | undefined {
		if (this.noclipEnabled) {
			if (this.inMove) {
				this.noclipDelay = Math.max(this.noclipDelay - 1, 0);
			} else {
				this.noclipDelay = Delay.Movement;
			}

			localPlayer.addDelay(this.noclipDelay, true);

			actionManager.execute(localPlayer, ActionType.UpdateDirection, {
				direction: direction
			});

			localPlayer.nextX = nextX;
			localPlayer.nextY = nextY;

			this.inMove = true;
			game.passTurn(localPlayer);

			// disable default movement
			return false;
		}

		return undefined;
	}

	public onNoInputReceived(): void {
		this.inMove = false;
	}

	///////////////////////////////////////////////////
	// Helper functions

	public testFunction(): number {
		Utilities.Console.log(Source.Mod, "This is a test function");
		return 42;
	}

	private generateSelect(enums: any, objects: any, className: string, labelName: string): string {
		let html = `<select class="${className}"><option selected disabled>${labelName}</option>`;

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

		/*
		if (objects) {
			objects.forEach((obj: any, index: any) => {
				// Doodad tree fix
				if (obj && !obj.tall) {
					const enumName = enums[index];
					if (enumName) {
						sorted.push({ id: index, name: makePretty(enumName) });
					}
				}
			});
		} else {*/
		Utilities.Enums.forEach(enums, (name, value) => {
			sorted.push({ id: value, name: makePretty(name) });
		});

		sorted.sort((a: any, b: any): number => {
			return a.name.localeCompare(b.name);
		});

		for (let i = 0; i < sorted.length; i++) {
			html += `<option data-id="${sorted[i].id}">${sorted[i].name}</option>`;
		}

		html += `</select><button class="select-control" data-control="${className}">></button>`;

		return html;
	}
}

/// <reference path="mod-reference/modreference.d.ts"/>
/// <reference path="inspection.ts"/>

import { IInspectionMessageDelegate, IInspectionMessages, Inspection } from "./inspection";

export default class Mod extends Mods.Mod implements IInspectionMessageDelegate {

	public inspectionMessages: IInspectionMessages;

	private dialog: JQuery;
	private modRefreshSection: JQuery;
	private keyBind: number;
	private noclipEnabled: boolean;
	private noclipDelay: number;
	private inMove: boolean;
	private container: JQuery;
	private inner: JQuery;
	private inspection: Inspection;

	private data: {
		loadedCount: number;
	};

	public onInitialize(saveDataGlobal: any): any {
		if (!saveDataGlobal) {
			saveDataGlobal = { initializedCount: 1 };
		}
		Utilities.Console.log(Source.Mod, `Initialized developer tools ${saveDataGlobal.initializedCount} times.`);
		saveDataGlobal.initializedCount++;
		return saveDataGlobal;
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

		this.keyBind = this.addKeyBind(this.getName(), 220);

		if (!this.modRefreshSection) {
			this.modRefreshSection = this.createOptionsSection("Mod Refresh");
		}

		this.modRefreshSection.find(".mods-list").remove();

		this.modRefreshSection.append(`<ul class="mods-list"></ul>`);

		const list = this.modRefreshSection.find("ul");
		const mods = Mods.getMods();

		for (let i = 0; i < mods.length; i++) {
			const name = Mods.getName(i);

			const row = $(`<li>${name} - </li>`);

			$("<button>Refresh</button>").click(() => {
				Mods.reload(i);
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
		this.modRefreshSection = null;
	}

	///////////////////////////////////////////////////
	// Hooks

	public onGameStart(isLoadingSave: boolean): void {
		// disable hints
		game.options.hints = false;
		this.noclipEnabled = false;
	}

	public isPlayerSwimming(player: Player, isSwimming: boolean): boolean {
		if (this.noclipEnabled) {
			return false;
		} else {
			return undefined;
		}
	}

	public onShowInGameScreen(): void {
		this.container = $("<div></div>");
		this.inner = $(`<div class="inner"></div>`);
		this.container.append(this.inner);

		let html = this.generateSelect(TerrainType, Terrain.defines, "change-tile", "Change Tile");
		html += this.generateSelect(CreatureType, Creature.defines, "spawn-creature", "Spawn Creature");
		html += this.generateSelect(ItemType, Item.defines, "item-get", "Get Item");
		html += this.generateSelect(DoodadType, Doodad.defines, "place-env-item", "Place Doodad");
		html += this.generateSelect(TileEvent.Type, TileEvent.defines, "place-tile-event", "Place Tile Event");
		html += this.generateSelect(CreatureType, Corpse.defines, "place-corpse", "Place Corpse");
		html += this.generateSelect(Terrain.TileTemplateType, undefined, "spawn-template", "Spawn Template");

		html += `DayNight: <input id="daynightslider" type ="range" min="0.0" max="1.0" step ="0.01" data-range-id="daynight" />`;

		this.inner.append(html);

		this.inner.on("click", ".select-control", function () {
			$(`.${$(this).data("control")}`).trigger("change");
		});

		this.inner.on("input change", "#daynightslider", function () {
			game.dayNight = parseFloat($(this).val());
			game.updateRender = true;
			game.fov.compute();
			if (ui.setRangeValue) {
				ui.setRangeValue("daynight", game.dayNight);
			}
		});

		this.inner.on("change", "select", function () {
			let id = parseInt($(this).find("option:selected").data("id"), 10);
			if (id >= 0) {
				if ($(this).hasClass("change-tile")) {
					game.changeTile({ type: id }, player.x + player.direction.x, player.y + player.direction.y, player.z, false);

				} else if ($(this).hasClass("spawn-creature")) {
					Creature.spawn(id, player.x + player.direction.x, player.y + player.direction.y, player.z, true);

				} else if ($(this).hasClass("item-get")) {
					Item.create(id);
					game.updateCraftTableAndWeight();

				} else if ($(this).hasClass("place-env-item")) {
					// Remove if Doodad already there
					let tile = game.getTile(player.x + player.direction.x, player.y + player.direction.y, player.z);
					if (tile.doodadId !== undefined) {
						Doodad.remove(game.doodads[tile.doodadId]);
					}
					const doodad = Doodad.create(id, player.x + player.direction.x, player.y + player.direction.y, player.z);
					// Set defaults for growing doodads
					if (Doodad.defines[id].growing) {
						for (let i = 0; i < Doodad.defines.length; i++) {
							if (Doodad.defines[i].growth && Doodad.defines[i].growth === id) {
								doodad.growInto = i;
								break;
							}
						}
					}

				} else if ($(this).hasClass("place-tile-event")) {
					TileEvent.create(id, player.x + player.direction.x, player.y + player.direction.y, player.z);

				} else if ($(this).hasClass("place-corpse")) {
					let corpse: Corpse.ICorpse = {
						type: id,
						x: player.x + player.direction.x,
						y: player.y + player.direction.y,
						z: player.z,
						aberrant: false,
						decay: Corpse.defines[id].decay
					};

					Corpse.create(corpse);

				} else if ($(this).hasClass("spawn-template")) {
					MapGen.spawnTemplate(id, player.x + player.direction.x, player.y + player.direction.y, player.z);
				}

				game.updateGame();
			}
		});

		this.inner.append($("<button>Inspect</button>").click(() => {
			this.inspection.queryInspection();
		}));

		this.inner.append($("<button>Refresh Stats</button>").click(() => {
			player.health = player.getMaxHealth();
			player.stamina = player.dexterity;
			player.hunger = player.starvation;
			player.thirst = player.dehydration;
			player.status.bleeding = false;
			player.status.burned = false;
			player.status.poisoned = false;
			game.updateGame();
		}));

		this.inner.append($("<button>Kill All Creatures</button>").click(() => {
			for (let i = 0; i < game.creatures.length; i++) {
				if (game.creatures[i] !== undefined) {
					Creature.remove(game.creatures[i]);
				}
			}
			game.creatures = [];
			game.updateGame();
		}));

		this.inner.append($("<button>Unlock Recipes</button>").click(() => {
			for (let itemType = ItemType.None + 1; itemType < Utilities.Enums.getMax(ItemType); itemType++) {
				const description = Item.defines[itemType];
				if (description && description.recipe && description.craftable !== false) {
					game.crafted[itemType] = true;
				}
			}

			game.updateCraftTableAndWeight();
			game.updateGame();
		}));

		this.inner.append($("<button>Reload Shaders</button>").click(() => {
			Shaders.loadShaders(() => {
				Shaders.compileShaders();
				game.updateGame();
			});
		}));

		this.inner.append($("<button>Noclip</button>").click(() => {
			this.noclipEnabled = !this.noclipEnabled;
			if (this.noclipEnabled) {
				player.moveType = MoveType.Flying;
			} else {
				player.moveType = MoveType.Land;
			}
			game.updateGame();
		}));

		this.dialog = this.createDialog(this.container, {
			id: this.getName(),
			title: "Developer Tools",
			x: 20,
			y: 180,
			width: 380,
			height: 400,
			minWidth: 380,
			minHeight: 400,
			onOpen: () => {
				if (ui.setRangeValue) {
					ui.setRangeValue("daynight", game.dayNight);
				}
			},
			onResizeStop: () => {
				this.updateDialogHeight();
			}
		});
	}

	public onTurnComplete() {
		this.inspection.update();
	}

	public onMouseDown(event: JQueryEventObject): boolean {
		if (this.inspection.isQueryingInspection()) {
			const mousePosition = ui.getMousePositionFromMouseEvent(event);
			this.inspection.inspect(mousePosition.x, mousePosition.y, this.createDialog);
			return false;
		}
	}

	public onKeyBindPress(keyBind: KeyBind): boolean {
		switch (keyBind) {
			case this.keyBind:
				ui.toggleDialog(this.dialog);
				this.updateDialogHeight();
				return false;
		}
		return undefined;
	}

	public canCreatureAttack(creatureId: number, creature: Creature.ICreature): boolean {
		return this.noclipEnabled ? false : null;
	}

	public onMove(nextX: number, nextY: number, tile: Terrain.ITile, direction: FacingDirection): boolean {
		if (this.noclipEnabled) {
			if (this.inMove) {
				this.noclipDelay = Math.max(this.noclipDelay - 1, 0);
			} else {
				this.noclipDelay = Delay.Movement;
			}

			game.addDelay(this.noclipDelay);

			player.updateDirection(direction);
			player.nextX = nextX;
			player.nextY = nextY;

			this.inMove = true;
			game.passTurn();

			// disable default movement
			return false;
		}
		return null;
	}

	public onNoInputReceived(): void {
		this.inMove = false;
	}

	///////////////////////////////////////////////////
	// Helper functions

	// Recalculate the inner height
	public updateDialogHeight(): void {
		if (!this.dialog) {
			return;
		}

		let height = this.container.find(".inner").outerHeight() + 43;
		this.container.dialog("option", "height", height);
		this.container.dialog("option", "maxHeight", height);
	}

	public testFunction(): number {
		Utilities.Console.log(Source.Mod, "This is a test function");
		return 42;
	}

	private generateSelect(enums: any, objects: Array<any>, className: string, labelName: string): string {
		let html = `<select class="${className}"><option selected disabled>${labelName}</option>`;

		let sorted = new Array<any>();
		let makePretty = (str: string): string => {
			let result = str[0];
			for (let i = 1; i < str.length; i++) {
				if (str[i] === str[i].toUpperCase()) {
					result += " ";
				}
				result += str[i];
			}
			return result;
		};

		if (objects) {
			objects.forEach((obj: any, index: any) => {
				// Doodad tree fix
				if (obj && !obj.tall) {
					let enumName = enums[index];
					if (enumName) {
						sorted.push({ id: index, name: makePretty(enumName) });
					}
				}
			});
		} else {
			let enumValues = Utilities.Enums.getValues(enums);
			for (let enumValue of enumValues) {
				sorted.push({ id: enumValue, name: makePretty(enums[enumValue]) });
			}
		}

		sorted.sort((a: any, b: any): number => {
			return a.name.localeCompare(b.name);
		});

		for (let i = 0; i < sorted.length; i++) {
			html += `<option data-id="${sorted[i].id}">${sorted[i].name}</option>`;
		}

		html += `</select><button class="select-control" data-control="${className}">></button><br />`;

		return html;
	}
}

/// <reference path="mod-reference/modreference.d.ts"/>
/// <reference path="inspection.ts"/>

class Mod extends Mods.Mod implements IInspectionMessageDelegate {
	private dialog: JQuery;
	private keyBind: number;
	private noclipEnabled: boolean;
	private noclipDelay: number;
	private inMove: boolean;
	private container: JQuery;
	private inner: JQuery;
	private inspection: Inspection;

	public InspectionMessages: IInspectionMessages;

	private data: {
		loadedCount: number;
	};

	public onInitialize(saveDataGlobal: any): any {
		if (!saveDataGlobal) {
			saveDataGlobal = { initializedCount: 1 };
		}
		console.log(`Initialized developer tools ${saveDataGlobal.initializedCount} times.`);
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

		this.InspectionMessages = {
			QueryInspection: this.addMessage("QueryInspection", "Choose an object to inspect by clicking on its tile."),
			QueryObjectNotFound: this.addMessage("QueryObjectNotFound", "The selected tile contains no object that can be inspected.")
		};

		this.inspection = new Inspection(this);

		console.log(`Loaded developer tools ${this.data.loadedCount} times.`, this.data);
	}

	public onSave(): any {
		this.data.loadedCount++;
		return this.data;
	}

	public onUnload(): void {
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

		var html = this.generateSelect(TerrainType, terrains, "change-tile", "Change Tile");
		html += this.generateSelect(MonsterType, monsters, "spawn-monster", "Spawn Monster");
		html += this.generateSelect(ItemType, Item.defines, "item-get", "Get Item");
		html += this.generateSelect(DoodadType, Doodad.defines, "place-env-item", "Place Doodad");
		html += this.generateSelect(TileEvent.Type, TileEvent.tileEvents, "place-tile-event", "Place Tile Event");
		html += this.generateSelect(MonsterType, corpses, "place-corpse", "Place Corpse");

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
			var id = parseInt($(this).find("option:selected").data("id"), 10);
			if (id >= 0) {
				if ($(this).hasClass("change-tile")) {
					game.changeTile({ type: id }, player.x + player.direction.x, player.y + player.direction.y, player.z, false);
				} else if ($(this).hasClass("spawn-monster")) {
					game.spawnMonster(id, player.x + player.direction.x, player.y + player.direction.y, player.z, true);
				} else if ($(this).hasClass("item-get")) {
					Item.create(id);
					game.updateCraftTableAndWeight();
				} else if ($(this).hasClass("place-env-item")) {
					// Remove if Doodad already there
					var tile = game.getTile(player.x + player.direction.x, player.y + player.direction.y, player.z);
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
					game.placeTileEvent(TileEvent.create(id, player.x + player.direction.x, player.y + player.direction.y, player.z));
				} else if ($(this).hasClass("place-corpse")) {
					game.placeCorpse({ type: id, x: player.x + player.direction.x, y: player.y + player.direction.y, z: player.z });
				}
				game.updateGame();
			}
		});

		this.inner.append($("<button>Inspect</button>").click(() => {
			this.inspection.queryInspection();
		}));

		this.inner.append($("<button>Refresh Stats</button>").click(() => {
			player.health = player.strength;
			player.stamina = player.dexterity;
			player.hunger = player.starvation;
			player.thirst = player.dehydration;
			player.status.bleeding = false;
			player.status.burned = false;
			player.status.poisoned = false;
			game.updateGame();
		}));

		this.inner.append($("<button>Kill All Monsters</button>").click(() => {
			for (var i = 0; i < game.monsters.length; i++) {
				if (game.monsters[i]) {
					game.deleteMonsters(i);
				}
			}
			game.monsters = [];
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
			x: 10,
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

	public canMonsterAttack(monsterId: number, monster: IMonster): boolean {
		return this.noclipEnabled ? false : null;
	}

	public onMove(nextX: number, nextY: number, tile: ITile, direction: FacingDirection): boolean {
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

		var height = this.container.find(".inner").outerHeight() + 43;
		this.container.dialog("option", "height", height);
		this.container.dialog("option", "maxHeight", height);
	}

	private generateSelect(enums: any, objects: Array<any>, className: string, labelName: string): string {
		var html = `<select class="${className}"><option selected disabled>${labelName}</option>`;

		var sorted = new Array<any>();
		var makePretty = (str: string): string => {
			var result = str[0];
			for (var i = 1; i < str.length; i++) {
				if (str[i] === str[i].toUpperCase()) {
					result += " ";
				}
				result += str[i];
			}
			return result;
		};

		objects.forEach((obj: any, index: any) => {
			// Doodad tree fix
			if (obj && !obj.tall) {
				var enumName = enums[index];
				if (enumName) {
					sorted.push({ id: index, name: makePretty(enumName) });
				}
			}
		});

		sorted.sort((a: any, b: any): number => {
			return b.name.localeCompare(a.name);
		});

		for (var i = sorted.length; i--; ) {
			html += `<option data-id="${sorted[i].id}">${sorted[i].name}</option>`;
		}

		html += `</select><button class="select-control" data-control="${className}">></button><br />`;

		return html;
	}
}

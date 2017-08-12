define(["require", "exports", "creature/corpse/Corpses", "creature/Creatures", "doodad/Doodads", "Enums", "item/Items", "mapgen/MapGenHelpers", "mod/Mod", "renderer/Shaders", "tile/ITerrain", "tile/ITileEvent", "tile/Terrains", "tile/TileEvents", "Utilities", "./IDeveloperTools", "./Inspection"], function (require, exports, Corpses_1, Creatures_1, Doodads_1, Enums_1, Items_1, MapGenHelpers, Mod_1, Shaders, ITerrain_1, ITileEvent_1, Terrains_1, TileEvents_1, Utilities, IDeveloperTools_1, Inspection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DeveloperTools extends Mod_1.default {
        constructor() {
            super(...arguments);
            this.isPlayingAudio = false;
        }
        onInitialize(saveDataGlobal) {
            this.keyBind = this.addKeyBind(this.getName(), 220);
            this.dictionary = this.addDictionary("DeveloperTools", IDeveloperTools_1.DevToolsMessage);
            if (!saveDataGlobal) {
                saveDataGlobal = { initializedCount: 1 };
            }
            Utilities.Console.log(Enums_1.Source.Mod, `Initialized developer tools ${saveDataGlobal.initializedCount} times.`);
            this.globalData = saveDataGlobal;
            this.globalData.initializedCount++;
        }
        onUninitialize() {
            Utilities.Console.log(Enums_1.Source.Mod, `Uninitialized developer tools!`);
            return this.globalData;
        }
        onLoad(saveData) {
            this.data = saveData;
            if (!this.data || !this.data.loadedCount) {
                this.data = {
                    loadedCount: 0
                };
            }
            this.noclipDelay = Enums_1.Delay.Movement;
            this.inMove = false;
            if (!this.elementModRefreshSection) {
                this.elementModRefreshSection = this.createOptionsSection(languageManager.getDefaultTranslation(this.dictionary, IDeveloperTools_1.DevToolsMessage.OptionsSectionModRefresh));
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
            this.inspection = new Inspection_1.Inspection(this.dictionary);
            Utilities.Console.log(Enums_1.Source.Mod, `Loaded developer tools ${this.data.loadedCount} times.`, this.data);
        }
        onSave() {
            this.data.loadedCount++;
            return this.data;
        }
        onUnload() {
            this.removeOptionsSection(this.elementModRefreshSection);
            this.elementModRefreshSection = null;
        }
        onGameStart(isLoadingSave) {
            saveDataGlobal.options.hints = false;
            this.noclipEnabled = false;
        }
        isPlayerSwimming(localPlayer, isSwimming) {
            if (this.noclipEnabled) {
                return false;
            }
            return undefined;
        }
        onShowInGameScreen() {
            this.elementContainer = $("<div></div>");
            this.elementInner = $(`<div class="inner"></div>`);
            this.elementContainer.append(this.elementInner);
            let html = this.generateSelect(Enums_1.TerrainType, Terrains_1.default, "change-tile", "Change Tile");
            html += this.generateSelect(Enums_1.CreatureType, Creatures_1.default, "spawn-creature", "Spawn Creature");
            html += this.generateSelect(Enums_1.ItemType, Items_1.default, "item-get", "Get Item");
            html += this.generateSelect(Enums_1.DoodadType, Doodads_1.default, "place-env-item", "Place Doodad");
            html += this.generateSelect(ITileEvent_1.TileEventType, TileEvents_1.default, "place-tile-event", "Place Tile Event");
            html += this.generateSelect(Enums_1.CreatureType, Corpses_1.default, "place-corpse", "Place Corpse");
            html += this.generateSelect(ITerrain_1.TileTemplateType, undefined, "spawn-template", "Spawn Template");
            html += this.generateSelect(Enums_1.SfxType, undefined, "play-audio", "Play Audio");
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
                    }
                    else if ($(this).hasClass("spawn-creature")) {
                        creatureManager.spawn(id, localPlayer.x + localPlayer.direction.x, localPlayer.y + localPlayer.direction.y, localPlayer.z, true);
                    }
                    else if ($(this).hasClass("item-get")) {
                        localPlayer.createItemInInventory(id);
                        game.updateCraftTableAndWeight();
                    }
                    else if ($(this).hasClass("place-env-item")) {
                        const tile = game.getTile(localPlayer.x + localPlayer.direction.x, localPlayer.y + localPlayer.direction.y, localPlayer.z);
                        if (tile.doodad) {
                            doodadManager.remove(tile.doodad);
                        }
                        doodadManager.create(id, localPlayer.x + localPlayer.direction.x, localPlayer.y + localPlayer.direction.y, localPlayer.z);
                    }
                    else if ($(this).hasClass("place-tile-event")) {
                        tileEventManager.create(id, localPlayer.x + localPlayer.direction.x, localPlayer.y + localPlayer.direction.y, localPlayer.z);
                    }
                    else if ($(this).hasClass("place-corpse")) {
                        corpseManager.create(id, localPlayer.x + localPlayer.direction.x, localPlayer.y + localPlayer.direction.y, localPlayer.z);
                    }
                    else if ($(this).hasClass("spawn-template")) {
                        MapGenHelpers.spawnTemplate(id, localPlayer.x + localPlayer.direction.x, localPlayer.y + localPlayer.direction.y, localPlayer.z);
                    }
                    else if ($(this).hasClass("play-audio")) {
                        self.isPlayingAudio = !self.isPlayingAudio;
                        $("[data-control='play-audio']").toggleClass("active", self.isPlayingAudio);
                        self.audioToPlay = id;
                    }
                    localPlayer.updateStatsAndAttributes();
                    game.updateView(true);
                }
            });
            this.elementInner.append($("<button>Inspect</button>").click(() => {
                this.inspection.queryInspection();
            }), $("<button>Refresh Stats</button>").click(() => {
                localPlayer.stats.health.value = localPlayer.getMaxHealth();
                localPlayer.stats.stamina.value = localPlayer.dexterity;
                localPlayer.stats.hunger.value = localPlayer.starvation;
                localPlayer.stats.thirst.value = localPlayer.dehydration;
                localPlayer.status.bleeding = false;
                localPlayer.status.burned = false;
                localPlayer.status.poisoned = false;
                localPlayer.updateStatsAndAttributes();
            }), $("<button>Kill All Creatures</button>").click(() => {
                for (let i = 0; i < game.creatures.length; i++) {
                    if (game.creatures[i] !== undefined) {
                        creatureManager.remove(game.creatures[i]);
                    }
                }
                game.creatures = [];
                game.updateView(false);
            }), $("<button>Unlock Recipes</button>").click(() => {
                const itemTypes = Utilities.Enums.getValues(Enums_1.ItemType);
                for (const itemType of itemTypes) {
                    const description = Items_1.default[itemType];
                    if (description && description.recipe && description.craftable !== false && !game.crafted[itemType]) {
                        game.crafted[itemType] = {
                            newUnlock: true,
                            unlockTime: Date.now()
                        };
                    }
                }
                game.updateCraftTableAndWeight();
            }), $("<button>Reload Shaders</button>").click(() => {
                Shaders.loadShaders(() => {
                    Shaders.compileShaders();
                    game.updateView(true);
                });
            }), $("<button>Noclip</button>").click(() => {
                this.noclipEnabled = !this.noclipEnabled;
                if (this.noclipEnabled) {
                    localPlayer.moveType = Enums_1.MoveType.Flying;
                }
                else {
                    localPlayer.moveType = Enums_1.MoveType.Land;
                }
                game.updateView(true);
            }), $("<button>Toggle FOV</button>").click(() => {
                fieldOfView.disabled = !fieldOfView.disabled;
                game.updateView(true);
            }), $("<button>Zoom Out</button>").click(() => {
                renderer.setTileScale(0.15);
                renderer.computeSpritesInViewport();
                game.updateRender = true;
            }), $("<button>Toggle Tilled</button>").click(() => {
                const x = localPlayer.x + localPlayer.direction.x;
                const y = localPlayer.y + localPlayer.direction.y;
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
                }
                else {
                    tileData[0].tilled = tileData[0].tilled ? false : true;
                }
                Utilities.TileHelpers.setTilled(tile, tileData[0].tilled);
                world.updateTile(x, y, z, tile);
                renderer.computeSpritesInViewport();
                game.updateRender = true;
            }), $("<button>Travel Away</button>").click(() => {
                localPlayer.state = Enums_1.PlayerState.Traveling;
                ui.showLoadingScreen(Enums_1.LoadingType.Normal);
                ui.switchToScreen(Enums_1.ScreenId.None);
                setTimeout(() => {
                    game.resetGameState();
                }, 50);
            }));
            this.elementDialog = this.createDialog(this.elementContainer, {
                id: this.getName(),
                title: "Developer Tools",
                x: 20,
                y: 180,
                width: 490,
                height: "auto",
                resizable: false,
                onOpen: () => {
                    if (ui.setRangeValue) {
                        ui.setRangeValue("daynight", game.time.getTime());
                    }
                }
            });
        }
        onTurnComplete() {
            this.inspection.update();
            if (ui.setRangeValue) {
                const time = game.time.getTime();
                ui.setRangeValue("daynight", time);
                this.elementDayNightTime.text(game.time.getTimeFormat(time));
            }
        }
        onMouseDown(event) {
            if (this.inspection.isQueryingInspection()) {
                const mousePosition = ui.getMousePositionFromMouseEvent(event);
                this.inspection.inspect(mousePosition.x, mousePosition.y, this.createDialog);
                return false;
            }
            else if (this.isPlayingAudio) {
                const mousePosition = ui.getMousePositionFromMouseEvent(event);
                const tilePosition = renderer.screenToTile(mousePosition.x, mousePosition.y);
                audio.queueEffect(this.audioToPlay, tilePosition.x, tilePosition.y, localPlayer.z);
                return false;
            }
        }
        onKeyBindPress(keyBind) {
            switch (keyBind) {
                case this.keyBind:
                    ui.toggleDialog(this.elementDialog);
                    return false;
            }
            return undefined;
        }
        canCreatureAttack(creatureId, creature) {
            return this.noclipEnabled ? false : null;
        }
        onMove(nextX, nextY, tile, direction) {
            if (this.noclipEnabled) {
                if (this.inMove) {
                    this.noclipDelay = Math.max(this.noclipDelay - 1, 1);
                }
                else {
                    this.noclipDelay = Enums_1.Delay.Movement;
                }
                localPlayer.addDelay(this.noclipDelay, true);
                actionManager.execute(localPlayer, Enums_1.ActionType.UpdateDirection, {
                    direction: direction
                });
                localPlayer.isMoving = true;
                localPlayer.nextX = nextX;
                localPlayer.nextY = nextY;
                localPlayer.nextMoveTime = game.absoluteTime + (this.noclipDelay * game.interval);
                this.inMove = true;
                game.passTurn(localPlayer);
                return false;
            }
            return undefined;
        }
        onNoInputReceived() {
            this.inMove = false;
        }
        testFunction() {
            Utilities.Console.log(Enums_1.Source.Mod, "This is a test function");
            return 42;
        }
        generateSelect(enums, objects, className, labelName) {
            let html = `<select class="${className}"><option selected disabled>${labelName}</option>`;
            const sorted = new Array();
            const makePretty = (str) => {
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
                sorted.push({ id: value, name: makePretty(name) });
            });
            sorted.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            for (let i = 0; i < sorted.length; i++) {
                html += `<option data-id="${sorted[i].id}">${sorted[i].name}</option>`;
            }
            html += `</select><button class="select-control" data-control="${className}">></button>`;
            return html;
        }
    }
    exports.default = DeveloperTools;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGV2ZWxvcGVyVG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvRGV2ZWxvcGVyVG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBb0JBLG9CQUFvQyxTQUFRLGFBQUc7UUFBL0M7O1lBV1MsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUE0WmhDLENBQUM7UUEvWU8sWUFBWSxDQUFDLGNBQW1CO1lBQ3RDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLGlDQUFlLENBQUMsQ0FBQztZQUV4RSxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLGNBQWMsR0FBRyxFQUFFLGdCQUFnQixFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzFDLENBQUM7WUFFRCxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFNLENBQUMsR0FBRyxFQUFFLCtCQUErQixjQUFjLENBQUMsZ0JBQWdCLFNBQVMsQ0FBQyxDQUFDO1lBRTNHLElBQUksQ0FBQyxVQUFVLEdBQUcsY0FBYyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUNwQyxDQUFDO1FBRU0sY0FBYztZQUNwQixTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFNLENBQUMsR0FBRyxFQUFFLGdDQUFnQyxDQUFDLENBQUM7WUFFcEUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDeEIsQ0FBQztRQUVNLE1BQU0sQ0FBQyxRQUFhO1lBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1lBRXJCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElB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
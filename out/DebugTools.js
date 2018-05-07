var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "creature/corpse/Corpses", "creature/Creatures", "doodad/Doodads", "entity/IStats", "Enums", "item/Items", "mapgen/MapGenHelpers", "mod/Mod", "newui/element/CheckButton", "renderer/particle/IParticle", "renderer/particle/Particles", "renderer/Shaders", "tile/ITerrain", "tile/ITileEvent", "tile/Terrains", "tile/TerrainTemplates", "tile/TileEvents", "utilities/enum/Enums", "utilities/string/Strings", "utilities/TileHelpers", "mod/IHookHost", "./IDebugTools", "./Inspection"], function (require, exports, Corpses_1, Creatures_1, Doodads_1, IStats_1, Enums_1, Items_1, MapGenHelpers, Mod_1, CheckButton_1, IParticle_1, Particles_1, Shaders, ITerrain_1, ITileEvent_1, Terrains_1, TerrainTemplates_1, TileEvents_1, Enums_2, Strings_1, TileHelpers_1, IHookHost_1, IDebugTools_1, Inspection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let log;
    class DebugTools extends Mod_1.default {
        constructor() {
            super(...arguments);
            this.isPlayingAudio = false;
            this.isCreatingParticle = false;
        }
        onInitialize(saveDataGlobal) {
            this.keyBindDialog = this.addBindable("Toggle", [{ key: "Backslash" }, { key: "IntlBackslash" }]);
            this.keyBindSelectLocation = this.addBindable("SelectLocation", { mouseButton: 0 });
            this.dictionary = this.addDictionary("DebugTools", IDebugTools_1.DebugToolsMessage);
            this.globalData = saveDataGlobal ? saveDataGlobal : {
                initializedCount: 0,
                autoOpen: false
            };
            this.globalData.initializedCount++;
            log = this.getLog();
            log.info(`Initialized debug tools ${this.globalData.initializedCount} times.`);
            this.createOptionsSection((uiApi, section) => {
                new CheckButton_1.CheckButton(uiApi, {
                    text: {
                        dictionary: this.dictionary,
                        entry: IDebugTools_1.DebugToolsMessage.OptionsAutoOpen
                    },
                    refresh: () => !!this.globalData.autoOpen,
                    onChange: (_, checked) => {
                        this.globalData.autoOpen = checked;
                    }
                }).appendTo(section);
            });
        }
        onUninitialize() {
            log.info("Uninitialized debug tools!");
            return this.globalData;
        }
        onLoad(saveData) {
            this.data = saveData;
            if (!this.data || !this.data.loadedCount) {
                this.data = {
                    loadedCount: 0,
                    disableLights: false,
                    playerData: {},
                    weightBonus: 0
                };
            }
            if (this.data.weightBonus === undefined) {
                this.data.weightBonus = 0;
            }
            this.data.playerData = this.data.playerData || {};
            this.inspection = new Inspection_1.Inspection(this.dictionary, log);
            log.info(`Loaded debug tools ${this.data.loadedCount} times.`, this.data);
            this.addCommand("refresh", (player) => {
                actionManager.execute(player, this.refreshStatsAction);
            });
            this.selectAction = this.addActionType({ name: "Select", usableAsGhost: true }, (player, argument, result) => {
                const selectAction = argument.object;
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
                        MapGenHelpers.spawnTemplate(selectAction.id, x, y, z);
                        break;
                }
                player.updateStatsAndAttributes();
                result.updateView = true;
            });
            this.setTimeAction = this.addActionType({ name: "Set Time", usableAsGhost: true }, (player, argument, result) => {
                game.time.setTime(argument.object);
                game.updateRender = true;
                fieldOfView.compute();
                if (player.isLocalPlayer()) {
                    this.updateSliders();
                }
            });
            this.setReputationAction = this.addActionType({ name: "Set Reputation", usableAsGhost: true }, (player, argument, result) => {
                player.setStat(IStats_1.Stat.Benignity, 0);
                player.setStat(IStats_1.Stat.Malignity, 0);
                player.updateReputation(argument.object);
                if (player.isLocalPlayer()) {
                    this.updateSliders();
                }
            });
            this.setWeightBonusAction = this.addActionType({ name: "Set Weight Bonus", usableAsGhost: true }, (player, argument, result) => {
                this.data.weightBonus = argument.object;
                player.updateStrength();
                if (player.isLocalPlayer()) {
                    this.updateSliders();
                }
                game.updateTablesAndWeight();
            });
            this.refreshStatsAction = this.addActionType({ name: "Refresh Stats", usableAsGhost: true }, (player, argument, result) => {
                const health = player.getStat(IStats_1.Stat.Health);
                const stamina = player.getStat(IStats_1.Stat.Stamina);
                const hunger = player.getStat(IStats_1.Stat.Hunger);
                const thirst = player.getStat(IStats_1.Stat.Thirst);
                player.setStat(health, player.getMaxHealth());
                player.setStat(stamina, stamina.max);
                player.setStat(hunger, hunger.max);
                player.setStat(thirst, thirst.max);
                player.setStatus(Enums_1.StatusType.Bleeding, false);
                player.setStatus(Enums_1.StatusType.Burned, false);
                player.setStatus(Enums_1.StatusType.Poisoned, false);
                player.state = Enums_1.PlayerState.None;
                player.updateStatsAndAttributes();
            });
            this.killAllCreaturesAction = this.addActionType({ name: "Kill All Creatures", usableAsGhost: true }, (player, argument, result) => {
                for (let i = 0; i < game.creatures.length; i++) {
                    if (game.creatures[i] !== undefined) {
                        creatureManager.remove(game.creatures[i]);
                    }
                }
                game.creatures = [];
                game.updateView(false);
            });
            this.killAllNPCsAction = this.addActionType({ name: "Kill All NPCs", usableAsGhost: true }, (player, argument, result) => {
                for (let i = 0; i < game.npcs.length; i++) {
                    if (game.npcs[i] !== undefined) {
                        npcManager.remove(game.npcs[i]);
                    }
                }
                game.npcs = [];
                game.updateView(false);
            });
            this.unlockRecipesAction = this.addActionType({ name: "Unlock Recipes", usableAsGhost: true }, (player, argument, result) => {
                const itemTypes = Enums_2.default.values(Enums_1.ItemType);
                for (const itemType of itemTypes) {
                    const description = Items_1.default[itemType];
                    if (description && description.recipe && description.craftable !== false && !game.crafted[itemType]) {
                        game.crafted[itemType] = {
                            newUnlock: true,
                            unlockTime: Date.now()
                        };
                    }
                }
                game.updateTablesAndWeight();
            });
            this.reloadShadersAction = this.addActionType({ name: "Reload Shaders", usableAsGhost: true }, (player, argument, result) => __awaiter(this, void 0, void 0, function* () {
                yield Shaders.loadShaders();
                Shaders.compileShaders();
                game.updateView(true);
            }));
            this.noclipAction = this.addActionType({ name: "Noclip" }, (player, argument, result) => {
                if (player.moveType === Enums_1.MoveType.Flying) {
                    player.moveType = Enums_1.MoveType.Land;
                }
                else {
                    player.moveType = Enums_1.MoveType.Flying;
                }
                game.updateView(true);
            });
            this.toggleTilledAction = this.addActionType({ name: "Toggle Tilled", usableAsGhost: true }, (player, argument, result) => {
                const { x, y, z } = player.getFacingPoint();
                const tile = game.getTile(x, y, z);
                const tileType = TileHelpers_1.default.getType(tile);
                if (!Terrains_1.default[tileType].tillable) {
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
                }
                else {
                    tileData[0].tilled = tileData[0].tilled ? false : true;
                }
                TileHelpers_1.default.setTilled(tile, tileData[0].tilled);
                world.updateTile(x, y, z, tile);
                renderer.computeSpritesInViewport();
                game.updateRender = true;
            });
            this.teleportToHostAction = this.addActionType({ name: "Teleport to Host", usableAsGhost: true }, (player, argument, result) => {
                if (players.length < 0) {
                    return;
                }
                const nearbyOpenTile = TileHelpers_1.default.findMatchingTile(players[0], TileHelpers_1.default.isOpenTile);
                player.x = player.fromX = nearbyOpenTile.x;
                player.y = player.fromY = nearbyOpenTile.y;
                player.z = nearbyOpenTile.z;
                game.updateView(true);
            });
            this.tameCreatureAction = this.addActionType({ name: "Force Tame Creature", usableAsGhost: true }, (player, argument, result) => {
                const tile = player.getFacingTile();
                if (!tile) {
                    return;
                }
                const creature = tile.creature;
                if (creature === undefined) {
                    return;
                }
                creature.tame(player);
                creature.queueSoundEffect(Enums_1.SfxType.CreatureNoise);
                creature.setStat(IStats_1.Stat.Happiness, 9999999);
                log.info("Tamed creature", creature);
            });
            this.toggleLightsAction = this.addActionType({ name: "Toggle Lighting", usableAsGhost: true }, (player, argument, result) => {
                this.data.disableLights = !this.data.disableLights;
                player.updateStatsAndAttributes();
                game.updateView(true);
            });
        }
        onSave() {
            this.data.loadedCount++;
            return this.data;
        }
        onGameStart(isLoadingSave) {
            saveDataGlobal.options.openNotesAutomatically = false;
        }
        isPlayerSwimming(player, isSwimming) {
            return player.moveType === Enums_1.MoveType.Flying ? false : undefined;
        }
        getPlayerStrength(strength, player) {
            return strength + this.data.weightBonus;
        }
        getPlayerSpriteBatchLayer(player, batchLayer) {
            return player.moveType === Enums_1.MoveType.Flying ? Enums_1.SpriteBatchLayer.CreatureFlying : undefined;
        }
        onShowInGameScreen() {
            this.elementContainer = $("<div></div>");
            this.elementInner = $('<div class="inner"></div>');
            this.elementContainer.append(this.elementInner);
            let html = this.generateSelect(Enums_1.TerrainType, Terrains_1.default, "change-tile", "Change Tile");
            html += this.generateSelect(Enums_1.CreatureType, Creatures_1.default, "spawn-creature", "Spawn Creature");
            html += this.generateSelect(Enums_1.NPCType, undefined, "spawn-npc", "Spawn NPC");
            html += this.generateSelect(Enums_1.ItemType, Items_1.default, "item-get", "Get Item");
            html += this.generateSelect(Enums_1.DoodadType, Doodads_1.default, "place-env-item", "Place Doodad");
            html += this.generateSelect(ITileEvent_1.TileEventType, TileEvents_1.default, "place-tile-event", "Place Tile Event");
            html += this.generateSelect(Enums_1.CreatureType, Corpses_1.default, "place-corpse", "Place Corpse");
            html += this.generateSelect(ITerrain_1.TileTemplateType, TerrainTemplates_1.default, "spawn-template", "Spawn Template");
            html += this.generateSelect(Enums_1.SfxType, undefined, "play-audio", "Play Audio");
            html += this.generateSelect(IParticle_1.ParticleType, undefined, "create-particle", "Create Particle");
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
                    }
                    else if (selectId === "create-particle") {
                        self.isCreatingParticle = !self.isCreatingParticle;
                        $("[data-control='create-particle']").toggleClass("active", self.isCreatingParticle);
                        self.particleToCreate = id;
                    }
                    else {
                        actionManager.execute(localPlayer, self.selectAction, {
                            object: {
                                type: selectId,
                                id: id
                            }
                        });
                    }
                }
            });
            this.elementInner.append($("<button>Inspect</button>").click(() => this.inspection.queryInspection()), $("<button>Refresh Stats</button>").click(() => actionManager.execute(localPlayer, this.refreshStatsAction)), $("<button>Kill All Creatures</button>").click(() => actionManager.execute(localPlayer, this.killAllCreaturesAction)), $("<button>Kill All NPCs</button>").click(() => actionManager.execute(localPlayer, this.killAllNPCsAction)), $("<button>Unlock Recipes</button>").click(() => actionManager.execute(localPlayer, this.unlockRecipesAction)), $("<button>Reload Shaders</button>").click(() => actionManager.execute(localPlayer, this.reloadShadersAction)), $("<button>Noclip</button>").click(() => actionManager.execute(localPlayer, this.noclipAction)), $("<button>Toggle FOV</button>").click(() => {
                fieldOfView.disabled = !fieldOfView.disabled;
                game.updateView(true);
            }), $("<button>Zoom Out</button>").click(() => {
                renderer.setTileScale(0.15);
                renderer.computeSpritesInViewport();
                game.updateRender = true;
            }), $("<button>Toggle Tilled</button>").click(() => actionManager.execute(localPlayer, this.toggleTilledAction)), $("<button>Travel Away</button>").click(() => {
                if (multiplayer.isConnected()) {
                    return;
                }
                const teleportToSea = () => {
                    for (let y = 0; y < game.mapSize; y++) {
                        for (let x = 0; x < game.mapSize; x++) {
                            const tile = game.getTile(x, y, Enums_1.WorldZ.Overworld);
                            if (TileHelpers_1.default.getType(tile) === Enums_1.TerrainType.DeepSeawater) {
                                localPlayer.x = localPlayer.fromX = x;
                                localPlayer.y = localPlayer.fromY = y;
                                localPlayer.z = Enums_1.WorldZ.Overworld;
                                game.updateView(true);
                                return;
                            }
                        }
                    }
                };
                teleportToSea();
                localPlayer.createItemInInventory(Enums_1.ItemType.GoldCoins);
                localPlayer.createItemInInventory(Enums_1.ItemType.GoldenChalice);
                localPlayer.createItemInInventory(Enums_1.ItemType.GoldenKey);
                localPlayer.createItemInInventory(Enums_1.ItemType.GoldenRing);
                localPlayer.createItemInInventory(Enums_1.ItemType.GoldenSword);
                const boat = localPlayer.createItemInInventory(Enums_1.ItemType.Sailboat);
                actionManager.execute(localPlayer, Enums_1.ActionType.TraverseTheSea, { item: boat });
            }), $("<button>Teleport to Host</button>").click(() => actionManager.execute(localPlayer, this.teleportToHostAction)), $("<button>Tame</button>").click(() => actionManager.execute(localPlayer, this.tameCreatureAction)), $("<button>Reset WebGL</button>").click(() => {
                game.resetWebGL();
            }), $("<button>Toggle Lighting</button>").click(() => actionManager.execute(localPlayer, this.toggleLightsAction)));
            this.elementDialog = this.createDialog(this.elementContainer, {
                id: this.getName(),
                title: "Debug Tools",
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
        onGameTickEnd() {
            this.inspection.update();
            this.updateSliders();
        }
        canClientMove() {
            if (this.inspection.isQueryingInspection() || this.isPlayingAudio || this.isCreatingParticle) {
                return false;
            }
            return undefined;
        }
        onBindLoop(bindPressed, api) {
            if (api.wasPressed(this.keyBindDialog) && !bindPressed) {
                ui.toggleDialog(this.elementDialog);
                bindPressed = true;
            }
            if (api.wasPressed(this.keyBindSelectLocation) && !bindPressed) {
                if (this.inspection.isQueryingInspection()) {
                    bindPressed = true;
                    this.inspection.inspect(api.mouseX, api.mouseY, this.createDialog);
                }
                else if (this.isPlayingAudio) {
                    bindPressed = true;
                    const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);
                    if (tilePosition.x < 0) {
                        tilePosition.x += game.mapSize;
                    }
                    if (tilePosition.y < 0) {
                        tilePosition.y += game.mapSize;
                    }
                    audio.queueEffect(this.audioToPlay, tilePosition.x, tilePosition.y, localPlayer.z);
                }
                else if (this.isCreatingParticle) {
                    bindPressed = true;
                    const tilePosition = renderer.screenToTile(api.mouseX, api.mouseY);
                    if (tilePosition.x < 0) {
                        tilePosition.x += game.mapSize;
                    }
                    if (tilePosition.y < 0) {
                        tilePosition.y += game.mapSize;
                    }
                    game.particle.create(tilePosition.x, tilePosition.y, localPlayer.z, Particles_1.default[this.particleToCreate]);
                }
            }
            return bindPressed;
        }
        canCreatureAttack(creature, enemy) {
            return enemy.moveType === Enums_1.MoveType.Flying ? false : undefined;
        }
        onMove(player, nextX, nextY, tile, direction) {
            if (player.moveType !== Enums_1.MoveType.Flying) {
                return undefined;
            }
            let playerData = this.data.playerData[player.identifier];
            if (!playerData) {
                playerData = this.data.playerData[player.identifier] = {
                    inMove: false,
                    noclipDelay: Enums_1.Delay.Movement
                };
            }
            if (playerData.inMove) {
                playerData.noclipDelay = Math.max(playerData.noclipDelay - 1, 1);
            }
            else {
                playerData.noclipDelay = Enums_1.Delay.Movement;
            }
            player.addDelay(playerData.noclipDelay, true);
            actionManager.execute(player, Enums_1.ActionType.UpdateDirection, {
                direction: direction
            });
            player.isMoving = true;
            player.isMovingClientside = true;
            player.nextX = nextX;
            player.nextY = nextY;
            player.nextMoveTime = game.absoluteTime + (playerData.noclipDelay * game.interval);
            playerData.inMove = true;
            game.passTurn(player);
            return false;
        }
        onNoInputReceived(player) {
            if (player.moveType !== Enums_1.MoveType.Flying) {
                return;
            }
            const playerData = this.data.playerData[player.identifier];
            if (playerData) {
                playerData.inMove = false;
            }
        }
        getAmbientColor(colors) {
            if (this.data.disableLights) {
                return [1, 1, 1];
            }
            return undefined;
        }
        getAmbientLightLevel(ambientLight, z) {
            if (this.data.disableLights) {
                return 1;
            }
            return undefined;
        }
        getTileLightLevel(tile, x, y, z) {
            if (this.data.disableLights) {
                return 0;
            }
            return undefined;
        }
        generateSelect(enums, objects, className, labelName) {
            let html = `<select class="${className}" data-selectid="${className}"><option selected disabled>${labelName}</option>`;
            const sorted = new Array();
            const makePretty = (str, value) => {
                if (objects && objects[value] && objects[value].name) {
                    return Strings_1.default.formatSentenceCase(objects[value].name, Enums_1.SentenceCaseStyle.Title);
                }
                let result = str[0];
                for (let i = 1; i < str.length; i++) {
                    if (str[i] === str[i].toUpperCase()) {
                        result += " ";
                    }
                    result += str[i];
                }
                return result;
            };
            for (const [name, value] of Enums_2.default.entries(enums)) {
                if (objects === undefined || objects[value]) {
                    sorted.push({ id: value, name: makePretty(name, value) });
                }
            }
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            for (let i = 0; i < sorted.length; i++) {
                html += `<option data-id="${sorted[i].id}">${sorted[i].name}</option>`;
            }
            html += `</select><button class="select-control" data-control="${className}">></button>`;
            return html;
        }
        updateSliders() {
            const time = game.time.getTime();
            if (!this.elementDayNightTime) {
                return;
            }
            this.elementDayNightTime.text(game.time.getFormatted(time));
            this.elementReputationValue.text(localPlayer.getReputation());
            this.elementWeightBonusValue.text(this.data.weightBonus);
            document.getElementById("daynightslider")
                .style.setProperty("--percent", `${game.time.getTime() * 100}`);
            document.getElementById("reputationslider")
                .style.setProperty("--percent", `${(localPlayer.getReputation() + 64000) / 128000 * 100}`);
            document.getElementById("weightbonusslider")
                .style.setProperty("--percent", `${(this.data.weightBonus / 2500 * 100)}`);
        }
    }
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "onGameStart", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "isPlayerSwimming", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getPlayerStrength", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getPlayerSpriteBatchLayer", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "onShowInGameScreen", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "onGameTickEnd", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "canClientMove", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "onBindLoop", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "canCreatureAttack", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "onMove", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "onNoInputReceived", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getAmbientColor", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getAmbientLightLevel", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getTileLightLevel", null);
    exports.default = DebugTools;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBb0RBLElBQUksR0FBUSxDQUFDO0lBRWIsZ0JBQWdDLFNBQVEsYUFBRztRQUEzQzs7WUFVUyxtQkFBYyxHQUFHLEtBQUssQ0FBQztZQUV2Qix1QkFBa0IsR0FBRyxLQUFLLENBQUM7UUE0c0JwQyxDQUFDO1FBcnJCTyxZQUFZLENBQUMsY0FBbUI7WUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsRyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BGLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsK0JBQWlCLENBQUMsQ0FBQztZQUV0RSxJQUFJLENBQUMsVUFBVSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDbkQsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDbkIsUUFBUSxFQUFFLEtBQUs7YUFDZixDQUFDO1lBQ0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBRW5DLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFFcEIsR0FBRyxDQUFDLElBQUksQ0FBQywyQkFBMkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsU0FBUyxDQUFDLENBQUM7WUFFL0UsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxF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
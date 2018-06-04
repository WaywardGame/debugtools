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
define(["require", "exports", "creature/corpse/Corpses", "creature/Creatures", "doodad/Doodads", "entity/IStats", "Enums", "item/Items", "language/Translation", "mapgen/MapGenHelpers", "mod/Mod", "newui/component/CheckButton", "renderer/particle/IParticle", "renderer/particle/Particles", "renderer/Shaders", "tile/ITerrain", "tile/ITileEvent", "tile/Terrains", "tile/TerrainTemplates", "tile/TileEvents", "utilities/enum/Enums", "utilities/string/Strings", "utilities/TileHelpers", "mod/IHookHost", "./IDebugTools", "./Inspection"], function (require, exports, Corpses_1, Creatures_1, Doodads_1, IStats_1, Enums_1, Items_1, Translation_1, MapGenHelpers, Mod_1, CheckButton_1, IParticle_1, Particles_1, Shaders, ITerrain_1, ITileEvent_1, Terrains_1, TerrainTemplates_1, TileEvents_1, Enums_2, Strings_1, TileHelpers_1, IHookHost_1, IDebugTools_1, Inspection_1) {
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
            this.registerOptionsSection((api, section) => section
                .append(new CheckButton_1.CheckButton(api)
                .setText(() => new Translation_1.default(this.dictionary, IDebugTools_1.DebugToolsMessage.OptionsAutoOpen))
                .setRefreshMethod(() => !!this.globalData.autoOpen)
                .on(CheckButton_1.CheckButtonEvent.Change, (_, checked) => {
                this.globalData.autoOpen = checked;
            })
                .appendTo(section)));
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
        isPlayerSwimming(player, isSwimming) {
            return player.moveType === Enums_1.MoveType.Flying ? false : undefined;
        }
        getPlayerStrength(strength, player) {
            return strength + this.data.weightBonus;
        }
        getPlayerSpriteBatchLayer(player, batchLayer) {
            return player.moveType === Enums_1.MoveType.Flying ? Enums_1.SpriteBatchLayer.CreatureFlying : undefined;
        }
        onGameScreenVisible() {
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
                bindPressed = this.keyBindDialog;
            }
            if (api.wasPressed(this.keyBindSelectLocation) && !bindPressed) {
                if (this.inspection.isQueryingInspection()) {
                    bindPressed = this.keyBindSelectLocation;
                    this.inspection.inspect(api.mouseX, api.mouseY, this.createDialog);
                }
                else if (this.isPlayingAudio) {
                    bindPressed = this.keyBindSelectLocation;
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
                    bindPressed = this.keyBindSelectLocation;
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
    ], DebugTools.prototype, "isPlayerSwimming", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getPlayerStrength", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "getPlayerSpriteBatchLayer", null);
    __decorate([
        IHookHost_1.HookMethod
    ], DebugTools.prototype, "onGameScreenVisible", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcURBLElBQUksR0FBUSxDQUFDO0lBRWIsZ0JBQWdDLFNBQVEsYUFBRztRQUEzQzs7WUFVUyxtQkFBYyxHQUFHLEtBQUssQ0FBQztZQUV2Qix1QkFBa0IsR0FBRyxLQUFLLENBQUM7UUFrc0JwQyxDQUFDO1FBM3FCTyxZQUFZLENBQUMsY0FBbUI7WUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsRyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BGLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsK0JBQWlCLENBQUMsQ0FBQztZQUV0RSxJQUFJLENBQUMsVUFBVSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDbkQsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDbkIsUUFBUSxFQUFFLEtBQUs7YUFDZixDQUFDO1lBQ0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBRW5DLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFFcEIsR0FBRyxDQUFDLElBQUksQ0FBQywyQkFBMkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsU0FBUyxDQUFDLENBQUM7WUFFL0UsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxF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
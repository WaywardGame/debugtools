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
            this.elementDayNightTime.text(Translation_1.default.getString(game.time.getTranslation(time)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcURBLElBQUksR0FBUSxDQUFDO0lBRWIsTUFBcUIsVUFBVyxTQUFRLGFBQUc7UUFBM0M7O1lBVVMsbUJBQWMsR0FBRyxLQUFLLENBQUM7WUFFdkIsdUJBQWtCLEdBQUcsS0FBSyxDQUFDO1FBa3NCcEMsQ0FBQztRQTNxQk8sWUFBWSxDQUFDLGNBQW1CO1lBQ3RDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEcsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwRixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLCtCQUFpQixDQUFDLENBQUM7WUFFdEUsSUFBSSxDQUFDLFVBQVUsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELGdCQUFnQixFQUFFLENBQUM7Z0JBQ25CLFFBQVEsRUFBRSxLQUFLO2FBQ2YsQ0FBQztZQUNGLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUVuQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBRXBCLEdBQUcsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLFNBQVMsQ0FBQyxDQUFDO1lBRS9FLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVB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
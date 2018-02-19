define(["require", "exports", "creature/corpse/Corpses", "creature/Creatures", "doodad/Doodads", "Enums", "item/Items", "mapgen/MapGenHelpers", "mod/Mod", "renderer/particle/IParticle", "renderer/particle/Particles", "renderer/Shaders", "tile/ITerrain", "tile/ITileEvent", "tile/Terrains", "tile/TerrainTemplates", "tile/TileEvents", "Utilities", "newui/util/CheckButton", "./IDebugTools", "./Inspection"], function (require, exports, Corpses_1, Creatures_1, Doodads_1, Enums_1, Items_1, MapGenHelpers, Mod_1, IParticle_1, Particles_1, Shaders, ITerrain_1, ITileEvent_1, Terrains_1, TerrainTemplates_1, TileEvents_1, Utilities, CheckButton_1, IDebugTools_1, Inspection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DebugTools extends Mod_1.default {
        constructor() {
            super(...arguments);
            this.isPlayingAudio = false;
            this.isCreatingParticle = false;
        }
        onInitialize(saveDataGlobal) {
            this.keyBindDialog = this.addBindable("Toggle", { key: "Backslash" });
            this.keyBindSelectLocation = this.addBindable("SelectLocation", { mouseButton: 0 });
            this.dictionary = this.addDictionary("DebugTools", IDebugTools_1.DebugToolsMessage);
            this.globalData = saveDataGlobal ? saveDataGlobal : {
                initializedCount: 0,
                autoOpen: false
            };
            this.globalData.initializedCount++;
            Utilities.Console.log(Enums_1.Source.Mod, `Initialized debug tools ${this.globalData.initializedCount} times.`);
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
            Utilities.Console.log(Enums_1.Source.Mod, "Uninitialized debug tools!");
            return this.globalData;
        }
        onLoad(saveData) {
            this.data = saveData;
            if (!this.data || !this.data.loadedCount) {
                this.data = {
                    loadedCount: 0,
                    disableLights: false,
                    playerData: {}
                };
            }
            this.data.playerData = this.data.playerData || {};
            this.inspection = new Inspection_1.Inspection(this.dictionary);
            Utilities.Console.log(Enums_1.Source.Mod, `Loaded debug tools ${this.data.loadedCount} times.`, this.data);
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
                player.benignity = 0;
                player.malignity = 0;
                player.updateReputation(argument.object);
                if (player.isLocalPlayer()) {
                    this.updateSliders();
                    ui.refreshAttributes();
                }
            });
            this.setWeightBonusAction = this.addActionType({ name: "Set Weight Bonus", usableAsGhost: true }, (player, argument, result) => {
                player.weightBonus = argument.object;
                if (player.isLocalPlayer()) {
                    this.updateSliders();
                    ui.refreshAttributes();
                }
                game.updateTablesAndWeight();
            });
            this.refreshStatsAction = this.addActionType({ name: "Refresh Stats", usableAsGhost: true }, (player, argument, result) => {
                player.stats.health.value = player.getMaxHealth();
                player.stats.stamina.value = player.dexterity;
                player.stats.hunger.value = player.starvation;
                player.stats.thirst.value = player.dehydration;
                player.status.bleeding = false;
                player.status.burned = false;
                player.status.poisoned = false;
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
            this.unlockRecipesAction = this.addActionType({ name: "Unlock Recipes", usableAsGhost: true }, (player, argument, result) => {
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
                game.updateTablesAndWeight();
            });
            this.reloadShadersAction = this.addActionType({ name: "Reload Shaders", usableAsGhost: true }, (player, argument, result) => {
                Shaders.loadShaders(() => {
                    Shaders.compileShaders();
                    game.updateView(true);
                });
            });
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
                const tileType = Utilities.TileHelpers.getType(tile);
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
                Utilities.TileHelpers.setTilled(tile, tileData[0].tilled);
                world.updateTile(x, y, z, tile);
                renderer.computeSpritesInViewport();
                game.updateRender = true;
            });
            this.teleportToHostAction = this.addActionType({ name: "Teleport to Host", usableAsGhost: true }, (player, argument, result) => {
                if (players.length < 0) {
                    return;
                }
                const nearbyOpenTile = Utilities.TileHelpers.findMatchingTile(players[0], Utilities.TileHelpers.isOpenTile);
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
                creature.happiness = 9999999;
                Utilities.Console.log(Enums_1.Source.Mod, "Tamed creature", creature);
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
        onShowInGameScreen() {
            this.elementContainer = $("<div></div>");
            this.elementInner = $('<div class="inner"></div>');
            this.elementContainer.append(this.elementInner);
            let html = this.generateSelect(Enums_1.TerrainType, Terrains_1.default, "change-tile", "Change Tile");
            html += this.generateSelect(Enums_1.CreatureType, Creatures_1.default, "spawn-creature", "Spawn Creature");
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
            this.elementInner.append($("<button>Inspect</button>").click(() => this.inspection.queryInspection()), $("<button>Refresh Stats</button>").click(() => actionManager.execute(localPlayer, this.refreshStatsAction)), $("<button>Kill All Creatures</button>").click(() => actionManager.execute(localPlayer, this.killAllCreaturesAction)), $("<button>Unlock Recipes</button>").click(() => actionManager.execute(localPlayer, this.unlockRecipesAction)), $("<button>Reload Shaders</button>").click(() => actionManager.execute(localPlayer, this.reloadShadersAction)), $("<button>Noclip</button>").click(() => actionManager.execute(localPlayer, this.noclipAction)), $("<button>Toggle FOV</button>").click(() => {
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
                            if (Utilities.TileHelpers.getType(tile) === Enums_1.TerrainType.DeepSeawater) {
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
            return enemy.moveType === Enums_1.MoveType.Flying ? false : null;
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
                if (objects === undefined || objects[value]) {
                    sorted.push({ id: value, name: makePretty(name) });
                }
            });
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
    exports.default = DebugTools;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQThDQSxnQkFBZ0MsU0FBUSxhQUFHO1FBQTNDOztZQVVTLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1lBRXZCLHVCQUFrQixHQUFHLEtBQUssQ0FBQztRQWtwQnBDLENBQUM7UUE1bkJPLFlBQVksQ0FBQyxjQUFtQjtZQUN0QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7WUFDdEUsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwRixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLCtCQUFpQixDQUFDLENBQUM7WUFFdEUsSUFBSSxDQUFDLFVBQVUsR0FBRyxjQUFjLEdBQUcsY0FBYyxHQUFHO2dCQUNuRCxnQkFBZ0IsRUFBRSxDQUFDO2dCQUNuQixRQUFRLEVBQUUsS0FBSzthQUNmLENBQUM7WUFDRixJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFFbkMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBTSxDQUFDLEdBQUcsRUFBRSwyQkFBMkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsU0FBUyxDQUFDLENBQUM7WUFFeEcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU87Z0JBQ3hDLElBQUkseUJBQVcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3RCLElBQUksRUFBRTt3QkFDTCxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7d0JBQzNCLEtBQUssRUFBRSwrQkFBaUIsQ0FBQyxl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
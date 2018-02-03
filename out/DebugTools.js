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
            }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWJ1Z1Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQTZDQSxnQkFBZ0MsU0FBUSxhQUFHO1FBQTNDOztZQVVTLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1lBRXZCLHVCQUFrQixHQUFHLEtBQUssQ0FBQztRQWduQnBDLENBQUM7UUEzbEJPLFlBQVksQ0FBQyxjQUFtQjtZQUN0QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7WUFDdEUsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwRixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLCtCQUFpQixDQUFDLENBQUM7WUFFdEUsSUFBSSxDQUFDLFVBQVUsR0FBRyxjQUFjLEdBQUcsY0FBYyxHQUFHO2dCQUNuRCxnQkFBZ0IsRUFBRSxDQUFDO2dCQUNuQixRQUFRLEVBQUUsS0FBSzthQUNmLENBQUM7WUFDRixJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFFbkMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBTSxDQUFDLEdBQUcsRUFBRSwyQkFBMkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsU0FBUyxDQUFDLENBQUM7WUFFeEcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU87Z0JBQ3hDLElBQUkseUJBQVcsQ0FBQyxLQUFLLEVBQUU7b0JBQ3RCLElBQUksRUFBRTt3QkFDTCxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7d0JBQzNCLEtBQUssRUFBRSwrQkFBaUIsQ0FBQyxlQUFlO3FCQUN4QztvQkFDRCxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRO29CQUN6QyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTzt3QkFDcEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO29CQUNwQyxDQUFDO2lCQUNELENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEIsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDO1FBRU0sY0FBYztZQUNwQixTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFNLENBQUMsR0FBRyxFQUFFLDRCQUE0QixDQUFDLENBQUM7WUFFaEUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDeEIsQ0FBQztRQUVNLE1BQU0sQ0FBQyxRQUFhO1lBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1lBRXJCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxDQUFDLElBQUksR0FBRztvQkFDWCxXQUFXLEVBQUUsQ0FBQztvQkFDZCxVQUFVLEVBQUUsRUFBRTtpQkFDZCxDQUFDO1lBQ0gsQ0FBQztZQUVELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztZQUVsRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksdUJBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFbEQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBTSxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbkcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFlO2dCQUMxQyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUN4RCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsTUFBZSxFQUFFLFFBQXlCLEVBQUUsTUFBcUI7Z0JBQ2pKLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxNQUFzQixDQUFDO2dCQUVyRCxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBRTVDLE1BQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUMzQixLQUFLLGFBQWE7d0JBQ2pCLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUMzRCxLQUFLLENBQUM7b0JBRVAsS0FBSyxnQkFBZ0I7d0JBQ3BCLGVBQWUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDdEQsS0FBSyxDQUFDO29CQUVQLEtBQUssVUFBVTt3QkFDZCxNQUFNLENBQUMscUJBQXFCLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUM5QyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQzt3QkFDL0IsS0FBSyxDQUFDO29CQUVQLEtBQUssZ0JBQWdCO3dCQUVwQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ25DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzRCQUNqQixhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDbkMsQ0FBQzt3QkFFRCxhQUFhLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDL0MsS0FBSyxDQUFDO29CQUVQLEtBQUssa0JBQWtCO3dCQUN0QixnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNsRCxLQUFLLENBQUM7b0JBRVAsS0FBSyxjQUFjO3dCQUNsQixhQUFhLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDL0MsS0FBSyxDQUFDO29CQUVQLEtBQUssZ0JBQWdCO3dCQUNwQixhQUFhLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDdEQsS0FBSyxDQUFDO2dCQUNSLENBQUM7Z0JBRUQsTUFBTSxDQUFDLHdCQUF3QixFQUFFLENBQUM7Z0JBRWxDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFlLEVBQUUsUUFBeUIsRUFBRSxNQUFxQjtnQkFDcEosSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUVuQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFFekIsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUV0QixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM1QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3RCLENBQUM7WUFDRixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQWUsRUFBRSxRQUF5QixFQUFFLE1BQXFCO2dCQUNoSyxNQUFNLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztnQkFDckIsTUFBTSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7Z0JBRXJCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRXpDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzVCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDckIsRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUM7Z0JBQ3hCLENBQUM7WUFDRixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQWUsRUFBRSxRQUF5QixFQUFFLE1BQXFCO2dCQUVuSyxNQUFNLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBRXJDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzVCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDckIsRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUM7Z0JBQ3hCLENBQUM7Z0JBRUQsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDOUIsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsTUFBZSxFQUFFLFFBQXlCLEVBQUUsTUFBcUI7Z0JBQzlKLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ2xELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO2dCQUM5QyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7Z0JBQy9DLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztnQkFDL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUM3QixNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxLQUFLLEdBQUcsbUJBQVcsQ0FBQyxJQUFJLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsTUFBZSxFQUFFLFFBQXlCLEVBQUUsTUFBcUI7Z0JBQ3ZLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDaEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUNyQyxlQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsQ0FBQztnQkFDRixDQUFDO2dCQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO2dCQUVwQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsTUFBZSxFQUFFLFFBQXlCLEVBQUUsTUFBcUI7Z0JBQ2hLLE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGdCQUFRLENBQUMsQ0FBQztnQkFFdEQsR0FBRyxDQUFDLENBQUMsTUFBTSxRQUFRLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDbEMsTUFBTSxXQUFXLEdBQUcsZUFBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNwQyxFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLE1BQU0sSUFBSSxXQUFXLENBQUMsU0FBUyxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNyRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHOzRCQUN4QixTQUFTLEVBQUUsSUFBSTs0QkFDZixVQUFVLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTt5QkFDdEIsQ0FBQztvQkFDSCxDQUFDO2dCQUNGLENBQUM7Z0JBRUQsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDOUIsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFlLEVBQUUsUUFBeUIsRUFBRSxNQUFxQjtnQkFDaEssT0FBTyxDQUFDLFdBQVcsQ0FBQztvQkFDbkIsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QixDQUFDLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsTUFBZSxFQUFFLFFBQXlCLEVBQUUsTUFBcUI7Z0JBQzVILEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssZ0JBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUN6QyxNQUFNLENBQUMsUUFBUSxHQUFHLGdCQUFRLENBQUMsSUFBSSxDQUFDO2dCQUVqQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNQLE1BQU0sQ0FBQyxRQUFRLEdBQUcsZ0JBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQ25DLENBQUM7Z0JBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFlLEVBQUUsUUFBeUIsRUFBRSxNQUFxQjtnQkFDOUosTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUM1QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRW5DLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDbEMsTUFBTSxDQUFDO2dCQUNSLENBQUM7Z0JBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDMUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBRTdELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0IsUUFBUSxDQUFDLElBQUksQ0FBQzt3QkFDYixJQUFJLEVBQUUsUUFBUTt3QkFDZCxNQUFNLEVBQUUsSUFBSTtxQkFDWixDQUFDLENBQUM7Z0JBRUosQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDUCxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDeEQsQ0FBQztnQkFFRCxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUUxRCxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUVoQyxRQUFRLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDMUIsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFlLEVBQUUsUUFBeUIsRUFBRSxNQUFxQjtnQkFDbkssRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QixNQUFNLENBQUM7Z0JBQ1IsQ0FBQztnQkFHRCxNQUFNLGNBQWMsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUU1RyxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFFNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQWUsRUFBRSxRQUF5QixFQUFFLE1BQXFCO2dCQUNwSyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3BDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDWCxNQUFNLENBQUM7Z0JBQ1IsQ0FBQztnQkFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsTUFBTSxDQUFDO2dCQUNSLENBQUM7Z0JBRUQsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFdEIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGVBQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFakQsUUFBUSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7Z0JBRTdCLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQU0sQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDL0QsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDO1FBRU0sTUFBTTtZQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbEIsQ0FBQztRQUtNLFdBQVcsQ0FBQyxhQUFzQjtZQUV4QyxjQUFjLENBQUMsT0FBTyxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQztRQUN2RCxDQUFDO1FBRU0sZ0JBQWdCLENBQUMsTUFBZSxFQUFFLFVBQW1CO1lBQzNELE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLGdCQUFRLENBQUMsTUFBTSxHQUFHLEtBQUssR0FBRyxTQUFTLENBQUM7UUFDaEUsQ0FBQztRQUVNLGtCQUFrQjtZQUN4QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFaEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBVyxFQUFFLGtCQUFRLEVBQUUsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ3BGLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLG9CQUFZLEVBQUUsbUJBQVMsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3pGLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFRLEVBQUUsZUFBSyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNyRSxJQUFJLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBVSxFQUFFLGlCQUFPLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDbkYsSUFBSSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsMEJBQWEsRUFBRSxvQkFBVSxFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFDL0YsSUFBSSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsb0JBQVksRUFBRSxpQkFBTyxFQUFFLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUNuRixJQUFJLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQywyQkFBZ0IsRUFBRSwwQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3BHLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzVFLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLHdCQUFZLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFFM0YsSUFBSSxJQUFJLDhJQUE4SSxDQUFDO1lBRXZKLElBQUksSUFBSSxtS0FBbUssQ0FBQztZQUU1SyxJQUFJLElBQUksNEpBQTRKLENBQUM7WUFFckssSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQy9FLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBRTNFLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRTtnQkFDaEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBRWxCLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxpQkFBaUIsRUFBRTtnQkFDdkQsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRTtvQkFDdEQsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7aUJBQ2pDLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLG1CQUFtQixFQUFFO2dCQUN6RCxhQUFhLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7b0JBQzVELE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2lCQUNqQyxDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxvQkFBb0IsRUFBRTtnQkFDMUQsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixFQUFFO29CQUM3RCxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztpQkFDakMsQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFO2dCQUN4QyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDcEUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osTUFBTSxDQUFDO2dCQUNSLENBQUM7Z0JBRUQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDMUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDZCxFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQzt3QkFDL0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7d0JBQzNDLENBQUMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO3dCQUM1RSxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztvQkFFdkIsQ0FBQztvQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLGlCQUFpQixDQUFDLENBQUMsQ0FBQzt3QkFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDO3dCQUNuRCxDQUFDLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO3dCQUNyRixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO29CQUU1QixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNQLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUU7NEJBQ3JELE1BQU0sRUFBRTtnQ0FDUCxJQUFJLEVBQUUsUUFBUTtnQ0FDZCxFQUFFLEVBQUUsRUFBRTs2QkFDVTt5QkFDakIsQ0FBQyxDQUFDO29CQUNKLENBQUM7Z0JBQ0YsQ0FBQztZQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQ3ZCLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLENBQUMsRUFDNUUsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFDNUcsQ0FBQyxDQUFDLHFDQUFxQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsRUFDckgsQ0FBQyxDQUFDLGlDQUFpQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsRUFDOUcsQ0FBQyxDQUFDLGlDQUFpQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsRUFDOUcsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBRS9GLENBQUMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDdEMsV0FBVyxDQUFDLFFBQVEsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkIsQ0FBQyxDQUFDLEVBRUYsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUNwQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM1QixRQUFRLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDMUIsQ0FBQyxDQUFDLEVBRUYsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFFNUcsQ0FBQyxDQUFDLDhCQUE4QixDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUN2QyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUMvQixNQUFNLENBQUM7Z0JBQ1IsQ0FBQztnQkFFRCxNQUFNLGFBQWEsR0FBRztvQkFDckIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ3ZDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDOzRCQUN2QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsY0FBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzRCQUNsRCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxtQkFBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0NBQ3RFLFdBQVcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0NBQ3RDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0NBQ3RDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQztnQ0FFakMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQ0FDdEIsTUFBTSxDQUFDOzRCQUNSLENBQUM7d0JBQ0YsQ0FBQztvQkFDRixDQUFDO2dCQUNGLENBQUMsQ0FBQztnQkFFRixhQUFhLEVBQUUsQ0FBQztnQkFFaEIsV0FBVyxDQUFDLHFCQUFxQixDQUFDLGdCQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3RELFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUMxRCxXQUFXLENBQUMscUJBQXFCLENBQUMsZ0JBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDdEQsV0FBVyxDQUFDLHFCQUFxQixDQUFDLGdCQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3ZELFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUV4RCxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMscUJBQXFCLENBQUMsZ0JBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFbEUsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsa0JBQVUsQ0FBQyxjQUFjLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUMvRSxDQUFDLENBQUMsRUFFRixDQUFDLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxhQUFhLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxFQUVqSCxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxhQUFhLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUVuRyxDQUFDLENBQUMsOEJBQThCLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNuQixDQUFDLENBQUMsQ0FDRixDQUFDO1lBRUYsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDN0QsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2xCLEtBQUssRUFBRSxhQUFhO2dCQUNwQixJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRO2dCQUM5QixDQUFDLEVBQUUsRUFBRTtnQkFDTCxDQUFDLEVBQUUsR0FBRztnQkFDTixLQUFLLEVBQUUsR0FBRztnQkFDVixNQUFNLEVBQUUsTUFBTTtnQkFDZCxTQUFTLEVBQUUsS0FBSztnQkFDaEIsTUFBTSxFQUFFO29CQUNQLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDdEIsQ0FBQzthQUNELENBQUMsQ0FBQztRQUNKLENBQUM7UUFFTSxhQUFhO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3RCLENBQUM7UUFFTSxhQUFhO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzlGLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDZCxDQUFDO1lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNsQixDQUFDO1FBRU0sVUFBVSxDQUFDLFdBQTZCLEVBQUUsR0FBbUI7WUFDbkUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDcEMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUNwQixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzVDLFdBQVcsR0FBRyxJQUFJLENBQUM7b0JBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBRXBFLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO29CQUNoQyxXQUFXLEdBQUcsSUFBSSxDQUFDO29CQUNuQixNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUVuRSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3hCLFlBQVksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFDaEMsQ0FBQztvQkFFRCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3hCLFlBQVksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFDaEMsQ0FBQztvQkFFRCxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFcEYsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztvQkFDcEMsV0FBVyxHQUFHLElBQUksQ0FBQztvQkFDbkIsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDbkUsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN4QixZQUFZLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7b0JBQ2hDLENBQUM7b0JBRUQsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN4QixZQUFZLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7b0JBQ2hDLENBQUM7b0JBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLEVBQUUsbUJBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUN2RyxDQUFDO1lBQ0YsQ0FBQztZQUVELE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDcEIsQ0FBQztRQUVNLGlCQUFpQixDQUFDLFFBQW1CLEVBQUUsS0FBMEI7WUFDdkUsTUFBTSxDQUFFLEtBQWEsQ0FBQyxRQUFRLEtBQUssZ0JBQVEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNuRSxDQUFDO1FBRU0sTUFBTSxDQUFDLE1BQWUsRUFBRSxLQUFhLEVBQUUsS0FBYSxFQUFFLElBQVcsRUFBRSxTQUEwQjtZQUNuRyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLGdCQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDekMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNsQixDQUFDO1lBR0QsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDakIsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRztvQkFDdEQsTUFBTSxFQUFFLEtBQUs7b0JBQ2IsV0FBVyxFQUFFLGFBQUssQ0FBQyxRQUFRO2lCQUMzQixDQUFDO1lBQ0gsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixVQUFVLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFbEUsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNQLFVBQVUsQ0FBQyxXQUFXLEdBQUcsYUFBSyxDQUFDLFFBQVEsQ0FBQztZQUN6QyxDQUFDO1lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTlDLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLGtCQUFVLENBQUMsZUFBZSxFQUFFO2dCQUN6RCxTQUFTLEVBQUUsU0FBUzthQUNwQixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUN2QixNQUFNLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRW5GLFVBQVUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBRXpCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFHdEIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFTSxpQkFBaUIsQ0FBQyxNQUFlO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssZ0JBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxNQUFNLENBQUM7WUFDUixDQUFDO1lBRUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLFVBQVUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQzNCLENBQUM7UUFDRixDQUFDO1FBS08sY0FBYyxDQUFDLEtBQVUsRUFBRSxPQUEwQyxFQUFFLFNBQWlCLEVBQUUsU0FBaUI7WUFDbEgsSUFBSSxJQUFJLEdBQUcsa0JBQWtCLFNBQVMsb0JBQW9CLFNBQVMsK0JBQStCLFNBQVMsV0FBVyxDQUFDO1lBRXZILE1BQU0sTUFBTSxHQUFHLElBQUksS0FBSyxFQUFPLENBQUM7WUFDaEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFXO2dCQUM5QixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUNyQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDckMsTUFBTSxJQUFJLEdBQUcsQ0FBQztvQkFDZixDQUFDO29CQUVELE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLENBQUM7Z0JBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNmLENBQUMsQ0FBQztZQUVGLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLO2dCQUMxQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNwRCxDQUFDO1lBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBTSxFQUFFLENBQU0sS0FBYSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUV0RSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDeEMsSUFBSSxJQUFJLG9CQUFvQixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQztZQUN4RSxDQUFDO1lBRUQsSUFBSSxJQUFJLHlEQUF5RCxTQUFTLGNBQWMsQ0FBQztZQUV6RixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUVPLGFBQWE7WUFDcEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUVqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMzRCxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDO2lCQUN2QyxLQUFLLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNqRSxRQUFRLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDO2lCQUN6QyxLQUFLLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxHQUFHLEtBQUssQ0FBQyxHQUFHLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzVGLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUM7aUJBQzFDLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0UsQ0FBQztLQUNEO0lBNW5CRCw2QkE0bkJDIn0=
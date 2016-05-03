var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Mod = (function (_super) {
    __extends(Mod, _super);
    function Mod() {
        _super.apply(this, arguments);
    }
    Mod.prototype.onInitialize = function (saveDataGlobal) {
        if (!saveDataGlobal) {
            saveDataGlobal = { initializedCount: 1 };
        }
        console.log("Initialized developer tools " + saveDataGlobal.initializedCount + " times.");
        saveDataGlobal.initializedCount++;
        return saveDataGlobal;
    };
    Mod.prototype.onLoad = function (saveData) {
        this.data = saveData;
        if (!this.data || !this.data.loadedCount) {
            this.data = {
                loadedCount: 0
            };
        }
        this.noclipDelay = Delay.Movement;
        this.inMove = false;
        this.keyBind = this.addKeyBind(this.getName(), 220);
        console.log("Loaded developer tools " + this.data.loadedCount + " times.", this.data);
    };
    Mod.prototype.onSave = function () {
        this.data.loadedCount++;
        return this.data;
    };
    Mod.prototype.onUnload = function () {
    };
    Mod.prototype.onGameStart = function (isLoadingSave) {
        game.options.hints = false;
        this.noclipEnabled = false;
    };
    Mod.prototype.isPlayerSwimming = function (player, isSwimming) {
        if (this.noclipEnabled) {
            return false;
        }
        else {
            return undefined;
        }
    };
    Mod.prototype.getPlayerSpriteBatchLayer = function (player, batchLayer) {
        if (this.noclipEnabled) {
            return SpriteBatchLayer.FlyingMonster;
        }
        else {
            return undefined;
        }
    };
    Mod.prototype.onShowInGameScreen = function () {
        var _this = this;
        this.container = $("<div></div>");
        var html = this.generateSelect(TerrainType, terrains, "change-tile", "Change Tile");
        html += this.generateSelect(MonsterType, monsters, "spawn-monster", "Spawn Monster");
        html += this.generateSelect(ItemType, Item.defines, "item-get", "Get Item");
        html += this.generateSelect(DoodadType, Doodad.defines, "place-env-item", "Place Doodad");
        html += this.generateSelect(TileEvent.Type, TileEvent.tileEvents, "place-tile-event", "Place Tile Event");
        html += this.generateSelect(MonsterType, corpses, "place-corpse", "Place Corpse");
        html += "DayNight: <input id=\"daynightslider\" type =\"range\" min=\"0.0\" max=\"1.0\" step =\"0.01\" data-range-id=\"daynight\" />";
        this.container.append(html);
        this.container.on("click", ".select-control", function () {
            $("." + $(this).data("control")).trigger("change");
        });
        this.container.on("input change", "#daynightslider", function () {
            game.dayNight = $(this).val();
            game.updateRender = true;
            game.fov.compute();
            if (ui.setRangeValue) {
                ui.setRangeValue("daynight", game.dayNight);
            }
        });
        this.container.on("change", "select", function () {
            var id = parseInt($(this).find("option:selected").data("id"), 10);
            if (id >= 0) {
                if ($(this).hasClass("change-tile")) {
                    game.changeTile({ type: id }, player.x + player.direction.x, player.y + player.direction.y, player.z, false);
                }
                else if ($(this).hasClass("spawn-monster")) {
                    game.spawnMonster(id, player.x + player.direction.x, player.y + player.direction.y, player.z, true);
                }
                else if ($(this).hasClass("item-get")) {
                    Item.create(id);
                    game.updateCraftTableAndWeight();
                }
                else if ($(this).hasClass("place-env-item")) {
                    var tile = game.getTile(player.x + player.direction.x, player.y + player.direction.y, player.z);
                    if (tile.doodadId !== undefined) {
                        Doodad.remove(game.doodads[tile.doodadId]);
                    }
                    var doodad = Doodad.create(id, player.x + player.direction.x, player.y + player.direction.y, player.z);
                    if (Doodad.defines[id].growing) {
                        for (var i = 0; i < Doodad.defines.length; i++) {
                            if (Doodad.defines[i].growth && Doodad.defines[i].growth == id) {
                                doodad.growInto = i;
                                break;
                            }
                        }
                    }
                }
                else if ($(this).hasClass("place-tile-event")) {
                    game.placeTileEvent(TileEvent.create(id, player.x + player.direction.x, player.y + player.direction.y, player.z));
                }
                else if ($(this).hasClass("place-corpse")) {
                    game.placeCorpse({ type: id, x: player.x + player.direction.x, y: player.y + player.direction.y, z: player.z });
                }
                game.updateGame();
            }
        });
        this.container.append($("<button>Refresh Stats</button>").click(function () {
            player.health = player.strength;
            player.stamina = player.dexterity;
            player.hunger = player.starvation;
            player.thirst = player.dehydration;
            player.status.bleeding = false;
            player.status.burning = false;
            player.status.poisoned = false;
            game.updateGame();
        }));
        this.container.append($("<button>Kill All Monsters</button>").click(function () {
            for (var i = 0; i < game.monsters.length; i++) {
                if (game.monsters[i]) {
                    game.deleteMonsters(i);
                }
            }
            game.monsters = [];
            game.updateGame();
        }));
        this.container.append($("<button>Reload Shaders</button>").click(function () {
            Shaders.loadShaders(function () {
                Shaders.compileShaders();
                game.updateGame();
            });
        }));
        this.container.append($("<button>Noclip</button>").click(function () {
            _this.noclipEnabled = !_this.noclipEnabled;
        }));
        this.dialog = this.createDialog(this.container, {
            id: this.getName(),
            title: "Developer Tools",
            x: 10,
            y: 140,
            width: 380,
            height: 315,
            minWidth: 405,
            minHeight: 315,
            onOpen: function () {
                if (ui.setRangeValue) {
                    ui.setRangeValue("daynight", game.dayNight);
                }
            }
        });
    };
    Mod.prototype.onKeyBindPress = function (keyBind) {
        switch (keyBind) {
            case this.keyBind:
                ui.toggleDialog(this.dialog);
                return false;
        }
        return undefined;
    };
    Mod.prototype.canMonsterAttack = function (monsterId, monster) {
        return this.noclipEnabled ? false : null;
    };
    Mod.prototype.onMove = function (nextX, nextY, tile, direction) {
        if (this.noclipEnabled) {
            if (this.inMove) {
                this.noclipDelay = Math.max(this.noclipDelay - 1, 0);
            }
            else {
                this.noclipDelay = Delay.Movement;
            }
            game.addDelay(this.noclipDelay);
            player.updateDirection(direction);
            player.nextX = nextX;
            player.nextY = nextY;
            this.inMove = true;
            game.passTurn();
            return false;
        }
        return null;
    };
    Mod.prototype.onNoInputReceived = function () {
        this.inMove = false;
    };
    Mod.prototype.generateSelect = function (enums, objects, className, labelName) {
        var html = "<select class=\"" + className + "\"><option selected disabled>" + labelName + "</option>";
        var sorted = new Array();
        var makePretty = function (str) {
            var result = str[0];
            for (var i = 1; i < str.length; i++) {
                if (str[i] === str[i].toUpperCase()) {
                    result += " ";
                }
                result += str[i];
            }
            return result;
        };
        objects.forEach(function (obj, index) {
            if (obj && !obj.tall) {
                var enumName = enums[index];
                if (enumName) {
                    sorted.push({ id: index, name: makePretty(enumName) });
                }
            }
        });
        sorted.sort(function (a, b) {
            return b.name.localeCompare(a.name);
        });
        for (var i = sorted.length; i--;) {
            html += "<option data-id=\"" + sorted[i].id + "\">" + sorted[i].name + "</option>";
        }
        html += "</select><button class=\"select-control\" data-control=\"" + className + "\">></button><br />";
        return html;
    };
    return Mod;
}(Mods.Mod));
//# sourceMappingURL=developertools.js.map
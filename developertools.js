var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Inspection = (function () {
    function Inspection(messageDelegate) {
        this.messageDelegate = messageDelegate;
        this.inspectors = [];
        ui.appendStyle("inspection-data", ".inspection-data{width:100%;}.inspection-data th{text-align:left}.inspection-data table{width:100%}");
    }
    Inspection.prototype.isQueryingInspection = function () {
        return this.bQueryInspection;
    };
    Inspection.prototype.queryInspection = function () {
        this.bQueryInspection = true;
        ui.displayMessage(this.messageDelegate.InspectionMessages.QueryInspection, MessageType.None);
    };
    Inspection.prototype.update = function () {
        for (var _i = 0, _a = this.inspectors; _i < _a.length; _i++) {
            var inspector = _a[_i];
            inspector.update();
        }
    };
    Inspection.prototype.inspect = function (mouseX, mouseY, createDialog) {
        var tilePosition = renderer.screenToTile(mouseX, mouseY);
        this.bQueryInspection = false;
        var tile = game.getTile(tilePosition.x, tilePosition.y, player.z);
        if (tile.monsterId !== undefined) {
            var inspector = new MonsterInspector(tile.monsterId, mouseX, mouseY);
            inspector.createDialog(createDialog);
            this.inspectors.push(inspector);
        }
        else {
            ui.displayMessage(this.messageDelegate.InspectionMessages.QueryObjectNotFound, MessageType.Bad);
        }
    };
    return Inspection;
}());
var Inspector = (function () {
    function Inspector(target, id, title, mouseX, mouseY) {
        var _this = this;
        this.target = target;
        this.dialogContainer = $("<div></div>");
        this.dialogInfo = {
            id: id,
            title: "Inspector - " + title,
            x: mouseX,
            y: mouseY,
            width: 380,
            height: 400,
            minWidth: 150,
            minHeight: 50,
            onOpen: function () {
            },
            onResizeStop: function () {
            }
        };
        this.dialogContainer.append($("<button>Log</button>").click(function () {
            console.log(_this.target);
        }));
        this.dataContainer = $("<table class='inspection-data'></table>");
        this.dialogContainer.append(this.dataContainer);
    }
    Inspector.prototype.createDialog = function (creator) {
        this.dialog = creator(this.dialogContainer, this.dialogInfo);
        ui.openDialog(this.dialog);
    };
    return Inspector;
}());
var MonsterInspector = (function (_super) {
    __extends(MonsterInspector, _super);
    function MonsterInspector(monsterId, mouseX, mouseY) {
        var monster = game.monsters[monsterId];
        var desc = monsters[monster.type];
        _super.call(this, monster, "monster-id:" + monsterId, "Monster (" + desc.name + ")", mouseX, mouseY);
        this.monsterId = monsterId;
        this.monster = (this.target);
        var data = $("<table></table>");
        data.append("<tr><th rowspan='3'>Position:</th><td>fromX:</td><td data-attribute=\"fromX\"></td><td>x:</td><td data-attribute=\"x\"></tr>");
        data.append("<tr><td>fromY:</td><td data-attribute=\"fromY\"></td><td>y:</td><td data-attribute=\"y\"></tr>");
        data.append("<tr><td></td><td></td><td>z:</td><td data-attribute=\"z\"></tr>");
        this.dataContainer.append($("<tr></tr>").append($("<td></td>").append(data)));
        data = $("<table></table>");
        data.append("<tr><th>Behaviors:</th><td data-attribute=\"ai\"></td></tr>");
        this.dataContainer.append($("<tr></tr>").append($("<td></td>").append(data)));
        var dc = this.dataContainer;
        this.attributes = {
            fromX: dc.find("[data-attribute='fromX']"),
            fromY: dc.find("[data-attribute='fromY']"),
            x: dc.find("[data-attribute='x']"),
            y: dc.find("[data-attribute='y']"),
            z: dc.find("[data-attribute='z']"),
            ai: dc.find("[data-attribute='ai']")
        };
        this.update();
    }
    MonsterInspector.prototype.update = function () {
        if (game.monsters[this.monsterId] === undefined) {
            return;
        }
        for (var key in this.attributes) {
            var attr = this.attributes[key];
            if (key == "ai") {
                var values = Object.keys(MonsterAiType).map(function (k) { return MonsterAiType[k]; }).filter(function (v) { return typeof v === "number"; });
                var ai = this.monster[key];
                var behaviors = [];
                for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                    var behavior = values_1[_i];
                    if ((ai & behavior) === behavior) {
                        behaviors.push(MonsterAiType[behavior]);
                    }
                }
                attr.text(behaviors.join(', '));
            }
            else {
                attr.text(this.monster[key].toString());
            }
        }
    };
    return MonsterInspector;
}(Inspector));
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
        this.InspectionMessages = {
            QueryInspection: this.addMessage("QueryInspection", "Choose an object to inspect by clicking on its tile."),
            QueryObjectNotFound: this.addMessage("QueryObjectNotFound", "The selected tile contains no object that can be inspected.")
        };
        this.inspection = new Inspection(this);
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
    Mod.prototype.onShowInGameScreen = function () {
        var _this = this;
        this.container = $("<div></div>");
        this.inner = $("<div class=\"inner\"></div>");
        this.container.append(this.inner);
        var html = this.generateSelect(TerrainType, terrains, "change-tile", "Change Tile");
        html += this.generateSelect(MonsterType, monsters, "spawn-monster", "Spawn Monster");
        html += this.generateSelect(ItemType, Item.defines, "item-get", "Get Item");
        html += this.generateSelect(DoodadType, Doodad.defines, "place-env-item", "Place Doodad");
        html += this.generateSelect(TileEvent.Type, TileEvent.tileEvents, "place-tile-event", "Place Tile Event");
        html += this.generateSelect(MonsterType, corpses, "place-corpse", "Place Corpse");
        html += "DayNight: <input id=\"daynightslider\" type =\"range\" min=\"0.0\" max=\"1.0\" step =\"0.01\" data-range-id=\"daynight\" />";
        this.inner.append(html);
        this.inner.on("click", ".select-control", function () {
            $("." + $(this).data("control")).trigger("change");
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
                            if (Doodad.defines[i].growth && Doodad.defines[i].growth === id) {
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
        this.inner.append($("<button>Inspect</button>").click(function () {
            _this.inspection.queryInspection();
        }));
        this.inner.append($("<button>Refresh Stats</button>").click(function () {
            player.health = player.strength;
            player.stamina = player.dexterity;
            player.hunger = player.starvation;
            player.thirst = player.dehydration;
            player.status.bleeding = false;
            player.status.burned = false;
            player.status.poisoned = false;
            game.updateGame();
        }));
        this.inner.append($("<button>Kill All Monsters</button>").click(function () {
            for (var i = 0; i < game.monsters.length; i++) {
                if (game.monsters[i]) {
                    game.deleteMonsters(i);
                }
            }
            game.monsters = [];
            game.updateGame();
        }));
        this.inner.append($("<button>Reload Shaders</button>").click(function () {
            Shaders.loadShaders(function () {
                Shaders.compileShaders();
                game.updateGame();
            });
        }));
        this.inner.append($("<button>Noclip</button>").click(function () {
            _this.noclipEnabled = !_this.noclipEnabled;
            if (_this.noclipEnabled) {
                player.moveType = MoveType.Flying;
            }
            else {
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
            onOpen: function () {
                if (ui.setRangeValue) {
                    ui.setRangeValue("daynight", game.dayNight);
                }
            },
            onResizeStop: function () {
                _this.updateDialogHeight();
            }
        });
    };
    Mod.prototype.onTurnComplete = function () {
        this.inspection.update();
    };
    Mod.prototype.onMouseDown = function (event) {
        if (this.inspection.isQueryingInspection()) {
            var mousePosition = ui.getMousePositionFromMouseEvent(event);
            this.inspection.inspect(mousePosition.x, mousePosition.y, this.createDialog);
            return false;
        }
    };
    Mod.prototype.onKeyBindPress = function (keyBind) {
        switch (keyBind) {
            case this.keyBind:
                ui.toggleDialog(this.dialog);
                this.updateDialogHeight();
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
    Mod.prototype.updateDialogHeight = function () {
        if (!this.dialog) {
            return;
        }
        var height = this.container.find(".inner").outerHeight() + 43;
        this.container.dialog("option", "height", height);
        this.container.dialog("option", "maxHeight", height);
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
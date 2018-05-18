define(["require", "exports", "creature/Creatures", "entity/IEntity", "Enums", "language/IMessages", "language/Translation", "utilities/enum/Enums", "utilities/TileHelpers", "./IDebugTools"], function (require, exports, Creatures_1, IEntity_1, Enums_1, IMessages_1, Translation_1, Enums_2, TileHelpers_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let log;
    class Inspection {
        constructor(dictionary, logIn) {
            log = logIn;
            this.dictionary = dictionary;
            this.inspectors = [];
            ui.appendStyle("inspection-data", ".inspection-data{width:100%;}.inspection-data th{text-align:left}.inspection-data table{width:100%}");
        }
        isQueryingInspection() {
            return this.bQueryInspection;
        }
        queryInspection() {
            this.bQueryInspection = true;
            localPlayer.sendMessage(new Translation_1.default(this.dictionary, IDebugTools_1.DebugToolsMessage.QueryInspection).get());
        }
        update() {
            for (const inspector of this.inspectors) {
                inspector.update();
            }
        }
        inspect(mouseX, mouseY, createDialog) {
            const tilePosition = renderer.screenToTile(mouseX, mouseY);
            this.bQueryInspection = false;
            const tile = game.getTile(tilePosition.x, tilePosition.y, localPlayer.z);
            log.info(`Tile at (${tilePosition.x}, ${tilePosition.y}, ${localPlayer.z}).`, tile);
            log.info(`Type: ${Enums_1.TerrainType[TileHelpers_1.default.getType(tile)]}`);
            log.info(`Gfx: ${TileHelpers_1.default.getGfx(tile)}`);
            if (tile.creature) {
                const inspector = new CreatureInspector(tile.creature, mouseX, mouseY);
                inspector.createDialog(createDialog);
                this.inspectors.push(inspector);
            }
            else if (tile.doodad) {
                log.info("Doodad", tile.doodad);
            }
            else {
                localPlayer.sendMessage(new Translation_1.default(this.dictionary, IDebugTools_1.DebugToolsMessage.QueryObjectNotFound).get(), IMessages_1.MessageType.Bad);
            }
        }
    }
    exports.Inspection = Inspection;
    class Inspector {
        constructor(target, id, title, mouseX, mouseY) {
            this.target = target;
            this.dialogContainer = $("<div></div>");
            this.dialogInfo = {
                id: id,
                title: `Inspector - ${title}`,
                x: mouseX,
                y: mouseY,
                width: 380,
                height: 400,
                minWidth: 150,
                minHeight: 50,
                onOpen: () => {
                },
                onResizeStop: () => {
                }
            };
            this.dialogContainer.append($("<button>Log</button>").click(() => {
                log.info(this.target);
            }));
            this.dataContainer = $("<table class='inspection-data'></table>");
            this.dialogContainer.append(this.dataContainer);
        }
        createDialog(creator) {
            this.dialog = creator(this.dialogContainer, this.dialogInfo);
            ui.openDialog(this.dialog);
        }
    }
    class CreatureInspector extends Inspector {
        constructor(creature, mouseX, mouseY) {
            const desc = Creatures_1.default[creature.type];
            super(creature, `creature-id:${creature.id}`, `Creature (${desc.name})`, mouseX, mouseY);
            this.creatureId = creature.id;
            this.creature = (this.target);
            let data = $("<table></table>");
            data.append(`<tr><th rowspan='3'>Position:</th><td>fromX:</td><td data-attribute="fromX"></td><td>x:</td><td data-attribute="x"></tr>`);
            data.append('<tr><td>fromY:</td><td data-attribute="fromY"></td><td>y:</td><td data-attribute="y"></tr>');
            data.append('<tr><td></td><td></td><td>z:</td><td data-attribute="z"></tr>');
            this.dataContainer.append($("<tr></tr>").append($("<td></td>").append(data)));
            data = $("<table></table>");
            data.append('<tr><th>Behaviors:</th><td data-attribute="ai"></td></tr>');
            this.dataContainer.append($("<tr></tr>").append($("<td></td>").append(data)));
            const dc = this.dataContainer;
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
        update() {
            if (game.creatures[this.creatureId] === undefined) {
                return;
            }
            for (const key in this.attributes) {
                const attr = this.attributes[key];
                if (key === "ai") {
                    const values = Enums_2.default.values(IEntity_1.AiType);
                    const ai = this.creature[key];
                    const behaviors = [];
                    for (const behavior of values) {
                        if ((ai & behavior) === behavior) {
                            behaviors.push(IEntity_1.AiType[behavior]);
                        }
                    }
                    attr.text(behaviors.join(", "));
                }
                else {
                    attr.text(this.creature[key].toString());
                }
            }
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9JbnNwZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQVlBLElBQUksR0FBUSxDQUFDO0lBRWI7UUFNQyxZQUFZLFVBQWtCLEVBQUUsS0FBVTtZQUN6QyxHQUFHLEdBQUcsS0FBSyxDQUFDO1lBQ1osSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFDckIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxxR0FBcUcsQ0FBQyxDQUFDO1FBQzFJLENBQUM7UUFFTSxvQkFBb0I7WUFDMUIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDOUIsQ0FBQztRQUVNLGVBQWU7WUFDckIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztZQUM3QixXQUFXLENBQUMsV0FBVyxDQUFDLElBQUkscUJBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLCtCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDcEcsQ0FBQztRQUVNLE1BQU07WUFDWixLQUFLLE1BQU0sU0FBUyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ3hDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNuQjtRQUNGLENBQUM7UUFFTSxPQUFPLENBQUMsTUFBYyxFQUFFLE1BQWMsRUFBRSxZQUEwRTtZQUN4SCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1lBQzlCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMs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
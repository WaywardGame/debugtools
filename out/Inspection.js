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
            localPlayer.messages.send(new Translation_1.default(this.dictionary, IDebugTools_1.DebugToolsTranslation.QueryInspection).get());
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
                localPlayer.messages.type(IMessages_1.MessageType.Bad)
                    .send(new Translation_1.default(this.dictionary, IDebugTools_1.DebugToolsTranslation.QueryObjectNotFound).get());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9JbnNwZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQVlBLElBQUksR0FBUSxDQUFDO0lBRWIsTUFBYSxVQUFVO1FBTXRCLFlBQVksVUFBa0IsRUFBRSxLQUFVO1lBQ3pDLEdBQUcsR0FBRyxLQUFLLENBQUM7WUFDWixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUNyQixFQUFFLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFLHFHQUFxRyxDQUFDLENBQUM7UUFDMUksQ0FBQztRQUVNLG9CQUFvQjtZQUMxQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUM5QixDQUFDO1FBRU0sZUFBZTtZQUNyQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1lBQzdCLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUkscUJBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLG1DQUFxQixDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDMUcsQ0FBQztRQUVNLE1BQU07WUFDWixLQUFLLE1BQU0sU0FBUyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ3hDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNuQjtRQUNGLENBQUM7UUFFTSxPQUFPLENBQUMsTUFBYyxFQUFFLE1BQWMsRUFBRSxZQUEwRTtZQUN4SCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1lBQzlCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxFQUFF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
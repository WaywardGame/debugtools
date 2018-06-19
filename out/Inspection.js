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
            localPlayer.messages.send(new Translation_1.default(this.dictionary, IDebugTools_1.DebugToolsMessage.QueryInspection).get());
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
                    .send(new Translation_1.default(this.dictionary, IDebugTools_1.DebugToolsMessage.QueryObjectNotFound).get());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9JbnNwZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQVlBLElBQUksR0FBUSxDQUFDO0lBRWI7UUFNQyxZQUFZLFVBQWtCLEVBQUUsS0FBVTtZQUN6QyxHQUFHLEdBQUcsS0FBSyxDQUFDO1lBQ1osSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFDckIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxxR0FBcUcsQ0FBQyxDQUFDO1FBQzFJLENBQUM7UUFFTSxvQkFBb0I7WUFDMUIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDOUIsQ0FBQztRQUVNLGVBQWU7WUFDckIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztZQUM3QixXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLHFCQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSwrQkFBaUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3RHLENBQUM7UUFFTSxNQUFNO1lBQ1osS0FBSyxNQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUN4QyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDbkI7UUFDRixDQUFDO1FBRU0sT0FBTyxDQUFDLE1BQWMsRUFBRSxNQUFjLEVBQUUsWUFBMEU7WUFDeEgsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztZQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMs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
define(["require", "exports", "creature/Creatures", "creature/ICreature", "Enums", "language/Messages", "Utilities", "./IDebugTools"], function (require, exports, Creatures_1, ICreature_1, Enums_1, Messages_1, Utilities, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Inspection {
        constructor(dictionary) {
            this.dictionary = dictionary;
            this.inspectors = [];
            ui.appendStyle("inspection-data", ".inspection-data{width:100%;}.inspection-data th{text-align:left}.inspection-data table{width:100%}");
        }
        isQueryingInspection() {
            return this.bQueryInspection;
        }
        queryInspection() {
            this.bQueryInspection = true;
            ui.displayMessage(localPlayer, languageManager.getTranslationString(this.dictionary, IDebugTools_1.DebugToolsMessage.QueryInspection), Messages_1.MessageType.None);
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
            Utilities.Console.log(Enums_1.Source.Mod, `Tile at (${tilePosition.x}, ${tilePosition.y}, ${localPlayer.z}).`, tile);
            Utilities.Console.log(Enums_1.Source.Mod, `Type: ${Enums_1.TerrainType[Utilities.TileHelpers.getType(tile)]}`);
            Utilities.Console.log(Enums_1.Source.Mod, `Gfx: ${Utilities.TileHelpers.getGfx(tile)}`);
            if (tile.creature) {
                const inspector = new CreatureInspector(tile.creature, mouseX, mouseY);
                inspector.createDialog(createDialog);
                this.inspectors.push(inspector);
            }
            else if (tile.doodad) {
                Utilities.Console.log(Enums_1.Source.Mod, "Doodad", tile.doodad);
            }
            else {
                ui.displayMessage(localPlayer, languageManager.getTranslationString(this.dictionary, IDebugTools_1.DebugToolsMessage.QueryObjectNotFound), Messages_1.MessageType.Bad);
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
                Utilities.Console.log(Enums_1.Source.Mod, this.target);
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
                    const values = Utilities.Enums.getValues(ICreature_1.AiType);
                    const ai = this.creature[key];
                    const behaviors = [];
                    for (const behavior of values) {
                        if ((ai & behavior) === behavior) {
                            behaviors.push(ICreature_1.AiType[behavior]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9JbnNwZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQVNBO1FBTUMsWUFBWSxVQUFrQjtZQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUNyQixFQUFFLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFLHFHQUFxRyxDQUFDLENBQUM7UUFDMUksQ0FBQztRQUVNLG9CQUFvQjtZQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBQzlCLENBQUM7UUFFTSxlQUFlO1lBQ3JCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7WUFDN0IsRUFBRSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsK0JBQWlCLENBQUMsZUFBZSxDQUFDLEVBQUUsc0JBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1SSxDQUFDO1FBRU0sTUFBTTtZQUNaLEdBQUcsQ0FBQyxDQUFDLE1BQU0sU0FBUyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDcEIsQ0FBQztRQUNGLENBQUM7UUFFTSxPQUFPLENBQUMsTUFBYyxFQUFFLE1BQWMsRUFBRSxZQUEwRTtZQUN4SCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1lBQzlCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV6RSxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFNLENBQUMsR0FBRyxFQUFFLFlBQVksWUFBWSxDQUFDLENBQUMsS0FBSyxZQUFZLENBQUMsQ0FBQyxLQUFLLFdBQVcsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUU3RyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFNLENBQUMsR0FBRyxFQUFFLFNBQVMsbUJBQVcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMvRixTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFNLENBQUMsR0FBRyxFQUFFLFFBQVEsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRWhGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixNQUFNLFNBQVMsR0FBRyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUN2RSxTQUFTLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUVqQyxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFNLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFMUQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNQLEVBQUUsQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLCtCQUFpQixDQUFDLG1CQUFtQixDQUFDLEVBQUUsc0JBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvSSxDQUFDO1FBQ0YsQ0FBQztLQUVEO0lBbERELGdDQWtEQztJQUVEO1FBUUMsWUFBWSxNQUFjLEVBQUUsRUFBVSxFQUFFLEtBQWEsRUFBRSxNQUFjLEVBQUUsTUFBYztZQUNwRixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUNyQixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsVUFBVSxHQUFHO2dCQUNqQixFQUFFLEVBQUUsRUFBRTtnQkFDTixLQUFLLEVBQUUsZUFBZSxLQUFLLEVBQUU7Z0JBQzdCLENBQUMsRUFBRSxNQUFNO2dCQUNULENBQUMsRUFBRSxNQUFNO2dCQUNULEtBQUssRUFBRSxHQUFHO2dCQUNWLE1BQU0sRUFBRSxHQUFHO2dCQUNYLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFNBQVMsRUFBRSxFQUFFO2dCQUNiLE1BQU0sRUFBRTtnQkFDUixDQUFDO2dCQUNELFlBQVksRUFBRTtnQkFDZCxDQUFDO2FBQ0QsQ0FBQztZQUVGLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDM0QsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVKLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFJTSxZQUFZLENBQUMsT0FBcUU7WUFDeEYsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDN0QsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUIsQ0FBQztLQUNEO0lBRUQsdUJBQXdCLFNBQVEsU0FBUztRQUl4QyxZQUFZLFFBQW1CLEVBQUUsTUFBYyxFQUFFLE1BQWM7WUFDOUQsTUFBTSxJQUFJLEdBQUcsbUJBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsS0FBSyxDQUFDLFFBQVEsRUFBRSxlQUFlLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxhQUFhLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDekYsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFjLENBQUM7WUFDM0MsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQywwSEFBMEgsQ0FBQyxDQUFDO1lBQ3hJLElBQUksQ0FBQyxNQUFNLENBQUMsNEZBQTRGLENBQUMsQ0FBQztZQUMxRyxJQUFJLENBQUMsTUFBTSxDQUFDLCtEQUErRCxDQUFDLENBQUM7WUFDN0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1lBQ3pFLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHO2dCQUNqQixLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQztnQkFDMUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUM7Z0JBQzFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDO2dCQUNsQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztnQkFDbEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUM7Z0JBQ2xDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDO2FBQ3BDLENBQUM7WUFDRixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZixDQUFDO1FBRU0sTUFBTTtZQUNaLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBRW5ELE1BQU0sQ0FBQztZQUNSLENBQUM7WUFFRCxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFNLENBQUMsQ0FBQztvQkFDakQsTUFBTSxFQUFFLEdBQUksSUFBSSxDQUFDLFFBQWdCLENBQUMsR0FBRyxDQUFXLENBQUM7b0JBQ2pELE1BQU0sU0FBUyxHQUFhLEVBQUUsQ0FBQztvQkFDL0IsR0FBRyxDQUFDLENBQUMsTUFBTSxRQUFRLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQzs0QkFDbEMsU0FBUyxDQUFDLElBQUksQ0FBQyxrQkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQ2xDLENBQUM7b0JBQ0YsQ0FBQztvQkFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFFakMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDUCxJQUFJLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxRQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ25ELENBQUM7WUFDRixDQUFDO1FBQ0YsQ0FBQztLQUNEIn0=
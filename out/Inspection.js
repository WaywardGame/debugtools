define(["require", "exports", "creature/Creatures", "creature/ICreature", "Enums", "language/Messages", "Utilities"], function (require, exports, Creatures_1, ICreature_1, Enums_1, Messages_1, Utilities) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Inspection {
        constructor(messageDelegate) {
            this.messageDelegate = messageDelegate;
            this.inspectors = [];
            ui.appendStyle("inspection-data", ".inspection-data{width:100%;}.inspection-data th{text-align:left}.inspection-data table{width:100%}");
        }
        isQueryingInspection() {
            return this.bQueryInspection;
        }
        queryInspection() {
            this.bQueryInspection = true;
            ui.displayMessage(localPlayer, this.messageDelegate.inspectionMessages.QueryInspection, Messages_1.MessageType.None);
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
            if (tile.creatureId !== undefined) {
                const inspector = new CreatureInspector(tile.creatureId, mouseX, mouseY);
                inspector.createDialog(createDialog);
                this.inspectors.push(inspector);
            }
            else {
                Utilities.Console.log(Enums_1.Source.Mod, `Tile position: ${tilePosition.x}, ${tilePosition.y}, ${localPlayer.z}.`, tile);
                ui.displayMessage(localPlayer, this.messageDelegate.inspectionMessages.QueryObjectNotFound, Messages_1.MessageType.Bad);
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
        constructor(creatureId, mouseX, mouseY) {
            const creature = game.creatures[creatureId];
            const desc = Creatures_1.default[creature.type];
            super(creature, `creature-id:${creatureId}`, `Creature (${desc.name})`, mouseX, mouseY);
            this.creatureId = creatureId;
            this.creature = (this.target);
            let data = $("<table></table>");
            data.append(`<tr><th rowspan='3'>Position:</th><td>fromX:</td><td data-attribute="fromX"></td><td>x:</td><td data-attribute="x"></tr>`);
            data.append(`<tr><td>fromY:</td><td data-attribute="fromY"></td><td>y:</td><td data-attribute="y"></tr>`);
            data.append(`<tr><td></td><td></td><td>z:</td><td data-attribute="z"></tr>`);
            this.dataContainer.append($("<tr></tr>").append($("<td></td>").append(data)));
            data = $("<table></table>");
            data.append(`<tr><th>Behaviors:</th><td data-attribute="ai"></td></tr>`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9JbnNwZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQWdCQTtRQU1DLFlBQVksZUFBMkM7WUFDdEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7WUFDdkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFDckIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxxR0FBcUcsQ0FBQyxDQUFDO1FBQzFJLENBQUM7UUFFTSxvQkFBb0I7WUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUM5QixDQUFDO1FBRU0sZUFBZTtZQUNyQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLHNCQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0csQ0FBQztRQUVNLE1BQU07WUFDWixHQUFHLENBQUMsQ0FBQyxNQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDekMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3BCLENBQUM7UUFDRixDQUFDO1FBRU0sT0FBTyxDQUFDLE1BQWMsRUFBRSxNQUFjLEVBQUUsWUFBMEU7WUFDeEgsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztZQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekUsRUFBRSxDQUFDLENBQUMsSUFB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
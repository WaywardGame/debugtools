define(["require", "exports"], function (require, exports) {
    "use strict";
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
            ui.displayMessage(this.messageDelegate.inspectionMessages.QueryInspection, MessageType.None);
        }
        update() {
            for (let inspector of this.inspectors) {
                inspector.update();
            }
        }
        inspect(mouseX, mouseY, createDialog) {
            const tilePosition = renderer.screenToTile(mouseX, mouseY);
            this.bQueryInspection = false;
            const tile = game.getTile(tilePosition.x, tilePosition.y, player.z);
            if (tile.creatureId !== undefined) {
                const inspector = new CreatureInspector(tile.creatureId, mouseX, mouseY);
                inspector.createDialog(createDialog);
                this.inspectors.push(inspector);
            }
            else {
                ui.displayMessage(this.messageDelegate.inspectionMessages.QueryObjectNotFound, MessageType.Bad);
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
                Utilities.Console.log(Source.Mod, this.target);
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
            const desc = Creature.defines[creature.type];
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
            for (let key in this.attributes) {
                const attr = this.attributes[key];
                if (key === "ai") {
                    const values = Utilities.Enums.getValues(Creature.AiType);
                    const ai = this.creature[key];
                    let behaviors = [];
                    for (let behavior of values) {
                        if ((ai & behavior) === behavior) {
                            behaviors.push(Creature.AiType[behavior]);
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
//# sourceMappingURL=inspection.js.map
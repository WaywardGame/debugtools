import Creatures from "creature/Creatures";
import { AiType, ICreature } from "creature/ICreature";
import { Source } from "Enums";
import { MessageType } from "language/Messages";
import { IDialogInfo } from "ui/IUi";
import * as Utilities from "Utilities";

export interface IInspectionMessages {
	QueryInspection: number;
	QueryObjectNotFound: number;
}

export interface IInspectionMessageDelegate {
	inspectionMessages: IInspectionMessages;
}

export class Inspection {

	private bQueryInspection: boolean;
	private messageDelegate: IInspectionMessageDelegate;
	private inspectors: Inspector[];

	constructor(messageDelegate: IInspectionMessageDelegate) {
		this.messageDelegate = messageDelegate;
		this.inspectors = [];
		ui.appendStyle("inspection-data", ".inspection-data{width:100%;}.inspection-data th{text-align:left}.inspection-data table{width:100%}");
	}

	public isQueryingInspection() {
		return this.bQueryInspection;
	}

	public queryInspection() {
		this.bQueryInspection = true;
		ui.displayMessage(localPlayer, this.messageDelegate.inspectionMessages.QueryInspection, MessageType.None);
	}

	public update() {
		for (const inspector of this.inspectors) {
			inspector.update();
		}
	}

	public inspect(mouseX: number, mouseY: number, createDialog: (dialogContainer: JQuery, dialogInfo: IDialogInfo) => JQuery) {
		const tilePosition = renderer.screenToTile(mouseX, mouseY);
		this.bQueryInspection = false;
		const tile = game.getTile(tilePosition.x, tilePosition.y, localPlayer.z);
		if (tile.creatureId !== undefined) {
			const inspector = new CreatureInspector(tile.creatureId, mouseX, mouseY);
			inspector.createDialog(createDialog);
			this.inspectors.push(inspector);
		} else {
			Utilities.Console.log(Source.Mod, `Tile position: ${tilePosition.x}, ${tilePosition.y}, ${localPlayer.z}.`, tile);
			ui.displayMessage(localPlayer, this.messageDelegate.inspectionMessages.QueryObjectNotFound, MessageType.Bad);
		}
	}

}

abstract class Inspector {
	public target: object;
	protected dataContainer: JQuery;
	protected attributes: { [index: string]: JQuery };
	private dialog: JQuery;
	private dialogInfo: IDialogInfo;
	private dialogContainer: JQuery;

	constructor(target: object, id: string, title: string, mouseX: number, mouseY: number) {
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

	public abstract update(): void;

	public createDialog(creator: (dialogContainer: JQuery, dialogInfo: IDialogInfo) => JQuery) {
		this.dialog = creator(this.dialogContainer, this.dialogInfo);
		ui.openDialog(this.dialog);
	}
}

class CreatureInspector extends Inspector {
	public creature: ICreature;
	private creatureId: number;

	constructor(creatureId: number, mouseX: number, mouseY: number) {
		const creature = game.creatures[creatureId];
		const desc = Creatures[creature.type];
		super(creature, `creature-id:${creatureId}`, `Creature (${desc.name})`, mouseX, mouseY);
		this.creatureId = creatureId;
		this.creature = (this.target) as ICreature;
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

	public update() {
		if (game.creatures[this.creatureId] === undefined) {
			// TODO:
			return;
		}

		for (const key in this.attributes) {
			const attr = this.attributes[key];
			if (key === "ai") {
				const values = Utilities.Enums.getValues(AiType);
				const ai = (this.creature as any)[key] as AiType;
				const behaviors: string[] = [];
				for (const behavior of values) {
					if ((ai & behavior) === behavior) {
						behaviors.push(AiType[behavior]);
					}
				}
				attr.text(behaviors.join(", "));
			} else {
				attr.text((this.creature as any)[key].toString());
			}
		}
	}
}

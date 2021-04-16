import { Events, IEventEmitter } from "event/EventEmitter";
import { NPCType } from "game/entity/npc/INPCs";
import Component from "ui/component/Component";
import NPCDropdown from "ui/component/dropdown/NPCDropdown";
import { LabelledRow } from "ui/component/LabelledRow";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";

export default class NPCPaint extends Component implements IPaintSection {
	@Override public event: IEventEmitter<this, Events<IPaintSection>>;

	private readonly dropdown: NPCDropdown<"nochange" | "remove">;

	private npc: NPCType | "remove" | undefined;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelNPC)))
			.append(this.dropdown = new NPCDropdown("nochange", [
				["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
				["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
			])
				.event.subscribe("selection", this.changeNPC))
			.appendTo(this);
	}

	public getTilePaintData() {
		return this.npc === undefined ? undefined : {
			npc: {
				type: this.npc,
			},
		};
	}

	public isChanging() {
		return this.npc !== undefined;
	}

	public reset() {
		this.dropdown.select("nochange");
	}

	@Bound
	private changeNPC(_: any, npc: NPCType | "nochange" | "remove") {
		this.npc = npc === "nochange" ? undefined : npc === "remove" ? "remove" : npc;

		this.event.emit("change");
	}
}

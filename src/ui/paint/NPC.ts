import type { NPCType } from "@wayward/game/game/entity/npc/INPCs";
import Component from "@wayward/game/ui/component/Component";
import NPCTypeDropdown from "@wayward/game/ui/component/dropdown/NPCTypeDropdown";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import { Bound } from "@wayward/utilities/Decorators";
import type { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import type { IPaintSection } from "../panel/PaintPanel";

export default class NPCPaint extends Component implements IPaintSection {
	declare public event: IEventEmitter<this, Events<IPaintSection>>;

	private readonly dropdown: NPCTypeDropdown<"nochange" | "remove">;

	private npc: NPCType | "remove" | undefined;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelNPC)))
			.append(this.dropdown = new NPCTypeDropdown("nochange", [
				["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
				["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
			])
				.event.subscribe("selection", this.changeNPC))
			.appendTo(this);
	}

	public getTilePaintData(): { npc: { type: NPCType | "remove" } } | undefined {
		return this.npc === undefined ? undefined : {
			npc: {
				type: this.npc,
			},
		};
	}

	public isChanging(): boolean {
		return this.npc !== undefined;
	}

	public reset(): void {
		this.dropdown.select("nochange");
	}

	@Bound
	private changeNPC(_: any, npc: NPCType | "nochange" | "remove"): void {
		this.npc = npc === "nochange" ? undefined : npc === "remove" ? "remove" : npc;

		this.event.emit("change");
	}
}

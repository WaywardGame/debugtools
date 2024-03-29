/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { Events, IEventEmitter } from "event/EventEmitter";
import { NPCType } from "game/entity/npc/INPCs";
import Component from "ui/component/Component";
import NPCTypeDropdown from "ui/component/dropdown/NPCTypeDropdown";
import { LabelledRow } from "ui/component/LabelledRow";
import { Bound } from "utilities/Decorators";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";

export default class NPCPaint extends Component implements IPaintSection {
	public override event: IEventEmitter<this, Events<IPaintSection>>;

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

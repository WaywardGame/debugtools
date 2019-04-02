import { NPCType } from "entity/npc/NPCS";
import { ExtendedEvents } from "event/EventEmitter";
import Translation from "language/Translation";
import Button from "newui/component/Button";
import Component from "newui/component/Component";
import Dropdown, { IDropdownOption } from "newui/component/Dropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import Text from "newui/component/Text";
import { tuple } from "utilities/Arrays";
import Enums from "utilities/enum/Enums";
import { Bound } from "utilities/Objects";
import Stream from "utilities/stream/Stream";

import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection, IPaintSectionEvents } from "../panel/PaintPanel";

export default class NPCPaint extends Component implements IPaintSection {
	@Override public event: ExtendedEvents<this, Component, IPaintSectionEvents>;

	private readonly dropdown: Dropdown<"nochange" | "remove" | keyof typeof NPCType>;

	private npc: NPCType | "remove" | undefined;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelNPC)))
			.append(this.dropdown = new Dropdown<"nochange" | "remove" | keyof typeof NPCType>()
				.setRefreshMethod(() => ({
					defaultOption: "nochange",
					options: Stream.of<IDropdownOption<"nochange" | "remove" | keyof typeof NPCType>[]>(
						["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
						["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
					)
						.merge(Enums.values(NPCType)
							.map(npc => tuple(NPCType[npc] as keyof typeof NPCType, Translation.generator(NPCType[npc])))
							.sorted(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
							.map(([id, t]) => tuple(id, (option: Button) => option.setText(t)))),
				}))
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
	private changeNPC(_: any, npc: keyof typeof NPCType | "nochange" | "remove") {
		this.npc = npc === "nochange" ? undefined : npc === "remove" ? "remove" : NPCType[npc];

		this.event.emit("change");
	}
}

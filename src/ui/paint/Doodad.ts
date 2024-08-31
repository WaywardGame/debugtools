import { DoodadType } from "@wayward/game/game/doodad/IDoodad";
import Component from "@wayward/game/ui/component/Component";
import DoodadDropdown from "@wayward/game/ui/component/dropdown/DoodadDropdown";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import { Bound } from "@wayward/utilities/Decorators";
import { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";

export default class DoodadPaint extends Component implements IPaintSection {
	declare public event: IEventEmitter<this, Events<IPaintSection>>;

	private readonly dropdown: DoodadDropdown<"nochange" | "remove">;

	private doodad: DoodadType | "remove" | undefined;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelDoodad)))
			.append(this.dropdown = new DoodadDropdown<"nochange" | "remove">("nochange", [
				["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
				["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
			])
				.event.subscribe("selection", this.changeDoodad))
			.appendTo(this);
	}

	public getTilePaintData(): { doodad: { type: DoodadType | "remove"; }; } | undefined {
		return this.doodad === undefined ? undefined : {
			doodad: {
				type: this.doodad,
			},
		};
	}

	public isChanging(): boolean {
		return this.doodad !== undefined;
	}

	public reset(): void {
		this.dropdown.select("nochange");
	}

	@Bound
	private changeDoodad(_: any, doodad: DoodadType | "nochange" | "remove"): void {
		this.doodad = doodad === "nochange" ? undefined : doodad === "remove" ? "remove" : doodad;

		this.event.emit("change");
	}
}

import type { CreatureType } from "@wayward/game/game/entity/creature/ICreature";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import Component from "@wayward/game/ui/component/Component";
import CorpseDropdown from "@wayward/game/ui/component/dropdown/CorpseDropdown";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import { Bound } from "@wayward/utilities/Decorators";
import type { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import type { IPaintSection } from "../panel/PaintPanel";

export default class CorpsePaint extends Component implements IPaintSection {
	declare public event: IEventEmitter<this, Events<IPaintSection>>;

	private readonly dropdown: CorpseDropdown<"nochange" | "remove">;
	private readonly aberrantCheckButton: CheckButton;
	private readonly replaceExisting: CheckButton;

	private corpse: CreatureType | "remove" | undefined;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelCorpse)))
			.append(this.dropdown = new CorpseDropdown("nochange", [
				["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
				["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
			])
				.event.subscribe("selection", this.changeCorpse))
			.appendTo(this);

		this.replaceExisting = new CheckButton()
			.hide()
			.setText(translation(DebugToolsTranslation.ButtonReplaceExisting))
			.appendTo(this);

		this.aberrantCheckButton = new CheckButton()
			.hide()
			.setText(translation(DebugToolsTranslation.ButtonToggleAberrant))
			.appendTo(this);
	}

	public getTilePaintData(): { corpse: { type: CreatureType | "remove" | undefined; aberrant: boolean; replaceExisting: boolean } } {
		return {
			corpse: {
				type: this.corpse,
				aberrant: this.aberrantCheckButton.checked,
				replaceExisting: this.replaceExisting.checked,
			},
		};
	}

	public isChanging(): boolean {
		return this.corpse !== undefined || this.replaceExisting.checked;
	}

	public reset(): void {
		this.dropdown.select("nochange");
	}

	@Bound
	private changeCorpse(_: any, corpse: CreatureType | "remove" | "nochange"): void {
		this.corpse = corpse === "nochange" ? undefined : corpse === "remove" ? "remove" : corpse;

		const isReplaceable = this.corpse !== undefined && this.corpse !== "remove";
		this.aberrantCheckButton.toggle(isReplaceable);
		this.replaceExisting.toggle(isReplaceable);
		if (!isReplaceable) {
			this.replaceExisting.setChecked(false);
		}

		this.event.emit("change");
	}
}

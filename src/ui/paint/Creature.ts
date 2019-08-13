import { CreatureType } from "entity/creature/ICreature";
import { Events } from "event/EventBuses";
import { IEventEmitter } from "event/EventEmitter";
import { CheckButton } from "newui/component/CheckButton";
import Component from "newui/component/Component";
import CreatureDropdown from "newui/component/dropdown/CreatureDropdown";
import { LabelledRow } from "newui/component/LabelledRow";

import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";

export default class CreaturePaint extends Component implements IPaintSection {
	@Override public event: IEventEmitter<this, Events<IPaintSection>>;

	private readonly dropdown: CreatureDropdown<"nochange" | "remove">;
	private readonly aberrantCheckButton: CheckButton;

	private creature: CreatureType | "remove" | undefined;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelCreature)))
			.append(this.dropdown = new CreatureDropdown("nochange", [
				["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
				["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
			])
				.event.subscribe("selection", this.changeCreature))
			.appendTo(this);

		this.aberrantCheckButton = new CheckButton()
			.hide()
			.setText(translation(DebugToolsTranslation.ButtonToggleAberrant))
			.appendTo(this);
	}

	public getTilePaintData() {
		return this.creature === undefined ? undefined : {
			creature: {
				type: this.creature,
				aberrant: this.aberrantCheckButton.checked,
			},
		};
	}

	public isChanging() {
		return this.creature !== undefined;
	}

	public reset() {
		this.dropdown.select("nochange");
	}

	@Bound
	private changeCreature(_: any, creature: CreatureType | "nochange" | "remove") {
		this.creature = creature === "nochange" ? undefined : creature === "remove" ? "remove" : creature;
		this.aberrantCheckButton.toggle(this.creature !== undefined && this.creature !== "remove");

		this.event.emit("change");
	}
}

import { CreatureType } from "@wayward/game/game/entity/creature/ICreature";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import Component from "@wayward/game/ui/component/Component";
import CreatureDropdown from "@wayward/game/ui/component/dropdown/CreatureDropdown";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import { Bound } from "@wayward/utilities/Decorators";
import { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";


export default class CreaturePaint extends Component implements IPaintSection {
	declare public event: IEventEmitter<this, Events<IPaintSection>>;

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

	public getTilePaintData(): { creature: { type: CreatureType | "remove"; aberrant: boolean; }; } | undefined {
		return this.creature === undefined ? undefined : {
			creature: {
				type: this.creature,
				aberrant: this.aberrantCheckButton.checked,
			},
		};
	}

	public isChanging(): boolean {
		return this.creature !== undefined;
	}

	public reset(): void {
		this.dropdown.select("nochange");
	}

	@Bound
	private changeCreature(_: any, creature: CreatureType | "nochange" | "remove"): void {
		this.creature = creature === "nochange" ? undefined : creature === "remove" ? "remove" : creature;
		this.aberrantCheckButton.toggle(this.creature !== undefined && this.creature !== "remove");

		this.event.emit("change");
	}
}

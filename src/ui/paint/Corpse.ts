import { CreatureType } from "entity/creature/ICreature";
import { Events } from "event/EventBuses";
import { IEventEmitter } from "event/EventEmitter";
import { Dictionary } from "language/Dictionaries";
import Translation, { TextContext } from "language/Translation";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Component from "newui/component/Component";
import Dropdown, { IDropdownOption } from "newui/component/Dropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import Text from "newui/component/Text";
import { Tuple } from "utilities/Arrays";
import Enums from "utilities/enum/Enums";
import Stream from "utilities/stream/Stream";

import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";

export default class CorpsePaint extends Component implements IPaintSection {
	@Override public event: IEventEmitter<this, Events<IPaintSection>>;

	private readonly dropdown: Dropdown<"nochange" | "remove" | keyof typeof CreatureType>;
	private readonly aberrantCheckButton: CheckButton;
	private readonly replaceExisting: CheckButton;

	private corpse: CreatureType | "remove" | undefined;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelCorpse)))
			.append(this.dropdown = new Dropdown<"nochange" | "remove" | keyof typeof CreatureType>()
				.setRefreshMethod(() => ({
					defaultOption: "nochange",
					options: Stream.of<IDropdownOption<"nochange" | "remove" | keyof typeof CreatureType>[]>(
						["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
						["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
					)
						.merge(Enums.values(CreatureType)
							.map(creature => Tuple(
								CreatureType[creature] as keyof typeof CreatureType,
								Translation.nameOf(Dictionary.Creature, creature, false).inContext(TextContext.Title)
									.setFailWith(corpseManager.getName(creature, false).inContext(TextContext.Title)),
							))
							.sorted(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
							.map(([id, t]) => Tuple(id, (option: Button) => option.setText(t)))),
				}))
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

	public getTilePaintData() {
		return {
			corpse: {
				type: this.corpse,
				aberrant: this.aberrantCheckButton.checked,
				replaceExisting: this.replaceExisting.checked,
			},
		};
	}

	public isChanging() {
		return this.corpse !== undefined || this.replaceExisting.checked;
	}

	public reset() {
		this.dropdown.select("nochange");
	}

	@Bound
	private changeCorpse(_: any, corpse: keyof typeof CreatureType | "remove" | "nochange") {
		this.corpse = corpse === "nochange" ? undefined : corpse === "remove" ? "remove" : CreatureType[corpse];

		const isReplaceable = this.corpse !== undefined && this.corpse !== "remove";
		this.aberrantCheckButton.toggle(isReplaceable);
		this.replaceExisting.toggle(isReplaceable);
		if (!isReplaceable) this.replaceExisting.setChecked(false);

		this.event.emit("change");
	}
}

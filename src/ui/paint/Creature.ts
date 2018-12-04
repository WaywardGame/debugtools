import { creatureDescriptions } from "creature/Creatures";
import { CreatureType } from "Enums";
import { Dictionary } from "language/Dictionaries";
import Translation, { TextContext } from "language/Translation";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Component from "newui/component/Component";
import Dropdown, { DropdownEvent, IDropdownOption } from "newui/component/Dropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import Text from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import Enums from "utilities/enum/Enums";
import Collectors from "utilities/iterable/Collectors";
import { tuple } from "utilities/iterable/Generators";
import { Bound } from "utilities/Objects";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";

export default class CreaturePaint extends Component implements IPaintSection {
	private dropdown: Dropdown<"nochange" | "remove" | keyof typeof CreatureType>;
	private readonly aberrantCheckButton: CheckButton;

	private creature: CreatureType | "remove" | undefined;

	public constructor(api: UiApi) {
		super(api);

		new LabelledRow(api)
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelCreature)))
			.append(this.dropdown = new Dropdown<"nochange" | "remove" | keyof typeof CreatureType>(api)
				.setRefreshMethod(() => ({
					defaultOption: "nochange",
					options: ([
						["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
						["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
					] as IDropdownOption<"nochange" | "remove" | keyof typeof CreatureType>[]).values().include(Enums.values(CreatureType)
						.filter(creature => creatureDescriptions[creature])
						.map(creature => tuple(
							CreatureType[creature] as keyof typeof CreatureType,
							Translation.nameOf(Dictionary.Creature, creature, false).inContext(TextContext.Title),
						))
						.collect(Collectors.toArray)
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.values()
						.map(([id, t]) => tuple(id, (option: Button) => option.setText(t)))),
				}))
				.on(DropdownEvent.Selection, this.changeCreature))
			.appendTo(this);

		this.aberrantCheckButton = new CheckButton(api)
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
	private changeCreature(_: any, creature: keyof typeof CreatureType | "nochange" | "remove") {
		this.creature = creature === "nochange" ? undefined : creature === "remove" ? "remove" : CreatureType[creature];
		this.aberrantCheckButton.toggle(this.creature !== undefined && this.creature !== "remove");

		this.emit("change");
	}
}

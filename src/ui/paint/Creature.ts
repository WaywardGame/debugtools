import { creatureDescriptions } from "creature/Creatures";
import { CreatureType, SentenceCaseStyle } from "Enums";
import Translation from "language/Translation";
import { CheckButton } from "newui/component/CheckButton";
import Component from "newui/component/Component";
import Dropdown, { DropdownEvent, IDropdownOption } from "newui/component/Dropdown";
import { TranslationGenerator } from "newui/component/IComponent";
import { LabelledRow } from "newui/component/LabelledRow";
import Text from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import Collectors from "utilities/Collectors";
import Enums from "utilities/enum/Enums";
import { Bound } from "utilities/Objects";
import { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import { IPaintSection } from "../DebugToolsDialog";

export default class CreaturePaint extends Component implements IPaintSection {
	private readonly aberrantCheckButton: CheckButton;
	private creature: CreatureType | "remove" | undefined;

	public constructor(api: UiApi) {
		super(api);

		new LabelledRow(api)
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelCreature)))
			.append(new Dropdown(api)
				.setRefreshMethod(() => ({
					defaultOption: "nochange",
					options: ([
						["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
						["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
					] as IDropdownOption[]).values().include(Enums.values(CreatureType)
						.filter(creature => creatureDescriptions[creature])
						.map<[string, TranslationGenerator]>(creature => [CreatureType[creature], Translation.ofObjectName(creatureDescriptions[creature]!, SentenceCaseStyle.Title, false)])
						.collect(Collectors.toArray)
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.values()
						.map<IDropdownOption>(([id, t]) => [id, option => option.setText(t)])),
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

	@Bound
	private changeCreature(_: any, creature: keyof typeof CreatureType | "nochange" | "remove") {
		this.creature = creature === "nochange" ? undefined : creature === "remove" ? "remove" : CreatureType[creature];
		this.aberrantCheckButton.toggle(this.creature !== undefined && this.creature !== "remove");
	}
}

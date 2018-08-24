import { creatureDescriptions } from "creature/Creatures";
import { CreatureType, SentenceCaseStyle } from "Enums";
import { Dictionary } from "language/ILanguage";
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
import { IPaintSection } from "../panel/PaintPanel";

export default class CorpsePaint extends Component implements IPaintSection {
	private readonly dropdown: Dropdown<"nochange" | "remove" | keyof typeof CreatureType>;
	private readonly aberrantCheckButton: CheckButton;
	private readonly replaceExisting: CheckButton;

	private corpse: CreatureType | "remove" | undefined;

	public constructor(api: UiApi) {
		super(api);

		new LabelledRow(api)
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelCorpse)))
			.append(this.dropdown = new Dropdown<"nochange" | "remove" | keyof typeof CreatureType>(api)
				.setRefreshMethod(() => ({
					defaultOption: "nochange",
					options: ([
						["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
						["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
					] as IDropdownOption<"nochange" | "remove" | keyof typeof CreatureType>[]).values().include(Enums.values(CreatureType)
						.map<[keyof typeof CreatureType, TranslationGenerator]>(creature => [
							CreatureType[creature] as keyof typeof CreatureType,
							creatureDescriptions[creature] ? Translation.ofObjectName(creatureDescriptions[creature]!, SentenceCaseStyle.Title, false) : new Translation(Dictionary.Corpse, creature),
						])
						.collect(Collectors.toArray)
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.values()
						.map<IDropdownOption<"nochange" | "remove" | keyof typeof CreatureType>>(([id, t]) => [id, option => option.setText(t)])),
				}))
				.on(DropdownEvent.Selection, this.changeCorpse))
			.appendTo(this);

		this.replaceExisting = new CheckButton(api)
			.hide()
			.setText(translation(DebugToolsTranslation.ButtonReplaceExisting))
			.appendTo(this);

		this.aberrantCheckButton = new CheckButton(api)
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

		this.triggerSync("change");
	}
}

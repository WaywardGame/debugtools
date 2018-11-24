import { DoodadType } from "Enums";
import { Dictionary } from "language/Dictionaries";
import Translation, { TextContext } from "language/Translation";
import Button from "newui/component/Button";
import Component from "newui/component/Component";
import Dropdown, { DropdownEvent, IDropdownOption } from "newui/component/Dropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import Text from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import { tuple } from "utilities/Arrays";
import Enums from "utilities/enum/Enums";
import Collectors from "utilities/iterable/Collectors";
import { Bound } from "utilities/Objects";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";

export default class DoodadPaint extends Component implements IPaintSection {
	private readonly dropdown: Dropdown<"nochange" | "remove" | keyof typeof DoodadType>;

	private doodad: DoodadType | "remove" | undefined;

	public constructor(api: UiApi) {
		super(api);

		new LabelledRow(api)
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelDoodad)))
			.append(this.dropdown = new Dropdown<"nochange" | "remove" | keyof typeof DoodadType>(api)
				.setRefreshMethod(() => ({
					defaultOption: "nochange",
					options: ([
						["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
						["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
					] as IDropdownOption<"nochange" | "remove" | keyof typeof DoodadType>[]).values().include(Enums.values(DoodadType)
						.filter(type => type !== DoodadType.Item)
						.map(doodad => tuple(
							DoodadType[doodad] as keyof typeof DoodadType,
							Translation.nameOf(Dictionary.Doodad, doodad, false).inContext(TextContext.Title),
						))
						.collect(Collectors.toArray)
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.values()
						.map(([id, t]) => tuple(id, (option: Button) => option.setText(t)))),
				}))
				.on(DropdownEvent.Selection, this.changeDoodad))
			.appendTo(this);
	}

	public getTilePaintData() {
		return this.doodad === undefined ? undefined : {
			doodad: {
				type: this.doodad,
			},
		};
	}

	public isChanging() {
		return this.doodad !== undefined;
	}

	public reset() {
		this.dropdown.select("nochange");
	}

	@Bound
	private changeDoodad(_: any, doodad: keyof typeof DoodadType | "nochange" | "remove") {
		this.doodad = doodad === "nochange" ? undefined : doodad === "remove" ? "remove" : DoodadType[doodad];

		this.trigger("change");
	}
}

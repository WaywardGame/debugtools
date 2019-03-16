import { DoodadType } from "doodad/IDoodad";
import { Dictionary } from "language/Dictionaries";
import Translation, { TextContext } from "language/Translation";
import Button from "newui/component/Button";
import Component from "newui/component/Component";
import Dropdown, { DropdownEvent, IDropdownOption } from "newui/component/Dropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import Text from "newui/component/Text";
import { tuple } from "utilities/Arrays";
import Enums from "utilities/enum/Enums";
import { Bound } from "utilities/Objects";
import Stream from "utilities/stream/Stream";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";

export default class DoodadPaint extends Component implements IPaintSection {
	private readonly dropdown: Dropdown<"nochange" | "remove" | keyof typeof DoodadType>;

	private doodad: DoodadType | "remove" | undefined;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelDoodad)))
			.append(this.dropdown = new Dropdown<"nochange" | "remove" | keyof typeof DoodadType>()
				.setRefreshMethod(() => ({
					defaultOption: "nochange",
					options: Stream.of<IDropdownOption<"nochange" | "remove" | keyof typeof DoodadType>[]>(
						["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
						["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
					)
						.merge(Enums.values(DoodadType)
							.filter(type => type !== DoodadType.Item)
							.map(doodad => tuple(
								DoodadType[doodad] as keyof typeof DoodadType,
								Translation.nameOf(Dictionary.Doodad, doodad, false).inContext(TextContext.Title),
							))
							.sorted(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
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

		this.emit("change");
	}
}

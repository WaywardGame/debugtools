import { DoodadType } from "doodad/IDoodad";
import { Events } from "event/EventBuses";
import { IEventEmitter } from "event/EventEmitter";
import { Dictionary } from "language/Dictionaries";
import Translation, { TextContext } from "language/Translation";
import Button from "newui/component/Button";
import Component from "newui/component/Component";
import Dropdown, { IDropdownOption } from "newui/component/Dropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import Text from "newui/component/Text";
import { tuple } from "utilities/Arrays";
import Enums from "utilities/enum/Enums";
import Stream from "utilities/stream/Stream";

import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";

export default class DoodadPaint extends Component implements IPaintSection {
	@Override public event: IEventEmitter<this, Events<IPaintSection>>;

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
							.map(doodad => {
								const translation = Translation.nameOf(Dictionary.Doodad, doodad, false).inContext(TextContext.Title);
								return {
									type: DoodadType[doodad] as keyof typeof DoodadType,
									translation: translation,
									translationString: Text.toString(translation),
								};
							})
							.sorted((o1, o2) => o1.translationString.localeCompare(o2.translationString))
							.map(({ type, translation }) => tuple(type, (option: Button) => option.setText(translation)))),
				}))
				.event.subscribe("selection", this.changeDoodad))
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

		this.event.emit("change");
	}
}

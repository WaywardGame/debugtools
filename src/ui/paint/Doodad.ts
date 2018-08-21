import { doodadDescriptions } from "doodad/Doodads";
import { DoodadType, SentenceCaseStyle } from "Enums";
import Translation from "language/Translation";
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

export default class DoodadPaint extends Component implements IPaintSection {
	private doodad: DoodadType | "remove" | undefined;

	public constructor(api: UiApi) {
		super(api);

		new LabelledRow(api)
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelDoodad)))
			.append(new Dropdown(api)
				.setRefreshMethod(() => ({
					defaultOption: "nochange",
					options: ([
						["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
						["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
					] as IDropdownOption[]).values().include(Enums.values(DoodadType)
						.filter(type => type !== DoodadType.Item)
						.map<[string, TranslationGenerator]>(doodad => [DoodadType[doodad], Translation.ofObjectName(doodadDescriptions[doodad]!, SentenceCaseStyle.Title, false)])
						.collect(Collectors.toArray)
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.values()
						.map<IDropdownOption>(([id, t]) => [id, option => option.setText(t)])),
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

	@Bound
	private changeDoodad(_: any, doodad: keyof typeof DoodadType | "nochange" | "remove") {
		this.doodad = doodad === "nochange" ? undefined : doodad === "remove" ? "remove" : DoodadType[doodad];
	}
}

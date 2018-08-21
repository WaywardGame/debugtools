import { NPCType } from "Enums";
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

export default class NPCPaint extends Component implements IPaintSection {
	private npc: NPCType | "remove" | undefined;

	public constructor(api: UiApi) {
		super(api);

		new LabelledRow(api)
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelNPC)))
			.append(new Dropdown(api)
				.setRefreshMethod(() => ({
					defaultOption: "nochange",
					options: ([
						["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
						["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
					] as IDropdownOption[]).values().include(Enums.values(NPCType)
						.map<[string, TranslationGenerator]>(npc => [NPCType[npc], Translation.generator(NPCType[npc])])
						.collect(Collectors.toArray)
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.values()
						.map<IDropdownOption>(([id, t]) => [id, option => option.setText(t)])),
				}))
				.on(DropdownEvent.Selection, this.changeNPC))
			.appendTo(this);
	}

	public getTilePaintData() {
		return this.npc === undefined ? undefined : {
			npc: {
				type: this.npc,
			},
		};
	}

	@Bound
	private changeNPC(_: any, npc: keyof typeof NPCType | "nochange" | "remove") {
		this.npc = npc === "nochange" ? undefined : npc === "remove" ? "remove" : NPCType[npc];
	}
}

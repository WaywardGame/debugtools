import { SentenceCaseStyle, TerrainType } from "Enums";
import Translation from "language/Translation";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Component from "newui/component/Component";
import Dropdown, { DropdownEvent, IDropdownOption } from "newui/component/Dropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import Text from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import { terrainDescriptions } from "tile/Terrains";
import { tuple } from "utilities/Arrays";
import Collectors from "utilities/Collectors";
import Enums from "utilities/enum/Enums";
import { Bound } from "utilities/Objects";
import { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";

export default class TerrainPaint extends Component implements IPaintSection {
	private readonly tilledCheckButton: CheckButton;
	private terrain: TerrainType | undefined;
	private dropdown: Dropdown<"nochange" | keyof typeof TerrainType>;

	public constructor(api: UiApi) {
		super(api);

		new LabelledRow(api)
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelTerrain)))
			.append(this.dropdown = new Dropdown<"nochange" | keyof typeof TerrainType>(api)
				.setRefreshMethod(() => ({
					defaultOption: "nochange",
					options: ([
						["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
					] as IDropdownOption<"nochange" | keyof typeof TerrainType>[]).values().include(Enums.values(TerrainType)
						.map(terrain => tuple(TerrainType[terrain] as keyof typeof TerrainType, Translation.ofDescription(terrainDescriptions[terrain]!, SentenceCaseStyle.Title, false)))
						.collect(Collectors.toArray)
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.values()
						.map(([id, t]) => tuple(id, (option: Button) => option.setText(t)))),
				}))
				.on(DropdownEvent.Selection, this.changeTerrain))
			.appendTo(this);

		this.tilledCheckButton = new CheckButton(api)
			.hide()
			.setText(translation(DebugToolsTranslation.ButtonToggleTilled))
			.appendTo(this);
	}

	public getTilePaintData() {
		return this.terrain === undefined ? undefined : {
			terrain: {
				type: this.terrain,
				tilled: this.tilledCheckButton.checked,
			},
		};
	}

	public isChanging() {
		return this.terrain !== undefined;
	}

	public reset() {
		this.dropdown.select("nochange");
	}

	@Bound
	private changeTerrain(_: any, terrain: keyof typeof TerrainType | "nochange") {
		this.terrain = terrain === "nochange" ? undefined : TerrainType[terrain];

		const tillable = terrain !== "nochange" && terrainDescriptions[TerrainType[terrain]]!.tillable === true;
		this.tilledCheckButton.toggle(tillable);
		if (!tillable) this.tilledCheckButton.setChecked(false);

		this.trigger("change");
	}
}

import { Events } from "event/EventBuses";
import { IEventEmitter } from "event/EventEmitter";
import { CheckButton } from "newui/component/CheckButton";
import Component from "newui/component/Component";
import TerrainDropdown from "newui/component/dropdown/TerrainDropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import { TerrainType } from "tile/ITerrain";
import { terrainDescriptions } from "tile/Terrains";

import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";

export default class TerrainPaint extends Component implements IPaintSection {
	@Override public event: IEventEmitter<this, Events<IPaintSection>>;

	private readonly tilledCheckButton: CheckButton;
	private terrain: TerrainType | undefined;
	private readonly dropdown: TerrainDropdown<"nochange">;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelTerrain)))
			.append(this.dropdown = new TerrainDropdown("nochange", [
				["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
			])
				.event.subscribe("selection", this.changeTerrain))
			.appendTo(this);

		this.tilledCheckButton = new CheckButton()
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

		this.event.emit("change");
	}
}

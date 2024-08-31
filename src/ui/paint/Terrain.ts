import { TerrainType } from "@wayward/game/game/tile/ITerrain";
import { terrainDescriptions } from "@wayward/game/game/tile/Terrains";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import Component from "@wayward/game/ui/component/Component";
import TerrainDropdown from "@wayward/game/ui/component/dropdown/TerrainDropdown";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import { Bound } from "@wayward/utilities/Decorators";
import { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";

export default class TerrainPaint extends Component implements IPaintSection {
	declare public event: IEventEmitter<this, Events<IPaintSection>>;

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

	public getTilePaintData(): { terrain: { type: TerrainType; tilled: boolean; }; } | undefined {
		return this.terrain === undefined ? undefined : {
			terrain: {
				type: this.terrain,
				tilled: this.tilledCheckButton.checked,
			},
		};
	}

	public isChanging(): boolean {
		return this.terrain !== undefined;
	}

	public reset(): void {
		this.dropdown.select("nochange");
	}

	@Bound
	private changeTerrain(_: any, terrain: TerrainType | "nochange"): void {
		this.terrain = terrain === "nochange" ? undefined : terrain;

		const tillable = terrain !== "nochange" && terrainDescriptions[terrain]!.tillable === true;
		this.tilledCheckButton.toggle(tillable);
		if (!tillable) this.tilledCheckButton.setChecked(false);

		this.event.emit("change");
	}
}

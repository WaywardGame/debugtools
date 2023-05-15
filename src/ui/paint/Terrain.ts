/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { Events, IEventEmitter } from "event/EventEmitter";
import { TerrainType } from "game/tile/ITerrain";
import { terrainDescriptions } from "game/tile/Terrains";
import { CheckButton } from "ui/component/CheckButton";
import Component from "ui/component/Component";
import TerrainDropdown from "ui/component/dropdown/TerrainDropdown";
import { LabelledRow } from "ui/component/LabelledRow";
import { Bound } from "utilities/Decorators";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";

export default class TerrainPaint extends Component implements IPaintSection {
	public override event: IEventEmitter<this, Events<IPaintSection>>;

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
	private changeTerrain(_: any, terrain: TerrainType | "nochange") {
		this.terrain = terrain === "nochange" ? undefined : terrain;

		const tillable = terrain !== "nochange" && terrainDescriptions[terrain]!.tillable === true;
		this.tilledCheckButton.toggle(tillable);
		if (!tillable) this.tilledCheckButton.setChecked(false);

		this.event.emit("change");
	}
}

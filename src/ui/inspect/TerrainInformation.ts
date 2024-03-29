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

import { TerrainType } from "game/tile/ITerrain";
import Tile from "game/tile/Tile";
import Dictionary from "language/Dictionary";
import { TextContext } from "language/ITranslation";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import { RenderSource } from "renderer/IRenderer";
import { BlockRow } from "ui/component/BlockRow";
import Button from "ui/component/Button";
import { CheckButton } from "ui/component/CheckButton";
import Dropdown from "ui/component/Dropdown";
import { LabelledRow } from "ui/component/LabelledRow";
import Text from "ui/component/Text";
import { Tuple } from "utilities/collection/Tuple";
import { Bound } from "utilities/Decorators";
import Enums from "utilities/enum/Enums";
import Log from "utilities/Log";
import ChangeTerrain from "../../action/ChangeTerrain";
import ToggleTilled from "../../action/ToggleTilled";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";
import { TileUpdateType } from "game/IGame";

export default class TerrainInformation extends InspectInformationSection {

	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private tile: Tile;
	private terrainType: string;

	private readonly dropdownTerrainType: Dropdown<TerrainType>;
	private readonly checkButtonTilled: CheckButton;
	private readonly checkButtonIncludeNeighbors: CheckButton;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelChangeTerrain)))
			.append(this.dropdownTerrainType = new Dropdown<TerrainType>()
				.setRefreshMethod(() => ({
					defaultOption: this.tile ? this.tile.type : TerrainType.Dirt,
					options: Enums.values(TerrainType)
						.filter(terrain => terrain)
						.map(terrain => Tuple(terrain, Translation.get(Dictionary.Terrain, terrain).inContext(TextContext.Title)))
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.map(([id, t]) => Tuple(id, (option: Button) => option.setText(t))),
				}))
				.event.subscribe("selection", this.changeTerrain))
			.appendTo(this);

		this.checkButtonTilled = new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonToggleTilled))
			.setRefreshMethod(this.isTilled)
			.event.subscribe("toggle", this.toggleTilled)
			.appendTo(this);

		new BlockRow()
			.append(new Button()
				.setText(() => translation(DebugToolsTranslation.ButtonRefreshTile))
				.event.subscribe("activate", this.refreshTile))
			.append(this.checkButtonIncludeNeighbors = new CheckButton()
				.setText(translation(DebugToolsTranslation.ButtonIncludeNeighbors)))
			.appendTo(this);
		;
	}

	public override getTabs(): TabInformation[] {
		return [
			[0, this.getTabTranslation],
		];
	}

	@Bound
	public getTabTranslation() {
		return this.tile && translation(DebugToolsTranslation.InspectTerrain)
			.get(Translation.get(Dictionary.Terrain, this.tile.type).inContext(TextContext.Title));
	}

	public override update(tile: Tile) {
		this.tile = tile;

		const terrainType = TerrainType[this.tile.type];
		const tillable = this.isTillable();
		if (terrainType === this.terrainType && (!tillable || this.checkButtonTilled.checked === this.isTilled()))
			return;

		this.terrainType = terrainType;
		this.dropdownTerrainType.refresh();
		this.setShouldLog();

		this.checkButtonTilled.toggle(tillable)
			.refresh();

		return this;
	}

	public override logUpdate() {
		this.LOG.info("Terrain:", this.terrainType, ...this.isTillable() ? ["Tilled:", this.isTilled()] : []);
	}

	@Bound
	private toggleTilled(_: any, tilled: boolean) {
		if (this.isTilled() !== tilled) {
			ToggleTilled.execute(localPlayer, this.tile, tilled);
		}
	}

	private isTillable() {
		return this.tile.description?.tillable === true;
	}

	@Bound
	private isTilled() {
		return this.tile && this.tile.isTilled;
	}

	@Bound
	private changeTerrain(_: any, terrain: TerrainType) {
		if (terrain === this.tile.type) {
			return;
		}

		ChangeTerrain.execute(localPlayer, terrain, this.tile);
		this.update(this.tile);
	}

	@Bound
	public refreshTile() {
		localIsland.world.updateTile(this.tile, TileUpdateType.Mod, this.checkButtonIncludeNeighbors.checked, true);
		localPlayer.updateView(RenderSource.Mod, false);
	}
}

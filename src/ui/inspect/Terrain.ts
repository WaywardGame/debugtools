import ActionExecutor from "entity/action/ActionExecutor";
import { Dictionary } from "language/Dictionaries";
import Translation, { TextContext } from "language/Translation";
import Mod from "mod/Mod";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Dropdown from "newui/component/Dropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import Text from "newui/component/Text";
import { ITile, TerrainType } from "tile/ITerrain";
import terrainDescriptions from "tile/Terrains";
import { tuple } from "utilities/Arrays";
import Enums from "utilities/enum/Enums";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import Vector3 from "utilities/math/Vector3";
import { Bound } from "utilities/Objects";
import TileHelpers from "utilities/TileHelpers";

import ChangeTerrain from "../../action/ChangeTerrain";
import ToggleTilled from "../../action/ToggleTilled";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";

export default class TerrainInformation extends InspectInformationSection {

	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private position: Vector3;
	private tile: ITile;
	private terrainType: string;

	private readonly checkButtonTilled: CheckButton;
	private readonly dropdownTerrainType: Dropdown<TerrainType>;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelChangeTerrain)))
			.append(this.dropdownTerrainType = new Dropdown<TerrainType>()
				.setRefreshMethod(() => ({
					defaultOption: this.tile ? TileHelpers.getType(this.tile) : TerrainType.Dirt,
					options: Enums.values(TerrainType)
						.filter(terrain => terrain)
						.map(terrain => tuple(terrain, new Translation(Dictionary.Terrain, terrain).inContext(TextContext.Title)))
						.sorted(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.map(([id, t]) => tuple(id, (option: Button) => option.setText(t))),
				}))
				.event.subscribe("selection", this.changeTerrain))
			.appendTo(this);

		this.checkButtonTilled = new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonToggleTilled))
			.setRefreshMethod(() => this.tile && TileHelpers.isTilled(this.tile))
			.event.subscribe("toggle", this.toggleTilled)
			.appendTo(this);
	}

	public getTabs(): TabInformation[] {
		return [
			[0, this.getTabTranslation],
		];
	}

	@Bound
	public getTabTranslation() {
		return this.tile && translation(DebugToolsTranslation.InspectTerrain)
			.get(new Translation(Dictionary.Terrain, TileHelpers.getType(this.tile)).inContext(TextContext.Title));
	}

	public update(position: IVector2, tile: ITile) {
		this.position = new Vector3(position.x, position.y, localPlayer.z);
		this.tile = tile;

		const terrainType = TerrainType[TileHelpers.getType(this.tile!)];
		if (terrainType === this.terrainType) return;

		this.terrainType = terrainType;
		this.dropdownTerrainType.refresh();
		this.setShouldLog();

		this.checkButtonTilled.toggle(terrainDescriptions[TileHelpers.getType(tile)]!.tillable === true)
			.refresh();

		return this;
	}

	public logUpdate() {
		this.LOG.info("Terrain:", this.terrainType);
	}

	@Bound
	private toggleTilled(_: any, tilled: boolean) {
		ActionExecutor.get(ToggleTilled).execute(localPlayer, this.position, tilled);
	}

	@Bound
	private changeTerrain(_: any, terrain: TerrainType) {
		if (terrain === TileHelpers.getType(this.tile)) {
			return;
		}

		ActionExecutor.get(ChangeTerrain).execute(localPlayer, terrain, this.position);
		this.update(this.position, this.tile);
	}
}

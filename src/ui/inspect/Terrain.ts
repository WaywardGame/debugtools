import ActionExecutor from "entity/action/ActionExecutor";
import { RenderSource } from "game/IGame";
import { Dictionary } from "language/Dictionaries";
import Translation, { TextContext } from "language/Translation";
import Mod from "mod/Mod";
import { BlockRow } from "newui/component/BlockRow";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Dropdown from "newui/component/Dropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import Text from "newui/component/Text";
import { ITile, TerrainType } from "tile/ITerrain";
import terrainDescriptions from "tile/Terrains";
import { Tuple } from "utilities/Arrays";
import Enums from "utilities/enum/Enums";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import Vector3 from "utilities/math/Vector3";
import TileHelpers from "utilities/TileHelpers";
import ChangeTerrain from "../../action/ChangeTerrain";
import ToggleTilled from "../../action/ToggleTilled";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";

export default class TerrainInformation extends InspectInformationSection {

	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private position: Vector3;
	private tile: ITile;
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
					defaultOption: this.tile ? TileHelpers.getType(this.tile) : TerrainType.Dirt,
					options: Enums.values(TerrainType)
						.filter(terrain => terrain)
						.map(terrain => Tuple(terrain, new Translation(Dictionary.Terrain, terrain).inContext(TextContext.Title)))
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

	@Override
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

	@Override
	public update(position: IVector2, tile: ITile) {
		this.position = new Vector3(position.x, position.y, localPlayer.z);
		this.tile = tile;

		const terrainType = TerrainType[TileHelpers.getType(this.tile)];
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

	@Override
	public logUpdate() {
		this.LOG.info("Terrain:", this.terrainType, ...this.isTillable() ? ["Tilled:", this.isTilled()] : []);
	}

	@Bound
	private toggleTilled(_: any, tilled: boolean) {
		if (this.isTilled() !== tilled) {
			ActionExecutor.get(ToggleTilled).execute(localPlayer, this.position, tilled);
		}
	}

	private isTillable() {
		return terrainDescriptions[TileHelpers.getType(this.tile)]?.tillable === true;
	}

	@Bound
	private isTilled() {
		return this.tile && TileHelpers.isTilled(this.tile);
	}

	@Bound
	private changeTerrain(_: any, terrain: TerrainType) {
		if (terrain === TileHelpers.getType(this.tile)) {
			return;
		}

		ActionExecutor.get(ChangeTerrain).execute(localPlayer, terrain, this.position);
		this.update(this.position, this.tile);
	}

	@Bound
	public refreshTile() {
		world.layers[this.position.z].updateTile(this.position.x, this.position.y, this.tile, true, this.checkButtonIncludeNeighbors.checked, true, true);
		game.updateView(RenderSource.Mod, false);
	}
}

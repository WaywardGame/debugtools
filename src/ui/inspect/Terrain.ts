import { ITile, TerrainType } from "game/tile/ITerrain";
import terrainDescriptions from "game/tile/Terrains";
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
import { Tuple } from "utilities/collection/Arrays";
import { Bound } from "utilities/Decorators";
import Enums from "utilities/enum/Enums";
import TileHelpers from "utilities/game/TileHelpers";
import Log from "utilities/Log";
import { IVector2 } from "utilities/math/IVector";
import Vector3 from "utilities/math/Vector3";
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
			.get(Translation.get(Dictionary.Terrain, TileHelpers.getType(this.tile)).inContext(TextContext.Title));
	}

	public override update(position: IVector2, tile: ITile) {
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

	public override logUpdate() {
		this.LOG.info("Terrain:", this.terrainType, ...this.isTillable() ? ["Tilled:", this.isTilled()] : []);
	}

	@Bound
	private toggleTilled(_: any, tilled: boolean) {
		if (this.isTilled() !== tilled) {
			ToggleTilled.execute(localPlayer, this.position, tilled);
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

		ChangeTerrain.execute(localPlayer, terrain, this.position);
		this.update(this.position, this.tile);
	}

	@Bound
	public refreshTile() {
		localIsland.world.layers[this.position.z].updateTile(this.position.x, this.position.y, this.tile, true, this.checkButtonIncludeNeighbors.checked, true, undefined, true);
		game.updateView(RenderSource.Mod, false);
	}
}

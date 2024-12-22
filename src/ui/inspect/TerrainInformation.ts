import { TerrainType } from "@wayward/game/game/tile/ITerrain";
import type Tile from "@wayward/game/game/tile/Tile";
import Dictionary from "@wayward/game/language/Dictionary";
import { TextContext } from "@wayward/game/language/ITranslation";
import Translation from "@wayward/game/language/Translation";
import Mod from "@wayward/game/mod/Mod";
import { RenderSource } from "@wayward/game/renderer/IRenderer";
import { BlockRow } from "@wayward/game/ui/component/BlockRow";
import Button from "@wayward/game/ui/component/Button";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import Dropdown from "@wayward/game/ui/component/Dropdown";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import Text from "@wayward/game/ui/component/Text";
import { Tuple } from "@wayward/utilities/collection/Tuple";
import { Bound } from "@wayward/utilities/Decorators";
import Enums from "@wayward/game/utilities/enum/Enums";
import type Log from "@wayward/utilities/Log";
import ChangeTerrain from "../../action/ChangeTerrain";
import ToggleTilled from "../../action/ToggleTilled";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";
import type { TabInformation } from "../component/InspectInformationSection";
import InspectInformationSection from "../component/InspectInformationSection";
import { TileUpdateType } from "@wayward/game/game/IGame";
import type { IStringSection } from "@wayward/game/utilities/string/Interpolator";

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
	public getTabTranslation(): IStringSection[] {
		return this.tile && translation(DebugToolsTranslation.InspectTerrain)
			.get(Translation.get(Dictionary.Terrain, this.tile.type).inContext(TextContext.Title));
	}

	public override update(tile: Tile): this | undefined {
		this.tile = tile;

		const terrainType = TerrainType[this.tile.type];
		const tillable = this.isTillable();
		if (terrainType === this.terrainType && (!tillable || this.checkButtonTilled.checked === this.isTilled())) {
			return;
		}

		this.terrainType = terrainType;
		this.dropdownTerrainType.refresh();
		this.setShouldLog();

		this.checkButtonTilled.toggle(tillable)
			.refresh();

		return this;
	}

	public override logUpdate(): void {
	}

	@Bound
	private toggleTilled(_: any, tilled: boolean): void {
		if (this.isTilled() !== tilled) {
			void ToggleTilled.execute(localPlayer, this.tile, tilled);
		}
	}

	private isTillable(): boolean {
		return this.tile.description?.tillable === true;
	}

	@Bound
	private isTilled(): boolean {
		return this.tile?.isTilled;
	}

	@Bound
	private changeTerrain(_: any, terrain: TerrainType): void {
		if (terrain === this.tile.type) {
			return;
		}

		void ChangeTerrain.execute(localPlayer, terrain, this.tile);
		this.update(this.tile);
	}

	@Bound
	public refreshTile(): void {
		this.tile.updateWorldTile(TileUpdateType.Mod, this.checkButtonIncludeNeighbors.checked, true);
		localPlayer.updateView(RenderSource.Mod, false);
	}
}

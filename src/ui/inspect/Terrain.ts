import { SentenceCaseStyle, TerrainType } from "Enums";
import Translation from "language/Translation";
import { bindingManager } from "newui/BindingManager";
import Button, { ButtonEvent } from "newui/component/Button";
import { CheckButton, CheckButtonEvent } from "newui/component/CheckButton";
import ContextMenu, { ContextMenuOptionKeyValuePair } from "newui/component/ContextMenu";
import Text from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import terrainDescriptions from "tile/Terrains";
import Collectors, { PassStrategy } from "utilities/Collectors";
import Enums from "utilities/enum/Enums";
import { IVector2 } from "utilities/math/IVector";
import Vector3 from "utilities/math/Vector3";
import { Bound } from "utilities/Objects";
import TileHelpers from "utilities/TileHelpers";
import Actions from "../../Actions";
import DebugTools, { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import InspectInformationSection, { TabInformation } from "../component/InspectInformationSection";

export default class TerrainInformation extends InspectInformationSection {
	private position: Vector3;
	private tile: ITile;
	private terrainType: string;

	private readonly checkButtonTilled: CheckButton;

	public constructor(api: UiApi) {
		super(api);

		new Button(api)
			.setText(translation(DebugToolsTranslation.ButtonChangeTerrain))
			.on(ButtonEvent.Activate, this.showTerrainContextMenu)
			.appendTo(this);

		this.checkButtonTilled = new CheckButton(api)
			.setText(translation(DebugToolsTranslation.ButtonToggleTilled))
			.setRefreshMethod(() => this.tile && TileHelpers.isTilled(this.tile))
			.on(CheckButtonEvent.Change, this.toggleTilled)
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
			.get(terrainDescriptions[TileHelpers.getType(this.tile)]!.name);
	}

	public update(position: IVector2, tile: ITile) {
		this.position = new Vector3(position.x, position.y, localPlayer.z);
		this.tile = tile;

		const terrainType = TerrainType[TileHelpers.getType(this.tile!)];
		if (terrainType === this.terrainType) return;

		this.terrainType = terrainType;
		this.setShouldLog();

		this.checkButtonTilled.toggle(terrainDescriptions[TileHelpers.getType(tile)]!.tillable === true)
			.refresh();

		return this;
	}

	public logUpdate() {
		DebugTools.LOG.info("Terrain:", this.terrainType);
	}

	@Bound
	private toggleTilled(_: any, tilled: boolean) {
		Actions.get("toggleTilled").execute({ position: this.position, object: tilled });
	}

	@Bound
	private showTerrainContextMenu() {
		const screen = this.api.getVisibleScreen();
		if (!screen) {
			return;
		}

		const mouse = bindingManager.getMouse();

		// create the options
		Enums.values(TerrainType)
			.map<ContextMenuOptionKeyValuePair>(terrain => [TerrainType[terrain], {
				translation: Translation.ofObjectName(terrainDescriptions[terrain]!, SentenceCaseStyle.Title, false),
				onActivate: this.changeTerrain(terrain),
			}])
			.collect(Collectors.toArray)
			.sort(([, t1], [, t2]) => Text.toString(t1.translation).localeCompare(Text.toString(t2.translation)))
			.values()
			// create the context menu from them
			.collect(Collectors.passTo(ContextMenu.bind(null, this.api), PassStrategy.Splat))
			.addAllDescribedOptions()
			.setPosition(mouse.x, mouse.y)
			.schedule(screen.setContextMenu);
	}

	private changeTerrain(terrain: TerrainType) {
		return () => {
			Actions.get("changeTerrain").execute({ position: this.position, object: terrain });
			this.update(this.position, this.tile);
		};
	}
}

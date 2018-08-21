import { SentenceCaseStyle, TerrainType } from "Enums";
import Translation from "language/Translation";
import { bindingManager } from "newui/BindingManager";
import Button, { ButtonEvent } from "newui/component/Button";
import { CheckButton, CheckButtonEvent } from "newui/component/CheckButton";
import Component from "newui/component/Component";
import ContextMenu, { ContextMenuOptionKeyValuePair } from "newui/component/ContextMenu";
import Text, { Paragraph } from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import { ITile } from "tile/ITerrain";
import terrainDescriptions from "tile/Terrains";
import Collectors, { PassStrategy } from "utilities/Collectors";
import Enums from "utilities/enum/Enums";
import { IVector2 } from "utilities/math/IVector";
import { Bound } from "utilities/Objects";
import TileHelpers from "utilities/TileHelpers";
import Actions from "../../Actions";
import DebugTools, { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import { IInspectInformationSection } from "../InspectDialog";

export default class TerrainInformation extends Component implements IInspectInformationSection {
	private position: IVector2;
	private tile: ITile;
	private terrainType: string;

	private readonly title: Paragraph;
	private readonly checkButtonTilled: CheckButton;

	public constructor(api: UiApi) {
		super(api);

		this.title = new Paragraph(api)
			.setText(() => this.tile && translation(DebugToolsTranslation.InspectTerrain)
				.get(terrainDescriptions[TileHelpers.getType(this.tile)]!.name))
			.appendTo(this);

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

	public update(position: IVector2, tile: ITile) {
		this.position = position;
		this.tile = tile;

		const terrainType = TerrainType[TileHelpers.getType(this.tile!)];
		if (terrainType !== this.terrainType) {
			this.terrainType = terrainType;
			DebugTools.LOG.info("Terrain:", this.terrainType);
		}

		this.title.refresh();
		this.checkButtonTilled.toggle(terrainDescriptions[TileHelpers.getType(tile)]!.tillable === true)
			.refresh();

		return this;
	}

	@Bound
	private toggleTilled(_: any, tilled: boolean) {
		actionManager.execute(localPlayer, Actions.get("toggleTilled"), { point: this.position, object: tilled });
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
			actionManager.execute(localPlayer, Actions.get("changeTerrain"), { point: this.position, object: terrain });
			this.update(this.position, this.tile);
		};
	}
}

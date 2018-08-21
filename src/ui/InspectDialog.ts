import { HookMethod, IHookHost } from "mod/IHookHost";
import Component from "newui/component/Component";
import { ComponentEvent } from "newui/component/IComponent";
import { Paragraph } from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import Dialog from "newui/screen/screens/game/component/Dialog";
import { DialogId, Edge, IDialogDescription } from "newui/screen/screens/game/Dialogs";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import { Bound } from "utilities/Objects";
import DebugTools, { translation } from "../DebugTools";
import { DebugToolsTranslation } from "../IDebugTools";
import CorpseInformation from "./inspect/Corpse";
import DoodadInformation from "./inspect/Doodad";
import EntityInformation from "./inspect/Entity";
import ItemInformation from "./inspect/Item";
import TerrainInformation from "./inspect/Terrain";
import TileEventInformation from "./inspect/TileEvent";

export interface IInspectInformationSection extends Component {
	update(position: IVector2, tile: ITile): void;
}

const informationSectionClasses: Array<new (api: UiApi) => IInspectInformationSection> = [
	TerrainInformation,
	EntityInformation,
	CorpseInformation,
	DoodadInformation,
	TileEventInformation,
	ItemInformation,
];

export default class InspectDialog extends Dialog implements IHookHost {
	public static description: IDialogDescription = {
		minSize: {
			x: 25,
			y: 25,
		},
		size: {
			x: 25,
			y: 30,
		},
		maxSize: {
			x: 40,
			y: 70,
		},
		edges: [
			[Edge.Left, 50],
			[Edge.Bottom, 0],
		],
		saveOpen: false,
	};

	private title: Paragraph;
	private infoSections: IInspectInformationSection[] = [];

	private tilePosition?: Vector3;
	private tile?: ITile;

	public constructor(gsapi: IGameScreenApi, id: DialogId) {
		super(gsapi, id);
		const api = gsapi.uiApi;

		this.classes.add("debug-tools-inspect-dialog");

		this.addScrollableWrapper(wrapper => wrapper
			.append(this.title = new Paragraph(api)
				.setText(() => this.tile && translation(DebugToolsTranslation.InspectTileTitle)
					.get(this.tilePosition!.x, this.tilePosition!.y, this.tilePosition!.z)))

			.append(this.infoSections = informationSectionClasses.map(cls => new cls(api)
				.classes.add("debug-tools-inspect-dialog-inspect-section")
				.on("update", this.update))));

		hookManager.register(this, "DebugToolsInspectDialog")
			.until(ComponentEvent.Remove);
	}

	public getName() {
		return translation(DebugToolsTranslation.DialogTitleInspect);
	}

	public setInspectionTile(tilePosition: Vector2) {
		this.tilePosition = new Vector3(tilePosition.x, tilePosition.y, localPlayer.z);

		this.tile = game.getTile(...this.tilePosition.xyz);

		DebugTools.LOG.info("Inspecting tile at", this.tilePosition!.xyz);
		DebugTools.LOG.info("Tile:", this.tile);

		this.update();

		return this;
	}

	@HookMethod
	public onGameTickEnd() {
		this.update();
	}

	@Bound
	private update() {
		this.title.refresh();

		for (const section of this.infoSections) {
			section.update(this.tilePosition!, this.tile!);
		}
	}
}

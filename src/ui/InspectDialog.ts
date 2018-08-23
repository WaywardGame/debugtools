import { ICreature } from "creature/ICreature";
import { IEntity } from "entity/IEntity";
import { Bindable } from "Enums";
import { HookMethod, IHookHost } from "mod/IHookHost";
import { BindCatcherApi, bindingManager } from "newui/BindingManager";
import Button from "newui/component/Button";
import ContextMenu from "newui/component/ContextMenu";
import { ComponentEvent } from "newui/component/IComponent";
import Text from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import { ScreenId } from "newui/screen/IScreen";
import { DialogEvent } from "newui/screen/screens/game/component/Dialog";
import { DialogId, Edge, IDialogDescription } from "newui/screen/screens/game/Dialogs";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import { ITile } from "tile/ITerrain";
import Collectors from "utilities/Collectors";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import { Bound } from "utilities/Objects";
import TileHelpers from "utilities/TileHelpers";
import DebugTools, { translation } from "../DebugTools";
import { DebugToolsTranslation, isSelectedTargetOverlay } from "../IDebugTools";
import InspectInformationSection, { TabInformation } from "./component/InspectInformationSection";
import CorpseInformation from "./inspect/Corpse";
import DoodadInformation from "./inspect/Doodad";
import EntityInformation from "./inspect/Entity";
import ItemInformation from "./inspect/Item";
import TerrainInformation from "./inspect/Terrain";
import TileEventInformation from "./inspect/TileEvent";
import TabDialog, { SubpanelInformation } from "./TabDialog";

const informationSectionClasses: (new (api: UiApi) => InspectInformationSection)[] = [
	TerrainInformation,
	EntityInformation,
	CorpseInformation,
	DoodadInformation,
	TileEventInformation,
	ItemInformation,
];

export default class InspectDialog extends TabDialog implements IHookHost {
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

	private entityButtons: Button[];
	private infoSections: InspectInformationSection[];
	private entityInfoSection: EntityInformation;

	private tilePosition?: Vector3;
	private tile?: ITile;
	private inspectionLock?: ICreature | IPlayer | INPC;
	private inspectingTile?: ITile;

	public constructor(gsapi: IGameScreenApi, id: DialogId) {
		super(gsapi, id);

		this.classes.add("debug-tools-inspect-dialog");

		hookManager.register(this, "DebugToolsInspectDialog")
			.until(ComponentEvent.Remove);

		this.on(DialogEvent.Close, this.onClose);
	}

	public getSubpanels() {
		if (!this.infoSections) {
			this.infoSections = informationSectionClasses.map(cls => new cls(this.api)
				.on("update", this.update)
				.on(ComponentEvent.WillRemove, infoSection => {
					infoSection.store();
					return false;
				}));

			this.entityInfoSection = this.infoSections
				.find<EntityInformation>((infoSection): infoSection is EntityInformation => infoSection instanceof EntityInformation)!;
		}

		this.entityButtons = [];

		return this.infoSections.values()
			.map<[InspectInformationSection, TabInformation[]]>(section => [section, section.getTabs()])
			.filter(([, tabs]) => !!tabs.length)
			.map<SubpanelInformation[]>(([section, tabs]) => tabs
				.map<SubpanelInformation>(([index, getTabTranslation]) => [
					Text.toString(getTabTranslation),
					getTabTranslation,
					component => section.setTab(index).appendTo(component),
					button => !(section instanceof EntityInformation) ? undefined : this.entityButtons[index] = button,
				]))
			.flat<SubpanelInformation>(1)
			.collect(Collectors.toArray);
	}

	public getName() {
		return translation(DebugToolsTranslation.DialogTitleInspect);
	}

	public setInspection(what: Vector2 | IPlayer | ICreature | INPC) {
		this.setInspectionTile(what);

		this.inspectionLock = "entityType" in what ? what : undefined;

		this.update();

		if (this.inspectionLock) this.showSubPanel(this.entityButtons[this.entityInfoSection.getIndex(this.inspectionLock)]);

		return this;
	}

	@HookMethod
	public onBindLoop(bindPressed: Bindable, api: BindCatcherApi) {
		if (api.wasPressed(Bindable.MenuContextMenu) && !bindPressed) {
			for (let i = 0; i < this.entityButtons.length; i++) {
				if (api.isMouseWithin(this.entityButtons[i])) {
					this.showInspectionLockMenu(i);
					bindPressed = Bindable.MenuContextMenu;
				}
			}
		}

		return bindPressed;
	}

	@HookMethod
	public onGameTickEnd() {
		this.update();
	}

	@HookMethod
	public onMoveComplete(player: IPlayer) {
		this.update();
	}

	@HookMethod
	public onTileUpdate(tile: ITile, x: number, y: number, z: number) {
		this.update();
	}

	@Bound
	private update() {
		if (this.inspectionLock) this.setInspectionTile(this.inspectionLock);

		for (const section of this.infoSections) {
			section.update(this.tilePosition!, this.tile!);
		}

		this.updateSubpanelList();

		if (this.inspectionLock) {
			for (const entityButton of this.entityButtons) entityButton.classes.remove("inspection-lock");

			this.entityButtons[this.entityInfoSection.getIndex(this.inspectionLock)]
				.classes.add("inspection-lock");
		}
	}

	private setInspectionTile(what: Vector2 | IEntity) {
		const position = new Vector3(what.x, what.y, "z" in what ? what.z : localPlayer.z);

		if (this.tilePosition && position.equals(this.tilePosition)) return;
		this.tilePosition = position;

		this.tile = game.getTile(...this.tilePosition.xyz);

		DebugTools.LOG.info("Inspecting tile at", this.tilePosition!.xyz);
		DebugTools.LOG.info("Tile:", this.tile);

		// remove old inspection overlay
		if (this.inspectingTile && this.inspectingTile !== this.tile) {
			TileHelpers.Overlay.remove(this.inspectingTile, isSelectedTargetOverlay);
		}

		// set new inspection overlay
		this.inspectingTile = this.tile;
		TileHelpers.Overlay.add(this.tile, {
			type: DebugTools.INSTANCE.overlayTarget,
			red: 0,
			blue: 0,
		}, isSelectedTargetOverlay);
		game.updateView(false);
	}

	@Bound
	private showInspectionLockMenu(index: number) {
		new ContextMenu(this.api,
			this.entityButtons[index].classes.has("inspection-lock") ?
				["Unlock Inspection", {
					translation: translation(DebugToolsTranslation.UnlockInspection),
					onActivate: this.unlockInspection,
				}] :
				["Lock Inspection", {
					translation: translation(DebugToolsTranslation.LockInspection),
					onActivate: this.lockInspection(index),
				}],
		)
			.addAllDescribedOptions()
			.setPosition(...bindingManager.getMouse().xy)
			.schedule(this.api.getScreen(ScreenId.Game)!.setContextMenu);
	}

	@Bound
	private unlockInspection() {
		delete this.inspectionLock;
		for (const entityButton of this.entityButtons) entityButton.classes.remove("inspection-lock");
	}

	private lockInspection(index: number) {
		return () => this.setInspection(this.entityInfoSection.getEntity(index));
	}

	@Bound
	private onClose() {
		if (this.inspectingTile) {
			TileHelpers.Overlay.remove(this.inspectingTile, isSelectedTargetOverlay);
			delete this.inspectingTile;
		}

		game.updateView(false);
	}

}

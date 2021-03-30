import { EventBus } from "event/EventBuses";
import { EventHandler, OwnEventHandler } from "event/EventManager";
import Entity from "game/entity/Entity";
import { RenderSource, TileUpdateType } from "game/IGame";
import { ITile } from "game/tile/ITerrain";
import Translation from "language/Translation";
import { HookMethod, IHookHost } from "mod/IHookHost";
import Mod from "mod/Mod";
import { Registry } from "mod/ModRegistry";
import Button from "ui/component/Button";
import Component from "ui/component/Component";
import ContextMenu from "ui/component/ContextMenu";
import Text from "ui/component/Text";
import Bind, { IBindHandlerApi } from "ui/input/Bind";
import Bindable from "ui/input/Bindable";
import InputManager from "ui/input/InputManager";
import { DialogId, Edge, IDialogDescription } from "ui/screen/screens/game/Dialogs";
import { gameScreen } from "ui/screen/screens/GameScreen";
import { Tuple } from "utilities/collection/Arrays";
import TileHelpers from "utilities/game/TileHelpers";
import Log from "utilities/Log";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import DebugTools from "../DebugTools";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../IDebugTools";
import Overlays from "../overlay/Overlays";
import InspectInformationSection from "./component/InspectInformationSection";
import CorpseInformation from "./inspect/Corpse";
import DoodadInformation from "./inspect/Doodad";
import EntityInformation from "./inspect/Entity";
import ItemInformation from "./inspect/Item";
import TerrainInformation from "./inspect/Terrain";
import TileEventInformation from "./inspect/TileEvent";
import TabDialog, { SubpanelInformation } from "./TabDialog";

export type InspectDialogInformationSectionClass = new () => InspectInformationSection;

/**
 * A list of panel classes that will appear in the dialog.
 */
const informationSectionClasses: InspectDialogInformationSectionClass[] = [
	TerrainInformation,
	EntityInformation,
	CorpseInformation,
	DoodadInformation,
	TileEventInformation,
	ItemInformation,
];

export default class InspectDialog extends TabDialog implements IHookHost {
	/**
	 * The positioning settings for the dialog.
	 */
	public static description: IDialogDescription = {
		minSize: new Vector2(20, 25),
		size: new Vector2(25, 27),
		maxSize: new Vector2(40, 70),
		edges: [
			[Edge.Left, 50],
			[Edge.Bottom, 33],
		],
		saveOpen: false,
	};

	public static INSTANCE: InspectDialog | undefined;

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;
	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private entityButtons: Button[];
	private infoSections: InspectInformationSection[];
	private entityInfoSection: EntityInformation;

	private tilePosition?: Vector3;
	private tile?: ITile;
	private inspectionLock?: Entity;
	private inspectingTile?: ITile;
	private storePanels = true;
	private shouldLog = false;
	private willShowSubpanel = false;

	public constructor(id: DialogId) {
		super(id);

		this.classes.add("debug-tools-inspect-dialog");

		InspectDialog.INSTANCE = this;
	}

	/**
	 * Implements the abstract method in "TabDialog". Returns an array of tuples containing information used to set-up the
	 * subpanels of this dialog.
	 */
	@Override public getSubpanels(): SubpanelInformation[] {
		if (!this.infoSections) {
			this.infoSections = informationSectionClasses.stream()
				.merge(this.DEBUG_TOOLS.modRegistryInspectDialogPanels.getRegistrations()
					.map(registration => registration.data(InspectInformationSection)))
				.map(cls => new cls()
					.event.subscribe("update", this.update)
					.event.subscribe("willRemove", infoSection => {
						if (this.storePanels) {
							infoSection.event.emit("switchAway");
							infoSection.store();
							return false;
						}

						return undefined;
					}))
				.toArray();

			// we're going to need the entity information section for some other stuff
			this.entityInfoSection = this.infoSections
				.find<EntityInformation>((infoSection): infoSection is EntityInformation => infoSection instanceof EntityInformation)!;
		}

		this.entityButtons = [];

		return this.infoSections.stream()
			// add the tabs of the section to the tuple
			.map(section => Tuple(section, section.getTabs()))
			// if there are no tabs from the section, remove it
			.filter(([, tabs]) => !!tabs.length)
			// map each of the section/tab tuples with an array of tuples representing all the subpanels (tabs) provided by that section
			.map(([section, tabs]) => tabs
				// map each tab to the subpanel information for it
				.map(([index, getTabTranslation]) => Tuple(
					Text.toString(getTabTranslation),
					getTabTranslation,
					// to show the panel, we append the section to the passed component & call a couple methods on the panel
					(component: Component) => section.setTab(index)
						.appendTo(component)
						.event.emit("switchTo"),
					// we cache all of the entity buttons
					(button: Button) => !(section instanceof EntityInformation) ? undefined : this.entityButtons[index] = button,
				)))
			// currently we have an array of `SubpanelInformation` arrays, because each tab provided an array of them, fix with `flat`
			.flatMap<SubpanelInformation>()
			// and now return an array
			.toArray();
	}

	@Override public getName(): Translation {
		return translation(DebugToolsTranslation.DialogTitleInspect);
	}

	/**
	 * - Sets the tile or entity to inspect. 
	 * 	-If an entity is inspected, this means it's the new "inspection lock" (whenever the entity
	 * moves, the inspection will move to its tile).
	 * - Updates the dialog. (`update`)
	 * - If the inspection is locked to an entity, it makes a note of needing to show the entity's subpanel (`willShowSubpanel`).
	 */
	public setInspection(what: Vector2 | Entity) {
		this.setInspectionTile(what);

		this.inspectionLock = "entityType" in what ? what : undefined;

		this.update();

		if (this.inspectionLock) this.willShowSubpanel = true;

		return this;
	}

	/**
	 * - If the inspection is locked to an entity, set the inspection tile to that entity.
	 * - For each info section, reset whether it should log, then update it with the current inspection tile.
	 * - Trigger a log update.
	 * - After `300ms` (debounced), update the subpanel list.
	 */
	@Bound
	public update() {
		if (this.inspectionLock) this.setInspectionTile(this.inspectionLock);

		for (const section of this.infoSections) {
			section.resetWillLog();
			section.update(this.tilePosition!, this.tile!);
		}

		this.logUpdate();
		this.schedule(300, 300, this.updateSubpanels);
	}

	@Bind.onDown(Registry<DebugTools>(DEBUG_TOOLS_ID).get("bindableCloseInspectDialog"))
	public onCloseBind() {
		this.close();
		return true;
	}

	@Bind.onDown(Bindable.MenuContextMenu)
	public onContextMenuBind(api: IBindHandlerApi) {
		for (let i = 0; i < this.entityButtons.length; i++) {
			// the entity tabs can't use the `setContextMenu` functionality because they change so often. As a result, we have to
			// catch the `MenuContextMenu` bind manually, and check whether it happened on one of them. If it did, we show the
			// inspection lock menu.
			if (api.mouse.isWithin(this.entityButtons[i])) {
				this.showInspectionLockMenu(i);
				return true;
			}
		}

		return false;
	}

	@EventHandler(EventBus.Game, "end")
	public onGameEnd() {
		this.close();
	}

	////////////////////////////////////
	// Hooks that trigger a dialog update
	//

	@HookMethod
	@Debounce(100)
	public onGameTickEnd() {
		this.update();
	}

	@EventHandler(EventBus.Players, "moveComplete")
	public onMoveComplete() {
		this.update();
	}

	@EventHandler(EventBus.Game, "tileUpdate")
	public onTileUpdate(game: any, tile: ITile, x: number, y: number, z: number, tileUpdateType: TileUpdateType) {
		this.update();
	}

	/**
	 * - Removes the inspection overlay.
	 * - Forcibly removes any info sections.
	 */
	@OwnEventHandler(InspectDialog, "close")
	protected onClose() {
		if (this.inspectingTile) {
			TileHelpers.Overlay.remove(this.inspectingTile, Overlays.isSelectedTarget);
			delete this.inspectingTile;
		}

		game.updateView(RenderSource.Mod, false);

		this.storePanels = false;
		for (const infoSection of this.infoSections) {
			if (infoSection.isVisible()) {
				infoSection.event.emit("switchAway");
			}

			infoSection.remove();
		}

		delete InspectDialog.INSTANCE;
	}

	/**
	 * - Updates the subpanel list through the `TabDialog`. This will call our `getSubpanels` implementation.
	 * - If a subpanel needs to be shown (`willShowSubpanel`), and the inspection lock exists, the inspection lock's subpanel is shown.
	 * - Sets the `inspection-lock` class on the tab of the panel which inspection is locked to.
	 */
	@Bound
	private updateSubpanels() {
		this.updateSubpanelList();

		if (this.willShowSubpanel && this.inspectionLock) {
			this.showSubPanel(this.entityButtons[this.entityInfoSection.getEntityIndex(this.inspectionLock)]);
			this.willShowSubpanel = false;
		}

		if (this.inspectionLock) {
			for (const entityButton of this.entityButtons) entityButton.classes.remove("inspection-lock");

			this.entityButtons[this.entityInfoSection.getEntityIndex(this.inspectionLock)]
				.classes.add("inspection-lock");
		}
	}

	/**
	 * - If the tile position hasn't changed, returns.
	 * - Logs an update.
	 * - If there was an existing inspection overlay, removes it.
	 * - Adds a new inspection overlay to the currently inspecting tile.
	 */
	private setInspectionTile(what: Vector2 | Entity) {
		const position = new Vector3(what.x, what.y, "z" in what ? what.z : localPlayer.z);

		if (this.tilePosition && position.equals(this.tilePosition)) return;
		this.tilePosition = position;

		this.tile = game.getTile(...this.tilePosition.xyz);

		this.shouldLog = true;
		this.logUpdate();

		// remove old inspection overlay
		if (this.inspectingTile && this.inspectingTile !== this.tile) {
			TileHelpers.Overlay.remove(this.inspectingTile, Overlays.isSelectedTarget);
		}

		// set new inspection overlay
		this.inspectingTile = this.tile;
		TileHelpers.Overlay.add(this.tile, {
			type: this.DEBUG_TOOLS.overlayTarget,
			red: 0,
			blue: 0,
		}, Overlays.isSelectedTarget);
		game.updateView(RenderSource.Mod, false);
	}

	/**
	 * Logs information from any section that changed.
	 */
	@Bound
	private logUpdate() {
		if (this.shouldLog) {
			this.LOG.info("Tile:", this.tile, this.tilePosition !== undefined ? this.tilePosition.toString() : undefined, this.tilePosition ? game.getTileData(this.tilePosition.x, this.tilePosition.y, this.tilePosition.z) : undefined);
			this.shouldLog = false;
		}

		for (const infoSection of this.infoSections) {
			if (infoSection.willLog) {
				infoSection.logUpdate();
				infoSection.resetWillLog();
			}
		}
	}

	/**
	 * Creates and shows an "inspection lock" context menu, with the options "Unlock Inspection" and "Lock Inspection", depending on
	 * whether the section is currently the inspection lock.
	 */
	@Bound
	private showInspectionLockMenu(index: number) {
		new ContextMenu(this.entityButtons[index].classes.hasEvery("inspection-lock") ?
			["Unlock Inspection", {
				translation: translation(DebugToolsTranslation.UnlockInspection),
				onActivate: this.unlockInspection,
			}] :
			["Lock Inspection", {
				translation: translation(DebugToolsTranslation.LockInspection),
				onActivate: this.lockInspection(index),
			}])
			.addAllDescribedOptions()
			.setPosition(...InputManager.mouse.position.xy)
			.schedule(gameScreen!.setContextMenu);
	}

	/**
	 * Removes the inspection lock.
	 */
	@Bound
	private unlockInspection() {
		delete this.inspectionLock;
		for (const entityButton of this.entityButtons) entityButton.classes.remove("inspection-lock");
	}

	/**
	 * Sets the inspection lock. (As a side effect, the panel is shown)
	 */
	private lockInspection(index: number) {
		return () => this.setInspection(this.entityInfoSection.getEntity(index));
	}

}

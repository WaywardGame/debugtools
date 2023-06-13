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

import { EventBus } from "event/EventBuses";
import { Events, IEventEmitter } from "event/EventEmitter";
import { EventHandler, OwnEventHandler } from "event/EventManager";
import { TileUpdateType } from "game/IGame";
import Entity from "game/entity/Entity";
import Item from "game/item/Item";
import { IOverlayInfo, TerrainType } from "game/tile/ITerrain";
import Tile from "game/tile/Tile";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import { Registry } from "mod/ModRegistry";
import { RenderSource } from "renderer/IRenderer";
import Button from "ui/component/Button";
import Component from "ui/component/Component";
import ContextMenu from "ui/component/ContextMenu";
import Text from "ui/component/Text";
import Bind, { IBindHandlerApi } from "ui/input/Bind";
import Bindable from "ui/input/Bindable";
import InputManager from "ui/input/InputManager";
import { DialogId, Edge, IDialogDescription } from "ui/screen/screens/game/Dialogs";
import TabDialog, { SubpanelInformation } from "ui/screen/screens/game/component/TabDialog";
import { Bound, Debounce } from "utilities/Decorators";
import Log from "utilities/Log";
import { Tuple } from "utilities/collection/Tuple";
import Vector2 from "utilities/math/Vector2";
import DebugTools from "../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../IDebugTools";
import { ContainerClasses } from "./component/Container";
import InspectInformationSection from "./component/InspectInformationSection";
import CorpseInformation from "./inspect/CorpseInformation";
import DoodadInformation from "./inspect/DoodadInformation";
import EntityInformation from "./inspect/EntityInformation";
import ItemInformation from "./inspect/ItemInformation";
import TerrainInformation from "./inspect/TerrainInformation";
import TileEventInformation from "./inspect/TileEventInformation";

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

export interface IInspectDialogEvents extends Events<TabDialog<InspectInformationSection>> {
	updateSubpanels(): any;
}

export default class InspectDialog extends TabDialog<InspectInformationSection> {
	/**
	 * The positioning settings for the dialog.
	 */
	public static description: IDialogDescription = {
		minResolution: new Vector2(300, 200),
		size: new Vector2(29, 25),
		edges: [
			[Edge.Left, 50],
			[Edge.Bottom, 31],
		],
		saveOpen: false,
	};

	public static INSTANCE: InspectDialog | undefined;

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;
	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	public override readonly event: IEventEmitter<this, IInspectDialogEvents>;

	private entityButtons: Button[];
	private entityInfoSection: EntityInformation;

	private tile?: Tile;
	private inspectionLock?: Entity;
	private inspectingTile?: { tile: Tile; overlay: IOverlayInfo };
	private shouldLog = false;
	private willShowSubpanel = false;

	public constructor(id: DialogId) {
		super(id);

		this.classes.add("debug-tools-inspect-dialog");

		InspectDialog.INSTANCE = this;
	}

	/**
	 * Implements the abstract method in "TabDialog". Returns an array of subpanels.
	 * This will only be called once
	 */
	protected override getSubpanels(): InspectInformationSection[] {
		const subpanels = informationSectionClasses.stream()
			.merge(this.DEBUG_TOOLS.modRegistryInspectDialogPanels.getRegistrations()
				.map(registration => registration.data(InspectInformationSection)))
			.map(cls => new cls()
				.event.subscribe("update", this.update))
			.toArray();

		// we're going to need the entity information section for some other stuff
		this.entityInfoSection = subpanels
			.find<EntityInformation>((infoSection): infoSection is EntityInformation => infoSection instanceof EntityInformation)!;

		return subpanels;
	}

	/**
	 * Implements the abstract method in "TabDialog". Returns an array of tuples containing information used to set-up the
	 * subpanels of this dialog.
	 * 
	 * If the subpanel classes haven't been instantiated yet, it first instantiates them by calling getSubpanels.
	 * This includes binding a `WillRemove` event handler to the panel, which will `store` (cache) the panel instead of removing it,
	 * and trigger a `SwitchAway` event on the panel when this occurs.
	 */
	protected override getSubpanelInformation(subpanels: InspectInformationSection[]): SubpanelInformation[] {
		this.entityButtons = [];

		return this.subpanels.stream()
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
						.schedule(section => this.onShowSubpanel(section)(component)),
					// we cache all of the entity buttons
					(button: Button) => !(section instanceof EntityInformation) ? undefined : this.entityButtons[index] = button,
				)))
			// currently we have an array of `SubpanelInformation` arrays, because each tab provided an array of them, fix with `flat`
			.flatMap<SubpanelInformation>()
			// and now return an array
			.toArray();
	}

	public override getName(): Translation {
		return translation(DebugToolsTranslation.DialogTitleInspect);
	}

	/**
	 * - Sets the tile or entity to inspect. 
	 * 	-If an entity is inspected, this means it's the new "inspection lock" (whenever the entity
	 * moves, the inspection will move to its tile).
	 * - Updates the dialog. (`update`)
	 * - If the inspection is locked to an entity, it makes a note of needing to show the entity's subpanel (`willShowSubpanel`).
	 */
	public setInspection(what: Tile | Entity) {
		this.setInspectionTile(what);

		let item: Item | undefined;
		if (what instanceof Item) {
			item = what;
			this.LOG.info("Item:", item);
			const human = what.getCurrentOwner();
			if (human) {
				what = human;
			}
		}

		this.inspectionLock = "entityType" in what ? what : undefined;

		this.update();

		if (item) {
			this.event.waitFor("updateSubpanels").then(() => {
				const itemElement = this.queryX<HTMLDetailsElement>(`.${ContainerClasses.ItemDetails}[@data-item-id="${item!.id}"]`);
				if (itemElement) {
					for (const itemDetailsElement of this.element.querySelectorAll(`.${ContainerClasses.ItemDetails}, .${ContainerClasses.ContainedItemDetails}`) as Iterable<HTMLDetailsElement>)
						itemDetailsElement.open = false;

					let detailsElement: HTMLDetailsElement | null | undefined = itemElement;
					while (detailsElement = detailsElement.parentElement?.closest<HTMLDetailsElement>(`.${ContainerClasses.ContainedItemDetails}, .${ContainerClasses.ItemDetails}`))
						detailsElement.open = true;

					itemElement.open = true;
					const summary = itemElement.querySelector("summary");
					if (summary) {
						this.panelWrapper.scrollTo(summary, 300);
						summary?.focus();
					}
				}
			});
		}

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

		for (const section of this.subpanels) {
			section.resetWillLog();
			section.update(this.tile!);
		}

		this.logUpdate();
		this.schedule(20, 50, this.updateSubpanels);
	}

	@EventHandler(EventBus.LocalPlayer, "preMoveToIsland")
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

	@EventHandler(EventBus.Game, "stoppingPlay")
	public onGameEnd() {
		this.close();
	}

	////////////////////////////////////
	// Event Handlers that trigger a dialog update
	//

	@EventHandler(EventBus.Game, "tickEnd")
	@Debounce(10)
	public onGameTickEnd() {
		this.update();
	}

	@EventHandler(EventBus.Players, "moveComplete")
	public onMoveComplete() {
		this.update();
	}

	@EventHandler(EventBus.Island, "tileUpdate")
	@Debounce(10)
	public onTileUpdate(island: any, tile: Tile, tileUpdateType: TileUpdateType) {
		this.update();
	}

	/**
	 * - Removes the inspection overlay.
	 * - Forcibly removes any info sections.
	 */
	@OwnEventHandler(InspectDialog, "close")
	protected onClose() {
		if (this.inspectingTile) {
			this.inspectingTile.tile.removeOverlay(this.inspectingTile.overlay);
			delete this.inspectingTile;
		}

		localPlayer.updateView(RenderSource.Mod, false);

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

		this.event.emit("updateSubpanels");
	}

	/**
	 * - If the tile position hasn't changed, returns.
	 * - Logs an update.
	 * - If there was an existing inspection overlay, removes it.
	 * - Adds a new inspection overlay to the currently inspecting tile.
	 */
	private setInspectionTile(what: Tile | Entity) {
		const tile = what instanceof Tile ? what : what.tile;;
		if (!tile) {
			return;
		}

		if (this.tile && this.tile === tile) {
			return;
		}

		this.tile = tile;

		this.shouldLog = true;
		this.logUpdate();

		// remove old inspection overlay
		if (this.inspectingTile && this.tile !== this.inspectingTile.tile) {
			this.inspectingTile.tile.removeOverlay(this.inspectingTile.overlay);
		}

		// set new inspection overlay
		this.inspectingTile = {
			tile: this.tile,
			overlay: {
				type: this.DEBUG_TOOLS.overlayTarget,
				red: 0,
				blue: 0,
			},
		};
		this.tile.addOrUpdateOverlay(this.inspectingTile.overlay);
		localPlayer.updateView(RenderSource.Mod, false);
	}

	/**
	 * Logs information from any section that changed.
	 */
	@Bound
	private logUpdate() {
		if (this.shouldLog) {
			const tileData = this.tile ? this.tile.getTileData() : undefined;
			this.LOG.info("Tile:", this.tile, this.tile?.toString(), tileData?.map(data => TerrainType[data.type]).join(", "), tileData,);
			this.shouldLog = false;
		}

		for (const infoSection of this.subpanels) {
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

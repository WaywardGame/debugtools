/*!
 * Copyright 2011-2024 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import Translation from "@wayward/game/language/Translation";
import Mod from "@wayward/game/mod/Mod";
import { Save, SaveLocation } from "@wayward/game/ui/IUi";
import Bindable from "@wayward/game/ui/input/Bindable";
import { DialogId, Edge, IDialogDescription } from "@wayward/game/ui/screen/screens/game/Dialogs";
import TabDialog, { SubpanelInformation } from "@wayward/game/ui/screen/screens/game/component/TabDialog";
import { MenuBarButtonType } from "@wayward/game/ui/screen/screens/game/static/menubar/IMenuBarButton";
import Vector2 from "@wayward/game/utilities/math/Vector2";
import { Tuple } from "@wayward/utilities/collection/Tuple";
import { OwnEventHandler } from "@wayward/utilities/event/EventManager";
import { sleep } from "@wayward/utilities/promise/Async";
import DebugTools from "../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../IDebugTools";
import DebugToolsPanel from "./component/DebugToolsPanel";
import DisplayPanel from "./panel/DisplayPanel";
import GeneralPanel from "./panel/GeneralPanel";
import HistoryPanel from "./panel/HistoryPanel";
import PaintPanel from "./panel/PaintPanel";
import SelectionPanel from "./panel/SelectionPanel";
import TemperaturePanel from "./panel/TemperaturePanel";
import TemplatePanel from "./panel/TemplatePanel";
import ZonesPanel from "./panel/ZonesPanel";

export type DebugToolsDialogPanelClass = new () => DebugToolsPanel;

/**
 * A list of panel classes that will appear in the dialog.
 */
const subpanelClasses: DebugToolsDialogPanelClass[] = [
	GeneralPanel,
	DisplayPanel,
	PaintPanel,
	SelectionPanel,
	TemplatePanel,
	ZonesPanel,
	TemperaturePanel,
	HistoryPanel,
];

export default class DebugToolsDialog extends TabDialog<DebugToolsPanel> {
	/**
	 * The positioning settings for the dialog.
	 */
	public static description: IDialogDescription = {
		minResolution: new Vector2(300, 200),
		size: new Vector2(29, 31),
		edges: [
			[Edge.Right, 50],
			[Edge.Top, 7],
		],
	};

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;

	@Save(SaveLocation.Local)
	private current: string | number | undefined;

	public constructor(id: DialogId) {
		super(id);
		this.classes.add("debug-tools-dialog");

		if (!this.DEBUG_TOOLS.hasPermission()) {
			sleep(1).then(() => gameScreen?.dialogs.close(id));
		}
	}

	public override getName(): Translation {
		return translation(DebugToolsTranslation.DialogTitleMain);
	}

	public override getBindable(): Bindable {
		return this.DEBUG_TOOLS.bindableToggleDialog;
	}

	override getIcon(): MenuBarButtonType {
		return this.DEBUG_TOOLS.menuBarButton;
	}


	protected override getDefaultSubpanelInformation(): SubpanelInformation | undefined {
		return this.subpanelInformations.find(spi => spi[0] === this.current) ?? super.getDefaultSubpanelInformation();
	}

	@OwnEventHandler(DebugToolsDialog, "changeSubpanel")
	protected onChangeSubpanel(activeSubpanel: SubpanelInformation): void {
		this.current = activeSubpanel[0];
	}

	/**
	 * Implements the abstract method in "TabDialog". Returns an array of subpanels.
	 * This will only be called once
	 */
	protected override getSubpanels(): DebugToolsPanel[] {
		return subpanelClasses.stream()
			.merge(this.DEBUG_TOOLS.modRegistryMainDialogPanels.getRegistrations()
				.map(registration => registration.data(DebugToolsPanel)))
			.map(cls => new cls())
			.toArray();
	}

	/**
	 * Implements the abstract method in "TabDialog". Returns an array of tuples containing information used to set-up the
	 * subpanels of this dialog.
	 * 
	 * If the subpanel classes haven't been instantiated yet, it first instantiates them by calling getSubpanels.
	 * This includes binding a `WillRemove` event handler to the panel, which will `store` (cache) the panel instead of removing it,
	 * and trigger a `SwitchAway` event on the panel when this occurs.
	 */
	protected override getSubpanelInformation(subpanels: DebugToolsPanel[]): SubpanelInformation[] {
		return subpanels
			.map(subpanel => Tuple(
				translation(subpanel.getTranslation()).getString(),
				translation(subpanel.getTranslation()),
				this.onShowSubpanel(subpanel),
			));
	}

}

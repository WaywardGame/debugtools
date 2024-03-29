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

import { OwnEventHandler } from "event/EventManager";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import { Save, SaveLocation } from "ui/IUi";
import { DialogId, Edge, IDialogDescription } from "ui/screen/screens/game/Dialogs";
import TabDialog, { SubpanelInformation } from "ui/screen/screens/game/component/TabDialog";
import { Tuple } from "utilities/collection/Tuple";
import Vector2 from "utilities/math/Vector2";
import { sleep } from "utilities/promise/Async";
import DebugTools from "../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../IDebugTools";
import DebugToolsPanel from "./component/DebugToolsPanel";
import DisplayPanel from "./panel/DisplayPanel";
import GeneralPanel from "./panel/GeneralPanel";
import PaintPanel from "./panel/PaintPanel";
import SelectionPanel from "./panel/SelectionPanel";
import TemperaturePanel from "./panel/TemperaturePanel";
import TemplatePanel from "./panel/TemplatePanel";

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
	TemperaturePanel,
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
			[Edge.Bottom, 38],
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

	public override getBindable() {
		return this.DEBUG_TOOLS.bindableToggleDialog;
	}

	override getIcon() {
		return this.DEBUG_TOOLS.menuBarButton;
	}


	protected override getDefaultSubpanelInformation(): SubpanelInformation | undefined {
		return this.subpanelInformations.find(spi => spi[0] === this.current) ?? super.getDefaultSubpanelInformation();
	}

	@OwnEventHandler(DebugToolsDialog, "changeSubpanel")
	protected onChangeSubpanel(activeSubpanel: SubpanelInformation) {
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

import Translation from "language/Translation";
import { IHookHost } from "mod/IHookHost";
import Mod from "mod/Mod";
import Component from "newui/component/Component";
import { ComponentEvent } from "newui/component/IComponent";
import { DialogId, Edge, IDialogDescription } from "newui/screen/screens/game/Dialogs";
import { tuple } from "utilities/Arrays";
import { sleep } from "utilities/Async";
import DebugTools from "../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../IDebugTools";
import DebugToolsPanel, { DebugToolsPanelEvent } from "./component/DebugToolsPanel";
import DisplayPanel from "./panel/DisplayPanel";
import GeneralPanel from "./panel/GeneralPanel";
import PaintPanel from "./panel/PaintPanel";
import SelectionPanel from "./panel/SelectionPanel";
import TemplatePanel from "./panel/TemplatePanel";
import TabDialog, { SubpanelInformation } from "./TabDialog";

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
];

export default class DebugToolsDialog extends TabDialog implements IHookHost {
	/**
	 * The positioning settings for the dialog.
	 */
	public static description: IDialogDescription = {
		minSize: {
			x: 20,
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
			[Edge.Left, 25],
			[Edge.Bottom, 0],
		],
	};

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;

	private subpanels: DebugToolsPanel[];
	private activePanel: DebugToolsPanel;

	private storePanels = true;

	public constructor(id: DialogId) {
		super(id);
		this.classes.add("debug-tools-dialog");

		// we register this component as a "hook host" — this means that, like the `Mod` class, it can implement hook methods
		hookManager.register(this, "DebugToolsDialog")
			// we deregister this component as a "hook host" when it's removed from the DOM
			.until(ComponentEvent.Remove);

		// when the dialog is removed from the DOM, we force remove all of the panels (they're cached otherwise)
		this.on(ComponentEvent.WillRemove, () => {
			this.storePanels = false;
			for (const subpanel of this.subpanels) {
				subpanel.emit(DebugToolsPanelEvent.SwitchAway);
				subpanel.remove();
			}
		});

		if (!this.DEBUG_TOOLS.hasPermission()) {
			sleep(1).then(() => gameScreen!.closeDialog(id));
		}
	}

	public getName(): Translation {
		return translation(DebugToolsTranslation.DialogTitleMain);
	}

	/**
	 * Implements the abstract method in "TabDialog". Returns an array of tuples containing information used to set-up the
	 * subpanels of this dialog.
	 * 
	 * If the subpanel classes haven't been instantiated yet, it first instantiates them. This includes binding a `WillRemove` event
	 * handler to the panel, which will `store` (cache) the panel instead of removing it, and trigger a `SwitchAway` event on the 
	 * panel when this occurs.
	 */
	public getSubpanels(): SubpanelInformation[] {
		if (!this.subpanels) {
			this.subpanels = subpanelClasses.stream()
				.merge(this.DEBUG_TOOLS.modRegistryMainDialogPanels.getRegistrations()
					.map(registration => registration.data(DebugToolsPanel)))
				.map(cls => new cls()
					.on(ComponentEvent.WillRemove, panel => {
						if (panel.isVisible()) {
							panel.emit(DebugToolsPanelEvent.SwitchAway);
						}

						if (this.storePanels) {
							panel.store();
							return false;
						}

						return undefined;
					}))
				.toArray();
		}

		return this.subpanels
			.map(subpanel => tuple(
				translation(subpanel.getTranslation()).getString(),
				translation(subpanel.getTranslation()),
				this.onShowSubpanel(subpanel),
			));
	}

	/**
	 * Returns a function that will be executed when the passed subpanel is shown.
	 * 
	 * When executed, the return function will append the panel to show to the passed component (which is the panel wrapper 
	 * of the `TabDialog`), and trigger a `SwitchTo` event on the panel.
	 */
	private onShowSubpanel(showPanel: DebugToolsPanel) {
		return (component: Component) => {
			this.activePanel = showPanel.appendTo(component);
			this.activePanel.emit(DebugToolsPanelEvent.SwitchTo);
		};
	}

}

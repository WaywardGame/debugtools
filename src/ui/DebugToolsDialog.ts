import Translation from "language/Translation";
import Mod from "mod/Mod";
import Component from "ui/component/Component";
import { DialogId, Edge, IDialogDescription } from "ui/screen/screens/game/Dialogs";
import { gameScreen } from "ui/screen/screens/GameScreen";
import { Tuple } from "utilities/collection/Arrays";
import Vector2 from "utilities/math/Vector2";
import { sleep } from "utilities/promise/Async";
import DebugTools from "../DebugTools";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../IDebugTools";
import DebugToolsPanel from "./component/DebugToolsPanel";
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

export default class DebugToolsDialog extends TabDialog {
	/**
	 * The positioning settings for the dialog.
	 */
	public static description: IDialogDescription = {
		minSize: new Vector2(20, 25),
		size: new Vector2(25, 27),
		maxSize: new Vector2(40, 70),
		edges: [
			[Edge.Left, 25],
			[Edge.Bottom, 33],
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

		// when the dialog is removed from the DOM, we force remove all of the panels (they're cached otherwise)
		this.event.subscribe("willRemove", () => {
			this.storePanels = false;
			for (const subpanel of this.subpanels) {
				subpanel.event.emit("switchAway");
				subpanel.remove();
			}
		});

		if (!this.DEBUG_TOOLS.hasPermission()) {
			sleep(1).then(() => gameScreen!.closeDialog(id));
		}
	}

	@Override public getName(): Translation {
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
	@Override public getSubpanels(): SubpanelInformation[] {
		if (!this.subpanels) {
			this.subpanels = subpanelClasses.stream()
				.merge(this.DEBUG_TOOLS.modRegistryMainDialogPanels.getRegistrations()
					.map(registration => registration.data(DebugToolsPanel)))
				.map(cls => new cls()
					.event.until(this, "close")
					.subscribe("willRemove", panel => {
						if (panel.isVisible()) {
							panel.event.emit("switchAway");
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
			.map(subpanel => Tuple(
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
			this.activePanel.event.emit("switchTo");
		};
	}

}

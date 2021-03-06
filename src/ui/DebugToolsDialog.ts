import Translation from "language/Translation";
import Mod from "mod/Mod";
import TabDialog, { SubpanelInformation } from "ui/screen/screens/game/component/TabDialog";
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

export default class DebugToolsDialog extends TabDialog<DebugToolsPanel> {
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

	public constructor(id: DialogId) {
		super(id);
		this.classes.add("debug-tools-dialog");

		if (!this.DEBUG_TOOLS.hasPermission()) {
			sleep(1).then(() => gameScreen!.closeDialog(id));
		}
	}

	@Override public getName(): Translation {
		return translation(DebugToolsTranslation.DialogTitleMain);
	}

	/**
	 * Implements the abstract method in "TabDialog". Returns an array of subpanels.
	 * This will only be called once
	 */
	@Override protected getSubpanels(): DebugToolsPanel[] {
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
	@Override protected getSubpanelInformation(subpanels: DebugToolsPanel[]): SubpanelInformation[] {
		return subpanels
			.map(subpanel => Tuple(
				translation(subpanel.getTranslation()).getString(),
				translation(subpanel.getTranslation()),
				this.onShowSubpanel(subpanel),
			));
	}

}

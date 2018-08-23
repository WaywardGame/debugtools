import { IHookHost } from "mod/IHookHost";
import Component from "newui/component/Component";
import { ComponentEvent } from "newui/component/IComponent";
import { DialogId, Edge, IDialogDescription } from "newui/screen/screens/game/Dialogs";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { translation } from "../DebugTools";
import { DebugToolsTranslation } from "../IDebugTools";
import DebugToolsPanel, { DebugToolsPanelEvent } from "./component/DebugToolsPanel";
import DisplayPanel from "./panel/DisplayPanel";
import GeneralPanel from "./panel/GeneralPanel";
import PaintPanel from "./panel/PaintPanel";
import TabDialog, { SubpanelInformation } from "./TabDialog";

const subpanelClasses: (new (gsapi: IGameScreenApi) => DebugToolsPanel)[] = [
	GeneralPanel,
	DisplayPanel,
	PaintPanel,
];

export default class DebugToolsDialog extends TabDialog implements IHookHost {
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
			[Edge.Left, 25],
			[Edge.Bottom, 0],
		],
	};

	private subpanels: DebugToolsPanel[];
	private activePanel: DebugToolsPanel;

	public constructor(gsapi: IGameScreenApi, id: DialogId) {
		super(gsapi, id);
		this.classes.add("debug-tools-dialog");

		hookManager.register(this, "DebugToolsDialog")
			.until(ComponentEvent.Remove);
	}

	public getName() {
		return translation(DebugToolsTranslation.DialogTitleMain);
	}

	public getSubpanels(): SubpanelInformation[] {
		if (!this.subpanels) {
			this.subpanels = subpanelClasses.map(cls => new cls(this.gsapi));
		}

		return this.subpanels
			.map<SubpanelInformation>(subpanel => [subpanel.getTranslation(), translation(subpanel.getTranslation()), this.onShowSubpanel(subpanel)]);
	}

	private onShowSubpanel(showPanel: DebugToolsPanel) {
		return (component: Component) => {
			if (showPanel === this.activePanel) return;

			this.activePanel = showPanel.appendTo(component)
				.on(ComponentEvent.WillRemove, panel => {
					panel.store().triggerSync(DebugToolsPanelEvent.SwitchAway);
					return false;
				});

			this.activePanel.triggerSync(DebugToolsPanelEvent.SwitchTo);
		};
	}

}

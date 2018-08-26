import { IHookHost } from "mod/IHookHost";
import Component from "newui/component/Component";
import { ComponentEvent } from "newui/component/IComponent";
import { DialogId, Edge, IDialogDescription } from "newui/screen/screens/game/Dialogs";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { tuple } from "utilities/Arrays";
import { translation } from "../DebugTools";
import { DebugToolsTranslation } from "../IDebugTools";
import DebugToolsPanel, { DebugToolsPanelEvent } from "./component/DebugToolsPanel";
import DisplayPanel from "./panel/DisplayPanel";
import GeneralPanel from "./panel/GeneralPanel";
import PaintPanel from "./panel/PaintPanel";
import SelectionPanel from "./panel/SelectionPanel";
import TemplatePanel from "./panel/TemplatePanel";
import TabDialog, { SubpanelInformation } from "./TabDialog";

const subpanelClasses: (new (gsapi: IGameScreenApi) => DebugToolsPanel)[] = [
	GeneralPanel,
	DisplayPanel,
	PaintPanel,
	SelectionPanel,
	TemplatePanel,
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

	private storePanels = true;

	public constructor(gsapi: IGameScreenApi, id: DialogId) {
		super(gsapi, id);
		this.classes.add("debug-tools-dialog");

		hookManager.register(this, "DebugToolsDialog")
			.until(ComponentEvent.Remove);

		this.on(ComponentEvent.WillRemove, () => {
			this.storePanels = false;
			for (const subpanel of this.subpanels) subpanel.remove();
		});
	}

	public getName() {
		return translation(DebugToolsTranslation.DialogTitleMain);
	}

	public getSubpanels(): SubpanelInformation[] {
		if (!this.subpanels) {
			this.subpanels = subpanelClasses.map(cls => new cls(this.gsapi));
		}

		return this.subpanels
			.map(subpanel => tuple(subpanel.getTranslation(), translation(subpanel.getTranslation()), this.onShowSubpanel(subpanel)));
	}

	private onShowSubpanel(showPanel: DebugToolsPanel) {
		return (component: Component) => {
			if (showPanel === this.activePanel) return;

			this.activePanel = showPanel.appendTo(component)
				.on(ComponentEvent.WillRemove, panel => {
					panel.triggerSync(DebugToolsPanelEvent.SwitchAway);
					if (this.storePanels) {
						panel.store();
						return false;
					}

					return undefined;
				});

			this.activePanel.triggerSync(DebugToolsPanelEvent.SwitchTo);
		};
	}

}

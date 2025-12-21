import type Translation from "@wayward/game/language/Translation";
import Mod from "@wayward/game/mod/Mod";
import { Save, SaveLocation } from "@wayward/game/ui/IUi";
import type Bindable from "@wayward/game/ui/input/Bindable";
import type { DialogId, IDialogDescription } from "@wayward/game/ui/screen/screens/game/Dialogs";
import { Edge } from "@wayward/game/ui/screen/screens/game/Dialogs";
import type { SubpanelInformation } from "@wayward/game/ui/screen/screens/game/component/TabDialog";
import TabDialog from "@wayward/game/ui/screen/screens/game/component/TabDialog";
import { MenuBarButtonGroup, type MenuBarButtonType } from "@wayward/game/ui/screen/screens/game/static/menubar/IMenuBarButton";
import Vector2 from "@wayward/game/utilities/math/Vector2";
import { Tuple } from "@wayward/utilities/collection/Tuple";
import { OwnEventHandler } from "@wayward/utilities/event/EventManager";
import type { ModRegistrationMainDialogPanel } from "../IDebugTools";
import { DebugToolsTranslation, translation } from "../IDebugTools";
import DebugToolsPanel from "./component/DebugToolsPanel";
import DisplayPanel from "./panel/DisplayPanel";
import GeneralPanel from "./panel/GeneralPanel";
import HistoryPanel from "./panel/HistoryPanel";
import NPCPanel from "./panel/NPCPanel";
import PaintPanel from "./panel/PaintPanel";
import SelectionPanel from "./panel/SelectionPanel";
import TemperaturePanel from "./panel/TemperaturePanel";
import TemplatePanel from "./panel/TemplatePanel";
import ZonesPanel from "./panel/ZonesPanel";
import Task from "@wayward/utilities/promise/Task";
import CursePanel from "./panel/CursePanel";
import { IInput } from "@wayward/game/ui/input/IInput";
import type DebugToolsMod from "../DebugTools";

const DebugTools = Mod.get<DebugToolsMod>();

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
	NPCPanel,
	CursePanel,
	TemperaturePanel,
	HistoryPanel,
];

const modRegistryMainDialogPanels = Mod.register.interModRegistry<ModRegistrationMainDialogPanel>("MainDialogPanel");
export const bindableToggleDialog = Mod.register.bindable("ToggleDialog", IInput.key("Backslash"), IInput.key("IntlBackslash"));

const menuBarButton = Mod.register.menuBarButton("Dialog", {
	onActivate: () => DebugTools?.instance?.toggleDialog(),
	group: MenuBarButtonGroup.Meta,
	bindable: bindableToggleDialog.value,
	tooltip: tooltip => tooltip.schedule(tooltip => tooltip.getLastBlock().dump())
		.setText(translation(DebugToolsTranslation.DialogTitleMain)),
	onCreate: button => {
		const debugTools = DebugTools?.instance as DebugToolsMod | undefined;
		button.toggle(debugTools?.hasPermission());
		debugTools?.event.until(debugTools, "unload")
			.subscribe("playerDataChange", () => button.toggle(debugTools?.hasPermission()));
	},
});

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

	@Save(SaveLocation.Local)
	private current: string | number | undefined;

	public constructor(id: DialogId) {
		super(id);
		this.classes.add("debug-tools-dialog");

		if (!DebugTools?.instance?.hasPermission()) {
			void Task.yield().then(() => gameScreen?.dialogs.close(id));
		}
	}

	public override getName(): Translation {
		return translation(DebugToolsTranslation.DialogTitleMain);
	}

	public override getBindable(): Bindable {
		return bindableToggleDialog.value;
	}

	public override getIcon(): MenuBarButtonType {
		return menuBarButton.value;
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
		return subpanelClasses
			.concat(modRegistryMainDialogPanels.value.getRegistrations()
				.map(registration => registration.data(DebugToolsPanel)))
			.map(cls => new cls());
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

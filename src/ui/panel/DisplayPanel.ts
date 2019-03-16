import ActionExecutor from "entity/action/ActionExecutor";
import { RenderSource } from "game/IGame";
import { HookMethod } from "mod/IHookHost";
import { HookPriority } from "mod/IHookManager";
import Mod from "mod/Mod";
import Button, { ButtonEvent } from "newui/component/Button";
import { CheckButton, CheckButtonEvent } from "newui/component/CheckButton";
import { RangeInputEvent } from "newui/component/RangeInput";
import { RangeRow } from "newui/component/RangeRow";
import { compileShaders, loadShaders } from "renderer/Shaders";
import { Bound } from "utilities/Objects";
import UpdateStatsAndAttributes from "../../action/UpdateStatsAndAttributes";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, ISaveData, translation } from "../../IDebugTools";
import DebugToolsPanel, { DebugToolsPanelEvent } from "../component/DebugToolsPanel";

export default class DisplayPanel extends DebugToolsPanel {
	private readonly zoomRange: RangeRow;

	@Mod.instance<DebugTools>("Debug Tools")
	public readonly DEBUG_TOOLS: DebugTools;

	@Mod.saveData<DebugTools>("Debug Tools")
	public saveData: ISaveData;

	public constructor() {
		super();

		new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonToggleFog))
			.setRefreshMethod(() => this.DEBUG_TOOLS.getPlayerData(localPlayer, "fog"))
			.on(CheckButtonEvent.Change, this.toggleFog)
			.appendTo(this);

		new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonToggleLighting))
			.setRefreshMethod(() => this.DEBUG_TOOLS.getPlayerData(localPlayer, "lighting"))
			.on(CheckButtonEvent.Change, this.toggleLighting)
			.appendTo(this);

		this.zoomRange = new RangeRow()
			.classes.add("debug-tools-range-row-no-default-button")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelZoomLevel)))
			.editRange(range => range
				.setMin(0)
				.setMax(11)
				.setRefreshMethod(() => this.saveData.zoomLevel === undefined ? saveDataGlobal.options.zoomLevel + 3 : this.saveData.zoomLevel))
			.setDisplayValue(() => translation(DebugToolsTranslation.ZoomLevel)
				.get(this.DEBUG_TOOLS.getZoomLevel() || saveDataGlobal.options.zoomLevel))
			.on(RangeInputEvent.Change, (_, value: number) => {
				this.saveData.zoomLevel = value;
				game.updateZoomLevel();
			})
			.appendTo(this);

		new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonUnlockCamera))
			.setRefreshMethod(() => this.DEBUG_TOOLS.isCameraUnlocked)
			.on(CheckButtonEvent.Change, (_, checked: boolean) => this.DEBUG_TOOLS.setCameraUnlocked(checked))
			.appendTo(this);

		new Button()
			.classes.add("warning")
			.setText(translation(DebugToolsTranslation.ButtonResetWebGL))
			.on(ButtonEvent.Activate, this.resetWebGL)
			.appendTo(this);

		new Button()
			.classes.add("warning")
			.setText(translation(DebugToolsTranslation.ButtonReloadShaders))
			.on(ButtonEvent.Activate, this.reloadShaders)
			.appendTo(this);

		this.on(DebugToolsPanelEvent.SwitchTo, this.onSwitchTo);
		this.on(DebugToolsPanelEvent.SwitchAway, this.onSwitchAway);
	}

	public getTranslation() {
		return DebugToolsTranslation.PanelDisplay;
	}

	@HookMethod(HookPriority.High)
	public getZoomLevel(): number | undefined {
		if (this.zoomRange) {
			this.zoomRange.refresh();
		}

		return undefined;
	}

	@Bound
	private onSwitchTo() {
		hookManager.register(this, "DebugToolsDialog:DisplayPanel")
			.until(DebugToolsPanelEvent.SwitchAway);
	}

	@Bound
	private onSwitchAway() {

	}

	@Bound
	private toggleFog(_: any, fog: boolean) {
		this.DEBUG_TOOLS.setPlayerData(localPlayer, "fog", fog);
		this.DEBUG_TOOLS.updateFog();
	}

	@Bound
	private toggleLighting(_: any, lighting: boolean) {
		this.DEBUG_TOOLS.setPlayerData(localPlayer, "lighting", lighting);
		ActionExecutor.get(UpdateStatsAndAttributes).execute(localPlayer, localPlayer);
		game.updateView(RenderSource.Mod, true);
	}

	@Bound
	private resetWebGL() {
		game.resetWebGL();
	}

	@Bound
	private async reloadShaders() {
		await loadShaders();

		compileShaders();
		game.updateView(RenderSource.Mod, true);
	}
}

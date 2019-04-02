import ActionExecutor from "entity/action/ActionExecutor";
import { EventHandler } from "event/EventManager";
import { RenderSource } from "game/IGame";
import { HookMethod } from "mod/IHookHost";
import { HookPriority } from "mod/IHookManager";
import Mod from "mod/Mod";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import { RangeRow } from "newui/component/RangeRow";
import { compileShaders, loadShaders } from "renderer/Shaders";
import { Bound } from "utilities/Objects";

import UpdateStatsAndAttributes from "../../action/UpdateStatsAndAttributes";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, ISaveData, translation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";

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
			.event.subscribe("toggle", this.toggleFog)
			.appendTo(this);

		new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonToggleLighting))
			.setRefreshMethod(() => this.DEBUG_TOOLS.getPlayerData(localPlayer, "lighting"))
			.event.subscribe("toggle", this.toggleLighting)
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
			.event.subscribe("change", (_, value) => {
				this.saveData.zoomLevel = value;
				game.updateZoomLevel();
			})
			.appendTo(this);

		new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonUnlockCamera))
			.setRefreshMethod(() => this.DEBUG_TOOLS.isCameraUnlocked)
			.event.subscribe("toggle", (_, checked) => this.DEBUG_TOOLS.setCameraUnlocked(checked))
			.appendTo(this);

		new Button()
			.classes.add("warning")
			.setText(translation(DebugToolsTranslation.ButtonResetWebGL))
			.event.subscribe("activate", this.resetWebGL)
			.appendTo(this);

		new Button()
			.classes.add("warning")
			.setText(translation(DebugToolsTranslation.ButtonReloadShaders))
			.event.subscribe("activate", this.reloadShaders)
			.appendTo(this);
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

	@EventHandler<DisplayPanel>("self")("switchTo")
	protected onSwitchTo() {
		this.registerHookHost("DebugToolsDialog:DisplayPanel");
	}

	@EventHandler<DisplayPanel>("self")("switchAway")
	protected onSwitchAway() {

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

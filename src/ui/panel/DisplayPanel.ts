import { EventHandler, OwnEventHandler } from "event/EventManager";
import { RenderSource } from "game/IGame";
import Mod from "mod/Mod";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import { RangeRow } from "newui/component/RangeRow";
import { compileShaders, loadShaders } from "renderer/Shaders";
import WorldRenderer from "renderer/WorldRenderer";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, ISaveData, translation, ZOOM_LEVEL_MAX } from "../../IDebugTools";
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
			.setRefreshMethod(() => this.DEBUG_TOOLS.getPlayerData(localPlayer, "fog") !== false)
			.event.subscribe("toggle", this.toggleFog)
			.appendTo(this);

		new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonToggleLighting))
			.setRefreshMethod(() => this.DEBUG_TOOLS.getPlayerData(localPlayer, "lighting") !== false)
			.event.subscribe("toggle", this.toggleLighting)
			.appendTo(this);

		this.zoomRange = new RangeRow()
			.classes.add("debug-tools-range-row-no-default-button")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelZoomLevel)))
			.editRange(range => range
				.setMin(0)
				.setMax(ZOOM_LEVEL_MAX + 3)
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

	@Override public getTranslation() {
		return DebugToolsTranslation.PanelDisplay;
	}

	@Bound
	public toggleFog(_: any, fog: boolean) {
		this.DEBUG_TOOLS.toggleFog(fog);
	}

	@Bound
	public toggleLighting(_: any, lighting: boolean) {
		this.DEBUG_TOOLS.toggleLighting(lighting);
	}

	@OwnEventHandler(DisplayPanel, "switchTo")
	protected onSwitchTo() {
		this.registerEventBusSubscriber("switchAway");
		this.zoomRange?.refresh();
	}

	@EventHandler(WorldRenderer, "updateZoom")
	protected onUpdateZoom() {
		this.zoomRange?.refresh();
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

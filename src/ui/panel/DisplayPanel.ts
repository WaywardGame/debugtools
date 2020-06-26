import { EventHandler, OwnEventHandler } from "event/EventManager";
import { RenderSource } from "game/IGame";
import Mod from "mod/Mod";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Divider from "newui/component/Divider";
import { RangeRow } from "newui/component/RangeRow";
import { Heading } from "newui/component/Text";
import ImagePath from "newui/util/ImagePath";
import { RenderLayerFlag } from "renderer/IWorldRenderer";
import { compileShaders, loadShaders } from "renderer/Shaders";
import WorldLayerRenderer from "renderer/WorldLayerRenderer";
import WorldRenderer from "renderer/WorldRenderer";
import Enums from "utilities/enum/Enums";
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

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonReloadUIImages))
			.event.subscribe("activate", ImagePath.cachebust)
			.appendTo(this);

		new Divider()
			.appendTo(this);

		new Heading()
			.setText(translation(DebugToolsTranslation.HeadingLayers))
			.appendTo(this);

		Enums.values(RenderLayerFlag)
			.filter(flag => flag !== RenderLayerFlag.None && flag !== RenderLayerFlag.All)
			.map(layerFlag => new CheckButton()
				.setText(translation(DebugToolsTranslation.ButtonToggleLayer)
					.addArgs(RenderLayerFlag[layerFlag]))
				.setRefreshMethod(() => this.saveData.renderLayerFlags !== undefined ? !!(this.saveData.renderLayerFlags & layerFlag) : true)
				.event.subscribe("toggle", (_, checked) => {
					this.updateRenderLayerFlag(layerFlag, checked);
				}))
			.splat(this.append);
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

	@Bound
	private updateRenderLayerFlag(flag: RenderLayerFlag, checked: boolean) {
		if (this.saveData.renderLayerFlags === undefined) {
			this.saveData.renderLayerFlags = RenderLayerFlag.All;
		}

		if (checked) {
			this.saveData.renderLayerFlags |= flag;

		} else {
			this.saveData.renderLayerFlags &= ~flag;
		}

		game.updateView(RenderSource.Mod);
	}

	@EventHandler(WorldLayerRenderer, "getRenderFlags")
	protected getRenderFlags(): RenderLayerFlag {
		return this.saveData.renderLayerFlags ?? RenderLayerFlag.All;
	}

}

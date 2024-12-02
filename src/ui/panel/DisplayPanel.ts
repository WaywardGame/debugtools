import { EventHandler } from "@wayward/game/event/EventManager";
import Translation from "@wayward/game/language/Translation";
import UiTranslation from "@wayward/game/language/dictionary/UiTranslation";
import Mod from "@wayward/game/mod/Mod";
import { RenderSource, ZOOM_LEVEL_MAX } from "@wayward/game/renderer/IRenderer";
import { loadWebGlShaders } from "@wayward/game/renderer/platform/webgl/WebGlShaders";
import { RenderLayerFlag } from "@wayward/game/renderer/world/IWorldRenderer";
import { WorldLayerRenderer } from "@wayward/game/renderer/world/WorldLayerRenderer";
import { WorldRenderer } from "@wayward/game/renderer/world/WorldRenderer";
import Button, { ButtonType } from "@wayward/game/ui/component/Button";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import Divider from "@wayward/game/ui/component/Divider";
import { RangeRow } from "@wayward/game/ui/component/RangeRow";
import { Heading } from "@wayward/game/ui/component/Text";
import Enums from "@wayward/game/utilities/enum/Enums";
import { Bound } from "@wayward/utilities/Decorators";
import { OwnEventHandler } from "@wayward/utilities/event/EventManager";
import { sleep } from "@wayward/utilities/promise/Async";
import type DebugTools from "../../DebugTools";
import type { ISaveData } from "../../IDebugTools";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
// import Component from "@wayward/game/ui/component/Component";
// import Renderer from "@wayward/game/renderer/Renderer";

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
				.setRefreshMethod(() => saveDataGlobal.options.zoomLevel))
			.setDisplayValue(() => translation(DebugToolsTranslation.ZoomLevel)
				.get(saveDataGlobal.options.zoomLevel))
			.event.subscribe("change", (_, value) => {
				saveDataGlobal.options.zoomLevel = value;
				renderer?.updateZoomLevel();
			})
			.appendTo(this);

		new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonUnlockCamera))
			.setRefreshMethod(() => this.DEBUG_TOOLS.isCameraUnlocked)
			.event.subscribe("toggle", (_, checked) => this.DEBUG_TOOLS.setCameraUnlocked(checked))
			.appendTo(this);

		new Button()
			.setType(ButtonType.Warning)
			.setText(translation(DebugToolsTranslation.ButtonResetRenderer))
			.event.subscribe("activate", this.resetRenderer)
			.appendTo(this);

		new Button()
			.setType(ButtonType.Warning)
			.setText(translation(DebugToolsTranslation.ButtonLoseWebGlContext))
			.event.subscribe("activate", this.loseWebGlContext)
			.appendTo(this);

		new Button()
			.setType(ButtonType.Warning)
			.setText(translation(DebugToolsTranslation.ButtonRefreshTiles))
			.event.subscribe("activate", this.refreshTiles)
			.appendTo(this);

		new Button()
			.setType(ButtonType.Warning)
			.setText(translation(DebugToolsTranslation.ButtonReloadShaders))
			.event.subscribe("activate", this.reloadShaders)
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonReloadTextures))
			.event.subscribe("activate", ui.reloadTextures)
			.appendTo(this);

		new RangeRow()
			.setLabel(label => label.setText(UiTranslation.MenuOptionsLabelInterfaceScale))
			.editRange(range => range
				.noClampOnRefresh()
				.setMin(ui.scale.getMinimum(), false)
				.setMax(ui.scale.getMaximum(), false)
				.setStep(0.25)
				.setRefreshMethod(() => ui.scale.getClamped()))
			.addDefaultButton(() => ui.scale.getClamped(1))
			.setDisplayValue(value => Translation.merge(ui.scale.getClamped(value)))
			.event.subscribe("finish", async (_, scale) => {
				ui.scale.setUserSetting(scale);
				await sleep(10);
			})
			.appendTo(this);

		new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonHideExtraneousUI))
			.setRefreshMethod(() => this.saveData.hideExtraneousUI ?? false)
			.event.subscribe("toggle", (_, checked) => this.DEBUG_TOOLS.toggleExtraneousUI(checked))
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

	public override getTranslation(): DebugToolsTranslation {
		return DebugToolsTranslation.PanelDisplay;
	}

	@Bound
	public toggleFog(_: any, fog: boolean): void {
		this.DEBUG_TOOLS.toggleFog(fog);
	}

	@Bound
	public toggleLighting(_: any, lighting: boolean): void {
		this.DEBUG_TOOLS.toggleLighting(lighting);
	}

	@OwnEventHandler(DisplayPanel, "switchTo")
	protected onSwitchTo(): void {
		this.zoomRange?.refresh();
	}

	@EventHandler(WorldRenderer, "updateZoom")
	protected onUpdateZoom(): void {
		this.zoomRange?.refresh();
	}

	@Bound
	private resetRenderer(): void {
		void game.initializeRenderer();
	}

	@Bound
	private loseWebGlContext(): void {
		game.loseWebGlContext();
	}

	@Bound
	private refreshTiles(): void {
		renderer?.worldRenderer.updateAllTiles();
	}

	@Bound
	private async reloadShaders(): Promise<void> {
		await loadWebGlShaders();

		await game.webGlContext?.recompilePrograms();

		localPlayer.updateView(RenderSource.Mod, true);
	}

	@Bound
	private updateRenderLayerFlag(flag: RenderLayerFlag, checked: boolean): void {
		if (this.saveData.renderLayerFlags === undefined) {
			this.saveData.renderLayerFlags = RenderLayerFlag.All;
		}

		if (checked) {
			this.saveData.renderLayerFlags |= flag;

		} else {
			this.saveData.renderLayerFlags &= ~flag;
		}

		localPlayer.updateView(RenderSource.Mod);
	}

	@EventHandler(WorldLayerRenderer, "getRenderFlags")
	protected getRenderFlags(): RenderLayerFlag {
		return this.saveData.renderLayerFlags ?? RenderLayerFlag.All;
	}
}

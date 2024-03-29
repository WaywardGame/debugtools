/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { EventHandler, OwnEventHandler } from "event/EventManager";
import Translation from "language/Translation";
import UiTranslation from "language/dictionary/UiTranslation";
import Mod from "mod/Mod";
import { RenderSource, ZOOM_LEVEL_MAX } from "renderer/IRenderer";
import { Shaders } from "renderer/Shaders";
import { RenderLayerFlag } from "renderer/world/IWorldRenderer";
import WorldLayerRenderer from "renderer/world/WorldLayerRenderer";
import WorldRenderer from "renderer/world/WorldRenderer";
import Button, { ButtonType } from "ui/component/Button";
import { CheckButton } from "ui/component/CheckButton";
import Divider from "ui/component/Divider";
import { RangeRow } from "ui/component/RangeRow";
import { Heading } from "ui/component/Text";
import ImagePath from "ui/util/ImagePath";
import { Bound } from "utilities/Decorators";
import Enums from "utilities/enum/Enums";
import { sleep } from "utilities/promise/Async";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, ISaveData, translation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";
// import Component from "ui/component/Component";
// import Renderer from "renderer/Renderer";

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
			.event.subscribe("activate", this.resetWebGL)
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
			.setText(translation(DebugToolsTranslation.ButtonReloadUIImages))
			.event.subscribe("activate", ImagePath.cachebust)
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

	public override getTranslation() {
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
	private refreshTiles() {
		renderer?.worldRenderer.updateAllTiles();
	}

	@Bound
	private async reloadShaders() {
		await Shaders.load();

		await game.webGlContext?.recompilePrograms();

		localPlayer.updateView(RenderSource.Mod, true);
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

		localPlayer.updateView(RenderSource.Mod);
	}

	@EventHandler(WorldLayerRenderer, "getRenderFlags")
	protected getRenderFlags(): RenderLayerFlag {
		return this.saveData.renderLayerFlags ?? RenderLayerFlag.All;
	}

}

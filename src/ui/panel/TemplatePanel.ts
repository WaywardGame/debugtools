import { Bindable } from "Enums";
import Translation from "language/Translation";
import { ITemplateOptions, manipulateTemplates } from "mapgen/MapGenHelpers";
import { HookMethod } from "mod/IHookHost";
import { BindCatcherApi } from "newui/BindingManager";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Dropdown, { DropdownEvent } from "newui/component/Dropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeRow } from "newui/component/RangeRow";
import Text from "newui/component/Text";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import Spacer from "newui/screen/screens/menu/component/Spacer";
import { TileTemplateType } from "tile/ITerrain";
import templateDescriptions from "tile/TerrainTemplates";
import { tuple } from "utilities/Arrays";
import Collectors from "utilities/Collectors";
import Enums from "utilities/enum/Enums";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import Objects, { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import DebugTools, { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import SelectionOverlay from "../../overlay/SelectionOverlay";
import { getTileId, getTilePosition } from "../../util/TilePosition";
import DebugToolsPanel, { DebugToolsPanelEvent } from "../component/DebugToolsPanel";

export default class TemplatePanel extends DebugToolsPanel {
	private readonly dropdownType: Dropdown<TileTemplateType>;
	private readonly dropdownTemplate: Dropdown<string>;
	private readonly mirrorVertically: CheckButton;
	private readonly mirrorHorizontally: CheckButton;
	private readonly rotate: RangeRow;
	private readonly degrade: RangeRow;
	private readonly place: CheckButton;

	private readonly previewTiles: number[] = [];
	private selectHeld = false;

	public constructor(gsapi: IGameScreenApi) {
		super(gsapi);

		new LabelledRow(this.api)
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelTemplateType)))
			.append(this.dropdownType = new Dropdown<TileTemplateType>(this.api)
				.setRefreshMethod(() => ({
					defaultOption: TileTemplateType.House,
					options: Enums.values(TileTemplateType)
						.map(type => tuple(type, Translation.generator(TileTemplateType[type])))
						.collect(Collectors.toArray)
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.values()
						.map(([id, t]) => tuple(id, (option: Button) => option.setText(t))),
				}))
				.on(DropdownEvent.Selection, this.changeTemplateType))
			.appendTo(this);

		new LabelledRow(this.api)
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelTemplate)))
			.append(this.dropdownTemplate = new Dropdown<string>(this.api)
				.setRefreshMethod(() => ({
					defaultOption: Objects.keys<string>(templateDescriptions[this.dropdownType.selection]).first()!,
					options: Objects.keys<string>(templateDescriptions[this.dropdownType.selection])
						.map(name => tuple(name, Translation.generator(name)))
						.collect(Collectors.toArray)
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.values()
						.map(([id, t]) => tuple(id, (option: Button) => option.setText(t))),
				})))
			.appendTo(this);

		this.mirrorVertically = new CheckButton(this.api)
			.setText(translation(DebugToolsTranslation.ButtonMirrorVertically))
			.appendTo(this);

		this.mirrorHorizontally = new CheckButton(this.api)
			.setText(translation(DebugToolsTranslation.ButtonMirrorHorizontally))
			.appendTo(this);

		this.rotate = new RangeRow(this.api)
			.classes.add("no-button")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelRotate)))
			.editRange(range => range
				.setMax(270)
				.setStep(90))
			.setDisplayValue(translation(DebugToolsTranslation.RangeRotateDegrees).get)
			.appendTo(this);

		this.degrade = new RangeRow(this.api)
			.classes.add("no-button")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelDegrade)))
			.editRange(range => range
				.setMax(100))
			.setDisplayValue(translation(DebugToolsTranslation.RangeDegradeAmount).get)
			.appendTo(this);

		new Spacer(this.api).appendTo(this);

		this.place = new CheckButton(this.api)
			.setText(translation(DebugToolsTranslation.ButtonPlace))
			.appendTo(this);

		this.on(DebugToolsPanelEvent.SwitchTo, this.onSwitchTo);
		this.on(DebugToolsPanelEvent.SwitchAway, this.onSwitchAway);
	}

	public getTranslation() {
		return DebugToolsTranslation.PanelTemplates;
	}

	@HookMethod
	public canClientMove(api: BindCatcherApi) {
		if (this.place.checked || this.selectHeld) return false;

		return undefined;
	}

	// tslint:disable cyclomatic-complexity
	@HookMethod
	public onBindLoop(bindPressed: Bindable, api: BindCatcherApi) {
		const wasPlacePressed = api.wasPressed(DebugTools.INSTANCE.selector.bindableSelectLocation) && this.gsapi.isMouseWithin();
		const wasCancelPressed = api.wasPressed(DebugTools.INSTANCE.selector.bindableCancelSelectLocation) && this.gsapi.isMouseWithin();

		if (this.previewTiles.length) {
			for (const previewTile of this.previewTiles) {
				const tile = getTilePosition(previewTile);
				SelectionOverlay.remove(new Vector3(tile));
			}

			this.previewTiles.splice(0, Infinity);

			if (!this.place.checked) game.updateView(false);
		}

		if (this.place.checked) {
			const template = this.getTemplate();
			if (template) {
				const [terrain] = template;

				const center = renderer.screenToTile(api.mouseX, api.mouseY);
				const width = terrain[0].length;
				const height = terrain.length;

				const topLeft = new Vector2(center)
					.subtract({ x: Math.floor(width / 2), y: Math.floor(height / 2) });

				if (wasPlacePressed) {
					this.placeTemplate(topLeft);
					this.selectHeld = true;
					bindPressed = DebugTools.INSTANCE.selector.bindableSelectLocation;

				} else if (wasCancelPressed) {
					this.place.setChecked(false);
					bindPressed = DebugTools.INSTANCE.selector.bindableCancelSelectLocation;

				} else {
					for (let x = 0; x < width; x++) {
						for (let y = 0; y < height; y++) {
							if (!this.templateHasTile(template, x, y)) continue;

							const position = new Vector2(topLeft).add({ x, y }).mod(game.mapSize);
							SelectionOverlay.add(position);
							this.previewTiles.push(getTileId(position.x, position.y, localPlayer.z));
						}
					}
				}

				game.updateView(false);
			}
		}

		if (api.wasReleased(DebugTools.INSTANCE.selector.bindableSelectLocation) && this.selectHeld) {
			this.selectHeld = false;
		}

		return bindPressed;
	}
	// tslint:enable cyclomatic-complexity

	private getTemplate() {
		const template = templateDescriptions[this.dropdownType.selection][this.dropdownTemplate.selection];
		if (!template) return undefined;

		return manipulateTemplates(this.getTemplateOptions(), [...template.terrain], template.doodad && [...template.doodad]);
	}

	private templateHasTile(templates: [string[], string[]?], x: number, y: number) {
		return templates[0][y][x] !== " " || (templates[1] && templates[1]![y][x] !== " ");
	}

	private getTemplateOptions(): ITemplateOptions {
		return {
			mirrorHorizontally: this.mirrorHorizontally.checked,
			mirrorVertically: this.mirrorVertically.checked,
			rotate: this.rotate.value as 0 | 90 | 180 | 270,
			degrade: this.degrade.value / 100,
			which: this.dropdownTemplate.selection,
		};
	}

	@Bound
	private onSwitchTo() {
		hookManager.register(this, "DebugToolsDialog:TemplatePanel")
			.until(DebugToolsPanelEvent.SwitchAway);
	}

	@Bound
	private onSwitchAway() {

	}

	@Bound
	private changeTemplateType() {
		this.dropdownTemplate.refresh();
	}

	private placeTemplate(topLeft: Vector2) {
		this.place.setChecked(false);
		Actions.get("placeTemplate").execute({ point: topLeft.raw(), object: [this.dropdownType.selection, this.getTemplateOptions()] });
	}
}

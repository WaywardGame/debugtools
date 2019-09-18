import ActionExecutor from "entity/action/ActionExecutor";
import { EventHandler } from "event/EventManager";
import { RenderSource } from "game/IGame";
import Translation from "language/Translation";
import { ITemplateOptions, manipulateTemplates } from "mapgen/MapGenHelpers";
import { HookMethod } from "mod/IHookHost";
import Mod from "mod/Mod";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Dropdown from "newui/component/Dropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeRow } from "newui/component/RangeRow";
import Text from "newui/component/Text";
import { Bindable, BindCatcherApi } from "newui/IBindingManager";
import MovementHandler from "newui/screen/screens/game/util/movement/MovementHandler";
import { gameScreen } from "newui/screen/screens/GameScreen";
import Spacer from "newui/screen/screens/menu/component/Spacer";
import { TileTemplateType } from "tile/ITerrain";
import templateDescriptions from "tile/TerrainTemplates";
import { Tuple } from "utilities/Arrays";
import Enums from "utilities/enum/Enums";
import Vector2 from "utilities/math/Vector2";
import Vector3 from "utilities/math/Vector3";
import PlaceTemplate from "../../action/PlaceTemplate";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import SelectionOverlay from "../../overlay/SelectionOverlay";
import { getTileId, getTilePosition } from "../../util/TilePosition";
import DebugToolsPanel from "../component/DebugToolsPanel";

export default class TemplatePanel extends DebugToolsPanel {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;

	private readonly dropdownType: Dropdown<TileTemplateType>;
	private readonly dropdownTemplate: Dropdown<string>;
	private readonly mirrorVertically: CheckButton;
	private readonly mirrorHorizontally: CheckButton;
	private readonly rotate: RangeRow;
	private readonly degrade: RangeRow;
	private readonly place: CheckButton;

	private readonly previewTiles: number[] = [];
	private selectHeld = false;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelTemplateType)))
			.append(this.dropdownType = new Dropdown<TileTemplateType>()
				.setRefreshMethod(() => ({
					defaultOption: TileTemplateType.House,
					options: Enums.values(TileTemplateType)
						.map(type => Tuple(type, Translation.generator(TileTemplateType[type])))
						.sorted(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.map(([id, t]) => Tuple(id, (option: Button) => option.setText(t))),
				}))
				.event.subscribe("selection", this.changeTemplateType))
			.appendTo(this);

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelTemplate)))
			.append(this.dropdownTemplate = new Dropdown<string>()
				.setRefreshMethod(() => ({
					defaultOption: Stream.keys<string>(templateDescriptions[this.dropdownType.selection]).first()!,
					options: Stream.keys<string>(templateDescriptions[this.dropdownType.selection])
						.map(name => Tuple(name, Translation.generator(name)))
						.sorted(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.map(([id, t]) => Tuple(id, (option: Button) => option.setText(t))),
				})))
			.appendTo(this);

		this.mirrorVertically = new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonMirrorVertically))
			.appendTo(this);

		this.mirrorHorizontally = new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonMirrorHorizontally))
			.appendTo(this);

		this.rotate = new RangeRow()
			.classes.add("no-button")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelRotate)))
			.editRange(range => range
				.setMax(270)
				.setStep(90))
			.setDisplayValue(translation(DebugToolsTranslation.RangeRotateDegrees).get)
			.appendTo(this);

		this.degrade = new RangeRow()
			.classes.add("no-button")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelDegrade)))
			.editRange(range => range
				.setMax(100))
			.setDisplayValue(translation(DebugToolsTranslation.RangeDegradeAmount).get)
			.appendTo(this);

		new Spacer().appendTo(this);

		this.place = new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonPlace))
			.appendTo(this);
	}

	@Override public getTranslation() {
		return DebugToolsTranslation.PanelTemplates;
	}

	@EventHandler(MovementHandler)("canMove")
	public canClientMove() {
		if (this.place.checked || this.selectHeld) return false;

		return undefined;
	}

	// tslint:disable cyclomatic-complexity
	@Override @HookMethod
	public onBindLoop(bindPressed: Bindable, api: BindCatcherApi) {
		const wasPlacePressed = api.wasPressed(this.DEBUG_TOOLS.selector.bindableSelectLocation) && gameScreen!.isMouseWithin();
		const wasCancelPressed = api.wasPressed(this.DEBUG_TOOLS.selector.bindableCancelSelectLocation) && gameScreen!.isMouseWithin();

		this.clearPreview();

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
					bindPressed = this.DEBUG_TOOLS.selector.bindableSelectLocation;

				} else if (wasCancelPressed) {
					this.place.setChecked(false);
					bindPressed = this.DEBUG_TOOLS.selector.bindableCancelSelectLocation;

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

				game.updateView(RenderSource.Mod, false);
			}
		}

		if (api.wasReleased(this.DEBUG_TOOLS.selector.bindableSelectLocation) && this.selectHeld) {
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
		return templates[0][y][x] !== " " || (templates[1] && templates[1][y][x] !== " ");
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

	@EventHandler<TemplatePanel>("self")("switchTo")
	protected onSwitchTo() {
		this.registerHookHost("DebugToolsDialog:TemplatePanel");
	}

	@EventHandler<TemplatePanel>("self")("switchAway")
	protected onSwitchAway() {
		hookManager.deregister(this);
		this.place.setChecked(false);
		this.clearPreview();
	}

	@Bound
	private changeTemplateType() {
		this.dropdownTemplate.refresh();
	}

	private placeTemplate(topLeft: Vector2) {
		this.place.setChecked(false);
		ActionExecutor.get(PlaceTemplate).execute(localPlayer, this.dropdownType.selection, topLeft.raw(), this.getTemplateOptions());
	}

	private clearPreview() {
		if (!this.previewTiles.length) return;

		for (const previewTile of this.previewTiles) {
			const tile = getTilePosition(previewTile);
			SelectionOverlay.remove(new Vector3(tile));
		}

		this.previewTiles.splice(0, Infinity);

		if (!this.place.checked) game.updateView(RenderSource.Mod, false);
	}
}

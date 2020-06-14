import ActionExecutor from "entity/action/ActionExecutor";
import { Priority } from "event/EventEmitter";
import { EventHandler, OwnEventHandler } from "event/EventManager";
import { RenderSource } from "game/IGame";
import Translation from "language/Translation";
import { ITemplateOptions, manipulateTemplates } from "mapgen/MapGenHelpers";
import Mod from "mod/Mod";
import { Registry } from "mod/ModRegistry";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Dropdown from "newui/component/Dropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeRow } from "newui/component/RangeRow";
import Text from "newui/component/Text";
import Bind from "newui/input/Bind";
import InputManager from "newui/input/InputManager";
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
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";
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
	private center?: Vector2;
	private templateOptions?: ITemplateOptions;

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
			.event.subscribe("toggle", this.tick)
			.appendTo(this);
	}

	@Override public getTranslation() {
		return DebugToolsTranslation.PanelTemplates;
	}

	////////////////////////////////////
	// Event Handlers
	//

	@EventHandler(MovementHandler, "canMove")
	protected canClientMove() {
		if (this.place.checked || this.selectHeld)
			return false;

		return undefined;
	}

	@Bind.onUp(Registry<DebugTools>(DEBUG_TOOLS_ID).registry("selector").get("bindableSelectLocation"), Priority.High + 1)
	protected onStopSelectLocation() {
		this.selectHeld = false;
		return false;
	}

	////////////////////////////////////
	// Internals
	//

	@Bound private tick() {
		let updateRender = false;

		const isMouseWithin = gameScreen?.isMouseWithin();
		if (!this.place.checked || !isMouseWithin)
			updateRender = this.clearPreview();

		if (this.place.checked) {
			setTimeout(this.tick, game.interval);

			if (isMouseWithin) {
				const options = this.getTemplateOptions();
				const template = this.getTemplate(options);
				if (template)
					updateRender = this.updateTemplate(template, options);
			}
		}

		if (updateRender)
			game.updateView(RenderSource.Mod, false);
	}

	private updateTemplate([terrain, doodads]: [string[], string[]?], options: ITemplateOptions) {
		const center = renderer.screenToVector(...InputManager.mouse.position.xy);

		const width = terrain[0].length;
		const height = terrain.length;

		const topLeft = new Vector2(center)
			.subtract({ x: Math.floor(width / 2), y: Math.floor(height / 2) });

		if (InputManager.input.isHolding(this.DEBUG_TOOLS.selector.bindableSelectLocation)) {
			this.placeTemplate(topLeft);
			this.selectHeld = true;
			this.clearPreview();
			return true;
		}

		if (InputManager.input.isHolding(this.DEBUG_TOOLS.selector.bindableCancelSelectLocation)) {
			this.place.setChecked(false);
			this.clearPreview();
			return true;
		}

		if (center.equals(this.center) && !this.templateOptionsChanged(options))
			return false;

		this.center = center;
		this.templateOptions = options;

		this.clearPreview();

		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				if (!this.templateHasTile([terrain, doodads], x, y))
					continue;

				const position = new Vector2(topLeft).add({ x, y }).mod(game.mapSize);
				SelectionOverlay.add(position);
				this.previewTiles.push(getTileId(position.x, position.y, localPlayer.z));
			}
		}

		return true;
	}

	private getTemplate(options: ITemplateOptions) {
		const template = templateDescriptions[this.dropdownType.selection][this.dropdownTemplate.selection];
		if (!template)
			return undefined;

		return manipulateTemplates(options, [...template.terrain], template.doodad && [...template.doodad]);
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

	private templateOptionsChanged(options: ITemplateOptions) {
		return !this.templateOptions
			|| this.templateOptions.which !== options.which
			|| this.templateOptions.mirrorHorizontally !== options.mirrorHorizontally
			|| this.templateOptions.mirrorHorizontally !== options.mirrorVertically
			|| this.templateOptions.rotate !== options.rotate;
	}

	@OwnEventHandler(TemplatePanel, "switchTo")
	protected onSwitchTo() {
		Bind.registerHandlers(this);
	}

	@OwnEventHandler(TemplatePanel, "switchAway")
	protected onSwitchAway() {
		Bind.deregisterHandlers(this);
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
		if (!this.previewTiles.length)
			return false;

		for (const previewTile of this.previewTiles) {
			const tile = getTilePosition(previewTile);
			SelectionOverlay.remove(new Vector3(tile));
		}

		this.previewTiles.splice(0, Infinity);

		if (!this.place.checked)
			game.updateView(RenderSource.Mod, false);

		return true;
	}
}

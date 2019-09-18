import { SfxType } from "audio/IAudio";
import ActionExecutor from "entity/action/ActionExecutor";
import { ActionType } from "entity/action/IAction";
import { EventHandler } from "event/EventManager";
import InterruptChoice from "language/dictionary/InterruptChoice";
import Translation from "language/Translation";
import { HookMethod } from "mod/IHookHost";
import { HookPriority } from "mod/IHookManager";
import Mod from "mod/Mod";
import { BlockRow } from "newui/component/BlockRow";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Dropdown from "newui/component/Dropdown";
import { RangeRow } from "newui/component/RangeRow";
import Text from "newui/component/Text";
import { Bindable, BindCatcherApi } from "newui/IBindingManager";
import newui from "newui/NewUi";
import MovementHandler from "newui/screen/screens/game/util/movement/MovementHandler";
import { ParticleType } from "renderer/particle/IParticle";
import { particles } from "renderer/particle/Particles";
import { Tuple } from "utilities/Arrays";
import Enums from "utilities/enum/Enums";
import Vector2 from "utilities/math/Vector2";
import SetTime from "../../action/SetTime";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import CancelablePromise from "../../util/CancelablePromise";
import DebugToolsPanel from "../component/DebugToolsPanel";

export default class GeneralPanel extends DebugToolsPanel {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;

	private readonly timeRange: RangeRow;
	private readonly inspectButton: CheckButton;
	private readonly checkButtonAudio: CheckButton;
	private readonly dropdownAudio: Dropdown<SfxType>;
	private readonly dropdownParticle: Dropdown<ParticleType>;
	private readonly checkButtonParticle: CheckButton;

	private selectionPromise: CancelablePromise<Vector2> | undefined;

	public constructor() {
		super();

		this.timeRange = new RangeRow()
			.classes.add("debug-tools-range-row-no-default-button")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelTime)))
			.editRange(range => range
				.setStep(0.001)
				.setMin(0)
				.setMax(1)
				.setRefreshMethod(() => game.time.getTime()))
			.setDisplayValue(time => game.time.getTranslation(time))
			.event.subscribe("change", (_, time) => {
				ActionExecutor.get(SetTime).execute(localPlayer, time);
			})
			.appendTo(this);

		this.inspectButton = new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonInspect))
			.setRefreshMethod(() => !!this.selectionPromise)
			.event.subscribe("willToggle", (_, checked) => {
				if (!!this.selectionPromise !== checked) {
					if (checked && this.DEBUG_TOOLS.selector.selecting) return false;

					if (!checked) {
						if (this.selectionPromise && !this.selectionPromise.isResolved) {
							this.selectionPromise.cancel();
						}

						delete this.selectionPromise;

					} else {
						this.selectionPromise = this.DEBUG_TOOLS.selector.select();
						this.selectionPromise.then(this.inspectTile);
					}
				}

				return true;
			})
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonInspectLocalPlayer))
			.event.subscribe("activate", () => this.DEBUG_TOOLS.inspect(localPlayer))
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonTravelAway))
			.event.subscribe("activate", this.travelAway)
			.appendTo(this);

		new BlockRow()
			.classes.add("debug-tools-dialog-checkbutton-dropdown-row")
			.append(this.checkButtonAudio = new CheckButton()
				.setText(translation(DebugToolsTranslation.ButtonAudio)))
			.append(this.dropdownAudio = new Dropdown<SfxType>()
				.setRefreshMethod(() => ({
					defaultOption: SfxType.Click,
					options: Enums.values(SfxType)
						.map(sfx => Tuple(sfx, Translation.generator(SfxType[sfx])))
						.sorted(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.map(([id, t]) => Tuple(id, (option: Button) => option.setText(t))),
				})))
			.appendTo(this);

		new BlockRow()
			.classes.add("debug-tools-dialog-checkbutton-dropdown-row")
			.append(this.checkButtonParticle = new CheckButton()
				.setText(translation(DebugToolsTranslation.ButtonParticle)))
			.append(this.dropdownParticle = new Dropdown<ParticleType>()
				.setRefreshMethod(() => ({
					defaultOption: ParticleType.Blood,
					options: Enums.values(ParticleType)
						.map(particle => Tuple(particle, Translation.generator(ParticleType[particle])))
						.sorted(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.map(([id, t]) => Tuple(id, (option: Button) => option.setText(t))),
				})))
			.appendTo(this);
	}

	@Override public getTranslation() {
		return DebugToolsTranslation.PanelGeneral;
	}

	@EventHandler(MovementHandler)("canMove")
	public canClientMove(): false | undefined {
		if (this.selectionPromise || this.checkButtonAudio.checked || this.checkButtonParticle.checked) return false;

		return undefined;
	}

	@HookMethod
	public onGameTickEnd() {
		if (this.timeRange) {
			this.timeRange.refresh();
		}
	}

	@Override @HookMethod(HookPriority.High)
	public onBindLoop(bindPressed: Bindable, api: BindCatcherApi) {
		if (api.wasPressed(this.DEBUG_TOOLS.selector.bindableSelectLocation) && !bindPressed) {
			if (this.checkButtonAudio.checked) {
				const position = renderer.screenToTile(api.mouseX, api.mouseY);
				audio.queueEffect(this.dropdownAudio.selection, position.x, position.y, localPlayer.z);
				bindPressed = this.DEBUG_TOOLS.selector.bindableSelectLocation;
			}

			if (this.checkButtonParticle.checked) {
				const position = renderer.screenToTile(api.mouseX, api.mouseY);
				game.particle.create(position.x, position.y, localPlayer.z, particles[this.dropdownParticle.selection]);
				bindPressed = this.DEBUG_TOOLS.selector.bindableSelectLocation;
			}
		}

		return bindPressed;
	}

	@EventHandler<GeneralPanel>("self")("switchTo")
	protected onSwitchTo() {
		this.timeRange.refresh();

		this.registerHookHost("DebugToolsDialog:GeneralPanel");

		this.DEBUG_TOOLS.event.until(this, "switchAway")
			.subscribe("inspect", () => {
				if (this.selectionPromise) this.selectionPromise.cancel();
			});
	}

	@EventHandler<GeneralPanel>("self")("switchAway")
	protected onSwitchAway() {
		hookManager.deregister(this);
		if (this.selectionPromise) {
			this.selectionPromise.cancel();
			delete this.selectionPromise;
		}
	}

	@Bound
	private inspectTile(tilePosition?: Vector2) {
		delete this.selectionPromise;
		this.inspectButton.refresh();

		if (!tilePosition) return;

		this.DEBUG_TOOLS.inspect(tilePosition);
	}

	/**
	 * Travels Away
	 * 
	 * Note: Since "traveling away" isn't possible on multiplayer, this doesn't need to be an action.
	 */
	@Bound
	private async travelAway() {
		if (multiplayer.isConnected() && !game.isChallenge) return;

		let action: ActionType;
		if (!game.isChallenge) {
			const choice = await newui.interrupt(this.DEBUG_TOOLS.interruptTravelAway)
				.withChoice(InterruptChoice.Cancel, this.DEBUG_TOOLS.choiceTravelAway, this.DEBUG_TOOLS.choiceSailToCivilization);

			if (choice === InterruptChoice.Cancel) return;
			action = choice === this.DEBUG_TOOLS.choiceSailToCivilization ? ActionType.SailToCivilization : ActionType.TraverseTheSea;

		} else {
			action = ActionType.SailToCivilization;
		}

		const anyExecutor = (ActionExecutor as any).get(action);
		anyExecutor.execute(localPlayer, undefined, true, true, true);
	}
}

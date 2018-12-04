import ActionExecutor from "action/ActionExecutor";
import { ActionType } from "action/IAction";
import { Bindable, SfxType } from "Enums";
import InterruptChoice from "language/dictionary/InterruptChoice";
import Translation from "language/Translation";
import { HookMethod } from "mod/IHookHost";
import { HookPriority } from "mod/IHookManager";
import Mod from "mod/Mod";
import { BindCatcherApi } from "newui/BindingManager";
import { BlockRow } from "newui/component/BlockRow";
import Button, { ButtonEvent } from "newui/component/Button";
import { CheckButton, CheckButtonEvent } from "newui/component/CheckButton";
import Dropdown from "newui/component/Dropdown";
import { RangeInputEvent } from "newui/component/RangeInput";
import { RangeRow } from "newui/component/RangeRow";
import Text from "newui/component/Text";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { ParticleType } from "renderer/particle/IParticle";
import { particles } from "renderer/particle/Particles";
import Enums from "utilities/enum/Enums";
import Collectors from "utilities/iterable/Collectors";
import { tuple } from "utilities/iterable/Generators";
import Vector2 from "utilities/math/Vector2";
import { Bound } from "utilities/Objects";
import SetTime from "../../action/SetTime";
import UnlockRecipes from "../../action/UnlockRecipes";
import DebugTools, { DebugToolsEvent } from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import CancelablePromise from "../../util/CancelablePromise";
import DebugToolsPanel, { DebugToolsPanelEvent } from "../component/DebugToolsPanel";

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

	public constructor(gsapi: IGameScreenApi) {
		super(gsapi);

		this.timeRange = new RangeRow(this.api)
			.classes.add("debug-tools-range-row-no-default-button")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelTime)))
			.editRange(range => range
				.setStep(0.001)
				.setMin(0)
				.setMax(1)
				.setRefreshMethod(() => game.time.getTime()))
			.setDisplayValue(time => game.time.getTranslation(time))
			.on(RangeInputEvent.Change, (_, time: number) => {
				ActionExecutor.get(SetTime).execute(localPlayer, time);
			})
			.appendTo(this);

		this.inspectButton = new CheckButton(this.api)
			.setText(translation(DebugToolsTranslation.ButtonInspect))
			.setRefreshMethod(() => !!this.selectionPromise)
			.on(CheckButtonEvent.Change, (_, checked: boolean) => {
				if (!!this.selectionPromise !== checked) {
					if (checked && this.DEBUG_TOOLS.selector.selecting) return false;

					if (!checked) {
						if (this.selectionPromise && !this.selectionPromise.isResolved) {
							this.selectionPromise!.cancel();
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

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonInspectLocalPlayer))
			.on(ButtonEvent.Activate, () => this.DEBUG_TOOLS.inspect(localPlayer))
			.appendTo(this);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonUnlockRecipes))
			.on(ButtonEvent.Activate, this.unlockRecipes)
			.appendTo(this);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonTravelAway))
			.on(ButtonEvent.Activate, this.travelAway)
			.appendTo(this);

		new BlockRow(this.api)
			.classes.add("debug-tools-dialog-checkbutton-dropdown-row")
			.append(this.checkButtonAudio = new CheckButton(this.api)
				.setText(translation(DebugToolsTranslation.ButtonAudio)))
			.append(this.dropdownAudio = new Dropdown<SfxType>(this.api)
				.setRefreshMethod(() => ({
					defaultOption: SfxType.Click,
					options: Enums.values(SfxType)
						.map(sfx => tuple(sfx, Translation.generator(SfxType[sfx])))
						.collect(Collectors.toArray)
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.values()
						.map(([id, t]) => tuple(id, (option: Button) => option.setText(t))),
				})))
			.appendTo(this);

		new BlockRow(this.api)
			.classes.add("debug-tools-dialog-checkbutton-dropdown-row")
			.append(this.checkButtonParticle = new CheckButton(this.api)
				.setText(translation(DebugToolsTranslation.ButtonParticle)))
			.append(this.dropdownParticle = new Dropdown<ParticleType>(this.api)
				.setRefreshMethod(() => ({
					defaultOption: ParticleType.Blood,
					options: Enums.values(ParticleType)
						.map(particle => tuple(particle, Translation.generator(ParticleType[particle])))
						.collect(Collectors.toArray)
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.values()
						.map(([id, t]) => tuple(id, (option: Button) => option.setText(t))),
				})))
			.appendTo(this);

		this.on(DebugToolsPanelEvent.SwitchTo, this.onSwitchTo);
		this.on(DebugToolsPanelEvent.SwitchAway, this.onSwitchAway);
	}

	public getTranslation() {
		return DebugToolsTranslation.PanelGeneral;
	}

	@HookMethod
	public canClientMove(api: BindCatcherApi): false | undefined {
		if (this.selectionPromise || this.checkButtonAudio.checked || this.checkButtonParticle.checked) return false;

		return undefined;
	}

	@HookMethod
	public onGameTickEnd() {
		if (this.timeRange) {
			this.timeRange.refresh();
		}
	}

	@HookMethod(HookPriority.High)
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

	@Bound
	private onSwitchTo() {
		this.timeRange.refresh();

		hookManager.register(this, "DebugToolsDialog:GeneralPanel")
			.until(DebugToolsPanelEvent.SwitchAway);

		this.until(DebugToolsPanelEvent.SwitchAway)
			.bind(this.DEBUG_TOOLS, DebugToolsEvent.Inspect, () => {
				if (this.selectionPromise) this.selectionPromise.cancel();
			});
	}

	@Bound
	private onSwitchAway() {
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

	@Bound
	private async unlockRecipes() {
		const confirm = await this.api.interrupt(translation(DebugToolsTranslation.InterruptConfirmationUnlockRecipes))
			.withDescription(translation(DebugToolsTranslation.InterruptConfirmationUnlockRecipesDescription))
			.withConfirmation();

		if (!confirm) return;

		ActionExecutor.get(UnlockRecipes).execute(localPlayer);
	}

	/**
	 * Travels Away
	 * 
	 * Note: Since "traveling away" isn't possible on multiplayer, this doesn't need to be an action.
	 */
	@Bound
	private async travelAway() {
		if (multiplayer.isConnected()) return;

		const choice = await this.api.interrupt(translation(DebugToolsTranslation.InterruptChoiceTravelAway))
			.withChoice(InterruptChoice.Cancel, this.DEBUG_TOOLS.choiceTravelAway, this.DEBUG_TOOLS.choiceSailToCivilization);

		if (choice === InterruptChoice.Cancel) return;

		const anyExecutor = (ActionExecutor as any).get(choice === this.DEBUG_TOOLS.choiceSailToCivilization ? ActionType.SailToCivilization : ActionType.TraverseTheSea);
		anyExecutor.execute(localPlayer, undefined, true, true, true);
	}
}

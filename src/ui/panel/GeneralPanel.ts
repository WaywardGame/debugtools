import { ActionType } from "Enums";
import { HookMethod } from "mod/IHookHost";
import { BindCatcherApi } from "newui/BindingManager";
import Button, { ButtonEvent } from "newui/component/Button";
import { CheckButton, CheckButtonEvent } from "newui/component/CheckButton";
import { RangeInputEvent } from "newui/component/RangeInput";
import { RangeRow } from "newui/component/RangeRow";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import Vector2 from "utilities/math/Vector2";
import { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import DebugTools, { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import CancelablePromise from "../../util/CancelablePromise";
import DebugToolsPanel, { DebugToolsPanelEvent } from "../component/DebugToolsPanel";

export default class GeneralPanel extends DebugToolsPanel {
	private timeRange: RangeRow;
	private inspectButton: CheckButton;

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
				Actions.get("setTime").execute({ object: time });
			})
			.appendTo(this);

		this.inspectButton = new CheckButton(this.api)
			.setText(translation(DebugToolsTranslation.ButtonInspect))
			.setRefreshMethod(() => !!this.selectionPromise)
			.on(CheckButtonEvent.Change, (_, checked: boolean) => {
				if (!!this.selectionPromise !== checked) {
					if (checked && DebugTools.INSTANCE.selector.selecting) return false;

					if (!checked) {
						if (this.selectionPromise && !this.selectionPromise.isResolved) {
							this.selectionPromise!.cancel();
						}

						delete this.selectionPromise;

					} else {
						this.selectionPromise = DebugTools.INSTANCE.selector.select();
						this.selectionPromise.then(this.inspectTile);
					}
				}

				return true;
			})
			.appendTo(this);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonInspectLocalPlayer))
			.on(ButtonEvent.Activate, this.inspectLocalPlayer)
			.appendTo(this);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonUnlockRecipes))
			.on(ButtonEvent.Activate, this.unlockRecipes)
			.appendTo(this);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonRemoveAllCreatures))
			.on(ButtonEvent.Activate, this.removeAllCreatures)
			.appendTo(this);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonRemoveAllNPCs))
			.on(ButtonEvent.Activate, this.removeAllNPCs)
			.appendTo(this);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonTravelAway))
			.on(ButtonEvent.Activate, this.travelAway)
			.appendTo(this);

		this.on(DebugToolsPanelEvent.SwitchTo, this.onSwitchTo);
		this.on(DebugToolsPanelEvent.SwitchAway, this.onSwitchAway);
	}

	public getTranslation() {
		return DebugToolsTranslation.PanelGeneral;
	}

	@HookMethod
	public canClientMove(api: BindCatcherApi): false | undefined {
		if (this.selectionPromise) return false;

		return undefined;
	}

	@HookMethod
	public onGameTickEnd() {
		if (this.timeRange) {
			this.timeRange.refresh();
		}
	}

	@Bound
	private onSwitchTo() {
		this.timeRange.refresh();

		hookManager.register(this, "DebugToolsDialog:GeneralPanel")
			.until(DebugToolsPanelEvent.SwitchAway);
	}

	@Bound
	private onSwitchAway() {
		if (this.selectionPromise) {
			this.selectionPromise.cancel();
			delete this.selectionPromise;
		}
	}

	@Bound
	private inspectLocalPlayer() {
		if (this.selectionPromise) this.selectionPromise.cancel();
		DebugTools.INSTANCE.inspect(localPlayer);
	}

	@Bound
	private inspectTile(tilePosition?: Vector2) {
		delete this.selectionPromise;
		this.inspectButton.refresh();

		if (!tilePosition) return;

		DebugTools.INSTANCE.inspect(tilePosition);
	}

	@Bound
	private async unlockRecipes() {
		const confirm = await this.api.interrupt(translation(DebugToolsTranslation.InterruptConfirmationUnlockRecipes))
			.withDescription(translation(DebugToolsTranslation.InterruptConfirmationUnlockRecipesDescription))
			.withConfirmation();

		if (!confirm) return;

		Actions.get("unlockRecipes").execute();
	}

	@Bound
	private removeAllCreatures() {
		Actions.get("removeAllCreatures").execute();
	}

	@Bound
	private removeAllNPCs() {
		Actions.get("removeAllNPCs").execute();
	}

	/**
	 * Travels Away
	 * 
	 * Note: Since "traveling away" isn't possible on multiplayer, this doesn't need to be an action.
	 */
	@Bound
	private async travelAway() {
		if (multiplayer.isConnected()) {
			return;
		}

		const choice = await this.api.interrupt(translation(DebugToolsTranslation.InterruptChoiceTravelAway))
			.withChoice(DebugTools.INSTANCE.choiceSailToCivilization, DebugTools.INSTANCE.choiceTravelAway);

		actionManager.execute(
			localPlayer,
			choice === DebugTools.INSTANCE.choiceSailToCivilization ? ActionType.SailToCivilization : ActionType.TraverseTheSea,
			{ object: [true, true, true] },
		);
	}
}

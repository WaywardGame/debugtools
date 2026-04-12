import { EventBus } from "@wayward/game/event/EventBuses";
import { EventHandler } from "@wayward/game/event/EventManager";
import Dictionary from "@wayward/game/language/Dictionary";
import { MiscTranslation } from "@wayward/game/language/dictionary/Misc";
import { TextContext } from "@wayward/game/language/ITranslation";
import TranslationImpl from "@wayward/game/language/impl/TranslationImpl";
import Curse, { CURSE_SCRIPT_REPEAT_INFINITE_ITERATIONS, type CurseEventInstance } from "@wayward/game/game/curse/Curse";
import type { CurseEventScript } from "@wayward/game/game/curse/CurseEvent";
import CurseEventDefinitions from "@wayward/game/game/curse/CurseEventDefinitions";
import { CurseEventType } from "@wayward/game/game/curse/ICurse";
import Translation from "@wayward/game/language/Translation";
import Button from "@wayward/game/ui/component/Button";
import Component from "@wayward/game/ui/component/Component";
import Details from "@wayward/game/ui/component/Details";
import SetNight from "../../action/SetNight";
import SpawnCurseEvent from "../../action/SpawnCurseEvent";
import ClearCurseEvents from "../../action/ClearCurseEvents";
import DebugToolsPanel from "../component/DebugToolsPanel";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import Enums from "@wayward/game/utilities/enum/Enums";
import SkipCurseEventTimers from "../../action/SkipCurseEventTimers";
import SetDay from "../../action/SetDay";
import { BlockRow } from "@wayward/game/ui/component/BlockRow";
import CheckButtonRange from "@wayward/game/ui/component/CheckButtonRange";
import Mod from "@wayward/game/mod/Mod";
import type DebugToolsMod from "../../DebugTools";
import SetPlayerData from "../../action/SetPlayerData";
import RevealCurseEvents from "../../action/RevealCurseEvents";
import ObscureCurseVisualFoW from "../../action/ObscureCurseVisualFoW";
import ResetCurseVisualFoW from "../../action/ResetCurseVisualFoW";
import ExecuteCurseEventScriptAction from "../../action/ExecuteCurseEventScriptAction";
import EnumDropdown from "@wayward/game/ui/component/dropdown/EnumDropdown";
import RestartCurseEventScriptBranch from "../../action/RestartCurseEventScriptBranch";
import SkipCurseEventScriptWait from "../../action/SkipCurseEventScriptWait";
import TeleportEntity from "../../action/TeleportEntity";
import Text, { Paragraph } from "@wayward/game/ui/component/Text";
import { OwnEventHandler } from "@wayward/utilities/event/EventManager";

const DebugTools = Mod.get<DebugToolsMod>();

type DebugScriptProcessState = Exclude<CurseEventInstance["scriptProcesses"], undefined>[number];

export default class CursePanel extends DebugToolsPanel {

	private readonly currentEventsDetails: Details;
	private readonly cooldownStatsDetails: Details;
	private readonly detailOpenStates = new Map<string, boolean>();
	private isActive = false;

	public constructor() {
		super();

		new CheckButtonRange()
			.setText(translation(DebugToolsTranslation.CurseOverride))
			.setRefreshMethod(() => DebugTools?.instance.getPlayerData(localPlayer, "curseOverride") !== undefined)
			.editRange(range => (range
				.setMin(0)
				.setMax(100)
				.setStep(0.1)
				.setRefreshMethod(() => (DebugTools?.instance.getPlayerData(localPlayer, "curseOverride") ?? 0) * 100)
			))
			.event.subscribeUnsafe("change", (_, value) => this.executeAndRefresh(SetPlayerData.execute(localPlayer, localPlayer, "curseOverride", value !== undefined ? value / 100 : undefined)))
			.appendTo(this);

		new BlockRow()
			.append((new Button()
				.setText(translation(DebugToolsTranslation.SetNight))
				.event.subscribe("activate", () => this.executeAndRefresh(SetNight.execute(localPlayer)))
			))
			.append((new Button()
				.setText(translation(DebugToolsTranslation.SetDay))
				.event.subscribe("activate", () => this.executeAndRefresh(SetDay.execute(localPlayer)))
			))
			.appendTo(this);

		const dropdownEvent = new EnumDropdown(CurseEventType, Dictionary.CurseEvent, CurseEventType.None)
			.setExcluded(...Enums.values(CurseEventType).filter(type => type !== CurseEventType.None && !CurseEventDefinitions[type]))
			;

		new LabelledRow()
			.classes.add("debug-tools-auto-1fr-auto")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.SpawnCurseEvent)))
			.append(dropdownEvent)
			.append(new Button()
				.setText(translation(DebugToolsTranslation.ButtonExecute))
				.event.subscribe("activate", () => {
					if (dropdownEvent.selectedOption) {
						this.executeAndRefresh(SpawnCurseEvent.execute(localPlayer, dropdownEvent.selectedOption));
					}
				}))
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.SkipCurseEventTimers))
			.event.subscribe("activate", () => this.executeAndRefresh(SkipCurseEventTimers.execute(localPlayer)))
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.RevealCurseEvents))
			.event.subscribe("activate", () => this.executeAndRefresh(RevealCurseEvents.execute(localPlayer)))
			.appendTo(this);

		new BlockRow()
			.append((new Button()
				.setText(translation(DebugToolsTranslation.ObscureCurseVisualFoW))
				.event.subscribe("activate", () => this.executeAndRefresh(ObscureCurseVisualFoW.execute(localPlayer)))
			))
			.append((new Button()
				.setText(translation(DebugToolsTranslation.ResetCurseVisualFoW))
				.event.subscribe("activate", () => this.executeAndRefresh(ResetCurseVisualFoW.execute(localPlayer)))
			))
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.ClearCurseEvents))
			.event.subscribe("activate", () => this.executeAndRefresh(ClearCurseEvents.execute(localPlayer)))
			.appendTo(this);

		this.currentEventsDetails = new Details()
			.setSummary(summary => summary.setText(translation(DebugToolsTranslation.HeadingCurrentCurseEvents)
				.addArgs(() => localIsland.curse.events?.length ?? 0)))
			.open()
			.event.subscribe("open", () => this.refreshCurrentEvents())
			.appendTo(this);

		this.cooldownStatsDetails = new Details()
			.setSummary(summary => summary.setText(translation(DebugToolsTranslation.HeadingCurseEventCooldownsStats)))
			.open()
			.event.subscribe("open", () => this.refreshCooldownStats())
			.appendTo(this);

		this.refreshCurseState();
	}

	public override getTranslation(): DebugToolsTranslation | Translation {
		return DebugToolsTranslation.PanelCurse;
	}

	@OwnEventHandler(CursePanel, "switchTo")
	protected onSwitchTo(): void {
		this.isActive = true;
		this.refreshCurseState();
	}

	@OwnEventHandler(CursePanel, "switchAway")
	protected onSwitchAway(): void {
		this.isActive = false;
	}

	@EventHandler(EventBus.LocalIsland, "tickEnd")
	protected onTickEnd(): void {
		if (!this.isActive) {
			return;
		}

		this.refreshCurseState();
	}

	private executeAndRefresh(action: Promise<unknown> | void): void {
		void Promise.resolve(action)
			.finally(() => this.refreshCurseState());
	}

	private refreshCurseState(): void {
		this.currentEventsDetails.refreshSummary();
		this.cooldownStatsDetails.refreshSummary();

		if (this.currentEventsDetails.isOpen) {
			this.refreshCurrentEvents();
		}

		if (this.cooldownStatsDetails.isOpen) {
			this.refreshCooldownStats();
		}
	}

	private refreshCurrentEvents(): void {
		this.currentEventsDetails.dump();

		const events = localIsland.curse.events ?? [];
		if (!events.length) {
			new Paragraph()
				.setText(translation(DebugToolsTranslation.CurseNoActiveEvents))
				.appendTo(this.currentEventsDetails);
			return;
		}

		for (const [index, event] of events.entries()) {
			this.renderEventDetails(event, index);
		}
	}

	private refreshCooldownStats(): void {
		this.cooldownStatsDetails.dump();

		this.appendValueRow(this.cooldownStatsDetails, DebugToolsTranslation.LabelCurseNightActive, localIsland.curse.night ? "true" : "false");
		this.appendValueRow(this.cooldownStatsDetails, DebugToolsTranslation.LabelCurseIslandCooldown, this.getOptionalNumberText(localIsland.curse.cooldown));
		this.appendValueRow(this.cooldownStatsDetails, DebugToolsTranslation.LabelCurseGlobalCurse, this.getPercentText(localIsland.curse.globalCurse));
		this.appendValueRow(this.cooldownStatsDetails, DebugToolsTranslation.LabelCurseActiveEventCount, String(localIsland.curse.events?.length ?? 0));
		this.appendValueRow(this.cooldownStatsDetails, DebugToolsTranslation.LabelCurseDay, String(game.time.day));
		this.appendValueRow(this.cooldownStatsDetails, DebugToolsTranslation.LabelCurseTime, game.time.getTranslation(game.time.getTime()));

		const cooldowns = localIsland.curse.eventCooldowns;
		const cooldownTypes = cooldowns
			? Object.keys(cooldowns)
				.map(type => +type as CurseEventType)
				.sort((a, b) => a - b)
			: [];

		const cooldownsDetails = new Details()
			.setSummary(summary => summary.setText(translation(DebugToolsTranslation.LabelCurseEventCooldowns)))
			.toggleOpen(true)
			.appendTo(this.cooldownStatsDetails);

		if (!cooldownTypes.length) {
			new Paragraph()
				.setText(translation(DebugToolsTranslation.CurseNoEventCooldowns))
				.appendTo(cooldownsDetails);
			return;
		}

		for (const type of cooldownTypes) {
			new Component()
				.append((new Text()
					.setText((Translation.get(Dictionary.CurseEvent, type).inContext(TextContext.Title)
						.passTo(Translation.colorizeImportance("secondary"))
					))
				))
				.append((new Text()
					.setText(Translation.merge(" ", cooldowns?.[type] ?? 0))
				))
				.appendTo(cooldownsDetails);
		}
	}

	private renderEventDetails(event: CurseEventInstance, index: number): void {
		const cursebearer = Curse.getCursebearer(localIsland, event);
		const cursebearerText = cursebearer?.getName() ?? (event.cursebearerIdentifier || translation(DebugToolsTranslation.None));
		const flatProcesses = this.flattenProcesses(event.scriptProcesses);
		const eventKey = `event:${index}:${event.type}:${event.cursebearerIdentifier}`;

		const eventDetails = this.createRememberedDetails(eventKey, true)
			.setSummary(summary => summary.setText(translation(DebugToolsTranslation.CurseEventSummary)
				.addArgs(index + 1, Translation.get(Dictionary.CurseEvent, event.type).inContext(TextContext.Title), cursebearerText)))
			.appendTo(this.currentEventsDetails);

		this.appendValueRow(eventDetails, DebugToolsTranslation.LabelCurseEventCursebearer, cursebearerText);
		this.appendValueRow(eventDetails, DebugToolsTranslation.LabelCurseEventCurse, this.getPercentText(event.curse));
		this.appendValueRowWithButton(eventDetails, DebugToolsTranslation.LabelCurseEventPoint, `${event.point.x}, ${event.point.y}`,
			new Button()
				.setText(translation(DebugToolsTranslation.ButtonTeleportEntity))
				.event.subscribe("activate", () => {
					const tile = localIsland.getTileSafe(event.point.x, event.point.y, localPlayer.z);
					if (tile) {
						this.executeAndRefresh(TeleportEntity.execute(localPlayer, localPlayer, tile));
					}
				}));
		this.appendValueRow(eventDetails, DebugToolsTranslation.LabelCurseEventCreatures, String(event.creatures?.length ?? 0));

		const scriptDetails = this.createRememberedDetails(`${eventKey}/script`, true)
			.setSummary(summary => summary.setText(translation(DebugToolsTranslation.HeadingCurseEventScript)))
			.appendTo(eventDetails);

		const script = this.getEventScript(event);
		if (!script?.length) {
			new Paragraph()
				.setText(translation(DebugToolsTranslation.None))
				.appendTo(scriptDetails);
			return;
		}

		if (script.length === 1 && script[0].type === "repeat") {
			const repeatPath = [0] as Array<string | number>;
			const repeatProcess = this.getExactProcess(flatProcesses, repeatPath);
			const hasPendingNextChild = !!repeatProcess && !repeatProcess.childProcesses?.length;
			scriptDetails.setSummary(summary => summary.setText(Translation.merge(
				translation(DebugToolsTranslation.HeadingCurseEventScript),
				": ",
				this.getRepeatLabel(repeatProcess, true, hasPendingNextChild),
			)));

			const scriptArray = this.renderScriptArray(scriptDetails, index, script[0].steps, [0, "steps"], flatProcesses, true,
				hasPendingNextChild ? [0, "steps", 0] : undefined);

			this.appendFolderButton(scriptArray, translation(DebugToolsTranslation.ButtonRestart), () =>
				this.executeAndRefresh(RestartCurseEventScriptBranch.execute(localPlayer, index, repeatPath)));
			return;
		}

		if (script.length === 1 && script[0].type === "simultaneously") {
			scriptDetails.setSummary(summary => summary.setText(Translation.merge(
				translation(DebugToolsTranslation.HeadingCurseEventScript),
				": ",
				translation(DebugToolsTranslation.CurseEventTypeSimultaneously),
			)));

			this.renderSimultaneouslyChildren(scriptDetails, index, [0], script[0], flatProcesses, true);
			return;
		}

		this.renderScriptArray(scriptDetails, index, script, [], flatProcesses, flatProcesses.length > 0);
	}

	private appendValueRow(parent: Component, label: DebugToolsTranslation, value: string | Translation): void {
		new Component()
			.append((new Text()
				.setText(translation(label).passTo(Translation.colorizeImportance("secondary")))
			))
			.append((new Text()
				.setText(Translation.merge(" ", value))
			))
			.appendTo(parent);
	}

	private appendValueRowWithButton(parent: Component, label: DebugToolsTranslation, value: string | Translation, button: Button): void {
		new Component()
			.classes.add("debug-tools-auto-1fr-auto")
			.append((new Text()
				.setText(translation(label).passTo(Translation.colorizeImportance("secondary")))
			))
			.append((new Text()
				.setText(Translation.merge(" ", value))
			))
			.append(button)
			.appendTo(parent);
	}

	private getOptionalNumberText(value?: number): string | Translation {
		return value === undefined ? translation(DebugToolsTranslation.None) : String(value);
	}

	private getPercentText(value?: number): string | Translation {
		return value === undefined ? translation(DebugToolsTranslation.None) : Translation.misc(MiscTranslation.Percent).addArgs(value);
	}

	private getEventScript(event: CurseEventInstance): CurseEventScript | undefined {
		const scriptRaw = CurseEventDefinitions[event.type]?.script;
		if (!scriptRaw) {
			return undefined;
		}

		return Array.isArray(scriptRaw) ? scriptRaw : [scriptRaw];
	}

	private flattenProcesses(processes?: readonly DebugScriptProcessState[]): DebugScriptProcessState[] {
		const result: DebugScriptProcessState[] = [];
		const append = (entries?: readonly DebugScriptProcessState[]) => {
			for (const process of entries ?? []) {
				result.push(process);
				append(process.childProcesses);
			}
		};

		append(processes);
		return result;
	}

	private renderScriptArray(parent: Component, eventIndex: number, steps: CurseEventScript.Step[], basePath: Array<string | number>, processes: DebugScriptProcessState[], parentActive: boolean, pendingPath?: Array<string | number>): Component {
		const scriptArray = new Component()
			.classes.add("debug-tools-curse-script-array")
			.appendTo(parent);

		for (const [index, step] of steps.entries()) {
			const path = [...basePath, index];
			const hasActiveProcess = this.hasActiveProcessAtOrBelow(processes, path);
			const isPending = this.isPathPending(path, pendingPath);
			const active = hasActiveProcess || isPending;
			const inactive = parentActive && !active;

			switch (step.type) {
				case "action":
					this.renderActionStep(scriptArray, eventIndex, path, inactive);
					break;
				case "wait":
					this.renderWaitStep(scriptArray, eventIndex, path, step, this.getExactProcess(processes, path), hasActiveProcess, isPending, inactive);
					break;
				case "repeat":
					this.renderRepeatStep(scriptArray, eventIndex, path, step, this.getExactProcess(processes, path), processes, active, inactive);
					break;
				case "simultaneously":
					this.renderSimultaneouslyStep(scriptArray, eventIndex, path, step, processes, active, inactive);
					break;
			}
		}

		return scriptArray;
	}

	private renderActionStep(parent: Component, eventIndex: number, path: Array<string | number>, inactive: boolean): void {
		this.renderScriptRow(parent, translation(DebugToolsTranslation.CurseEventTypeAction), inactive,
			new Button()
				.setText(translation(DebugToolsTranslation.ButtonExecute))
				.event.subscribe("activate", () => this.executeAndRefresh(ExecuteCurseEventScriptAction.execute(localPlayer, eventIndex, path))));
	}

	private renderWaitStep(parent: Component, eventIndex: number, path: Array<string | number>, step: CurseEventScript.Wait, process: DebugScriptProcessState | undefined, active: boolean, pending: boolean, inactive: boolean): void {
		this.renderScriptRow(parent, this.getWaitLabel(step, process, active, pending), inactive,
			(active || pending) ? new Button()
				.setText(translation(DebugToolsTranslation.ButtonSkip))
				.event.subscribe("activate", () => this.executeAndRefresh(SkipCurseEventScriptWait.execute(localPlayer, eventIndex, path)))
				: undefined);
	}

	private renderRepeatStep(parent: Component, eventIndex: number, path: Array<string | number>, step: CurseEventScript.Repeat, process: DebugScriptProcessState | undefined, processes: DebugScriptProcessState[], active: boolean, inactive: boolean): void {
		const hasPendingNextChild = active && !process?.childProcesses?.length;
		const details = this.createRememberedDetails(`repeat:${eventIndex}:${this.getPathKey(path)}`, active)
			.classes.add("debug-tools-curse-script-node")
			.classes.toggle(active, "debug-tools-curse-script-node-active")
			.classes.toggle(inactive, "debug-tools-curse-script-node-inactive")
			.setSummary(summary => summary.setText(this.getRepeatLabel(process, active, hasPendingNextChild)))
			.appendTo(parent);

		const scriptArray = this.renderScriptArray(details, eventIndex, step.steps, [...path, "steps"], processes, active,
			hasPendingNextChild ? [...path, "steps", 0] : undefined);

		if (active) {
			this.appendFolderButton(scriptArray, translation(DebugToolsTranslation.ButtonRestart), () =>
				this.executeAndRefresh(RestartCurseEventScriptBranch.execute(localPlayer, eventIndex, path)));
		}
	}

	private renderSimultaneouslyStep(parent: Component, eventIndex: number, path: Array<string | number>, step: CurseEventScript.Simultaneously, processes: DebugScriptProcessState[], active: boolean, inactive: boolean): void {
		const details = this.createRememberedDetails(`simultaneously:${eventIndex}:${this.getPathKey(path)}`, active)
			.classes.add("debug-tools-curse-script-node")
			.classes.toggle(active, "debug-tools-curse-script-node-active")
			.classes.toggle(inactive, "debug-tools-curse-script-node-inactive")
			.setSummary(summary => summary.setText(translation(DebugToolsTranslation.CurseEventTypeSimultaneously)))
			.appendTo(parent);

		this.renderSimultaneouslyChildren(details, eventIndex, path, step, processes, active);
	}

	private renderSimultaneouslyChildren(parent: Component, eventIndex: number, path: Array<string | number>, step: CurseEventScript.Simultaneously, processes: DebugScriptProcessState[], active: boolean): void {

		const branchContainer = new Component()
			.classes.add("debug-tools-curse-script-array")
			.appendTo(parent);

		for (const [name, script] of Object.entries(step.scripts)) {
			const branchPath = [...path, "scripts", name];
			const branchActive = this.hasActiveProcessAtOrBelow(processes, branchPath);
			if (script.length === 1 && script[0].type === "repeat") {
				this.renderCollapsedRepeatBranch(branchContainer, eventIndex, branchPath, name, script[0], processes, active, branchActive);
				continue;
			}

			const branchDetails = this.createRememberedDetails(`branch:${eventIndex}:${this.getPathKey(branchPath)}`, branchActive)
				.classes.add("debug-tools-curse-script-node")
				.classes.toggle(branchActive, "debug-tools-curse-script-node-active")
				.classes.toggle(active && !branchActive, "debug-tools-curse-script-node-inactive")
				.setSummary(summary => summary.setText(TranslationImpl.generator(name)))
				.appendTo(branchContainer);

			const scriptArray = this.renderScriptArray(branchDetails, eventIndex, script, branchPath, processes, branchActive);

			if (branchActive) {
				this.appendFolderButton(scriptArray, translation(DebugToolsTranslation.ButtonRestart), () =>
					this.executeAndRefresh(RestartCurseEventScriptBranch.execute(localPlayer, eventIndex, branchPath)));
			}
		}
	}

	private renderCollapsedRepeatBranch(parent: Component, eventIndex: number, branchPath: Array<string | number>, name: string, repeatStep: CurseEventScript.Repeat, processes: DebugScriptProcessState[], parentActive: boolean, branchActive: boolean): void {
		const repeatPath = [...branchPath, 0];
		const repeatProcess = this.getExactProcess(processes, repeatPath);
		const hasPendingNextChild = branchActive && !repeatProcess?.childProcesses?.length;
		const branchDetails = this.createRememberedDetails(`branch:${eventIndex}:${this.getPathKey(branchPath)}`, branchActive)
			.classes.add("debug-tools-curse-script-node")
			.classes.toggle(branchActive, "debug-tools-curse-script-node-active")
			.classes.toggle(parentActive && !branchActive, "debug-tools-curse-script-node-inactive")
			.setSummary(summary => summary.setText(Translation.merge(
				TranslationImpl.generator(`${name}: `),
				this.getRepeatLabel(repeatProcess, branchActive, hasPendingNextChild),
			)))
			.appendTo(parent);

		const scriptArray = this.renderScriptArray(branchDetails, eventIndex, repeatStep.steps, [...repeatPath, "steps"], processes, branchActive,
			hasPendingNextChild ? [...repeatPath, "steps", 0] : undefined);

		if (branchActive) {
			this.appendFolderButton(scriptArray, translation(DebugToolsTranslation.ButtonRestart), () =>
				this.executeAndRefresh(RestartCurseEventScriptBranch.execute(localPlayer, eventIndex, branchPath)));
		}
	}

	private renderScriptRow(parent: Component, label: string | Translation, inactive: boolean, button?: Button): void {
		const row = new Component()
			.classes.add("debug-tools-curse-script-row", "debug-tools-curse-script-node")
			.classes.toggle(inactive, "debug-tools-curse-script-node-inactive")
			.append(new Text().setText(typeof label === "string" ? TranslationImpl.generator(label) : label))
			.appendTo(parent);

		if (button) {
			row.append(button);
		}
	}

	private appendFolderButton(parent: Component, label: Translation, onActivate: () => void): void {
		new Component()
			.classes.add("debug-tools-curse-script-folder-controls")
			.append(new Button()
				.setText(label)
				.event.subscribe("activate", onActivate))
			.prependTo(parent);
	}

	private getWaitLabel(step: CurseEventScript.Wait, process: DebugScriptProcessState | undefined, active: boolean, pending: boolean): Translation {
		const label = translation(DebugToolsTranslation.CurseEventTypeWait);
		if (step.end.type !== "end after") {
			return label;
		}

		if (pending) {
			const fixedTotal = typeof step.end.ticks === "number" ? step.end.ticks : undefined;
			return Translation.merge(label, ` (1/${fixedTotal ?? "?"})`);
		}

		return this.getProgressLabel(label, process, active, 1);
	}

	private getRepeatLabel(process: DebugScriptProcessState | undefined, active: boolean, pendingNextChild: boolean): Translation {
		return this.getProgressLabel(translation(DebugToolsTranslation.CurseEventTypeRepeat), process, active, pendingNextChild ? 1 : 0);
	}

	private getProgressLabel(label: Translation, process: DebugScriptProcessState | undefined, active: boolean, currentOffset = 0): Translation {
		const hasProgress = !!active && process?.iterationsRemaining !== undefined && process.iterationsTotal !== undefined;
		if (!hasProgress) {
			return label;
		}

		const iterationsTotal = process.iterationsTotal!;
		const iterationsRemaining = process.iterationsRemaining!;
		const totalText = iterationsTotal === CURSE_SCRIPT_REPEAT_INFINITE_ITERATIONS ? "∞" : String(iterationsTotal);
		const elapsed = Math.max(0, iterationsTotal - iterationsRemaining + currentOffset);
		return Translation.merge(label, ` (${elapsed}/${totalText})`);
	}

	private hasActiveProcessAtOrBelow(processes: DebugScriptProcessState[], path: Array<string | number>): boolean {
		return processes.some(process => path.every((segment, index) => process.path[index] === segment));
	}

	private isPathPending(path: Array<string | number>, pendingPath?: Array<string | number>): boolean {
		return pendingPath !== undefined
			&& path.every((segment, index) => pendingPath[index] === segment);
	}

	private createRememberedDetails(key: string, defaultOpen: boolean): Details {
		const details = new Details()
			.toggleOpen(this.detailOpenStates.get(key) || defaultOpen);

		details.event.subscribe("toggle", (_, open) => this.detailOpenStates.set(key, open));
		return details;
	}

	private getPathKey(path: Array<string | number>): string {
		return path.join("/");
	}

	private getExactProcess(processes: DebugScriptProcessState[], path: Array<string | number>): DebugScriptProcessState | undefined {
		return processes.find(process => process.path.length === path.length
			&& process.path.every((segment, index) => path[index] === segment));
	}
}

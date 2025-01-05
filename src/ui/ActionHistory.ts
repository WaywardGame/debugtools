import { EventBus } from "@wayward/game/event/EventBuses";
import { EventHandler } from "@wayward/game/event/EventManager";
import type { Game } from "@wayward/game/game/Game";
import type Entity from "@wayward/game/game/entity/Entity";
import type { ActionType } from "@wayward/game/game/entity/action/IAction";
import IActionContext from "@wayward/game/game/entity/action/IActionContext";
import { TextContext } from "@wayward/game/language/ITranslation";
import Translation from "@wayward/game/language/Translation";
import { MiscTranslation } from "@wayward/game/language/dictionary/Misc";
import UiTranslation from "@wayward/game/language/dictionary/UiTranslation";
import Button from "@wayward/game/ui/component/Button";
import Component from "@wayward/game/ui/component/Component";
import LoadingAnimation from "@wayward/game/ui/component/Loading";
import type Text from "@wayward/game/ui/component/Text";
import { Paragraph } from "@wayward/game/ui/component/Text";
import { Bound } from "@wayward/utilities/Decorators";
import { DebugToolsTranslation, translation } from "../IDebugTools";

export enum ActionHistoryClasses {
	Main = "debug-tools-action-history",
	Section = "debug-tools-action-history-section",
	SectionCounts = "debug-tools-action-history-section-counts",
	CountItem = "debug-tools-action-history-section-counts-item",
	SectionHistory = "debug-tools-action-history-section-history",
	HistoryItem = "debug-tools-action-history-section-history-item",
	HistoryTickLabel = "debug-tools-action-history-section-history-tick-label",
	Loading = "debug-tools-action-history-loading",
}

export default class ActionHistory extends Component {

	public readonly counts?: Component;
	public readonly history: Component;
	public readonly countMap: PartialRecord<ActionType, Text> = {};
	public readonly loader: LoadingAnimation;

	public constructor(public readonly entity?: Entity) {
		super();
		this.classes.add(ActionHistoryClasses.Main);

		this.loader = new LoadingAnimation().appendTo(this);

		if (entity) {
			this.counts = new Component()
				.classes.add(ActionHistoryClasses.Section, ActionHistoryClasses.SectionCounts)
				.appendTo(this);

			for (const [action, count] of Object.entries(entity.historicalActions ?? {})) {
				this.onUpdateHistoricalActionCount(entity, +action as ActionType, count, 0);
			}

			entity.event.until(this, "remove")
				.subscribe("updateHistoricalActionCount", this.onUpdateHistoricalActionCount);
		}

		this.history = new Component()
			.classes.add(ActionHistoryClasses.Section, ActionHistoryClasses.SectionHistory)
			.append(new Button()
				.setText(translation(DebugToolsTranslation.ButtonLoadMore))
				.event.subscribe("activate", async button => {
					button.remove();
					this.history.dump();
					await this.rendering;
					this.rendering = this.render();
				}))
			.appendTo(this);

		this.registerEventBusSubscriber();
		this.rendering = this.render(100);
	}

	private rendering?: Promise<void>;
	private async render(count = Infinity) {
		this.classes.add(ActionHistoryClasses.Loading);
		this.history.store(this);
		this.lastTick = 0;
		let lastSleep = Date.now();
		for (const context of game.history.slice(-count)) {
			const executor = game.references.resolve(context.executorReference) as Entity | undefined;
			this.renderHistoryItem(executor, context);
			if (Date.now() - lastSleep > 2) {
				if (!await this.sleep(10)) {
					return;
				}

				lastSleep = Date.now();
			}
		}

		this.history.appendTo(this);
		this.classes.remove(ActionHistoryClasses.Loading);
	}

	@Bound protected onUpdateHistoricalActionCount(executor: Entity, action: ActionType, count: number, oldCount: number): void {
		(this.countMap[action] ??= new Paragraph().classes.add(ActionHistoryClasses.CountItem))
			.setText(Translation.merge(
				Translation.action(action),
				Translation.ui(UiTranslation.GameTooltipSharedLabel),
				count))
			.data.set("count", `${count}`)
			.appendTo(this.counts!, { sorted: countItem => -countItem.component?.data.get("count")! || 0 });
	}

	@EventHandler(EventBus.Game, "addHistoricalAction")
	protected async onAddHistoricalAction(game: Game, executor: Entity, context: IActionContext): Promise<void> {
		await this.rendering;
		this.renderHistoryItem(executor, context);
	}

	private lastTick = 0;
	private renderHistoryItem(executor: Entity | undefined, context: IActionContext) {
		if (this.entity && this.entity !== executor) {
			return;
		}

		if (this.lastTick < context.tick) {
			this.lastTick = context.tick;
			new Paragraph()
				.classes.add(ActionHistoryClasses.HistoryTickLabel)
				.setText(translation(DebugToolsTranslation.Tick).addArgs(context.tick))
				.prependTo(this.history);
		}

		const actionTranslation = IActionContext.translate(context).inContext(TextContext.Sentence);
		new Paragraph()
			.classes.add(ActionHistoryClasses.HistoryItem)
			.setText(this.entity ? actionTranslation
				: Translation.merge(
					executor?.getName() ?? Translation.misc(MiscTranslation.Unknown),
					Translation.ui(UiTranslation.GameTooltipSharedLabel),
					actionTranslation))
			.prependTo(this.history);
	}
}

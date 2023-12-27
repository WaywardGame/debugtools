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

import { EventBus } from "@wayward/game/event/EventBuses";
import { EventHandler } from "@wayward/game/event/EventManager";
import { Game } from "@wayward/game/game/Game";
import Entity from "@wayward/game/game/entity/Entity";
import { ActionType } from "@wayward/game/game/entity/action/IAction";
import IActionContext from "@wayward/game/game/entity/action/IActionContext";
import { TextContext } from "@wayward/game/language/ITranslation";
import Translation from "@wayward/game/language/Translation";
import { MiscTranslation } from "@wayward/game/language/dictionary/Misc";
import UiTranslation from "@wayward/game/language/dictionary/UiTranslation";
import Component from "@wayward/game/ui/component/Component";
import Text, { Paragraph } from "@wayward/game/ui/component/Text";
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
}

export default class ActionHistory extends Component {

	public readonly counts?: Component;
	public readonly history: Component;
	public readonly countMap: PartialRecord<ActionType, Text> = {};

	public constructor(public readonly entity?: Entity) {
		super();
		this.classes.add(ActionHistoryClasses.Main);

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
			.appendTo(this);

		this.registerEventBusSubscriber();

		for (const context of game.history) {
			const executor = game.references.resolve(context.executorReference) as Entity | undefined;
			this.renderHistoryItem(executor, context);
		}
	}

	@Bound protected onUpdateHistoricalActionCount(executor: Entity, action: ActionType, count: number, oldCount: number) {
		(this.countMap[action] ??= new Paragraph().classes.add(ActionHistoryClasses.CountItem))
			.setText(Translation.merge(
				Translation.action(action),
				Translation.ui(UiTranslation.GameTooltipSharedLabel),
				count))
			.data.set("count", `${count}`)
			.appendTo(this.counts!, { sorted: (a, b) => +b.data.get("count") - +a.data.get("count") });
	}

	@EventHandler(EventBus.Game, "addHistoricalAction")
	protected onAddHistoricalAction(game: Game, executor: Entity, context: IActionContext) {
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

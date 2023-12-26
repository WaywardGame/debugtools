var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@wayward/game/event/EventBuses", "@wayward/game/event/EventManager", "@wayward/game/game/entity/action/IActionContext", "@wayward/game/language/ITranslation", "@wayward/game/language/Translation", "@wayward/game/language/dictionary/Misc", "@wayward/game/language/dictionary/UiTranslation", "@wayward/game/ui/component/Component", "@wayward/game/ui/component/Text", "@wayward/utilities/Decorators", "../IDebugTools"], function (require, exports, EventBuses_1, EventManager_1, IActionContext_1, ITranslation_1, Translation_1, Misc_1, UiTranslation_1, Component_1, Text_1, Decorators_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ActionHistoryClasses = void 0;
    var ActionHistoryClasses;
    (function (ActionHistoryClasses) {
        ActionHistoryClasses["Main"] = "debug-tools-action-history";
        ActionHistoryClasses["Section"] = "debug-tools-action-history-section";
        ActionHistoryClasses["SectionCounts"] = "debug-tools-action-history-section-counts";
        ActionHistoryClasses["CountItem"] = "debug-tools-action-history-section-counts-item";
        ActionHistoryClasses["SectionHistory"] = "debug-tools-action-history-section-history";
        ActionHistoryClasses["HistoryItem"] = "debug-tools-action-history-section-history-item";
        ActionHistoryClasses["HistoryTickLabel"] = "debug-tools-action-history-section-history-tick-label";
    })(ActionHistoryClasses || (exports.ActionHistoryClasses = ActionHistoryClasses = {}));
    class ActionHistory extends Component_1.default {
        constructor(entity) {
            super();
            this.entity = entity;
            this.countMap = {};
            this.lastTick = 0;
            this.classes.add(ActionHistoryClasses.Main);
            if (entity) {
                this.counts = new Component_1.default()
                    .classes.add(ActionHistoryClasses.Section, ActionHistoryClasses.SectionCounts)
                    .appendTo(this);
                for (const [action, count] of Object.entries(entity.historicalActions ?? {})) {
                    this.onUpdateHistoricalActionCount(entity, +action, count, 0);
                }
                entity.event.until(this, "remove")
                    .subscribe("updateHistoricalActionCount", this.onUpdateHistoricalActionCount);
            }
            this.history = new Component_1.default()
                .classes.add(ActionHistoryClasses.Section, ActionHistoryClasses.SectionHistory)
                .appendTo(this);
            this.registerEventBusSubscriber();
            for (const context of game.history) {
                const executor = game.references.resolve(context.executorReference);
                this.renderHistoryItem(executor, context);
            }
        }
        onUpdateHistoricalActionCount(executor, action, count, oldCount) {
            (this.countMap[action] ??= new Text_1.Paragraph().classes.add(ActionHistoryClasses.CountItem))
                .setText(Translation_1.default.merge(Translation_1.default.action(action), Translation_1.default.ui(UiTranslation_1.default.GameTooltipSharedLabel), count))
                .data.set("count", `${count}`)
                .appendTo(this.counts, { sorted: (a, b) => +b.data.get("count") - +a.data.get("count") });
        }
        onAddHistoricalAction(game, executor, context) {
            this.renderHistoryItem(executor, context);
        }
        renderHistoryItem(executor, context) {
            if (this.entity && this.entity !== executor) {
                return;
            }
            if (this.lastTick < context.tick) {
                this.lastTick = context.tick;
                new Text_1.Paragraph()
                    .classes.add(ActionHistoryClasses.HistoryTickLabel)
                    .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.Tick).addArgs(context.tick))
                    .prependTo(this.history);
            }
            const actionTranslation = IActionContext_1.default.translate(context).inContext(ITranslation_1.TextContext.Sentence);
            new Text_1.Paragraph()
                .classes.add(ActionHistoryClasses.HistoryItem)
                .setText(this.entity ? actionTranslation
                : Translation_1.default.merge(executor?.getName() ?? Translation_1.default.misc(Misc_1.MiscTranslation.Unknown), Translation_1.default.ui(UiTranslation_1.default.GameTooltipSharedLabel), actionTranslation))
                .prependTo(this.history);
        }
    }
    exports.default = ActionHistory;
    __decorate([
        Decorators_1.Bound
    ], ActionHistory.prototype, "onUpdateHistoricalActionCount", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Game, "addHistoricalAction")
    ], ActionHistory.prototype, "onAddHistoricalAction", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9uSGlzdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9BY3Rpb25IaXN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFlQSxJQUFZLG9CQVFYO0lBUkQsV0FBWSxvQkFBb0I7UUFDL0IsMkRBQW1DLENBQUE7UUFDbkMsc0VBQThDLENBQUE7UUFDOUMsbUZBQTJELENBQUE7UUFDM0Qsb0ZBQTRELENBQUE7UUFDNUQscUZBQTZELENBQUE7UUFDN0QsdUZBQStELENBQUE7UUFDL0Qsa0dBQTBFLENBQUE7SUFDM0UsQ0FBQyxFQVJXLG9CQUFvQixvQ0FBcEIsb0JBQW9CLFFBUS9CO0lBRUQsTUFBcUIsYUFBYyxTQUFRLG1CQUFTO1FBTW5ELFlBQW1DLE1BQWU7WUFDakQsS0FBSyxFQUFFLENBQUM7WUFEMEIsV0FBTSxHQUFOLE1BQU0sQ0FBUztZQUZsQyxhQUFRLEdBQW9DLEVBQUUsQ0FBQztZQThDdkQsYUFBUSxHQUFHLENBQUMsQ0FBQztZQTFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFNUMsSUFBSSxNQUFNLEVBQUUsQ0FBQztnQkFDWixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksbUJBQVMsRUFBRTtxQkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLENBQUMsYUFBYSxDQUFDO3FCQUM3RSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRWpCLEtBQUssTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDO29CQUM5RSxJQUFJLENBQUMsNkJBQTZCLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBb0IsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENB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
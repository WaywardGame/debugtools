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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9uSGlzdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9BY3Rpb25IaXN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7Ozs7Ozs7SUFpQkgsSUFBWSxvQkFRWDtJQVJELFdBQVksb0JBQW9CO1FBQy9CLDJEQUFtQyxDQUFBO1FBQ25DLHNFQUE4QyxDQUFBO1FBQzlDLG1GQUEyRCxDQUFBO1FBQzNELG9GQUE0RCxDQUFBO1FBQzVELHFGQUE2RCxDQUFBO1FBQzdELHVGQUErRCxDQUFBO1FBQy9ELGtHQUEwRSxDQUFBO0lBQzNFLENBQUMsRUFSVyxvQkFBb0Isb0NBQXBCLG9CQUFvQixRQVEvQjtJQUVELE1BQXFCLGFBQWMsU0FBUSxtQkFBUztRQU1uRCxZQUFtQyxNQUFlO1lBQ2pELEtBQUssRUFBRSxDQUFDO1lBRDBCLFdBQU0sR0FBTixNQUFNLENBQVM7WUFGbEMsYUFBUSxHQUFvQyxFQUFFLENBQUM7WUE4Q3ZELGFBQVEsR0FBRyxDQUFDLENBQUM7WUExQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTVDLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ1osSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLG1CQUFTLEVBQUU7cUJBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsT0FBTyxFQUFFLG9CQUFvQixDQUFDLGFBQWEsQ0FBQztxQkFDN0UsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVqQixLQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztvQkFDOUUsSUFBSSxDQUFDLDZCQUE2QixDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQW9CLEVBQUUsS0FB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
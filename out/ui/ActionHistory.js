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
define(["require", "exports", "@wayward/game/event/EventBuses", "@wayward/game/event/EventManager", "@wayward/game/game/entity/action/IActionContext", "@wayward/game/language/ITranslation", "@wayward/game/language/Translation", "@wayward/game/language/dictionary/Misc", "@wayward/game/language/dictionary/UiTranslation", "@wayward/game/ui/component/Button", "@wayward/game/ui/component/Component", "@wayward/game/ui/component/Loading", "@wayward/game/ui/component/Text", "@wayward/utilities/Decorators", "../IDebugTools"], function (require, exports, EventBuses_1, EventManager_1, IActionContext_1, ITranslation_1, Translation_1, Misc_1, UiTranslation_1, Button_1, Component_1, Loading_1, Text_1, Decorators_1, IDebugTools_1) {
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
        ActionHistoryClasses["Loading"] = "debug-tools-action-history-loading";
    })(ActionHistoryClasses || (exports.ActionHistoryClasses = ActionHistoryClasses = {}));
    class ActionHistory extends Component_1.default {
        constructor(entity) {
            super();
            this.entity = entity;
            this.countMap = {};
            this.lastTick = 0;
            this.classes.add(ActionHistoryClasses.Main);
            this.loader = new Loading_1.default().appendTo(this);
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
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonLoadMore))
                .event.subscribe("activate", async (button) => {
                button.remove();
                this.history.dump();
                await this.rendering;
                this.rendering = this.render();
            }))
                .appendTo(this);
            this.registerEventBusSubscriber();
            this.rendering = this.render(100);
        }
        async render(count = Infinity) {
            this.classes.add(ActionHistoryClasses.Loading);
            this.history.store(this);
            this.lastTick = 0;
            let lastSleep = Date.now();
            for (const context of game.history.slice(-count)) {
                const executor = game.references.resolve(context.executorReference);
                this.renderHistoryItem(executor, context);
                if (Date.now() - lastSleep > 2) {
                    await this.sleep(10);
                    lastSleep = Date.now();
                }
            }
            this.history.appendTo(this);
            this.classes.remove(ActionHistoryClasses.Loading);
        }
        onUpdateHistoricalActionCount(executor, action, count, oldCount) {
            (this.countMap[action] ??= new Text_1.Paragraph().classes.add(ActionHistoryClasses.CountItem))
                .setText(Translation_1.default.merge(Translation_1.default.action(action), Translation_1.default.ui(UiTranslation_1.default.GameTooltipSharedLabel), count))
                .data.set("count", `${count}`)
                .appendTo(this.counts, { sorted: (a, b) => +b.data.get("count") - +a.data.get("count") });
        }
        async onAddHistoricalAction(game, executor, context) {
            await this.rendering;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9uSGlzdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9BY3Rpb25IaXN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7Ozs7Ozs7SUFtQkgsSUFBWSxvQkFTWDtJQVRELFdBQVksb0JBQW9CO1FBQy9CLDJEQUFtQyxDQUFBO1FBQ25DLHNFQUE4QyxDQUFBO1FBQzlDLG1GQUEyRCxDQUFBO1FBQzNELG9GQUE0RCxDQUFBO1FBQzVELHFGQUE2RCxDQUFBO1FBQzdELHVGQUErRCxDQUFBO1FBQy9ELGtHQUEwRSxDQUFBO1FBQzFFLHNFQUE4QyxDQUFBO0lBQy9DLENBQUMsRUFUVyxvQkFBb0Isb0NBQXBCLG9CQUFvQixRQVMvQjtJQUVELE1BQXFCLGFBQWMsU0FBUSxtQkFBUztRQU9uRCxZQUFtQyxNQUFlO1lBQ2pELEtBQUssRUFBRSxDQUFDO1lBRDBCLFdBQU0sR0FBTixNQUFNLENBQVM7WUFIbEMsYUFBUSxHQUFvQyxFQUFFLENBQUM7WUF5RXZELGFBQVEsR0FBRyxDQUFDLENBQUM7WUFwRXBCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTVDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxpQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVwRCxJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUNaLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxtQkFBUyxFQUFFO3FCQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxhQUFhLENBQUM7cUJBQzdFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFakIsS0FBSyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFD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
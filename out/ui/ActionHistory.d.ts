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
import { Game } from "@wayward/game/game/Game";
import Entity from "@wayward/game/game/entity/Entity";
import { ActionType } from "@wayward/game/game/entity/action/IAction";
import IActionContext from "@wayward/game/game/entity/action/IActionContext";
import Component from "@wayward/game/ui/component/Component";
import Text from "@wayward/game/ui/component/Text";
export declare enum ActionHistoryClasses {
    Main = "debug-tools-action-history",
    Section = "debug-tools-action-history-section",
    SectionCounts = "debug-tools-action-history-section-counts",
    CountItem = "debug-tools-action-history-section-counts-item",
    SectionHistory = "debug-tools-action-history-section-history",
    HistoryItem = "debug-tools-action-history-section-history-item",
    HistoryTickLabel = "debug-tools-action-history-section-history-tick-label"
}
export default class ActionHistory extends Component {
    readonly entity?: Entity<unknown, number, import("@wayward/game/game/reference/IReferenceManager").EntityReferenceTypes, unknown> | undefined;
    readonly counts?: Component;
    readonly history: Component;
    readonly countMap: PartialRecord<ActionType, Text>;
    constructor(entity?: Entity<unknown, number, import("@wayward/game/game/reference/IReferenceManager").EntityReferenceTypes, unknown> | undefined);
    protected onUpdateHistoricalActionCount(executor: Entity, action: ActionType, count: number, oldCount: number): void;
    protected onAddHistoricalAction(game: Game, executor: Entity, context: IActionContext): void;
    private lastTick;
    private renderHistoryItem;
}

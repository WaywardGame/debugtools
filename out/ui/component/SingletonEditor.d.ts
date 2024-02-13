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
import Component from "@wayward/game/ui/component/Component";
import BaseDetails from "@wayward/game/ui/component/Details";
import { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";
export interface ISingletonEditorCoreEvents extends Events<Component> {
    claim(): any;
    unclaim(): any;
}
declare abstract class SingletonEditor<ARGS extends any[]> extends Component {
    readonly event: IEventEmitter<this, ISingletonEditorCoreEvents>;
    claimant?: WeakRef<Component>;
    abstract apply(...args: ARGS): any;
    claim(by: SingletonEditor.Details<ARGS>, ...args: ARGS): this;
    unclaim(by: SingletonEditor.Details<ARGS>): this;
    isValid(): boolean;
    private owner?;
    protected onRooted(): void;
}
declare namespace SingletonEditor {
    abstract class Details<ARGS extends any[]> extends BaseDetails {
        abstract createEditor(): SingletonEditor<ARGS>;
        abstract getArgs(): ARGS;
        protected onToggle(open: boolean): void;
        protected onWillRemove(): void;
        private getEditor;
    }
}
export default SingletonEditor;

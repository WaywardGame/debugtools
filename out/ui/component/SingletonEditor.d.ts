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

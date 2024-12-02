import Component from "@wayward/game/ui/component/Component";
import BaseDetails from "@wayward/game/ui/component/Details";
import type Screen from "@wayward/game/ui/screen/Screen";
import type Dialog from "@wayward/game/ui/screen/screens/game/component/Dialog";
import type { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";
import { OwnEventHandler } from "@wayward/utilities/event/EventManager";
import { weakRefify } from "@wayward/utilities/object/Objects";

export interface ISingletonEditorCoreEvents extends Events<Component> {
	claim(): any;
	unclaim(): any;
}

abstract class SingletonEditor<ARGS extends any[]> extends Component {
	declare public event: IEventEmitter<this, ISingletonEditorCoreEvents>;

	public claimant?: WeakRef<Component>;

	public abstract apply(...args: ARGS): any;

	public claim(by: SingletonEditor.Details<ARGS>, ...args: ARGS): this {
		if (this.claimant?.deref() !== by) {
			this.claimant = new WeakRef(by);
			this.event.emit("claim");
			this.apply(...args);
		}

		return this;
	}

	public unclaim(by: SingletonEditor.Details<ARGS>): this {
		const claimant = this.claimant?.deref();
		if (claimant === undefined || claimant === by) {
			delete this.claimant;
			this.event.emit("unclaim");
			const owner = this.owner?.deref();
			if (owner) {
				this.store(owner);
			}
		}

		return this;
	}

	public isValid(): boolean {
		return !this.owner || !!this.owner?.deref()?.rooted;
	}

	private owner?: WeakRef<Dialog | Screen>;
	@OwnEventHandler(SingletonEditor, "rooted")
	protected onRooted(): void {
		this.owner ??= weakRefify(this.getDialog() ?? this.getScreen());
	}
}

namespace SingletonEditor {

	export abstract class Details<ARGS extends any[]> extends BaseDetails {

		public abstract createEditor(): SingletonEditor<ARGS>;
		public abstract getArgs(): ARGS;

		@OwnEventHandler(Details, "toggle")
		protected onToggle(open: boolean): void {
			if (open) {
				const editor = this.getEditor()
					.claim(this, ...this.getArgs())
					.appendTo(this);

				void editor.event.waitFor(["claim", "unclaim"]).then(() => this.close());
			} else {
				this.getEditor().unclaim(this);
			}
		}

		@OwnEventHandler(Details, "willRemove")
		protected onWillRemove(): void {
			this.getEditor().unclaim(this);
		}

		private getEditor() {
			const storage = this.constructor as { editor?: SingletonEditor<ARGS> };
			if (!storage.editor?.isValid()) {
				storage.editor = this.createEditor();
			}

			return storage.editor;
		}
	}
}

export default SingletonEditor;

import type Tile from "@wayward/game/game/tile/Tile";
import type Component from "@wayward/game/ui/component/Component";
import type { TranslationGenerator } from "@wayward/game/ui/component/IComponent";
import TabDialogPanel from "@wayward/game/ui/screen/screens/game/component/TabDialogPanel";
import type { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";

export type TabInformation = [number, TranslationGenerator];

export interface IInspectInformationSectionEvents extends Events<Component> {
	change(): any;
	update(): any;
	switchAway(): any;
	switchTo(): any;
}

export default abstract class InspectInformationSection extends TabDialogPanel {
	declare public event: IEventEmitter<this, IInspectInformationSectionEvents>;

	private shouldLog = false;
	public get willLog(): boolean {
		return this.shouldLog;
	}

	public setTab(tab: number): this {
		return this;
	}
	public setShouldLog(): void {
		this.shouldLog = true;
	}
	public resetWillLog(): void {
		this.shouldLog = false;
	}

	public abstract getTabs(): TabInformation[];
	public abstract update(tile: Tile): void;
	public abstract logUpdate(): void;
}

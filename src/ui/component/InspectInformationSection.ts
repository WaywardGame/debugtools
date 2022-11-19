import { Events, IEventEmitter } from "event/EventEmitter";
import { ITile } from "game/tile/ITerrain";
import Component from "ui/component/Component";
import { TranslationGenerator } from "ui/component/IComponent";
import TabDialogPanel from "ui/screen/screens/game/component/TabDialogPanel";
import { IVector2 } from "utilities/math/IVector";

export type TabInformation = [number, TranslationGenerator];

export interface IInspectInformationSectionEvents extends Events<Component> {
	change(): any;
	update(): any;
	switchAway(): any;
	switchTo(): any;
}

export default abstract class InspectInformationSection extends TabDialogPanel {
	public override event: IEventEmitter<this, IInspectInformationSectionEvents>;

	private shouldLog = false;
	public get willLog() { return this.shouldLog; }

	public setTab(tab: number) { return this; }
	public setShouldLog() { this.shouldLog = true; }
	public resetWillLog() { this.shouldLog = false; }

	public abstract getTabs(): TabInformation[];
	public abstract update(position: IVector2, tile: ITile): void;
	public abstract logUpdate(): void;
}

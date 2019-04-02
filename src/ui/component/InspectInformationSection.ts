import { ExtendedEvents } from "event/EventEmitter";
import Component from "newui/component/Component";
import { TranslationGenerator } from "newui/component/IComponent";
import { ITile } from "tile/ITerrain";
import { IVector2 } from "utilities/math/IVector";

export type TabInformation = [number, TranslationGenerator];

interface IInspectInformationSectionEvents {
	change(): any;
	update(): any;
	switchAway(): any;
	switchTo(): any;
}

export default abstract class InspectInformationSection extends Component {
	@Override public event: ExtendedEvents<this, Component, IInspectInformationSectionEvents>;

	private shouldLog = false;
	public get willLog() { return this.shouldLog; }

	public setTab(tab: number) { return this; }
	public setShouldLog() { this.shouldLog = true; }
	public resetWillLog() { this.shouldLog = false; }

	public abstract getTabs(): TabInformation[];
	public abstract update(position: IVector2, tile: ITile): void;
	public abstract logUpdate(): void;
}

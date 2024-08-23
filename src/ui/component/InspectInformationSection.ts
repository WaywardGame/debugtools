/*!
 * Copyright 2011-2024 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import Tile from "@wayward/game/game/tile/Tile";
import Component from "@wayward/game/ui/component/Component";
import { TranslationGenerator } from "@wayward/game/ui/component/IComponent";
import TabDialogPanel from "@wayward/game/ui/screen/screens/game/component/TabDialogPanel";
import { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";

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
	public get willLog() { return this.shouldLog; }

	public setTab(tab: number): this { return this; }
	public setShouldLog(): void { this.shouldLog = true; }
	public resetWillLog(): void { this.shouldLog = false; }

	public abstract getTabs(): TabInformation[];
	public abstract update(tile: Tile): void;
	public abstract logUpdate(): void;
}

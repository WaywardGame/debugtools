import { EventHandler } from "event/EventManager";
import Component from "newui/component/Component";
import Dropdown from "newui/component/Dropdown";
import { IText, TooltipLocation } from "newui/component/IComponent";
import { Paragraph } from "newui/component/Text";
import { BindCatcherApi } from "newui/IBindingManager";
import { SelectDirection } from "newui/INewUi";
import newui from "newui/NewUi";
import Tooltip from "newui/tooltip/Tooltip";
import Arrays, { Tuple } from "utilities/Arrays";
import { sleep } from "utilities/Async";
import Log, { LogSource } from "utilities/Log";
import StackMap from "utilities/map/StackMap";
import { IVector2 } from "utilities/math/IVector";
import Stream from "utilities/stream/Stream";

const REGEX_GROUP = /^group:(.*)$/;
const REGEX_GROUP_END = /(^| )group:([^\s]*)$/;

export default abstract class GroupDropdown<O extends string | number, G extends number> extends Dropdown<O> {

	private groups: Map<string, [G, IText?]>;
	private tooltip?: GroupDropdownTooltip;
	private lastGroupText?: string;
	private readonly wordToGroups = new StackMap<string, [G, IText?][]>(undefined, 100);

	public constructor() {
		super();
		this.retainLastFilter();
	}

	////////////////////////////////////
	// Match groups!
	//

	@Override protected optionMatchesFilterWord(word: string, option: O, text: string) {
		if (super.optionMatchesFilterWord(word, option, text)) {
			return true;
		}

		// const [group] = this.getGroupMap().get(groupName!) || Arrays.EMPTY;
		// if (!group) {
		// 	return false;
		// }

		// return this.isInGroup(option, group);

		const groups = this.wordToGroups.getOrDefault(word, () => {
			const [, groupName] = word.match(REGEX_GROUP) || Arrays.EMPTY;

			return !groupName ? [] : this.getGroupMap().entryStream()
				.filter(([name]) => name.startsWith(groupName))
				.toArray(([, data]) => data);
		}, true);

		return groups.length ? groups.some(([group]) => this.isInGroup(option, group)) : false;
	}

	////////////////////////////////////
	// Override me!
	//

	protected abstract getGroups(): Iterable<G>;
	protected abstract getGroupName(group: G): string;
	protected abstract isInGroup(option: O, group: G): boolean;

	@Override protected isMouseWithin(api: BindCatcherApi) {
		return super.isMouseWithin(api) || (!!this.tooltip && api.isMouseWithin(this.tooltip));
	}

	////////////////////////////////////
	// Events!
	//

	@EventHandler<Dropdown>("self")("open")
	protected onOpen() {
		this.updateTooltip()
			.setLocation(this.openedDirection() === SelectDirection.Up ? TooltipLocation.BottomRight : TooltipLocation.TopRight)
			.show();
	}

	@EventHandler<Dropdown>("self")("close")
	protected onClose() {
		if (this.tooltip) {
			this.tooltip.hide();
		}
	}

	@EventHandler<Dropdown>("self")("filterChange")
	protected onFilterChange() {
		this.updateTooltip();
	}

	@Bound protected updateTooltip() {
		const tooltip = this.getTooltip();

		const inputText = this.inputButton.getInputText();

		let currentGroupText = "";
		const lastGroupMatch = inputText.match(REGEX_GROUP_END);
		if (lastGroupMatch) {
			currentGroupText = lastGroupMatch[2];
		}

		if (currentGroupText === this.lastGroupText) {
			return tooltip;
		}

		this.lastGroupText = currentGroupText;

		for (const [group, [, component]] of this.getGroupMap().entries()) {
			component!.toggle(group.startsWith(currentGroupText));
		}

		return tooltip;
	}

	@Bound @Override protected onRegenerateBox() {
		super.onRegenerateBox();
		const tooltip = this.getTooltip();
		if (tooltip) {
			Log.warn("DebugTools", LogSource.NewUi, LogSource.Reflow)("GroupDropdown.onRegenerateBox() getComputedStyle", this);
			const style = getComputedStyle(this.element);
			tooltip.style.set("max-height", `calc(50vh - ${style.getPropertyValue("--block-height")})`);
		}
	}

	////////////////////////////////////
	// Misc
	//

	private getTooltip() {
		if (!this.tooltip) {
			this.tooltip = new GroupDropdownTooltip(this.inputButton)
				.append(...this.getGroupMap()
					.entryStream()
					.sorted(([a], [b]) => a.localeCompare(b))
					.map(([group, data]) => data[1] = new Paragraph()
						.listen("mousedown", () => this.addGroup(group))
						.setText(() => [{ content: `group:${group}` }])))
				.event.subscribe("willRemove", c => c.store() && false)
				.appendTo(newui.tooltips.tooltipWrapper);
		}

		return this.tooltip;
	}

	private getGroupMap() {
		return this.groups = this.groups || Stream.from(this.getGroups())
			.map(group => Tuple(this.getGroupName(group).toLowerCase().replace(/\s*/g, ""), Tuple(group)))
			.filter(([group]) => group)
			.toMap();
	}

	private addGroup(group: string) {
		const inputText = this.inputButton.getInputText();
		let currentGroupText = "";
		const lastGroupMatch = inputText.match(REGEX_GROUP_END);
		if (lastGroupMatch) {
			currentGroupText = lastGroupMatch[2];
		}

		if (currentGroupText && group.startsWith(currentGroupText))
			this.inputButton.setInputText(`${inputText.slice(0, currentGroupText.length * -1)}group:${group} `);
		else
			this.inputButton.setInputText(`${inputText}${inputText.length && !inputText.endsWith(" ") ? " " : ""}group:${group} `);

		Log.warn(LogSource.NewUi, LogSource.Reflow)("GroupDropdown.focus() focus", this);
		this.inputButton.focus();
	}
}

class GroupDropdownTooltip extends Tooltip {

	public constructor(source: Component) {
		super(source);
		this.classes.add("debug-tools-group-dropdown-tooltip");
		this.setForceShown();
	}

	@Override public updatePosition(position?: IVector2, force?: boolean) {
		super.updatePosition(position, force);

		const dropdown = Component.get<Dropdown>(this.source.closest(".menu-dropdown"))!;

		const sourceBox = this.source.getBox();
		const tooltipBox = this.getBox();
		if (sourceBox.right + tooltipBox.width + 20 > newui.windowWidth) {
			this.setLocation(dropdown.openedDirection() === SelectDirection.Up ? TooltipLocation.BottomLeft : TooltipLocation.TopLeft);
		} else {
			this.setLocation(dropdown.openedDirection() === SelectDirection.Up ? TooltipLocation.BottomRight : TooltipLocation.TopRight);
		}

		return this;
	}

	@Override protected onShow() {
		this.updatePosition();
		(async () => {
			await sleep(20);
			this.updatePosition();
			this.classes.remove("hidden");
		})();
	}
}

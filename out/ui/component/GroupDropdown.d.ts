import Component from "newui/component/Component";
import Dropdown from "newui/component/Dropdown";
import { BindCatcherApi } from "newui/IBindingManager";
import Tooltip from "newui/tooltip/Tooltip";
import { IVector2 } from "utilities/math/IVector";
export default abstract class GroupDropdown<O extends string | number, G extends number> extends Dropdown<O> {
    private groups;
    private tooltip?;
    private lastGroupText?;
    private readonly wordToGroups;
    constructor();
    protected optionMatchesFilterWord(word: string, option: O, text: string): boolean;
    protected abstract getGroups(): Iterable<G>;
    protected abstract getGroupName(group: G): string;
    protected abstract isInGroup(option: O, group: G): boolean;
    protected isMouseWithin(api: BindCatcherApi): boolean;
    protected onOpen(): void;
    protected onClose(): void;
    protected onFilterChange(): void;
    protected updateTooltip(): GroupDropdownTooltip;
    protected onRegenerateBox(): void;
    private getTooltip;
    private getGroupMap;
    private addGroup;
}
declare class GroupDropdownTooltip extends Tooltip {
    constructor(source: Component);
    updatePosition(position?: IVector2, force?: boolean): this;
    protected onShow(): void;
}
export {};

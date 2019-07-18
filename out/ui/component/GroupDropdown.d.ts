import Dropdown from "newui/component/Dropdown";
export default abstract class GroupDropdown<O extends string | number, G extends number> extends Dropdown<O> {
    private groups;
    protected optionMatchesFilterWord(word: string, option: O, text: string): boolean;
    protected abstract getGroups(): Iterable<G>;
    protected abstract getGroupName(group: G): string;
    protected abstract isInGroup(option: O, group: G): boolean;
    private getGroupMap;
}

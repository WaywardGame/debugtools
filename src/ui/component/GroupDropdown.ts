import Dropdown from "newui/component/Dropdown";
import Arrays, { tuple } from "utilities/Arrays";
import Stream from "utilities/stream/Stream";

const REGEX_GROUP = /^group:(.*)$/;

export default abstract class GroupDropdown<O extends string | number, G extends number> extends Dropdown<O> {

	private groups: Map<string, G>;

	@Override protected optionMatchesFilterWord(word: string, option: O, text: string) {
		if (super.optionMatchesFilterWord(word, option, text)) {
			return true;
		}

		const [, groupName] = word.match(REGEX_GROUP) || Arrays.EMPTY;
		const group = this.getGroupMap().get(groupName!);
		if (!group) {
			return false;
		}

		return this.isInGroup(option, group);
	}

	protected abstract getGroups(): Iterable<G>;
	protected abstract getGroupName(group: G): string;
	protected abstract isInGroup(option: O, group: G): boolean;

	private getGroupMap() {
		return this.groups = this.groups || Stream.from(this.getGroups())
			.map(group => tuple(this.getGroupName(group).toLowerCase().replace(/\s*/g, ""), group))
			.toMap();
	}
}

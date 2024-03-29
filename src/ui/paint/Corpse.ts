/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */

import { Events, IEventEmitter } from "event/EventEmitter";
import { CreatureType } from "game/entity/creature/ICreature";
import { CheckButton } from "ui/component/CheckButton";
import Component from "ui/component/Component";
import CorpseDropdown from "ui/component/dropdown/CorpseDropdown";
import { LabelledRow } from "ui/component/LabelledRow";
import { Bound } from "utilities/Decorators";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";


export default class CorpsePaint extends Component implements IPaintSection {
	public override event: IEventEmitter<this, Events<IPaintSection>>;

	private readonly dropdown: CorpseDropdown<"nochange" | "remove">;
	private readonly aberrantCheckButton: CheckButton;
	private readonly replaceExisting: CheckButton;

	private corpse: CreatureType | "remove" | undefined;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelCorpse)))
			.append(this.dropdown = new CorpseDropdown("nochange", [
				["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
				["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
			])
				.event.subscribe("selection", this.changeCorpse))
			.appendTo(this);

		this.replaceExisting = new CheckButton()
			.hide()
			.setText(translation(DebugToolsTranslation.ButtonReplaceExisting))
			.appendTo(this);

		this.aberrantCheckButton = new CheckButton()
			.hide()
			.setText(translation(DebugToolsTranslation.ButtonToggleAberrant))
			.appendTo(this);
	}

	public getTilePaintData() {
		return {
			corpse: {
				type: this.corpse,
				aberrant: this.aberrantCheckButton.checked,
				replaceExisting: this.replaceExisting.checked,
			},
		};
	}

	public isChanging() {
		return this.corpse !== undefined || this.replaceExisting.checked;
	}

	public reset() {
		this.dropdown.select("nochange");
	}

	@Bound
	private changeCorpse(_: any, corpse: CreatureType | "remove" | "nochange") {
		this.corpse = corpse === "nochange" ? undefined : corpse === "remove" ? "remove" : corpse;

		const isReplaceable = this.corpse !== undefined && this.corpse !== "remove";
		this.aberrantCheckButton.toggle(isReplaceable);
		this.replaceExisting.toggle(isReplaceable);
		if (!isReplaceable) this.replaceExisting.setChecked(false);

		this.event.emit("change");
	}
}

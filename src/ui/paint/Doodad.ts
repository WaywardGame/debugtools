import type { DoodadType } from "@wayward/game/game/doodad/IDoodad";
import { Quality } from "@wayward/game/game/IObject";
import Dictionary from "@wayward/game/language/Dictionary";
import { TextContext } from "@wayward/game/language/ITranslation";
import Translation from "@wayward/game/language/Translation";
import type Button from "@wayward/game/ui/component/Button";
import Component from "@wayward/game/ui/component/Component";
import Dropdown from "@wayward/game/ui/component/Dropdown";
import DoodadDropdown from "@wayward/game/ui/component/dropdown/DoodadDropdown";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import Enums from "@wayward/game/utilities/enum/Enums";
import { Tuple } from "@wayward/utilities/collection/Tuple";
import { Bound } from "@wayward/utilities/Decorators";
import type { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import type { IPaintSection } from "../panel/PaintPanel";

export default class DoodadPaint extends Component implements IPaintSection {
	declare public event: IEventEmitter<this, Events<IPaintSection>>;

	private readonly dropdown: DoodadDropdown<"nochange" | "remove">;
	private readonly qualityWrapper: Component;
	private readonly qualityDropdown: Dropdown<Quality>;

	private doodad: DoodadType | "remove" | undefined;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelDoodad)))
			.append(this.dropdown = new DoodadDropdown<"nochange" | "remove">("nochange", [
				["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
				["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
			])
				.event.subscribe("selection", this.changeDoodad))
			.appendTo(this);

		this.qualityWrapper = new Component()
			.hide()
			.append(new LabelledRow()
				.classes.add("dropdown-label")
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelQuality)))
				.append(this.qualityDropdown = new Dropdown<Quality>()
					.setRefreshMethod(() => ({
						defaultOption: Quality.Random,
						options: Enums.values(Quality)
							.map(quality => Tuple(quality, Translation.get(Dictionary.Quality, quality).inContext(TextContext.Title)))
							.map(([id, t]) => Tuple(id, (option: Button) => option.setText(t))),
					}))
					.event.subscribe("selection", this.onChange)))
			.appendTo(this);
	}

	public getTilePaintData(): { doodad: { type: DoodadType | "remove"; quality?: Quality } } | undefined {
		return this.doodad === undefined ? undefined : {
			doodad: {
				type: this.doodad,
				quality: this.doodad === "remove" ? undefined : this.qualityDropdown.selectedOption,
			},
		};
	}

	public isChanging(): boolean {
		return this.doodad !== undefined;
	}

	public reset(): void {
		this.dropdown.select("nochange");
	}

	@Bound
	private changeDoodad(_: any, doodad: DoodadType | "nochange" | "remove"): void {
		this.doodad = doodad === "nochange" ? undefined : doodad === "remove" ? "remove" : doodad;
		this.qualityWrapper.toggle(this.doodad !== undefined && this.doodad !== "remove");

		this.event.emit("change");
	}

	@Bound
	private onChange(): void {
		this.event.emit("change");
	}
}

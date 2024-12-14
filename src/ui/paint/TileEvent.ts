import type { TileEventType } from "@wayward/game/game/tile/ITileEvent";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import Component from "@wayward/game/ui/component/Component";
import TileEventDropdown from "@wayward/game/ui/component/dropdown/TileEventDropdown";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import { Bound } from "@wayward/utilities/Decorators";
import type { Events, IEventEmitter } from "@wayward/utilities/event/EventEmitter";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import type { IPaintSection } from "../panel/PaintPanel";

export default class TileEventPaint extends Component implements IPaintSection {
	declare public event: IEventEmitter<this, Events<IPaintSection>>;

	private readonly dropdown: TileEventDropdown<"nochange" | "remove">;
	private readonly replaceExisting: CheckButton;

	private tileEvent: TileEventType | "remove" | undefined;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelTileEvent)))
			.append(this.dropdown = new TileEventDropdown("nochange", [
				["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
				["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
			])
				.event.subscribe("selection", this.changeEvent))
			.appendTo(this);

		this.replaceExisting = new CheckButton()
			.hide()
			.setText(translation(DebugToolsTranslation.ButtonReplaceExisting))
			.appendTo(this);
	}

	public getTilePaintData(): { tileEvent: { type: TileEventType | "remove" | undefined; replaceExisting: boolean } } {
		return {
			tileEvent: {
				type: this.tileEvent,
				replaceExisting: this.replaceExisting.checked,
			},
		};
	}

	public isChanging(): boolean {
		return this.tileEvent !== undefined;
	}

	public reset(): void {
		this.dropdown.select("nochange");
	}

	@Bound
	private changeEvent(_: any, event: TileEventType | "nochange" | "remove"): void {
		this.tileEvent = event === "nochange" ? undefined : event === "remove" ? "remove" : event;

		const isReplaceable = this.tileEvent !== undefined && this.tileEvent !== "remove";
		this.replaceExisting.toggle(isReplaceable);
		if (!isReplaceable) {
			this.replaceExisting.setChecked(false);
		}

		this.event.emit("change");
	}
}

import { Events, IEventEmitter } from "event/EventEmitter";
import { TileEventType } from "game/tile/ITileEvent";
import { CheckButton } from "ui/component/CheckButton";
import Component from "ui/component/Component";
import TileEventDropdown from "ui/component/dropdown/TileEventDropdown";
import { LabelledRow } from "ui/component/LabelledRow";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";


export default class TileEventPaint extends Component implements IPaintSection {
	@Override public event: IEventEmitter<this, Events<IPaintSection>>;

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

	public getTilePaintData() {
		return {
			tileEvent: {
				type: this.tileEvent,
				replaceExisting: this.replaceExisting.checked,
			},
		};
	}

	public isChanging() {
		return this.tileEvent !== undefined;
	}

	public reset() {
		this.dropdown.select("nochange");
	}

	@Bound
	private changeEvent(_: any, event: TileEventType | "nochange" | "remove") {
		this.tileEvent = event === "nochange" ? undefined : event === "remove" ? "remove" : event;

		const isReplaceable = this.tileEvent !== undefined && this.tileEvent !== "remove";
		this.replaceExisting.toggle(isReplaceable);
		if (!isReplaceable) this.replaceExisting.setChecked(false);

		this.event.emit("change");
	}
}

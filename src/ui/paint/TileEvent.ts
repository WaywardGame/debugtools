import { SentenceCaseStyle } from "Enums";
import Translation from "language/Translation";
import { CheckButton } from "newui/component/CheckButton";
import Component from "newui/component/Component";
import Dropdown, { DropdownEvent, IDropdownOption } from "newui/component/Dropdown";
import { TranslationGenerator } from "newui/component/IComponent";
import { LabelledRow } from "newui/component/LabelledRow";
import Text from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import { TileEventType } from "tile/ITileEvent";
import tileEventDescriptions from "tile/TileEvents";
import Collectors from "utilities/Collectors";
import Enums from "utilities/enum/Enums";
import { Bound } from "utilities/Objects";
import { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import { IPaintSection } from "../panel/PaintPanel";

export default class TileEventPaint extends Component implements IPaintSection {
	private readonly dropdown: Dropdown<"nochange" | "remove" | keyof typeof TileEventType>;
	private readonly replaceExisting: CheckButton;

	private tileEvent: TileEventType | "remove" | undefined;

	public constructor(api: UiApi) {
		super(api);

		new LabelledRow(api)
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelTileEvent)))
			.append(this.dropdown = new Dropdown<"nochange" | "remove" | keyof typeof TileEventType>(api)
				.setRefreshMethod(() => ({
					defaultOption: "nochange",
					options: ([
						["nochange", option => option.setText(translation(DebugToolsTranslation.PaintNoChange))],
						["remove", option => option.setText(translation(DebugToolsTranslation.PaintRemove))],
					] as IDropdownOption<"nochange" | "remove" | keyof typeof TileEventType>[]).values().include(Enums.values(TileEventType)
						.map<[keyof typeof TileEventType, TranslationGenerator]>(event => [
							TileEventType[event] as keyof typeof TileEventType,
							Translation.generator(game.getNameFromDescription(tileEventDescriptions[event], SentenceCaseStyle.Title)),
						])
						.collect(Collectors.toArray)
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.values()
						.map<IDropdownOption<"nochange" | "remove" | keyof typeof TileEventType>>(([id, t]) => [id, option => option.setText(t)])),
				}))
				.on(DropdownEvent.Selection, this.changeEvent))
			.appendTo(this);

		this.replaceExisting = new CheckButton(api)
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
	private changeEvent(_: any, event: keyof typeof TileEventType | "nochange" | "remove") {
		this.tileEvent = event === "nochange" ? undefined : event === "remove" ? "remove" : TileEventType[event];

		const isReplaceable = this.tileEvent !== undefined && this.tileEvent !== "remove";
		this.replaceExisting.toggle(isReplaceable);
		if (!isReplaceable) this.replaceExisting.setChecked(false);
	}
}

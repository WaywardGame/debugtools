import type Translation from "@wayward/game/language/Translation";
import Dictionary from "@wayward/game/language/Dictionary";
import EnumDropdown from "@wayward/game/ui/component/dropdown/EnumDropdown";
import Button from "@wayward/game/ui/component/Button";
import { CurseEventType } from "@wayward/game/game/curse/ICurse";
import SetNight from "../../action/SetNight";
import SpawnCurseEvent from "../../action/SpawnCurseEvent";
import ClearCurseEvents from "../../action/ClearCurseEvents";
import DebugToolsPanel from "../component/DebugToolsPanel";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import Enums from "@wayward/game/utilities/enum/Enums";
import CurseEventDefinitions from "@wayward/game/game/curse/CurseEventDefinitions";
import SkipCurseEventTimers from "../../action/SkipCurseEventTimers";
import SetDay from "../../action/SetDay";
import { BlockRow } from "@wayward/game/ui/component/BlockRow";
import CheckButtonRange from "@wayward/game/ui/component/CheckButtonRange";
import Mod from "@wayward/game/mod/Mod";
import type DebugToolsMod from "../../DebugTools";
import SetPlayerData from "../../action/SetPlayerData";

const DebugTools = Mod.get<DebugToolsMod>();

export default class CursePanel extends DebugToolsPanel {

	public constructor() {
		super();

		new CheckButtonRange()
			.setText(translation(DebugToolsTranslation.CurseOverride))
			.setRefreshMethod(() => DebugTools?.instance.getPlayerData(localPlayer, "curseOverride") !== undefined)
			.editRange(range => (range
				.setMin(0)
				.setMax(100)
				.setStep(0.1)
				.setRefreshMethod(() => (DebugTools?.instance.getPlayerData(localPlayer, "curseOverride") ?? 0) * 100)
			))
			.event.subscribeUnsafe("change", (_, value) => SetPlayerData.execute(localPlayer, localPlayer, "curseOverride", value !== undefined ? value / 100 : undefined))
			.appendTo(this);

		new BlockRow()
			.append((new Button()
				.setText(translation(DebugToolsTranslation.SetNight))
				.event.subscribe("activate", () => void SetNight.execute(localPlayer))
			))
			.append((new Button()
				.setText(translation(DebugToolsTranslation.SetDay))
				.event.subscribe("activate", () => void SetDay.execute(localPlayer))
			))
			.appendTo(this);

		const dropdownEvent = new EnumDropdown(CurseEventType, Dictionary.CurseEvent, CurseEventType.None)
			.setExcluded(...Enums.values(CurseEventType).filter(type => type !== CurseEventType.None && !CurseEventDefinitions[type]))
			;

		new LabelledRow()
			.classes.add("debug-tools-auto-1fr-auto")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.SpawnCurseEvent)))
			.append(dropdownEvent)
			.append(new Button()
				.setText(translation(DebugToolsTranslation.ButtonExecute))
				.event.subscribe("activate", () => {
					if (dropdownEvent.selectedOption) {
						void SpawnCurseEvent.execute(localPlayer, dropdownEvent.selectedOption);
					}
				}))
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.SkipCurseEventTimers))
			.event.subscribe("activate", () => void SkipCurseEventTimers.execute(localPlayer))
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.ClearCurseEvents))
			.event.subscribe("activate", () => void ClearCurseEvents.execute(localPlayer))
			.appendTo(this);
	}

	public override getTranslation(): DebugToolsTranslation | Translation {
		return DebugToolsTranslation.PanelCurse;
	}
}

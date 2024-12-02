import { EventBus } from "@wayward/game/event/EventBuses";
import { EventHandler } from "@wayward/game/event/EventManager";
import { NPCType } from "@wayward/game/game/entity/npc/INPCs";
import type { INPCManagerSpawnTracker } from "@wayward/game/game/entity/npc/NPCManager";
import Dictionary from "@wayward/game/language/Dictionary";
import { MiscTranslation } from "@wayward/game/language/dictionary/Misc";
import { TextContext } from "@wayward/game/language/ITranslation";
import Translation from "@wayward/game/language/Translation";
import Mod from "@wayward/game/mod/Mod";
import Button from "@wayward/game/ui/component/Button";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import Text, { Heading } from "@wayward/game/ui/component/Text";
import Enums from "@wayward/game/utilities/enum/Enums";
import Arrays from "@wayward/utilities/collection/Arrays";
import { OwnEventHandler } from "@wayward/utilities/event/EventManager";
import Time, { days } from "@wayward/utilities/Time";
import ResetNPCSpawnInterval from "../../action/ResetNPCSpawnInterval";
import type DebugTools from "../../DebugTools";
import type { ISaveData } from "../../IDebugTools";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";

export default class NPCPanel extends DebugToolsPanel {

	@Mod.instance<DebugTools>("Debug Tools")
	public readonly DEBUG_TOOLS: DebugTools;

	@Mod.saveData<DebugTools>("Debug Tools")
	public saveData: ISaveData;

	public readonly refreshables: Text[] = [];

	public constructor() {
		super();

		for (const type of Enums.values(NPCType)) {
			const options = localIsland.getGameOptions().npcs.spawning.get(type);
			if (!options?.chanceMultiplier || !options.count) {
				continue;
			}

			new Heading()
				.setText(translation(DebugToolsTranslation.HeadingNPCInterval)
					.addArgs(Translation.get(Dictionary.Npc, type).inContext(TextContext.Title)))
				.appendTo(this);

			new LabelledRow()
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelNPCIntervalTimeUntil)
					.passTo(Translation.colorizeImportance("secondary"))))
				.append(new Text().setText(Translation.colorizeImportance("primary")
					.addArgs(() => this.getTimeUntilIntervalEnd(type)))
					.schedule(Arrays.pushTo(this.refreshables)))
				.appendTo(this);

			new LabelledRow()
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelNPCIntervalLength)
					.passTo(Translation.colorizeImportance("secondary"))))
				.append(new Text().setText(Translation.colorizeImportance("primary")
					.addArgs(() => this.getTicksAsTotalTimeString(this.getSpawnInterval(type)?.length)
						?? Translation.misc(MiscTranslation.Unknown)))
					.schedule(Arrays.pushTo(this.refreshables)))
				.appendTo(this);

			new LabelledRow()
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelNPCIntervalSpawned)
					.passTo(Translation.colorizeImportance("secondary"))))
				.append(new Text().setText(Translation.colorizeImportance("primary")
					.addArgs(() => Translation.misc(MiscTranslation.ASlashB)
						.addArgs(this.getSpawnInterval(type)?.spawned ?? 0)
						.addArgs(this.getSpawnInterval(type)?.potentialSpawnCount ?? 0)))
					.schedule(Arrays.pushTo(this.refreshables)))
				.appendTo(this);

			new LabelledRow()
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelNPCIntervalChancesWere)
					.passTo(Translation.colorizeImportance("secondary"))))
				.append(new Text().setText(Translation.colorizeImportance("primary")
					.addArgs(() => this.getSpawnInterval(type)?.chances
						.map(chance => Translation.misc(MiscTranslation.Percent).addArgs(chance))
						.collect(Translation.formatList)))
					.schedule(Arrays.pushTo(this.refreshables)))
				.appendTo(this);

			new Button()
				.setText(translation(DebugToolsTranslation.ResetSpawnInterval))
				.event.subscribe("activate", () => ResetNPCSpawnInterval.execute(localPlayer, type))
				.appendTo(this);

			new LabelledRow()
				.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelNPCCount)
					.passTo(Translation.colorizeImportance("secondary"))))
				.append(new Text().setText(Translation.colorizeImportance("primary")
					.addArgs(() => Translation.misc(MiscTranslation.ASlashB)
						.addArgs(localIsland.npcs["getNPCTypeCount"](type))
						.addArgs(localIsland.npcs["getNPCTypeTargetCount"](type))))
					.schedule(Arrays.pushTo(this.refreshables)))
				.appendTo(this);
		}
	}

	public override getTranslation(): DebugToolsTranslation {
		return DebugToolsTranslation.PanelNPCs;
	}

	@EventHandler(EventBus.LocalIsland, "tickEnd")
	@EventHandler(EventBus.NPCManager, "endInterval")
	@EventHandler(EventBus.NPCManager, "startInterval")
	@EventHandler(EventBus.NPCManager, "intervalSpawn")
	protected onTickEnd(): void {
		for (const refreshable of this.refreshables) {
			refreshable.refresh();
		}
	}

	@OwnEventHandler(NPCPanel, "switchTo")
	protected onSwitchTo(): void {
		for (const refreshable of this.refreshables) {
			refreshable.refresh();
		}
	}

	private getSpawnInterval(type: NPCType): INPCManagerSpawnTracker | undefined {
		return localIsland.npcs["spawnIntervals"][type];
	}

	private getTimeUntilIntervalEnd(type: NPCType) {
		const intervalEnd = this.getSpawnInterval(type)?.intervalEnd;
		const now = game.time.ticks;
		if (intervalEnd === undefined || now >= intervalEnd) {
			return translation(DebugToolsTranslation.NPCIntervalInactive);
		}

		return this.getTicksAsTotalTimeString(intervalEnd - now);
	}

	private getTicksAsTotalTimeString(ticks?: number) {
		if (ticks === undefined) {
			return undefined;
		}

		const realTimeDayCount = Math.floor(days(ticks / game.time.dayLength));
		return Time.total(realTimeDayCount);
	}

}

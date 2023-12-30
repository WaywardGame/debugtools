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

import { SkillType } from "@wayward/game/game/entity/IHuman";
import Creature from "@wayward/game/game/entity/creature/Creature";
import NPC from "@wayward/game/game/entity/npc/NPC";
import Player from "@wayward/game/game/entity/player/Player";
import { TextContext } from "@wayward/game/language/ITranslation";
import Translation from "@wayward/game/language/Translation";
import Mod from "@wayward/game/mod/Mod";
import { BlockRow } from "@wayward/game/ui/component/BlockRow";
import Button from "@wayward/game/ui/component/Button";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import Dropdown, { IDropdownOption } from "@wayward/game/ui/component/Dropdown";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import { RangeRow } from "@wayward/game/ui/component/RangeRow";
import SkillDropdown from "@wayward/game/ui/component/dropdown/SkillDropdown";
import { Bound } from "@wayward/utilities/Decorators";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, IPlayerData, translation } from "../../IDebugTools";
import ClearNotes from "../../action/ClearNotes";
import ReplacePlayerData from "../../action/ReplacePlayerData";
import SetSkill from "../../action/SetSkill";
import ToggleNoClip from "../../action/ToggleNoClip";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
import SetPlayerData from "../../action/SetPlayerData";

export default class PlayerInformation extends InspectEntityInformationSubsection {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;

	private readonly rangeWeightBonus: RangeRow;
	private readonly checkButtonUnkillable: CheckButton;
	private readonly checkButtonNoClip: CheckButton;
	private readonly skillRangeRow: RangeRow;
	private readonly checkButtonPermissions?: CheckButton;
	private readonly playerToReplaceDataWithDropdown?: Dropdown<string>;
	private readonly buttonExecuteDataReplace: Button;
	private readonly clearNotesButton: Button;

	private skill: SkillType | "all" | "none" = "none";
	private player?: Player;

	public constructor() {
		super();

		this.DEBUG_TOOLS.event.until(this, "remove")
			.subscribe("playerDataChange", this.onPlayerDataChange);

		this.checkButtonPermissions = new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonTogglePermissions))
			.setRefreshMethod(() => this.player ? !!this.DEBUG_TOOLS.getPlayerData(this.player, "permissions") : false)
			.event.subscribe("toggle", this.togglePermissions)
			.appendTo(this);

		new BlockRow()
			.append(this.checkButtonNoClip = new CheckButton()
				.setText(translation(DebugToolsTranslation.ButtonToggleNoClip))
				.setRefreshMethod(() => this.player?.isFlying ?? false)
				.event.subscribe("toggle", this.toggleNoClip))
			.append(this.checkButtonUnkillable = new CheckButton()
				.setText(translation(DebugToolsTranslation.ButtonToggleUnkillable))
				.setRefreshMethod(() => this.player ? this.DEBUG_TOOLS.getPlayerData(this.player, "unkillable") === true : false)
				.event.subscribe("toggle", this.toggleUnkillable))
			.appendTo(this);

		this.rangeWeightBonus = new RangeRow()
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelWeightBonus)))
			.editRange(range => range
				.setMin(0)
				.setMax(10000)
				.setRefreshMethod(() => this.player ? this.DEBUG_TOOLS.getPlayerData(this.player, "weightBonus") : 0))
			.setDisplayValue(true)
			.event.subscribe("finish", this.setWeightBonus)
			.appendTo(this);

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelSkill)))
			.append(new SkillDropdown("none", [
				["none", option => option.setText(translation(DebugToolsTranslation.None))],
				["all", option => option.setText(translation(DebugToolsTranslation.MethodAll))],
			])
				.event.subscribe("selection", this.changeSkill))
			.appendTo(this);

		this.skillRangeRow = new RangeRow()
			.hide()
			.setLabel(label => label.setText(() => this.skill === undefined ? undefined
				: this.skill === "all" ? translation(DebugToolsTranslation.MethodAll)
					: Translation.skill(this.skill).inContext(TextContext.Title)))
			.setInheritTextTooltip()
			.editRange(range => range
				.setMin(0)
				.setMax(200)
				.setRefreshMethod(() => typeof (this.skill) === "number" ? (this.player?.skill.getCore(this.skill) ?? 0) : 0))
			.setDisplayValue(translation(DebugToolsTranslation.StatsPercentage).get)
			.event.subscribe("finish", this.setSkill)
			.appendTo(this);

		const replaceDataRow: LabelledRow = new LabelledRow()
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelReplaceData)))
			.appendTo(this);

		this.buttonExecuteDataReplace = new Button()
			.setText(translation(DebugToolsTranslation.ButtonReplace).addArgs(() => this.player?.getName()))
			.event.subscribe("activate", this.replaceData);

		replaceDataRow.append(this.playerToReplaceDataWithDropdown = new Dropdown<string>()
			.setRefreshMethod(() => {
				const playerOptions = game.playerManager.getAll(true, true, false, true)
					.filter(player => player !== this.player)
					.map((player): IDropdownOption<string> => [player.identifier, option => option.setText(player.getName())]);

				replaceDataRow.toggle(!!playerOptions.length);

				return {
					defaultOption: "",
					options: [
						["", option => option.setText(translation(DebugToolsTranslation.None))],
						...playerOptions,
					],
				};
			})
			.event.subscribe("selection", (_, selection) => this.buttonExecuteDataReplace.toggle(!!selection)))
			.append(this.buttonExecuteDataReplace);

		this.clearNotesButton = new Button()
			.setText(translation(DebugToolsTranslation.ButtonClearNotes))
			.event.subscribe("activate", () =>
				this.player && ClearNotes.execute(localPlayer, this.player))
			.appendTo(this);
	}

	public override update(entity: Creature | NPC | Player): void {
		if (this.player === entity) return;

		this.player = entity.asPlayer;
		this.toggle(!!this.player);
		this.clearNotesButton.toggle(!!this.player?.notes.notes.length);

		if (!this.player) return;

		this.event.emit("change");

		this.refresh();

		this.DEBUG_TOOLS.event.until(this, "remove", "change")
			.subscribe("playerDataChange", this.refresh);

		const entityEvents = this.player?.event.until(this, "switchAway");
		entityEvents.subscribe(["writtenNote", "clearNotes"], () => this.clearNotesButton.toggle(!!this.player?.notes.notes.length));
	}

	@Bound
	private refresh(): void {
		if (this.checkButtonPermissions) {
			this.checkButtonPermissions.toggle(multiplayer.isServer && this.player && !this.player.isLocalPlayer)
				.refresh();
		}

		this.checkButtonNoClip.refresh();
		this.checkButtonUnkillable.refresh();
		this.rangeWeightBonus.refresh();
		this.playerToReplaceDataWithDropdown?.refresh();
		this.buttonExecuteDataReplace.refreshText();
	}

	@Bound
	private changeSkill(_: any, skill: SkillType | "none" | "all"): void {
		this.skill = skill;
		this.skillRangeRow.refresh();

		this.skillRangeRow.toggle(skill !== "none");
	}

	@Bound
	private setSkill(_: any, value: number): void {
		SetSkill.execute(localPlayer, this.player!, typeof this.skill === "string" ? -1 : this.skill, value);
	}

	@Bound
	private toggleUnkillable(_: any, unkillable: boolean): void {
		if (this.DEBUG_TOOLS.getPlayerData(this.player!, "unkillable") === unkillable) return;

		SetPlayerData.execute(localPlayer, this.player!, "unkillable", unkillable);
	}

	@Bound
	private toggleNoClip(_: any, noclip: boolean): void {
		if (this.player?.isFlying === noclip) return;

		ToggleNoClip.execute(localPlayer, this.player!);
	}

	@Bound
	private togglePermissions(_: any, permissions: boolean): void {
		if (this.DEBUG_TOOLS.getPlayerData(this.player!, "permissions") === permissions) return;

		SetPlayerData.execute(localPlayer, this.player!, "permissions", permissions);
	}

	@Bound
	private setWeightBonus(_: any, weightBonus: number): void {
		if (this.DEBUG_TOOLS.getPlayerData(this.player!, "weightBonus") === weightBonus) return;

		SetPlayerData.execute(localPlayer, this.player!, "weightBonus", weightBonus);
	}

	@Bound
	private onPlayerDataChange<K extends keyof IPlayerData>(_: any, playerId: number, key: K, value: IPlayerData[K]): void {
		if (!this.player || playerId !== this.player.id) return;

		switch (key) {
			case "weightBonus":
				this.rangeWeightBonus.refresh();
				break;
			case "unkillable":
				this.checkButtonUnkillable.refresh();
				break;
			case "permissions":
				if (this.checkButtonPermissions) this.checkButtonPermissions.refresh();
				break;
		}
	}

	@Bound private replaceData(): void {
		const playerId = this.playerToReplaceDataWithDropdown?.selectedOption;
		const replaceFrom = playerId && game.playerManager.getByIdentifier(playerId, true);
		if (!playerId || !this.player || !replaceFrom) {
			return;
		}

		ReplacePlayerData.execute(localPlayer, this.player, replaceFrom);
	}
}

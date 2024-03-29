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

import { SkillType } from "game/entity/IHuman";
import Creature from "game/entity/creature/Creature";
import NPC from "game/entity/npc/NPC";
import Player from "game/entity/player/Player";
import { TextContext } from "language/ITranslation";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import { BlockRow } from "ui/component/BlockRow";
import Button from "ui/component/Button";
import { CheckButton } from "ui/component/CheckButton";
import Dropdown, { IDropdownOption } from "ui/component/Dropdown";
import { LabelledRow } from "ui/component/LabelledRow";
import { RangeRow } from "ui/component/RangeRow";
import SkillDropdown from "ui/component/dropdown/SkillDropdown";
import { Bound } from "utilities/Decorators";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, IPlayerData, translation } from "../../IDebugTools";
import ReplacePlayerData from "../../action/ReplacePlayerData";
import SetSkill from "../../action/SetSkill";
import SetWeightBonus from "../../action/SetWeightBonus";
import ToggleInvulnerable from "../../action/ToggleInvulnerable";
import ToggleNoClip from "../../action/ToggleNoClip";
import TogglePermissions from "../../action/TogglePermissions";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class PlayerInformation extends InspectEntityInformationSubsection {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;

	private readonly rangeWeightBonus: RangeRow;
	private readonly checkButtonInvulnerable: CheckButton;
	private readonly checkButtonNoClip: CheckButton;
	private readonly skillRangeRow: RangeRow;
	private readonly checkButtonPermissions?: CheckButton;
	private readonly playerToReplaceDataWithDropdown?: Dropdown<string>;
	private readonly buttonExecuteDataReplace: Button;

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
			.append(this.checkButtonInvulnerable = new CheckButton()
				.setText(translation(DebugToolsTranslation.ButtonToggleInvulnerable))
				.setRefreshMethod(() => this.player ? this.DEBUG_TOOLS.getPlayerData(this.player, "invulnerable") === true : false)
				.event.subscribe("toggle", this.toggleInvulnerable))
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
	}

	public override update(entity: Creature | NPC | Player) {
		if (this.player === entity) return;

		this.player = entity.asPlayer;
		this.toggle(!!this.player);

		if (!this.player) return;

		this.event.emit("change");

		this.refresh();

		this.DEBUG_TOOLS.event.until(this, "remove", "change")
			.subscribe("playerDataChange", this.refresh);
	}

	@Bound
	private refresh() {
		if (this.checkButtonPermissions) {
			this.checkButtonPermissions.toggle(multiplayer.isServer() && this.player && !this.player.isLocalPlayer())
				.refresh();
		}

		this.checkButtonNoClip.refresh();
		this.checkButtonInvulnerable.refresh();
		this.rangeWeightBonus.refresh();
		this.playerToReplaceDataWithDropdown?.refresh();
		this.buttonExecuteDataReplace.refreshText();
	}

	@Bound
	private changeSkill(_: any, skill: SkillType | "none" | "all") {
		this.skill = skill;
		this.skillRangeRow.refresh();

		this.skillRangeRow.toggle(skill !== "none");
	}

	@Bound
	private setSkill(_: any, value: number) {
		SetSkill.execute(localPlayer, this.player!, typeof this.skill === "string" ? -1 : this.skill, value);
	}

	@Bound
	private toggleInvulnerable(_: any, invulnerable: boolean) {
		if (this.DEBUG_TOOLS.getPlayerData(this.player!, "invulnerable") === invulnerable) return;

		ToggleInvulnerable.execute(localPlayer, this.player!, invulnerable);
	}

	@Bound
	private toggleNoClip(_: any, noclip: boolean) {
		if (this.player?.isFlying === noclip) return;

		ToggleNoClip.execute(localPlayer, this.player!);
	}

	@Bound
	private togglePermissions(_: any, permissions: boolean) {
		if (this.DEBUG_TOOLS.getPlayerData(this.player!, "permissions") === permissions) return;

		TogglePermissions.execute(localPlayer, this.player!, permissions);
	}

	@Bound
	private setWeightBonus(_: any, weightBonus: number) {
		if (this.DEBUG_TOOLS.getPlayerData(this.player!, "weightBonus") === weightBonus) return;

		SetWeightBonus.execute(localPlayer, this.player!, weightBonus);
	}

	@Bound
	private onPlayerDataChange<K extends keyof IPlayerData>(_: any, playerId: number, key: K, value: IPlayerData[K]) {
		if (!this.player || playerId !== this.player.id) return;

		switch (key) {
			case "weightBonus":
				this.rangeWeightBonus.refresh();
				break;
			case "invulnerable":
				this.checkButtonInvulnerable.refresh();
				break;
			case "permissions":
				if (this.checkButtonPermissions) this.checkButtonPermissions.refresh();
				break;
		}
	}

	@Bound private replaceData() {
		const playerId = this.playerToReplaceDataWithDropdown?.selection;
		const replaceFrom = playerId && game.playerManager.getByIdentifier(playerId, true);
		if (!playerId || !this.player || !replaceFrom) {
			return;
		}

		ReplacePlayerData.execute(localPlayer, this.player, replaceFrom);
	}
}

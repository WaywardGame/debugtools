import ActionExecutor from "entity/action/ActionExecutor";
import { ICreature } from "entity/creature/ICreature";
import Entity from "entity/Entity";
import { EntityType } from "entity/IEntity";
import { SkillType } from "entity/IHuman";
import { INPC } from "entity/npc/INPC";
import Player from "entity/player/Player";
import UiTranslation from "language/dictionary/UiTranslation";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import { BlockRow } from "newui/component/BlockRow";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Dropdown, { IDropdownOption } from "newui/component/Dropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeRow } from "newui/component/RangeRow";
import Text from "newui/component/Text";
import { tuple } from "utilities/Arrays";
import Enums from "utilities/enum/Enums";
import Stream from "utilities/stream/Stream";

import SetSkill from "../../action/SetSkill";
import SetWeightBonus from "../../action/SetWeightBonus";
import ToggleInvulnerable from "../../action/ToggleInvulnerable";
import ToggleNoClip from "../../action/ToggleNoClip";
import TogglePermissions from "../../action/TogglePermissions";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, IPlayerData, translation } from "../../IDebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class PlayerInformation extends InspectEntityInformationSubsection {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;

	private readonly rangeWeightBonus: RangeRow;
	private readonly checkButtonInvulnerable: CheckButton;
	private readonly checkButtonNoClip: CheckButton;
	private readonly skillRangeRow: RangeRow;
	private readonly checkButtonPermissions?: CheckButton;

	private skill?: SkillType;
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
				.setRefreshMethod(() => this.player ? !!this.DEBUG_TOOLS.getPlayerData(this.player, "noclip") : false)
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
				.setMax(1000)
				.setRefreshMethod(() => this.player ? this.DEBUG_TOOLS.getPlayerData(this.player, "weightBonus") : 0))
			.setDisplayValue(true)
			.event.subscribe("finish", this.setWeightBonus)
			.appendTo(this);

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelSkill)))
			.append(new Dropdown<keyof typeof SkillType | "none">()
				.setRefreshMethod(() => ({
					defaultOption: "none",
					options: Stream.of<IDropdownOption<keyof typeof SkillType | "none">[]>(["none", option => option.setText(translation(DebugToolsTranslation.None))])
						.merge(Enums.values(SkillType)
							.map(skill => tuple(SkillType[skill] as keyof typeof SkillType, Translation.generator(SkillType[skill])))
							.sorted(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
							.map(([id, t]) => tuple(id, (option: Button) => option.setText(t)))),
				}))
				.event.subscribe("selection", this.changeSkill))
			.appendTo(this);

		this.skillRangeRow = new RangeRow()
			.hide()
			.setLabel(label => label.setText(Translation.generator(() => this.skill === undefined ? "" : SkillType[this.skill])))
			.editRange(range => range
				.setMin(0)
				.setMax(100)
				.setRefreshMethod(() => this.skill !== undefined && this.player && this.skill in this.player.skills ? this.player.skills[this.skill]!.core : 0))
			.setDisplayValue(Translation.ui(UiTranslation.GameStatsPercentage).get)
			.event.subscribe("finish", this.setSkill)
			.appendTo(this);
	}

	@Override public update(entity: ICreature | INPC | Player) {
		if (this.player === entity) return;

		this.player = Entity.is(entity, EntityType.Player) ? entity : undefined;
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
	}

	@Bound
	private changeSkill(_: any, skillName: keyof typeof SkillType | "none") {
		this.skill = skillName === "none" ? undefined : SkillType[skillName];
		this.skillRangeRow.refresh();

		this.skillRangeRow.toggle(skillName !== "none");
	}

	@Bound
	private setSkill(_: any, value: number) {
		ActionExecutor.get(SetSkill).execute(localPlayer, this.player!, this.skill!, value);
	}

	@Bound
	private toggleInvulnerable(_: any, invulnerable: boolean) {
		if (this.DEBUG_TOOLS.getPlayerData(this.player!, "invulnerable") === invulnerable) return;

		ActionExecutor.get(ToggleInvulnerable).execute(localPlayer, this.player!, invulnerable);
	}

	@Bound
	private toggleNoClip(_: any, noclip: boolean) {
		if (this.DEBUG_TOOLS.getPlayerData(this.player!, "noclip") === noclip) return;

		ActionExecutor.get(ToggleNoClip).execute(localPlayer, this.player!, noclip);
	}

	@Bound
	private togglePermissions(_: any, permissions: boolean) {
		if (this.DEBUG_TOOLS.getPlayerData(this.player!, "permissions") === permissions) return;

		ActionExecutor.get(TogglePermissions).execute(localPlayer, this.player!, permissions);
	}

	@Bound
	private setWeightBonus(_: any, weightBonus: number) {
		if (this.DEBUG_TOOLS.getPlayerData(this.player!, "weightBonus") === weightBonus) return;

		ActionExecutor.get(SetWeightBonus).execute(localPlayer, this.player!, weightBonus);
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
			case "noclip":
				this.checkButtonNoClip.refresh();
				this.checkButtonInvulnerable.setDisabled(this.checkButtonNoClip.checked);
				if (this.checkButtonNoClip.checked) this.checkButtonInvulnerable.setChecked(false);
				break;
		}
	}
}

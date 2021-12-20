import Creature from "game/entity/creature/Creature";
import { SkillType } from "game/entity/IHuman";
import NPC from "game/entity/npc/NPC";
import Player from "game/entity/player/Player";
import UiTranslation from "language/dictionary/UiTranslation";
import TranslationImpl from "language/impl/TranslationImpl";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import { BlockRow } from "ui/component/BlockRow";
import { CheckButton } from "ui/component/CheckButton";
import SkillDropdown from "ui/component/dropdown/SkillDropdown";
import { LabelledRow } from "ui/component/LabelledRow";
import { RangeRow } from "ui/component/RangeRow";
import { Bound } from "utilities/Decorators";
import SetSkill from "../../action/SetSkill";
import SetWeightBonus from "../../action/SetWeightBonus";
import ToggleInvulnerable from "../../action/ToggleInvulnerable";
import ToggleNoClip from "../../action/ToggleNoClip";
import TogglePermissions from "../../action/TogglePermissions";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, IPlayerData, translation } from "../../IDebugTools";
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
				.setMax(10000)
				.setRefreshMethod(() => this.player ? this.DEBUG_TOOLS.getPlayerData(this.player, "weightBonus") : 0))
			.setDisplayValue(true)
			.event.subscribe("finish", this.setWeightBonus)
			.appendTo(this);

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelSkill)))
			.append(new SkillDropdown("none", [["none", option => option.setText(translation(DebugToolsTranslation.None))]])
				.event.subscribe("selection", this.changeSkill))
			.appendTo(this);

		this.skillRangeRow = new RangeRow()
			.hide()
			.setLabel(label => label.setText(TranslationImpl.generator(() => this.skill === undefined ? "" : SkillType[this.skill])))
			.editRange(range => range
				.setMin(0)
				.setMax(100)
				.setRefreshMethod(() => this.player?.skill.getCore(this.skill!) ?? 0))
			.setDisplayValue(Translation.ui(UiTranslation.GameStatsPercentage).get)
			.event.subscribe("finish", this.setSkill)
			.appendTo(this);
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
	}

	@Bound
	private changeSkill(_: any, skill: SkillType | "none") {
		this.skill = skill === "none" ? undefined : skill;
		this.skillRangeRow.refresh();

		this.skillRangeRow.toggle(skill !== "none");
	}

	@Bound
	private setSkill(_: any, value: number) {
		SetSkill.execute(localPlayer, this.player!, this.skill!, value);
	}

	@Bound
	private toggleInvulnerable(_: any, invulnerable: boolean) {
		if (this.DEBUG_TOOLS.getPlayerData(this.player!, "invulnerable") === invulnerable) return;

		ToggleInvulnerable.execute(localPlayer, this.player!, invulnerable);
	}

	@Bound
	private toggleNoClip(_: any, noclip: boolean) {
		if (this.DEBUG_TOOLS.getPlayerData(this.player!, "noclip") === noclip) return;

		ToggleNoClip.execute(localPlayer, this.player!, noclip);
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
			case "noclip":
				this.checkButtonNoClip.refresh();
				break;
		}
	}
}

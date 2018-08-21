import { Stat } from "entity/IStats";
import { SkillType } from "Enums";
import { UiTranslation } from "language/ILanguage";
import Translation from "language/Translation";
import { CheckButton, CheckButtonEvent } from "newui/component/CheckButton";
import Dropdown, { DropdownEvent, IDropdownOption } from "newui/component/Dropdown";
import { ComponentEvent, TranslationGenerator } from "newui/component/IComponent";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeInputEvent } from "newui/component/RangeInput";
import { RangeRow } from "newui/component/RangeRow";
import Text from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import IPlayer from "player/IPlayer";
import Collectors from "utilities/Collectors";
import Enums from "utilities/enum/Enums";
import { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import DebugTools, { DebugToolsEvent, translation } from "../../DebugTools";
import { DebugToolsTranslation, IPlayerData } from "../../IDebugTools";
import HumanInformation from "./Human";

export default class PlayerInformation extends HumanInformation {

	private readonly rangeWeightBonus: RangeRow;
	private readonly checkButtonInvulnerable: CheckButton;
	private readonly checkButtonNoClip: CheckButton;
	private readonly skillRangeRow: RangeRow;
	private skill: SkillType | undefined;

	public constructor(api: UiApi, private readonly player: IPlayer) {
		super(api, player);

		this.until(ComponentEvent.Remove)
			.bind(DebugTools.INSTANCE, DebugToolsEvent.PlayerDataChange, this.onPlayerDataChange);

		this.rangeWeightBonus = new RangeRow(api)
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelWeightBonus)))
			.editRange(range => range
				.setMin(0)
				.setMax(1000)
				.setRefreshMethod(() => DebugTools.INSTANCE.getPlayerData(player, "weightBonus")))
			.setDisplayValue(true)
			.on(RangeInputEvent.Finish, this.setWeightBonus)
			.appendTo(this);

		this.checkButtonInvulnerable = new CheckButton(api)
			.setText(translation(DebugToolsTranslation.ButtonToggleInvulnerable))
			.setRefreshMethod(() => DebugTools.INSTANCE.getPlayerData(player, "invulnerable"))
			.on(CheckButtonEvent.Change, this.toggleInvulnerable)
			.appendTo(this);

		this.checkButtonNoClip = new CheckButton(api)
			.setText(translation(DebugToolsTranslation.ButtonToggleNoClip))
			.setRefreshMethod(() => !!DebugTools.INSTANCE.getPlayerData(player, "noclip"))
			.on(CheckButtonEvent.Change, this.toggleNoClip)
			.appendTo(this);

		new LabelledRow(api)
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelSkill)))
			.append(new Dropdown(api)
				.setRefreshMethod(() => ({
					defaultOption: "none",
					options: ([
						["none", option => option.setText(translation(DebugToolsTranslation.None))],
					] as IDropdownOption[]).values().include(Enums.values(SkillType)
						.map<[string, TranslationGenerator]>(skill => [SkillType[skill], Translation.generator(SkillType[skill])])
						.collect(Collectors.toArray)
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.values()
						.map<IDropdownOption>(([id, t]) => [id, option => option.setText(t)])),
				}))
				.on(DropdownEvent.Selection, this.changeSkill))
			.appendTo(this);

		this.skillRangeRow = new RangeRow(api)
			.hide()
			.setLabel(label => label.setText(() => [{ content: this.skill === undefined ? "" : SkillType[this.skill] }]))
			.editRange(range => range
				.setMin(0)
				.setMax(100)
				.setRefreshMethod(() => this.skill !== undefined && this.skill in this.player.skills ? this.player.skills[this.skill].core : 0))
			.setDisplayValue(Translation.ui(UiTranslation.GameStatsPercentage).get)
			.on(RangeInputEvent.Finish, this.setSkill)
			.appendTo(this);
	}

	public getImmutableStats() {
		return [
			...super.getImmutableStats(),
			Stat.Attack,
			Stat.Defense,
			Stat.Reputation,
			Stat.Weight,
		];
	}

	@Bound
	private changeSkill(_: any, skillName: keyof typeof SkillType | "none") {
		this.skill = skillName === "none" ? undefined : SkillType[skillName];
		this.skillRangeRow.refresh();

		this.skillRangeRow.toggle(skillName !== "none");
	}

	@Bound
	private setSkill(_: any, value: number) {
		actionManager.execute(this.player, Actions.get("setSkill"), { object: [this.skill, value] });
	}

	@Bound
	private toggleInvulnerable(_: any, invulnerable: boolean) {
		if (DebugTools.INSTANCE.getPlayerData(this.player, "invulnerable") === invulnerable) return;

		actionManager.execute(this.player, Actions.get("toggleInvulnerable"), { object: invulnerable });
	}

	@Bound
	private toggleNoClip(_: any, noclip: boolean) {
		if (DebugTools.INSTANCE.getPlayerData(this.player, "noclip") === noclip) return;

		actionManager.execute(this.player, Actions.get("toggleNoclip"), { object: noclip });
	}

	@Bound
	private setWeightBonus(_: any, weightBonus: number) {
		actionManager.execute(this.player, Actions.get("setWeightBonus"), { object: weightBonus });
	}

	@Bound
	private onPlayerDataChange<K extends keyof IPlayerData>(_: any, playerId: number, key: K, value: IPlayerData[K]) {
		if (playerId !== this.player.id) return;

		switch (key) {
			case "weightBonus":
				this.rangeWeightBonus.refresh();
				break;
			case "invulnerable":
				this.checkButtonInvulnerable.refresh();
				break;
			case "noclip":
				this.checkButtonNoClip.refresh();
				this.checkButtonInvulnerable.setDisabled(this.checkButtonNoClip.checked);
				if (this.checkButtonNoClip.checked) this.checkButtonInvulnerable.setChecked(false);
				break;
		}
	}
}

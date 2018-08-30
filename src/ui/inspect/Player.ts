import { ICreature } from "creature/ICreature";
import { EntityType } from "entity/IEntity";
import { SkillType } from "Enums";
import { UiTranslation } from "language/ILanguage";
import Translation from "language/Translation";
import { BlockRow } from "newui/component/BlockRow";
import Button from "newui/component/Button";
import { CheckButton, CheckButtonEvent } from "newui/component/CheckButton";
import Dropdown, { DropdownEvent, IDropdownOption } from "newui/component/Dropdown";
import { ComponentEvent } from "newui/component/IComponent";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeInputEvent } from "newui/component/RangeInput";
import { RangeRow } from "newui/component/RangeRow";
import Text from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import { tuple } from "utilities/Arrays";
import Collectors from "utilities/Collectors";
import Enums from "utilities/enum/Enums";
import { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import DebugTools, { DebugToolsEvent, translation } from "../../DebugTools";
import { DebugToolsTranslation, IPlayerData } from "../../IDebugTools";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";

export default class PlayerInformation extends InspectEntityInformationSubsection {

	private readonly rangeWeightBonus: RangeRow;
	private readonly checkButtonInvulnerable: CheckButton;
	private readonly checkButtonNoClip: CheckButton;
	private readonly skillRangeRow: RangeRow;

	private skill: SkillType | undefined;
	private player: IPlayer | undefined;

	public constructor(api: UiApi) {
		super(api);

		this.until(ComponentEvent.Remove)
			.bind(DebugTools.INSTANCE, DebugToolsEvent.PlayerDataChange, this.onPlayerDataChange);

		new BlockRow(api)
			.append(this.checkButtonNoClip = new CheckButton(api)
				.setText(translation(DebugToolsTranslation.ButtonToggleNoClip))
				.setRefreshMethod(() => this.player ? !!DebugTools.INSTANCE.getPlayerData(this.player, "noclip") : false)
				.on(CheckButtonEvent.Change, this.toggleNoClip))
			.append(this.checkButtonInvulnerable = new CheckButton(api)
				.setText(translation(DebugToolsTranslation.ButtonToggleInvulnerable))
				.setRefreshMethod(() => this.player ? DebugTools.INSTANCE.getPlayerData(this.player, "invulnerable") : false)
				.on(CheckButtonEvent.Change, this.toggleInvulnerable))
			.appendTo(this);

		this.rangeWeightBonus = new RangeRow(api)
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelWeightBonus)))
			.editRange(range => range
				.setMin(0)
				.setMax(1000)
				.setRefreshMethod(() => this.player ? DebugTools.INSTANCE.getPlayerData(this.player, "weightBonus") : 0))
			.setDisplayValue(true)
			.on(RangeInputEvent.Finish, this.setWeightBonus)
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
						.map(skill => tuple(SkillType[skill], Translation.generator(SkillType[skill])))
						.collect(Collectors.toArray)
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.values()
						.map(([id, t]) => tuple(id, (option: Button) => option.setText(t)))),
				}))
				.on(DropdownEvent.Selection, this.changeSkill))
			.appendTo(this);

		this.skillRangeRow = new RangeRow(api)
			.hide()
			.setLabel(label => label.setText(Translation.generator(() => this.skill === undefined ? "" : SkillType[this.skill])))
			.editRange(range => range
				.setMin(0)
				.setMax(100)
				.setRefreshMethod(() => this.skill !== undefined && this.player && this.skill in this.player.skills ? this.player.skills[this.skill].core : 0))
			.setDisplayValue(Translation.ui(UiTranslation.GameStatsPercentage).get)
			.on(RangeInputEvent.Finish, this.setSkill)
			.appendTo(this);
	}

	public update(entity: ICreature | INPC | IPlayer) {
		if (this.player === entity) return;

		this.player = entity.entityType === EntityType.Player ? entity : undefined;
		this.toggle(!!this.player);

		if (!this.player) return;

		this.trigger("change");

		this.refresh();

		this.until([ComponentEvent.Remove, "change"])
			.bind(DebugTools.INSTANCE, DebugToolsEvent.PlayerDataChange, this.refresh);
	}

	@Bound
	private refresh() {
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
		Actions.get("setSkill").execute({ player: this.player, object: [this.skill!, value] });
	}

	@Bound
	private toggleInvulnerable(_: any, invulnerable: boolean) {
		if (DebugTools.INSTANCE.getPlayerData(this.player!, "invulnerable") === invulnerable) return;

		Actions.get("toggleInvulnerable").execute({ player: this.player, object: invulnerable });
	}

	@Bound
	private toggleNoClip(_: any, noclip: boolean) {
		if (DebugTools.INSTANCE.getPlayerData(this.player!, "noclip") === noclip) return;

		Actions.get("toggleNoclip").execute({ player: this.player, object: noclip });
	}

	@Bound
	private setWeightBonus(_: any, weightBonus: number) {
		if (DebugTools.INSTANCE.getPlayerData(this.player!, "weightBonus") === weightBonus) return;

		Actions.get("setWeightBonus").execute({ player: this.player, object: weightBonus });
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
			case "noclip":
				this.checkButtonNoClip.refresh();
				this.checkButtonInvulnerable.setDisabled(this.checkButtonNoClip.checked);
				if (this.checkButtonNoClip.checked) this.checkButtonInvulnerable.setChecked(false);
				break;
		}
	}
}

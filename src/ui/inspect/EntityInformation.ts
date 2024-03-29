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

import Entity from "game/entity/Entity";
import EntityWithStats from "game/entity/EntityWithStats";
import { EntityType, IStatChangeInfo } from "game/entity/IEntity";
import { IStat, Stat } from "game/entity/IStats";
import Tile from "game/tile/Tile";
import { TextContext } from "language/ITranslation";
import Translation from "language/Translation";
import TranslationImpl from "language/impl/TranslationImpl";
import Mod from "mod/Mod";
import { BlockRow } from "ui/component/BlockRow";
import Button from "ui/component/Button";
import Component from "ui/component/Component";
import ContextMenu from "ui/component/ContextMenu";
import Input from "ui/component/Input";
import { LabelledRow } from "ui/component/LabelledRow";
import { RangeRow } from "ui/component/RangeRow";
import { IRefreshable } from "ui/component/Refreshable";
import Text from "ui/component/Text";
import InputManager from "ui/input/InputManager";
import { Bound } from "utilities/Decorators";
import Log from "utilities/Log";
import { Tuple } from "utilities/collection/Tuple";
import Enums from "utilities/enum/Enums";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import Clone from "../../action/Clone";
import Heal from "../../action/Heal";
import Kill from "../../action/Kill";
import SetStat from "../../action/SetStat";
import TeleportEntity from "../../action/TeleportEntity";
import { areArraysIdentical } from "../../util/Array";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
import InspectInformationSection from "../component/InspectInformationSection";
import CreatureInformation from "./CreatureInformation";
import HumanInformation from "./HumanInformation";
import NpcInformation from "./NpcInformation";
import PlayerInformation from "./PlayerInformation";

export type InspectDialogEntityInformationSubsectionClass = new () => InspectEntityInformationSubsection;

const entitySubsectionClasses: InspectDialogEntityInformationSubsectionClass[] = [
	PlayerInformation,
	HumanInformation,
	NpcInformation,
	CreatureInformation,
];

export default class EntityInformation extends InspectInformationSection {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;
	@Mod.log(DEBUG_TOOLS_ID)
	public readonly LOG: Log;

	private readonly subsections: InspectEntityInformationSubsection[];
	private readonly statWrapper: Component;
	private readonly statComponents = new Map<Stat, IRefreshable>();
	private readonly buttonHeal: Button;
	private readonly buttonTeleport: Button;

	private entities: Entity[] = [];
	private entity?: Entity;

	public constructor() {
		super();

		new BlockRow()
			.append(this.buttonHeal = new Button()
				.setText(() => translation(this.entity === localPlayer ? DebugToolsTranslation.ButtonHealLocalPlayer : DebugToolsTranslation.ButtonHealEntity))
				.event.subscribe("activate", this.heal)
				.appendTo(this))
			.append(new Button()
				.setText(translation(DebugToolsTranslation.ButtonKillEntity))
				.event.subscribe("activate", this.kill))
			.appendTo(this);

		new BlockRow()
			.append(this.buttonTeleport = new Button()
				.setText(() => translation(this.entity === localPlayer ? DebugToolsTranslation.ButtonTeleportLocalPlayer : DebugToolsTranslation.ButtonTeleportEntity))
				.event.subscribe("activate", this.openTeleportMenu))
			.append(new Button()
				.setText(translation(DebugToolsTranslation.ButtonCloneEntity))
				.event.subscribe("activate", this.cloneEntity))
			.appendTo(this);

		this.subsections = entitySubsectionClasses.stream()
			.merge(this.DEBUG_TOOLS.modRegistryInspectDialogEntityInformationSubsections.getRegistrations()
				.map(registration => registration.data(InspectEntityInformationSubsection)))
			.map(cls => new cls()
				.appendTo(this))
			.toArray();

		this.statWrapper = new Component()
			.classes.add("debug-tools-inspect-entity-sub-section")
			.appendTo(this);

		this.event.subscribe("switchTo", () => this.subsections
			.forEach(subsection => subsection.event.emit("switchTo")));
		this.event.subscribe("switchAway", () => this.subsections
			.forEach(subsection => subsection.event.emit("switchAway")));
	}

	public override getTabs() {
		return this.entities.entries().stream()
			.map(([i, entity]) => Tuple(i, () => translation(DebugToolsTranslation.EntityName)
				.get(EntityType[entity.entityType], entity.getName()/*.inContext(TextContext.Title)*/)))
			.toArray();
	}

	public override setTab(entity: number) {
		this.entity = this.entities[entity];

		this.buttonHeal.refreshText();
		this.buttonTeleport.refreshText();

		for (const subsection of this.subsections) {
			subsection.update(this.entity);
		}

		this.initializeStats();

		return this;
	}

	public override update(tile: Tile) {
		const entities: Entity[] = tile.getPlayersOnTile(true);

		if (tile.creature) entities.push(tile.creature);
		if (tile.npc) entities.push(tile.npc);

		if (areArraysIdentical(entities, this.entities)) return;
		this.entities = entities;

		this.event.emit("change");

		if (!this.entities.length) return;

		this.setShouldLog();

		for (const entity of this.entities) {
			if (entity instanceof EntityWithStats) {
				entity.event.until(this, "remove", "change")
					.subscribe("statChanged", this.onStatChange);
			}
		}
	}

	public getEntityIndex(entity: Entity) {
		return this.entities.indexOf(entity);
	}

	public getEntity(index: number) {
		return this.entities[index];
	}

	public override logUpdate() {
		for (const entity of this.entities) {
			this.LOG.info("Entity:", entity);
		}
	}

	private initializeStats() {
		this.statWrapper.dump();
		this.statComponents.clear();


		if (!(this.entity instanceof EntityWithStats)) {
			return;
		}

		const stats = Enums.values(Stat)
			.filter(stat => this.entity?.asEntityWithStats?.stat.has(stat) && (!this.subsections.some(subsection => subsection.getImmutableStats().includes(stat))))
			.map(stat => this.entity?.asEntityWithStats?.stat.get<IStat>(stat))
			.filterNullish();

		for (const stat of stats) {
			if ("max" in stat && !stat.canExceedMax) {
				this.statComponents.set(stat.type, new RangeRow()
					.setLabel(label => label.setText(Translation.stat(stat.type).inContext(TextContext.Title)))
					.editRange(range => range
						.noClampOnRefresh()
						.setMin(0)
						.setMax(stat.max!)
						.setRefreshMethod(() => this.entity ? this.entity.asEntityWithStats?.stat.getValue(stat.type)! : 0))
					.event.subscribe("finish", this.setStat(stat.type))
					.setDisplayValue(true)
					.appendTo(this.statWrapper));

			} else {
				this.statComponents.set(stat.type, new Input()
					.event.subscribe("done", (input, value) => {
						if (isNaN(+value)) {
							input.clear();

						} else {
							this.setStat(stat.type)(input, +value);
						}
					})
					.setClearToDefaultWhenEmpty()
					.setDefault(() => this.entity?.asEntityWithStats?.stat.getValue(stat.type)?.toString() ?? "")
					.clear()
					.appendTo(new LabelledRow()
						.setLabel(label => label.setText(Translation.stat(stat.type).inContext(TextContext.Title)))
						.appendTo(this.statWrapper)));
			}
		}
	}

	@Bound
	private onStatChange(_: any, stat: IStat, oldValue: number, info: IStatChangeInfo) {
		const statComponent = this.statComponents.get(stat.type);
		if (statComponent) {
			statComponent.refresh();
		}
	}

	@Bound
	private openTeleportMenu() {
		const screen = ui.screens.getTop();
		if (!screen) {
			return;
		}

		if (this.entity === localPlayer && !multiplayer.isConnected()) {
			this.selectTeleportLocation();
			return;
		}

		const mouse = InputManager.mouse.position;

		new ContextMenu(
			["select location", {
				translation: translation(DebugToolsTranslation.OptionTeleportSelectLocation),
				onActivate: this.selectTeleportLocation,
			}],
			this.entity === localPlayer ? undefined : ["to local player", {
				translation: translation(DebugToolsTranslation.OptionTeleportToLocalPlayer),
				onActivate: () => this.teleport(localPlayer.tile),
			}],
			!multiplayer.isConnected() || this.entity?.asLocalPlayer ? undefined : ["to host", {
				translation: translation(DebugToolsTranslation.OptionTeleportToHost),
				onActivate: () => this.teleport(game.playerManager.players[0]!.tile),
			}],
			!multiplayer.isConnected() ? undefined : ["to player", {
				translation: translation(DebugToolsTranslation.OptionTeleportToPlayer),
				submenu: this.createTeleportToPlayerMenu,
			}],
		)
			.addAllDescribedOptions()
			.setPosition(...mouse.xy)
			.schedule(screen.setContextMenu);
	}

	@Bound
	private createTeleportToPlayerMenu() {
		return game.playerManager.getAll(true, true).stream()
			.filter(player => player !== this.entity)
			.map(player => Tuple(player.name, {
				translation: TranslationImpl.generator(player.name),
				onActivate: () => this.teleport(player.tile),
			}))
			.sort(([, t1], [, t2]) => Text.toString(t1.translation).localeCompare(Text.toString(t2.translation)))
			// create the context menu from them
			.collect<ContextMenu>(options => new ContextMenu(...options))
			.addAllDescribedOptions();
	}

	@Bound
	private async selectTeleportLocation() {
		const teleportLocation = await this.DEBUG_TOOLS.selector.select();
		if (!teleportLocation) return;

		this.teleport(teleportLocation);
	}

	@Bound
	private teleport(tile: Tile) {
		TeleportEntity.execute(localPlayer, this.entity!, tile);

		this.event.emit("update");
	}

	@Bound
	private kill() {
		Kill.execute(localPlayer, this.entity!);
		this.event.emit("update");
	}

	@Bound
	private async cloneEntity() {
		const teleportLocation = await this.DEBUG_TOOLS.selector.select();
		if (!teleportLocation) return;

		Clone.execute(localPlayer, this.entity!, teleportLocation);
	}

	@Bound
	private heal() {
		Heal.execute(localPlayer, this.entity!);
		this.event.emit("update");
	}

	@Bound
	private setStat(stat: Stat) {
		return (_: any, value: number) => {
			if (this.entity?.asEntityWithStats?.stat.getValue(stat) === value) return;

			SetStat.execute(localPlayer, this.entity!, stat, value);
		};
	}
}

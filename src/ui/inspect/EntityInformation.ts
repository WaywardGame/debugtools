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

import Entity from "@wayward/game/game/entity/Entity";
import EntityWithStats from "@wayward/game/game/entity/EntityWithStats";
import { EntityType, IStatChangeInfo } from "@wayward/game/game/entity/IEntity";
import { IStat, Stat } from "@wayward/game/game/entity/IStats";
import { EntityReferenceTypes } from "@wayward/game/game/reference/IReferenceManager";
import Tile from "@wayward/game/game/tile/Tile";
import { TextContext } from "@wayward/game/language/ITranslation";
import Translation from "@wayward/game/language/Translation";
import TranslationImpl from "@wayward/game/language/impl/TranslationImpl";
import Mod from "@wayward/game/mod/Mod";
import { BlockRow } from "@wayward/game/ui/component/BlockRow";
import Button from "@wayward/game/ui/component/Button";
import Component from "@wayward/game/ui/component/Component";
import ContextMenu from "@wayward/game/ui/component/ContextMenu";
import Details from "@wayward/game/ui/component/Details";
import Input from "@wayward/game/ui/component/Input";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import { RangeRow } from "@wayward/game/ui/component/RangeRow";
import Text from "@wayward/game/ui/component/Text";
import InputManager from "@wayward/game/ui/input/InputManager";
import Enums from "@wayward/game/utilities/enum/Enums";
import { IStringSection } from "@wayward/game/utilities/string/Interpolator";
import { Bound } from "@wayward/utilities/Decorators";
import Log from "@wayward/utilities/Log";
import { Tuple } from "@wayward/utilities/collection/Tuple";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import Clone from "../../action/Clone";
import Heal from "../../action/Heal";
import Kill from "../../action/Kill";
import SetStat from "../../action/SetStat";
import SetStatMax from "../../action/SetStatMax";
import TeleportEntity from "../../action/TeleportEntity";
import { areArraysIdentical } from "../../util/Array";
import ActionHistory from "../ActionHistory";
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
	private readonly statComponents = new Map<Stat, RangeRow | Input>();
	private readonly statMaxComponents = new Map<Stat, RangeRow>();
	private readonly buttonHeal: Button;
	private readonly buttonTeleport: Button;
	private readonly actionHistory: Details;

	private entities: Entity[] = [];
	private entity?: Entity;

	public constructor() {
		super();

		new BlockRow()
			.append(this.buttonHeal = new Button()
				.setText(() => translation(this.entity?.asLocalPlayer ? DebugToolsTranslation.ButtonHealLocalPlayer : DebugToolsTranslation.ButtonHealEntity))
				.event.subscribe("activate", this.heal)
				.appendTo(this))
			.append(new Button()
				.setText(translation(DebugToolsTranslation.ButtonKillEntity))
				.event.subscribe("activate", this.kill))
			.appendTo(this);

		new BlockRow()
			.append(this.buttonTeleport = new Button()
				.setText(() => translation(this.entity?.asLocalPlayer ? DebugToolsTranslation.ButtonTeleportLocalPlayer : DebugToolsTranslation.ButtonTeleportEntity))
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

		this.actionHistory = new Details()
			.setSummary(summary => summary.setText(translation(DebugToolsTranslation.PanelHistory)))
			.appendTo(this);

		this.event.subscribe("switchTo", () => this.subsections
			.forEach(subsection => subsection.event.emit("switchTo")));
		this.event.subscribe("switchAway", () => this.subsections
			.forEach(subsection => subsection.event.emit("switchAway")));
	}

	public override getTabs(): [number, () => IStringSection[]][] {
		return this.entities.entries().stream()
			.map(([i, entity]) => Tuple(i, () => translation(DebugToolsTranslation.EntityName)
				.get(EntityType[entity.entityType], entity.getName()/*.inContext(TextContext.Title)*/)))
			.toArray();
	}

	public override setTab(entity: number): this {
		this.entity = this.entities[entity];

		this.buttonHeal.refreshText();
		this.buttonTeleport.refreshText();

		for (const subsection of this.subsections) {
			subsection.update(this.entity);
		}

		this.initializeStats();

		this.actionHistory.dump()
			.append(new ActionHistory(this.entity));

		return this;
	}

	public override update(tile: Tile): void {
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
				const entityEvents = entity.event.until(this, "remove", "change");
				entityEvents.subscribe("statChanged", this.onStatChange);
				entityEvents.subscribe("statMaxChanged", this.onStatMaxChanged);
			}
		}
	}

	public getEntityIndex(entity: Entity): number {
		return this.entities.indexOf(entity);
	}

	public getEntity(index: number): Entity<unknown, number, EntityReferenceTypes, unknown> {
		return this.entities[index];
	}

	public override logUpdate(): void {
		for (const entity of this.entities) {
			this.LOG.info("Entity:", entity);
		}
	}

	private initializeStats(): void {
		this.statWrapper.dump();
		this.statComponents.clear();
		this.statMaxComponents.clear();

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

				this.statMaxComponents.set(stat.type, new RangeRow()
					.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelMax).addArgs(Translation.stat(stat.type).inContext(TextContext.Title))))
					.editRange(range => range
						.noClampOnRefresh()
						.setMin(0)
						.setMax(500)
						.setRefreshMethod(() => this.entity ? this.entity.asEntityWithStats?.stat.getMax(stat.type)! : 0))
					.event.subscribe("finish", this.setStatMax(stat.type))
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
	private onStatChange(_: any, stat: IStat, oldValue: number, info: IStatChangeInfo): void {
		const statComponent = this.statComponents.get(stat.type);
		if (statComponent) {
			statComponent.refresh();
		}
	}

	@Bound
	private onStatMaxChanged(_: any, stat: IStat): void {
		const statComponent = this.statComponents.get(stat.type);
		if (statComponent) {
			statComponent.getAs(RangeRow)?.editRange(range => range.setMax(stat.max!))
			statComponent.refresh();
		}
		const statMaxComponent = this.statMaxComponents.get(stat.type);
		if (statMaxComponent) {
			statMaxComponent.refresh(false);
		}
	}

	@Bound
	private openTeleportMenu(): void {
		const screen = ui.screens.getTop();
		if (!screen) {
			return;
		}

		if (this.entity?.asLocalPlayer && !multiplayer.isConnected) {
			this.selectTeleportLocation();
			return;
		}

		const mouse = InputManager.mouse.position;

		new ContextMenu(
			["select location", {
				translation: translation(DebugToolsTranslation.OptionTeleportSelectLocation),
				onActivate: this.selectTeleportLocation,
			}],
			this.entity?.asLocalPlayer ? undefined : ["to local player", {
				translation: translation(DebugToolsTranslation.OptionTeleportToLocalPlayer),
				onActivate: () => this.teleport(localPlayer.tile),
			}],
			!multiplayer.isConnected || this.entity?.asLocalPlayer ? undefined : ["to host", {
				translation: translation(DebugToolsTranslation.OptionTeleportToHost),
				onActivate: () => this.teleport(game.playerManager.players[0]!.tile),
			}],
			!multiplayer.isConnected ? undefined : ["to player", {
				translation: translation(DebugToolsTranslation.OptionTeleportToPlayer),
				submenu: this.createTeleportToPlayerMenu,
			}],
		)
			.addAllDescribedOptions()
			.setPosition(...mouse.xy)
			.schedule(screen.setContextMenu);
	}

	@Bound
	private createTeleportToPlayerMenu(): ContextMenu<string | number | symbol> {
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
	private async selectTeleportLocation(): Promise<void> {
		const teleportLocation = await this.DEBUG_TOOLS.selector.select();
		if (!teleportLocation) return;

		this.teleport(teleportLocation);
	}

	@Bound
	private teleport(tile: Tile): void {
		TeleportEntity.execute(localPlayer, this.entity!, tile);

		this.event.emit("update");
	}

	@Bound
	private kill(): void {
		Kill.execute(localPlayer, this.entity!);
		this.event.emit("update");
	}

	@Bound
	private async cloneEntity(): Promise<void> {
		const teleportLocation = await this.DEBUG_TOOLS.selector.select();
		if (!teleportLocation) return;

		Clone.execute(localPlayer, this.entity!, teleportLocation);
	}

	@Bound
	private heal(): void {
		Heal.execute(localPlayer, this.entity!);
		this.event.emit("update");
	}

	@Bound
	private setStat(stat: Stat): (_: any, value: number) => void {
		return (_: any, value: number) => {
			if (this.entity?.asEntityWithStats?.stat.getValue(stat) === value) return;

			SetStat.execute(localPlayer, this.entity!, stat, value);
		};
	}

	@Bound
	private setStatMax(stat: Stat): (_: any, value: number) => void {
		return (_: any, value: number) => {
			if (this.entity?.asEntityWithStats?.stat.getValue(stat) === value) return;

			SetStatMax.execute(localPlayer, this.entity!, stat, value);
		};
	}
}

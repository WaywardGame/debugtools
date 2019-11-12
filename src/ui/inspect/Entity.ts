import ActionExecutor from "entity/action/ActionExecutor";
import Creature from "entity/creature/Creature";
import Entity from "entity/Entity";
import { EntityType, IStatChangeInfo } from "entity/IEntity";
import { IStat, Stat } from "entity/IStats";
import NPC from "entity/npc/NPC";
import Player from "entity/player/Player";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import { bindingManager } from "newui/BindingManager";
import { BlockRow } from "newui/component/BlockRow";
import Button from "newui/component/Button";
import Component from "newui/component/Component";
import ContextMenu from "newui/component/ContextMenu";
import Input from "newui/component/Input";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeRow } from "newui/component/RangeRow";
import { IRefreshable } from "newui/component/Refreshable";
import Text from "newui/component/Text";
import newui from "newui/NewUi";
import { ITile } from "tile/ITerrain";
import { Tuple } from "utilities/Arrays";
import Enums from "utilities/enum/Enums";
import Log from "utilities/Log";
import { IVector2, IVector3 } from "utilities/math/IVector";
import Vector3 from "utilities/math/Vector3";

import Clone from "../../action/Clone";
import Heal from "../../action/Heal";
import Kill from "../../action/Kill";
import SetStat from "../../action/SetStat";
import TeleportEntity from "../../action/TeleportEntity";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
import InspectInformationSection from "../component/InspectInformationSection";

import CreatureInformation from "./Creature";
import HumanInformation from "./Human";
import NpcInformation from "./Npc";
import PlayerInformation from "./Player";

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

	private entities: (Player | Creature | NPC)[] = [];
	private entity: Player | Creature | NPC | undefined;

	public constructor() {
		super();

		new BlockRow()
			.append(new Button()
				.setText(translation(DebugToolsTranslation.ButtonHealEntity))
				.event.subscribe("activate", this.heal)
				.appendTo(this))
			.append(new Button()
				.setText(translation(DebugToolsTranslation.ButtonKillEntity))
				.event.subscribe("activate", this.kill))
			.appendTo(this);

		new BlockRow()
			.append(new Button()
				.setText(translation(DebugToolsTranslation.ButtonTeleportEntity))
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

	@Override public getTabs() {
		return this.entities.entries().stream()
			.map(([i, entity]) => Tuple(i, () => translation(DebugToolsTranslation.EntityName)
				.get(EntityType[entity.entityType], entity.getName()/*.inContext(TextContext.Title)*/)))
			.toArray();
	}

	@Override public setTab(entity: number) {
		this.entity = this.entities[entity];

		for (const subsection of this.subsections) {
			subsection.update(this.entity);
		}

		this.initializeStats();

		return this;
	}

	@Override public update(position: IVector2, tile: ITile) {
		const entities: (Player | Creature | NPC)[] = game.getPlayersAtTile(tile, true);

		if (tile.creature) entities.push(tile.creature);
		if (tile.npc) entities.push(tile.npc);

		if (areArraysIdentical(entities, this.entities)) return;
		this.entities = entities;

		this.event.emit("change");

		if (!this.entities.length) return;

		this.setShouldLog();

		for (const entity of this.entities) {
			(entity as Entity).event.until(this, "remove", "change")
				.subscribe("statChanged", this.onStatChange);
		}
	}

	public getEntityIndex(entity: Creature | NPC | Player) {
		return this.entities.indexOf(entity);
	}

	public getEntity(index: number) {
		return this.entities[index];
	}

	@Override public logUpdate() {
		for (const entity of this.entities) {
			this.LOG.info("Entity:", entity);
		}
	}

	private initializeStats() {
		this.statWrapper.dump();
		this.statComponents.clear();

		const stats = Enums.values(Stat)
			.filter(stat => this.entity!.stat.has(stat) && (!this.subsections.some(subsection => subsection.getImmutableStats().includes(stat))))
			.map(stat => this.entity!.stat.get(stat))
			.filter2<IStat>(stat => stat !== undefined);

		for (const stat of stats) {
			if ("max" in stat && !stat.canExceedMax) {
				this.statComponents.set(stat.type, new RangeRow()
					.setLabel(label => label.setText(Translation.generator(Stat[stat.type])))
					.editRange(range => range
						.noClampOnRefresh()
						.setMin(0)
						.setMax(stat.max!)
						.setRefreshMethod(() => this.entity ? this.entity.stat.getValue(stat.type)! : 0))
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
					.setCanBeEmpty(false)
					.setDefault(() => this.entity ? `${this.entity.stat.getValue(stat.type)}` : "")
					.clear()
					.appendTo(new LabelledRow()
						.setLabel(label => label.setText(Translation.generator(Stat[stat.type])))
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
		const screen = newui.screens.getTop();
		if (!screen) {
			return;
		}

		if (this.entity === localPlayer && !multiplayer.isConnected()) {
			this.selectTeleportLocation();
			return;
		}

		const mouse = bindingManager.getMouse();

		new ContextMenu(
			["select location", {
				translation: translation(DebugToolsTranslation.OptionTeleportSelectLocation),
				onActivate: this.selectTeleportLocation,
			}],
			this.entity === localPlayer ? undefined : ["to local player", {
				translation: translation(DebugToolsTranslation.OptionTeleportToLocalPlayer),
				onActivate: () => this.teleport(localPlayer),
			}],
			!multiplayer.isConnected() || this.entity === players[0] ? undefined : ["to host", {
				translation: translation(DebugToolsTranslation.OptionTeleportToHost),
				onActivate: () => this.teleport(players[0]),
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
		return players.stream()
			.filter(player => player !== this.entity)
			.map(player => Tuple(player.name, {
				translation: Translation.generator(player.name),
				onActivate: () => this.teleport(player),
			}))
			.sorted(([, t1], [, t2]) => Text.toString(t1.translation).localeCompare(Text.toString(t2.translation)))
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
	private teleport(location: IVector2 | IVector3) {
		ActionExecutor.get(TeleportEntity).execute(localPlayer, this.entity!, new Vector3(location, "z" in location ? location.z : this.entity!.z));

		this.event.emit("update");
	}

	@Bound
	private kill() {
		ActionExecutor.get(Kill).execute(localPlayer, this.entity!);
		this.event.emit("update");
	}

	@Bound
	private async cloneEntity() {
		const teleportLocation = await this.DEBUG_TOOLS.selector.select();
		if (!teleportLocation) return;

		ActionExecutor.get(Clone).execute(localPlayer, this.entity!, new Vector3(teleportLocation, localPlayer.z));
	}

	@Bound
	private heal() {
		ActionExecutor.get(Heal).execute(localPlayer, this.entity!);
		this.event.emit("update");
	}

	@Bound
	private setStat(stat: Stat) {
		return (_: any, value: number) => {
			if (this.entity!.stat.getValue(stat) === value) return;

			ActionExecutor.get(SetStat).execute(localPlayer, this.entity!, stat, value);
		};
	}
}

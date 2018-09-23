import { ICreature } from "creature/ICreature";
import IBaseEntity, { EntityEvent, IStatChangeInfo } from "entity/IBaseEntity";
import { EntityType } from "entity/IEntity";
import { IStat, Stat } from "entity/IStats";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import { bindingManager } from "newui/BindingManager";
import { BlockRow } from "newui/component/BlockRow";
import Button, { ButtonEvent } from "newui/component/Button";
import Component from "newui/component/Component";
import ContextMenu from "newui/component/ContextMenu";
import { ComponentEvent } from "newui/component/IComponent";
import Input, { InputEvent } from "newui/component/Input";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeInputEvent } from "newui/component/RangeInput";
import { RangeRow } from "newui/component/RangeRow";
import { IRefreshable } from "newui/component/Refreshable";
import Text from "newui/component/Text";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import { ITile } from "tile/ITerrain";
import { tuple } from "utilities/Arrays";
import Collectors, { PassStrategy } from "utilities/Collectors";
import Enums from "utilities/enum/Enums";
import Log from "utilities/Log";
import { IVector2, IVector3 } from "utilities/math/IVector";
import Vector3 from "utilities/math/Vector3";
import { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
import { DebugToolsPanelEvent } from "../component/DebugToolsPanel";
import InspectEntityInformationSubsection from "../component/InspectEntityInformationSubsection";
import InspectInformationSection from "../component/InspectInformationSection";
import CreatureInformation from "./Creature";
import HumanInformation from "./Human";
import NpcInformation from "./Npc";
import PlayerInformation from "./Player";

export type InspectDialogEntityInformationSubsectionClass = new (gsapi: IGameScreenApi) => InspectEntityInformationSubsection;

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

	private entities: (IPlayer | ICreature | INPC)[] = [];
	private entity: IPlayer | ICreature | INPC | undefined;

	public constructor(gsapi: IGameScreenApi) {
		super(gsapi);

		new BlockRow(this.api)
			.append(new Button(this.api)
				.setText(translation(DebugToolsTranslation.ButtonHealEntity))
				.on(ButtonEvent.Activate, this.heal)
				.appendTo(this))
			.append(new Button(this.api)
				.setText(translation(DebugToolsTranslation.ButtonKillEntity))
				.on(ButtonEvent.Activate, this.kill))
			.appendTo(this);

		new BlockRow(this.api)
			.append(new Button(this.api)
				.setText(translation(DebugToolsTranslation.ButtonTeleportEntity))
				.on(ButtonEvent.Activate, this.openTeleportMenu))
			.append(new Button(this.api)
				.setText(translation(DebugToolsTranslation.ButtonCloneEntity))
				.on(ButtonEvent.Activate, this.cloneEntity))
			.appendTo(this);

		this.subsections = entitySubsectionClasses.values()
			.include(this.DEBUG_TOOLS.modRegistryInspectDialogEntityInformationSubsections.getRegistrations()
				.map(registration => registration.data(InspectEntityInformationSubsection)))
			.map(cls => new cls(this.gsapi)
				.appendTo(this))
			.collect(Collectors.toArray);

		this.statWrapper = new Component(this.api)
			.classes.add("debug-tools-inspect-entity-sub-section")
			.appendTo(this);

		this.on(DebugToolsPanelEvent.SwitchTo, () => this.subsections
			.forEach(subsection => subsection.trigger(DebugToolsPanelEvent.SwitchTo)));
		this.on(DebugToolsPanelEvent.SwitchAway, () => this.subsections
			.forEach(subsection => subsection.trigger(DebugToolsPanelEvent.SwitchAway)));
	}

	public getTabs() {
		return this.entities.entries()
			.map(([i, entity]) => tuple(i, () => translation(DebugToolsTranslation.EntityName)
				.get(EntityType[entity.entityType], entity.getName()/*.inContext(TextContext.Title)*/)))
			.collect(Collectors.toArray);
	}

	public setTab(entity: number) {
		this.entity = this.entities[entity];

		for (const subsection of this.subsections) {
			subsection.update(this.entity);
		}

		this.initializeStats();

		return this;
	}

	public update(position: IVector2, tile: ITile) {
		const entities: (IPlayer | ICreature | INPC)[] = game.getPlayersAtTile(tile, true);

		if (tile.creature) entities.push(tile.creature);
		if (tile.npc) entities.push(tile.npc);

		if (areArraysIdentical(entities, this.entities)) return;
		this.entities = entities;

		this.trigger("change");

		if (!this.entities.length) return;

		this.setShouldLog();

		for (const entity of this.entities) {
			this.until([ComponentEvent.Remove, "change"])
				.bind(entity as IBaseEntity, EntityEvent.StatChanged, this.onStatChange);
		}
	}

	public getIndex(entity: ICreature | INPC | IPlayer) {
		return this.entities.indexOf(entity);
	}

	public getEntity(index: number) {
		return this.entities[index];
	}

	public logUpdate() {
		for (const entity of this.entities) {
			this.LOG.info("Entity:", entity);
		}
	}

	private initializeStats() {
		this.statWrapper.dump();
		this.statComponents.clear();

		const stats = Enums.values(Stat)
			.filter(stat => this.entity!.hasStat(stat) && (!this.subsections.some(subsection => subsection.getImmutableStats().includes(stat))))
			.map(stat => this.entity!.getStat(stat))
			.filter<undefined>((stat): stat is IStat => stat !== undefined);

		for (const stat of stats) {
			if ("max" in stat && !stat.canExceedMax) {
				this.statComponents.set(stat.type, new RangeRow(this.api)
					.setLabel(label => label.setText(Translation.generator(Stat[stat.type])))
					.editRange(range => range
						.setMin(0)
						.setMax(stat.max!)
						.setRefreshMethod(() => this.entity ? this.entity.getStatValue(stat.type)! : 0))
					.on(RangeInputEvent.Finish, this.setStat(stat.type))
					.setDisplayValue(true)
					.appendTo(this.statWrapper));

			} else {
				this.statComponents.set(stat.type, new Input(this.api)
					.on(InputEvent.Done, (input, value: string) => {
						if (isNaN(+value)) {
							input.clear();

						} else {
							this.setStat(stat.type)(input, +value);
						}
					})
					.setCanBeEmpty(false)
					.setDefault(() => this.entity ? `${this.entity.getStatValue(stat.type)}` : "")
					.clear()
					.appendTo(new LabelledRow(this.api)
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
		const screen = this.api.getVisibleScreen();
		if (!screen) {
			return;
		}

		if (this.entity === localPlayer && !multiplayer.isConnected()) {
			this.selectTeleportLocation();
			return;
		}

		const mouse = bindingManager.getMouse();

		new ContextMenu(this.api,
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
		return players.values()
			.filter(player => player !== this.entity)
			.map(player => tuple(player.name, {
				translation: Translation.generator(player.name),
				onActivate: () => this.teleport(player),
			}))
			.collect(Collectors.toArray)
			.sort(([, t1], [, t2]) => Text.toString(t1.translation).localeCompare(Text.toString(t2.translation)))
			.values()
			// create the context menu from them
			.collect<ContextMenu>(Collectors.passTo(ContextMenu.bind(null, this.api), PassStrategy.Splat))
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
		Actions.get("teleport")
			.execute({ entity: this.entity, position: new Vector3(location.x, location.y, "z" in location ? location.z : this.entity!.z) });

		this.trigger("update");
	}

	@Bound
	private kill() {
		Actions.get("kill").execute({ entity: this.entity });
		this.trigger("update");
	}

	@Bound
	private async cloneEntity() {
		const teleportLocation = await this.DEBUG_TOOLS.selector.select();
		if (!teleportLocation) return;

		Actions.get("clone")
			.execute({ entity: this.entity, position: new Vector3(teleportLocation.x, teleportLocation.y, localPlayer.z) });
	}

	@Bound
	private heal() {
		Actions.get("heal").execute({ entity: this.entity });
		this.trigger("update");
	}

	@Bound
	private setStat(stat: Stat) {
		return (_: any, value: number) => {
			if (this.entity!.getStatValue(stat) === value) return;
			Actions.get("setStat").execute({ entity: this.entity, object: [stat, value] });
		};
	}
}

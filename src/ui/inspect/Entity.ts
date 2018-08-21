import { ICreature } from "creature/ICreature";
import IBaseEntity, { EntityEvent, IStatChangeInfo } from "entity/IBaseEntity";
import { EntityType } from "entity/IEntity";
import { IStat, Stat } from "entity/IStats";
import { SentenceCaseStyle } from "Enums";
import Translation from "language/Translation";
import { Registry } from "mod/ModRegistry";
import { bindingManager } from "newui/BindingManager";
import Button, { ButtonEvent } from "newui/component/Button";
import Component from "newui/component/Component";
import ContextMenu, { ContextMenuOptionKeyValuePair } from "newui/component/ContextMenu";
import { ComponentEvent } from "newui/component/IComponent";
import Input, { InputEvent } from "newui/component/Input";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeInputEvent } from "newui/component/RangeInput";
import { RangeRow } from "newui/component/RangeRow";
import { IRefreshable } from "newui/component/Refreshable";
import Text, { Paragraph } from "newui/component/Text";
import { UiApi } from "newui/INewUi";
import { INPC } from "npc/INPC";
import IPlayer from "player/IPlayer";
import { ITile } from "tile/ITerrain";
import Collectors, { PassStrategy } from "utilities/Collectors";
import Enums from "utilities/enum/Enums";
import { IVector2, IVector3 } from "utilities/math/IVector";
import { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import DebugTools, { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
import { areArraysIdentical } from "../../util/Array";
import { IInspectInformationSection } from "../InspectDialog";
import CreatureInformation from "./Creature";
import NpcInformation from "./Npc";
import PlayerInformation from "./Player";

export interface IInspectEntityInformationSubsection extends Component {
	getImmutableStats(): Stat[];
}

export default class EntityInformation extends Component implements IInspectInformationSection {
	private entities: Array<IPlayer | ICreature | INPC> = [];
	private statComponents = new Map<Stat, IRefreshable>();

	public constructor(api: UiApi) {
		super(api);
	}

	public update(position: IVector2, tile: ITile) {
		const entities: Array<IPlayer | ICreature | INPC> = game.getPlayersAtTile(tile, true);

		if (tile.creature) entities.push(tile.creature);
		if (tile.npc) entities.push(tile.npc);

		if (areArraysIdentical(entities, this.entities)) return;
		this.entities = entities;

		this.trigger("change");

		this.toggle(!!this.entities.length);
		this.dump();

		if (!this.entities.length) return;

		for (const entity of this.entities) {
			DebugTools.LOG.info("Entity:", entity);
			this.addEntityDisplay(entity);
		}

		return this;
	}

	private addEntityDisplay(entity: ICreature | INPC | IPlayer) {
		this.until([ComponentEvent.Remove, "change"])
			.bind(entity as IBaseEntity, EntityEvent.StatChanged, this.onStatChange);

		new Paragraph(this.api)
			.setText(() => translation(DebugToolsTranslation.EntityName).get(EntityType[entity.entityType], game.getName(entity, SentenceCaseStyle.Title)))
			.appendTo(this);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonKillEntity))
			.on(ButtonEvent.Activate, this.kill(entity))
			.appendTo(this);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonHealEntity))
			.on(ButtonEvent.Activate, this.heal(entity))
			.appendTo(this);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonTeleportEntity))
			.on(ButtonEvent.Activate, this.openTeleportMenu(entity))
			.appendTo(this);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonCloneEntity))
			.on(ButtonEvent.Activate, this.cloneEntity(entity))
			.appendTo(this);

		let subInfo!: IInspectEntityInformationSubsection;

		switch (entity.entityType) {
			case EntityType.Player: {
				subInfo = new PlayerInformation(this.api, entity);
				break;
			}
			case EntityType.NPC: {
				subInfo = new NpcInformation(this.api, entity);
				break;
			}
			case EntityType.Creature: {
				subInfo = new CreatureInformation(this.api, entity);
				break;
			}
		}

		subInfo.classes.add("debug-tools-inspect-entity-sub-section");

		const stats = Enums.values(Stat)
			.filter(stat => entity.hasStat(stat) && (!subInfo.getImmutableStats().includes(stat)))
			.map(stat => entity.getStat(stat))
			.filter<IStat>((stat): stat is IStat => stat !== undefined);

		for (const stat of stats) {
			if ("max" in stat && !stat.canExceedMax) {
				this.statComponents.set(stat.type, new RangeRow(this.api)
					.setLabel(label => label.setText(Translation.generator(Stat[stat.type])))
					.editRange(range => range
						.setMin(0)
						.setMax(stat.max!)
						.setRefreshMethod(() => entity.getStatValue(stat.type)!))
					.on(RangeInputEvent.Finish, this.setStat(stat.type, entity))
					.setDisplayValue(true)
					.appendTo(this));

			} else {
				this.statComponents.set(stat.type, new Input(this.api)
					.on(InputEvent.Done, (input, value: string) => {
						if (isNaN(+value)) {
							input.clear();

						} else {
							this.setStat(stat.type, entity)(input, +value);
						}
					})
					.setCanBeEmpty(false)
					.setDefault(() => `${entity.getStatValue(stat.type)}`)
					.clear()
					.appendTo(new LabelledRow(this.api)
						.setLabel(label => label.setText(Translation.generator(Stat[stat.type])))
						.appendTo(this)));
			}
		}

		subInfo.appendTo(this);
	}

	@Bound
	private onStatChange(_: any, stat: IStat, oldValue: number, info: IStatChangeInfo) {
		const statComponent = this.statComponents.get(stat.type);
		if (statComponent) {
			statComponent.refresh();
		}
	}

	@Bound
	private kill(entity: ICreature | INPC | IPlayer) {
		return () => {
			actionManager.execute(
				entity.entityType === EntityType.Player ? entity : localPlayer,
				Actions.get("kill"),
				entity.entityType === EntityType.Player ? {} : {
					[entity.entityType === EntityType.Creature ? "creature" : "npc"]: entity,
				},
			);
			this.triggerSync("update");
		};
	}

	@Bound
	private cloneEntity(entity: ICreature | INPC | IPlayer) {
		return async () => {
			const teleportLocation = await DebugTools.INSTANCE.selector.select();
			if (!teleportLocation) return;

			actionManager.execute(
				entity.entityType === EntityType.Player ? entity : localPlayer,
				Actions.get("clone"),
				{
					point: { x: teleportLocation.x, y: teleportLocation.y },
					...entity.entityType === EntityType.Player ? {} : {
						[entity.entityType === EntityType.Creature ? "creature" : "npc"]: entity,
					},
				},
			);
		};
	}

	@Bound
	private openTeleportMenu(entity: ICreature | INPC | IPlayer) {
		return () => {
			const screen = this.api.getVisibleScreen();
			if (!screen) {
				return;
			}

			if (entity === localPlayer && !multiplayer.isConnected()) {
				this.selectTeleportLocation(entity)();
				return;
			}

			const mouse = bindingManager.getMouse();

			new ContextMenu(this.api,
				["select location", {
					translation: translation(DebugToolsTranslation.OptionTeleportSelectLocation),
					onActivate: this.selectTeleportLocation(entity),
				}],
				entity === localPlayer ? undefined : ["to local player", {
					translation: translation(DebugToolsTranslation.OptionTeleportToLocalPlayer),
					onActivate: () => this.teleport(entity, localPlayer),
				}],
				!multiplayer.isConnected() || entity === players[0] ? undefined : ["to host", {
					translation: translation(DebugToolsTranslation.OptionTeleportToHost),
					onActivate: () => this.teleport(entity, players[0]),
				}],
				!multiplayer.isConnected() ? undefined : ["to player", {
					translation: translation(DebugToolsTranslation.OptionTeleportToPlayer),
					submenu: this.createTeleportToPlayerMenu(entity),
				}],
			)
				.addAllDescribedOptions()
				.setPosition(...mouse.xy)
				.schedule(screen.setContextMenu);
		};
	}

	private createTeleportToPlayerMenu(entity: ICreature | INPC | IPlayer) {
		return (api: UiApi) => players.values()
			.filter(player => player !== entity)
			.map<ContextMenuOptionKeyValuePair>(player => [player.name, {
				translation: Translation.generator(player.name),
				onActivate: () => this.teleport(entity, player),
			}])
			.collect(Collectors.toArray)
			.sort(([, t1], [, t2]) => Text.toString(t1.translation).localeCompare(Text.toString(t2.translation)))
			.values()
			// create the context menu from them
			.collect(Collectors.passTo(ContextMenu.bind(null, this.api), PassStrategy.Splat))
			.addAllDescribedOptions();
	}

	private selectTeleportLocation(entity: ICreature | INPC | IPlayer) {
		return async () => {
			const teleportLocation = await DebugTools.INSTANCE.selector.select();
			if (!teleportLocation) return;

			this.teleport(entity, teleportLocation);
		};
	}

	@Bound
	private teleport(entity: ICreature | INPC | IPlayer, location: IVector2 | IVector3) {
		actionManager.execute(
			entity.entityType === EntityType.Player ? entity : localPlayer,
			Actions.get("teleport"),
			{
				object: [location.x, location.y, "z" in location ? location.z : entity.z],
				...entity.entityType === EntityType.Player ? {} : {
					[entity.entityType === EntityType.Creature ? "creature" : "npc"]: entity,
				},
			},
		);

		this.triggerSync("update");
	}

	@Bound
	private heal(entity: ICreature | INPC | IPlayer) {
		return () => {
			actionManager.execute(
				entity.entityType === EntityType.Player ? entity : localPlayer,
				Actions.get("heal"),
				entity.entityType === EntityType.Player ? {} : {
					[entity.entityType === EntityType.Creature ? "creature" : "npc"]: entity,
				},
			);
			this.triggerSync("update");
		};
	}

	@Bound
	private setStat(stat: Stat, entity: ICreature | INPC | IPlayer) {
		return (_: any, value: number) => {
			actionManager.execute(
				entity.entityType === EntityType.Player ? entity : localPlayer,
				Registry.id(DebugTools.INSTANCE.actions.setStat), {
					object: [stat, value],
					...entity.entityType === EntityType.Player ? {} : {
						[entity.entityType === EntityType.Creature ? "creature" : "npc"]: entity,
					},
				},
			);
		};
	}
}

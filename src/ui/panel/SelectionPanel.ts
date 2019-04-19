import ActionExecutor from "entity/action/ActionExecutor";
import { ICreature } from "entity/creature/ICreature";
import { EntityType } from "entity/IEntity";
import { INPC } from "entity/npc/INPC";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Dropdown from "newui/component/Dropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeRow } from "newui/component/RangeRow";
import { ITileEvent } from "tile/ITileEvent";
import Arrays, { tuple } from "utilities/Arrays";
import Vector2 from "utilities/math/Vector2";
import Stream from "utilities/stream/Stream";

import SelectionExecute from "../../action/SelectionExecute";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import DebugToolsPanel from "../component/DebugToolsPanel";

export enum SelectionType {
	Creature,
	NPC,
	TileEvent,
}

const entityTypeToSelectionTypeMap = {
	[EntityType.Creature]: SelectionType.Creature,
	[EntityType.NPC]: SelectionType.NPC,
};

function getSelectionType(target: ICreature | INPC | ITileEvent) {
	return "entityType" in target ? entityTypeToSelectionTypeMap[target.entityType] : SelectionType.TileEvent;
}

export default class SelectionPanel extends DebugToolsPanel {
	private readonly rangeQuantity: RangeRow;

	private creatures = false;
	private npcs = false;
	private tileEvents = false;
	private action: DebugToolsTranslation;
	private method: DebugToolsTranslation;

	public constructor() {
		super();

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.SelectionMethod)))
			.append(new Dropdown<DebugToolsTranslation>()
				.setRefreshMethod(() => ({
					defaultOption: DebugToolsTranslation.MethodAll,
					options: [
						[DebugToolsTranslation.MethodAll, option => option.setText(translation(DebugToolsTranslation.MethodAll))],
						[DebugToolsTranslation.MethodNearest, option => option.setText(translation(DebugToolsTranslation.MethodNearest))],
						[DebugToolsTranslation.MethodRandom, option => option.setText(translation(DebugToolsTranslation.MethodRandom))],
					],
				}))
				.event.subscribe("selection", this.changeMethod))
			.append(this.rangeQuantity = new RangeRow()
				.classes.add("debug-tools-dialog-selection-quantity")
				.setLabel(label => label.hide())
				.editRange(range => range
					.setMax(55)
					.setStep(0.01))
				.setDisplayValue(value => [{ content: `${Math.floor(1.2 ** value)}` }]))
			.appendTo(this);

		this.changeMethod(null, DebugToolsTranslation.MethodAll);

		new CheckButton()
			.setText(translation(DebugToolsTranslation.FilterCreatures))
			.event.subscribe("toggle", (_, enabled) => this.creatures = enabled)
			.appendTo(this);

		new CheckButton()
			.setText(translation(DebugToolsTranslation.FilterNPCs))
			.event.subscribe("toggle", (_, enabled) => this.npcs = enabled)
			.appendTo(this);

		new CheckButton()
			.setText(translation(DebugToolsTranslation.FilterTileEvents))
			.event.subscribe("toggle", (_, enabled) => this.tileEvents = enabled)
			.appendTo(this);

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.SelectionAction)))
			.append(new Dropdown<DebugToolsTranslation>()
				.event.subscribe("selection", (_, action) => this.action = action)
				.setRefreshMethod(() => ({
					defaultOption: DebugToolsTranslation.ActionRemove,
					options: [
						[DebugToolsTranslation.ActionRemove, option => option.setText(translation(DebugToolsTranslation.ActionRemove))],
					],
				})))
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonExecute))
			.event.subscribe("activate", this.execute)
			.appendTo(this);
	}

	@Override public getTranslation() {
		return DebugToolsTranslation.PanelSelection;
	}

	@Bound
	public execute() {
		const targets = Stream.of<(false | (undefined | ICreature | INPC | ITileEvent)[])[]>(
			this.creatures && game.creatures,
			this.npcs && game.npcs,
			this.tileEvents && game.tileEvents,
		)
			.flatMap(value => Array.isArray(value) ? value : value ? [value] : [])
			.filter<undefined>(entity => !!entity)
			.toArray();

		if (!targets.length) return;

		let quantity = Math.floor(1.2 ** this.rangeQuantity.value);

		switch (this.method) {
			case DebugToolsTranslation.MethodAll:
				quantity = targets.length;
				break;

			case DebugToolsTranslation.MethodRandom:
				Arrays.shuffle(targets);
				break;

			case DebugToolsTranslation.MethodNearest:
				targets.sort((a, b) => Vector2.squaredDistance(a, localPlayer) - Vector2.squaredDistance(b, localPlayer));
				break;
		}

		ActionExecutor.get(SelectionExecute).execute(localPlayer, this.action, targets.slice(0, quantity)
			.map(target => tuple(getSelectionType(target), target.id)));
	}

	@Bound
	private changeMethod(_: any, method: DebugToolsTranslation) {
		this.method = method;
		this.rangeQuantity.toggle(method !== DebugToolsTranslation.MethodAll);
	}
}

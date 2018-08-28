import { ICreature } from "creature/ICreature";
import { EntityType } from "entity/IEntity";
import Button, { ButtonEvent } from "newui/component/Button";
import { CheckButton, CheckButtonEvent } from "newui/component/CheckButton";
import Dropdown, { DropdownEvent } from "newui/component/Dropdown";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeRow } from "newui/component/RangeRow";
import IGameScreenApi from "newui/screen/screens/game/IGameScreenApi";
import { INPC } from "npc/INPC";
import { ITileEvent } from "tile/ITileEvent";
import Arrays, { tuple } from "utilities/Arrays";
import Collectors from "utilities/Collectors";
import { pipe } from "utilities/IterableIterator";
import Vector2 from "utilities/math/Vector2";
import { Bound } from "utilities/Objects";
import Actions from "../../Actions";
import { translation } from "../../DebugTools";
import { DebugToolsTranslation } from "../../IDebugTools";
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
	private readonly dropdownMethod: Dropdown<string | number>;
	private readonly rangeQuantity: RangeRow;
	private readonly dropdownAction: Dropdown<string | number>;

	private creatures = false;
	private npcs = false;
	private tileEvents = false;
	private action: DebugToolsTranslation;
	private method: DebugToolsTranslation;

	public constructor(gsapi: IGameScreenApi) {
		super(gsapi);

		new LabelledRow(this.api)
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.SelectionMethod)))
			.append(this.dropdownMethod = new Dropdown(this.api)
				.setRefreshMethod(() => ({
					defaultOption: DebugToolsTranslation.MethodAll,
					options: [
						[DebugToolsTranslation.MethodAll, option => option.setText(translation(DebugToolsTranslation.MethodAll))],
						[DebugToolsTranslation.MethodNearest, option => option.setText(translation(DebugToolsTranslation.MethodNearest))],
						[DebugToolsTranslation.MethodRandom, option => option.setText(translation(DebugToolsTranslation.MethodRandom))],
					],
				}))
				.on(DropdownEvent.Selection, this.changeMethod))
			.append(this.rangeQuantity = new RangeRow(this.api)
				.classes.add("debug-tools-dialog-selection-quantity")
				.setLabel(label => label.hide())
				.editRange(range => range
					.setMax(55)
					.setStep(0.01))
				.setDisplayValue(value => [{ content: `${Math.floor(1.2 ** value)}` }]))
			.appendTo(this);

		this.changeMethod(null, DebugToolsTranslation.MethodAll);

		new CheckButton(this.api)
			.setText(translation(DebugToolsTranslation.FilterCreatures))
			.on<[boolean]>(CheckButtonEvent.Change, (_, enabled) => { this.creatures = enabled; })
			.appendTo(this);

		new CheckButton(this.api)
			.setText(translation(DebugToolsTranslation.FilterNPCs))
			.on<[boolean]>(CheckButtonEvent.Change, (_, enabled) => { this.npcs = enabled; })
			.appendTo(this);

		new CheckButton(this.api)
			.setText(translation(DebugToolsTranslation.FilterTileEvents))
			.on<[boolean]>(CheckButtonEvent.Change, (_, enabled) => { this.tileEvents = enabled; })
			.appendTo(this);

		new LabelledRow(this.api)
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.SelectionAction)))
			.append(this.dropdownAction = new Dropdown(this.api)
				.on<[DebugToolsTranslation]>(DropdownEvent.Selection, (_, action) => this.action = action)
				.setRefreshMethod(() => ({
					defaultOption: DebugToolsTranslation.ActionRemove,
					options: [
						[DebugToolsTranslation.ActionRemove, option => option.setText(translation(DebugToolsTranslation.ActionRemove))],
					],
				})))
			.appendTo(this);

		new Button(this.api)
			.setText(translation(DebugToolsTranslation.ButtonExecute))
			.on(ButtonEvent.Activate, this.execute)
			.appendTo(this);
	}

	public getTranslation() {
		return DebugToolsTranslation.PanelSelection;
	}

	@Bound
	public execute() {
		const targets = pipe(
			this.creatures && game.creatures,
			this.npcs && game.npcs,
			this.tileEvents && game.tileEvents)
			.flat()
			.filter<undefined | boolean>(entity => !!entity)
			.collect(Collectors.toArray);

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

		Actions.get("executeOnSelection").execute({
			object: [
				this.action,
				targets.slice(0, quantity)
					.map(target => tuple(getSelectionType(target), target.id)),
			],
		});
	}

	@Bound
	private changeMethod(_: any, method: DebugToolsTranslation) {
		this.method = method;
		this.rangeQuantity.toggle(method !== DebugToolsTranslation.MethodAll);
	}
}

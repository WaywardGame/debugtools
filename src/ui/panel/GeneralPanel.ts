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

import { SfxType } from "@wayward/game/audio/IAudio";
import { EventBus } from "@wayward/game/event/EventBuses";
import { EventHandler } from "@wayward/game/event/EventManager";
import { TickFlag } from "@wayward/game/game/IGame";
import { BiomeType } from "@wayward/game/game/biome/IBiome";
import { DEFAULT_ISLAND_ID, IslandId, IslandPosition } from "@wayward/game/game/island/IIsland";
import Tile from "@wayward/game/game/tile/Tile";
import Dictionary from "@wayward/game/language/Dictionary";
import { TextContext } from "@wayward/game/language/ITranslation";
import Translation from "@wayward/game/language/Translation";
import TranslationImpl from "@wayward/game/language/impl/TranslationImpl";
import Mod from "@wayward/game/mod/Mod";
import { ParticleType } from "@wayward/game/renderer/particle/IParticle";
import particles from "@wayward/game/renderer/particle/Particles";
import { BlockRow } from "@wayward/game/ui/component/BlockRow";
import Button from "@wayward/game/ui/component/Button";
import { CheckButton } from "@wayward/game/ui/component/CheckButton";
import Divider from "@wayward/game/ui/component/Divider";
import Dropdown, { IDropdownOption } from "@wayward/game/ui/component/Dropdown";
import Input from "@wayward/game/ui/component/Input";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import { RangeRow } from "@wayward/game/ui/component/RangeRow";
import Text, { Heading } from "@wayward/game/ui/component/Text";
import BaseIslandDropdown from "@wayward/game/ui/component/dropdown/IslandDropdown";
import MovementHandler from "@wayward/game/ui/screen/screens/game/util/movement/MovementHandler";
import Enums from "@wayward/game/utilities/enum/Enums";
import { Bound, Debounce } from "@wayward/utilities/Decorators";
import { Tuple } from "@wayward/utilities/collection/Tuple";
import { OwnEventHandler } from "@wayward/utilities/event/EventManager";
import { WorldZ } from "@wayward/utilities/game/WorldZ";
import CancelablePromise from "@wayward/utilities/promise/CancelablePromise";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import ChangeLayer from "../../action/ChangeLayer";
import FastForward from "../../action/FastForward";
import ForceSailToCivilization from "../../action/ForceSailToCivilization";
import MoveToIsland from "../../action/MoveToIsland";
import RenameIsland from "../../action/RenameIsland";
import SetTime from "../../action/SetTime";
import DebugToolsPanel from "../component/DebugToolsPanel";


const TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX = "new_island_";

function getTravelDropdownNewIslandOptionId(biomeType: BiomeType): string {
	return `${TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX}${BiomeType[biomeType].toLowerCase()}`;
}

export default class GeneralPanel extends DebugToolsPanel {

	@Mod.instance<DebugTools>(DEBUG_TOOLS_ID)
	public readonly DEBUG_TOOLS: DebugTools;

	private readonly timeRange: RangeRow;
	private readonly inspectButton: CheckButton;
	private readonly checkButtonAudio: CheckButton;
	private readonly dropdownAudio: Dropdown<SfxType>;
	private readonly dropdownParticle: Dropdown<ParticleType>;
	private readonly dropdownLayer: Dropdown<WorldZ>;
	private readonly dropdownTravel: IslandDropdown<string>;
	private readonly checkButtonParticle: CheckButton;

	private selectionPromise: CancelablePromise<Tile> | undefined;

	public constructor() {
		super();

		this.inspectButton = new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonInspect))
			.setRefreshMethod(() => !!this.selectionPromise)
			.event.subscribe("willToggle", (_, checked) => {
				this.checkButtonAudio.setChecked(false, false);
				this.checkButtonParticle.setChecked(false, false);

				return this.selectionLogic(checked, (tile) => {
					this.inspectButton.setChecked(false, false);

					if (tile) {
						this.DEBUG_TOOLS.inspect(tile);
					}
				});
			})
			.appendTo(this);

		new Button()
			.setText(translation(DebugToolsTranslation.ButtonInspectLocalPlayer))
			.event.subscribe("activate", () => this.DEBUG_TOOLS.inspect(localPlayer))
			.appendTo(this);

		new Divider().appendTo(this);

		////////////////////////////////////
		// Island
		//

		new Heading()
			.classes.add("debug-tools-island-heading")
			.append(new Text()
				.setText(translation(DebugToolsTranslation.HeadingIslandCurrent)))
			.append(new Input()
				.setDefault(() => localIsland.getName())
				.setClearTo(() => localIsland.getName())
				.setClearToDefaultWhenEmpty()
				.clear()
				.event.subscribe("done", this.renameIsland))
			.append(new Text()
				.setText(translation(DebugToolsTranslation.Island)
					.addArgs(localIsland.id, "", Translation.get(Dictionary.Biome, localIsland.biomeType))))
			.appendTo(this);

		////////////////////////////////////
		// Time
		//

		this.timeRange = new RangeRow()
			.classes.add("debug-tools-range-row-no-default-button")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelTime)))
			.editRange(range => range
				.setStep(0.001)
				.setMin(0)
				.setMax(1)
				.setRefreshMethod(() => game.time.getTime()))
			.setDisplayValue(time => game.time.getTranslation(time))
			.event.subscribe("change", (_, time) => {
				SetTime.execute(localPlayer, time);
			})
			.appendTo(this);

		const fastForwardRow: RangeRow = new RangeRow()
			.classes.add("has-default-button")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelFastForward)))
			.editRange(range => range
				.setStep(0.01)
				.setMax(50))
			.setDisplayValue(value => [{ content: `${Math.floor(1.3 ** value)}` }])
			.append(new Button()
				.setText(translation(DebugToolsTranslation.ButtonExecute))
				.event.subscribe("activate", () =>
					FastForward.execute(localPlayer, Math.floor(1.3 ** fastForwardRow.value), TickFlag.All)))
			.appendTo(this);

		////////////////////////////////////
		// Layer
		//

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelLayer)))
			.append(this.dropdownLayer = new Dropdown<WorldZ>()
				.setRefreshMethod(() => ({
					options: Array.from(localIsland.world.layers.values())
						.map(layer => [layer.z, option => option.setText(translation(DebugToolsTranslation.OptionLayer)
							.addArgs(layer.z, Translation.get(Dictionary.WorldLayer, layer.z).inContext(TextContext.Title), Enums.getMod(WorldZ, layer.z)?.config.name))] as IDropdownOption<number>),
					defaultOption: localPlayer.z,
				}))
				.event.subscribe("selection", this.changeLayer))
			.appendTo(this);

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelTravel)))
			.append(this.dropdownTravel = new IslandDropdown<string>(getTravelDropdownNewIslandOptionId(BiomeType.Random), () => [
				...Enums.values(BiomeType).filter(biomeType => biomeType !== BiomeType.Template && (biomeType !== BiomeType.Dungeon || saveDataGlobal.options.developerMode))
					.map(biome => [getTravelDropdownNewIslandOptionId(biome), option => option
						.setText(translation(DebugToolsTranslation.OptionTravelNewIsland)
							.addArgs(Translation.get(Dictionary.Biome, biome).inContext(TextContext.Title)))] as IDropdownOption<string>),
				["civilization", option => option.setText(translation(DebugToolsTranslation.OptionTravelCivilization))],
				["random", option => option.setText(translation(DebugToolsTranslation.OptionTravelRandomIsland))],
			]))
			.appendTo(this);

		new Button()
			.classes.add("has-icon-before", "icon-arrow-right", "icon-no-scale")
			.style.set("--icon-zoom", 2)
			.setText(translation(DebugToolsTranslation.ButtonTravel))
			.event.subscribe("activate", this.travel)
			.appendTo(this);

		new Divider().appendTo(this);

		////////////////////////////////////
		// Misc
		//

		new BlockRow()
			.classes.add("debug-tools-dialog-checkbutton-dropdown-row")
			.append(this.checkButtonAudio = new CheckButton()
				.setText(translation(DebugToolsTranslation.ButtonAudio))
				.event.subscribe("willToggle", (_, checked) => {
					this.inspectButton.setChecked(false, false);
					this.checkButtonParticle.setChecked(false, false);

					return this.selectionLogic(checked, (tile) => tile?.queueSoundEffect(this.dropdownAudio.selectedOption), () => this.checkButtonAudio.checked);
				}))
			.append(this.dropdownAudio = new Dropdown<SfxType>()
				.setRefreshMethod(() => ({
					defaultOption: SfxType.UiActivate,
					options: Enums.values(SfxType)
						.map(sfx => Tuple(sfx, TranslationImpl.generator(SfxType[sfx])))
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.map(([id, t]) => Tuple(id, (option: Button) => option.setText(t))),
				})))
			.appendTo(this);

		new BlockRow()
			.classes.add("debug-tools-dialog-checkbutton-dropdown-row")
			.append(this.checkButtonParticle = new CheckButton()
				.setText(translation(DebugToolsTranslation.ButtonParticle))
				.event.subscribe("willToggle", (_, checked) => {
					this.inspectButton.setChecked(false, false);
					this.checkButtonAudio.setChecked(false, false);

					return this.selectionLogic(checked, (tile) => tile?.createParticles(particles[this.dropdownParticle.selectedOption]), () => this.checkButtonParticle.checked);
				}))
			.append(this.dropdownParticle = new Dropdown<ParticleType>()
				.setRefreshMethod(() => ({
					defaultOption: ParticleType.Blood,
					options: Enums.values(ParticleType)
						.map(particle => Tuple(particle, TranslationImpl.generator(ParticleType[particle])))
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.map(([id, t]) => Tuple(id, (option: Button) => option.setText(t))),
				})))
			.appendTo(this);
	}

	public override getTranslation(): DebugToolsTranslation {
		return DebugToolsTranslation.PanelGeneral;
	}

	@EventHandler(MovementHandler, "canMove")
	public canClientMove(): false | undefined {
		if (this.selectionPromise || this.checkButtonAudio.checked || this.checkButtonParticle.checked) return false;

		return undefined;
	}

	@EventHandler(EventBus.LocalPlayer, "changeZ")
	protected onChangeZ(_: any, z: WorldZ): void {
		if (this.dropdownLayer.selection === z)
			return;

		this.dropdownLayer.refresh();
	}

	@EventHandler(EventBus.Island, "tickEnd")
	@Debounce(100)
	public onGameTickEnd(): void {
		if (this.timeRange) {
			this.timeRange.refresh();
		}
	}

	private selectionLogic(checked: boolean, onSelection: (tile: Tile | undefined) => void, triggerAgain?: () => boolean): boolean {
		if (this.selectionPromise && !this.selectionPromise.isResolved) {
			this.selectionPromise.cancel();
		}

		delete this.selectionPromise;

		if (checked) {
			this.selectionPromise = this.DEBUG_TOOLS.selector.select();
			this.selectionPromise.then((tile) => {
				delete this.selectionPromise;

				onSelection(tile);

				if (triggerAgain?.()) {
					setTimeout(() => {
						this.selectionLogic(triggerAgain?.(), onSelection, triggerAgain);
					}, 100);
				}
			});
		}

		return true;
	}

	@OwnEventHandler(GeneralPanel, "switchTo")
	protected onSwitchTo(): void {
		this.timeRange.refresh();
		this.dropdownLayer.refresh();

		this.DEBUG_TOOLS.event.until(this, "switchAway")
			.subscribe("inspect", () => {
				if (this.selectionPromise) this.selectionPromise.cancel();
			});
	}

	@OwnEventHandler(GeneralPanel, "switchAway")
	protected onSwitchAway(): void {
		this.selectionPromise?.cancel();
		delete this.selectionPromise;

		this.inspectButton.setChecked(false, false);
		this.checkButtonAudio.setChecked(false, false);
		this.checkButtonParticle.setChecked(false, false);
	}

	@Bound private changeLayer(_: any, layer: WorldZ): void {
		if (localPlayer.z !== layer) {
			ChangeLayer.execute(localPlayer, layer);
		}
	}

	@Bound private travel(): void {
		if (this.dropdownTravel.selectedOption === "civilization") {
			this.sailToCivilization();
			return;
		}

		let islandId: IslandId = DEFAULT_ISLAND_ID;
		const biome = Enums.values(BiomeType)
			.find(b => this.dropdownTravel.selectedOption === getTravelDropdownNewIslandOptionId(b)) ?? BiomeType.Random;

		if (this.dropdownTravel.selectedOption.startsWith(TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX)) {
			const currentIslandPosition = localIsland.position;

			for (let i = 1; i < Infinity; i++) {
				const nextPosition = {
					x: currentIslandPosition.x,
					y: currentIslandPosition.y + i,
				};

				islandId = IslandPosition.toId(nextPosition);
				if (!game.islands.has(islandId)) {
					break;
				}
			}

		} else {
			islandId = this.dropdownTravel.selection !== "random"
				? this.dropdownTravel.selection as IslandId
				: game.islands.keys()
					.filter(id => id !== localIsland.id)
					.random()!;
		}

		MoveToIsland.execute(localPlayer, islandId, biome);
	}

	private async sailToCivilization(): Promise<void> {
		if (multiplayer.isConnected && !game.isChallenge) return;
		ForceSailToCivilization.execute(localPlayer);
	}

	@Bound private renameIsland(input: Input): void {
		RenameIsland.execute(localPlayer, input.text);
		this.dropdownTravel.refresh();
	}
}

class IslandDropdown<OTHER_OPTIONS extends string = never> extends BaseIslandDropdown<OTHER_OPTIONS> {

	public constructor(defaultOption: IslandId | OTHER_OPTIONS, options: SupplierOr<Iterable<IDropdownOption<OTHER_OPTIONS>>>) {
		super(defaultOption, options);
	}

	protected override isInGroup(islandId: IslandId, biome: BiomeType): boolean {
		if (islandId.startsWith(TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX))
			return islandId === getTravelDropdownNewIslandOptionId(biome);

		return super.isInGroup(islandId, biome);
	}
}

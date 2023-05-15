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

import { SfxType } from "audio/IAudio";
import { EventBus } from "event/EventBuses";
import { EventHandler, OwnEventHandler } from "event/EventManager";
import { WorldZ } from "game/WorldZ";
import { BiomeType } from "game/biome/IBiome";
import { DEFAULT_ISLAND_ID, IslandId, IslandPosition } from "game/island/IIsland";
import { ReferenceType } from "game/reference/IReferenceManager";
import Tile from "game/tile/Tile";
import Dictionary from "language/Dictionary";
import { TextContext } from "language/ITranslation";
import Translation from "language/Translation";
import TranslationImpl from "language/impl/TranslationImpl";
import Mod from "mod/Mod";
import { ParticleType } from "renderer/particle/IParticle";
import particles from "renderer/particle/Particles";
import { BlockRow } from "ui/component/BlockRow";
import Button from "ui/component/Button";
import { CheckButton } from "ui/component/CheckButton";
import Divider from "ui/component/Divider";
import Dropdown, { IDropdownOption } from "ui/component/Dropdown";
import GroupDropdown from "ui/component/GroupDropdown";
import Input from "ui/component/Input";
import { LabelledRow } from "ui/component/LabelledRow";
import { RangeRow } from "ui/component/RangeRow";
import Text, { Heading } from "ui/component/Text";
import MovementHandler from "ui/screen/screens/game/util/movement/MovementHandler";
import Tooltip from "ui/tooltip/Tooltip";
import { Bound, Debounce } from "utilities/Decorators";
import { Tuple } from "utilities/collection/Tuple";
import Enums from "utilities/enum/Enums";
import DebugTools from "../../DebugTools";
import { DEBUG_TOOLS_ID, DebugToolsTranslation, translation } from "../../IDebugTools";
import ChangeLayer from "../../action/ChangeLayer";
import ForceSailToCivilization from "../../action/ForceSailToCivilization";
import MoveToIsland from "../../action/MoveToIsland";
import RenameIsland from "../../action/RenameIsland";
import SetTime from "../../action/SetTime";
import CancelablePromise from "../../util/CancelablePromise";
import DebugToolsPanel from "../component/DebugToolsPanel";


const TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX = "new_island_";

function getTravelDropdownNewIslandOptionId(biomeType: BiomeType) {
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
	private readonly dropdownLayer: Dropdown<number>;
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
				.setRefreshMethod(() => localIsland.time.getTime()))
			.setDisplayValue(time => localIsland.time.getTranslation(time))
			.event.subscribe("change", (_, time) => {
				SetTime.execute(localPlayer, time);
			})
			.appendTo(this);

		////////////////////////////////////
		// Layer
		//

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelLayer)))
			.append(this.dropdownLayer = new Dropdown<number>()
				.setRefreshMethod(() => ({
					options: Object.values(localIsland.world.layers)
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
				...Enums.values(BiomeType)
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

					return this.selectionLogic(checked, (tile) => tile?.queueSoundEffect(this.dropdownAudio.selection), () => this.checkButtonAudio.checked);
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

					return this.selectionLogic(checked, (tile) => tile?.createParticles(particles[this.dropdownParticle.selection]), () => this.checkButtonParticle.checked);
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

	public override getTranslation() {
		return DebugToolsTranslation.PanelGeneral;
	}

	@EventHandler(MovementHandler, "canMove")
	public canClientMove(): false | undefined {
		if (this.selectionPromise || this.checkButtonAudio.checked || this.checkButtonParticle.checked) return false;

		return undefined;
	}

	@EventHandler(EventBus.LocalPlayer, "changeZ")
	protected onChangeZ(_: any, z: number) {
		if (this.dropdownLayer.selection === z)
			return;

		this.dropdownLayer.refresh();
	}

	@EventHandler(EventBus.Game, "tickEnd")
	@Debounce(100)
	public onGameTickEnd() {
		if (this.timeRange) {
			this.timeRange.refresh();
		}
	}

	@EventHandler(EventBus.LocalPlayer, "loadedOnIsland")
	protected onLoadOnIsland() {
		this.dropdownTravel.refresh();
	}

	private selectionLogic(checked: boolean, onSelection: (tile: Tile | undefined) => void, triggerAgain?: () => boolean) {
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
	protected onSwitchTo() {
		this.timeRange.refresh();
		this.dropdownLayer.refresh();

		this.DEBUG_TOOLS.event.until(this, "switchAway")
			.subscribe("inspect", () => {
				if (this.selectionPromise) this.selectionPromise.cancel();
			});
	}

	@OwnEventHandler(GeneralPanel, "switchAway")
	protected onSwitchAway() {
		this.selectionPromise?.cancel();
		delete this.selectionPromise;

		this.inspectButton.setChecked(false, false);
		this.checkButtonAudio.setChecked(false, false);
		this.checkButtonParticle.setChecked(false, false);
	}

	@Bound private changeLayer(_: any, layer: WorldZ) {
		if (localPlayer.z !== layer) {
			ChangeLayer.execute(localPlayer, layer);
		}
	}

	@Bound private travel() {
		if (this.dropdownTravel.selection === "civilization") {
			this.sailToCivilization();
			return;
		}

		let islandId: IslandId = DEFAULT_ISLAND_ID;
		const biome = Enums.values(BiomeType)
			.find(b => this.dropdownTravel.selection === getTravelDropdownNewIslandOptionId(b)) ?? BiomeType.Random;

		if (this.dropdownTravel.selection.startsWith(TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX)) {
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

	private async sailToCivilization() {
		if (multiplayer.isConnected() && !game.isChallenge) return;
		ForceSailToCivilization.execute(localPlayer);
	}

	@Bound private renameIsland(input: Input) {
		RenameIsland.execute(localPlayer, input.text);
		this.dropdownTravel.refresh();
	}
}

class IslandDropdown<OTHER_OPTIONS extends string = never> extends GroupDropdown<Record<IslandId, string>, OTHER_OPTIONS, BiomeType> {

	public constructor(defaultOption: IslandId | OTHER_OPTIONS, options: SupplierOr<Iterable<IDropdownOption<OTHER_OPTIONS>>>) {
		super(game.islands.keyStream().toObject(key => [key, key]), undefined, defaultOption, options);
		this.setPrefix("biome");
	}

	protected override getTranslation(islandId: IslandId) {
		const island = game.islands.get(islandId);
		return translation(DebugToolsTranslation.Island)
			.addArgs(islandId, island?.getName(), Translation.get(Dictionary.Biome, island?.biomeType ?? BiomeType.Random));
	}

	protected override getGroupName(biome: BiomeType) {
		return Translation.get(Dictionary.Biome, biome).getString();
	}

	protected override optionTooltipInitializer(tooltip: Tooltip, islandId: IslandId) {
		const island = game.islands.getIfExists(islandId);
		if (island?.referenceId === undefined) {
			return undefined;
		}

		return game.references.tooltip([island.referenceId, ReferenceType.Island])(tooltip);
	}

	protected override shouldIncludeOtherOptionsInGroupFilter() {
		return true;
	}

	protected override isInGroup(islandId: IslandId, biome: BiomeType) {
		if (islandId.startsWith(TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX))
			return islandId === getTravelDropdownNewIslandOptionId(biome);

		return game.islands.getIfExists(islandId)?.biomeType === biome;
	}

	protected override getGroups() {
		return Enums.values(BiomeType).slice(1);
	}

	@OwnEventHandler(IslandDropdown, "refresh")
	protected onRefresh() {
		this.options.get(localIsland.id)?.setDisabled(true);
		this.options.get("random")?.setDisabled(game.islands.size <= 1);
	}
}

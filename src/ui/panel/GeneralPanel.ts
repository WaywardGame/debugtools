import { SfxType } from "audio/IAudio";
import ActionExecutor from "entity/action/ActionExecutor";
import { EventBus } from "event/EventBuses";
import { Priority } from "event/EventEmitter";
import { EventHandler, OwnEventHandler } from "event/EventManager";
import { BiomeType } from "game/IBiome";
import Island from "game/Island";
import { WorldZ } from "game/WorldZ";
import { Dictionary } from "language/Dictionaries";
import Translation, { TextContext } from "language/Translation";
import { HookMethod } from "mod/IHookHost";
import Mod from "mod/Mod";
import { Registry } from "mod/ModRegistry";
import { BlockRow } from "newui/component/BlockRow";
import Button from "newui/component/Button";
import { CheckButton } from "newui/component/CheckButton";
import Divider from "newui/component/Divider";
import Dropdown, { IDropdownOption } from "newui/component/Dropdown";
import GroupDropdown from "newui/component/GroupDropdown";
import Input from "newui/component/Input";
import { LabelledRow } from "newui/component/LabelledRow";
import { RangeRow } from "newui/component/RangeRow";
import Text, { Heading } from "newui/component/Text";
import Bind, { IBindHandlerApi } from "newui/input/Bind";
import MovementHandler from "newui/screen/screens/game/util/movement/MovementHandler";
import { ParticleType } from "renderer/particle/IParticle";
import particles from "renderer/particle/Particles";
import { Tuple } from "utilities/Arrays";
import Enums from "utilities/enum/Enums";
import Vector2 from "utilities/math/Vector2";
import ChangeLayer from "../../action/ChangeLayer";
import ForceSailToCivilization from "../../action/ForceSailToCivilization";
import RenameIsland from "../../action/RenameIsland";
import SetTime from "../../action/SetTime";
import DebugTools from "../../DebugTools";
import { DebugToolsTranslation, DEBUG_TOOLS_ID, translation } from "../../IDebugTools";
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

	private selectionPromise: CancelablePromise<Vector2> | undefined;

	public constructor() {
		super();

		this.inspectButton = new CheckButton()
			.setText(translation(DebugToolsTranslation.ButtonInspect))
			.setRefreshMethod(() => !!this.selectionPromise)
			.event.subscribe("willToggle", (_, checked) => {
				if (!!this.selectionPromise !== checked) {
					if (checked && this.DEBUG_TOOLS.selector.selecting) return false;

					if (!checked) {
						if (this.selectionPromise && !this.selectionPromise.isResolved) {
							this.selectionPromise.cancel();
						}

						delete this.selectionPromise;

					} else {
						this.selectionPromise = this.DEBUG_TOOLS.selector.select();
						this.selectionPromise.then(this.inspectTile);
					}
				}

				return true;
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
				.setDefault(() => island.id)
				.setClearTo(() => island.name || island.id)
				.setClearToDefaultWhenEmpty()
				.clear()
				.event.subscribe("done", this.renameIsland))
			.append(new Text()
				.setText(translation(DebugToolsTranslation.Island)
					.addArgs("", "", new Translation(Dictionary.Biome, island.biomeType))))
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
				.setRefreshMethod(() => island.time.getTime()))
			.setDisplayValue(time => island.time.getTranslation(time))
			.event.subscribe("change", (_, time) => {
				ActionExecutor.get(SetTime).execute(localPlayer, time);
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
					options: Object.values(world.layers)
						.map(layer => [layer.level, option => option.setText(translation(DebugToolsTranslation.OptionLayer)
							.addArgs(layer.level, new Translation(Dictionary.WorldLayer, layer.level).inContext(TextContext.Title), Enums.getMod(WorldZ, layer.level)?.config.name))] as IDropdownOption<number>),
					defaultOption: localPlayer.z,
				}))
				.event.subscribe("selection", this.changeLayer))
			.appendTo(this);

		new LabelledRow()
			.classes.add("dropdown-label")
			.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelTravel)))
			.append(this.dropdownTravel = new IslandDropdown<string>(getTravelDropdownNewIslandOptionId(BiomeType.Random), [
				...Enums.values(BiomeType)
					.map(biome => [getTravelDropdownNewIslandOptionId(biome), option => option.setText(translation(DebugToolsTranslation.OptionTravelNewIsland)
						.addArgs(new Translation(Dictionary.Biome, biome).inContext(TextContext.Title)))] as IDropdownOption<string>),
				["random", option => option.setText(translation(DebugToolsTranslation.OptionTravelRandomIsland))],
				["civilization", option => option.setText(translation(DebugToolsTranslation.OptionTravelCivilization))],
			]))
			.appendTo(this);

		new Button()
			.classes.add("has-icon-before", "icon-arrow-right", "icon-no-scale")
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
				.setText(translation(DebugToolsTranslation.ButtonAudio)))
			.append(this.dropdownAudio = new Dropdown<SfxType>()
				.setRefreshMethod(() => ({
					defaultOption: SfxType.Click,
					options: Enums.values(SfxType)
						.map(sfx => Tuple(sfx, Translation.generator(SfxType[sfx])))
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.map(([id, t]) => Tuple(id, (option: Button) => option.setText(t))),
				})))
			.appendTo(this);

		new BlockRow()
			.classes.add("debug-tools-dialog-checkbutton-dropdown-row")
			.append(this.checkButtonParticle = new CheckButton()
				.setText(translation(DebugToolsTranslation.ButtonParticle)))
			.append(this.dropdownParticle = new Dropdown<ParticleType>()
				.setRefreshMethod(() => ({
					defaultOption: ParticleType.Blood,
					options: Enums.values(ParticleType)
						.map(particle => Tuple(particle, Translation.generator(ParticleType[particle])))
						.sort(([, t1], [, t2]) => Text.toString(t1).localeCompare(Text.toString(t2)))
						.map(([id, t]) => Tuple(id, (option: Button) => option.setText(t))),
				})))
			.appendTo(this);
	}

	@Override public getTranslation() {
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

	@HookMethod
	public onGameTickEnd() {
		if (this.timeRange) {
			this.timeRange.refresh();
		}
	}

	@Bind.onDown(Registry<DebugTools>(DEBUG_TOOLS_ID).registry("selector").get("bindableSelectLocation"), Priority.High)
	public onSelectLocation(api: IBindHandlerApi) {
		if (!this.checkButtonAudio.checked && !this.checkButtonParticle.checked)
			return false;

		const position = renderer?.screenToTile(...api.mouse.position.xy);
		if (!position)
			return false;

		if (this.checkButtonAudio.checked)
			audio.queueEffect(this.dropdownAudio.selection, position.x, position.y, localPlayer.z);

		else
			game.particle.create(position.x, position.y, localPlayer.z, particles[this.dropdownParticle.selection]);

		return true;
	}

	@OwnEventHandler(GeneralPanel, "switchTo")
	protected onSwitchTo() {
		this.timeRange.refresh();

		this.registerHookHost("DebugToolsDialog:GeneralPanel");

		this.DEBUG_TOOLS.event.until(this, "switchAway")
			.subscribe("inspect", () => {
				if (this.selectionPromise) this.selectionPromise.cancel();
			});
	}

	@OwnEventHandler(GeneralPanel, "switchAway")
	protected onSwitchAway() {
		hookManager.deregister(this);
		if (this.selectionPromise) {
			this.selectionPromise.cancel();
			delete this.selectionPromise;
		}
	}

	@Bound
	private inspectTile(tilePosition?: Vector2) {
		delete this.selectionPromise;
		this.inspectButton.refresh();

		if (!tilePosition) return;

		this.DEBUG_TOOLS.inspect(tilePosition);
	}

	@Bound private changeLayer(_: any, layer: WorldZ) {
		ActionExecutor.get(ChangeLayer).execute(localPlayer, layer);
	}

	@Bound private travel() {
		if (this.dropdownTravel.selection === "civilization") {
			this.sailToCivilization();
			return;
		}

		if (this.dropdownTravel.selection.startsWith(TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX)) {
			this.travelToNewIsland();
			return;
		}

		const islandId = this.dropdownTravel.selection !== "random"
			? this.dropdownTravel.selection
			: game.islands.keys()
				.filter(id => id !== island.id)
				.random()!;

		game.travelToIslandId(islandId);
	}

	private travelToNewIsland() {
		const currentIslandPosition = island.position;

		for (let i = 1; i < Infinity; i++) {
			const nextPosition = {
				x: currentIslandPosition.x,
				y: currentIslandPosition.y + i,
			};

			const biome = Enums.values(BiomeType)
				.find(b => this.dropdownTravel.selection === getTravelDropdownNewIslandOptionId(b));

			const islandId = Island.positionToId(nextPosition);
			if (!game.islands.has(islandId)) {
				game.travelToIslandId(islandId, { newWorldBiomeTypeOverride: biome });
				return;
			}
		}
	}

	private async sailToCivilization() {
		if (multiplayer.isConnected() && !game.isChallenge) return;
		ActionExecutor.get(ForceSailToCivilization).execute(localPlayer);
	}

	@Bound private renameIsland(input: Input) {
		ActionExecutor.get(RenameIsland).execute(localPlayer, input.text);
		this.dropdownTravel.refresh();
	}
}

class IslandDropdown<OTHER_OPTIONS extends string = never> extends GroupDropdown<Record<string, string>, OTHER_OPTIONS, BiomeType> {

	public constructor(defaultOption: string | OTHER_OPTIONS, options: Iterable<IDropdownOption<OTHER_OPTIONS>>) {
		super(game.islands.keyStream().toObject(key => [key, key]), -1, defaultOption, options);
		this.options.get(island.id)?.setDisabled(true);
		this.options.get("random")?.setDisabled(game.islands.size <= 1);
		this.setPrefix("biome");
	}

	@Override protected getTranslation(islandId: string) {
		const island = game.islands.get(islandId);
		return translation(DebugToolsTranslation.Island)
			.addArgs(islandId, island?.name, new Translation(Dictionary.Biome, island?.biomeType ?? BiomeType.Random), island?.seeds.base);
	}

	@Override protected getGroupName(biome: BiomeType) {
		return new Translation(Dictionary.Biome, biome).getString();
	}

	@Override protected shouldIncludeOtherOptionsInGroupFilter() {
		return true;
	}

	@Override protected isInGroup(islandId: string, biome: BiomeType) {
		if (islandId.startsWith(TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX))
			return islandId === getTravelDropdownNewIslandOptionId(biome);

		return game.islands.get(islandId)?.biomeType === biome;
	}

	@Override protected getGroups() {
		return Enums.values(BiomeType).slice(1);
	}
}

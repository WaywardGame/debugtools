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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@wayward/game/audio/IAudio", "@wayward/game/event/EventBuses", "@wayward/game/event/EventManager", "@wayward/game/game/IGame", "@wayward/game/game/biome/IBiome", "@wayward/game/game/island/IIsland", "@wayward/game/language/Dictionary", "@wayward/game/language/ITranslation", "@wayward/game/language/Translation", "@wayward/game/language/impl/TranslationImpl", "@wayward/game/mod/Mod", "@wayward/game/renderer/particle/IParticle", "@wayward/game/renderer/particle/Particles", "@wayward/game/ui/component/BlockRow", "@wayward/game/ui/component/Button", "@wayward/game/ui/component/CheckButton", "@wayward/game/ui/component/Divider", "@wayward/game/ui/component/Dropdown", "@wayward/game/ui/component/Input", "@wayward/game/ui/component/LabelledRow", "@wayward/game/ui/component/RangeRow", "@wayward/game/ui/component/Text", "@wayward/game/ui/component/dropdown/IslandDropdown", "@wayward/game/ui/screen/screens/game/util/movement/MovementHandler", "@wayward/game/utilities/enum/Enums", "@wayward/utilities/Decorators", "@wayward/utilities/collection/Tuple", "@wayward/utilities/event/EventManager", "@wayward/utilities/game/WorldZ", "../../IDebugTools", "../../action/ChangeLayer", "../../action/FastForward", "../../action/ForceSailToCivilization", "../../action/MoveToIsland", "../../action/RenameIsland", "../../action/SetTime", "../component/DebugToolsPanel"], function (require, exports, IAudio_1, EventBuses_1, EventManager_1, IGame_1, IBiome_1, IIsland_1, Dictionary_1, ITranslation_1, Translation_1, TranslationImpl_1, Mod_1, IParticle_1, Particles_1, BlockRow_1, Button_1, CheckButton_1, Divider_1, Dropdown_1, Input_1, LabelledRow_1, RangeRow_1, Text_1, IslandDropdown_1, MovementHandler_1, Enums_1, Decorators_1, Tuple_1, EventManager_2, WorldZ_1, IDebugTools_1, ChangeLayer_1, FastForward_1, ForceSailToCivilization_1, MoveToIsland_1, RenameIsland_1, SetTime_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX = "new_island_";
    function getTravelDropdownNewIslandOptionId(biomeType) {
        return `${TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX}${IBiome_1.BiomeType[biomeType].toLowerCase()}`;
    }
    class GeneralPanel extends DebugToolsPanel_1.default {
        constructor() {
            super();
            this.inspectButton = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonInspect))
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
            new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonInspectLocalPlayer))
                .event.subscribe("activate", () => this.DEBUG_TOOLS.inspect(localPlayer))
                .appendTo(this);
            new Divider_1.default().appendTo(this);
            new Text_1.Heading()
                .classes.add("debug-tools-island-heading")
                .append(new Text_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.HeadingIslandCurrent)))
                .append(new Input_1.default()
                .setDefault(() => localIsland.getName())
                .setClearTo(() => localIsland.getName())
                .setClearToDefaultWhenEmpty()
                .clear()
                .event.subscribe("done", this.renameIsland))
                .append(new Text_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.Island)
                .addArgs(localIsland.id, "", Translation_1.default.get(Dictionary_1.default.Biome, localIsland.biomeType))))
                .appendTo(this);
            this.timeRange = new RangeRow_1.RangeRow()
                .classes.add("debug-tools-range-row-no-default-button")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelTime)))
                .editRange(range => range
                .setStep(0.001)
                .setMin(0)
                .setMax(1)
                .setRefreshMethod(() => game.time.getTime()))
                .setDisplayValue(time => game.time.getTranslation(time))
                .event.subscribe("change", (_, time) => {
                SetTime_1.default.execute(localPlayer, time);
            })
                .appendTo(this);
            const fastForwardRow = new RangeRow_1.RangeRow()
                .classes.add("has-default-button")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelFastForward)))
                .editRange(range => range
                .setStep(0.01)
                .setMax(50))
                .setDisplayValue(value => [{ content: `${Math.floor(1.3 ** value)}` }])
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonExecute))
                .event.subscribe("activate", () => FastForward_1.default.execute(localPlayer, Math.floor(1.3 ** fastForwardRow.value), IGame_1.TickFlag.All)))
                .appendTo(this);
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelLayer)))
                .append(this.dropdownLayer = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                options: Array.from(localIsland.world.layers.values())
                    .map(layer => [layer.z, option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.OptionLayer)
                        .addArgs(layer.z, Translation_1.default.get(Dictionary_1.default.WorldLayer, layer.z).inContext(ITranslation_1.TextContext.Title), Enums_1.default.getMod(WorldZ_1.WorldZ, layer.z)?.config.name))]),
                defaultOption: localPlayer.z,
            }))
                .event.subscribe("selection", this.changeLayer))
                .appendTo(this);
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelTravel)))
                .append(this.dropdownTravel = new IslandDropdown(getTravelDropdownNewIslandOptionId(IBiome_1.BiomeType.Random), () => [
                ...Enums_1.default.values(IBiome_1.BiomeType).filter(biomeType => biomeType !== IBiome_1.BiomeType.Template && (biomeType !== IBiome_1.BiomeType.Dungeon || saveDataGlobal.options.developerMode))
                    .map(biome => [getTravelDropdownNewIslandOptionId(biome), option => option
                        .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.OptionTravelNewIsland)
                        .addArgs(Translation_1.default.get(Dictionary_1.default.Biome, biome).inContext(ITranslation_1.TextContext.Title)))]),
                ["civilization", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.OptionTravelCivilization))],
                ["random", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.OptionTravelRandomIsland))],
            ]))
                .appendTo(this);
            new Button_1.default()
                .classes.add("has-icon-before", "icon-arrow-right", "icon-no-scale")
                .style.set("--icon-zoom", 2)
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonTravel))
                .event.subscribe("activate", this.travel)
                .appendTo(this);
            new Divider_1.default().appendTo(this);
            new BlockRow_1.BlockRow()
                .classes.add("debug-tools-dialog-checkbutton-dropdown-row")
                .append(this.checkButtonAudio = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonAudio))
                .event.subscribe("willToggle", (_, checked) => {
                this.inspectButton.setChecked(false, false);
                this.checkButtonParticle.setChecked(false, false);
                return this.selectionLogic(checked, (tile) => tile?.queueSoundEffect(this.dropdownAudio.selectedOption), () => this.checkButtonAudio.checked);
            }))
                .append(this.dropdownAudio = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: IAudio_1.SfxType.UiActivate,
                options: Enums_1.default.values(IAudio_1.SfxType)
                    .map(sfx => (0, Tuple_1.Tuple)(sfx, TranslationImpl_1.default.generator(IAudio_1.SfxType[sfx])))
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => (0, Tuple_1.Tuple)(id, (option) => option.setText(t))),
            })))
                .appendTo(this);
            new BlockRow_1.BlockRow()
                .classes.add("debug-tools-dialog-checkbutton-dropdown-row")
                .append(this.checkButtonParticle = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonParticle))
                .event.subscribe("willToggle", (_, checked) => {
                this.inspectButton.setChecked(false, false);
                this.checkButtonAudio.setChecked(false, false);
                return this.selectionLogic(checked, (tile) => tile?.createParticles(Particles_1.default[this.dropdownParticle.selectedOption]), () => this.checkButtonParticle.checked);
            }))
                .append(this.dropdownParticle = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: IParticle_1.ParticleType.Blood,
                options: Enums_1.default.values(IParticle_1.ParticleType)
                    .map(particle => (0, Tuple_1.Tuple)(particle, TranslationImpl_1.default.generator(IParticle_1.ParticleType[particle])))
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => (0, Tuple_1.Tuple)(id, (option) => option.setText(t))),
            })))
                .appendTo(this);
        }
        getTranslation() {
            return IDebugTools_1.DebugToolsTranslation.PanelGeneral;
        }
        canClientMove() {
            if (this.selectionPromise || this.checkButtonAudio.checked || this.checkButtonParticle.checked)
                return false;
            return undefined;
        }
        onChangeZ(_, z) {
            if (this.dropdownLayer.selection === z)
                return;
            this.dropdownLayer.refresh();
        }
        onGameTickEnd() {
            if (this.timeRange) {
                this.timeRange.refresh();
            }
        }
        selectionLogic(checked, onSelection, triggerAgain) {
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
        onSwitchTo() {
            this.timeRange.refresh();
            this.dropdownLayer.refresh();
            this.DEBUG_TOOLS.event.until(this, "switchAway")
                .subscribe("inspect", () => {
                if (this.selectionPromise)
                    this.selectionPromise.cancel();
            });
        }
        onSwitchAway() {
            this.selectionPromise?.cancel();
            delete this.selectionPromise;
            this.inspectButton.setChecked(false, false);
            this.checkButtonAudio.setChecked(false, false);
            this.checkButtonParticle.setChecked(false, false);
        }
        changeLayer(_, layer) {
            if (localPlayer.z !== layer) {
                ChangeLayer_1.default.execute(localPlayer, layer);
            }
        }
        travel() {
            if (this.dropdownTravel.selectedOption === "civilization") {
                this.sailToCivilization();
                return;
            }
            let islandId = IIsland_1.DEFAULT_ISLAND_ID;
            const biome = Enums_1.default.values(IBiome_1.BiomeType)
                .find(b => this.dropdownTravel.selectedOption === getTravelDropdownNewIslandOptionId(b)) ?? IBiome_1.BiomeType.Random;
            if (this.dropdownTravel.selectedOption.startsWith(TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX)) {
                const currentIslandPosition = localIsland.position;
                for (let i = 1; i < Infinity; i++) {
                    const nextPosition = {
                        x: currentIslandPosition.x,
                        y: currentIslandPosition.y + i,
                    };
                    islandId = IIsland_1.IslandPosition.toId(nextPosition);
                    if (!game.islands.has(islandId)) {
                        break;
                    }
                }
            }
            else {
                islandId = this.dropdownTravel.selection !== "random"
                    ? this.dropdownTravel.selection
                    : game.islands.keys()
                        .filter(id => id !== localIsland.id)
                        .random();
            }
            MoveToIsland_1.default.execute(localPlayer, islandId, biome);
        }
        async sailToCivilization() {
            if (multiplayer.isConnected && !game.isChallenge)
                return;
            ForceSailToCivilization_1.default.execute(localPlayer);
        }
        renameIsland(input) {
            RenameIsland_1.default.execute(localPlayer, input.text);
            this.dropdownTravel.refresh();
        }
    }
    exports.default = GeneralPanel;
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], GeneralPanel.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        (0, EventManager_1.EventHandler)(MovementHandler_1.default, "canMove")
    ], GeneralPanel.prototype, "canClientMove", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "changeZ")
    ], GeneralPanel.prototype, "onChangeZ", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Island, "tickEnd"),
        (0, Decorators_1.Debounce)(100)
    ], GeneralPanel.prototype, "onGameTickEnd", null);
    __decorate([
        (0, EventManager_2.OwnEventHandler)(GeneralPanel, "switchTo")
    ], GeneralPanel.prototype, "onSwitchTo", null);
    __decorate([
        (0, EventManager_2.OwnEventHandler)(GeneralPanel, "switchAway")
    ], GeneralPanel.prototype, "onSwitchAway", null);
    __decorate([
        Decorators_1.Bound
    ], GeneralPanel.prototype, "changeLayer", null);
    __decorate([
        Decorators_1.Bound
    ], GeneralPanel.prototype, "travel", null);
    __decorate([
        Decorators_1.Bound
    ], GeneralPanel.prototype, "renameIsland", null);
    class IslandDropdown extends IslandDropdown_1.default {
        constructor(defaultOption, options) {
            super(defaultOption, options);
        }
        isInGroup(islandId, biome) {
            if (islandId.startsWith(TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX))
                return islandId === getTravelDropdownNewIslandOptionId(biome);
            return super.isInGroup(islandId, biome);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhbFBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0dlbmVyYWxQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUE0Q0gsTUFBTSxpQ0FBaUMsR0FBRyxhQUFhLENBQUM7SUFFeEQsU0FBUyxrQ0FBa0MsQ0FBQyxTQUFvQjtRQUMvRCxPQUFPLEdBQUcsaUNBQWlDLEdBQUcsa0JBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO0lBQ3BGLENBQUM7SUFFRCxNQUFxQixZQUFhLFNBQVEseUJBQWU7UUFnQnhEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDcEMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDekQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDL0MsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUU7Z0JBQzdDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFFbEQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO29CQUM1QyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBRTVDLElBQUksSUFBSSxFQUFFLENBQUM7d0JBQ1YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2hDLENBQUM7Z0JBQ0YsQ0FBQyxDQUFDLENBQUM7WUFDSixDQUFDLENBQUM7aUJBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksZ0JBQU0sRUFBRTtpQkFDVixPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLHdCQUF3QixDQUFDLENBQUM7aUJBQ3BFLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN4RSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxpQkFBTyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBTTdCLElBQUksY0FBTyxFQUFFO2lCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUM7aUJBQ3pDLE1BQU0sQ0FBQyxJQUFJLGNBQUksRUFBRTtpQkFDaEIsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7aUJBQ2xFLE1BQU0sQ0FBQyxJQUFJLGVBQUssRUFBRTtpQkFDakIsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDdkMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDdkMsMEJBQTBCLEVBQUU7aUJBQzVCLEtBQUssRUFBRTtpQkFDUCxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQzVDLE1BQU0sQ0FBQyxJQUFJLGNBQUksRUFBRTtpQkFDaEIsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxNQUFNLENBQUM7aUJBQ2hELE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxvQkFBVSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6RixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFNakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLG1CQUFRLEVBQUU7aUJBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMseUNBQXlDLENBQUM7aUJBQ3RELFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7aUJBQzlFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUs7aUJBQ3ZCLE9BQU8sQ0FBQyxLQUFLLENBQUM7aUJBQ2QsTUFBTSxDQUFDLENBQUMsQ0FBQztpQkFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDO2lCQUNULGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztpQkFDN0MsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3ZELEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFO2dCQUN0QyxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUFDO2lCQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixNQUFNLGNBQWMsR0FBYSxJQUFJLG1CQUFRLEVBQUU7aUJBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUM7aUJBQ2pDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztpQkFDckYsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSztpQkFDdkIsT0FBTyxDQUFDLElBQUksQ0FBQztpQkFDYixNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7aUJBQ1osZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lCQUN0RSxNQUFNLENBQUMsSUFBSSxnQkFBTSxFQUFFO2lCQUNsQixPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUN6RCxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FDakMscUJBQVcsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxnQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQzFGLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQU1qQixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztpQkFDL0UsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxrQkFBUSxFQUFVO2lCQUNqRCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixPQUFPLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDcEQsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsV0FBVyxDQUFDO3lCQUM3RixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxvQkFBVSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLDBCQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxlQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUE0QixDQUFDO2dCQUMzSyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7YUFDNUIsQ0FBQyxDQUFDO2lCQUNGLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDaEQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO2lCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2lCQUNoRixNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FBUyxrQ0FBa0MsQ0FBQyxrQkFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO2dCQUNwSCxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsa0JBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsS0FBSyxrQkFBUyxDQUFDLFFBQVEsSUFBSSxDQUFDLFNBQVMsS0FBSyxrQkFBUyxDQUFDLE9BQU8sSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO3FCQUMzSixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGtDQUFrQyxDQUFDLEtBQUssQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTTt5QkFDeEUsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxxQkFBcUIsQ0FBQzt5QkFDL0QsT0FBTyxDQUFDLHFCQUFXLENBQUMsR0FBRyxDQUFDLG9CQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBNEIsQ0FBQztnQkFDaEgsQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO2FBQ2pHLENBQUMsQ0FBQztpQkFDRixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxnQkFBTSxFQUFFO2lCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxDQUFDO2lCQUNuRSxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7aUJBQzNCLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQ3hELEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7aUJBQ3hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLGlCQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFNN0IsSUFBSSxtQkFBUSxFQUFFO2lCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkNBQTZDLENBQUM7aUJBQzFELE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSx5QkFBVyxFQUFFO2lCQUMvQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN2RCxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRTtnQkFDN0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFFbEQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9JLENBQUMsQ0FBQyxDQUFDO2lCQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksa0JBQVEsRUFBVztpQkFDbEQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsYUFBYSxFQUFFLGdCQUFPLENBQUMsVUFBVTtnQkFDakMsT0FBTyxFQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQU8sQ0FBQztxQkFDNUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBQSxhQUFLLEVBQUMsR0FBRyxFQUFFLHlCQUFlLENBQUMsU0FBUyxDQUFDLGdCQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMvRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQzVFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFBLGFBQUssRUFBQyxFQUFFLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwRSxDQUFDLENBQUMsQ0FBQztpQkFDSixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxtQkFBUSxFQUFFO2lCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkNBQTZDLENBQUM7aUJBQzFELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSx5QkFBVyxFQUFFO2lCQUNsRCxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUMxRCxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRTtnQkFDN0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFFL0MsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxtQkFBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvSixDQUFDLENBQUMsQ0FBQztpQkFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksa0JBQVEsRUFBZ0I7aUJBQzFELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLGFBQWEsRUFBRSx3QkFBWSxDQUFDLEtBQUs7Z0JBQ2pDLE9BQU8sRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLHdCQUFZLENBQUM7cUJBQ2pDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUEsYUFBSyxFQUFDLFFBQVEsRUFBRSx5QkFBZSxDQUFDLFNBQVMsQ0FBQyx3QkFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDbkYsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUM1RSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBQSxhQUFLLEVBQUMsRUFBRSxFQUFFLENBQUMsTUFBYyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDcEUsQ0FBQyxDQUFDLENBQUM7aUJBQ0osUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFZSxjQUFjO1lBQzdCLE9BQU8sbUNBQXFCLENBQUMsWUFBWSxDQUFDO1FBQzNDLENBQUM7UUFHTSxhQUFhO1lBQ25CLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU87Z0JBQUUsT0FBTyxLQUFLLENBQUM7WUFFN0csT0FBTyxTQUFTLENBQUM7UUFDbEIsQ0FBQztRQUdTLFNBQVMsQ0FBQyxDQUFNLEVBQUUsQ0FBUztZQUNwQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxLQUFLLENBQUM7Z0JBQ3JDLE9BQU87WUFFUixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlCLENBQUM7UUFJTSxhQUFhO1lBQ25CLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzFCLENBQUM7UUFDRixDQUFDO1FBRU8sY0FBYyxDQUFDLE9BQWdCLEVBQUUsV0FBNkMsRUFBRSxZQUE0QjtZQUNuSCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDaEUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2hDLENBQUM7WUFFRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztZQUU3QixJQUFJLE9BQU8sRUFBRSxDQUFDO2dCQUNiLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDM0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO29CQUNuQyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztvQkFFN0IsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUVsQixJQUFJLFlBQVksRUFBRSxFQUFFLEVBQUUsQ0FBQzt3QkFDdEIsVUFBVSxDQUFDLEdBQUcsRUFBRTs0QkFDZixJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO3dCQUNsRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ1QsQ0FBQztnQkFDRixDQUFDLENBQUMsQ0FBQztZQUNKLENBQUM7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFHUyxVQUFVO1lBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUU3QixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQztpQkFDOUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7Z0JBQzFCLElBQUksSUFBSSxDQUFDLGdCQUFnQjtvQkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDM0QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBR1MsWUFBWTtZQUNyQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLENBQUM7WUFDaEMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7WUFFN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFFYyxXQUFXLENBQUMsQ0FBTSxFQUFFLEtBQWE7WUFDL0MsSUFBSSxXQUFXLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDO2dCQUM3QixxQkFBVyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDekMsQ0FBQztRQUNGLENBQUM7UUFFYyxNQUFNO1lBQ3BCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLEtBQUssY0FBYyxFQUFFLENBQUM7Z0JBQzNELElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUMxQixPQUFPO1lBQ1IsQ0FBQztZQUVELElBQUksUUFBUSxHQUFhLDJCQUFpQixDQUFDO1lBQzNDLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsa0JBQVMsQ0FBQztpQkFDbkMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLEtBQUssa0NBQWtDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxrQkFBUyxDQUFDLE1BQU0sQ0FBQztZQUU5RyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3RGLE1BQU0scUJBQXFCLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztnQkFFbkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUNuQyxNQUFNLFlBQVksR0FBRzt3QkFDcEIsQ0FBQyxFQUFFLHFCQUFxQixDQUFDLENBQUM7d0JBQzFCLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQztxQkFDOUIsQ0FBQztvQkFFRixRQUFRLEdBQUcsd0JBQWMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO3dCQUNqQyxNQUFNO29CQUNQLENBQUM7Z0JBQ0YsQ0FBQztZQUVGLENBQUM7aUJBQU0sQ0FBQztnQkFDUCxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEtBQUssUUFBUTtvQkFDcEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBcUI7b0JBQzNDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTt5QkFDbkIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLFdBQVcsQ0FBQyxFQUFFLENBQUM7eUJBQ25DLE1BQU0sRUFBRyxDQUFDO1lBQ2QsQ0FBQztZQUVELHNCQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUVPLEtBQUssQ0FBQyxrQkFBa0I7WUFDL0IsSUFBSSxXQUFXLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQUUsT0FBTztZQUN6RCxpQ0FBdUIsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUVjLFlBQVksQ0FBQyxLQUFZO1lBQ3ZDLHNCQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMvQixDQUFDO0tBQ0Q7SUE3U0QsK0JBNlNDO0lBMVNnQjtRQURmLGFBQUcsQ0FBQyxRQUFRLENBQWEsNEJBQWMsQ0FBQztxREFDRDtJQW1MakM7UUFETixJQUFBLDJCQUFZLEVBQUMseUJBQWUsRUFBRSxTQUFTLENBQUM7cURBS3hDO0lBR1M7UUFEVCxJQUFBLDJCQUFZLEVBQUMscUJBQVEsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDO2lEQU03QztJQUlNO1FBRk4sSUFBQSwyQkFBWSxFQUFDLHFCQUFRLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQztRQUN4QyxJQUFBLHFCQUFRLEVBQUMsR0FBRyxDQUFDO3FEQUtiO0lBNEJTO1FBRFQsSUFBQSw4QkFBZSxFQUFDLFlBQVksRUFBRSxVQUFVLENBQUM7a0RBU3pDO0lBR1M7UUFEVCxJQUFBLDhCQUFlLEVBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQztvREFRM0M7SUFFYztRQUFkLGtCQUFLO21EQUlMO0lBRWM7UUFBZCxrQkFBSzs4Q0FrQ0w7SUFPYztRQUFkLGtCQUFLO29EQUdMO0lBR0YsTUFBTSxjQUFxRCxTQUFRLHdCQUFpQztRQUVuRyxZQUFtQixhQUF1QyxFQUFFLE9BQTZEO1lBQ3hILEtBQUssQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUVrQixTQUFTLENBQUMsUUFBa0IsRUFBRSxLQUFnQjtZQUNoRSxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsaUNBQWlDLENBQUM7Z0JBQ3pELE9BQU8sUUFBUSxLQUFLLGtDQUFrQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRS9ELE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsQ0FBQztLQUNEIn0=
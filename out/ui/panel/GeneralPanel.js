var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "audio/IAudio", "entity/action/ActionExecutor", "entity/action/IAction", "event/EventBuses", "event/EventEmitter", "event/EventManager", "game/IBiome", "game/Island", "game/WorldZ", "language/Dictionaries", "language/Translation", "mod/IHookHost", "mod/Mod", "mod/ModRegistry", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/Divider", "newui/component/Dropdown", "newui/component/GroupDropdown", "newui/component/Input", "newui/component/LabelledRow", "newui/component/RangeRow", "newui/component/Text", "newui/input/Bind", "newui/screen/screens/game/util/movement/MovementHandler", "renderer/particle/IParticle", "renderer/particle/Particles", "utilities/Arrays", "utilities/enum/Enums", "../../action/ChangeLayer", "../../action/RenameIsland", "../../action/SetTime", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, IAudio_1, ActionExecutor_1, IAction_1, EventBuses_1, EventEmitter_1, EventManager_1, IBiome_1, Island_1, WorldZ_1, Dictionaries_1, Translation_1, IHookHost_1, Mod_1, ModRegistry_1, BlockRow_1, Button_1, CheckButton_1, Divider_1, Dropdown_1, GroupDropdown_1, Input_1, LabelledRow_1, RangeRow_1, Text_1, Bind_1, MovementHandler_1, IParticle_1, Particles_1, Arrays_1, Enums_1, ChangeLayer_1, RenameIsland_1, SetTime_1, IDebugTools_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX = "new_island_";
    function getTravelDropdownNewIslandOptionId(biomeType) {
        return `${TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX}${IBiome_1.BiomeType[biomeType].toLowerCase()}`;
    }
    let GeneralPanel = (() => {
        class GeneralPanel extends DebugToolsPanel_1.default {
            constructor() {
                super();
                this.inspectButton = new CheckButton_1.CheckButton()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonInspect))
                    .setRefreshMethod(() => !!this.selectionPromise)
                    .event.subscribe("willToggle", (_, checked) => {
                    if (!!this.selectionPromise !== checked) {
                        if (checked && this.DEBUG_TOOLS.selector.selecting)
                            return false;
                        if (!checked) {
                            if (this.selectionPromise && !this.selectionPromise.isResolved) {
                                this.selectionPromise.cancel();
                            }
                            delete this.selectionPromise;
                        }
                        else {
                            this.selectionPromise = this.DEBUG_TOOLS.selector.select();
                            this.selectionPromise.then(this.inspectTile);
                        }
                    }
                    return true;
                })
                    .appendTo(this);
                new Button_1.default()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonInspectLocalPlayer))
                    .event.subscribe("activate", () => this.DEBUG_TOOLS.inspect(localPlayer))
                    .appendTo(this);
                new Divider_1.default().appendTo(this);
                new Text_1.Heading()
                    .classes.add("debug-tools-island-heading")
                    .append(new Text_1.default()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.HeadingIslandCurrent)))
                    .append(new Input_1.default()
                    .setDefault(() => island.id)
                    .setClearTo(() => island.name || island.id)
                    .setClearToDefaultWhenEmpty()
                    .clear()
                    .event.subscribe("done", this.renameIsland))
                    .append(new Text_1.default()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.Island)
                    .addArgs("", "", new Translation_1.default(Dictionaries_1.Dictionary.Biome, island.biomeType))))
                    .appendTo(this);
                this.timeRange = new RangeRow_1.RangeRow()
                    .classes.add("debug-tools-range-row-no-default-button")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTime)))
                    .editRange(range => range
                    .setStep(0.001)
                    .setMin(0)
                    .setMax(1)
                    .setRefreshMethod(() => island.time.getTime()))
                    .setDisplayValue(time => island.time.getTranslation(time))
                    .event.subscribe("change", (_, time) => {
                    ActionExecutor_1.default.get(SetTime_1.default).execute(localPlayer, time);
                })
                    .appendTo(this);
                new LabelledRow_1.LabelledRow()
                    .classes.add("dropdown-label")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelLayer)))
                    .append(this.dropdownLayer = new Dropdown_1.default()
                    .setRefreshMethod(() => ({
                    options: Object.values(world.layers)
                        .map(layer => [layer.level, option => {
                            var _a;
                            return option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.OptionLayer)
                                .addArgs(layer.level, new Translation_1.default(Dictionaries_1.Dictionary.WorldLayer, layer.level).inContext(Translation_1.TextContext.Title), (_a = Enums_1.default.getMod(WorldZ_1.WorldZ, layer.level)) === null || _a === void 0 ? void 0 : _a.config.name));
                        }]),
                    defaultOption: localPlayer.z,
                }))
                    .event.subscribe("selection", this.changeLayer))
                    .appendTo(this);
                new LabelledRow_1.LabelledRow()
                    .classes.add("dropdown-label")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTravel)))
                    .append(this.dropdownTravel = new IslandDropdown(getTravelDropdownNewIslandOptionId(IBiome_1.BiomeType.Random), [
                    ...Enums_1.default.values(IBiome_1.BiomeType)
                        .map(biome => [getTravelDropdownNewIslandOptionId(biome), option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.OptionTravelNewIsland)
                            .addArgs(new Translation_1.default(Dictionaries_1.Dictionary.Biome, biome).inContext(Translation_1.TextContext.Title)))]),
                    ["random", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.OptionTravelRandomIsland))],
                    ["civilization", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.OptionTravelCivilization))],
                ]))
                    .appendTo(this);
                new Button_1.default()
                    .classes.add("has-icon-before", "icon-arrow-right", "icon-no-scale")
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonTravel))
                    .event.subscribe("activate", this.travel)
                    .appendTo(this);
                new Divider_1.default().appendTo(this);
                new BlockRow_1.BlockRow()
                    .classes.add("debug-tools-dialog-checkbutton-dropdown-row")
                    .append(this.checkButtonAudio = new CheckButton_1.CheckButton()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonAudio)))
                    .append(this.dropdownAudio = new Dropdown_1.default()
                    .setRefreshMethod(() => ({
                    defaultOption: IAudio_1.SfxType.Click,
                    options: Enums_1.default.values(IAudio_1.SfxType)
                        .map(sfx => Arrays_1.Tuple(sfx, Translation_1.default.generator(IAudio_1.SfxType[sfx])))
                        .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                        .map(([id, t]) => Arrays_1.Tuple(id, (option) => option.setText(t))),
                })))
                    .appendTo(this);
                new BlockRow_1.BlockRow()
                    .classes.add("debug-tools-dialog-checkbutton-dropdown-row")
                    .append(this.checkButtonParticle = new CheckButton_1.CheckButton()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonParticle)))
                    .append(this.dropdownParticle = new Dropdown_1.default()
                    .setRefreshMethod(() => ({
                    defaultOption: IParticle_1.ParticleType.Blood,
                    options: Enums_1.default.values(IParticle_1.ParticleType)
                        .map(particle => Arrays_1.Tuple(particle, Translation_1.default.generator(IParticle_1.ParticleType[particle])))
                        .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                        .map(([id, t]) => Arrays_1.Tuple(id, (option) => option.setText(t))),
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
            onSelectLocation(api) {
                if (!this.checkButtonAudio.checked && !this.checkButtonParticle.checked)
                    return false;
                const position = renderer.screenToTile(...api.mouse.position.xy);
                if (!position)
                    return false;
                if (this.checkButtonAudio.checked)
                    audio.queueEffect(this.dropdownAudio.selection, position.x, position.y, localPlayer.z);
                else
                    game.particle.create(position.x, position.y, localPlayer.z, Particles_1.default[this.dropdownParticle.selection]);
                return true;
            }
            onSwitchTo() {
                this.timeRange.refresh();
                this.registerHookHost("DebugToolsDialog:GeneralPanel");
                this.DEBUG_TOOLS.event.until(this, "switchAway")
                    .subscribe("inspect", () => {
                    if (this.selectionPromise)
                        this.selectionPromise.cancel();
                });
            }
            onSwitchAway() {
                hookManager.deregister(this);
                if (this.selectionPromise) {
                    this.selectionPromise.cancel();
                    delete this.selectionPromise;
                }
            }
            inspectTile(tilePosition) {
                delete this.selectionPromise;
                this.inspectButton.refresh();
                if (!tilePosition)
                    return;
                this.DEBUG_TOOLS.inspect(tilePosition);
            }
            changeLayer(_, layer) {
                ActionExecutor_1.default.get(ChangeLayer_1.default).execute(localPlayer, layer);
            }
            travel() {
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
                        .random();
                game.travelToIslandId(islandId);
            }
            travelToNewIsland() {
                const currentIslandPosition = island.position;
                for (let i = 1; i < Infinity; i++) {
                    const nextPosition = {
                        x: currentIslandPosition.x,
                        y: currentIslandPosition.y + i,
                    };
                    const biome = Enums_1.default.values(IBiome_1.BiomeType)
                        .find(b => this.dropdownTravel.selection === getTravelDropdownNewIslandOptionId(b));
                    const islandId = Island_1.default.positionToId(nextPosition);
                    if (!game.islands.has(islandId)) {
                        game.travelToIslandId(islandId, { newWorldBiomeTypeOverride: biome });
                        return;
                    }
                }
            }
            async sailToCivilization() {
                if (multiplayer.isConnected() && !game.isChallenge)
                    return;
                const anyExecutor = ActionExecutor_1.default.get(IAction_1.ActionType.SailToCivilization);
                anyExecutor.execute(localPlayer, undefined, true, true, true);
            }
            renameIsland(input) {
                ActionExecutor_1.default.get(RenameIsland_1.default).execute(localPlayer, input.text);
                this.dropdownTravel.refresh();
            }
        }
        __decorate([
            Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
        ], GeneralPanel.prototype, "DEBUG_TOOLS", void 0);
        __decorate([
            Override
        ], GeneralPanel.prototype, "getTranslation", null);
        __decorate([
            EventManager_1.EventHandler(MovementHandler_1.default, "canMove")
        ], GeneralPanel.prototype, "canClientMove", null);
        __decorate([
            EventManager_1.EventHandler(EventBuses_1.EventBus.LocalPlayer, "changeZ")
        ], GeneralPanel.prototype, "onChangeZ", null);
        __decorate([
            IHookHost_1.HookMethod
        ], GeneralPanel.prototype, "onGameTickEnd", null);
        __decorate([
            Bind_1.default.onDown(ModRegistry_1.Registry(IDebugTools_1.DEBUG_TOOLS_ID).registry("selector").get("bindableSelectLocation"), EventEmitter_1.Priority.High)
        ], GeneralPanel.prototype, "onSelectLocation", null);
        __decorate([
            EventManager_1.OwnEventHandler(GeneralPanel, "switchTo")
        ], GeneralPanel.prototype, "onSwitchTo", null);
        __decorate([
            EventManager_1.OwnEventHandler(GeneralPanel, "switchAway")
        ], GeneralPanel.prototype, "onSwitchAway", null);
        __decorate([
            Bound
        ], GeneralPanel.prototype, "inspectTile", null);
        __decorate([
            Bound
        ], GeneralPanel.prototype, "changeLayer", null);
        __decorate([
            Bound
        ], GeneralPanel.prototype, "travel", null);
        __decorate([
            Bound
        ], GeneralPanel.prototype, "renameIsland", null);
        return GeneralPanel;
    })();
    exports.default = GeneralPanel;
    let IslandDropdown = (() => {
        class IslandDropdown extends GroupDropdown_1.default {
            constructor(defaultOption, options) {
                var _a, _b;
                super(game.islands.keyStream().toObject(key => [key, key]), -1, defaultOption, options);
                (_a = this.options.get(island.id)) === null || _a === void 0 ? void 0 : _a.setDisabled(true);
                (_b = this.options.get("random")) === null || _b === void 0 ? void 0 : _b.setDisabled(game.islands.size <= 1);
                this.setPrefix("biome");
            }
            getTranslation(islandId) {
                var _a;
                const island = game.islands.get(islandId);
                return IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.Island)
                    .addArgs(islandId, island === null || island === void 0 ? void 0 : island.name, new Translation_1.default(Dictionaries_1.Dictionary.Biome, (_a = island === null || island === void 0 ? void 0 : island.biomeType) !== null && _a !== void 0 ? _a : IBiome_1.BiomeType.Random));
            }
            getGroupName(biome) {
                return new Translation_1.default(Dictionaries_1.Dictionary.Biome, biome).getString();
            }
            shouldIncludeOtherOptionsInGroupFilter() {
                return true;
            }
            isInGroup(islandId, biome) {
                var _a;
                if (islandId.startsWith(TRAVEL_DROPDOWN_NEW_ISLAND_PREFIX))
                    return islandId === getTravelDropdownNewIslandOptionId(biome);
                return ((_a = game.islands.get(islandId)) === null || _a === void 0 ? void 0 : _a.biomeType) === biome;
            }
            getGroups() {
                return Enums_1.default.values(IBiome_1.BiomeType).slice(1);
            }
        }
        __decorate([
            Override
        ], IslandDropdown.prototype, "getTranslation", null);
        __decorate([
            Override
        ], IslandDropdown.prototype, "getGroupName", null);
        __decorate([
            Override
        ], IslandDropdown.prototype, "shouldIncludeOtherOptionsInGroupFilter", null);
        __decorate([
            Override
        ], IslandDropdown.prototype, "isInGroup", null);
        __decorate([
            Override
        ], IslandDropdown.prototype, "getGroups", null);
        return IslandDropdown;
    })();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhbFBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0dlbmVyYWxQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUF1Q0EsTUFBTSxpQ0FBaUMsR0FBRyxhQUFhLENBQUM7SUFFeEQsU0FBUyxrQ0FBa0MsQ0FBQyxTQUFvQjtRQUMvRCxPQUFPLEdBQUcsaUNBQWlDLEdBQUcsa0JBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO0lBQ3BGLENBQUM7SUFFRDtRQUFBLE1BQXFCLFlBQWEsU0FBUSx5QkFBZTtZQWdCeEQ7Z0JBQ0MsS0FBSyxFQUFFLENBQUM7Z0JBRVIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLHlCQUFXLEVBQUU7cUJBQ3BDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDO3FCQUN6RCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO3FCQUMvQyxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRTtvQkFDN0MsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixLQUFLLE9BQU8sRUFBRTt3QkFDeEMsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsU0FBUzs0QkFBRSxPQUFPLEtBQUssQ0FBQzt3QkFFakUsSUFBSSxDQUFDLE9BQU8sRUFBRTs0QkFDYixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUU7Z0NBQy9ELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQzs2QkFDL0I7NEJBRUQsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7eUJBRTdCOzZCQUFN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
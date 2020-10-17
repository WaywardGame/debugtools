var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "audio/IAudio", "event/EventBuses", "event/EventEmitter", "event/EventManager", "game/IBiome", "game/Island", "game/WorldZ", "language/Dictionaries", "language/Translation", "mod/IHookHost", "mod/Mod", "mod/ModRegistry", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/Divider", "newui/component/Dropdown", "newui/component/GroupDropdown", "newui/component/Input", "newui/component/LabelledRow", "newui/component/RangeRow", "newui/component/Text", "newui/input/Bind", "newui/screen/screens/game/util/movement/MovementHandler", "renderer/particle/IParticle", "renderer/particle/Particles", "utilities/Arrays", "utilities/enum/Enums", "../../action/ChangeLayer", "../../action/ForceSailToCivilization", "../../action/RenameIsland", "../../action/SetTime", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, IAudio_1, EventBuses_1, EventEmitter_1, EventManager_1, IBiome_1, Island_1, WorldZ_1, Dictionaries_1, Translation_1, IHookHost_1, Mod_1, ModRegistry_1, BlockRow_1, Button_1, CheckButton_1, Divider_1, Dropdown_1, GroupDropdown_1, Input_1, LabelledRow_1, RangeRow_1, Text_1, Bind_1, MovementHandler_1, IParticle_1, Particles_1, Arrays_1, Enums_1, ChangeLayer_1, ForceSailToCivilization_1, RenameIsland_1, SetTime_1, IDebugTools_1, DebugToolsPanel_1) {
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
                SetTime_1.default.execute(localPlayer, time);
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
            const position = renderer === null || renderer === void 0 ? void 0 : renderer.screenToTile(...api.mouse.position.xy);
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
            ChangeLayer_1.default.execute(localPlayer, layer);
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
            ForceSailToCivilization_1.default.execute(localPlayer);
        }
        renameIsland(input) {
            RenameIsland_1.default.execute(localPlayer, input.text);
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
        IHookHost_1.HookMethod,
        Debounce(100)
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
    exports.default = GeneralPanel;
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
                .addArgs(islandId, island === null || island === void 0 ? void 0 : island.name, new Translation_1.default(Dictionaries_1.Dictionary.Biome, (_a = island === null || island === void 0 ? void 0 : island.biomeType) !== null && _a !== void 0 ? _a : IBiome_1.BiomeType.Random), island === null || island === void 0 ? void 0 : island.seeds.base);
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhbFBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0dlbmVyYWxQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFzQ0EsTUFBTSxpQ0FBaUMsR0FBRyxhQUFhLENBQUM7SUFFeEQsU0FBUyxrQ0FBa0MsQ0FBQyxTQUFvQjtRQUMvRCxPQUFPLEdBQUcsaUNBQWlDLEdBQUcsa0JBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO0lBQ3BGLENBQUM7SUFFRCxNQUFxQixZQUFhLFNBQVEseUJBQWU7UUFnQnhEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDcEMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQ3pELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7aUJBQy9DLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFO2dCQUM3QyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEtBQUssT0FBTyxFQUFFO29CQUN4QyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTO3dCQUFFLE9BQU8sS0FBSyxDQUFDO29CQUVqRSxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUNiLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRTs0QkFDL0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDO3lCQUMvQjt3QkFFRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztxQkFFN0I7eUJBQU07d0JBQ04s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
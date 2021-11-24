var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "audio/IAudio", "event/EventBuses", "event/EventEmitter", "event/EventManager", "game/biome/IBiome", "game/island/IIsland", "game/WorldZ", "language/Dictionary", "language/impl/TranslationImpl", "language/ITranslation", "language/Translation", "mod/Mod", "mod/ModRegistry", "renderer/particle/IParticle", "renderer/particle/Particles", "ui/component/BlockRow", "ui/component/Button", "ui/component/CheckButton", "ui/component/Divider", "ui/component/Dropdown", "ui/component/GroupDropdown", "ui/component/Input", "ui/component/LabelledRow", "ui/component/RangeRow", "ui/component/Text", "ui/input/Bind", "ui/screen/screens/game/util/movement/MovementHandler", "utilities/collection/Arrays", "utilities/Decorators", "utilities/enum/Enums", "../../action/ChangeLayer", "../../action/ForceSailToCivilization", "../../action/RenameIsland", "../../action/SetTime", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, IAudio_1, EventBuses_1, EventEmitter_1, EventManager_1, IBiome_1, IIsland_1, WorldZ_1, Dictionary_1, TranslationImpl_1, ITranslation_1, Translation_1, Mod_1, ModRegistry_1, IParticle_1, Particles_1, BlockRow_1, Button_1, CheckButton_1, Divider_1, Dropdown_1, GroupDropdown_1, Input_1, LabelledRow_1, RangeRow_1, Text_1, Bind_1, MovementHandler_1, Arrays_1, Decorators_1, Enums_1, ChangeLayer_1, ForceSailToCivilization_1, RenameIsland_1, SetTime_1, IDebugTools_1, DebugToolsPanel_1) {
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
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonInspectLocalPlayer))
                .event.subscribe("activate", () => this.DEBUG_TOOLS.inspect(localPlayer))
                .appendTo(this);
            new Divider_1.default().appendTo(this);
            new Text_1.Heading()
                .classes.add("debug-tools-island-heading")
                .append(new Text_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.HeadingIslandCurrent)))
                .append(new Input_1.default()
                .setDefault(() => localIsland.id)
                .setClearTo(() => localIsland.name || localIsland.id)
                .setClearToDefaultWhenEmpty()
                .clear()
                .event.subscribe("done", this.renameIsland))
                .append(new Text_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.Island)
                .addArgs("", "", Translation_1.default.get(Dictionary_1.default.Biome, localIsland.biomeType))))
                .appendTo(this);
            this.timeRange = new RangeRow_1.RangeRow()
                .classes.add("debug-tools-range-row-no-default-button")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelTime)))
                .editRange(range => range
                .setStep(0.001)
                .setMin(0)
                .setMax(1)
                .setRefreshMethod(() => localIsland.time.getTime()))
                .setDisplayValue(time => localIsland.time.getTranslation(time))
                .event.subscribe("change", (_, time) => {
                SetTime_1.default.execute(localPlayer, time);
            })
                .appendTo(this);
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelLayer)))
                .append(this.dropdownLayer = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                options: Object.values(localIsland.world.layers)
                    .map(layer => [layer.level, option => {
                        var _a;
                        return option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.OptionLayer)
                            .addArgs(layer.level, Translation_1.default.get(Dictionary_1.default.WorldLayer, layer.level).inContext(ITranslation_1.TextContext.Title), (_a = Enums_1.default.getMod(WorldZ_1.WorldZ, layer.level)) === null || _a === void 0 ? void 0 : _a.config.name));
                    }]),
                defaultOption: localPlayer.z,
            }))
                .event.subscribe("selection", this.changeLayer))
                .appendTo(this);
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelTravel)))
                .append(this.dropdownTravel = new IslandDropdown(getTravelDropdownNewIslandOptionId(IBiome_1.BiomeType.Random), () => [
                ...Enums_1.default.values(IBiome_1.BiomeType)
                    .map(biome => [getTravelDropdownNewIslandOptionId(biome), option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.OptionTravelNewIsland)
                        .addArgs(Translation_1.default.get(Dictionary_1.default.Biome, biome).inContext(ITranslation_1.TextContext.Title)))]),
                ["random", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.OptionTravelRandomIsland))],
                ["civilization", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.OptionTravelCivilization))],
            ]))
                .appendTo(this);
            new Button_1.default()
                .classes.add("has-icon-before", "icon-arrow-right", "icon-no-scale")
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonTravel))
                .event.subscribe("activate", this.travel)
                .appendTo(this);
            new Divider_1.default().appendTo(this);
            new BlockRow_1.BlockRow()
                .classes.add("debug-tools-dialog-checkbutton-dropdown-row")
                .append(this.checkButtonAudio = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonAudio)))
                .append(this.dropdownAudio = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: IAudio_1.SfxType.Click,
                options: Enums_1.default.values(IAudio_1.SfxType)
                    .map(sfx => (0, Arrays_1.Tuple)(sfx, TranslationImpl_1.default.generator(IAudio_1.SfxType[sfx])))
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => (0, Arrays_1.Tuple)(id, (option) => option.setText(t))),
            })))
                .appendTo(this);
            new BlockRow_1.BlockRow()
                .classes.add("debug-tools-dialog-checkbutton-dropdown-row")
                .append(this.checkButtonParticle = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonParticle)))
                .append(this.dropdownParticle = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: IParticle_1.ParticleType.Blood,
                options: Enums_1.default.values(IParticle_1.ParticleType)
                    .map(particle => (0, Arrays_1.Tuple)(particle, TranslationImpl_1.default.generator(IParticle_1.ParticleType[particle])))
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => (0, Arrays_1.Tuple)(id, (option) => option.setText(t))),
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
        onLoadOnIsland() {
            this.dropdownTravel.refresh();
        }
        onSelectLocation(api) {
            if (!this.checkButtonAudio.checked && !this.checkButtonParticle.checked)
                return false;
            const position = renderer === null || renderer === void 0 ? void 0 : renderer.worldRenderer.screenToTile(...api.mouse.position.xy);
            if (!position)
                return false;
            if (this.checkButtonAudio.checked)
                audio === null || audio === void 0 ? void 0 : audio.queueEffect(this.dropdownAudio.selection, localIsland, position.x, position.y, localPlayer.z);
            else
                renderer === null || renderer === void 0 ? void 0 : renderer.particle.create(localIsland, position.x, position.y, localPlayer.z, Particles_1.default[this.dropdownParticle.selection]);
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
            if (localPlayer.z !== layer) {
                ChangeLayer_1.default.execute(localPlayer, layer);
            }
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
                    .filter(id => id !== localIsland.id)
                    .random();
            localPlayer.moveToIslandId(islandId);
        }
        travelToNewIsland() {
            const currentIslandPosition = localIsland.position;
            for (let i = 1; i < Infinity; i++) {
                const nextPosition = {
                    x: currentIslandPosition.x,
                    y: currentIslandPosition.y + i,
                };
                const biome = Enums_1.default.values(IBiome_1.BiomeType)
                    .find(b => this.dropdownTravel.selection === getTravelDropdownNewIslandOptionId(b));
                const islandId = IIsland_1.IslandPosition.toId(nextPosition);
                if (!game.islands.has(islandId)) {
                    localPlayer.moveToIslandId(islandId, { newWorldBiomeTypeOverride: biome });
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
        (0, EventManager_1.EventHandler)(MovementHandler_1.default, "canMove")
    ], GeneralPanel.prototype, "canClientMove", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "changeZ")
    ], GeneralPanel.prototype, "onChangeZ", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Game, "tickEnd"),
        (0, Decorators_1.Debounce)(100)
    ], GeneralPanel.prototype, "onGameTickEnd", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "loadedOnIsland")
    ], GeneralPanel.prototype, "onLoadOnIsland", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)(IDebugTools_1.DEBUG_TOOLS_ID).registry("selector").get("bindableSelectLocation"), EventEmitter_1.Priority.High)
    ], GeneralPanel.prototype, "onSelectLocation", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(GeneralPanel, "switchTo")
    ], GeneralPanel.prototype, "onSwitchTo", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(GeneralPanel, "switchAway")
    ], GeneralPanel.prototype, "onSwitchAway", null);
    __decorate([
        Decorators_1.Bound
    ], GeneralPanel.prototype, "inspectTile", null);
    __decorate([
        Decorators_1.Bound
    ], GeneralPanel.prototype, "changeLayer", null);
    __decorate([
        Decorators_1.Bound
    ], GeneralPanel.prototype, "travel", null);
    __decorate([
        Decorators_1.Bound
    ], GeneralPanel.prototype, "renameIsland", null);
    exports.default = GeneralPanel;
    class IslandDropdown extends GroupDropdown_1.default {
        constructor(defaultOption, options) {
            super(game.islands.keyStream().toObject(key => [key, key]), -1, defaultOption, options);
            this.setPrefix("biome");
        }
        getTranslation(islandId) {
            var _a;
            const island = game.islands.get(islandId);
            return (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.Island)
                .addArgs(islandId, island === null || island === void 0 ? void 0 : island.getName(), Translation_1.default.get(Dictionary_1.default.Biome, (_a = island === null || island === void 0 ? void 0 : island.biomeType) !== null && _a !== void 0 ? _a : IBiome_1.BiomeType.Random), island === null || island === void 0 ? void 0 : island.seeds.base.toString());
        }
        getGroupName(biome) {
            return Translation_1.default.get(Dictionary_1.default.Biome, biome).getString();
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
        onRefresh() {
            var _a, _b;
            (_a = this.options.get(localIsland.id)) === null || _a === void 0 ? void 0 : _a.setDisabled(true);
            (_b = this.options.get("random")) === null || _b === void 0 ? void 0 : _b.setDisabled(game.islands.size <= 1);
        }
    }
    __decorate([
        (0, EventManager_1.OwnEventHandler)(IslandDropdown, "refresh")
    ], IslandDropdown.prototype, "onRefresh", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhbFBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0dlbmVyYWxQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUF5Q0EsTUFBTSxpQ0FBaUMsR0FBRyxhQUFhLENBQUM7SUFFeEQsU0FBUyxrQ0FBa0MsQ0FBQyxTQUFvQjtRQUMvRCxPQUFPLEdBQUcsaUNBQWlDLEdBQUcsa0JBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO0lBQ3BGLENBQUM7SUFFRCxNQUFxQixZQUFhLFNBQVEseUJBQWU7UUFnQnhEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDcEMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDekQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDL0MsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUU7Z0JBQzdDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxPQUFPLEVBQUU7b0JBQ3hDLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVM7d0JBQUUsT0FBTyxLQUFLLENBQUM7b0JBRWpFLElBQUksQ0FBQyxPQUFPLEVBQUU7d0JBQ2IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFOzRCQUMvRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUM7eUJBQy9CO3dCQUVELE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO3FCQUU3Qjt5QkFBTTt3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
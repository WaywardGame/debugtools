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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhbFBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0dlbmVyYWxQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUF1Q0EsTUFBTSxpQ0FBaUMsR0FBRyxhQUFhLENBQUM7SUFFeEQsU0FBUyxrQ0FBa0MsQ0FBQyxTQUFvQjtRQUMvRCxPQUFPLEdBQUcsaUNBQWlDLEdBQUcsa0JBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO0lBQ3BGLENBQUM7SUFFRCxNQUFxQixZQUFhLFNBQVEseUJBQWU7UUFnQnhEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDcEMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQ3pELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7aUJBQy9DLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFO2dCQUM3QyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEtBQUssT0FBTyxFQUFFO29CQUN4QyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTO3dCQUFFLE9BQU8sS0FBSyxDQUFDO29CQUVqRSxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUNiLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRTs0QkFDL0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDO3lCQUMvQjt3QkFFRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztxQkFFN0I7eUJBQU07d0JBQ04s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
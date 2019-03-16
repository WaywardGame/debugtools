var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "entity/IEntity", "entity/IStats", "language/Translation", "mod/Mod", "newui/BindingManager", "newui/component/BlockRow", "newui/component/Button", "newui/component/Component", "newui/component/ContextMenu", "newui/component/Input", "newui/component/LabelledRow", "newui/component/RangeInput", "newui/component/RangeRow", "newui/component/Text", "utilities/Arrays", "utilities/enum/Enums", "utilities/math/Vector3", "utilities/Objects", "../../action/Clone", "../../action/Heal", "../../action/Kill", "../../action/SetStat", "../../action/TeleportEntity", "../../IDebugTools", "../../util/Array", "../component/DebugToolsPanel", "../component/InspectEntityInformationSubsection", "../component/InspectInformationSection", "./Creature", "./Human", "./Npc", "./Player"], function (require, exports, ActionExecutor_1, IEntity_1, IStats_1, Translation_1, Mod_1, BindingManager_1, BlockRow_1, Button_1, Component_1, ContextMenu_1, Input_1, LabelledRow_1, RangeInput_1, RangeRow_1, Text_1, Arrays_1, Enums_1, Vector3_1, Objects_1, Clone_1, Heal_1, Kill_1, SetStat_1, TeleportEntity_1, IDebugTools_1, Array_1, DebugToolsPanel_1, InspectEntityInformationSubsection_1, InspectInformationSection_1, Creature_1, Human_1, Npc_1, Player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const entitySubsectionClasses = [
        Player_1.default,
        Human_1.default,
        Npc_1.default,
        Creature_1.default,
    ];
    class EntityInformation extends InspectInformationSection_1.default {
        constructor() {
            super();
            this.statComponents = new Map();
            this.entities = [];
            new BlockRow_1.BlockRow()
                .append(new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonHealEntity))
                .on(Button_1.ButtonEvent.Activate, this.heal)
                .appendTo(this))
                .append(new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonKillEntity))
                .on(Button_1.ButtonEvent.Activate, this.kill))
                .appendTo(this);
            new BlockRow_1.BlockRow()
                .append(new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonTeleportEntity))
                .on(Button_1.ButtonEvent.Activate, this.openTeleportMenu))
                .append(new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonCloneEntity))
                .on(Button_1.ButtonEvent.Activate, this.cloneEntity))
                .appendTo(this);
            this.subsections = entitySubsectionClasses.stream()
                .merge(this.DEBUG_TOOLS.modRegistryInspectDialogEntityInformationSubsections.getRegistrations()
                .map(registration => registration.data(InspectEntityInformationSubsection_1.default)))
                .map(cls => new cls()
                .appendTo(this))
                .toArray();
            this.statWrapper = new Component_1.default()
                .classes.add("debug-tools-inspect-entity-sub-section")
                .appendTo(this);
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo, () => this.subsections
                .forEach(subsection => subsection.emit(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo)));
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway, () => this.subsections
                .forEach(subsection => subsection.emit(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway)));
        }
        getTabs() {
            return this.entities.entries().stream()
                .map(([i, entity]) => Arrays_1.tuple(i, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.EntityName)
                .get(IEntity_1.EntityType[entity.entityType], entity.getName())))
                .toArray();
        }
        setTab(entity) {
            this.entity = this.entities[entity];
            for (const subsection of this.subsections) {
                subsection.update(this.entity);
            }
            this.initializeStats();
            return this;
        }
        update(position, tile) {
            const entities = game.getPlayersAtTile(tile, true);
            if (tile.creature)
                entities.push(tile.creature);
            if (tile.npc)
                entities.push(tile.npc);
            if (Array_1.areArraysIdentical(entities, this.entities))
                return;
            this.entities = entities;
            this.emit("change");
            if (!this.entities.length)
                return;
            this.setShouldLog();
            for (const entity of this.entities) {
                this.until(["Remove", "change"])
                    .bind(entity, IEntity_1.EntityEvent.StatChanged, this.onStatChange);
            }
        }
        getIndex(entity) {
            return this.entities.indexOf(entity);
        }
        getEntity(index) {
            return this.entities[index];
        }
        logUpdate() {
            for (const entity of this.entities) {
                this.LOG.info("Entity:", entity);
            }
        }
        initializeStats() {
            this.statWrapper.dump();
            this.statComponents.clear();
            const stats = Enums_1.default.values(IStats_1.Stat)
                .filter(stat => this.entity.hasStat(stat) && (!this.subsections.some(subsection => subsection.getImmutableStats().includes(stat))))
                .map(stat => this.entity.getStat(stat))
                .filter((stat) => stat !== undefined);
            for (const stat of stats) {
                if ("max" in stat && !stat.canExceedMax) {
                    this.statComponents.set(stat.type, new RangeRow_1.RangeRow()
                        .setLabel(label => label.setText(Translation_1.default.generator(IStats_1.Stat[stat.type])))
                        .editRange(range => range
                        .noClampOnRefresh()
                        .setMin(0)
                        .setMax(stat.max)
                        .setRefreshMethod(() => this.entity ? this.entity.getStatValue(stat.type) : 0))
                        .on(RangeInput_1.RangeInputEvent.Finish, this.setStat(stat.type))
                        .setDisplayValue(true)
                        .appendTo(this.statWrapper));
                }
                else {
                    this.statComponents.set(stat.type, new Input_1.default()
                        .on(Input_1.InputEvent.Done, (input, value) => {
                        if (isNaN(+value)) {
                            input.clear();
                        }
                        else {
                            this.setStat(stat.type)(input, +value);
                        }
                    })
                        .setCanBeEmpty(false)
                        .setDefault(() => this.entity ? `${this.entity.getStatValue(stat.type)}` : "")
                        .clear()
                        .appendTo(new LabelledRow_1.LabelledRow()
                        .setLabel(label => label.setText(Translation_1.default.generator(IStats_1.Stat[stat.type])))
                        .appendTo(this.statWrapper)));
                }
            }
        }
        onStatChange(_, stat, oldValue, info) {
            const statComponent = this.statComponents.get(stat.type);
            if (statComponent) {
                statComponent.refresh();
            }
        }
        openTeleportMenu() {
            const screen = newui.screens.getTop();
            if (!screen) {
                return;
            }
            if (this.entity === localPlayer && !multiplayer.isConnected()) {
                this.selectTeleportLocation();
                return;
            }
            const mouse = BindingManager_1.bindingManager.getMouse();
            new ContextMenu_1.default(["select location", {
                    translation: IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.OptionTeleportSelectLocation),
                    onActivate: this.selectTeleportLocation,
                }], this.entity === localPlayer ? undefined : ["to local player", {
                    translation: IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.OptionTeleportToLocalPlayer),
                    onActivate: () => this.teleport(localPlayer),
                }], !multiplayer.isConnected() || this.entity === players[0] ? undefined : ["to host", {
                    translation: IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.OptionTeleportToHost),
                    onActivate: () => this.teleport(players[0]),
                }], !multiplayer.isConnected() ? undefined : ["to player", {
                    translation: IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.OptionTeleportToPlayer),
                    submenu: this.createTeleportToPlayerMenu,
                }])
                .addAllDescribedOptions()
                .setPosition(...mouse.xy)
                .schedule(screen.setContextMenu);
        }
        createTeleportToPlayerMenu() {
            return players.stream()
                .filter(player => player !== this.entity)
                .map(player => Arrays_1.tuple(player.name, {
                translation: Translation_1.default.generator(player.name),
                onActivate: () => this.teleport(player),
            }))
                .sorted(([, t1], [, t2]) => Text_1.default.toString(t1.translation).localeCompare(Text_1.default.toString(t2.translation)))
                .collect(options => new ContextMenu_1.default(...options))
                .addAllDescribedOptions();
        }
        async selectTeleportLocation() {
            const teleportLocation = await this.DEBUG_TOOLS.selector.select();
            if (!teleportLocation)
                return;
            this.teleport(teleportLocation);
        }
        teleport(location) {
            ActionExecutor_1.default.get(TeleportEntity_1.default).execute(localPlayer, this.entity, new Vector3_1.default(location, "z" in location ? location.z : this.entity.z));
            this.emit("update");
        }
        kill() {
            ActionExecutor_1.default.get(Kill_1.default).execute(localPlayer, this.entity);
            this.emit("update");
        }
        async cloneEntity() {
            const teleportLocation = await this.DEBUG_TOOLS.selector.select();
            if (!teleportLocation)
                return;
            ActionExecutor_1.default.get(Clone_1.default).execute(localPlayer, this.entity, new Vector3_1.default(teleportLocation, localPlayer.z));
        }
        heal() {
            ActionExecutor_1.default.get(Heal_1.default).execute(localPlayer, this.entity);
            this.emit("update");
        }
        setStat(stat) {
            return (_, value) => {
                if (this.entity.getStatValue(stat) === value)
                    return;
                ActionExecutor_1.default.get(SetStat_1.default).execute(localPlayer, this.entity, stat, value);
            };
        }
    }
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], EntityInformation.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], EntityInformation.prototype, "LOG", void 0);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "onStatChange", null);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "openTeleportMenu", null);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "createTeleportToPlayerMenu", null);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "selectTeleportLocation", null);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "teleport", null);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "kill", null);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "cloneEntity", null);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "heal", null);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "setStat", null);
    exports.default = EntityInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTZDQSxNQUFNLHVCQUF1QixHQUFvRDtRQUNoRixnQkFBaUI7UUFDakIsZUFBZ0I7UUFDaEIsYUFBYztRQUNkLGtCQUFtQjtLQUNuQixDQUFDO0lBRUYsTUFBcUIsaUJBQWtCLFNBQVEsbUNBQXlCO1FBY3ZFO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFOUSxtQkFBYyxHQUFHLElBQUksR0FBRyxFQUFzQixDQUFDO1lBRXhELGFBQVEsR0FBbUMsRUFBRSxDQUFDO1lBTXJELElBQUksbUJBQVEsRUFBRTtpQkFDWixNQUFNLENBQUMsSUFBSSxnQkFBTSxFQUFFO2lCQUNsQixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUM1RCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQztpQkFDbkMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNoQixNQUFNLENBQUMsSUFBSSxnQkFBTSxFQUFFO2lCQUNsQixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUM1RCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNyQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxtQkFBUSxFQUFFO2lCQUNaLE1BQU0sQ0FBQyxJQUFJLGdCQUFNLEVBQUU7aUJBQ2xCLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLG9CQUFvQixDQUFDLENBQUM7aUJBQ2hFLEVBQUUsQ0FBQyxvQkFBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDakQs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
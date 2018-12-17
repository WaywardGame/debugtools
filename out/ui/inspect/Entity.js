var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "action/ActionExecutor", "entity/IEntity", "entity/IStats", "language/Translation", "mod/Mod", "newui/BindingManager", "newui/component/BlockRow", "newui/component/Button", "newui/component/Component", "newui/component/ContextMenu", "newui/component/Input", "newui/component/LabelledRow", "newui/component/RangeInput", "newui/component/RangeRow", "newui/component/Text", "utilities/enum/Enums", "utilities/iterable/Collectors", "utilities/iterable/Generators", "utilities/math/Vector3", "utilities/Objects", "../../action/Clone", "../../action/Heal", "../../action/Kill", "../../action/SetStat", "../../action/TeleportEntity", "../../IDebugTools", "../../util/Array", "../component/DebugToolsPanel", "../component/InspectEntityInformationSubsection", "../component/InspectInformationSection", "./Creature", "./Human", "./Npc", "./Player"], function (require, exports, ActionExecutor_1, IEntity_1, IStats_1, Translation_1, Mod_1, BindingManager_1, BlockRow_1, Button_1, Component_1, ContextMenu_1, Input_1, LabelledRow_1, RangeInput_1, RangeRow_1, Text_1, Enums_1, Collectors_1, Generators_1, Vector3_1, Objects_1, Clone_1, Heal_1, Kill_1, SetStat_1, TeleportEntity_1, IDebugTools_1, Array_1, DebugToolsPanel_1, InspectEntityInformationSubsection_1, InspectInformationSection_1, Creature_1, Human_1, Npc_1, Player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const entitySubsectionClasses = [
        Player_1.default,
        Human_1.default,
        Npc_1.default,
        Creature_1.default,
    ];
    class EntityInformation extends InspectInformationSection_1.default {
        constructor(gsapi) {
            super(gsapi);
            this.statComponents = new Map();
            this.entities = [];
            new BlockRow_1.BlockRow(this.api)
                .append(new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonHealEntity))
                .on(Button_1.ButtonEvent.Activate, this.heal)
                .appendTo(this))
                .append(new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonKillEntity))
                .on(Button_1.ButtonEvent.Activate, this.kill))
                .appendTo(this);
            new BlockRow_1.BlockRow(this.api)
                .append(new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonTeleportEntity))
                .on(Button_1.ButtonEvent.Activate, this.openTeleportMenu))
                .append(new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonCloneEntity))
                .on(Button_1.ButtonEvent.Activate, this.cloneEntity))
                .appendTo(this);
            this.subsections = entitySubsectionClasses.values()
                .include(this.DEBUG_TOOLS.modRegistryInspectDialogEntityInformationSubsections.getRegistrations()
                .map(registration => registration.data(InspectEntityInformationSubsection_1.default)))
                .map(cls => new cls(this.gsapi)
                .appendTo(this))
                .collect(Collectors_1.default.toArray);
            this.statWrapper = new Component_1.default(this.api)
                .classes.add("debug-tools-inspect-entity-sub-section")
                .appendTo(this);
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo, () => this.subsections
                .forEach(subsection => subsection.emit(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo)));
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway, () => this.subsections
                .forEach(subsection => subsection.emit(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway)));
        }
        getTabs() {
            return this.entities.entries()
                .map(([i, entity]) => Generators_1.tuple(i, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.EntityName)
                .get(IEntity_1.EntityType[entity.entityType], entity.getName())))
                .collect(Collectors_1.default.toArray);
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
                    this.statComponents.set(stat.type, new RangeRow_1.RangeRow(this.api)
                        .setLabel(label => label.setText(Translation_1.default.generator(IStats_1.Stat[stat.type])))
                        .editRange(range => range
                        .setMin(0)
                        .setMax(stat.max)
                        .setRefreshMethod(() => this.entity ? this.entity.getStatValue(stat.type) : 0))
                        .on(RangeInput_1.RangeInputEvent.Finish, this.setStat(stat.type))
                        .setDisplayValue(true)
                        .appendTo(this.statWrapper));
                }
                else {
                    this.statComponents.set(stat.type, new Input_1.default(this.api)
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
                        .appendTo(new LabelledRow_1.LabelledRow(this.api)
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
            const screen = this.api.getVisibleScreen();
            if (!screen) {
                return;
            }
            if (this.entity === localPlayer && !multiplayer.isConnected()) {
                this.selectTeleportLocation();
                return;
            }
            const mouse = BindingManager_1.bindingManager.getMouse();
            new ContextMenu_1.default(this.api, ["select location", {
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
            return players.values()
                .filter(player => player !== this.entity)
                .map(player => Generators_1.tuple(player.name, {
                translation: Translation_1.default.generator(player.name),
                onActivate: () => this.teleport(player),
            }))
                .collect(Collectors_1.default.toArray)
                .sort(([, t1], [, t2]) => Text_1.default.toString(t1.translation).localeCompare(Text_1.default.toString(t2.translation)))
                .values()
                .collect(options => new ContextMenu_1.default(this.api, ...options))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQStDQSxNQUFNLHVCQUF1QixHQUFvRDtRQUNoRixnQkFBaUI7UUFDakIsZUFBZ0I7UUFDaEIsYUFBYztRQUNkLGtCQUFtQjtLQUNuQixDQUFDO0lBRUYsTUFBcUIsaUJBQWtCLFNBQVEsbUNBQXlCO1FBY3ZFLFlBQW1CLEtBQXFCO1lBQ3ZDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQU5HLG1CQUFjLEdBQUcsSUFBSSxHQUFHLEVBQXNCLENBQUM7WUFFeEQsYUFBUSxHQUFtQyxFQUFFLENBQUM7WUFNckQsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3BCLE1BQU0sQ0FBQyxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztpQkFDMUIsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDNUQsRUFBRSxDQUFDLG9CQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7aUJBQ25DLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDaEIsTUFBTSxDQUFDLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUMxQixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUM1RCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNyQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3BCLE1BQU0sQ0FBQyxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztpQkFD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
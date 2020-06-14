var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "entity/IEntity", "entity/IStats", "language/Translation", "mod/Mod", "newui/component/BlockRow", "newui/component/Button", "newui/component/Component", "newui/component/ContextMenu", "newui/component/Input", "newui/component/LabelledRow", "newui/component/RangeRow", "newui/component/Text", "newui/input/InputManager", "newui/NewUi", "utilities/Arrays", "utilities/enum/Enums", "utilities/math/Vector3", "../../action/Clone", "../../action/Heal", "../../action/Kill", "../../action/SetStat", "../../action/TeleportEntity", "../../IDebugTools", "../../util/Array", "../component/InspectEntityInformationSubsection", "../component/InspectInformationSection", "./Creature", "./Human", "./Npc", "./Player"], function (require, exports, ActionExecutor_1, IEntity_1, IStats_1, Translation_1, Mod_1, BlockRow_1, Button_1, Component_1, ContextMenu_1, Input_1, LabelledRow_1, RangeRow_1, Text_1, InputManager_1, NewUi_1, Arrays_1, Enums_1, Vector3_1, Clone_1, Heal_1, Kill_1, SetStat_1, TeleportEntity_1, IDebugTools_1, Array_1, InspectEntityInformationSubsection_1, InspectInformationSection_1, Creature_1, Human_1, Npc_1, Player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const entitySubsectionClasses = [
        Player_1.default,
        Human_1.default,
        Npc_1.default,
        Creature_1.default,
    ];
    let EntityInformation = (() => {
        class EntityInformation extends InspectInformationSection_1.default {
            constructor() {
                super();
                this.statComponents = new Map();
                this.entities = [];
                new BlockRow_1.BlockRow()
                    .append(this.buttonHeal = new Button_1.default()
                    .setText(() => IDebugTools_1.translation(this.entity === localPlayer ? IDebugTools_1.DebugToolsTranslation.ButtonHealLocalPlayer : IDebugTools_1.DebugToolsTranslation.ButtonHealEntity))
                    .event.subscribe("activate", this.heal)
                    .appendTo(this))
                    .append(new Button_1.default()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonKillEntity))
                    .event.subscribe("activate", this.kill))
                    .appendTo(this);
                new BlockRow_1.BlockRow()
                    .append(this.buttonTeleport = new Button_1.default()
                    .setText(() => IDebugTools_1.translation(this.entity === localPlayer ? IDebugTools_1.DebugToolsTranslation.ButtonTeleportLocalPlayer : IDebugTools_1.DebugToolsTranslation.ButtonTeleportEntity))
                    .event.subscribe("activate", this.openTeleportMenu))
                    .append(new Button_1.default()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonCloneEntity))
                    .event.subscribe("activate", this.cloneEntity))
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
                this.event.subscribe("switchTo", () => this.subsections
                    .forEach(subsection => subsection.event.emit("switchTo")));
                this.event.subscribe("switchAway", () => this.subsections
                    .forEach(subsection => subsection.event.emit("switchAway")));
            }
            getTabs() {
                return this.entities.entries().stream()
                    .map(([i, entity]) => Arrays_1.Tuple(i, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.EntityName)
                    .get(IEntity_1.EntityType[entity.entityType], entity.getName())))
                    .toArray();
            }
            setTab(entity) {
                this.entity = this.entities[entity];
                this.buttonHeal.refreshText();
                this.buttonTeleport.refreshText();
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
                this.event.emit("change");
                if (!this.entities.length)
                    return;
                this.setShouldLog();
                for (const entity of this.entities) {
                    entity.event.until(this, "remove", "change")
                        .subscribe("statChanged", this.onStatChange);
                }
            }
            getEntityIndex(entity) {
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
                    .filter(stat => this.entity.stat.has(stat) && (!this.subsections.some(subsection => subsection.getImmutableStats().includes(stat))))
                    .map(stat => this.entity.stat.get(stat))
                    .filter2(stat => stat !== undefined);
                for (const stat of stats) {
                    if ("max" in stat && !stat.canExceedMax) {
                        this.statComponents.set(stat.type, new RangeRow_1.RangeRow()
                            .setLabel(label => label.setText(Translation_1.default.generator(IStats_1.Stat[stat.type])))
                            .editRange(range => range
                            .noClampOnRefresh()
                            .setMin(0)
                            .setMax(stat.max)
                            .setRefreshMethod(() => this.entity ? this.entity.stat.getValue(stat.type) : 0))
                            .event.subscribe("finish", this.setStat(stat.type))
                            .setDisplayValue(true)
                            .appendTo(this.statWrapper));
                    }
                    else {
                        this.statComponents.set(stat.type, new Input_1.default()
                            .event.subscribe("done", (input, value) => {
                            if (isNaN(+value)) {
                                input.clear();
                            }
                            else {
                                this.setStat(stat.type)(input, +value);
                            }
                        })
                            .setClearToDefaultWhenEmpty()
                            .setDefault(() => this.entity ? `${this.entity.stat.getValue(stat.type)}` : "")
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
                const screen = NewUi_1.default.screens.getTop();
                if (!screen) {
                    return;
                }
                if (this.entity === localPlayer && !multiplayer.isConnected()) {
                    this.selectTeleportLocation();
                    return;
                }
                const mouse = InputManager_1.default.mouse.position;
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
                    .map(player => Arrays_1.Tuple(player.name, {
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
                ActionExecutor_1.default.get(TeleportEntity_1.default).execute(localPlayer, this.entity, new Vector3_1.default(location, "z" in location ? location.z : localPlayer.z));
                this.event.emit("update");
            }
            kill() {
                ActionExecutor_1.default.get(Kill_1.default).execute(localPlayer, this.entity);
                this.event.emit("update");
            }
            async cloneEntity() {
                const teleportLocation = await this.DEBUG_TOOLS.selector.select();
                if (!teleportLocation)
                    return;
                ActionExecutor_1.default.get(Clone_1.default).execute(localPlayer, this.entity, new Vector3_1.default(teleportLocation, localPlayer.z));
            }
            heal() {
                ActionExecutor_1.default.get(Heal_1.default).execute(localPlayer, this.entity);
                this.event.emit("update");
            }
            setStat(stat) {
                return (_, value) => {
                    if (this.entity.stat.getValue(stat) === value)
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
            Override
        ], EntityInformation.prototype, "getTabs", null);
        __decorate([
            Override
        ], EntityInformation.prototype, "setTab", null);
        __decorate([
            Override
        ], EntityInformation.prototype, "update", null);
        __decorate([
            Override
        ], EntityInformation.prototype, "logUpdate", null);
        __decorate([
            Bound
        ], EntityInformation.prototype, "onStatChange", null);
        __decorate([
            Bound
        ], EntityInformation.prototype, "openTeleportMenu", null);
        __decorate([
            Bound
        ], EntityInformation.prototype, "createTeleportToPlayerMenu", null);
        __decorate([
            Bound
        ], EntityInformation.prototype, "selectTeleportLocation", null);
        __decorate([
            Bound
        ], EntityInformation.prototype, "teleport", null);
        __decorate([
            Bound
        ], EntityInformation.prototype, "kill", null);
        __decorate([
            Bound
        ], EntityInformation.prototype, "cloneEntity", null);
        __decorate([
            Bound
        ], EntityInformation.prototype, "heal", null);
        __decorate([
            Bound
        ], EntityInformation.prototype, "setStat", null);
        return EntityInformation;
    })();
    exports.default = EntityInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTJDQSxNQUFNLHVCQUF1QixHQUFvRDtRQUNoRixnQkFBaUI7UUFDakIsZUFBZ0I7UUFDaEIsYUFBYztRQUNkLGtCQUFtQjtLQUNuQixDQUFDO0lBRUY7UUFBQSxNQUFxQixpQkFBa0IsU0FBUSxtQ0FBeUI7WUFnQnZFO2dCQUNDLEtBQUssRUFBRSxDQUFDO2dCQVJRLG1CQUFjLEdBQUcsSUFBSSxHQUFHLEVBQXNCLENBQUM7Z0JBSXhELGFBQVEsR0FBZ0MsRUFBRSxDQUFDO2dCQU1sRCxJQUFJLG1CQUFRLEVBQUU7cUJBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxnQkFBTSxFQUFFO3FCQUNwQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMseUJBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsbUNBQXFCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLG1DQUFxQixDQUFDLGdCQUFnQixDQUFDLENBQUM7cUJBQzlJLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7cUJBQ3RDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDaEIsTUFBTSxDQUFDLElBQUksZ0JBQU0sRUFBRTtxQkFDbEIsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztxQkFDNUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUN4QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRWpCLElBQUksbUJBQVEsRUFBRTtxQkFDWixNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGdC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
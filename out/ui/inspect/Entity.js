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
                    .filter(stat => { var _a; return ((_a = this.entity) === null || _a === void 0 ? void 0 : _a.stat.has(stat)) && (!this.subsections.some(subsection => subsection.getImmutableStats().includes(stat))); })
                    .map(stat => { var _a; return (_a = this.entity) === null || _a === void 0 ? void 0 : _a.stat.get(stat); })
                    .filterNullish();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXdDQSxNQUFNLHVCQUF1QixHQUFvRDtRQUNoRixnQkFBaUI7UUFDakIsZUFBZ0I7UUFDaEIsYUFBYztRQUNkLGtCQUFtQjtLQUNuQixDQUFDO0lBRUY7UUFBQSxNQUFxQixpQkFBa0IsU0FBUSxtQ0FBeUI7WUFnQnZFO2dCQUNDLEtBQUssRUFBRSxDQUFDO2dCQVJRLG1CQUFjLEdBQUcsSUFBSSxHQUFHLEVBQXNCLENBQUM7Z0JBSXhELGFBQVEsR0FBYSxFQUFFLENBQUM7Z0JBTS9CLElBQUksbUJBQVEsRUFBRTtxQkFDWixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLGdCQUFNLEVBQUU7cUJBQ3BDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyx5QkFBVyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxtQ0FBcUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsbUNBQXFCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztxQkFDOUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQztxQkFDdEMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNoQixNQUFNLENBQUMsSUFBSSxnQkFBTSxFQUFFO3FCQUNsQixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3FCQUM1RCxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ3hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFakIsSUFBSSxtQkFBUSxFQUFFO3FCQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksZ0JB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
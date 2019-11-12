var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "entity/IEntity", "entity/IStats", "language/Translation", "mod/Mod", "newui/BindingManager", "newui/component/BlockRow", "newui/component/Button", "newui/component/Component", "newui/component/ContextMenu", "newui/component/Input", "newui/component/LabelledRow", "newui/component/RangeRow", "newui/component/Text", "newui/NewUi", "utilities/Arrays", "utilities/enum/Enums", "utilities/math/Vector3", "../../action/Clone", "../../action/Heal", "../../action/Kill", "../../action/SetStat", "../../action/TeleportEntity", "../../IDebugTools", "../../util/Array", "../component/InspectEntityInformationSubsection", "../component/InspectInformationSection", "./Creature", "./Human", "./Npc", "./Player"], function (require, exports, ActionExecutor_1, IEntity_1, IStats_1, Translation_1, Mod_1, BindingManager_1, BlockRow_1, Button_1, Component_1, ContextMenu_1, Input_1, LabelledRow_1, RangeRow_1, Text_1, NewUi_1, Arrays_1, Enums_1, Vector3_1, Clone_1, Heal_1, Kill_1, SetStat_1, TeleportEntity_1, IDebugTools_1, Array_1, InspectEntityInformationSubsection_1, InspectInformationSection_1, Creature_1, Human_1, Npc_1, Player_1) {
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
                .event.subscribe("activate", this.heal)
                .appendTo(this))
                .append(new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonKillEntity))
                .event.subscribe("activate", this.kill))
                .appendTo(this);
            new BlockRow_1.BlockRow()
                .append(new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonTeleportEntity))
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
                        .setCanBeEmpty(false)
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
            ActionExecutor_1.default.get(TeleportEntity_1.default).execute(localPlayer, this.entity, new Vector3_1.default(location, "z" in location ? location.z : this.entity.z));
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
    exports.default = EntityInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTZDQSxNQUFNLHVCQUF1QixHQUFvRDtRQUNoRixnQkFBaUI7UUFDakIsZUFBZ0I7UUFDaEIsYUFBYztRQUNkLGtCQUFtQjtLQUNuQixDQUFDO0lBRUYsTUFBcUIsaUJBQWtCLFNBQVEsbUNBQXlCO1FBY3ZFO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFOUSxtQkFBYyxHQUFHLElBQUksR0FBRyxFQUFzQixDQUFDO1lBRXhELGFBQVEsR0FBZ0MsRUFBRSxDQUFDO1lBTWxELElBQUksbUJBQVEsRUFBRTtpQkFDWixNQUFNLENBQUMsSUFBSSxnQkFBTSxFQUFFO2lCQUNsQixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUM1RCxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO2lCQUN0QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2hCLE1BQU0sQ0FBQyxJQUFJLGdCQUFNLEVBQUU7aUJBQ2xCLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGdCQUFnQixDQUFDLENBQUM7aUJBQzVELEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksbUJBQVEsRUFBRTtpQkFDWixNQUFNLENBQUMsSUFBSSxnQkFBTSxFQUFFO2lCQUNsQixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2lCQUNoRSxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDcEQsTUFB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
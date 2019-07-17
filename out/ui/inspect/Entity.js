var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "entity/IEntity", "entity/IStats", "language/Translation", "mod/Mod", "newui/BindingManager", "newui/component/BlockRow", "newui/component/Button", "newui/component/Component", "newui/component/ContextMenu", "newui/component/Input", "newui/component/LabelledRow", "newui/component/RangeRow", "newui/component/Text", "utilities/Arrays", "utilities/enum/Enums", "utilities/math/Vector3", "../../action/Clone", "../../action/Heal", "../../action/Kill", "../../action/SetStat", "../../action/TeleportEntity", "../../IDebugTools", "../../util/Array", "../component/InspectEntityInformationSubsection", "../component/InspectInformationSection", "./Creature", "./Human", "./Npc", "./Player"], function (require, exports, ActionExecutor_1, IEntity_1, IStats_1, Translation_1, Mod_1, BindingManager_1, BlockRow_1, Button_1, Component_1, ContextMenu_1, Input_1, LabelledRow_1, RangeRow_1, Text_1, Arrays_1, Enums_1, Vector3_1, Clone_1, Heal_1, Kill_1, SetStat_1, TeleportEntity_1, IDebugTools_1, Array_1, InspectEntityInformationSubsection_1, InspectInformationSection_1, Creature_1, Human_1, Npc_1, Player_1) {
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
                .filter(stat => this.entity.hasStat(stat) && (!this.subsections.some(subsection => subsection.getImmutableStats().includes(stat))))
                .map(stat => this.entity.getStat(stat))
                .filter2(stat => stat !== undefined);
            for (const stat of stats) {
                if ("max" in stat && !stat.canExceedMax) {
                    this.statComponents.set(stat.type, new RangeRow_1.RangeRow()
                        .setLabel(label => label.setText(Translation_1.default.generator(IStats_1.Stat[stat.type])))
                        .editRange(range => range
                        .noClampOnRefresh()
                        .setMin(0)
                        .setMax(stat.max)
                        .setRefreshMethod(() => this.entity ? this.entity.getStatValue(stat.type) : 0))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTRDQSxNQUFNLHVCQUF1QixHQUFvRDtRQUNoRixnQkFBaUI7UUFDakIsZUFBZ0I7UUFDaEIsYUFBYztRQUNkLGtCQUFtQjtLQUNuQixDQUFDO0lBRUYsTUFBcUIsaUJBQWtCLFNBQVEsbUNBQXlCO1FBY3ZFO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFOUSxtQkFBYyxHQUFHLElBQUksR0FBRyxFQUFzQixDQUFDO1lBRXhELGFBQVEsR0FBZ0MsRUFBRSxDQUFDO1lBTWxELElBQUksbUJBQVEsRUFBRTtpQkFDWixNQUFNLENBQUMsSUFBSSxnQkFBTSxFQUFFO2lCQUNsQixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUM1RCxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO2lCQUN0QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2hCLE1BQU0sQ0FBQyxJQUFJLGdCQUFNLEVBQUU7aUJBQ2xCLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGdCQUFnQixDQUFDLENBQUM7aUJBQzVELEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksbUJBQVEsRUFBRTtpQkFDWixNQUFNLENBQUMsSUFBSSxnQkFBTSxFQUFFO2lCQUNsQixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2lCQUNoRSxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDcEQsTUFB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
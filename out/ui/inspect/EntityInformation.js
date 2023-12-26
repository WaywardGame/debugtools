/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@wayward/game/game/entity/EntityWithStats", "@wayward/game/game/entity/IEntity", "@wayward/game/game/entity/IStats", "@wayward/game/language/ITranslation", "@wayward/game/language/Translation", "@wayward/game/language/impl/TranslationImpl", "@wayward/game/mod/Mod", "@wayward/game/ui/component/BlockRow", "@wayward/game/ui/component/Button", "@wayward/game/ui/component/Component", "@wayward/game/ui/component/ContextMenu", "@wayward/game/ui/component/Details", "@wayward/game/ui/component/Input", "@wayward/game/ui/component/LabelledRow", "@wayward/game/ui/component/RangeRow", "@wayward/game/ui/component/Text", "@wayward/game/ui/input/InputManager", "@wayward/game/utilities/enum/Enums", "@wayward/utilities/Decorators", "@wayward/utilities/collection/Tuple", "../../IDebugTools", "../../action/Clone", "../../action/Heal", "../../action/Kill", "../../action/SetStat", "../../action/SetStatMax", "../../action/TeleportEntity", "../../util/Array", "../ActionHistory", "../component/InspectEntityInformationSubsection", "../component/InspectInformationSection", "./CreatureInformation", "./HumanInformation", "./NpcInformation", "./PlayerInformation"], function (require, exports, EntityWithStats_1, IEntity_1, IStats_1, ITranslation_1, Translation_1, TranslationImpl_1, Mod_1, BlockRow_1, Button_1, Component_1, ContextMenu_1, Details_1, Input_1, LabelledRow_1, RangeRow_1, Text_1, InputManager_1, Enums_1, Decorators_1, Tuple_1, IDebugTools_1, Clone_1, Heal_1, Kill_1, SetStat_1, SetStatMax_1, TeleportEntity_1, Array_1, ActionHistory_1, InspectEntityInformationSubsection_1, InspectInformationSection_1, CreatureInformation_1, HumanInformation_1, NpcInformation_1, PlayerInformation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const entitySubsectionClasses = [
        PlayerInformation_1.default,
        HumanInformation_1.default,
        NpcInformation_1.default,
        CreatureInformation_1.default,
    ];
    class EntityInformation extends InspectInformationSection_1.default {
        constructor() {
            super();
            this.statComponents = new Map();
            this.statMaxComponents = new Map();
            this.entities = [];
            new BlockRow_1.BlockRow()
                .append(this.buttonHeal = new Button_1.default()
                .setText(() => (0, IDebugTools_1.translation)(this.entity?.asLocalPlayer ? IDebugTools_1.DebugToolsTranslation.ButtonHealLocalPlayer : IDebugTools_1.DebugToolsTranslation.ButtonHealEntity))
                .event.subscribe("activate", this.heal)
                .appendTo(this))
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonKillEntity))
                .event.subscribe("activate", this.kill))
                .appendTo(this);
            new BlockRow_1.BlockRow()
                .append(this.buttonTeleport = new Button_1.default()
                .setText(() => (0, IDebugTools_1.translation)(this.entity?.asLocalPlayer ? IDebugTools_1.DebugToolsTranslation.ButtonTeleportLocalPlayer : IDebugTools_1.DebugToolsTranslation.ButtonTeleportEntity))
                .event.subscribe("activate", this.openTeleportMenu))
                .append(new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonCloneEntity))
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
            this.actionHistory = new Details_1.default()
                .setSummary(summary => summary.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.PanelHistory)))
                .appendTo(this);
            this.event.subscribe("switchTo", () => this.subsections
                .forEach(subsection => subsection.event.emit("switchTo")));
            this.event.subscribe("switchAway", () => this.subsections
                .forEach(subsection => subsection.event.emit("switchAway")));
        }
        getTabs() {
            return this.entities.entries().stream()
                .map(([i, entity]) => (0, Tuple_1.Tuple)(i, () => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.EntityName)
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
            this.actionHistory.dump()
                .append(new ActionHistory_1.default(this.entity));
            return this;
        }
        update(tile) {
            const entities = tile.getPlayersOnTile(true);
            if (tile.creature)
                entities.push(tile.creature);
            if (tile.npc)
                entities.push(tile.npc);
            if ((0, Array_1.areArraysIdentical)(entities, this.entities))
                return;
            this.entities = entities;
            this.event.emit("change");
            if (!this.entities.length)
                return;
            this.setShouldLog();
            for (const entity of this.entities) {
                if (entity instanceof EntityWithStats_1.default) {
                    const entityEvents = entity.event.until(this, "remove", "change");
                    entityEvents.subscribe("statChanged", this.onStatChange);
                    entityEvents.subscribe("statMaxChanged", this.onStatMaxChanged);
                }
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
            this.statMaxComponents.clear();
            if (!(this.entity instanceof EntityWithStats_1.default)) {
                return;
            }
            const stats = Enums_1.default.values(IStats_1.Stat)
                .filter(stat => this.entity?.asEntityWithStats?.stat.has(stat) && (!this.subsections.some(subsection => subsection.getImmutableStats().includes(stat))))
                .map(stat => this.entity?.asEntityWithStats?.stat.get(stat))
                .filterNullish();
            for (const stat of stats) {
                if ("max" in stat && !stat.canExceedMax) {
                    this.statComponents.set(stat.type, new RangeRow_1.RangeRow()
                        .setLabel(label => label.setText(Translation_1.default.stat(stat.type).inContext(ITranslation_1.TextContext.Title)))
                        .editRange(range => range
                        .noClampOnRefresh()
                        .setMin(0)
                        .setMax(stat.max)
                        .setRefreshMethod(() => this.entity ? this.entity.asEntityWithStats?.stat.getValue(stat.type) : 0))
                        .event.subscribe("finish", this.setStat(stat.type))
                        .setDisplayValue(true)
                        .appendTo(this.statWrapper));
                    this.statMaxComponents.set(stat.type, new RangeRow_1.RangeRow()
                        .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelMax).addArgs(Translation_1.default.stat(stat.type).inContext(ITranslation_1.TextContext.Title))))
                        .editRange(range => range
                        .noClampOnRefresh()
                        .setMin(0)
                        .setMax(500)
                        .setRefreshMethod(() => this.entity ? this.entity.asEntityWithStats?.stat.getMax(stat.type) : 0))
                        .event.subscribe("finish", this.setStatMax(stat.type))
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
                        .setDefault(() => this.entity?.asEntityWithStats?.stat.getValue(stat.type)?.toString() ?? "")
                        .clear()
                        .appendTo(new LabelledRow_1.LabelledRow()
                        .setLabel(label => label.setText(Translation_1.default.stat(stat.type).inContext(ITranslation_1.TextContext.Title)))
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
        onStatMaxChanged(_, stat) {
            const statComponent = this.statComponents.get(stat.type);
            if (statComponent) {
                statComponent.getAs(RangeRow_1.RangeRow)?.editRange(range => range.setMax(stat.max));
                statComponent.refresh();
            }
            const statMaxComponent = this.statMaxComponents.get(stat.type);
            if (statMaxComponent) {
                statMaxComponent.refresh(false);
            }
        }
        openTeleportMenu() {
            const screen = ui.screens.getTop();
            if (!screen) {
                return;
            }
            if (this.entity?.asLocalPlayer && !multiplayer.isConnected) {
                this.selectTeleportLocation();
                return;
            }
            const mouse = InputManager_1.default.mouse.position;
            new ContextMenu_1.default(["select location", {
                    translation: (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.OptionTeleportSelectLocation),
                    onActivate: this.selectTeleportLocation,
                }], this.entity?.asLocalPlayer ? undefined : ["to local player", {
                    translation: (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.OptionTeleportToLocalPlayer),
                    onActivate: () => this.teleport(localPlayer.tile),
                }], !multiplayer.isConnected || this.entity?.asLocalPlayer ? undefined : ["to host", {
                    translation: (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.OptionTeleportToHost),
                    onActivate: () => this.teleport(game.playerManager.players[0].tile),
                }], !multiplayer.isConnected ? undefined : ["to player", {
                    translation: (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.OptionTeleportToPlayer),
                    submenu: this.createTeleportToPlayerMenu,
                }])
                .addAllDescribedOptions()
                .setPosition(...mouse.xy)
                .schedule(screen.setContextMenu);
        }
        createTeleportToPlayerMenu() {
            return game.playerManager.getAll(true, true).stream()
                .filter(player => player !== this.entity)
                .map(player => (0, Tuple_1.Tuple)(player.name, {
                translation: TranslationImpl_1.default.generator(player.name),
                onActivate: () => this.teleport(player.tile),
            }))
                .sort(([, t1], [, t2]) => Text_1.default.toString(t1.translation).localeCompare(Text_1.default.toString(t2.translation)))
                .collect(options => new ContextMenu_1.default(...options))
                .addAllDescribedOptions();
        }
        async selectTeleportLocation() {
            const teleportLocation = await this.DEBUG_TOOLS.selector.select();
            if (!teleportLocation)
                return;
            this.teleport(teleportLocation);
        }
        teleport(tile) {
            TeleportEntity_1.default.execute(localPlayer, this.entity, tile);
            this.event.emit("update");
        }
        kill() {
            Kill_1.default.execute(localPlayer, this.entity);
            this.event.emit("update");
        }
        async cloneEntity() {
            const teleportLocation = await this.DEBUG_TOOLS.selector.select();
            if (!teleportLocation)
                return;
            Clone_1.default.execute(localPlayer, this.entity, teleportLocation);
        }
        heal() {
            Heal_1.default.execute(localPlayer, this.entity);
            this.event.emit("update");
        }
        setStat(stat) {
            return (_, value) => {
                if (this.entity?.asEntityWithStats?.stat.getValue(stat) === value)
                    return;
                SetStat_1.default.execute(localPlayer, this.entity, stat, value);
            };
        }
        setStatMax(stat) {
            return (_, value) => {
                if (this.entity?.asEntityWithStats?.stat.getValue(stat) === value)
                    return;
                SetStatMax_1.default.execute(localPlayer, this.entity, stat, value);
            };
        }
    }
    exports.default = EntityInformation;
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], EntityInformation.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], EntityInformation.prototype, "LOG", void 0);
    __decorate([
        Decorators_1.Bound
    ], EntityInformation.prototype, "onStatChange", null);
    __decorate([
        Decorators_1.Bound
    ], EntityInformation.prototype, "onStatMaxChanged", null);
    __decorate([
        Decorators_1.Bound
    ], EntityInformation.prototype, "openTeleportMenu", null);
    __decorate([
        Decorators_1.Bound
    ], EntityInformation.prototype, "createTeleportToPlayerMenu", null);
    __decorate([
        Decorators_1.Bound
    ], EntityInformation.prototype, "selectTeleportLocation", null);
    __decorate([
        Decorators_1.Bound
    ], EntityInformation.prototype, "teleport", null);
    __decorate([
        Decorators_1.Bound
    ], EntityInformation.prototype, "kill", null);
    __decorate([
        Decorators_1.Bound
    ], EntityInformation.prototype, "cloneEntity", null);
    __decorate([
        Decorators_1.Bound
    ], EntityInformation.prototype, "heal", null);
    __decorate([
        Decorators_1.Bound
    ], EntityInformation.prototype, "setStat", null);
    __decorate([
        Decorators_1.Bound
    ], EntityInformation.prototype, "setStatMax", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5SW5mb3JtYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9FbnRpdHlJbmZvcm1hdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUE4Q0gsTUFBTSx1QkFBdUIsR0FBb0Q7UUFDaEYsMkJBQWlCO1FBQ2pCLDBCQUFnQjtRQUNoQix3QkFBYztRQUNkLDZCQUFtQjtLQUNuQixDQUFDO0lBRUYsTUFBcUIsaUJBQWtCLFNBQVEsbUNBQXlCO1FBa0J2RTtZQUNDLEtBQUssRUFBRSxDQUFDO1lBVlEsbUJBQWMsR0FBRyxJQUFJLEdBQUcsRUFBMEIsQ0FBQztZQUNuRCxzQkFBaUIsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztZQUt2RCxhQUFRLEdBQWEsRUFBRSxDQUFDO1lBTS9CLElBQUksbUJBQVEsRUFBRTtpQkFDWixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLGdCQUFNLEVBQUU7aUJBQ3BDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFBLHlCQUFXLEVBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLG1DQUFxQixDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxtQ0FBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUM3SSxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO2lCQUN0QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2hCLE1BQU0sQ0FBQyxJQUFJLGdCQUFNLEVBQUU7aUJBQ2xCLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDNUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN4QyxRQUFRLENBQUMs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
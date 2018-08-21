var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IBaseEntity", "entity/IEntity", "entity/IStats", "Enums", "language/Translation", "mod/ModRegistry", "newui/BindingManager", "newui/component/Button", "newui/component/Component", "newui/component/ContextMenu", "newui/component/IComponent", "newui/component/Input", "newui/component/LabelledRow", "newui/component/RangeInput", "newui/component/RangeRow", "newui/component/Text", "utilities/Collectors", "utilities/enum/Enums", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools", "../../util/Array", "./Creature", "./Npc", "./Player"], function (require, exports, IBaseEntity_1, IEntity_1, IStats_1, Enums_1, Translation_1, ModRegistry_1, BindingManager_1, Button_1, Component_1, ContextMenu_1, IComponent_1, Input_1, LabelledRow_1, RangeInput_1, RangeRow_1, Text_1, Collectors_1, Enums_2, Objects_1, Actions_1, DebugTools_1, IDebugTools_1, Array_1, Creature_1, Npc_1, Player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EntityInformation extends Component_1.default {
        constructor(api) {
            super(api);
            this.entities = [];
            this.statComponents = new Map();
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
            this.trigger("change");
            this.toggle(!!this.entities.length);
            this.dump();
            if (!this.entities.length)
                return;
            for (const entity of this.entities) {
                DebugTools_1.default.LOG.info("Entity:", entity);
                this.addEntityDisplay(entity);
            }
            return this;
        }
        addEntityDisplay(entity) {
            this.until([IComponent_1.ComponentEvent.Remove, "change"])
                .bind(entity, IBaseEntity_1.EntityEvent.StatChanged, this.onStatChange);
            new Text_1.Paragraph(this.api)
                .setText(() => DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.EntityName).get(IEntity_1.EntityType[entity.entityType], game.getName(entity, Enums_1.SentenceCaseStyle.Title)))
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonKillEntity))
                .on(Button_1.ButtonEvent.Activate, this.kill(entity))
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonHealEntity))
                .on(Button_1.ButtonEvent.Activate, this.heal(entity))
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonTeleportEntity))
                .on(Button_1.ButtonEvent.Activate, this.openTeleportMenu(entity))
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonCloneEntity))
                .on(Button_1.ButtonEvent.Activate, this.cloneEntity(entity))
                .appendTo(this);
            let subInfo;
            switch (entity.entityType) {
                case IEntity_1.EntityType.Player: {
                    subInfo = new Player_1.default(this.api, entity);
                    break;
                }
                case IEntity_1.EntityType.NPC: {
                    subInfo = new Npc_1.default(this.api, entity);
                    break;
                }
                case IEntity_1.EntityType.Creature: {
                    subInfo = new Creature_1.default(this.api, entity);
                    break;
                }
            }
            subInfo.classes.add("debug-tools-inspect-entity-sub-section");
            const stats = Enums_2.default.values(IStats_1.Stat)
                .filter(stat => entity.hasStat(stat) && (!subInfo.getImmutableStats().includes(stat)))
                .map(stat => entity.getStat(stat))
                .filter((stat) => stat !== undefined);
            for (const stat of stats) {
                if ("max" in stat && !stat.canExceedMax) {
                    this.statComponents.set(stat.type, new RangeRow_1.RangeRow(this.api)
                        .setLabel(label => label.setText(Translation_1.default.generator(IStats_1.Stat[stat.type])))
                        .editRange(range => range
                        .setMin(0)
                        .setMax(stat.max)
                        .setRefreshMethod(() => entity.getStatValue(stat.type)))
                        .on(RangeInput_1.RangeInputEvent.Finish, this.setStat(stat.type, entity))
                        .setDisplayValue(true)
                        .appendTo(this));
                }
                else {
                    this.statComponents.set(stat.type, new Input_1.default(this.api)
                        .on(Input_1.InputEvent.Done, (input, value) => {
                        if (isNaN(+value)) {
                            input.clear();
                        }
                        else {
                            this.setStat(stat.type, entity)(input, +value);
                        }
                    })
                        .setCanBeEmpty(false)
                        .setDefault(() => `${entity.getStatValue(stat.type)}`)
                        .clear()
                        .appendTo(new LabelledRow_1.LabelledRow(this.api)
                        .setLabel(label => label.setText(Translation_1.default.generator(IStats_1.Stat[stat.type])))
                        .appendTo(this)));
                }
            }
            subInfo.appendTo(this);
        }
        onStatChange(_, stat, oldValue, info) {
            const statComponent = this.statComponents.get(stat.type);
            if (statComponent) {
                statComponent.refresh();
            }
        }
        kill(entity) {
            return () => {
                actionManager.execute(entity.entityType === IEntity_1.EntityType.Player ? entity : localPlayer, Actions_1.default.get("kill"), entity.entityType === IEntity_1.EntityType.Player ? {} : {
                    [entity.entityType === IEntity_1.EntityType.Creature ? "creature" : "npc"]: entity,
                });
                this.triggerSync("update");
            };
        }
        cloneEntity(entity) {
            return async () => {
                const teleportLocation = await DebugTools_1.default.INSTANCE.selector.select();
                if (!teleportLocation)
                    return;
                actionManager.execute(entity.entityType === IEntity_1.EntityType.Player ? entity : localPlayer, Actions_1.default.get("clone"), Object.assign({ point: { x: teleportLocation.x, y: teleportLocation.y } }, entity.entityType === IEntity_1.EntityType.Player ? {} : {
                    [entity.entityType === IEntity_1.EntityType.Creature ? "creature" : "npc"]: entity,
                }));
            };
        }
        openTeleportMenu(entity) {
            return () => {
                const screen = this.api.getVisibleScreen();
                if (!screen) {
                    return;
                }
                if (entity === localPlayer && !multiplayer.isConnected()) {
                    this.selectTeleportLocation(entity)();
                    return;
                }
                const mouse = BindingManager_1.bindingManager.getMouse();
                new ContextMenu_1.default(this.api, ["select location", {
                        translation: DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.OptionTeleportSelectLocation),
                        onActivate: this.selectTeleportLocation(entity),
                    }], entity === localPlayer ? undefined : ["to local player", {
                        translation: DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.OptionTeleportToLocalPlayer),
                        onActivate: () => this.teleport(entity, localPlayer),
                    }], !multiplayer.isConnected() || entity === players[0] ? undefined : ["to host", {
                        translation: DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.OptionTeleportToHost),
                        onActivate: () => this.teleport(entity, players[0]),
                    }], !multiplayer.isConnected() ? undefined : ["to player", {
                        translation: DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.OptionTeleportToPlayer),
                        submenu: this.createTeleportToPlayerMenu(entity),
                    }])
                    .addAllDescribedOptions()
                    .setPosition(...mouse.xy)
                    .schedule(screen.setContextMenu);
            };
        }
        createTeleportToPlayerMenu(entity) {
            return (api) => players.values()
                .filter(player => player !== entity)
                .map(player => [player.name, {
                    translation: Translation_1.default.generator(player.name),
                    onActivate: () => this.teleport(entity, player),
                }])
                .collect(Collectors_1.default.toArray)
                .sort(([, t1], [, t2]) => Text_1.default.toString(t1.translation).localeCompare(Text_1.default.toString(t2.translation)))
                .values()
                .collect(Collectors_1.default.passTo(ContextMenu_1.default.bind(null, this.api), Collectors_1.PassStrategy.Splat))
                .addAllDescribedOptions();
        }
        selectTeleportLocation(entity) {
            return async () => {
                const teleportLocation = await DebugTools_1.default.INSTANCE.selector.select();
                if (!teleportLocation)
                    return;
                this.teleport(entity, teleportLocation);
            };
        }
        teleport(entity, location) {
            actionManager.execute(entity.entityType === IEntity_1.EntityType.Player ? entity : localPlayer, Actions_1.default.get("teleport"), Object.assign({ object: [location.x, location.y, "z" in location ? location.z : entity.z] }, entity.entityType === IEntity_1.EntityType.Player ? {} : {
                [entity.entityType === IEntity_1.EntityType.Creature ? "creature" : "npc"]: entity,
            }));
            this.triggerSync("update");
        }
        heal(entity) {
            return () => {
                actionManager.execute(entity.entityType === IEntity_1.EntityType.Player ? entity : localPlayer, Actions_1.default.get("heal"), entity.entityType === IEntity_1.EntityType.Player ? {} : {
                    [entity.entityType === IEntity_1.EntityType.Creature ? "creature" : "npc"]: entity,
                });
                this.triggerSync("update");
            };
        }
        setStat(stat, entity) {
            return (_, value) => {
                actionManager.execute(entity.entityType === IEntity_1.EntityType.Player ? entity : localPlayer, ModRegistry_1.Registry.id(DebugTools_1.default.INSTANCE.actions.setStat), Object.assign({ object: [stat, value] }, entity.entityType === IEntity_1.EntityType.Player ? {} : {
                    [entity.entityType === IEntity_1.EntityType.Creature ? "creature" : "npc"]: entity,
                }));
            };
        }
    }
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "onStatChange", null);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "kill", null);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "cloneEntity", null);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "openTeleportMenu", null);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "teleport", null);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "heal", null);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "setStat", null);
    exports.default = EntityInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXVDQSxNQUFxQixpQkFBa0IsU0FBUSxtQkFBUztRQUl2RCxZQUFtQixHQUFVO1lBQzVCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUpKLGFBQVEsR0FBc0MsRUFBRSxDQUFDO1lBQ2pELG1CQUFjLEdBQUcsSUFBSSxHQUFHLEVBQXNCLENBQUM7UUFJdkQsQ0FBQztRQUVNLE1BQU0sQ0FBQyxRQUFrQixFQUFFLElBQVc7WUFDNUMsTUFBTSxRQUFRLEdBQXNDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFdEYsSUFBSSxJQUFJLENBQUMsUUFBUTtnQkFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoRCxJQUFJLElBQUksQ0FBQyxHQUFHO2dCQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXRDLElBQUksMEJBQWtCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQUUsT0FBTztZQUN4RCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUV6QixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXZCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBRVosSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBRWxDLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbkMsb0JBQVUsQ0FBQyxHQUFHLENB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
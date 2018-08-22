var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IBaseEntity", "entity/IEntity", "entity/IStats", "Enums", "language/Translation", "newui/BindingManager", "newui/component/Button", "newui/component/Component", "newui/component/ContextMenu", "newui/component/IComponent", "newui/component/Input", "newui/component/LabelledRow", "newui/component/RangeInput", "newui/component/RangeRow", "newui/component/Text", "utilities/Collectors", "utilities/enum/Enums", "utilities/math/Vector3", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools", "../../util/Array", "./Creature", "./Npc", "./Player"], function (require, exports, IBaseEntity_1, IEntity_1, IStats_1, Enums_1, Translation_1, BindingManager_1, Button_1, Component_1, ContextMenu_1, IComponent_1, Input_1, LabelledRow_1, RangeInput_1, RangeRow_1, Text_1, Collectors_1, Enums_2, Vector3_1, Objects_1, Actions_1, DebugTools_1, IDebugTools_1, Array_1, Creature_1, Npc_1, Player_1) {
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
            Actions_1.default.get("teleport")
                .execute({ entity, position: new Vector3_1.default(location.x, location.y, "z" in location ? location.z : entity.z) });
            this.triggerSync("update");
        }
        kill(entity) {
            return () => {
                Actions_1.default.get("kill").execute({ entity });
                this.triggerSync("update");
            };
        }
        cloneEntity(entity) {
            return async () => {
                const teleportLocation = await DebugTools_1.default.INSTANCE.selector.select();
                if (!teleportLocation)
                    return;
                Actions_1.default.get("clone")
                    .execute({ entity, position: new Vector3_1.default(teleportLocation.x, teleportLocation.y, localPlayer.z) });
            };
        }
        heal(entity) {
            return () => {
                Actions_1.default.get("heal").execute({ entity });
                this.triggerSync("update");
            };
        }
        setStat(stat, entity) {
            return (_, value) => {
                Actions_1.default.get("setStat").execute({ entity, object: [stat, value] });
            };
        }
    }
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "onStatChange", null);
    __decorate([
        Objects_1.Bound
    ], EntityInformation.prototype, "openTeleportMenu", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXVDQSxNQUFxQixpQkFBa0IsU0FBUSxtQkFBUztRQUl2RCxZQUFtQixHQUFVO1lBQzVCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUpKLGFBQVEsR0FBc0MsRUFBRSxDQUFDO1lBQ2pELG1CQUFjLEdBQUcsSUFBSSxHQUFHLEVBQXNCLENBQUM7UUFJdkQsQ0FBQztRQUVNLE1BQU0sQ0FBQyxRQUFrQixFQUFFLElBQVc7WUFDNUMsTUFBTSxRQUFRLEdBQXNDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFdEYsSUFBSSxJQUFJLENBQUMsUUFBUTtnQkFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoRCxJQUFJLElBQUksQ0FBQyxHQUFHO2dCQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXRDLElBQUksMEJBQWtCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQUUsT0FBTztZQUN4RCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUV6QixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXZCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBRVosSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBRWxDLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbkMsb0JBQVUsQ0FBQyxHQUFHLENB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
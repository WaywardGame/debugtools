var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IEntity", "entity/IStats", "Enums", "item/Items", "language/IMessages", "mapgen/MapGenHelpers", "mod/ModRegistry", "newui/component/Text", "tile/Terrains", "utilities/enum/Enums", "utilities/math/Vector2", "utilities/math/Vector3", "utilities/TileHelpers", "./DebugTools", "./IDebugTools", "./ui/InspectDialog", "./util/TilePosition"], function (require, exports, IEntity_1, IStats_1, Enums_1, Items_1, IMessages_1, MapGenHelpers_1, ModRegistry_1, Text_1, Terrains_1, Enums_2, Vector2_1, Vector3_1, TileHelpers_1, DebugTools_1, IDebugTools_1, InspectDialog_1, TilePosition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RemovalType;
    (function (RemovalType) {
        RemovalType[RemovalType["Corpse"] = 0] = "Corpse";
    })(RemovalType = exports.RemovalType || (exports.RemovalType = {}));
    function description(name) {
        return { name, usableAsGhost: true, usableWhenPaused: true, ignoreHasDelay: true };
    }
    class Actions {
        constructor(mod) {
            this.mod = mod;
        }
        static get(name) {
            return {
                execute: (argument) => {
                    const action = DebugTools_1.default.INSTANCE.actions[name];
                    if (typeof action !== "function") {
                        DebugTools_1.default.LOG.error(`Action ${name} is invalid`);
                        return;
                    }
                    actionManager.execute(localPlayer, ModRegistry_1.Registry.id(action), argument);
                },
            };
        }
        removeItem(executor, { item }, result) {
            const container = item.containedWithin;
            itemManager.remove(item);
            if (container) {
                if ("data" in container) {
                    result.updateView = true;
                }
                else if ("entityType" in container) {
                    const entity = container;
                    if (entity.entityType === IEntity_1.EntityType.Player) {
                        entity.updateTablesAndWeight();
                    }
                }
            }
            if (InspectDialog_1.default.INSTANCE)
                InspectDialog_1.default.INSTANCE.update();
        }
        placeTemplate(executor, { point, object: [type, options] }, result) {
            MapGenHelpers_1.spawnTemplate(type, point.x, point.y, executor.z, options);
            result.updateView = true;
        }
        executeOnSelection(executor, { object: [action, selection] }, result) {
            for (const [type, id] of selection) {
                const executeArgument = {};
                switch (type) {
                    case IEntity_1.EntityType.Creature:
                        executeArgument.creature = game.creatures[id];
                        break;
                    case IEntity_1.EntityType.NPC:
                        executeArgument.npc = game.npcs[id];
                        break;
                }
                switch (action) {
                    case IDebugTools_1.DebugToolsTranslation.ActionRemove:
                        this.remove(executor, executeArgument, result);
                        break;
                }
            }
        }
        teleport(executor, { entity, position }, result) {
            position = this.getPosition(executor, position, () => DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionTeleport)
                .get(game.getName(entity)));
            if (!entity || !position)
                return;
            if (entity.entityType === IEntity_1.EntityType.Creature) {
                const tile = game.getTile(entity.x, entity.y, entity.z);
                delete tile.creature;
            }
            if (entity.entityType === IEntity_1.EntityType.NPC) {
                const tile = game.getTile(entity.x, entity.y, entity.z);
                delete tile.npc;
            }
            if (entity.entityType === IEntity_1.EntityType.Player) {
                entity.setPosition(position);
            }
            else {
                entity.x = entity.fromX = position.x;
                entity.y = entity.fromY = position.y;
                entity.z = position.z;
            }
            if (entity.entityType === IEntity_1.EntityType.Creature) {
                const tile = game.getTile(entity.x, entity.y, entity.z);
                tile.creature = entity;
            }
            if (entity.entityType === IEntity_1.EntityType.NPC) {
                const tile = game.getTile(entity.x, entity.y, entity.z);
                tile.npc = entity;
            }
            game.updateView(true);
        }
        kill(executor, { entity }, result) {
            entity.damage({
                type: Enums_1.DamageType.True,
                amount: Infinity,
                damageMessage: DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.KillEntityDeathMessage).getString(),
            });
            renderer.computeSpritesInViewport();
            result.updateRender = true;
        }
        clone(executor, { entity, position }, result) {
            let clone;
            position = this.getPosition(executor, position, () => DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionClone)
                .get(game.getName(entity)));
            if (!entity || !position)
                return;
            if (entity.entityType === IEntity_1.EntityType.Creature) {
                clone = creatureManager.spawn(entity.type, position.x, position.y, position.z, true, entity.aberrant);
                if (entity.isTamed())
                    clone.tame(entity.getOwner());
                clone.renamed = entity.renamed;
                clone.ai = entity.ai;
                clone.enemy = entity.enemy;
                clone.enemyAttempts = entity.enemyAttempts;
                clone.enemyIsPlayer = entity.enemyIsPlayer;
            }
            else {
                clone = npcManager.spawn(Enums_1.NPCType.Merchant, position.x, position.y, position.z);
                clone.customization = Object.assign({}, entity.customization);
                clone.renamed = entity.getName();
                this.cloneInventory(entity, clone);
            }
            clone.direction = new Vector2_1.default(entity.direction).raw();
            clone.facingDirection = entity.facingDirection;
            this.copyStats(entity, clone);
            if (clone.entityType === IEntity_1.EntityType.NPC) {
                clone.ai = IEntity_1.AiType.Neutral;
            }
            renderer.computeSpritesInViewport();
            result.updateRender = true;
        }
        setTime(player, { object: time }, result) {
            game.time.setTime(time);
            game.updateRender = true;
            fieldOfView.compute();
        }
        heal(executor, { entity, object: corpseId }, result) {
            if (!entity) {
                result.updateRender = this.resurrectCorpse(executor, game.corpses[corpseId]);
                return;
            }
            const health = entity.getStat(IStats_1.Stat.Health);
            const stamina = entity.getStat(IStats_1.Stat.Stamina);
            const hunger = entity.getStat(IStats_1.Stat.Hunger);
            const thirst = entity.getStat(IStats_1.Stat.Thirst);
            entity.setStat(health, entity.entityType === IEntity_1.EntityType.Player ? entity.getMaxHealth() : health.max);
            if (stamina)
                entity.setStat(stamina, stamina.max);
            if (hunger)
                entity.setStat(hunger, hunger.max);
            if (thirst)
                entity.setStat(thirst, thirst.max);
            entity.setStatus(Enums_1.StatusType.Bleeding, false);
            entity.setStatus(Enums_1.StatusType.Burned, false);
            entity.setStatus(Enums_1.StatusType.Poisoned, false);
            if (entity.entityType === IEntity_1.EntityType.Player) {
                entity.state = Enums_1.PlayerState.None;
                entity.updateStatsAndAttributes();
            }
            result.updateRender = true;
        }
        setStat(executor, { entity, object: [stat, value] }, result) {
            entity.setStat(stat, value);
        }
        setTamed(player, { creature, object: tamed }, result) {
            if (tamed)
                creature.tame(player);
            else
                creature.release();
        }
        remove(player, { creature, npc, object: otherRemoval }, result) {
            this.removeInternal(otherRemoval || [], creature, npc);
            renderer.computeSpritesInViewport();
            result.updateRender = true;
        }
        setWeightBonus(executor, { player, object: weightBonus }, result) {
            this.mod.setPlayerData(player, "weightBonus", weightBonus);
            player.updateStrength();
            player.updateTablesAndWeight();
        }
        changeTerrain(player, { object: terrain, position }, result) {
            if (!position)
                return;
            game.changeTile(terrain, position.x, position.y, position.z, false);
            this.setTilled(position.x, position.y, position.z, false);
            renderer.computeSpritesInViewport();
            result.updateRender = true;
        }
        toggleTilled(player, { position, object: tilled }, result) {
            if (!position)
                return;
            this.setTilled(position.x, position.y, position.z, tilled);
            renderer.computeSpritesInViewport();
            result.updateRender = true;
        }
        updateStatsAndAttributes(player, argument, result) {
            player.updateStatsAndAttributes();
        }
        addItemToInventory(executor, { human, point, object: [item, quality] }, result) {
            if (human) {
                human.createItemInInventory(item, quality);
                if (human.entityType === IEntity_1.EntityType.Player) {
                    human.updateTablesAndWeight();
                }
            }
            else if (point) {
                itemManager.create(item, itemManager.getTileContainer(point.x, point.y, executor.z), quality);
                result.updateView = true;
            }
            if (InspectDialog_1.default.INSTANCE)
                InspectDialog_1.default.INSTANCE.update();
        }
        paint(player, { object: [tiles, data] }, result) {
            for (const tileId of tiles) {
                const [x, y, z] = TilePosition_1.getTilePosition(tileId);
                for (const k in data) {
                    const paintType = k;
                    switch (paintType) {
                        case "terrain": {
                            game.changeTile(data.terrain.type, x, y, z, false);
                            if (data.terrain.tilled !== undefined)
                                this.setTilled(x, y, z, data.terrain.tilled);
                            break;
                        }
                        case "creature": {
                            const creature = game.getTile(x, y, z).creature;
                            if (creature)
                                creatureManager.remove(creature);
                            const type = data.creature.type;
                            if (type !== "remove") {
                                creatureManager.spawn(type, x, y, z, true, data.creature.aberrant);
                            }
                            break;
                        }
                        case "npc": {
                            const npc = game.getTile(x, y, z).npc;
                            if (npc)
                                npcManager.remove(npc);
                            const type = data.npc.type;
                            if (type !== "remove") {
                                npcManager.spawn(type, x, y, z);
                            }
                            break;
                        }
                        case "doodad": {
                            const doodad = game.getTile(x, y, z).doodad;
                            if (doodad)
                                doodadManager.remove(doodad);
                            const type = data.doodad.type;
                            if (type !== "remove") {
                                doodadManager.create(type, x, y, z);
                            }
                            break;
                        }
                        case "corpse": {
                            if (data.corpse.replaceExisting || data.corpse.type === "remove") {
                                const corpses = game.getTile(x, y, z).corpses;
                                if (corpses) {
                                    for (const corpse of corpses) {
                                        corpseManager.remove(corpse);
                                    }
                                }
                            }
                            const type = data.corpse.type;
                            if (type !== undefined && type !== "remove") {
                                corpseManager.create(type, x, y, z, undefined, data.corpse.aberrant);
                            }
                            break;
                        }
                        case "tileEvent": {
                            if (data.tileEvent.replaceExisting || data.tileEvent.type === "remove") {
                                const tileEvents = game.getTile(x, y, z).events;
                                if (tileEvents) {
                                    for (const event of tileEvents) {
                                        tileEventManager.remove(event);
                                    }
                                }
                            }
                            const type = data.tileEvent.type;
                            if (type !== undefined && type !== "remove") {
                                tileEventManager.create(type, x, y, z);
                            }
                            break;
                        }
                    }
                }
            }
        }
        unlockRecipes(player, argument, result) {
            const itemTypes = Enums_2.default.values(Enums_1.ItemType);
            for (const itemType of itemTypes) {
                const desc = Items_1.default[itemType];
                if (desc && desc.recipe && desc.craftable !== false && !game.crafted[itemType]) {
                    game.crafted[itemType] = {
                        newUnlock: true,
                        unlockTime: Date.now(),
                    };
                }
            }
            game.updateTablesAndWeight();
        }
        toggleInvulnerable(executor, { player, object: invulnerable }, result) {
            DebugTools_1.default.INSTANCE.setPlayerData(player, "invulnerable", invulnerable);
        }
        setSkill(executor, { player, object: [skill, value] }, result) {
            if (!player)
                return;
            player.skills[skill].core = value;
            player.skills[skill].percent = player.skills[skill].bonus + value;
        }
        toggleNoclip(executor, { player, object: noclip }, result) {
            if (!player)
                return;
            DebugTools_1.default.INSTANCE.setPlayerData(player, "noclip", noclip ? {
                moving: false,
                delay: Enums_1.Delay.Movement,
            } : false);
            player.moveType = noclip ? Enums_1.MoveType.Flying : Enums_1.MoveType.Land;
            game.updateView(true);
        }
        removeInternal([type, id], creature, npc) {
            if (creature)
                return creatureManager.remove(creature);
            if (npc)
                return npcManager.remove(npc);
            if (type === RemovalType.Corpse)
                return corpseManager.remove(game.corpses[id]);
        }
        resurrectCorpse(player, corpse) {
            if (corpse.type === Enums_1.CreatureType.Blood || corpse.type === Enums_1.CreatureType.WaterBlood) {
                return false;
            }
            const location = this.getPosition(player, new Vector3_1.default(corpse), () => DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionResurrect)
                .get(game.getName(corpse, Enums_1.SentenceCaseStyle.Sentence, true)));
            if (!location)
                return false;
            const creature = creatureManager.spawn(corpse.type, corpse.x, corpse.y, corpse.z, true, corpse.aberrant);
            creature.renamed = corpse.renamed;
            corpseManager.remove(corpse);
            renderer.computeSpritesInViewport();
            return true;
        }
        setTilled(x, y, z, tilled) {
            const tile = game.getTile(x, y, z);
            const tileType = TileHelpers_1.default.getType(tile);
            if (!Terrains_1.default[tileType].tillable) {
                return;
            }
            const tileData = game.getOrCreateTileData(x, y, z);
            if (tileData.length === 0) {
                tileData.push({
                    type: tileType,
                    tilled,
                });
            }
            else {
                tileData[0].tilled = tilled;
            }
            TileHelpers_1.default.setTilled(tile, tilled);
            world.updateTile(x, y, z, tile);
        }
        getPosition(player, position, actionName) {
            if (TileHelpers_1.default.isOpenTile(position, game.getTile(...new Vector3_1.default(position).xyz)))
                return position;
            const openTile = TileHelpers_1.default.findMatchingTile(position, TileHelpers_1.default.isOpenTile);
            if (!openTile) {
                player.messages.source(DebugTools_1.default.INSTANCE.source)
                    .type(IMessages_1.MessageType.Bad)
                    .send(this.messageFailureTileBlocked, Text_1.default.resolve(actionName));
            }
            return openTile;
        }
        copyStats(from, to) {
            for (const statName in from.stats) {
                const stat = IStats_1.Stat[statName];
                const statObject = from.getStat(stat);
                to.setStat(stat, statObject.value);
                const cloneStatObject = to.getStat(stat);
                if ("max" in statObject)
                    to.setStatMax(stat, statObject.max);
                if ("canExceedMax" in statObject)
                    cloneStatObject.canExceedMax = statObject.canExceedMax;
                if ("bonus" in statObject)
                    to.setStatBonus(stat, statObject.bonus);
                if ("changeTimer" in statObject) {
                    to.setStatChangeTimer(stat, statObject.changeTimer, statObject.changeAmount);
                    cloneStatObject.nextChangeTimer = statObject.nextChangeTimer;
                }
            }
            for (const statusEffect of from.statuses()) {
                to.setStatus(statusEffect, true);
            }
        }
        cloneInventory(from, to) {
            for (const item of to.inventory.containedItems) {
                itemManager.remove(item);
            }
            for (const item of to.getEquippedItems()) {
                itemManager.remove(item);
            }
            for (const item of from.inventory.containedItems) {
                const clone = to.createItemInInventory(item.type, item.quality);
                clone.ownerIdentifier = item.ownerIdentifier;
                clone.minDur = item.minDur;
                clone.maxDur = item.maxDur;
                clone.renamed = item.renamed;
                clone.weight = item.weight;
                clone.weightCapacity = item.weightCapacity;
                clone.legendary = item.legendary && Object.assign({}, item.legendary);
                if (item.isEquipped())
                    to.equip(clone, item.getEquipSlot());
            }
        }
    }
    __decorate([
        ModRegistry_1.default.message("FailureTileBlocked")
    ], Actions.prototype, "messageFailureTileBlocked", void 0);
    __decorate([
        ModRegistry_1.default.action(description("Remove Item"))
    ], Actions.prototype, "removeItem", null);
    __decorate([
        ModRegistry_1.default.action(description("Place Template"))
    ], Actions.prototype, "placeTemplate", null);
    __decorate([
        ModRegistry_1.default.action(description("Execute on Selection"))
    ], Actions.prototype, "executeOnSelection", null);
    __decorate([
        ModRegistry_1.default.action(description("Teleport Entity"))
    ], Actions.prototype, "teleport", null);
    __decorate([
        ModRegistry_1.default.action(description("Kill"))
    ], Actions.prototype, "kill", null);
    __decorate([
        ModRegistry_1.default.action(description("Clone"))
    ], Actions.prototype, "clone", null);
    __decorate([
        ModRegistry_1.default.action(description("Set Time"))
    ], Actions.prototype, "setTime", null);
    __decorate([
        ModRegistry_1.default.action(description("Heal"))
    ], Actions.prototype, "heal", null);
    __decorate([
        ModRegistry_1.default.action(description("Set Stat"))
    ], Actions.prototype, "setStat", null);
    __decorate([
        ModRegistry_1.default.action(description("Set Tamed"))
    ], Actions.prototype, "setTamed", null);
    __decorate([
        ModRegistry_1.default.action(description("Remove"))
    ], Actions.prototype, "remove", null);
    __decorate([
        ModRegistry_1.default.action(description("Set Weight Bonus"))
    ], Actions.prototype, "setWeightBonus", null);
    __decorate([
        ModRegistry_1.default.action(description("Change Terrain"))
    ], Actions.prototype, "changeTerrain", null);
    __decorate([
        ModRegistry_1.default.action(description("Toggle Tilled"))
    ], Actions.prototype, "toggleTilled", null);
    __decorate([
        ModRegistry_1.default.action(description("Update Stats and Attributes"))
    ], Actions.prototype, "updateStatsAndAttributes", null);
    __decorate([
        ModRegistry_1.default.action(description("Add Item to Inventory"))
    ], Actions.prototype, "addItemToInventory", null);
    __decorate([
        ModRegistry_1.default.action(description("Paint"))
    ], Actions.prototype, "paint", null);
    __decorate([
        ModRegistry_1.default.action(description("Unlock Recipes"))
    ], Actions.prototype, "unlockRecipes", null);
    __decorate([
        ModRegistry_1.default.action(description("Toggle Invulnerable"))
    ], Actions.prototype, "toggleInvulnerable", null);
    __decorate([
        ModRegistry_1.default.action(description("Set Skill"))
    ], Actions.prototype, "setSkill", null);
    __decorate([
        ModRegistry_1.default.action(description("Toggle Noclip"))
    ], Actions.prototype, "toggleNoclip", null);
    exports.default = Actions;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTZCQSxJQUFZLFdBRVg7SUFGRCxXQUFZLFdBQVc7UUFDdEIsaURBQU0sQ0FBQTtJQUNQLENBQUMsRUFGVyxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQUV0QjtJQUVELFNBQVMsV0FBVyxDQUFDLElBQVk7UUFDaEMsT0FBTyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDcEYsQ0FBQztJQUtELE1BQXFCLE9BQU87UUFtQjNCLFlBQW9DLEdBQWU7WUFBZixRQUFHLEdBQUgsR0FBRyxDQUFZO1FBQUksQ0FBQztRQWpCakQsTUFBTSxDQUFDLEdBQUcsQ0FBZ0QsSUFBTztZQUN2RSxPQUFPO2dCQUNOLE9BQU8sRUFBRSxDQUFDLFFBQXlCLEVBQUUsRUFBRTtvQkFDdEMsTUFBTSxNQUFNLEdBQUcsb0JBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNqRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsRUFBRTt3QkFDakMsb0JBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxhQUFhLENBQUMsQ0FBQzt3QkFDbEQsT0FBTztxQkFDUDtvQkFFRCxhQUFhLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxzQkFBUSxDQUFDLEVBQUUsQ0FBQyxNQUF3QixDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3JGLENBQUM7YUFDTSxDQUFDO1FBQ1YsQ0FBQztRQVlNLFVBQVUsQ0FBQyxRQUFpQixFQUFFLEVBQUUsSUFBSSxFQUFtQixFQUFFLE1BQXFCO1lBQ3BGLE1BQU0sU0FBUyxHQUFHLElBQUssQ0FBQyxlQUFlLENBQUM7WUFDeEMsV0FBVyxD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
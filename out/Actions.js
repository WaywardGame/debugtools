var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IEntity", "entity/IStats", "Enums", "item/Items", "language/IMessages", "mapgen/MapGenHelpers", "mod/Mod", "mod/ModRegistry", "newui/component/Text", "tile/Terrains", "utilities/enum/Enums", "utilities/math/Vector2", "utilities/math/Vector3", "utilities/TileHelpers", "./DebugTools", "./IDebugTools", "./ui/InspectDialog", "./ui/panel/SelectionPanel", "./util/TilePosition"], function (require, exports, IEntity_1, IStats_1, Enums_1, Items_1, IMessages_1, MapGenHelpers_1, Mod_1, ModRegistry_1, Text_1, Terrains_1, Enums_2, Vector2_1, Vector3_1, TileHelpers_1, DebugTools_1, IDebugTools_1, InspectDialog_1, SelectionPanel_1, TilePosition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RemovalType;
    (function (RemovalType) {
        RemovalType[RemovalType["Corpse"] = 0] = "Corpse";
        RemovalType[RemovalType["TileEvent"] = 1] = "TileEvent";
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
                    const action = this.debugTools.actions[name];
                    if (typeof action !== "function") {
                        this.log.error(`Action ${name} is invalid`);
                        return;
                    }
                    actionManager.execute(localPlayer, ModRegistry_1.Registry.id(action), argument);
                },
            };
        }
        placeTemplate(executor, { point, object: [type, options] }, result) {
            MapGenHelpers_1.spawnTemplate(type, point.x, point.y, executor.z, options);
            result.updateView = true;
        }
        executeOnSelection(executor, { object: [action, selection] }, result) {
            for (const [type, id] of selection) {
                let creature;
                let npc;
                let otherRemoval;
                switch (type) {
                    case SelectionPanel_1.SelectionType.Creature:
                        creature = game.creatures[id];
                        break;
                    case SelectionPanel_1.SelectionType.NPC:
                        npc = game.npcs[id];
                        break;
                    case SelectionPanel_1.SelectionType.TileEvent:
                        otherRemoval = [RemovalType.TileEvent, id];
                        break;
                }
                switch (action) {
                    case IDebugTools_1.DebugToolsTranslation.ActionRemove:
                        this.removeInternal(result, otherRemoval || [], creature, npc);
                        break;
                }
            }
            renderer.computeSpritesInViewport();
            result.updateRender = true;
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
        clone(executor, { entity, doodad, position }, result) {
            position = this.getPosition(executor, position, () => DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionClone)
                .get(game.getName(entity)));
            if (!position)
                return;
            if (entity) {
                this.cloneEntity(entity, position);
            }
            else if (doodad) {
                this.cloneDoodad(doodad, position);
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
        remove(player, { creature, npc, item, doodad, object: otherRemoval }, result) {
            this.removeInternal(result, otherRemoval || [], creature, npc, item, doodad);
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
        addItemToInventory(executor, { doodad, human, point, object: [item, quality] }, result) {
            if (human) {
                human.createItemInInventory(item, quality);
                if (human.entityType === IEntity_1.EntityType.Player) {
                    human.updateTablesAndWeight();
                }
            }
            else if (doodad) {
                itemManager.create(item, doodad, quality);
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
            Actions.debugTools.setPlayerData(player, "invulnerable", invulnerable);
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
            Actions.debugTools.setPlayerData(player, "noclip", noclip ? {
                moving: false,
                delay: Enums_1.Delay.Movement,
            } : false);
            player.moveType = noclip ? Enums_1.MoveType.Flying : Enums_1.MoveType.Land;
            game.updateView(true);
        }
        removeInternal(result, [type, id], creature, npc, item, doodad) {
            if (creature)
                return creatureManager.remove(creature);
            if (npc)
                return npcManager.remove(npc);
            if (doodad)
                return doodadManager.remove(doodad, true);
            if (item)
                return this.removeItem(result, item);
            if (type === RemovalType.Corpse)
                return corpseManager.remove(game.corpses[id]);
            if (type === RemovalType.TileEvent)
                return tileEventManager.remove(game.tileEvents[id]);
        }
        removeItem(result, item) {
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
            if (TileHelpers_1.default.isOpenTile(position, game.getTile(position.x, position.y, position.z)))
                return position;
            const openTile = TileHelpers_1.default.findMatchingTile(position, TileHelpers_1.default.isOpenTile);
            if (!openTile) {
                player.messages.source(Actions.debugTools.source)
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
        cloneEntity(entity, position) {
            let clone;
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
        cloneDoodad(doodad, position) {
            const clone = doodadManager.create(doodad.type, position.x, position.y, position.z, {
                gatherReady: doodad.gatherReady,
                gfx: doodad.gfx,
                spread: doodad.spread,
                treasure: doodad.treasure,
                weight: doodad.weight,
                legendary: doodad.legendary ? Object.assign({}, doodad.legendary) : undefined,
                disassembly: !doodad.disassembly ? undefined : doodad.disassembly
                    .map(item => itemManager.createFake(item.type, item.quality)),
                ownerIdentifier: doodad.ownerIdentifier,
                item: !doodad.item ? undefined : itemManager.createFake(doodad.item.type, doodad.item.quality),
                step: doodad.step,
            });
            if (!clone)
                return;
            if (doodad.containedItems) {
                this.cloneContainedItems(doodad, clone);
            }
        }
        cloneContainedItems(from, to) {
            if (!("containedItems" in from) || !("containedItems" in to))
                return;
            for (const item of from.containedItems || []) {
                const clone = itemManager.create(item.type, to, item.quality);
                clone.ownerIdentifier = item.ownerIdentifier;
                clone.minDur = item.minDur;
                clone.maxDur = item.maxDur;
                clone.renamed = item.renamed;
                clone.weight = item.weight;
                clone.weightCapacity = item.weightCapacity;
                clone.legendary = item.legendary && Object.assign({}, item.legendary);
            }
        }
    }
    __decorate([
        ModRegistry_1.default.message("FailureTileBlocked")
    ], Actions.prototype, "messageFailureTileBlocked", void 0);
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
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], Actions, "debugTools", void 0);
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], Actions, "log", void 0);
    exports.default = Actions;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWtDQSxJQUFZLFdBR1g7SUFIRCxXQUFZLFdBQVc7UUFDdEIsaURBQU0sQ0FBQTtRQUNOLHVEQUFTLENBQUE7SUFDVixDQUFDLEVBSFcsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFHdEI7SUFFRCxTQUFTLFdBQVcsQ0FBQyxJQUFZO1FBQ2hDLE9BQU8sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ3BGLENBQUM7SUFLRCxNQUFxQixPQUFPO1FBK0IzQixZQUFvQyxHQUFlO1lBQWYsUUFBRyxHQUFILEdBQUcsQ0FBWTtRQUFJLENBQUM7UUFyQmpELE1BQU0sQ0FBQyxHQUFHLENBQWdELElBQU87WUFDdkUsT0FBTztnQkFDTixPQUFPLEVBQUUsQ0FBQyxRQUF5QixFQUFFLEVBQUU7b0JBQ3RDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM3QyxJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsRUFBRTt3QkFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLGFBQWEsQ0FBQyxDQUFDO3dCQUM1QyxPQUFPO3FCQUNQO29CQUVELGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLHNCQUFRLENBQUMsRUFBRSxDQUFDLE1BQXdCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDckYsQ0FBQzthQUNNLENBQUM7UUFDVixDQUFDO1FBZ0JNLGFBQWEsQ0FBQyxRQUFpQixFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFBeUQsRUFBRSxNQUFx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
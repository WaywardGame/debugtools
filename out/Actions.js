var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IEntity", "entity/IStats", "Enums", "item/Items", "language/IMessages", "mapgen/MapGenHelpers", "mod/Mod", "mod/ModRegistry", "newui/component/Text", "tile/Terrains", "utilities/enum/Enums", "utilities/math/Vector2", "utilities/math/Vector3", "utilities/TileHelpers", "./IDebugTools", "./ui/InspectDialog", "./ui/panel/SelectionPanel", "./util/TilePosition"], function (require, exports, IEntity_1, IStats_1, Enums_1, Items_1, IMessages_1, MapGenHelpers_1, Mod_1, ModRegistry_1, Text_1, Terrains_1, Enums_2, Vector2_1, Vector3_1, TileHelpers_1, IDebugTools_1, InspectDialog_1, SelectionPanel_1, TilePosition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RemovalType;
    (function (RemovalType) {
        RemovalType[RemovalType["Corpse"] = 0] = "Corpse";
        RemovalType[RemovalType["TileEvent"] = 1] = "TileEvent";
    })(RemovalType = exports.RemovalType || (exports.RemovalType = {}));
    function description(name) {
        return { name, usableAsGhost: true, usableWhenPaused: true, ignoreHasDelay: true, ignoreIsMoving: true };
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
            position = this.getPosition(executor, position, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionTeleport)
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
                damageMessage: IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.KillEntityDeathMessage).getString(),
            });
            renderer.computeSpritesInViewport();
            result.updateRender = true;
        }
        clone(executor, { entity, doodad, position }, result) {
            position = this.getPosition(executor, position, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionClone)
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
        togglePermissions(executor, { player, object: permissions }, result) {
            if (!player)
                return;
            Actions.debugTools.setPlayerData(player, "permissions", permissions);
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
            const location = this.getPosition(player, new Vector3_1.default(corpse), () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionResurrect)
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
        ModRegistry_1.default.action(description("Toggle Permissions"))
    ], Actions.prototype, "togglePermissions", null);
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], Actions, "debugTools", void 0);
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], Actions, "log", void 0);
    exports.default = Actions;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWtDQSxJQUFZLFdBR1g7SUFIRCxXQUFZLFdBQVc7UUFDdEIsaURBQU0sQ0FBQTtRQUNOLHVEQUFTLENBQUE7SUFDVixDQUFDLEVBSFcsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFHdEI7SUFFRCxTQUFTLFdBQVcsQ0FBQyxJQUFZO1FBQ2hDLE9BQU8sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDMUcsQ0FBQztJQUtELE1BQXFCLE9BQU87UUErQjNCLFlBQW9DLEdBQWU7WUFBZixRQUFHLEdBQUgsR0FBRyxDQUFZO1FBQUksQ0FBQztRQXJCakQsTUFBTSxDQUFDLEdBQUcsQ0FBZ0QsSUFBTztZQUN2RSxPQUFPO2dCQUNOLE9BQU8sRUFBRSxDQUFDLFFBQXlCLEVBQUUsRUFBRTtvQkFDdEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzdDLElBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxFQUFFO3dCQUNqQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksYUFBYSxDQUFDLENBQUM7d0JBQzVDLE9BQU87cUJBQ1A7b0JBRUQsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsc0JBQVEsQ0FBQyxFQUFFLENBQUMsTUFBd0IsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNyRixDQUFDO2FBQ00sQ0FBQztRQUNWLENBQUM7UUFnQk0sYUFBYSxDQUFDLFFBQWlCLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8s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
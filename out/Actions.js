var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IEntity", "entity/IStats", "Enums", "item/Items", "mapgen/MapGenHelpers", "mod/Mod", "mod/ModRegistry", "newui/component/Text", "player/MessageManager", "tile/Terrains", "utilities/enum/Enums", "utilities/math/Vector2", "utilities/math/Vector3", "utilities/TileHelpers", "./IDebugTools", "./ui/InspectDialog", "./ui/panel/SelectionPanel", "./util/TilePosition"], function (require, exports, IEntity_1, IStats_1, Enums_1, Items_1, MapGenHelpers_1, Mod_1, ModRegistry_1, Text_1, MessageManager_1, Terrains_1, Enums_2, Vector2_1, Vector3_1, TileHelpers_1, IDebugTools_1, InspectDialog_1, SelectionPanel_1, TilePosition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RemovalType;
    (function (RemovalType) {
        RemovalType[RemovalType["Corpse"] = 0] = "Corpse";
        RemovalType[RemovalType["TileEvent"] = 1] = "TileEvent";
    })(RemovalType = exports.RemovalType || (exports.RemovalType = {}));
    const defaultDescription = { usableAsGhost: true, usableWhenPaused: true, ignoreHasDelay: true, ignoreIsMoving: true };
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
                .get(entity.getName()));
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
                damageMessage: IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.KillEntityDeathMessage),
            });
            renderer.computeSpritesInViewport();
            result.updateRender = true;
        }
        clone(executor, { entity, doodad, position }, result) {
            position = this.getPosition(executor, position, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionClone)
                .get(entity.getName()));
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
                .get(corpseManager.getName(corpse)));
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
                    .type(MessageManager_1.MessageType.Bad)
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
        ModRegistry_1.default.action("PlaceTemplate", defaultDescription)
    ], Actions.prototype, "placeTemplate", null);
    __decorate([
        ModRegistry_1.default.action("SelectionExecute", defaultDescription)
    ], Actions.prototype, "executeOnSelection", null);
    __decorate([
        ModRegistry_1.default.action("TeleportEntity", defaultDescription)
    ], Actions.prototype, "teleport", null);
    __decorate([
        ModRegistry_1.default.action("Kill", defaultDescription)
    ], Actions.prototype, "kill", null);
    __decorate([
        ModRegistry_1.default.action("Clone", defaultDescription)
    ], Actions.prototype, "clone", null);
    __decorate([
        ModRegistry_1.default.action("SetTime", defaultDescription)
    ], Actions.prototype, "setTime", null);
    __decorate([
        ModRegistry_1.default.action("Heal", defaultDescription)
    ], Actions.prototype, "heal", null);
    __decorate([
        ModRegistry_1.default.action("SetStat", defaultDescription)
    ], Actions.prototype, "setStat", null);
    __decorate([
        ModRegistry_1.default.action("SetTamed", defaultDescription)
    ], Actions.prototype, "setTamed", null);
    __decorate([
        ModRegistry_1.default.action("Remove", defaultDescription)
    ], Actions.prototype, "remove", null);
    __decorate([
        ModRegistry_1.default.action("SetWeightBonus", defaultDescription)
    ], Actions.prototype, "setWeightBonus", null);
    __decorate([
        ModRegistry_1.default.action("ChangeTerrain", defaultDescription)
    ], Actions.prototype, "changeTerrain", null);
    __decorate([
        ModRegistry_1.default.action("ToggleTilled", defaultDescription)
    ], Actions.prototype, "toggleTilled", null);
    __decorate([
        ModRegistry_1.default.action("UpdateStatsAndAttributes", defaultDescription)
    ], Actions.prototype, "updateStatsAndAttributes", null);
    __decorate([
        ModRegistry_1.default.action("AddItemToInventory", defaultDescription)
    ], Actions.prototype, "addItemToInventory", null);
    __decorate([
        ModRegistry_1.default.action("Paint", defaultDescription)
    ], Actions.prototype, "paint", null);
    __decorate([
        ModRegistry_1.default.action("UnlockRecipes", defaultDescription)
    ], Actions.prototype, "unlockRecipes", null);
    __decorate([
        ModRegistry_1.default.action("ToggleInvulnerable", defaultDescription)
    ], Actions.prototype, "toggleInvulnerable", null);
    __decorate([
        ModRegistry_1.default.action("SetSkill", defaultDescription)
    ], Actions.prototype, "setSkill", null);
    __decorate([
        ModRegistry_1.default.action("ToggleNoclip", defaultDescription)
    ], Actions.prototype, "toggleNoclip", null);
    __decorate([
        ModRegistry_1.default.action("TogglePermissions", defaultDescription)
    ], Actions.prototype, "togglePermissions", null);
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], Actions, "debugTools", void 0);
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], Actions, "log", void 0);
    exports.default = Actions;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQW1DQSxJQUFZLFdBR1g7SUFIRCxXQUFZLFdBQVc7UUFDdEIsaURBQU0sQ0FBQTtRQUNOLHVEQUFTLENBQUE7SUFDVixDQUFDLEVBSFcsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFHdEI7SUFFRCxNQUFNLGtCQUFrQixHQUFnQixFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDO0lBS3BJLE1BQXFCLE9BQU87UUErQjNCLFlBQW9DLEdBQWU7WUFBZixRQUFHLEdBQUgsR0FBRyxDQUFZO1FBQUksQ0FBQztRQXJCakQsTUFBTSxDQUFDLEdBQUcsQ0FBZ0QsSUFBTztZQUN2RSxPQUFPO2dCQUNOLE9BQU8sRUFBRSxDQUFDLFFBQXlCLEVBQUUsRUFBRTtvQkFDdEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzdDLElBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxFQUFFO3dCQUNqQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksYUFBYSxDQUFDLENBQUM7d0JBQzVDLE9BQU87cUJBQ1A7b0JBRUQsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsc0JBQVEsQ0FBQyxFQUFFLENBQUMsTUFBd0IsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNyRixDQUFDO2FBQ00sQ0FBQztRQUNWLENBQUM7UUFnQk0sYUFBYSxDQUFDLFFBQWlCLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxFQUF5RCxFQUFFLE1BQXFCO1lBQ3ZKLDZCQUFh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
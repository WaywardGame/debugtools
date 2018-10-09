var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IEntity", "entity/IStats", "Enums", "item/Items", "mapgen/MapGenHelpers", "mod/Mod", "mod/ModRegistry", "newui/component/Text", "newui/screen/IScreen", "player/MessageManager", "tile/Terrains", "utilities/enum/Enums", "utilities/math/Vector2", "utilities/math/Vector3", "utilities/TileHelpers", "./IDebugTools", "./ui/InspectDialog", "./ui/panel/SelectionPanel", "./util/TilePosition"], function (require, exports, IEntity_1, IStats_1, Enums_1, Items_1, MapGenHelpers_1, Mod_1, ModRegistry_1, Text_1, IScreen_1, MessageManager_1, Terrains_1, Enums_2, Vector2_1, Vector3_1, TileHelpers_1, IDebugTools_1, InspectDialog_1, SelectionPanel_1, TilePosition_1) {
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
                    const action = this.DEBUG_TOOLS.actions[name];
                    if (typeof action !== "function") {
                        this.LOG.error(`Action ${name} is invalid`);
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
            if (!multiplayer.isConnected() && entity === localPlayer) {
                result.passTurn = true;
            }
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
            Actions.DEBUG_TOOLS.updateFog();
            newui.getScreen(IScreen_1.ScreenId.Game).onGameTickEnd();
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
            Actions.DEBUG_TOOLS.setPlayerData(player, "invulnerable", invulnerable);
        }
        setSkill(executor, { player, object: [skill, value] }, result) {
            if (!player)
                return;
            player.setSkillCore(skill, value);
        }
        toggleNoclip(executor, { player, object: noclip }, result) {
            if (!player)
                return;
            Actions.DEBUG_TOOLS.setPlayerData(player, "noclip", noclip ? {
                moving: false,
                delay: Enums_1.Delay.Movement,
            } : false);
            player.moveType = noclip ? Enums_1.MoveType.Flying : Enums_1.MoveType.Land;
            game.updateView(true);
        }
        togglePermissions(executor, { player, object: permissions }, result) {
            if (!player)
                return;
            Actions.DEBUG_TOOLS.setPlayerData(player, "permissions", permissions);
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
                player.messages.source(Actions.DEBUG_TOOLS.source)
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
                clone.renamed = entity.getName().getString();
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
    ], Actions, "DEBUG_TOOLS", void 0);
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], Actions, "LOG", void 0);
    exports.default = Actions;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXFDQSxJQUFZLFdBR1g7SUFIRCxXQUFZLFdBQVc7UUFDdEIsaURBQU0sQ0FBQTtRQUNOLHVEQUFTLENBQUE7SUFDVixDQUFDLEVBSFcsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFHdEI7SUFFRCxNQUFNLGtCQUFrQixHQUFnQixFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDO0lBS3BJLE1BQXFCLE9BQU87UUErQjNCLFlBQW9DLEdBQWU7WUFBZixRQUFHLEdBQUgsR0FBRyxDQUFZO1FBQUksQ0FBQztRQXJCakQsTUFBTSxDQUFDLEdBQUcsQ0FBZ0QsSUFBTztZQUN2RSxPQUFPO2dCQUNOLE9BQU8sRUFBRSxDQUFDLFFBQXlCLEVBQUUsRUFBRTtvQkFDdEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzlDLElBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxFQUFFO3dCQUNqQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksYUFBYSxDQUFDLENBQUM7d0JBQzVDLE9BQU87cUJBQ1A7b0JBRUQsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsc0JBQVEsQ0FBQyxFQUFFLENBQUMsTUFBd0IsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNyRixDQUFDO2FBQ00sQ0FBQztRQUNWLENBQUM7UUFnQk0sYUFBYSxDQUFDLFFBQWlCLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxFQUF5RCxFQUFFLE1BQXFCO1lBQ3ZKLDZCQUFh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
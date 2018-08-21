var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IEntity", "entity/IStats", "Enums", "item/Items", "language/IMessages", "mapgen/MapGenHelpers", "mod/ModRegistry", "newui/component/Text", "tile/Terrains", "utilities/enum/Enums", "utilities/math/Vector2", "utilities/math/Vector3", "utilities/TileHelpers", "./DebugTools", "./IDebugTools", "./util/TilePosition"], function (require, exports, IEntity_1, IStats_1, Enums_1, Items_1, IMessages_1, MapGenHelpers_1, ModRegistry_1, Text_1, Terrains_1, Enums_2, Vector2_1, Vector3_1, TileHelpers_1, DebugTools_1, IDebugTools_1, TilePosition_1) {
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
            const action = DebugTools_1.default.INSTANCE.actions[name];
            if (typeof action !== "function") {
                return undefined;
            }
            return ModRegistry_1.Registry.id(action);
        }
        select(player, argument, result) {
            const selectAction = argument.object;
            const { x, y, z } = player.getFacingPoint();
            switch (selectAction.type) {
                case "change-tile":
                    game.changeTile({ type: selectAction.id }, x, y, z, false);
                    break;
                case "spawn-creature":
                    creatureManager.spawn(selectAction.id, x, y, z, true);
                    break;
                case "spawn-npc":
                    npcManager.spawn(selectAction.id, x, y, z);
                    break;
                case "item-get":
                    player.createItemInInventory(selectAction.id);
                    player.updateTablesAndWeight();
                    break;
                case "place-env-item":
                    const tile = game.getTile(x, y, z);
                    if (tile.doodad) {
                        doodadManager.remove(tile.doodad);
                    }
                    doodadManager.create(selectAction.id, x, y, z);
                    break;
                case "place-tile-event":
                    tileEventManager.create(selectAction.id, x, y, z);
                    break;
                case "place-corpse":
                    corpseManager.create(selectAction.id, x, y, z);
                    break;
                case "spawn-template":
                    MapGenHelpers_1.spawnTemplate(selectAction.id, x, y, z);
                    break;
            }
            player.updateStatsAndAttributes();
            result.updateView = true;
        }
        teleport(player, { object: xyz, creature, npc }, result) {
            const entity = creature || npc || player;
            let position = new Vector3_1.default(xyz);
            if (!TileHelpers_1.default.isOpenTile(position, game.getTile(...new Vector3_1.default(position).xyz))) {
                position = TileHelpers_1.default.findMatchingTile(position, TileHelpers_1.default.isOpenTile);
            }
            if (entity.entityType === IEntity_1.EntityType.Creature) {
                const tile = game.getTile(entity.x, entity.y, entity.z);
                delete tile.creature;
            }
            if (entity.entityType === IEntity_1.EntityType.NPC) {
                const tile = game.getTile(entity.x, entity.y, entity.z);
                delete tile.npc;
            }
            entity.x = entity.fromX = position.x;
            entity.y = entity.fromY = position.y;
            entity.z = position.z;
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
        removeAllCreatures(player, argument, result) {
            for (let i = 0; i < game.creatures.length; i++) {
                if (game.creatures[i] !== undefined) {
                    creatureManager.remove(game.creatures[i]);
                }
            }
            game.creatures = [];
            game.updateView(false);
        }
        removeAllNPCs(player, argument, result) {
            for (let i = 0; i < game.npcs.length; i++) {
                if (game.npcs[i] !== undefined) {
                    npcManager.remove(game.npcs[i]);
                }
            }
            game.npcs = [];
            game.updateView(false);
        }
        updateStatsAndAttributes(player, argument, result) {
            player.updateStatsAndAttributes();
        }
        toggleSpectating(player, { object: [isSpectating, playerState] }, result) {
            if (isSpectating) {
                player.state = Enums_1.PlayerState.Ghost;
            }
            else {
                player.state = playerState;
            }
        }
        kill(player, { creature, npc }, result) {
            const entity = creature || npc || player;
            entity.damage({
                type: Enums_1.DamageType.True,
                amount: Infinity,
                damageMessage: DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.KillEntityDeathMessage).getString(),
            });
            renderer.computeSpritesInViewport();
            result.updateRender = true;
        }
        clone(player, { creature, npc, point }, result) {
            const entity = creature || npc || player;
            let clone;
            const pos = this.getPosition(new Vector3_1.default(point.x, point.y, entity.z), () => DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionClone)
                .get(game.getName(entity)));
            if (!pos)
                return;
            if (entity.entityType === IEntity_1.EntityType.Creature) {
                clone = creatureManager.spawn(entity.type, pos.x, pos.y, pos.z, true, entity.aberrant);
                if (entity.isTamed())
                    clone.tame(entity.getOwner());
                clone.renamed = entity.renamed;
                clone.ai = entity.ai;
                clone.enemy = entity.enemy;
                clone.enemyAttempts = entity.enemyAttempts;
                clone.enemyIsPlayer = entity.enemyIsPlayer;
            }
            else {
                clone = npcManager.spawn(Enums_1.NPCType.Merchant, point.x, point.y, entity.z);
                clone.customization = Object.assign({}, entity.customization);
                clone.renamed = entity.getName();
                this.cloneInventory(entity, clone);
            }
            clone.direction = new Vector2_1.default(entity.direction);
            clone.facingDirection = entity.facingDirection;
            this.copyStats(entity, clone);
            if (clone.entityType === IEntity_1.EntityType.NPC) {
                clone.ai = IEntity_1.AiType.Neutral;
            }
            renderer.computeSpritesInViewport();
            result.updateRender = true;
        }
        setTime(player, argument, result) {
            game.time.setTime(argument.object);
            game.updateRender = true;
            fieldOfView.compute();
        }
        heal(player, { creature, npc, object: corpseId }, result) {
            const entity = creature || npc || game.corpses[corpseId] || player;
            if (!("entityType" in entity)) {
                result.updateRender = this.resurrectCorpse(entity);
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
        setStat(player, { object: [stat, value], creature, npc }, result) {
            (creature || npc || player).setStat(stat, value);
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
        setWeightBonus(player, { object: weightBonus }, result) {
            this.mod.setPlayerData(player, "weightBonus", weightBonus);
            player.updateStrength();
            game.updateTablesAndWeight();
        }
        changeTerrain(player, { object: terrain, point }, result) {
            game.changeTile(terrain, point.x, point.y, player.z, false);
            this.setTilled(point.x, point.y, player.z, false);
            renderer.computeSpritesInViewport();
            result.updateRender = true;
        }
        toggleTilled(player, { object: tilled, point }, result) {
            this.setTilled(point.x, point.y, player.z, tilled);
            renderer.computeSpritesInViewport();
            result.updateRender = true;
        }
        addItemToInventory(human, { object: [item, quality] }, result) {
            human.createItemInInventory(item, quality);
            game.updateTablesAndWeight();
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
        toggleInvulnerable(player, { object: invulnerable }, result) {
            DebugTools_1.default.INSTANCE.setPlayerData(player, "invulnerable", invulnerable);
        }
        setSkill(player, { object: [skill, value] }, result) {
            player.skills[skill].core = value;
            player.skills[skill].percent = player.skills[skill].bonus + value;
        }
        toggleNoclip(player, { object: noclip }, result) {
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
        resurrectCorpse(corpse) {
            if (corpse.type === Enums_1.CreatureType.Blood || corpse.type === Enums_1.CreatureType.WaterBlood) {
                return false;
            }
            const location = this.getPosition(new Vector3_1.default(corpse), () => DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionResurrect)
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
        getPosition(position, actionName) {
            if (TileHelpers_1.default.isOpenTile(position, game.getTile(...position.xyz)))
                return position;
            const openTile = TileHelpers_1.default.findMatchingTile(position, TileHelpers_1.default.isOpenTile);
            if (!openTile) {
                localPlayer.messages.source(DebugTools_1.default.INSTANCE.source)
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
                const clone = itemManager.create(item.type, to.inventory, item.quality);
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
        ModRegistry_1.default.action(description("Select"))
    ], Actions.prototype, "select", null);
    __decorate([
        ModRegistry_1.default.action(description("Teleport Entity"))
    ], Actions.prototype, "teleport", null);
    __decorate([
        ModRegistry_1.default.action(description("Remove All Creatures"))
    ], Actions.prototype, "removeAllCreatures", null);
    __decorate([
        ModRegistry_1.default.action(description("Remove All NPCs"))
    ], Actions.prototype, "removeAllNPCs", null);
    __decorate([
        ModRegistry_1.default.action(description("Update Stats and Attributes"))
    ], Actions.prototype, "updateStatsAndAttributes", null);
    __decorate([
        ModRegistry_1.default.action(description("Toggle Spectating"))
    ], Actions.prototype, "toggleSpectating", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTJCQSxJQUFZLFdBRVg7SUFGRCxXQUFZLFdBQVc7UUFDdEIsaURBQU0sQ0FBQTtJQUNQLENBQUMsRUFGVyxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQUV0QjtJQUVELFNBQVMsV0FBVyxDQUFDLElBQVk7UUFDaEMsT0FBTyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDcEYsQ0FBQztJQUVELE1BQXFCLE9BQU87UUFjM0IsWUFBb0MsR0FBZTtZQUFmLFFBQUcsR0FBSCxHQUFHLENBQVk7UUFBSSxDQUFDO1FBWmpELE1BQU0sQ0FBQyxHQUFHLENBQTBCLElBQU87WUFDakQsTUFBTSxNQUFNLEdBQUcsb0JBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pELElBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxFQUFFO2dCQUNqQyxPQUFPLFNBQWdCLENBQUM7YUFDeEI7WUFFRCxPQUFPLHNCQUFRLENBQUMsRUFBRSxDQUFDLE1BQXdCLENBQVEsQ0FBQztRQUNyRCxDQUFDO1FBUU0sTUFBTSxDQUFDLE1BQWUsRUFBRSxRQUE4QixFQUFFLE1BQXFCO1lBQ25GLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxNQUc3QixDQUFDO1lBRUYsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBRTVDLFFBQVEsWUFBWSxDQUFDLElBQUksRUFBRTtnQkFDMUIsS0FBSyxhQUFhO29CQUNqQixJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQyxFQUFFLEVBQUUsRUFB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
define(["require", "exports", "mapgen/MapGenHelpers"], function (require, exports, MapGenHelpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(player, argument, result) {
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
    exports.default = default_1;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbi9TZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBU0EsbUJBQXlCLE1BQWUsRUFBRSxRQUF5QixFQUFFLE1BQXFCO1FBQ3pGLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxNQUFzQixDQUFDO1FBRXJELE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUU1QyxRQUFRLFlBQVksQ0FBQyxJQUFJLEVBQUU7WUFDMUIsS0FBSyxhQUFhO2dCQUNqQixJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDM0QsTUFBTTtZQUVQLEtBQUssZ0JBQWdCO2dCQUNwQixlQUFlLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3RELE1BQU07WUFFUCxLQUFLLFdBQVc7Z0JBQ2YsVUFBVSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLE1BQU07WUFFUCxLQUFLLFVBQVU7Z0JBQ2QsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUM7Z0JBQy9CLE1BQU07WUFFUCxLQUFLLGdCQUFnQjtnQkFFcEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ2hCLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUNsQztnQkFFRCxhQUFhLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDL0MsTUFBTTtZQUVQLEtBQUssa0JBQWtCO2dCQUN0QixnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxNQUFNO1lBRVAsS0FBSyxjQUFjO2dCQUNsQixhQUFhLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDL0MsTUFBTTtZQUVQLEtBQUssZ0JBQWdCO2dCQUNwQiw2QkFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDeEMsTUFBTTtTQUNQO1FBRUQsTUFBTSxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFFbEMsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQWpERCw0QkFpREM7SUFBQSxDQUFDIn0=
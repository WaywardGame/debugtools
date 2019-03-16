define(["require", "exports", "entity/action/Action", "entity/IEntity", "item/IItem", "item/Items", "utilities/enum/Enums", "../Actions"], function (require, exports, Action_1, IEntity_1, IItem_1, Items_1, Enums_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Action_1.Action()
        .setUsableBy(IEntity_1.EntityType.Player)
        .setUsableWhen(...Actions_1.defaultUsability)
        .setHandler(action => {
        const itemTypes = Enums_1.default.values(IItem_1.ItemType);
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
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5sb2NrUmVjaXBlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb24vVW5sb2NrUmVjaXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFPQSxrQkFBZSxJQUFJLGVBQU0sRUFBRTtTQUN6QixXQUFXLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUM7U0FDOUIsYUFBYSxDQUFDLEdBQUcsMEJBQWdCLENBQUM7U0FDbEMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3BCLE1BQU0sU0FBUyxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQVEsQ0FBQyxDQUFDO1FBRXpDLEtBQUssTUFBTSxRQUFRLElBQUksU0FBUyxFQUFFO1lBQ2pDLE1BQU0sSUFBSSxHQUFHLGVBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQy9FLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUc7b0JBQ3hCLFNBQVMsRUFBRSxJQUFJO29CQUNmLFVBQVUsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2lCQUN0QixDQUFDO2FBQ0Y7U0FDRDtRQUVELElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQzlCLENBQUMsQ0FBQyxDQUFDIn0=
define(["require", "exports", "./CloneContainedItems"], function (require, exports, CloneContainedItems_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(doodad, position) {
        const clone = doodadManager.create(doodad.type, position.x, position.y, position.z, {
            stillContainer: doodad.stillContainer,
            gatherReady: doodad.gatherReady,
            gfx: doodad.gfx,
            spread: doodad.spread,
            treasure: doodad.treasure,
            weight: doodad.weight,
            legendary: doodad.legendary ? { ...doodad.legendary } : undefined,
            disassembly: !doodad.disassembly ? undefined : doodad.disassembly
                .map(item => itemManager.createFake(item.type, item.quality)),
            ownerIdentifier: doodad.ownerIdentifier,
            step: doodad.step,
        });
        if (!clone)
            return;
        if (doodad.containedItems) {
            CloneContainedItems_1.default(doodad, clone);
        }
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVEb29kYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVEb29kYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBUUEsbUJBQXlCLE1BQWMsRUFBRSxRQUFrQjtRQUMxRCxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7WUFDbkYsY0FBYyxFQUFFLE1BQU0sQ0FBQyxjQUFjO1lBQ3JDLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVztZQUMvQixHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7WUFDZixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07WUFDckIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO1lBQ3pCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtZQUNyQixTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUNqRSxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXO2lCQUMvRCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlELGVBQWUsRUFBRSxNQUFNLENBQUMsZUFBZTtZQUN2QyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7U0FDakIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEtBQUs7WUFBRSxPQUFPO1FBRW5CLElBQUksTUFBTSxDQUFDLGNBQWMsRUFBRTtZQUMxQiw2QkFBbUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbkM7SUFDRixDQUFDO0lBcEJELDRCQW9CQyJ9
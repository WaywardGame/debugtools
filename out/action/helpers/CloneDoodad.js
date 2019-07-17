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
            legendary: doodad.legendary ? Object.assign({}, doodad.legendary) : undefined,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVEb29kYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVEb29kYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBUUEsbUJBQXlCLE1BQWMsRUFBRSxRQUFrQjtRQUMxRCxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7WUFDbkYsY0FBYyxFQUFFLE1BQU0sQ0FBQyxjQUFjO1lBQ3JDLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVztZQUMvQixHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7WUFDZixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07WUFDckIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO1lBQ3pCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtZQUNyQixTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLG1CQUFNLE1BQU0sQ0FBQyxTQUFTLEVBQUcsQ0FBQyxDQUFDLFNBQVM7WUFDakUsV0FBVyxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVztpQkFDL0QsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM5RCxlQUFlLEVBQUUsTUFBTSxDQUFDLGVBQWU7WUFDdkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1NBQ2pCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTztRQUVuQixJQUFJLE1BQU0sQ0FBQyxjQUFjLEVBQUU7WUFDMUIsNkJBQW1CLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ25DO0lBQ0YsQ0FBQztJQXBCRCw0QkFvQkMifQ==
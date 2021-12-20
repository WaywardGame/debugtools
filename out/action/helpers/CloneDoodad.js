define(["require", "exports", "./CloneContainedItems"], function (require, exports, CloneContainedItems_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(doodad, position) {
        const clone = doodad.island.doodads.create(doodad.type, position.x, position.y, position.z, {
            quality: doodad.quality,
            stillContainer: doodad.stillContainer,
            gatherReady: doodad.gatherReady,
            gfx: doodad.gfx,
            spread: doodad.spread,
            weight: doodad.weight,
            disassembly: !doodad.disassembly ? undefined : doodad.disassembly
                .map(item => doodad.island.items.createFake(item.type, item.quality)),
            ownerIdentifier: doodad.ownerIdentifier,
            step: doodad.step,
        });
        if (!clone)
            return;
        clone.magic.inherit(doodad.magic);
        if (doodad.containedItems) {
            (0, CloneContainedItems_1.default)(doodad.island, doodad, clone);
        }
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvbmVEb29kYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWN0aW9uL2hlbHBlcnMvQ2xvbmVEb29kYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBUUEsbUJBQXlCLE1BQWMsRUFBRSxRQUFrQjtRQUMxRCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtZQUMzRixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU87WUFDdkIsY0FBYyxFQUFFLE1BQU0sQ0FBQyxjQUFjO1lBQ3JDLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVztZQUMvQixHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7WUFDZixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07WUFDckIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO1lBQ3JCLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVc7aUJBQy9ELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0RSxlQUFlLEVBQUUsTUFBTSxDQUFDLGVBQWU7WUFDdkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1NBQ2pCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTztRQUVuQixLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbEMsSUFBSSxNQUFNLENBQUMsY0FBYyxFQUFFO1lBQzFCLElBQUEsNkJBQW1CLEVBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbEQ7SUFDRixDQUFDO0lBckJELDRCQXFCQyJ9
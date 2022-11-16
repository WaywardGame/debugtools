var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "utilities/Decorators", "../../IDebugTools", "../component/Container", "../component/InspectInformationSection"], function (require, exports, Mod_1, Decorators_1, IDebugTools_1, Container_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ItemInformation extends InspectInformationSection_1.default {
        getTabs() {
            return [
                [0, (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.TabItemStack)],
            ];
        }
        setTab() {
            Container_1.default.appendTo(this, this, this.getTile);
            return this;
        }
        update(position, tile) {
            this.position = position;
            Container_1.default.INSTANCE?.refreshItems();
            if (tile.containedItems?.length)
                this.setShouldLog();
        }
        logUpdate() {
            this.LOG.info("Items:", this.getTile()?.containedItems);
        }
        getTile() {
            return localIsland.items.getTileContainer(this.position.x, this.position.y, localPlayer.z);
        }
    }
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], ItemInformation.prototype, "LOG", void 0);
    __decorate([
        Decorators_1.Bound
    ], ItemInformation.prototype, "getTile", null);
    exports.default = ItemInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L0l0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBVUEsTUFBcUIsZUFBZ0IsU0FBUSxtQ0FBeUI7UUFPckQsT0FBTztZQUN0QixPQUFPO2dCQUNOLENBQUMsQ0FBQyxFQUFFLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNwRCxDQUFDO1FBQ0gsQ0FBQztRQUVlLE1BQU07WUFDckIsbUJBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0MsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRWUsTUFBTSxDQUFDLFFBQWtCLEVBQUUsSUFBVztZQUNyRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUN6QixtQkFBUyxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsQ0FBQztZQUNuQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsTUFBTTtnQkFDOUIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7UUFFZSxTQUFTO1lBQ3hCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUVjLE9BQU87WUFDckIsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RixDQUFDO0tBQ0Q7SUE3QkE7UUFEQyxhQUFHLENBQUMsR0FBRyxDQUFDLDRCQUFjLENBQUM7Z0RBQ0M7SUEwQmxCO1FBQU4sa0JBQUs7a0RBRUw7SUEvQkYsa0NBZ0NDIn0=
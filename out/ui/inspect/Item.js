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
        update(tile) {
            this.tile = tile;
            Container_1.default.INSTANCE?.refreshItems();
            if (tile.containedItems?.length) {
                this.setShouldLog();
            }
        }
        logUpdate() {
            this.LOG.info("Items:", this.tile?.containedItems);
        }
        getTile() {
            return this.tile.tileContainer;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L0l0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBU0EsTUFBcUIsZUFBZ0IsU0FBUSxtQ0FBeUI7UUFPckQsT0FBTztZQUN0QixPQUFPO2dCQUNOLENBQUMsQ0FBQyxFQUFFLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNwRCxDQUFDO1FBQ0gsQ0FBQztRQUVlLE1BQU07WUFDckIsbUJBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0MsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRWUsTUFBTSxDQUFDLElBQVU7WUFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsbUJBQVMsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLENBQUM7WUFDbkMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLE1BQU0sRUFBRTtnQkFDaEMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2FBQ3BCO1FBQ0YsQ0FBQztRQUVlLFNBQVM7WUFDeEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUVjLE9BQU87WUFFckIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUNoQyxDQUFDO0tBQ0Q7SUEvQmdCO1FBRGYsYUFBRyxDQUFDLEdBQUcsQ0FBQyw0QkFBYyxDQUFDO2dEQUNDO0lBMkJWO1FBQWQsa0JBQUs7a0RBR0w7SUFqQ0Ysa0NBa0NDIn0=
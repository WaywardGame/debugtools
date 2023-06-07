/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
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
    exports.default = ItemInformation;
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], ItemInformation.prototype, "LOG", void 0);
    __decorate([
        Decorators_1.Bound
    ], ItemInformation.prototype, "getTile", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXRlbUluZm9ybWF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvSXRlbUluZm9ybWF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7Ozs7OztJQVdILE1BQXFCLGVBQWdCLFNBQVEsbUNBQXlCO1FBT3JELE9BQU87WUFDdEIsT0FBTztnQkFDTixDQUFDLENBQUMsRUFBRSxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDcEQsQ0FBQztRQUNILENBQUM7UUFFZSxNQUFNO1lBQ3JCLG1CQUFTLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUVlLE1BQU0sQ0FBQyxJQUFVO1lBQ2hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLG1CQUFTLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxDQUFDO1lBQ25DLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzthQUNwQjtRQUNGLENBQUM7UUFFZSxTQUFTO1lBQ3hCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFFYyxPQUFPO1lBRXJCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDaEMsQ0FBQztLQUNEO0lBbENELGtDQWtDQztJQS9CZ0I7UUFEZixhQUFHLENBQUMsR0FBRyxDQUFDLDRCQUFjLENBQUM7Z0RBQ0M7SUEyQlY7UUFBZCxrQkFBSztrREFHTCJ9
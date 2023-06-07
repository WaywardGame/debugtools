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
define(["require", "exports", "language/Dictionary", "language/ITranslation", "language/Translation", "mod/Mod", "ui/component/Button", "utilities/Decorators", "utilities/collection/Tuple", "../../IDebugTools", "../../action/Remove", "../../util/Array", "../component/InspectInformationSection"], function (require, exports, Dictionary_1, ITranslation_1, Translation_1, Mod_1, Button_1, Decorators_1, Tuple_1, IDebugTools_1, Remove_1, Array_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TileEventInformation extends InspectInformationSection_1.default {
        constructor() {
            super();
            this.tileEvents = [];
            new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionRemove))
                .event.subscribe("activate", this.removeTileEvent)
                .appendTo(this);
        }
        getTabs() {
            return this.tileEvents.entries().stream()
                .map(([i, tileEvent]) => (0, Tuple_1.Tuple)(i, () => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.TileEventName)
                .get(Translation_1.default.nameOf(Dictionary_1.default.TileEvent, tileEvent, Translation_1.Article.None).inContext(ITranslation_1.TextContext.Title))))
                .toArray();
        }
        setTab(tileEvent) {
            this.tileEvent = this.tileEvents[tileEvent];
            return this;
        }
        update(tile) {
            const tileEvents = [...tile.events || []];
            if ((0, Array_1.areArraysIdentical)(tileEvents, this.tileEvents))
                return;
            this.tileEvents = tileEvents;
            this.setShouldLog();
        }
        logUpdate() {
            for (const tileEvent of this.tileEvents) {
                this.LOG.info("Tile Event:", tileEvent);
            }
        }
        removeTileEvent() {
            Remove_1.default.execute(localPlayer, this.tileEvent);
        }
    }
    exports.default = TileEventInformation;
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], TileEventInformation.prototype, "LOG", void 0);
    __decorate([
        Decorators_1.Bound
    ], TileEventInformation.prototype, "removeTileEvent", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZUV2ZW50SW5mb3JtYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9UaWxlRXZlbnRJbmZvcm1hdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUFrQkgsTUFBcUIsb0JBQXFCLFNBQVEsbUNBQXlCO1FBUzFFO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFMRCxlQUFVLEdBQWdCLEVBQUUsQ0FBQztZQU9wQyxJQUFJLGdCQUFNLEVBQUU7aUJBQ1YsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDeEQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQztpQkFDakQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFZSxPQUFPO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUU7aUJBQ3ZDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFBLGFBQUssRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGFBQWEsQ0FBQztpQkFDdEYsR0FBRyxDQUFDLHFCQUFXLENBQUMsTUFBTSxDQUFDLG9CQUFVLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxxQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdEcsT0FBTyxFQUFFLENBQUM7UUFDYixDQUFDO1FBRWUsTUFBTSxDQUFDLFNBQWlCO1lBQ3ZDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QyxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFFZSxNQUFNLENBQUMsSUFBVTtZQUNoQyxNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQztZQUUxQyxJQUFJLElBQUEsMEJBQWtCLEVBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQUUsT0FBTztZQUM1RCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUU3QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDckIsQ0FBQztRQUVlLFNBQVM7WUFDeEIsS0FBSyxNQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDeEM7UUFDRixDQUFDO1FBR08sZUFBZTtZQUN0QixnQkFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVUsQ0FBQyxDQUFDO1FBQzlDLENBQUM7S0FDRDtJQWpERCx1Q0FpREM7SUE5Q2dCO1FBRGYsYUFBRyxDQUFDLEdBQUcsQ0FBQyw0QkFBYyxDQUFDO3FEQUNDO0lBMkNqQjtRQURQLGtCQUFLOytEQUdMIn0=
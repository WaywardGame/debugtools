var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "language/Dictionary", "language/ITranslation", "language/Translation", "mod/Mod", "ui/component/Button", "utilities/collection/Arrays", "utilities/Decorators", "../../action/Remove", "../../IDebugTools", "../../util/Array", "../component/InspectInformationSection"], function (require, exports, Dictionary_1, ITranslation_1, Translation_1, Mod_1, Button_1, Arrays_1, Decorators_1, Remove_1, IDebugTools_1, Array_1, InspectInformationSection_1) {
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
                .map(([i, tileEvent]) => (0, Arrays_1.Tuple)(i, () => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.TileEventName)
                .get(Translation_1.default.nameOf(Dictionary_1.default.TileEvent, tileEvent, false).inContext(ITranslation_1.TextContext.Title))))
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
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], TileEventInformation.prototype, "LOG", void 0);
    __decorate([
        Decorators_1.Bound
    ], TileEventInformation.prototype, "removeTileEvent", null);
    exports.default = TileEventInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZUV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvVGlsZUV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWdCQSxNQUFxQixvQkFBcUIsU0FBUSxtQ0FBeUI7UUFTMUU7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUxELGVBQVUsR0FBZ0IsRUFBRSxDQUFDO1lBT3BDLElBQUksZ0JBQU0sRUFBRTtpQkFDVixPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUN4RCxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDO2lCQUNqRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQztRQUVlLE9BQU87WUFDdEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRTtpQkFDdkMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUEsY0FBSyxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsYUFBYSxDQUFDO2lCQUN0RixHQUFHLENBQUMscUJBQVcsQ0FBQyxNQUFNLENBQUMsb0JBQVUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDL0YsT0FBTyxFQUFFLENBQUM7UUFDYixDQUFDO1FBRWUsTUFBTSxDQUFDLFNBQWlCO1lBQ3ZDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QyxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFFZSxNQUFNLENBQUMsSUFBVTtZQUNoQyxNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQztZQUUxQyxJQUFJLElBQUEsMEJBQWtCLEVBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQUUsT0FBTztZQUM1RCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUU3QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDckIsQ0FBQztRQUVlLFNBQVM7WUFDeEIsS0FBSyxNQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDeEM7UUFDRixDQUFDO1FBR08sZUFBZTtZQUN0QixnQkFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVUsQ0FBQyxDQUFDO1FBQzlDLENBQUM7S0FDRDtJQTlDZ0I7UUFEZixhQUFHLENBQUMsR0FBRyxDQUFDLDRCQUFjLENBQUM7cURBQ0M7SUEyQ2pCO1FBRFAsa0JBQUs7K0RBR0w7SUFoREYsdUNBaURDIn0=
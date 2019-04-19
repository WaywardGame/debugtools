var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "language/Dictionaries", "language/Translation", "mod/Mod", "newui/component/Button", "utilities/Arrays", "../../action/Remove", "../../IDebugTools", "../../util/Array", "../component/InspectInformationSection"], function (require, exports, ActionExecutor_1, Dictionaries_1, Translation_1, Mod_1, Button_1, Arrays_1, Remove_1, IDebugTools_1, Array_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TileEventInformation extends InspectInformationSection_1.default {
        constructor() {
            super();
            this.tileEvents = [];
            new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))
                .event.subscribe("activate", this.removeTileEvent)
                .appendTo(this);
        }
        getTabs() {
            return this.tileEvents.entries().stream()
                .map(([i, tileEvent]) => Arrays_1.tuple(i, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TileEventName)
                .get(Translation_1.default.nameOf(Dictionaries_1.Dictionary.TileEvent, tileEvent, false).inContext(3))))
                .toArray();
        }
        setTab(tileEvent) {
            this.tileEvent = this.tileEvents[tileEvent];
            return this;
        }
        update(position, tile) {
            const tileEvents = [...tile.events || []];
            if (Array_1.areArraysIdentical(tileEvents, this.tileEvents))
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
            ActionExecutor_1.default.get(Remove_1.default).execute(localPlayer, this.tileEvent);
        }
    }
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], TileEventInformation.prototype, "LOG", void 0);
    __decorate([
        Override
    ], TileEventInformation.prototype, "getTabs", null);
    __decorate([
        Override
    ], TileEventInformation.prototype, "setTab", null);
    __decorate([
        Override
    ], TileEventInformation.prototype, "update", null);
    __decorate([
        Override
    ], TileEventInformation.prototype, "logUpdate", null);
    __decorate([
        Bound
    ], TileEventInformation.prototype, "removeTileEvent", null);
    exports.default = TileEventInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZUV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvVGlsZUV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWdCQSxNQUFxQixvQkFBcUIsU0FBUSxtQ0FBeUI7UUFTMUU7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUxELGVBQVUsR0FBaUIsRUFBRSxDQUFDO1lBT3JDLElBQUksZ0JBQU0sRUFBRTtpQkFDVixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDeEQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQztpQkFDakQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFZ0IsT0FBTztZQUN2QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFO2lCQUN2QyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGFBQWEsQ0FBQztpQkFDdEYsR0FBRyxDQUFDLHFCQUFXLENBQUMsTUFBTSxDQUFDLHlCQUFVLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQW1CLENBQUMsQ0FBQyxDQUFDO2lCQUMvRixPQUFPLEVBQUUsQ0FBQztRQUNiLENBQUM7UUFFZ0IsTUFBTSxDQUFDLFNBQWlCO1lBQ3hDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QyxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFFZ0IsTUFBTSxDQUFDLFFBQWtCLEVBQUUsSUFBVztZQUN0RCxNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQztZQUUxQyxJQUFJLDBCQUFrQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUFFLE9BQU87WUFDNUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFFN0IsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3JCLENBQUM7UUFFZ0IsU0FBUztZQUN6QixLQUFLLE1BQU0sU0FBUyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUN4QztRQUNGLENBQUM7UUFHTyxlQUFlO1lBQ3RCLHdCQUFjLENBQUMsR0FBRyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFVLENBQUMsQ0FBQztRQUNsRSxDQUFDO0tBQ0Q7SUE5Q0E7UUFEQyxhQUFHLENBQUMsR0FBRyxDQUFDLDRCQUFjLENBQUM7cURBQ0M7SUFlZjtRQUFULFFBQVE7dURBS1I7SUFFUztRQUFULFFBQVE7c0RBR1I7SUFFUztRQUFULFFBQVE7c0RBT1I7SUFFUztRQUFULFFBQVE7eURBSVI7SUFHRDtRQURDLEtBQUs7K0RBR0w7SUFoREYsdUNBaURDIn0=
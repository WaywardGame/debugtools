var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "mod/Mod", "newui/component/Button", "tile/TileEvents", "utilities/Arrays", "utilities/Collectors", "utilities/Objects", "../../Actions", "../../IDebugTools", "../../util/Array", "../component/InspectInformationSection"], function (require, exports, Enums_1, Mod_1, Button_1, TileEvents_1, Arrays_1, Collectors_1, Objects_1, Actions_1, IDebugTools_1, Array_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TileEventInformation extends InspectInformationSection_1.default {
        constructor(gsapi) {
            super(gsapi);
            this.tileEvents = [];
            new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))
                .on(Button_1.ButtonEvent.Activate, this.removeTileEvent)
                .appendTo(this);
        }
        getTabs() {
            return this.tileEvents.entries()
                .map(([i, tileEvent]) => Arrays_1.tuple(i, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TileEventName)
                .get(game.getNameFromDescription(TileEvents_1.default[tileEvent.type], Enums_1.SentenceCaseStyle.Title, false))))
                .collect(Collectors_1.default.toArray);
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
            Actions_1.default.get("remove")
                .execute({ object: [Actions_1.RemovalType.TileEvent, this.tileEvent.id] });
        }
    }
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], TileEventInformation.prototype, "LOG", void 0);
    __decorate([
        Objects_1.Bound
    ], TileEventInformation.prototype, "removeTileEvent", null);
    exports.default = TileEventInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZUV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvVGlsZUV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWlCQSxNQUFxQixvQkFBcUIsU0FBUSxtQ0FBeUI7UUFTMUUsWUFBbUIsS0FBcUI7WUFDdkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBTE4sZUFBVSxHQUFpQixFQUFFLENBQUM7WUFPckMsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ2xCLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUN4RCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQztpQkFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFTSxPQUFPO1lBQ2IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRTtpQkFDOUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxhQUFhLENBQUM7aUJBQ3RGLEdBQUcsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsb0JBQXFCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBRSxFQUFFLHlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzNHLE9BQU8sQ0FBQyxvQkFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFTSxNQUFNLENBQUMsU0FBaUI7WUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVDLE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUVNLE1BQU0sQ0FBQyxRQUFrQixFQUFFLElBQVc7WUFDNUMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUM7WUFFMUMsSUFBSSwwQkFBa0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFBRSxPQUFPO1lBQzVELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1lBRTdCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNyQixDQUFDO1FBRU0sU0FBUztZQUNmLEtBQUssTUFBTSxTQUFTLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ3hDO1FBQ0YsQ0FBQztRQUdPLGVBQWU7WUFDdEIsaUJBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO2lCQUNuQixPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxxQkFBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwRSxDQUFDO0tBQ0Q7SUEvQ0E7UUFEQyxhQUFHLENBQUMsR0FBRyxDQUFDLDRCQUFjLENBQUM7cURBQ0M7SUEyQ3pCO1FBREMsZUFBSzsrREFJTDtJQWpERix1Q0FrREMifQ==
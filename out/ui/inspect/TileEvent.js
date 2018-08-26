define(["require", "exports", "Enums", "tile/TileEvents", "utilities/Arrays", "utilities/Collectors", "../../DebugTools", "../../IDebugTools", "../../util/Array", "../component/InspectInformationSection"], function (require, exports, Enums_1, TileEvents_1, Arrays_1, Collectors_1, DebugTools_1, IDebugTools_1, Array_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TileEventInformation extends InspectInformationSection_1.default {
        constructor(api) {
            super(api);
            this.tileEvents = [];
        }
        getTabs() {
            return this.tileEvents.entries()
                .map(([i, tileEvent]) => Arrays_1.tuple(i, () => DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TileEventName)
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
            return this;
        }
        logUpdate() {
            for (const tileEvent of this.tileEvents) {
                DebugTools_1.default.LOG.info("Tile Event:", tileEvent);
            }
        }
    }
    exports.default = TileEventInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZUV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvVGlsZUV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQWFBLE1BQXFCLG9CQUFxQixTQUFRLG1DQUF5QjtRQUsxRSxZQUFtQixHQUFVO1lBQzVCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUxKLGVBQVUsR0FBaUIsRUFBRSxDQUFDO1FBTXRDLENBQUM7UUFFTSxPQUFPO1lBQ2IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRTtpQkFDOUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxhQUFhLENBQUM7aUJBQ3RGLEdBQUcsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsb0JBQXFCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBRSxFQUFFLHlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzNHLE9BQU8sQ0FBQyxvQkFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFTSxNQUFNLENBQUMsU0FBaUI7WUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVDLE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUVNLE1BQU0sQ0FBQyxRQUFrQixFQUFFLElBQVc7WUFDNUMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUM7WUFFMUMsSUFBSSwwQkFBa0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFBRSxPQUFPO1lBQzVELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1lBRTdCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVwQixPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFFTSxTQUFTO1lBQ2YsS0FBSyxNQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUN4QyxvQkFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQzlDO1FBQ0YsQ0FBQztLQUNEO0lBckNELHVDQXFDQyJ9
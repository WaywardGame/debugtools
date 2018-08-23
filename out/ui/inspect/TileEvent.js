define(["require", "exports", "Enums", "tile/TileEvents", "utilities/Collectors", "../../DebugTools", "../../IDebugTools", "../component/InspectInformationSection"], function (require, exports, Enums_1, TileEvents_1, Collectors_1, DebugTools_1, IDebugTools_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TileEventInformation extends InspectInformationSection_1.default {
        constructor(api) {
            super(api);
            this.tileEvents = [];
        }
        getTabs() {
            return this.tileEvents.entries()
                .map(([i, tileEvent]) => [i, () => DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TileEventName)
                    .get(game.getNameFromDescription(TileEvents_1.default[tileEvent.type], Enums_1.SentenceCaseStyle.Title, false))])
                .collect(Collectors_1.default.toArray);
        }
        setTab(tileEvent) {
            this.tileEvent = this.tileEvents[tileEvent];
            return this;
        }
        update(position, tile) {
            this.tileEvents = tile.events || [];
            for (const tileEvent of this.tileEvents) {
                DebugTools_1.default.LOG.info("Tile Event:", tileEvent);
            }
            return this;
        }
    }
    exports.default = TileEventInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZUV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvVGlsZUV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQVdBLE1BQXFCLG9CQUFxQixTQUFRLG1DQUF5QjtRQUsxRSxZQUFtQixHQUFVO1lBQzVCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUxKLGVBQVUsR0FBaUIsRUFBRSxDQUFDO1FBTXRDLENBQUM7UUFFTSxPQUFPO1lBQ2IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRTtpQkFDOUIsR0FBRyxDQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLGFBQWEsQ0FBQztxQkFDakcsR0FBRyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxvQkFBcUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFFLEVBQUUseUJBQWlCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDM0csT0FBTyxDQUFDLG9CQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUVNLE1BQU0sQ0FBQyxTQUFpQjtZQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUMsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRU0sTUFBTSxDQUFDLFFBQWtCLEVBQUUsSUFBVztZQUM1QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1lBRXBDLEtBQUssTUFBTSxTQUFTLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDeEMsb0JBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUM5QztZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztLQUNEO0lBOUJELHVDQThCQyJ9
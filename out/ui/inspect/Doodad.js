define(["require", "exports", "Enums", "../../DebugTools", "../../IDebugTools", "../component/InspectInformationSection"], function (require, exports, Enums_1, DebugTools_1, IDebugTools_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DoodadInformation extends InspectInformationSection_1.default {
        constructor(api) {
            super(api);
        }
        getTabs() {
            return this.doodad ? [
                [0, () => DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.DoodadName)
                        .get(game.getName(this.doodad, Enums_1.SentenceCaseStyle.Title, false))],
            ] : [];
        }
        update(position, tile) {
            if (tile.doodad === this.doodad)
                return;
            this.doodad = tile.doodad;
            if (this.doodad) {
                DebugTools_1.default.LOG.info("Doodad:", this.doodad);
            }
            return this;
        }
    }
    exports.default = DoodadInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vZGFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRG9vZGFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQVNBLE1BQXFCLGlCQUFrQixTQUFRLG1DQUF5QjtRQUd2RSxZQUFtQixHQUFVO1lBQzVCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLENBQUM7UUFFTSxPQUFPO1lBQ2IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxVQUFVLENBQUM7eUJBQ3JELEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUseUJBQWlCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDakUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ1IsQ0FBQztRQUVNLE1BQU0sQ0FBQyxRQUFrQixFQUFFLElBQVc7WUFDNUMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNO2dCQUFFLE9BQU87WUFDeEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBRTFCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDaEIsb0JBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDNUM7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7S0FDRDtJQXhCRCxvQ0F3QkMifQ==
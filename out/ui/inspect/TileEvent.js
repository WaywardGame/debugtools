var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "language/Dictionaries", "language/Translation", "mod/Mod", "newui/component/Button", "utilities/Arrays", "../../action/Remove", "../../IDebugTools", "../../util/Array", "../component/InspectInformationSection"], function (require, exports, ActionExecutor_1, Dictionaries_1, Translation_1, Mod_1, Button_1, Arrays_1, Remove_1, IDebugTools_1, Array_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let TileEventInformation = (() => {
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
                    .map(([i, tileEvent]) => Arrays_1.Tuple(i, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.TileEventName)
                    .get(Translation_1.default.nameOf(Dictionaries_1.Dictionary.TileEvent, tileEvent, false).inContext(Translation_1.TextContext.Title))))
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
        return TileEventInformation;
    })();
    exports.default = TileEventInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZUV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvVGlsZUV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWdCQTtRQUFBLE1BQXFCLG9CQUFxQixTQUFRLG1DQUF5QjtZQVMxRTtnQkFDQyxLQUFLLEVBQUUsQ0FBQztnQkFMRCxlQUFVLEdBQWdCLEVBQUUsQ0FBQztnQkFPcEMsSUFBSSxnQkFBTSxFQUFFO3FCQUNWLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO3FCQUN4RCxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDO3FCQUNqRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsQ0FBQztZQUVnQixPQUFPO2dCQUN2QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFO3FCQUN2QyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGFBQWEsQ0FBQztxQkFDdEYsR0FBRyxDQUFDLHFCQUFXLENBQUMsTUFBTSxDQUFDLHlCQUFVLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMseUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQy9GLE9BQU8sRUFBRSxDQUFDO1lBQ2IsQ0FBQztZQUVnQixNQUFNLENBQUMsU0FBaUI7Z0JBQ3hDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUMsT0FBTyxJQUFJLENBQUM7WUFDYixDQUFDO1lBRWdCLE1BQU0sQ0FBQyxRQUFrQixFQUFFLElBQVc7Z0JBQ3RELE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUUxQyxJQUFJLDBCQUFrQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUFFLE9BQU87Z0JBQzVELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO2dCQUU3QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDckIsQ0FBQztZQUVnQixTQUFTO2dCQUN6QixLQUFLLE1BQU0sU0FBUyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQztpQkFDeEM7WUFDRixDQUFDO1lBR08sZUFBZTtnQkFDdEIsd0JBQWMsQ0FBQyxHQUFHLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVUsQ0FBQyxDQUFDO1lBQ2xFLENBQUM7U0FDRDtRQTlDQTtZQURDLGFBQUcsQ0FBQyxHQUFHLENBQUMsNEJBQWMsQ0FBQzt5REFDQztRQWVmO1lBQVQsUUFBUTsyREFLUjtRQUVTO1lBQVQsUUFBUTswREFHUjtRQUVTO1lBQVQsUUFBUTswREFPUjtRQUVTO1lBQVQsUUFBUTs2REFJUjtRQUdEO1lBREMsS0FBSzttRUFHTDtRQUNGLDJCQUFDO1NBQUE7c0JBakRvQixvQkFBb0IifQ==
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "mod/Mod", "newui/component/Button", "utilities/math/Vector3", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools", "../component/AddItemToInventory", "../component/DebugToolsPanel", "../component/InspectInformationSection"], function (require, exports, Enums_1, Mod_1, Button_1, Vector3_1, Objects_1, Actions_1, DebugTools_1, IDebugTools_1, AddItemToInventory_1, DebugToolsPanel_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DoodadInformation extends InspectInformationSection_1.default {
        constructor(api) {
            super(api);
            new Button_1.default(api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))
                .on(Button_1.ButtonEvent.Activate, this.removeDoodad)
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonCloneEntity))
                .on(Button_1.ButtonEvent.Activate, this.cloneDoodad)
                .appendTo(this);
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo, () => {
                if (!this.doodad.containedItems)
                    return;
                const addItemToInventory = AddItemToInventory_1.default.get(this.api).appendTo(this);
                this.until(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway)
                    .bind(addItemToInventory, AddItemToInventory_1.AddItemToInventoryEvent.Execute, this.addItem);
            });
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
            if (!this.doodad)
                return;
            this.setShouldLog();
        }
        logUpdate() {
            this.LOG.info("Doodad:", this.doodad);
        }
        addItem(_, type, quality) {
            Actions_1.default.get("addItemToInventory")
                .execute({ doodad: this.doodad, object: [type, quality] });
        }
        removeDoodad() {
            Actions_1.default.get("remove").execute({ doodad: this.doodad });
        }
        async cloneDoodad() {
            const teleportLocation = await this.DEBUG_TOOLS.selector.select();
            if (!teleportLocation)
                return;
            Actions_1.default.get("clone")
                .execute({ doodad: this.doodad, position: new Vector3_1.default(teleportLocation.x, teleportLocation.y, localPlayer.z) });
        }
    }
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], DoodadInformation.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], DoodadInformation.prototype, "LOG", void 0);
    __decorate([
        Objects_1.Bound
    ], DoodadInformation.prototype, "addItem", null);
    __decorate([
        Objects_1.Bound
    ], DoodadInformation.prototype, "removeDoodad", null);
    __decorate([
        Objects_1.Bound
    ], DoodadInformation.prototype, "cloneDoodad", null);
    exports.default = DoodadInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vZGFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRG9vZGFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWlCQSxNQUFxQixpQkFBa0IsU0FBUSxtQ0FBeUI7UUFTdkUsWUFBbUIsR0FBVTtZQUM1QixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFWCxJQUFJLGdCQUFNLENBQUMsR0FBRyxDQUFDO2lCQUNiLE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUN4RCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztpQkFDM0MsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUNsQixPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2lCQUM3RCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQztpQkFDMUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksQ0FBQyxFQUFFLENBQUMsc0NBQW9CLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtnQkFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFPLENBQUMsY0FBYztvQkFBRSxPQUFPO2dCQUV6QyxNQUFNLGtCQUFrQixHQUFHLDRCQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzRSxJQUFJLENBQUMsS0FBSyxDQUFDLHNDQUFvQixDQUFDLFVBQVUsQ0FBQztxQkFDekMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLDRDQUF1QixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0UsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDO1FBRU0sT0FBTztZQUNiLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLHdCQUFXLENBQUMsbUNBQXFCLENBQUMsVUFBVSxDQUFDO3lCQUNyRCxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLHlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ2pFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNSLENBQUM7UUFFTSxNQUFNLENBQUMsUUFBa0IsRUFBRSxJQUFXO1lBQzVDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBQ3hDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUUxQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07Z0JBQUUsT0FBTztZQUV6QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDckIsQ0FBQztRQUVNLFNBQVM7WUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFHTyxPQUFPLENBQUMsQ0FBTSxFQUFFLElBQWMsRUFBRSxPQUFvQjtZQUMzRCxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQztpQkFDL0IsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBR08sWUFBWTtZQUNuQixpQkFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUdPLEtBQUssQ0FBQyxXQUFXO1lBQ3hCLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNsRSxJQUFJLENBQUMsZ0JBQWdCO2dCQUFFLE9BQU87WUFFOUIsaUJBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO2lCQUNsQixPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxpQkFBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsSCxDQUFDO0tBQ0Q7SUFuRUE7UUFEQyxhQUFHLENBQUMsUUFBUSxDQUFhLDRCQUFjLENBQUM7MERBQ0Q7SUFFeEM7UUFEQyxhQUFHLENBQUMsR0FBRyxDQUFDLDRCQUFjLENBQUM7a0RBQ0M7SUErQ3pCO1FBREMsZUFBSztvREFJTDtJQUdEO1FBREMsZUFBSzt5REFHTDtJQUdEO1FBREMsZUFBSzt3REFPTDtJQXJFRixvQ0FzRUMifQ==
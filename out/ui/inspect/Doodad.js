var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "newui/component/Button", "utilities/math/Vector3", "utilities/Objects", "../../Actions", "../../IDebugTools", "../component/AddItemToInventory", "../component/DebugToolsPanel", "../component/InspectInformationSection"], function (require, exports, Mod_1, Button_1, Vector3_1, Objects_1, Actions_1, IDebugTools_1, AddItemToInventory_1, DebugToolsPanel_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DoodadInformation extends InspectInformationSection_1.default {
        constructor(gsapi) {
            super(gsapi);
            new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))
                .on(Button_1.ButtonEvent.Activate, this.removeDoodad)
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonCloneEntity))
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
                [0, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.DoodadName)
                        .get(this.doodad.getName(false).inContext(3))],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vZGFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRG9vZGFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWtCQSxNQUFxQixpQkFBa0IsU0FBUSxtQ0FBeUI7UUFTdkUsWUFBbUIsS0FBcUI7WUFDdkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWIsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ2xCLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUN4RCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztpQkFDM0MsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUNsQixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2lCQUM3RCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQztpQkFDMUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksQ0FBQyxFQUFFLENBQUMsc0NBQW9CLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtnQkFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFPLENBQUMsY0FBYztvQkFBRSxPQUFPO2dCQUV6QyxNQUFNLGtCQUFrQixHQUFHLDRCQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzRSxJQUFJLENBQUMsS0FBSyxDQUFDLHNDQUFvQixDQUFDLFVBQVUsQ0FBQztxQkFDekMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLDRDQUF1QixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0UsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDO1FBRU0sT0FBTztZQUNiLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsVUFBVSxDQUFDO3lCQUNyRCxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFtQixDQUFDLENBQUM7YUFDaEUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ1IsQ0FBQztRQUVNLE1BQU0sQ0FBQyxRQUFrQixFQUFFLElBQVc7WUFDNUMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNO2dCQUFFLE9BQU87WUFDeEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBRTFCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBRXpCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNyQixDQUFDO1FBRU0sU0FBUztZQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUdPLE9BQU8sQ0FBQyxDQUFNLEVBQUUsSUFBYyxFQUFFLE9BQW9CO1lBQzNELGlCQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDO2lCQUMvQixPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdELENBQUM7UUFHTyxZQUFZO1lBQ25CLGlCQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBR08sS0FBSyxDQUFDLFdBQVc7WUFDeEIsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2xFLElBQUksQ0FBQyxnQkFBZ0I7Z0JBQUUsT0FBTztZQUU5QixpQkFBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7aUJBQ2xCLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLGlCQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xILENBQUM7S0FDRDtJQW5FQTtRQURDLGFBQUcsQ0FBQyxRQUFRLENBQWEsNEJBQWMsQ0FBQzswREFDRDtJQUV4QztRQURDLGFBQUcsQ0FBQyxHQUFHLENBQUMsNEJBQWMsQ0FBQztrREFDQztJQStDekI7UUFEQyxlQUFLO29EQUlMO0lBR0Q7UUFEQyxlQUFLO3lEQUdMO0lBR0Q7UUFEQyxlQUFLO3dEQU9MO0lBckVGLG9DQXNFQyJ9
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "doodad/doodads/Doodad", "doodad/IDoodad", "entity/action/ActionExecutor", "mod/Mod", "newui/component/Button", "newui/component/EnumContextMenu", "utilities/math/Vector3", "utilities/Objects", "../../action/AddItemToInventory", "../../action/Clone", "../../action/Remove", "../../action/SetGrowingStage", "../../IDebugTools", "../component/AddItemToInventory", "../component/DebugToolsPanel", "../component/InspectInformationSection"], function (require, exports, Doodad_1, IDoodad_1, ActionExecutor_1, Mod_1, Button_1, EnumContextMenu_1, Vector3_1, Objects_1, AddItemToInventory_1, Clone_1, Remove_1, SetGrowingStage_1, IDebugTools_1, AddItemToInventory_2, DebugToolsPanel_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DoodadInformation extends InspectInformationSection_1.default {
        constructor() {
            super();
            new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))
                .on(Button_1.ButtonEvent.Activate, this.removeDoodad)
                .appendTo(this);
            new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonCloneEntity))
                .on(Button_1.ButtonEvent.Activate, this.cloneDoodad)
                .appendTo(this);
            this.buttonGrowthStage = new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonSetGrowthStage))
                .on(Button_1.ButtonEvent.Activate, this.setGrowthStage)
                .appendTo(this);
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo, () => {
                if (!this.doodad.containedItems)
                    return;
                const addItemToInventory = AddItemToInventory_2.default.init().appendTo(this);
                this.until(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway)
                    .bind(addItemToInventory, AddItemToInventory_2.AddItemToInventoryEvent.Execute, this.addItem);
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
            this.buttonGrowthStage.toggle(this.doodad.getGrowingStage() !== undefined);
            this.setShouldLog();
        }
        logUpdate() {
            this.LOG.info("Doodad:", this.doodad);
        }
        addItem(_, type, quality) {
            ActionExecutor_1.default.get(AddItemToInventory_1.default).execute(localPlayer, this.doodad, type, quality);
        }
        removeDoodad() {
            ActionExecutor_1.default.get(Remove_1.default).execute(localPlayer, this.doodad);
        }
        async cloneDoodad() {
            const teleportLocation = await this.DEBUG_TOOLS.selector.select();
            if (!teleportLocation)
                return;
            ActionExecutor_1.default.get(Clone_1.default).execute(localPlayer, this.doodad, new Vector3_1.default(teleportLocation, localPlayer.z));
        }
        async setGrowthStage() {
            const growthStage = await new EnumContextMenu_1.default(IDoodad_1.GrowingStage)
                .setTranslator(stage => Doodad_1.default.getGrowingStageTranslation(stage, this.doodad.description()).inContext(3))
                .setSort(EnumContextMenu_1.EnumSort.Id)
                .waitForChoice();
            if (growthStage === undefined) {
                return;
            }
            ActionExecutor_1.default.get(SetGrowingStage_1.default).execute(localPlayer, this.doodad, growthStage);
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
    __decorate([
        Objects_1.Bound
    ], DoodadInformation.prototype, "setGrowthStage", null);
    exports.default = DoodadInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vZGFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRG9vZGFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXdCQSxNQUFxQixpQkFBa0IsU0FBUSxtQ0FBeUI7UUFVdkU7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUVSLElBQUksZ0JBQU0sRUFBRTtpQkFDVixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDeEQsRUFBRSxDQUFDLG9CQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUM7aUJBQzNDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLGdCQUFNLEVBQUU7aUJBQ1YsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztpQkFDN0QsRUFBRSxDQUFDLG9CQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUM7aUJBQzFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxnQkFBTSxFQUFFO2lCQUNuQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2lCQUNoRSxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQztpQkFDN0MsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksQ0FBQyxFQUFFLENBQUMsc0NBQW9CLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtnQkFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFPLENBQUMsY0FBYztvQkFBRSxPQUFPO2dCQUV6QyxNQUFNLGtCQUFrQixHQUFHLDRCQUEyQixDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFD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
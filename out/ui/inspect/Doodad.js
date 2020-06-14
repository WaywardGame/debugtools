var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "doodad/Doodad", "doodad/IDoodad", "entity/action/ActionExecutor", "event/EventManager", "language/Translation", "mod/Mod", "newui/component/Button", "newui/component/EnumContextMenu", "utilities/math/Vector3", "../../action/AddItemToInventory", "../../action/Clone", "../../action/Remove", "../../action/SetGrowingStage", "../../IDebugTools", "../component/AddItemToInventory", "../component/InspectInformationSection"], function (require, exports, Doodad_1, IDoodad_1, ActionExecutor_1, EventManager_1, Translation_1, Mod_1, Button_1, EnumContextMenu_1, Vector3_1, AddItemToInventory_1, Clone_1, Remove_1, SetGrowingStage_1, IDebugTools_1, AddItemToInventory_2, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let DoodadInformation = (() => {
        class DoodadInformation extends InspectInformationSection_1.default {
            constructor() {
                super();
                new Button_1.default()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))
                    .event.subscribe("activate", this.removeDoodad)
                    .appendTo(this);
                new Button_1.default()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonCloneEntity))
                    .event.subscribe("activate", this.cloneDoodad)
                    .appendTo(this);
                this.buttonGrowthStage = new Button_1.default()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonSetGrowthStage))
                    .event.subscribe("activate", this.setGrowthStage)
                    .appendTo(this);
            }
            onSwitchTo() {
                if (!this.doodad.containedItems)
                    return;
                const addItemToInventory = AddItemToInventory_2.default.init().appendTo(this);
                addItemToInventory.event.until(this, "switchAway", "remove")
                    .subscribe("execute", this.addItem);
            }
            getTabs() {
                return this.doodad ? [
                    [0, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.DoodadName)
                            .get(this.doodad.getName(false).inContext(Translation_1.TextContext.Title))],
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
                    .setTranslator(stage => Doodad_1.default.getGrowingStageTranslation(stage, this.doodad.description()).inContext(Translation_1.TextContext.Title))
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
            EventManager_1.OwnEventHandler(DoodadInformation, "switchTo")
        ], DoodadInformation.prototype, "onSwitchTo", null);
        __decorate([
            Override
        ], DoodadInformation.prototype, "getTabs", null);
        __decorate([
            Override
        ], DoodadInformation.prototype, "update", null);
        __decorate([
            Override
        ], DoodadInformation.prototype, "logUpdate", null);
        __decorate([
            Bound
        ], DoodadInformation.prototype, "addItem", null);
        __decorate([
            Bound
        ], DoodadInformation.prototype, "removeDoodad", null);
        __decorate([
            Bound
        ], DoodadInformation.prototype, "cloneDoodad", null);
        __decorate([
            Bound
        ], DoodadInformation.prototype, "setGrowthStage", null);
        return DoodadInformation;
    })();
    exports.default = DoodadInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vZGFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRG9vZGFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXdCQTtRQUFBLE1BQXFCLGlCQUFrQixTQUFRLG1DQUF5QjtZQVV2RTtnQkFDQyxLQUFLLEVBQUUsQ0FBQztnQkFFUixJQUFJLGdCQUFNLEVBQUU7cUJBQ1YsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsWUFBWSxDQUFDLENBQUM7cUJBQ3hELEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUM7cUJBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFakIsSUFBSSxnQkFBTSxFQUFFO3FCQUNWLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGlCQUFpQixDQUFDLENBQUM7cUJBQzdELEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUM7cUJBQzdDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFakIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksZ0JBQU0sRUFBRTtxQkFDbkMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztxQkFDaEUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQztxQkFDaEQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLENBQUM7WUFHUyxVQUFVO2dCQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU8sQ0FBQyxjQUFjO29CQUMvQixPQUFPO2dCQUVSLE1BQU0sa0JBQWtCLEdBQUcsNEJBQTJCLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM3RSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxD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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "doodad/Doodad", "doodad/IDoodad", "entity/action/ActionExecutor", "event/EventManager", "mod/Mod", "newui/component/Button", "newui/component/EnumContextMenu", "utilities/math/Vector3", "../../action/AddItemToInventory", "../../action/Clone", "../../action/Remove", "../../action/SetGrowingStage", "../../IDebugTools", "../component/AddItemToInventory", "../component/InspectInformationSection"], function (require, exports, Doodad_1, IDoodad_1, ActionExecutor_1, EventManager_1, Mod_1, Button_1, EnumContextMenu_1, Vector3_1, AddItemToInventory_1, Clone_1, Remove_1, SetGrowingStage_1, IDebugTools_1, AddItemToInventory_2, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            addItemToInventory.event.until(this, "switchAway")
                .subscribe("execute", this.addItem);
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
        EventManager_1.EventHandler("self")("switchTo")
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
    exports.default = DoodadInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vZGFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRG9vZGFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXdCQSxNQUFxQixpQkFBa0IsU0FBUSxtQ0FBeUI7UUFVdkU7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUVSLElBQUksZ0JBQU0sRUFBRTtpQkFDVixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDeEQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztpQkFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksZ0JBQU0sRUFBRTtpQkFDVixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2lCQUM3RCxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDO2lCQUM3QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksZ0JBQU0sRUFBRTtpQkFDbkMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztpQkFDaEUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQztpQkFDaEQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFHUyxVQUFVO1lBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTyxDQUFDLGNBQWM7Z0JBQy9CLE9BQU87WUFFUixNQUFNLGtCQUFrQixHQUFHLDRCQUEyQixDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3RSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFB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
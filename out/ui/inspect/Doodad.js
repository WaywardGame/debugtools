var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "doodad/Doodad", "doodad/IDoodad", "entity/action/ActionExecutor", "event/EventManager", "language/Translation", "mod/Mod", "newui/component/Button", "newui/component/EnumContextMenu", "utilities/math/Vector3", "../../action/AddItemToInventory", "../../action/Clone", "../../action/Remove", "../../action/SetGrowingStage", "../../IDebugTools", "../component/AddItemToInventory", "../component/InspectInformationSection"], function (require, exports, Doodad_1, IDoodad_1, ActionExecutor_1, EventManager_1, Translation_1, Mod_1, Button_1, EnumContextMenu_1, Vector3_1, AddItemToInventory_1, Clone_1, Remove_1, SetGrowingStage_1, IDebugTools_1, AddItemToInventory_2, InspectInformationSection_1) {
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
    exports.default = DoodadInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vZGFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRG9vZGFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXdCQSxNQUFxQixpQkFBa0IsU0FBUSxtQ0FBeUI7UUFVdkU7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUVSLElBQUksZ0JBQU0sRUFBRTtpQkFDVixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDeEQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztpQkFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksZ0JBQU0sRUFBRTtpQkFDVixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2lCQUM3RCxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDO2lCQUM3QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksZ0JBQU0sRUFBRTtpQkFDbkMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztpQkFDaEUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQztpQkFDaEQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFHUyxVQUFVO1lBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTyxDQUFDLGNBQWM7Z0JBQy9CLE9BQU87WUFFUixNQUFNLGtCQUFrQixHQUFHLDRCQUEyQixDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3RSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFB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
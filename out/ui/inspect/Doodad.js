/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventManager", "game/doodad/IDoodad", "language/ITranslation", "language/Translation", "mod/Mod", "ui/component/Button", "ui/component/EnumContextMenu", "utilities/Decorators", "../../IDebugTools", "../../action/Clone", "../../action/Remove", "../../action/SetGrowingStage", "../component/Container", "../component/InspectInformationSection"], function (require, exports, EventManager_1, IDoodad_1, ITranslation_1, Translation_1, Mod_1, Button_1, EnumContextMenu_1, Decorators_1, IDebugTools_1, Clone_1, Remove_1, SetGrowingStage_1, Container_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DoodadInformation extends InspectInformationSection_1.default {
        constructor() {
            super();
            new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionRemove))
                .event.subscribe("activate", this.removeDoodad)
                .appendTo(this);
            new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonCloneEntity))
                .event.subscribe("activate", this.cloneDoodad)
                .appendTo(this);
            this.buttonGrowthStage = new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonSetGrowthStage))
                .event.subscribe("activate", this.setGrowthStage)
                .appendTo(this);
        }
        onSwitchTo() {
            if (!this.doodad.containedItems)
                return;
            Container_1.default.appendTo(this, this, () => this.doodad);
        }
        getTabs() {
            return this.doodad ? [
                [0, () => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.DoodadName)
                        .get(this.doodad.getName(Translation_1.Article.None).inContext(ITranslation_1.TextContext.Title))],
            ] : [];
        }
        update(tile) {
            if (tile.doodad === this.doodad)
                return;
            this.doodad = tile.doodad;
            if (!this.doodad)
                return;
            this.buttonGrowthStage.toggle(this.doodad.growth !== undefined);
            this.setShouldLog();
        }
        logUpdate() {
            this.LOG.info("Doodad:", this.doodad);
        }
        removeDoodad() {
            Remove_1.default.execute(localPlayer, this.doodad);
        }
        async cloneDoodad() {
            const teleportLocation = await this.DEBUG_TOOLS.selector.select();
            if (!teleportLocation)
                return;
            Clone_1.default.execute(localPlayer, this.doodad, teleportLocation);
        }
        async setGrowthStage() {
            const growthStage = await new EnumContextMenu_1.default(IDoodad_1.GrowingStage)
                .setTranslator(stage => Translation_1.default.growthStage(stage, this.doodad.description?.usesSpores).inContext(ITranslation_1.TextContext.Title))
                .setSort(EnumContextMenu_1.EnumSort.Id)
                .waitForChoice();
            if (growthStage === undefined) {
                return;
            }
            SetGrowingStage_1.default.execute(localPlayer, this.doodad, growthStage);
        }
    }
    exports.default = DoodadInformation;
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], DoodadInformation.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], DoodadInformation.prototype, "LOG", void 0);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(DoodadInformation, "switchTo")
    ], DoodadInformation.prototype, "onSwitchTo", null);
    __decorate([
        Decorators_1.Bound
    ], DoodadInformation.prototype, "removeDoodad", null);
    __decorate([
        Decorators_1.Bound
    ], DoodadInformation.prototype, "cloneDoodad", null);
    __decorate([
        Decorators_1.Bound
    ], DoodadInformation.prototype, "setGrowthStage", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vZGFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvRG9vZGFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7Ozs7OztJQXNCSCxNQUFxQixpQkFBa0IsU0FBUSxtQ0FBeUI7UUFVdkU7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUVSLElBQUksZ0JBQU0sRUFBRTtpQkFDVixPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUN4RCxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDO2lCQUM5QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxnQkFBTSxFQUFFO2lCQUNWLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztpQkFDN0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQztpQkFDN0MsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGdCQUFNLEVBQUU7aUJBQ25DLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztpQkFDaEUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQztpQkFDaEQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFHUyxVQUFVO1lBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTyxDQUFDLGNBQWM7Z0JBQy9CLE9BQU87WUFFUixtQkFBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFvQixDQUFDLENBQUM7UUFDakUsQ0FBQztRQUVlLE9BQU87WUFDdEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFVBQVUsQ0FBQzt5QkFDckQsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFPLENBQUMsT0FBTyxDQUFDLHFCQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLDBCQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUN2RSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDUixDQUFDO1FBRWUsTUFBTSxDQUFDLElBQVU7WUFDaEMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNO2dCQUFFLE9BQU87WUFDeEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBRTFCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBRXpCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUM7WUFFaEUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3JCLENBQUM7UUFFZSxTQUFTO1lBQ3hCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUdPLFlBQVk7WUFDbkIsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFPLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBR2EsQUFBTixLQUFLLENBQUMsV0FBVztZQUN4QixNQUFNLGdCQUFnQixHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDbEUsSUFBSSxDQUFDLGdCQUFnQjtnQkFBRSxPQUFPO1lBRTlCLGVBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFPLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBR2EsQUFBTixLQUFLLENBQUMsY0FBYztZQUMzQixNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUkseUJBQWUsQ0FBQyxzQkFBWSxDQUFDO2lCQUN6RCxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxxQkFBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU8sQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFFLENBQUMsU0FBUyxDQUFDLDBCQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQzFILE9BQU8sQ0FBQywwQkFBUSxDQUFDLEVBQUUsQ0FBQztpQkFDcEIsYUFBYSxFQUFFLENBQUM7WUFFbEIsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO2dCQUM5QixPQUFPO2FBQ1A7WUFFRCx5QkFBZSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNqRSxDQUFDO0tBQ0Q7SUFyRkQsb0NBcUZDO0lBbEZnQjtRQURmLGFBQUcsQ0FBQyxRQUFRLENBQWEsNEJBQWMsQ0FBQzswREFDRDtJQUV4QjtRQURmLGFBQUcsQ0FBQyxHQUFHLENBQUMsNEJBQWMsQ0FBQztrREFDQztJQXlCZjtRQURULElBQUEsOEJBQWUsRUFBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUM7dURBTTlDO0lBeUJPO1FBRFAsa0JBQUs7eURBR0w7SUFHYTtRQURiLGtCQUFLO3dEQU1MO0lBR2E7UUFEYixrQkFBSzsyREFZTCJ9
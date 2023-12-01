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
define(["require", "exports", "@wayward/utilities/event/EventManager", "@wayward/game/game/doodad/IDoodad", "@wayward/game/language/ITranslation", "@wayward/game/language/Translation", "@wayward/game/mod/Mod", "@wayward/game/ui/component/Button", "@wayward/game/ui/component/EnumContextMenu", "@wayward/utilities/Decorators", "../../IDebugTools", "../../action/Clone", "../../action/Remove", "../../action/SetGrowingStage", "../component/Container", "../component/InspectInformationSection"], function (require, exports, EventManager_1, IDoodad_1, ITranslation_1, Translation_1, Mod_1, Button_1, EnumContextMenu_1, Decorators_1, IDebugTools_1, Clone_1, Remove_1, SetGrowingStage_1, Container_1, InspectInformationSection_1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vZGFkSW5mb3JtYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9Eb29kYWRJbmZvcm1hdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUFzQkgsTUFBcUIsaUJBQWtCLFNBQVEsbUNBQXlCO1FBVXZFO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLGdCQUFNLEVBQUU7aUJBQ1YsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDeEQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztpQkFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksZ0JBQU0sRUFBRTtpQkFDVixPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGlCQUFpQixDQUFDLENBQUM7aUJBQzdELEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUM7aUJBQzdDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxnQkFBTSxFQUFFO2lCQUNuQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLG9CQUFvQixDQUFDLENBQUM7aUJBQ2hFLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7aUJBQ2hELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBR1MsVUFBVTtZQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU8sQ0FBQyxjQUFjO2dCQUMvQixPQUFPO1lBRVIsbUJBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJ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
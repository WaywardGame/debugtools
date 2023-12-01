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
define(["require", "exports", "@wayward/game/language/ITranslation", "@wayward/game/language/Translation", "./DoodadInformation", "../../IDebugTools"], function (require, exports, ITranslation_1, Translation_1, DoodadInformation_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class VehicleInformation extends DoodadInformation_1.default {
        getTabs() {
            return this.doodad ? [
                [0, () => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.VehicleName)
                        .get(this.doodad.getName(Translation_1.Article.None).inContext(ITranslation_1.TextContext.Title))],
            ] : [];
        }
        update(tile) {
            if (tile.vehicle === this.doodad)
                return;
            this.doodad = tile.vehicle;
            if (!this.doodad)
                return;
            this.buttonGrowthStage.hide();
            this.setShouldLog();
        }
        logUpdate() {
            this.LOG.info("Vehicle:", this.doodad);
        }
    }
    exports.default = VehicleInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmVoaWNsZUluZm9ybWF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvVmVoaWNsZUluZm9ybWF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7OztJQVNILE1BQXFCLGtCQUFtQixTQUFRLDJCQUFpQjtRQUVoRCxPQUFPO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxXQUFXLENBQUM7eUJBQ3RELEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTyxDQUFDLE9BQU8sQ0FBQyxxQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDdkUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ1IsQ0FBQztRQUVlLE1BQU0sQ0FBQyxJQUFVO1lBQ2hDLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUUzQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07Z0JBQUUsT0FBTztZQUV6QixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFOUIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3JCLENBQUM7UUFFZSxTQUFTO1lBQ3hCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsQ0FBQztLQUVEO0lBeEJELHFDQXdCQyJ9
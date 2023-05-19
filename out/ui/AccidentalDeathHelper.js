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
define(["require", "exports", "event/EventBuses", "event/EventManager", "mod/Mod", "ui/component/Button", "ui/screen/screens/menu/menus/GameEndMenu", "../IDebugTools", "../action/Heal", "game/entity/player/IPlayer"], function (require, exports, EventBuses_1, EventManager_1, Mod_1, Button_1, GameEndMenu_1, IDebugTools_1, Heal_1, IPlayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AccidentalDeathHelper {
        onDie(player) {
            if (this.DEBUG_TOOLS.hasPermission()) {
                this.deathInventory = [...player.inventory.containedItems];
                this.equippedItems = player.equippedReferences.entries()
                    .toObject(([equipType, itemRef]) => [equipType, itemRef.raw()]);
            }
        }
        onShowGameEndMenu(menu) {
            if (this.DEBUG_TOOLS.hasPermission() && menu.gameEndData.state === IPlayer_1.PlayerState.Dead) {
                new Button_1.default()
                    .event.subscribe("activate", () => {
                    Heal_1.default.execute(localPlayer, localPlayer, this.deathInventory?.slice(), this.equippedItems ? { ...this.equippedItems } : undefined);
                    delete this.deathInventory;
                    delete this.equippedItems;
                    menu.getScreen()?.menus.back();
                })
                    .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.RevertDeath))
                    .appendTo(menu.content, { after: menu.continueAsGhostButton });
            }
        }
    }
    exports.default = AccidentalDeathHelper;
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], AccidentalDeathHelper.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "die")
    ], AccidentalDeathHelper.prototype, "onDie", null);
    __decorate([
        (0, EventManager_1.EventHandler)(GameEndMenu_1.default, "show")
    ], AccidentalDeathHelper.prototype, "onShowGameEndMenu", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWNjaWRlbnRhbERlYXRoSGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3VpL0FjY2lkZW50YWxEZWF0aEhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUFnQkgsTUFBcUIscUJBQXFCO1FBUy9CLEtBQUssQ0FBQyxNQUFjO1lBQzdCLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsRUFBRTtnQkFDckMsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDM0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFO3FCQUN0RCxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNqRTtRQUNGLENBQUM7UUFHUyxpQkFBaUIsQ0FBQyxJQUFpQjtZQUM1QyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEtBQUsscUJBQVcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3BGLElBQUksZ0JBQU0sRUFBRTtxQkFDVixLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7b0JBQ2pDLGNBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNqSSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7b0JBQzNCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDaEMsQ0FBQyxDQUFDO3FCQUNELE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsV0FBVyxDQUFDLENBQUM7cUJBQ3ZELFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUM7YUFDaEU7UUFDRixDQUFDO0tBQ0Q7SUEvQkQsd0NBK0JDO0lBNUJnQjtRQURmLGFBQUcsQ0FBQyxRQUFRLENBQWEsNEJBQWMsQ0FBQzs4REFDRDtJQU05QjtRQURULElBQUEsMkJBQVksRUFBQyxxQkFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUM7c0RBT3pDO0lBR1M7UUFEVCxJQUFBLDJCQUFZLEVBQUMscUJBQVcsRUFBRSxNQUFNLENBQUM7a0VBYWpDIn0=
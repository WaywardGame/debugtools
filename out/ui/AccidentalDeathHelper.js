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
define(["require", "exports", "@wayward/game/event/EventBuses", "@wayward/game/event/EventManager", "@wayward/game/mod/Mod", "@wayward/game/ui/component/Button", "@wayward/game/ui/screen/screens/menu/menus/GameEndMenu", "../IDebugTools", "../action/Heal", "@wayward/game/game/entity/player/IPlayer"], function (require, exports, EventBuses_1, EventManager_1, Mod_1, Button_1, GameEndMenu_1, IDebugTools_1, Heal_1, IPlayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AccidentalDeathHelper {
        constructor() {
            this.buttonAdded = false;
        }
        deregister() {
            delete this.equippedItems;
            delete this.deathInventory;
            EventManager_1.eventManager.deregisterEventBusSubscriber(this);
        }
        onDie(player) {
            if (this.DEBUG_TOOLS.hasPermission()) {
                this.deathInventory = [...player.inventory.containedItems];
                this.equippedItems = player.equippedReferences.entries()
                    .toObject(([equipType, itemRef]) => [equipType, itemRef.raw()]);
            }
        }
        onShowGameEndMenu(menu) {
            if (this.DEBUG_TOOLS.hasPermission() && menu.gameEndData.state === IPlayer_1.PlayerState.Dead && this.buttonAdded === false) {
                this.buttonAdded = true;
                new Button_1.default()
                    .event.subscribe("activate", () => {
                    this.buttonAdded = false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWNjaWRlbnRhbERlYXRoSGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3VpL0FjY2lkZW50YWxEZWF0aEhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0dBU0c7Ozs7Ozs7Ozs7SUFnQkgsTUFBcUIscUJBQXFCO1FBQTFDO1lBS1MsZ0JBQVcsR0FBYSxLQUFLLENBQUM7UUFxQ3ZDLENBQUM7UUFqQ08sVUFBVTtZQUNoQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDMUIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBRTNCLDJCQUFZLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsQ0FBQztRQUdTLEtBQUssQ0FBQyxNQUFjO1lBQzdCLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDO2dCQUN0QyxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUU7cUJBQ3RELFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLENBQUM7UUFDRixDQUFDO1FBR1MsaUJBQWlCLENBQUMsSUFBaUI7WUFDNUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxLQUFLLHFCQUFXLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssS0FBSyxFQUFFLENBQUM7Z0JBQ25ILElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUN4QixJQUFJLGdCQUFNLEVBQUU7cUJBQ1YsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO29CQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztvQkFFekIsY0FBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2pJLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztvQkFDM0IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO29CQUMxQixJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNoQyxDQUFDLENBQUM7cUJBQ0QsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztxQkFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQztZQUNqRSxDQUFDO1FBQ0YsQ0FBQztLQUNEO0lBMUNELHdDQTBDQztJQXZDZ0I7UUFEZixhQUFHLENBQUMsUUFBUSxDQUFhLDRCQUFjLENBQUM7OERBQ0Q7SUFjOUI7UUFEVCxJQUFBLDJCQUFZLEVBQUMscUJBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDO3NEQU96QztJQUdTO1FBRFQsSUFBQSwyQkFBWSxFQUFDLHFCQUFXLEVBQUUsTUFBTSxDQUFDO2tFQWdCakMifQ==
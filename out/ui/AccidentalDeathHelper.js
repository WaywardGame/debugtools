var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventBuses", "event/EventManager", "mod/Mod", "ui/component/Button", "ui/screen/screens/menu/menus/GameEndMenu", "../IDebugTools", "../action/Heal"], function (require, exports, EventBuses_1, EventManager_1, Mod_1, Button_1, GameEndMenu_1, IDebugTools_1, Heal_1) {
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
            if (this.DEBUG_TOOLS.hasPermission()) {
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
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], AccidentalDeathHelper.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "die")
    ], AccidentalDeathHelper.prototype, "onDie", null);
    __decorate([
        (0, EventManager_1.EventHandler)(GameEndMenu_1.default, "show")
    ], AccidentalDeathHelper.prototype, "onShowGameEndMenu", null);
    exports.default = AccidentalDeathHelper;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWNjaWRlbnRhbERlYXRoSGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3VpL0FjY2lkZW50YWxEZWF0aEhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFhQSxNQUFxQixxQkFBcUI7UUFTL0IsS0FBSyxDQUFDLE1BQWM7WUFDN0IsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxFQUFFO2dCQUNyQyxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUU7cUJBQ3RELFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2pFO1FBQ0YsQ0FBQztRQUdTLGlCQUFpQixDQUFDLElBQWlCO1lBQzVDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsRUFBRTtnQkFDckMsSUFBSSxnQkFBTSxFQUFFO3FCQUNWLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtvQkFDakMsY0FBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2pJLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztvQkFDM0IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO29CQUMxQixJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNoQyxDQUFDLENBQUM7cUJBQ0QsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztxQkFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQzthQUNoRTtRQUNGLENBQUM7S0FDRDtJQTVCZ0I7UUFEZixhQUFHLENBQUMsUUFBUSxDQUFhLDRCQUFjLENBQUM7OERBQ0Q7SUFNOUI7UUFEVCxJQUFBLDJCQUFZLEVBQUMscUJBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDO3NEQU96QztJQUdTO1FBRFQsSUFBQSwyQkFBWSxFQUFDLHFCQUFXLEVBQUUsTUFBTSxDQUFDO2tFQWFqQztJQTlCRix3Q0ErQkMifQ==
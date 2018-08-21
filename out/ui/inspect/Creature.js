var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/Button", "newui/component/CheckButton", "newui/component/Component", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools"], function (require, exports, Button_1, CheckButton_1, Component_1, Objects_1, Actions_1, DebugTools_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CreatureInformation extends Component_1.default {
        constructor(api, creature) {
            super(api);
            this.creature = creature;
            new CheckButton_1.CheckButton(api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonTameCreature))
                .setRefreshMethod(() => creature.isTamed())
                .on(CheckButton_1.CheckButtonEvent.Change, this.setTamed)
                .appendTo(this);
            new Button_1.default(api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRemoveThing))
                .on(Button_1.ButtonEvent.Activate, this.removeCreature)
                .appendTo(this);
        }
        getImmutableStats() {
            return [];
        }
        setTamed(_, tamed) {
            actionManager.execute(localPlayer, Actions_1.default.get("setTamed"), { object: tamed, creature: this.creature });
        }
        removeCreature() {
            actionManager.execute(localPlayer, Actions_1.default.get("remove"), { creature: this.creature });
        }
    }
    __decorate([
        Objects_1.Bound
    ], CreatureInformation.prototype, "setTamed", null);
    __decorate([
        Objects_1.Bound
    ], CreatureInformation.prototype, "removeCreature", null);
    exports.default = CreatureInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9DcmVhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFXQSxNQUFxQixtQkFBb0IsU0FBUSxtQkFBUztRQUN6RCxZQUFtQixHQUFVLEVBQW1CLFFBQW1CO1lBQ2xFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQURvQyxhQUFRLEdBQVIsUUFBUSxDQUFXO1lBR2xFLElBQUkseUJBQVcsQ0FBQyxHQUFHLENBQUM7aUJBQ2xCLE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUM7aUJBQzlELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDMUMsRUFBRSxDQUFDLDhCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDO2lCQUMxQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxnQkFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDYixPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2lCQUM3RCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQztpQkFDN0MsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFTSxpQkFBaUI7WUFDdkIsT0FBTyxFQUFFLENBQUM7UUFDWCxDQUFDO1FBR08sUUFBUSxDQUFDLENBQU0sRUFBRSxLQUFjO1lBQ3RDLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLGlCQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDekcsQ0FBQztRQUdPLGNBQWM7WUFDckIsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsaUJBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDeEYsQ0FBQztLQUNEO0lBUkE7UUFEQyxlQUFLO3VEQUdMO0lBR0Q7UUFEQyxlQUFLOzZEQUdMO0lBNUJGLHNDQTZCQyJ9
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "ui/component/Button", "ui/component/CheckButton", "../../action/Remove", "../../action/SetTamed", "../../IDebugTools", "../component/InspectEntityInformationSubsection"], function (require, exports, Button_1, CheckButton_1, Remove_1, SetTamed_1, IDebugTools_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CreatureInformation extends InspectEntityInformationSubsection_1.default {
        constructor() {
            super();
            this.tamedButton = new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonTameCreature))
                .setRefreshMethod(() => this.creature ? this.creature.isTamed() : false)
                .event.subscribe("toggle", this.setTamed)
                .appendTo(this);
            new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRemoveThing))
                .event.subscribe("activate", this.removeCreature)
                .appendTo(this);
        }
        update(entity) {
            this.creature = entity.asCreature;
            this.tamedButton.refresh();
            this.toggle(!!this.creature);
        }
        setTamed(_, tamed) {
            SetTamed_1.default.execute(localPlayer, this.creature, tamed);
        }
        removeCreature() {
            Remove_1.default.execute(localPlayer, this.creature);
        }
    }
    __decorate([
        Override
    ], CreatureInformation.prototype, "update", null);
    __decorate([
        Bound
    ], CreatureInformation.prototype, "setTamed", null);
    __decorate([
        Bound
    ], CreatureInformation.prototype, "removeCreature", null);
    exports.default = CreatureInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9DcmVhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFTQSxNQUFxQixtQkFBb0IsU0FBUSw0Q0FBa0M7UUFJbEY7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUVSLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSx5QkFBVyxFQUFFO2lCQUNsQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2lCQUM5RCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7aUJBQ3ZFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7aUJBQ3hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLGdCQUFNLEVBQUU7aUJBQ1YsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztpQkFDN0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQztpQkFDaEQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFZ0IsTUFBTSxDQUFDLE1BQWM7WUFDckMsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFHTyxRQUFRLENBQUMsQ0FBTSxFQUFFLEtBQWM7WUFDdEMsa0JBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEQsQ0FBQztRQUdPLGNBQWM7WUFDckIsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFTLENBQUMsQ0FBQztRQUM3QyxDQUFDO0tBQ0Q7SUFmVTtRQUFULFFBQVE7cURBSVI7SUFHRDtRQURDLEtBQUs7dURBR0w7SUFHRDtRQURDLEtBQUs7NkRBR0w7SUFqQ0Ysc0NBa0NDIn0=
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "action/ActionExecutor", "entity/Entity", "entity/IEntity", "newui/component/Button", "newui/component/CheckButton", "utilities/Objects", "../../action/Remove", "../../action/SetTamed", "../../IDebugTools", "../component/InspectEntityInformationSubsection"], function (require, exports, ActionExecutor_1, Entity_1, IEntity_1, Button_1, CheckButton_1, Objects_1, Remove_1, SetTamed_1, IDebugTools_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CreatureInformation extends InspectEntityInformationSubsection_1.default {
        constructor(gsapi) {
            super(gsapi);
            new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonTameCreature))
                .setRefreshMethod(() => this.creature ? this.creature.isTamed() : false)
                .on(CheckButton_1.CheckButtonEvent.Change, this.setTamed)
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRemoveThing))
                .on(Button_1.ButtonEvent.Activate, this.removeCreature)
                .appendTo(this);
        }
        update(entity) {
            this.creature = Entity_1.default.is(entity, IEntity_1.EntityType.Creature) ? entity : undefined;
            this.toggle(!!this.creature);
        }
        setTamed(_, tamed) {
            ActionExecutor_1.default.get(SetTamed_1.default).execute(localPlayer, this.creature, tamed);
        }
        removeCreature() {
            ActionExecutor_1.default.get(Remove_1.default).execute(localPlayer, this.creature);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9DcmVhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFlQSxNQUFxQixtQkFBb0IsU0FBUSw0Q0FBa0M7UUFHbEYsWUFBbUIsS0FBcUI7WUFDdkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWIsSUFBSSx5QkFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3ZCLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUM7aUJBQzlELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztpQkFDdkUsRUFBRSxDQUFDLDhCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDO2lCQUMxQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ2xCLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGlCQUFpQixDQUFDLENBQUM7aUJBQzdELEVBQUUsQ0FBQyxvQkFBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDO2lCQUM3QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQztRQUVNLE1BQU0sQ0FBQyxNQUFrQztZQUMvQyxJQUFJLENBQUMsUUFBUSxHQUFHLGdCQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUdPLFFBQVEsQ0FBQyxDQUFNLEVBQUUsS0FBYztZQUN0Qyx3QkFBYyxDQUFDLEdBQUcsQ0FBQyxrQkFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFHTyxjQUFjO1lBQ3JCLHdCQUFjLENBQUMsR0FBRyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFTLENBQUMsQ0FBQztRQUNqRSxDQUFDO0tBQ0Q7SUFSQTtRQURDLGVBQUs7dURBR0w7SUFHRDtRQURDLGVBQUs7NkRBR0w7SUEvQkYsc0NBZ0NDIn0=
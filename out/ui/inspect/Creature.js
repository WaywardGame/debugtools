var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IEntity", "newui/component/Button", "newui/component/CheckButton", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools", "../component/InspectEntityInformationSubsection"], function (require, exports, IEntity_1, Button_1, CheckButton_1, Objects_1, Actions_1, DebugTools_1, IDebugTools_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CreatureInformation extends InspectEntityInformationSubsection_1.default {
        constructor(api) {
            super(api);
            new CheckButton_1.CheckButton(api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonTameCreature))
                .setRefreshMethod(() => this.creature ? this.creature.isTamed() : false)
                .on(CheckButton_1.CheckButtonEvent.Change, this.setTamed)
                .appendTo(this);
            new Button_1.default(api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRemoveThing))
                .on(Button_1.ButtonEvent.Activate, this.removeCreature)
                .appendTo(this);
        }
        update(entity) {
            this.creature = entity.entityType === IEntity_1.EntityType.Creature ? entity : undefined;
            this.toggle(!!this.creature);
        }
        setTamed(_, tamed) {
            Actions_1.default.get("setTamed").execute({ creature: this.creature, object: tamed });
        }
        removeCreature() {
            Actions_1.default.get("remove").execute({ creature: this.creature });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9DcmVhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFhQSxNQUFxQixtQkFBb0IsU0FBUSw0Q0FBa0M7UUFHbEYsWUFBbUIsR0FBVTtZQUM1QixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFWCxJQUFJLHlCQUFXLENBQUMsR0FBRyxDQUFDO2lCQUNsQixPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2lCQUM5RCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7aUJBQ3ZFLEVBQUUsQ0FBQyw4QkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQztpQkFDMUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksZ0JBQU0sQ0FBQyxHQUFHLENBQUM7aUJBQ2IsT0FBTyxDQUFDLHdCQUFXLENBQUMsbUNBQXFCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztpQkFDN0QsRUFBRSxDQUFDLG9CQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7aUJBQzdDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBRU0sTUFBTSxDQUFDLE1BQWtDO1lBQy9DLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsS0FBSyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDL0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFHTyxRQUFRLENBQUMsQ0FBTSxFQUFFLEtBQWM7WUFDdEMsaUJBQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDN0UsQ0FBQztRQUdPLGNBQWM7WUFDckIsaUJBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzVELENBQUM7S0FDRDtJQVJBO1FBREMsZUFBSzt1REFHTDtJQUdEO1FBREMsZUFBSzs2REFHTDtJQS9CRixzQ0FnQ0MifQ==
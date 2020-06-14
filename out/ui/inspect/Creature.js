var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "newui/component/Button", "newui/component/CheckButton", "../../action/Remove", "../../action/SetTamed", "../../IDebugTools", "../component/InspectEntityInformationSubsection"], function (require, exports, ActionExecutor_1, Button_1, CheckButton_1, Remove_1, SetTamed_1, IDebugTools_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let CreatureInformation = (() => {
        class CreatureInformation extends InspectEntityInformationSubsection_1.default {
            constructor() {
                super();
                new CheckButton_1.CheckButton()
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
            Override
        ], CreatureInformation.prototype, "update", null);
        __decorate([
            Bound
        ], CreatureInformation.prototype, "setTamed", null);
        __decorate([
            Bound
        ], CreatureInformation.prototype, "removeCreature", null);
        return CreatureInformation;
    })();
    exports.default = CreatureInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvaW5zcGVjdC9DcmVhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFVQTtRQUFBLE1BQXFCLG1CQUFvQixTQUFRLDRDQUFrQztZQUdsRjtnQkFDQyxLQUFLLEVBQUUsQ0FBQztnQkFFUixJQUFJLHlCQUFXLEVBQUU7cUJBQ2YsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztxQkFDOUQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO3FCQUN2RSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDO3FCQUN4QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRWpCLElBQUksZ0JBQU0sRUFBRTtxQkFDVixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO3FCQUM3RCxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDO3FCQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsQ0FBQztZQUVnQixNQUFNLENBQUMsTUFBYztnQkFDckMsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO2dCQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUIsQ0FBQztZQUdPLFFBQVEsQ0FBQyxDQUFNLEVBQUUsS0FBYztnQkFDdEMsd0JBQWMsQ0FBQyxHQUFHLENBQUMsa0JBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMxRSxDQUFDO1lBR08sY0FBYztnQkFDckIsd0JBQWMsQ0FBQyxHQUFHLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVMsQ0FBQyxDQUFDO1lBQ2pFLENBQUM7U0FDRDtRQWRVO1lBQVQsUUFBUTt5REFHUjtRQUdEO1lBREMsS0FBSzsyREFHTDtRQUdEO1lBREMsS0FBSztpRUFHTDtRQUNGLDBCQUFDO1NBQUE7c0JBaENvQixtQkFBbUIifQ==
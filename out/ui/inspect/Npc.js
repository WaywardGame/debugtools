var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "newui/component/Button", "../../action/Remove", "../../IDebugTools", "../component/InspectEntityInformationSubsection"], function (require, exports, ActionExecutor_1, Button_1, Remove_1, IDebugTools_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let NpcInformation = (() => {
        class NpcInformation extends InspectEntityInformationSubsection_1.default {
            constructor() {
                super();
                new Button_1.default()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRemoveThing))
                    .event.subscribe("activate", this.removeNPC)
                    .appendTo(this);
            }
            update(entity) {
                this.npc = entity.asNPC;
                this.toggle(!!this.npc);
            }
            removeNPC() {
                ActionExecutor_1.default.get(Remove_1.default).execute(localPlayer, this.npc);
            }
        }
        __decorate([
            Override
        ], NpcInformation.prototype, "update", null);
        __decorate([
            Bound
        ], NpcInformation.prototype, "removeNPC", null);
        return NpcInformation;
    })();
    exports.default = NpcInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnBjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvTnBjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQVNBO1FBQUEsTUFBcUIsY0FBZSxTQUFRLDRDQUFrQztZQUc3RTtnQkFDQyxLQUFLLEVBQUUsQ0FBQztnQkFFUixJQUFJLGdCQUFNLEVBQUU7cUJBQ1YsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztxQkFDN0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztxQkFDM0MsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLENBQUM7WUFFZ0IsTUFBTSxDQUFDLE1BQStCO2dCQUN0RCxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QixDQUFDO1lBR08sU0FBUztnQkFDaEIsd0JBQWMsQ0FBQyxHQUFHLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUksQ0FBQyxDQUFDO1lBQzVELENBQUM7U0FDRDtRQVRVO1lBQVQsUUFBUTtvREFHUjtRQUdEO1lBREMsS0FBSzt1REFHTDtRQUNGLHFCQUFDO1NBQUE7c0JBckJvQixjQUFjIn0=
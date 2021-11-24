var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "ui/component/Button", "utilities/Decorators", "../../action/Remove", "../../IDebugTools", "../component/InspectEntityInformationSubsection"], function (require, exports, Button_1, Decorators_1, Remove_1, IDebugTools_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class NpcInformation extends InspectEntityInformationSubsection_1.default {
        constructor() {
            super();
            new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonRemoveThing))
                .event.subscribe("activate", this.removeNPC)
                .appendTo(this);
        }
        update(entity) {
            this.npc = entity.asNPC;
            this.toggle(!!this.npc);
        }
        removeNPC() {
            Remove_1.default.execute(localPlayer, this.npc);
        }
    }
    __decorate([
        Decorators_1.Bound
    ], NpcInformation.prototype, "removeNPC", null);
    exports.default = NpcInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnBjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvTnBjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQVNBLE1BQXFCLGNBQWUsU0FBUSw0Q0FBa0M7UUFHN0U7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUVSLElBQUksZ0JBQU0sRUFBRTtpQkFDVixPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGlCQUFpQixDQUFDLENBQUM7aUJBQzdELEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7aUJBQzNDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBRWUsTUFBTSxDQUFDLE1BQStCO1lBQ3JELElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUdPLFNBQVM7WUFDaEIsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFJLENBQUMsQ0FBQztRQUN4QyxDQUFDO0tBQ0Q7SUFIQTtRQURDLGtCQUFLO21EQUdMO0lBcEJGLGlDQXFCQyJ9
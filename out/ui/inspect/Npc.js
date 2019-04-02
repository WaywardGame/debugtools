var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "entity/Entity", "entity/IEntity", "newui/component/Button", "utilities/Objects", "../../action/Remove", "../../IDebugTools", "../component/InspectEntityInformationSubsection"], function (require, exports, ActionExecutor_1, Entity_1, IEntity_1, Button_1, Objects_1, Remove_1, IDebugTools_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class NpcInformation extends InspectEntityInformationSubsection_1.default {
        constructor() {
            super();
            new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRemoveThing))
                .event.subscribe("activate", this.removeNPC)
                .appendTo(this);
        }
        update(entity) {
            this.npc = Entity_1.default.is(entity, IEntity_1.EntityType.NPC) ? entity : undefined;
            this.toggle(!!this.npc);
        }
        removeNPC() {
            ActionExecutor_1.default.get(Remove_1.default).execute(localPlayer, this.npc);
        }
    }
    __decorate([
        Objects_1.Bound
    ], NpcInformation.prototype, "removeNPC", null);
    exports.default = NpcInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnBjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvTnBjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWFBLE1BQXFCLGNBQWUsU0FBUSw0Q0FBa0M7UUFHN0U7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUVSLElBQUksZ0JBQU0sRUFBRTtpQkFDVixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2lCQUM3RCxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO2lCQUMzQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQztRQUVNLE1BQU0sQ0FBQyxNQUFrQztZQUMvQyxJQUFJLENBQUMsR0FBRyxHQUFHLGdCQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxvQkFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUNsRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUdPLFNBQVM7WUFDaEIsd0JBQWMsQ0FBQyxHQUFHLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUksQ0FBQyxDQUFDO1FBQzVELENBQUM7S0FDRDtJQUhBO1FBREMsZUFBSzttREFHTDtJQXBCRixpQ0FxQkMifQ==
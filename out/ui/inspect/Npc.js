var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/Button", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools", "./Human"], function (require, exports, Button_1, Objects_1, Actions_1, DebugTools_1, IDebugTools_1, Human_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class NpcInformation extends Human_1.default {
        constructor(api, npc) {
            super(api, npc);
            this.npc = npc;
            new Button_1.default(api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRemoveThing))
                .on(Button_1.ButtonEvent.Activate, this.removeNPC)
                .appendTo(this);
        }
        removeNPC() {
            Actions_1.default.get("remove").execute({ npc: this.npc });
        }
    }
    __decorate([
        Objects_1.Bound
    ], NpcInformation.prototype, "removeNPC", null);
    exports.default = NpcInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnBjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvTnBjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQVNBLE1BQXFCLGNBQWUsU0FBUSxlQUFnQjtRQUMzRCxZQUFtQixHQUFVLEVBQW1CLEdBQVM7WUFDeEQsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUQrQixRQUFHLEdBQUgsR0FBRyxDQUFNO1lBR3hELElBQUksZ0JBQU0sQ0FBQyxHQUFHLENBQUM7aUJBQ2IsT0FBTyxDQUFDLHdCQUFXLENBQUMsbUNBQXFCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztpQkFDN0QsRUFBRSxDQUFDLG9CQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7aUJBQ3hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBR08sU0FBUztZQUNoQixpQkFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQztLQUNEO0lBSEE7UUFEQyxlQUFLO21EQUdMO0lBYkYsaUNBY0MifQ==
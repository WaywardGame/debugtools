var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "language/Translation", "mod/Mod", "newui/component/Button", "utilities/Arrays", "../../action/Heal", "../../action/Remove", "../../IDebugTools", "../../util/Array", "../component/InspectInformationSection"], function (require, exports, ActionExecutor_1, Translation_1, Mod_1, Button_1, Arrays_1, Heal_1, Remove_1, IDebugTools_1, Array_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let CorpseInformation = (() => {
        class CorpseInformation extends InspectInformationSection_1.default {
            constructor() {
                super();
                this.corpses = [];
                new Button_1.default()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonResurrectCorpse))
                    .event.subscribe("activate", this.resurrect)
                    .appendTo(this);
                new Button_1.default()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRemoveThing))
                    .event.subscribe("activate", this.removeCorpse)
                    .appendTo(this);
            }
            getTabs() {
                return this.corpses.entries().stream()
                    .map(([i, corpse]) => Arrays_1.Tuple(i, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.CorpseName)
                    .get(corpseManager.getName(corpse, false).inContext(Translation_1.TextContext.Title))))
                    .toArray();
            }
            setTab(corpse) {
                this.corpse = this.corpses[corpse];
                return this;
            }
            update(position, tile) {
                const corpses = [...tile.corpses || []];
                if (Array_1.areArraysIdentical(corpses, this.corpses))
                    return;
                this.corpses = corpses;
                if (!this.corpses.length)
                    return;
                this.setShouldLog();
            }
            logUpdate() {
                for (const corpse of this.corpses) {
                    this.LOG.info("Corpse:", corpse);
                }
            }
            resurrect() {
                ActionExecutor_1.default.get(Heal_1.default).execute(localPlayer, this.corpse);
                this.event.emit("update");
            }
            removeCorpse() {
                ActionExecutor_1.default.get(Remove_1.default).execute(localPlayer, this.corpse);
                this.event.emit("update");
            }
        }
        __decorate([
            Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
        ], CorpseInformation.prototype, "LOG", void 0);
        __decorate([
            Override
        ], CorpseInformation.prototype, "getTabs", null);
        __decorate([
            Override
        ], CorpseInformation.prototype, "setTab", null);
        __decorate([
            Override
        ], CorpseInformation.prototype, "update", null);
        __decorate([
            Override
        ], CorpseInformation.prototype, "logUpdate", null);
        __decorate([
            Bound
        ], CorpseInformation.prototype, "resurrect", null);
        __decorate([
            Bound
        ], CorpseInformation.prototype, "removeCorpse", null);
        return CorpseInformation;
    })();
    exports.default = CorpseInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ycHNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvQ29ycHNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWdCQTtRQUFBLE1BQXFCLGlCQUFrQixTQUFRLG1DQUF5QjtZQVF2RTtnQkFDQyxLQUFLLEVBQUUsQ0FBQztnQkFKRCxZQUFPLEdBQWMsRUFBRSxDQUFDO2dCQU0vQixJQUFJLGdCQUFNLEVBQUU7cUJBQ1YsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMscUJBQXFCLENBQUMsQ0FBQztxQkFDakUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztxQkFDM0MsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVqQixJQUFJLGdCQUFNLEVBQUU7cUJBQ1YsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztxQkFDN0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztxQkFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLENBQUM7WUFFZ0IsT0FBTztnQkFDdkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRTtxQkFDcEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxVQUFVLENBQUM7cUJBQ2hGLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMseUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3pFLE9BQU8sRUFBRSxDQUFDO1lBQ2IsQ0FBQztZQUVnQixNQUFNLENBQUMsTUFBYztnQkFDckMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuQyxPQUFPLElBQUksQ0FBQztZQUNiLENBQUM7WUFFZ0IsTUFBTSxDQUFDLFFBQWtCLEVBQUUsSUFBVztnQkFDdEQsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBRXhDLElBQUksMEJBQWtCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7b0JBQUUsT0FBTztnQkFDdEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Z0JBRXZCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07b0JBQUUsT0FBTztnQkFFakMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3JCLENBQUM7WUFFZ0IsU0FBUztnQkFDekIsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQ2pDO1lBQ0YsQ0FBQztZQUdPLFNBQVM7Z0JBQ2hCLHdCQUFjLENBQUMsR0FBRyxDQUFDLGNBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU8sQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQixDQUFDO1lBR08sWUFBWTtnQkFDbkIsd0JBQWMsQ0FBQyxHQUFHLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU8sQ0FBQyxDQUFDO2dCQUM5RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQixDQUFDO1NBQ0Q7UUEzREE7WUFEQyxhQUFHLENBQUMsR0FBRyxDQUFDLDRCQUFjLENBQUM7c0RBQ0M7UUFtQmY7WUFBVCxRQUFRO3dEQUtSO1FBRVM7WUFBVCxRQUFRO3VEQUdSO1FBRVM7WUFBVCxRQUFRO3VEQVNSO1FBRVM7WUFBVCxRQUFROzBEQUlSO1FBR0Q7WUFEQyxLQUFLOzBEQUlMO1FBR0Q7WUFEQyxLQUFLOzZEQUlMO1FBQ0Ysd0JBQUM7U0FBQTtzQkE5RG9CLGlCQUFpQiJ9
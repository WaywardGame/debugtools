var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "language/ITranslation", "mod/Mod", "ui/component/Button", "utilities/collection/Arrays", "utilities/Decorators", "../../action/Heal", "../../action/Remove", "../../IDebugTools", "../../util/Array", "../component/InspectInformationSection"], function (require, exports, ITranslation_1, Mod_1, Button_1, Arrays_1, Decorators_1, Heal_1, Remove_1, IDebugTools_1, Array_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CorpseInformation extends InspectInformationSection_1.default {
        constructor() {
            super();
            this.corpses = [];
            new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonResurrectCorpse))
                .event.subscribe("activate", this.resurrect)
                .appendTo(this);
            new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonRemoveThing))
                .event.subscribe("activate", this.removeCorpse)
                .appendTo(this);
        }
        getTabs() {
            return this.corpses.entries().stream()
                .map(([i, corpse]) => (0, Arrays_1.Tuple)(i, () => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.CorpseName)
                .get(localIsland.corpses.getName(corpse, false).inContext(ITranslation_1.TextContext.Title))))
                .toArray();
        }
        setTab(corpse) {
            this.corpse = this.corpses[corpse];
            return this;
        }
        update(position, tile) {
            const corpses = [...tile.corpses || []];
            if ((0, Array_1.areArraysIdentical)(corpses, this.corpses))
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
            Heal_1.default.execute(localPlayer, this.corpse);
            this.event.emit("update");
        }
        removeCorpse() {
            Remove_1.default.execute(localPlayer, this.corpse);
            this.event.emit("update");
        }
    }
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], CorpseInformation.prototype, "LOG", void 0);
    __decorate([
        Decorators_1.Bound
    ], CorpseInformation.prototype, "resurrect", null);
    __decorate([
        Decorators_1.Bound
    ], CorpseInformation.prototype, "removeCorpse", null);
    exports.default = CorpseInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ycHNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvQ29ycHNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWdCQSxNQUFxQixpQkFBa0IsU0FBUSxtQ0FBeUI7UUFRdkU7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUpELFlBQU8sR0FBYSxFQUFFLENBQUM7WUFNOUIsSUFBSSxnQkFBTSxFQUFFO2lCQUNWLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMscUJBQXFCLENBQUMsQ0FBQztpQkFDakUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztpQkFDM0MsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksZ0JBQU0sRUFBRTtpQkFDVixPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGlCQUFpQixDQUFDLENBQUM7aUJBQzdELEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUM7aUJBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBRWUsT0FBTztZQUN0QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFO2lCQUNwQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBQSxjQUFLLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxVQUFVLENBQUM7aUJBQ2hGLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLDBCQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUMvRSxPQUFPLEVBQUUsQ0FBQztRQUNiLENBQUM7UUFFZSxNQUFNLENBQUMsTUFBYztZQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkMsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRWUsTUFBTSxDQUFDLFFBQWtCLEVBQUUsSUFBVztZQUNyRCxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztZQUV4QyxJQUFJLElBQUEsMEJBQWtCLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQUUsT0FBTztZQUN0RCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUV2QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO2dCQUFFLE9BQU87WUFFakMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3JCLENBQUM7UUFFZSxTQUFTO1lBQ3hCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ2pDO1FBQ0YsQ0FBQztRQUdPLFNBQVM7WUFDaEIsY0FBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU8sQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFHTyxZQUFZO1lBQ25CLGdCQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0IsQ0FBQztLQUNEO0lBM0RBO1FBREMsYUFBRyxDQUFDLEdBQUcsQ0FBQyw0QkFBYyxDQUFDO2tEQUNDO0lBaUR6QjtRQURDLGtCQUFLO3NEQUlMO0lBR0Q7UUFEQyxrQkFBSzt5REFJTDtJQTdERixvQ0E4REMifQ==
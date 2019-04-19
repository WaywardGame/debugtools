var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "entity/creature/ICreature", "mod/Mod", "newui/component/Button", "utilities/Arrays", "../../action/Heal", "../../action/Remove", "../../IDebugTools", "../../util/Array", "../component/InspectInformationSection"], function (require, exports, ActionExecutor_1, ICreature_1, Mod_1, Button_1, Arrays_1, Heal_1, Remove_1, IDebugTools_1, Array_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CorpseInformation extends InspectInformationSection_1.default {
        constructor() {
            super();
            this.corpses = [];
            this.resurrectButton = new Button_1.default()
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
                .map(([i, corpse]) => Arrays_1.tuple(i, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.CorpseName)
                .get(corpseManager.getName(corpse, false).inContext(3))))
                .toArray();
        }
        setTab(corpse) {
            this.corpse = this.corpses[corpse];
            this.resurrectButton.toggle(this.corpse.type !== ICreature_1.CreatureType.Blood && this.corpse.type !== ICreature_1.CreatureType.WaterBlood);
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
    exports.default = CorpseInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ycHNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvQ29ycHNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWlCQSxNQUFxQixpQkFBa0IsU0FBUSxtQ0FBeUI7UUFVdkU7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUpELFlBQU8sR0FBYyxFQUFFLENBQUM7WUFNL0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGdCQUFNLEVBQUU7aUJBQ2pDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLHFCQUFxQixDQUFDLENBQUM7aUJBQ2pFLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7aUJBQzNDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLGdCQUFNLEVBQUU7aUJBQ1YsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztpQkFDN0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztpQkFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFZ0IsT0FBTztZQUN2QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFO2lCQUNwQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFVBQVUsQ0FBQztpQkFDaEYsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLFNBQVMsR0FBbUIsQ0FBQyxDQUFDLENBQUM7aUJBQ3pFLE9BQU8sRUFBRSxDQUFDO1FBQ2IsQ0FBQztRQUVnQixNQUFNLENBQUMsTUFBYztZQUNyQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFbkMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssd0JBQVksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssd0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVySCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFFZ0IsTUFBTSxDQUFDLFFBQWtCLEVBQUUsSUFBVztZQUN0RCxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztZQUV4QyxJQUFJLDBCQUFrQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUFFLE9BQU87WUFDdEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFFdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTtnQkFBRSxPQUFPO1lBRWpDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNyQixDQUFDO1FBRWdCLFNBQVM7WUFDekIsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDakM7UUFDRixDQUFDO1FBR08sU0FBUztZQUNoQix3QkFBYyxDQUFDLEdBQUcsQ0FBQyxjQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFPLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBR08sWUFBWTtZQUNuQix3QkFBYyxDQUFDLEdBQUcsQ0FBQyxnQkFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTyxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0IsQ0FBQztLQUNEO0lBaEVBO1FBREMsYUFBRyxDQUFDLEdBQUcsQ0FBQyw0QkFBYyxDQUFDO2tEQUNDO0lBcUJmO1FBQVQsUUFBUTtvREFLUjtJQUVTO1FBQVQsUUFBUTttREFNUjtJQUVTO1FBQVQsUUFBUTttREFTUjtJQUVTO1FBQVQsUUFBUTtzREFJUjtJQUdEO1FBREMsS0FBSztzREFJTDtJQUdEO1FBREMsS0FBSzt5REFJTDtJQWxFRixvQ0FtRUMifQ==
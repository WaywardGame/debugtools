var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "mod/Mod", "newui/component/Button", "utilities/Arrays", "utilities/Collectors", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools", "../../util/Array", "../component/InspectInformationSection"], function (require, exports, Enums_1, Mod_1, Button_1, Arrays_1, Collectors_1, Objects_1, Actions_1, DebugTools_1, IDebugTools_1, Array_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CorpseInformation extends InspectInformationSection_1.default {
        constructor(api) {
            super(api);
            this.corpses = [];
            this.resurrectButton = new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonResurrectCorpse))
                .on(Button_1.ButtonEvent.Activate, this.resurrect)
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRemoveThing))
                .on(Button_1.ButtonEvent.Activate, this.removeCorpse)
                .appendTo(this);
        }
        getTabs() {
            return this.corpses.entries()
                .map(([i, corpse]) => Arrays_1.tuple(i, () => DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.CorpseName)
                .get(game.getName(corpse, Enums_1.SentenceCaseStyle.Title, false))))
                .collect(Collectors_1.default.toArray);
        }
        setTab(corpse) {
            this.corpse = this.corpses[corpse];
            this.resurrectButton.toggle(this.corpse.type !== Enums_1.CreatureType.Blood && this.corpse.type !== Enums_1.CreatureType.WaterBlood);
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
            Actions_1.default.get("heal").execute({ object: this.corpse.id });
            this.trigger("update");
        }
        removeCorpse() {
            Actions_1.default.get("remove").execute({ object: [Actions_1.RemovalType.Corpse, this.corpse.id] });
            this.trigger("update");
        }
    }
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], CorpseInformation.prototype, "LOG", void 0);
    __decorate([
        Objects_1.Bound
    ], CorpseInformation.prototype, "resurrect", null);
    __decorate([
        Objects_1.Bound
    ], CorpseInformation.prototype, "removeCorpse", null);
    exports.default = CorpseInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ycHNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvQ29ycHNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWlCQSxNQUFxQixpQkFBa0IsU0FBUSxtQ0FBeUI7UUFVdkUsWUFBbUIsR0FBVTtZQUM1QixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFKSixZQUFPLEdBQWMsRUFBRSxDQUFDO1lBTS9CLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3pDLE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLHFCQUFxQixDQUFDLENBQUM7aUJBQ2pFLEVBQUUsQ0FBQyxvQkFBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO2lCQUN4QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ2xCLE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLGlCQUFpQixDQUFDLENBQUM7aUJBQzdELEVBQUUsQ0FBQyxvQkFBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDO2lCQUMzQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQztRQUVNLE9BQU87WUFDYixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO2lCQUMzQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLFVBQVUsQ0FBQztpQkFDaEYsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLHlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVELE9BQU8sQ0FBQyxvQkFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFTSxNQUFNLENBQUMsTUFBYztZQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFbkMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssb0JBQVksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssb0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVySCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFFTSxNQUFNLENBQUMsUUFBa0IsRUFBRSxJQUFXO1lBQzVDLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBRXhDLElBQUksMEJBQWtCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQUUsT0FBTztZQUN0RCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUV2QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO2dCQUFFLE9BQU87WUFFakMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3JCLENBQUM7UUFFTSxTQUFTO1lBQ2YsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDakM7UUFDRixDQUFDO1FBR08sU0FBUztZQUNoQixpQkFBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUdPLFlBQVk7WUFDbkIsaUJBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMscUJBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QixDQUFDO0tBQ0Q7SUFoRUE7UUFEQyxhQUFHLENBQUMsR0FBRyxDQUFDLDRCQUFjLENBQUM7a0RBQ0M7SUFzRHpCO1FBREMsZUFBSztzREFJTDtJQUdEO1FBREMsZUFBSzt5REFJTDtJQWxFRixvQ0FtRUMifQ==
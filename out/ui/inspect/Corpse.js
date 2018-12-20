var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "action/ActionExecutor", "Enums", "mod/Mod", "newui/component/Button", "utilities/iterable/Collectors", "utilities/iterable/Generators", "utilities/Objects", "../../action/Heal", "../../action/Remove", "../../IDebugTools", "../../util/Array", "../component/InspectInformationSection"], function (require, exports, ActionExecutor_1, Enums_1, Mod_1, Button_1, Collectors_1, Generators_1, Objects_1, Heal_1, Remove_1, IDebugTools_1, Array_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CorpseInformation extends InspectInformationSection_1.default {
        constructor(gsapi) {
            super(gsapi);
            this.corpses = [];
            this.resurrectButton = new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonResurrectCorpse))
                .on(Button_1.ButtonEvent.Activate, this.resurrect)
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRemoveThing))
                .on(Button_1.ButtonEvent.Activate, this.removeCorpse)
                .appendTo(this);
        }
        getTabs() {
            return this.corpses.entries()
                .map(([i, corpse]) => Generators_1.tuple(i, () => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.CorpseName)
                .get(corpseManager.getName(corpse, false).inContext(3))))
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
            ActionExecutor_1.default.get(Heal_1.default).execute(localPlayer, this.corpse);
            this.emit("update");
        }
        removeCorpse() {
            ActionExecutor_1.default.get(Remove_1.default).execute(localPlayer, this.corpse);
            this.emit("update");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ycHNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL2luc3BlY3QvQ29ycHNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQW1CQSxNQUFxQixpQkFBa0IsU0FBUSxtQ0FBeUI7UUFVdkUsWUFBbUIsS0FBcUI7WUFDdkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBSk4sWUFBTyxHQUFjLEVBQUUsQ0FBQztZQU0vQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUN6QyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2lCQUNqRSxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztpQkFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUNsQixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2lCQUM3RCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztpQkFDM0MsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFTSxPQUFPO1lBQ2IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtpQkFDM0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLGtCQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsVUFBVSxDQUFDO2lCQUNoRixHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFtQixDQUFDLENBQUMsQ0FBQztpQkFDekUsT0FBTyxDQUFDLG9CQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUVNLE1BQU0sQ0FBQyxNQUFjO1lBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVuQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxvQkFBWSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxvQkFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRXJILE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUVNLE1BQU0sQ0FBQyxRQUFrQixFQUFFLElBQVc7WUFDNUMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7WUFFeEMsSUFBSSwwQkFBa0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFBRSxPQUFPO1lBQ3RELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBRXZCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07Z0JBQUUsT0FBTztZQUVqQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDckIsQ0FBQztRQUVNLFNBQVM7WUFDZixLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQzthQUNqQztRQUNGLENBQUM7UUFHTyxTQUFTO1lBQ2hCLHdCQUFjLENBQUMsR0FBRyxDQUFDLGNBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU8sQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUdPLFlBQVk7WUFDbkIsd0JBQWMsQ0FBQyxHQUFHLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU8sQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckIsQ0FBQztLQUNEO0lBaEVBO1FBREMsYUFBRyxDQUFDLEdBQUcsQ0FBQyw0QkFBYyxDQUFDO2tEQUNDO0lBc0R6QjtRQURDLGVBQUs7c0RBSUw7SUFHRDtRQURDLGVBQUs7eURBSUw7SUFsRUYsb0NBbUVDIn0=
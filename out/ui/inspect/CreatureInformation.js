/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "ui/component/Button", "ui/component/CheckButton", "utilities/Decorators", "../../action/Remove", "../../action/SetTamed", "../../IDebugTools", "../component/InspectEntityInformationSubsection"], function (require, exports, Button_1, CheckButton_1, Decorators_1, Remove_1, SetTamed_1, IDebugTools_1, InspectEntityInformationSubsection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CreatureInformation extends InspectEntityInformationSubsection_1.default {
        constructor() {
            super();
            this.tamedButton = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonTameCreature))
                .setRefreshMethod(() => this.creature ? this.creature.isTamed() : false)
                .event.subscribe("toggle", this.setTamed)
                .appendTo(this);
            new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonRemoveThing))
                .event.subscribe("activate", this.removeCreature)
                .appendTo(this);
        }
        update(entity) {
            this.creature = entity.asCreature;
            this.tamedButton.refresh();
            this.toggle(!!this.creature);
        }
        setTamed(_, tamed) {
            SetTamed_1.default.execute(localPlayer, this.creature, tamed);
        }
        removeCreature() {
            Remove_1.default.execute(localPlayer, this.creature);
        }
    }
    exports.default = CreatureInformation;
    __decorate([
        Decorators_1.Bound
    ], CreatureInformation.prototype, "setTamed", null);
    __decorate([
        Decorators_1.Bound
    ], CreatureInformation.prototype, "removeCreature", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXR1cmVJbmZvcm1hdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L0NyZWF0dXJlSW5mb3JtYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7Ozs7Ozs7O0lBWUgsTUFBcUIsbUJBQW9CLFNBQVEsNENBQWtDO1FBSWxGO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDbEMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2lCQUM5RCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7aUJBQ3ZFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7aUJBQ3hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLGdCQUFNLEVBQUU7aUJBQ1YsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2lCQUM3RCxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDO2lCQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQztRQUVlLE1BQU0sQ0FBQyxNQUFjO1lBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNsQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBR08sUUFBUSxDQUFDLENBQU0sRUFBRSxLQUFjO1lBQ3RDLGtCQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFHTyxjQUFjO1lBQ3JCLGdCQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUyxDQUFDLENBQUM7UUFDN0MsQ0FBQztLQUNEO0lBbENELHNDQWtDQztJQVJRO1FBRFAsa0JBQUs7dURBR0w7SUFHTztRQURQLGtCQUFLOzZEQUdMIn0=
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
define(["require", "exports", "ui/component/CheckButton", "ui/component/Component", "ui/component/dropdown/CreatureDropdown", "ui/component/LabelledRow", "utilities/Decorators", "../../IDebugTools"], function (require, exports, CheckButton_1, Component_1, CreatureDropdown_1, LabelledRow_1, Decorators_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CreaturePaint extends Component_1.default {
        constructor() {
            super();
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelCreature)))
                .append(this.dropdown = new CreatureDropdown_1.default("nochange", [
                ["nochange", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.PaintNoChange))],
                ["remove", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.PaintRemove))],
            ])
                .event.subscribe("selection", this.changeCreature))
                .appendTo(this);
            this.aberrantCheckButton = new CheckButton_1.CheckButton()
                .hide()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonToggleAberrant))
                .appendTo(this);
        }
        getTilePaintData() {
            return this.creature === undefined ? undefined : {
                creature: {
                    type: this.creature,
                    aberrant: this.aberrantCheckButton.checked,
                },
            };
        }
        isChanging() {
            return this.creature !== undefined;
        }
        reset() {
            this.dropdown.select("nochange");
        }
        changeCreature(_, creature) {
            this.creature = creature === "nochange" ? undefined : creature === "remove" ? "remove" : creature;
            this.aberrantCheckButton.toggle(this.creature !== undefined && this.creature !== "remove");
            this.event.emit("change");
        }
    }
    __decorate([
        Decorators_1.Bound
    ], CreaturePaint.prototype, "changeCreature", null);
    exports.default = CreaturePaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvcGFpbnQvQ3JlYXR1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7Ozs7Ozs7O0lBYUgsTUFBcUIsYUFBYyxTQUFRLG1CQUFTO1FBUW5EO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztpQkFDbEYsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSwwQkFBZ0IsQ0FBQyxVQUFVLEVBQUU7Z0JBQ3hELENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDeEYsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2FBQ3BGLENBQUM7aUJBQ0EsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUNuRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDMUMsSUFBSSxFQUFFO2lCQUNOLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztpQkFDaEUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFTSxnQkFBZ0I7WUFDdEIsT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsUUFBUSxFQUFFO29CQUNULElBQUksRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDbkIsUUFBUSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPO2lCQUMxQzthQUNELENBQUM7UUFDSCxDQUFDO1FBRU0sVUFBVTtZQUNoQixPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDO1FBQ3BDLENBQUM7UUFFTSxLQUFLO1lBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUdPLGNBQWMsQ0FBQyxDQUFNLEVBQUUsUUFBOEM7WUFDNUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBQ2xHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQztZQUUzRixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQixDQUFDO0tBQ0Q7SUFOUTtRQURQLGtCQUFLO3VEQU1MO0lBbERGLGdDQW1EQyJ9
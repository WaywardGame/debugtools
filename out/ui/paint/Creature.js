var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/creature/Creatures", "entity/creature/ICreature", "language/Dictionaries", "language/Translation", "newui/component/CheckButton", "newui/component/Component", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "utilities/Arrays", "utilities/enum/Enums", "utilities/Objects", "utilities/stream/Stream", "../../IDebugTools"], function (require, exports, Creatures_1, ICreature_1, Dictionaries_1, Translation_1, CheckButton_1, Component_1, Dropdown_1, LabelledRow_1, Text_1, Arrays_1, Enums_1, Objects_1, Stream_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CreaturePaint extends Component_1.default {
        constructor() {
            super();
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelCreature)))
                .append(this.dropdown = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: "nochange",
                options: Stream_1.default.of(["nochange", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))], ["remove", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRemove))])
                    .merge(Enums_1.default.values(ICreature_1.CreatureType)
                    .filter(creature => Creatures_1.creatureDescriptions[creature])
                    .map(creature => Arrays_1.tuple(ICreature_1.CreatureType[creature], Translation_1.default.nameOf(Dictionaries_1.Dictionary.Creature, creature, false).inContext(3)))
                    .sorted(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t)))),
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeCreature))
                .appendTo(this);
            this.aberrantCheckButton = new CheckButton_1.CheckButton()
                .hide()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleAberrant))
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
            this.creature = creature === "nochange" ? undefined : creature === "remove" ? "remove" : ICreature_1.CreatureType[creature];
            this.aberrantCheckButton.toggle(this.creature !== undefined && this.creature !== "remove");
            this.emit("change");
        }
    }
    __decorate([
        Objects_1.Bound
    ], CreaturePaint.prototype, "changeCreature", null);
    exports.default = CreaturePaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvcGFpbnQvQ3JlYXR1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBaUJBLE1BQXFCLGFBQWMsU0FBUSxtQkFBUztRQU1uRDtZQUNDLEtBQUssRUFBRSxDQUFDO1lBRVIsSUFBSSx5QkFBVyxFQUFFO2lCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2lCQUNsRixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGtCQUFRLEVBQXFEO2lCQUN2RixnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixhQUFhLEVBQUUsVUFBVTtnQkFDekIsT0FBTyxFQUFFLGdCQUFNLENBQUMsRUFBRSxDQUNqQixDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQ3hGLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FDcEY7cUJBQ0MsS0FBSyxDQUFDLGVBQUssQ0FBQyxNQUFNLENBQUMsd0JBQVksQ0FBQztxQkFDL0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsZ0NBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7cUJBQ2xELEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGNBQUssQ0FDckIsd0JBQVksQ0FBQyxRQUFRLENBQThCLEVBQ25ELHFCQUFXLENBQUMsTUFBTSxDQUFDLHlCQUFVLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQW1CLENBQ3JGLENBQUM7cUJBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUM5RSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdEUsQ0FBQyxDQUFDO2lCQUNGLEVBQUUsQ0FBQyx3QkFBYSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7aUJBQ2xELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSx5QkFBVyxFQUFFO2lCQUMxQyxJQUFJLEVBQUU7aUJBQ04sT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztpQkFDaEUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFTSxnQkFBZ0I7WUFDdEIsT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsUUFBUSxFQUFFO29CQUNULElBQUksRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDbkIsUUFBUSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPO2lCQUMxQzthQUNELENBQUM7UUFDSCxDQUFDO1FBRU0sVUFBVTtZQUNoQixPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDO1FBQ3BDLENBQUM7UUFFTSxLQUFLO1lBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUdPLGNBQWMsQ0FBQyxDQUFNLEVBQUUsUUFBMkQ7WUFDekYsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsd0JBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoSCxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUM7WUFFM0YsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQixDQUFDO0tBQ0Q7SUFOQTtRQURDLGVBQUs7dURBTUw7SUE1REYsZ0NBNkRDIn0=
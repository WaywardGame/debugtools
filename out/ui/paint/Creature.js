var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "creature/Creatures", "Enums", "language/Translation", "newui/component/CheckButton", "newui/component/Component", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "utilities/Collectors", "utilities/enum/Enums", "utilities/Objects", "../../DebugTools", "../../IDebugTools"], function (require, exports, Creatures_1, Enums_1, Translation_1, CheckButton_1, Component_1, Dropdown_1, LabelledRow_1, Text_1, Collectors_1, Enums_2, Objects_1, DebugTools_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CreaturePaint extends Component_1.default {
        constructor(api) {
            super(api);
            new LabelledRow_1.LabelledRow(api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelCreature)))
                .append(this.dropdown = new Dropdown_1.default(api)
                .setRefreshMethod(() => ({
                defaultOption: "nochange",
                options: [
                    ["nochange", option => option.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))],
                    ["remove", option => option.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRemove))],
                ].values().include(Enums_2.default.values(Enums_1.CreatureType)
                    .filter(creature => Creatures_1.creatureDescriptions[creature])
                    .map(creature => [Enums_1.CreatureType[creature], Translation_1.default.ofObjectName(Creatures_1.creatureDescriptions[creature], Enums_1.SentenceCaseStyle.Title, false)])
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => [id, option => option.setText(t)])),
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeCreature))
                .appendTo(this);
            this.aberrantCheckButton = new CheckButton_1.CheckButton(api)
                .hide()
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleAberrant))
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
            this.creature = creature === "nochange" ? undefined : creature === "remove" ? "remove" : Enums_1.CreatureType[creature];
            this.aberrantCheckButton.toggle(this.creature !== undefined && this.creature !== "remove");
        }
    }
    __decorate([
        Objects_1.Bound
    ], CreaturePaint.prototype, "changeCreature", null);
    exports.default = CreaturePaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvcGFpbnQvQ3JlYXR1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBaUJBLE1BQXFCLGFBQWMsU0FBUSxtQkFBUztRQU1uRCxZQUFtQixHQUFVO1lBQzVCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVYLElBQUkseUJBQVcsQ0FBQyxHQUFHLENBQUM7aUJBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2lCQUNsRixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGtCQUFRLENBQW9ELEdBQUcsQ0FBQztpQkFDMUYsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsYUFBYSxFQUFFLFVBQVU7Z0JBQ3pCLE9BQU8sRUFBRztvQkFDVCxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUN4RixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2lCQUNYLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLGVBQUssQ0FBQyxNQUFNLENBQUMsb0JBQVksQ0FBQztxQkFDcEgsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsZ0NBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7cUJBQ2xELEdBQUcsQ0FBb0QsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLG9CQUFZLENBQUMsUUFBUSxDQUE4QixFQUFFLHFCQUFXLENBQUMsWUFBWSxDQUFDLGdDQUFvQixDQUFDLFFBQVEsQ0FBRSxFQUFFLHlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO3FCQUNwTixPQUFPLENBQUMsb0JBQVUsQ0FBQyxPQUFPLENBQUM7cUJBQzNCLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDNUUsTUFBTSxFQUFFO3FCQUNSLEdBQUcsQ0FBcUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMxSCxDQUFDLENBQUM7aUJBQ0YsRUFBRSxDQUFDLHdCQUFhLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztpQkFDbEQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLHlCQUFXLENBQUMsR0FBRyxDQUFDO2lCQUM3QyxJQUFJLEVBQUU7aUJBQ04sT0FBTyxDQUFDLHdCQUFXLENBQUMsbUNBQXFCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztpQkFDaEUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFTSxnQkFBZ0I7WUFDdEIsT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsUUFBUSxFQUFFO29CQUNULElBQUksRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDbkIsUUFBUSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPO2lCQUMxQzthQUNELENBQUM7UUFDSCxDQUFDO1FBRU0sVUFBVTtZQUNoQixPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDO1FBQ3BDLENBQUM7UUFFTSxLQUFLO1lBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUdPLGNBQWMsQ0FBQyxDQUFNLEVBQUUsUUFBMkQ7WUFDekYsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsb0JBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoSCxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUM7UUFDNUYsQ0FBQztLQUNEO0lBSkE7UUFEQyxlQUFLO3VEQUlMO0lBeERGLGdDQXlEQyJ9
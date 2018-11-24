var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "language/Dictionaries", "language/Translation", "newui/component/CheckButton", "newui/component/Component", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "utilities/Arrays", "utilities/enum/Enums", "utilities/iterable/Collectors", "utilities/Objects", "../../IDebugTools"], function (require, exports, Enums_1, Dictionaries_1, Translation_1, CheckButton_1, Component_1, Dropdown_1, LabelledRow_1, Text_1, Arrays_1, Enums_2, Collectors_1, Objects_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CorpsePaint extends Component_1.default {
        constructor(api) {
            super(api);
            new LabelledRow_1.LabelledRow(api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelCorpse)))
                .append(this.dropdown = new Dropdown_1.default(api)
                .setRefreshMethod(() => ({
                defaultOption: "nochange",
                options: [
                    ["nochange", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))],
                    ["remove", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRemove))],
                ].values().include(Enums_2.default.values(Enums_1.CreatureType)
                    .map(creature => Arrays_1.tuple(Enums_1.CreatureType[creature], Translation_1.default.nameOf(Dictionaries_1.Dictionary.Creature, creature, false).inContext(3)
                    .setFailWith(corpseManager.getName(creature, false).inContext(3))))
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t)))),
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeCorpse))
                .appendTo(this);
            this.replaceExisting = new CheckButton_1.CheckButton(api)
                .hide()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonReplaceExisting))
                .appendTo(this);
            this.aberrantCheckButton = new CheckButton_1.CheckButton(api)
                .hide()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleAberrant))
                .appendTo(this);
        }
        getTilePaintData() {
            return {
                corpse: {
                    type: this.corpse,
                    aberrant: this.aberrantCheckButton.checked,
                    replaceExisting: this.replaceExisting.checked,
                },
            };
        }
        isChanging() {
            return this.corpse !== undefined || this.replaceExisting.checked;
        }
        reset() {
            this.dropdown.select("nochange");
        }
        changeCorpse(_, corpse) {
            this.corpse = corpse === "nochange" ? undefined : corpse === "remove" ? "remove" : Enums_1.CreatureType[corpse];
            const isReplaceable = this.corpse !== undefined && this.corpse !== "remove";
            this.aberrantCheckButton.toggle(isReplaceable);
            this.replaceExisting.toggle(isReplaceable);
            if (!isReplaceable)
                this.replaceExisting.setChecked(false);
            this.trigger("change");
        }
    }
    __decorate([
        Objects_1.Bound
    ], CorpsePaint.prototype, "changeCorpse", null);
    exports.default = CorpsePaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ycHNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhaW50L0NvcnBzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFpQkEsTUFBcUIsV0FBWSxTQUFRLG1CQUFTO1FBT2pELFlBQW1CLEdBQVU7WUFDNUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRVgsSUFBSSx5QkFBVyxDQUFDLEdBQUcsQ0FBQztpQkFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ2hGLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBb0QsR0FBRyxDQUFDO2lCQUMxRixnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixhQUFhLEVBQUUsVUFBVTtnQkFDekIsT0FBTyxFQUFHO29CQUNULENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ3hGLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ1gsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBWSxDQUFDO3FCQUNwSCxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxjQUFLLENBQ3JCLG9CQUFZLENBQUMsUUFBUSxDQUE4QixFQUNuRCxxQkFBVyxDQUFDLE1BQU0sQ0FBQyx5QkFBVSxDQUFDLFFB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
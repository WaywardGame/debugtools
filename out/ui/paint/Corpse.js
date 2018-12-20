var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "language/Dictionaries", "language/Translation", "newui/component/CheckButton", "newui/component/Component", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "utilities/enum/Enums", "utilities/iterable/Collectors", "utilities/iterable/Generators", "utilities/Objects", "../../IDebugTools"], function (require, exports, Enums_1, Dictionaries_1, Translation_1, CheckButton_1, Component_1, Dropdown_1, LabelledRow_1, Text_1, Enums_2, Collectors_1, Generators_1, Objects_1, IDebugTools_1) {
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
                    .map(creature => Generators_1.tuple(Enums_1.CreatureType[creature], Translation_1.default.nameOf(Dictionaries_1.Dictionary.Creature, creature, false).inContext(3)
                    .setFailWith(corpseManager.getName(creature, false).inContext(3))))
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => Generators_1.tuple(id, (option) => option.setText(t)))),
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
            this.emit("change");
        }
    }
    __decorate([
        Objects_1.Bound
    ], CorpsePaint.prototype, "changeCorpse", null);
    exports.default = CorpsePaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ycHNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhaW50L0NvcnBzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFpQkEsTUFBcUIsV0FBWSxTQUFRLG1CQUFTO1FBT2pELFlBQW1CLEdBQVU7WUFDNUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRVgsSUFBSSx5QkFBVyxDQUFDLEdBQUcsQ0FBQztpQkFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ2hGLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBb0QsR0FBRyxDQUFDO2lCQUMxRixnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixhQUFhLEVBQUUsVUFBVTtnQkFDekIsT0FBTyxFQUFHO29CQUNULENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ3hGLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ1gsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBWSxDQUFDO3FCQUNwSCxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxrQkFBSyxDQUNyQixvQkFBWSxDQUFDLFFBQVEsQ0FBOEIsRUFDbkQscUJBQVcsQ0FBQyxNQUFNLENBQUMseUJBQVUsQ0FBQyxR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
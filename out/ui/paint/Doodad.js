var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "doodad/IDoodad", "language/Dictionaries", "language/Translation", "newui/component/Component", "newui/component/LabelledRow", "newui/component/Text", "utilities/Arrays", "utilities/enum/Enums", "utilities/stream/Stream", "../../IDebugTools", "../component/GroupDropdown"], function (require, exports, IDoodad_1, Dictionaries_1, Translation_1, Component_1, LabelledRow_1, Text_1, Arrays_1, Enums_1, Stream_1, IDebugTools_1, GroupDropdown_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DoodadPaint extends Component_1.default {
        constructor() {
            super();
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelDoodad)))
                .append(this.dropdown = new DoodadDropdown()
                .event.subscribe("selection", this.changeDoodad))
                .appendTo(this);
        }
        getTilePaintData() {
            return this.doodad === undefined ? undefined : {
                doodad: {
                    type: this.doodad,
                },
            };
        }
        isChanging() {
            return this.doodad !== undefined;
        }
        reset() {
            this.dropdown.select("nochange");
        }
        changeDoodad(_, doodad) {
            this.doodad = doodad === "nochange" ? undefined : doodad === "remove" ? "remove" : IDoodad_1.DoodadType[doodad];
            this.event.emit("change");
        }
    }
    __decorate([
        Override
    ], DoodadPaint.prototype, "event", void 0);
    __decorate([
        Bound
    ], DoodadPaint.prototype, "changeDoodad", null);
    exports.default = DoodadPaint;
    class DoodadDropdown extends GroupDropdown_1.default {
        constructor() {
            super();
            this.setRefreshMethod(() => ({
                defaultOption: "nochange",
                options: Stream_1.default.of(["nochange", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))], ["remove", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRemove))])
                    .merge(Enums_1.default.values(IDoodad_1.DoodadType)
                    .filter(type => type !== IDoodad_1.DoodadType.Item)
                    .map(doodad => {
                    const translation = Translation_1.default.nameOf(Dictionaries_1.Dictionary.Doodad, doodad, false).inContext(Translation_1.TextContext.Title);
                    return {
                        type: IDoodad_1.DoodadType[doodad],
                        translation: translation,
                        translationString: Text_1.default.toString(translation),
                    };
                })
                    .sorted((o1, o2) => o1.translationString.localeCompare(o2.translationString))
                    .map(({ type, translation }) => Arrays_1.Tuple(type, (option) => option.setText(translation)))),
            }));
        }
        getGroupName(group) {
            return new Translation_1.default(Dictionaries_1.Dictionary.DoodadGroup, group).setFailWith("").getString();
        }
        isInGroup(optionName, group) {
            const doodad = IDoodad_1.DoodadType[optionName];
            return doodad === undefined ? false : doodadManager.isInGroup(doodad, group);
        }
        getGroups() {
            return Enums_1.default.values(IDoodad_1.DoodadTypeGroup);
        }
    }
    __decorate([
        Override
    ], DoodadDropdown.prototype, "getGroupName", null);
    __decorate([
        Override
    ], DoodadDropdown.prototype, "isInGroup", null);
    __decorate([
        Override
    ], DoodadDropdown.prototype, "getGroups", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vZGFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhaW50L0Rvb2RhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFrQkEsTUFBcUIsV0FBWSxTQUFRLG1CQUFTO1FBT2pEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ2hGLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksY0FBYyxFQUFFO2lCQUMxQyxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQ2pELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBRU0sZ0JBQWdCO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sRUFBRTtvQkFDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU07aUJBQ2pCO2FBQ0QsQ0FBQztRQUNILENBQUM7UUFFTSxVQUFVO1lBQ2hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUM7UUFDbEMsQ0FBQztRQUVNLEtBQUs7WUFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBR08sWUFBWSxDQUFDLENBQU0sRUFBRSxNQUF1RDtZQUNuRixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxL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
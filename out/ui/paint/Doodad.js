var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "doodad/IDoodad", "language/Dictionaries", "language/Translation", "newui/component/Component", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "utilities/Arrays", "utilities/enum/Enums", "utilities/stream/Stream", "../../IDebugTools"], function (require, exports, IDoodad_1, Dictionaries_1, Translation_1, Component_1, Dropdown_1, LabelledRow_1, Text_1, Arrays_1, Enums_1, Stream_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DoodadPaint extends Component_1.default {
        constructor() {
            super();
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelDoodad)))
                .append(this.dropdown = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: "nochange",
                options: Stream_1.default.of(["nochange", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))], ["remove", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRemove))])
                    .merge(Enums_1.default.values(IDoodad_1.DoodadType)
                    .filter(type => type !== IDoodad_1.DoodadType.Item)
                    .map(doodad => {
                    const translation = Translation_1.default.nameOf(Dictionaries_1.Dictionary.Doodad, doodad, false).inContext(3);
                    return {
                        type: IDoodad_1.DoodadType[doodad],
                        translation: translation,
                        translationString: Text_1.default.toString(translation),
                    };
                })
                    .sorted((o1, o2) => o1.translationString.localeCompare(o2.translationString))
                    .map(({ type, translation }) => Arrays_1.tuple(type, (option) => option.setText(translation)))),
            }))
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vZGFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhaW50L0Rvb2RhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFpQkEsTUFBcUIsV0FBWSxTQUFRLG1CQUFTO1FBT2pEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ2hGLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksa0JBQVEsRUFBbUQ7aUJBQ3JGLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLGFBQWEsRUFBRSxVQUFVO2dCQUN6QixPQUFPLEVBQUUsZ0JBQU0sQ0FBQyxFQUFFLENBQ2pCLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFDeEYsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUNwRjtxQkFDQyxLQUFLLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxvQkFBVSxDQUFDO3FCQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssb0JBQVUsQ0FBQyxJQUFJLENBQUM7cUJBQ3hDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDYixNQUFNLFdBQVcsR0FBRyxxQkFBVyxDQUFDLE1BQU0sQ0FBQyx5QkFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFtQixDQUFDO29CQUN0RyxPQUFPO3dCQUNOLElBQUksRUFBRSxvQkFBVSxDQUFDLE1BQU0sQ0FBNEI7d0JBQ25ELFdBQVcsRUFBRSxXQUFXO3dCQUN4QixpQkFBaUIsRUFBRSxjQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztxQkFDN0MsQ0FBQztnQkFDSCxDQUFDLENBQUM7cUJBQ0QsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQztxQkFDNUUsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxDQUFDLGNBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2hHLENBQUMsQ0FBQztpQkFDRixLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQ2pELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBRU0sZ0JBQWdCO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sRUFBRTtvQkFDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU07aUJBQ2pCO2FBQ0QsQ0FBQztRQUNILENBQUM7UUFFTSxVQUFVO1lBQ2hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUM7UUFDbEMsQ0FBQztRQUVNLEtBQUs7WUFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBR08sWUFBWSxDQUFDLENBQU0sRUFBRSxNQUF1RDtZQUNuRixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXRHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNCLENBQUM7S0FDRDtJQTFEVTtRQUFULFFBQVE7OENBQTBEO0lBcURuRTtRQURDLEtBQUs7bURBS0w7SUExREYsOEJBMkRDIn0=
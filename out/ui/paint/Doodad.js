var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "doodad/Doodads", "Enums", "language/Translation", "newui/component/Component", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "utilities/Collectors", "utilities/enum/Enums", "utilities/Objects", "../../DebugTools", "../../IDebugTools"], function (require, exports, Doodads_1, Enums_1, Translation_1, Component_1, Dropdown_1, LabelledRow_1, Text_1, Collectors_1, Enums_2, Objects_1, DebugTools_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DoodadPaint extends Component_1.default {
        constructor(api) {
            super(api);
            new LabelledRow_1.LabelledRow(api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelDoodad)))
                .append(new Dropdown_1.default(api)
                .setRefreshMethod(() => ({
                defaultOption: "nochange",
                options: [
                    ["nochange", option => option.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))],
                    ["remove", option => option.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRemove))],
                ].values().include(Enums_2.default.values(Enums_1.DoodadType)
                    .filter(type => type !== Enums_1.DoodadType.Item)
                    .map(doodad => [Enums_1.DoodadType[doodad], Translation_1.default.ofObjectName(Doodads_1.doodadDescriptions[doodad], Enums_1.SentenceCaseStyle.Title, false)])
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => [id, option => option.setText(t)])),
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeDoodad))
                .appendTo(this);
        }
        getTilePaintData() {
            return this.doodad === undefined ? undefined : {
                doodad: {
                    type: this.doodad,
                },
            };
        }
        changeDoodad(_, doodad) {
            this.doodad = doodad === "nochange" ? undefined : doodad === "remove" ? "remove" : Enums_1.DoodadType[doodad];
        }
    }
    __decorate([
        Objects_1.Bound
    ], DoodadPaint.prototype, "changeDoodad", null);
    exports.default = DoodadPaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vZGFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhaW50L0Rvb2RhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFnQkEsTUFBcUIsV0FBWSxTQUFRLG1CQUFTO1FBR2pELFlBQW1CLEdBQVU7WUFDNUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRVgsSUFBSSx5QkFBVyxDQUFDLEdBQUcsQ0FBQztpQkFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ2hGLE1BQU0sQ0FBQyxJQUFJLGtCQUFRLENBQUMsR0FBRyxDQUFDO2lCQUN2QixnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixhQUFhLEVBQUUsVUFBVTtnQkFDekIsT0FBTyxFQUFHO29CQUNULENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ3hGLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQzlELENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLGVBQUssQ0FBQyxNQUFNLENBQUMsa0JBQVUsQ0FBQztxQkFDL0QsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLGtCQUFVLENBQUMsSUFBSSxDQUFDO3FCQUN4QyxHQUFHLENBQWlDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLHFCQUFXLENBQUMsWUFBWSxDQUFDLDRCQUFrQixDQUFDLE1BQU0sQ0FBRSxFQUFFLHlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO3FCQUMxSixPQUFPLENBQUMsb0JBQVUsQ0FBQyxPQUFPLENBQUM7cUJBQzNCLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDNUUsTUFBTSxFQUFFO3FCQUNSLEdBQUcsQ0FBa0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN2RSxDQUFDLENBQUM7aUJBQ0YsRUFBRSxDQUFDLHdCQUFhLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDaEQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFTSxnQkFBZ0I7WUFDdEIsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxFQUFFO29CQUNQLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTTtpQkFDakI7YUFDRCxDQUFDO1FBQ0gsQ0FBQztRQUdPLFlBQVksQ0FBQyxDQUFNLEVBQUUsTUFBdUQ7WUFDbkYsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsa0JBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2RyxDQUFDO0tBQ0Q7SUFIQTtRQURDLGVBQUs7bURBR0w7SUF0Q0YsOEJBdUNDIn0=
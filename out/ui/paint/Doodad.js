var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "language/Dictionaries", "language/Translation", "newui/component/Component", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "utilities/enum/Enums", "utilities/iterable/Collectors", "utilities/iterable/Generators", "utilities/Objects", "../../IDebugTools"], function (require, exports, Enums_1, Dictionaries_1, Translation_1, Component_1, Dropdown_1, LabelledRow_1, Text_1, Enums_2, Collectors_1, Generators_1, Objects_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DoodadPaint extends Component_1.default {
        constructor(api) {
            super(api);
            new LabelledRow_1.LabelledRow(api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelDoodad)))
                .append(this.dropdown = new Dropdown_1.default(api)
                .setRefreshMethod(() => ({
                defaultOption: "nochange",
                options: [
                    ["nochange", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))],
                    ["remove", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRemove))],
                ].values().include(Enums_2.default.values(Enums_1.DoodadType)
                    .filter(type => type !== Enums_1.DoodadType.Item)
                    .map(doodad => Generators_1.tuple(Enums_1.DoodadType[doodad], Translation_1.default.nameOf(Dictionaries_1.Dictionary.Doodad, doodad, false).inContext(3)))
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => Generators_1.tuple(id, (option) => option.setText(t)))),
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
        isChanging() {
            return this.doodad !== undefined;
        }
        reset() {
            this.dropdown.select("nochange");
        }
        changeDoodad(_, doodad) {
            this.doodad = doodad === "nochange" ? undefined : doodad === "remove" ? "remove" : Enums_1.DoodadType[doodad];
            this.emit("change");
        }
    }
    __decorate([
        Objects_1.Bound
    ], DoodadPaint.prototype, "changeDoodad", null);
    exports.default = DoodadPaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vZGFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhaW50L0Rvb2RhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFnQkEsTUFBcUIsV0FBWSxTQUFRLG1CQUFTO1FBS2pELFlBQW1CLEdBQVU7WUFDNUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRVgsSUFBSSx5QkFBVyxDQUFDLEdBQUcsQ0FBQztpQkFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ2hGLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBa0QsR0FBRyxDQUFDO2lCQUN4RixnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixhQUFhLEVBQUUsVUFBVTtnQkFDekIsT0FBTyxFQUFHO29CQUNULENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ3hGLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ2IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxrQkFBVSxDQUFDO3FCQUNoSCxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssa0JBQVUsQ0FBQyxJQUFJLENBQUM7cUJBQ3hDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLGtCQUFLLENBQ25CLGtCQUFVLENBQUMsTUFBTSxDQUE0QixFQUM3QyxxQkFBVyxDQUFDLE1BQU0sQ0FBQyx5QkFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFtQixDQUNqRixDQUFDO3FCQUNELE9BQU8sQ0FBQyxvQkFBVSxDQUFDLE9BQU8sQ0FBQztxQkFDM0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUM1RSxNQUFNLEVBQUU7cUJBQ1IsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLGtCQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBYyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNyRSxDQUFDLENBQUM7aUJBQ0YsRUFBRSxDQUFDLHdCQUFhLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDaEQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFTSxnQkFBZ0I7WUFDdEIsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxFQUFFO29CQUNQLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTTtpQkFDakI7YUFDRCxDQUFDO1FBQ0gsQ0FBQztRQUVNLFVBQVU7WUFDaEIsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQztRQUNsQyxDQUFDO1FBRU0sS0FBSztZQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFHTyxZQUFZLENBQUMsQ0FBTSxFQUFFLE1BQXVEO1lBQ25GLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGtCQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFdEcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQixDQUFDO0tBQ0Q7SUFMQTtRQURDLGVBQUs7bURBS0w7SUFyREYsOEJBc0RDIn0=
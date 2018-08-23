var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "language/Translation", "newui/component/CheckButton", "newui/component/Component", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "tile/Terrains", "utilities/Collectors", "utilities/enum/Enums", "utilities/Objects", "../../DebugTools", "../../IDebugTools"], function (require, exports, Enums_1, Translation_1, CheckButton_1, Component_1, Dropdown_1, LabelledRow_1, Text_1, Terrains_1, Collectors_1, Enums_2, Objects_1, DebugTools_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TerrainPaint extends Component_1.default {
        constructor(api) {
            super(api);
            new LabelledRow_1.LabelledRow(api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTerrain)))
                .append(this.dropdown = new Dropdown_1.default(api)
                .setRefreshMethod(() => ({
                defaultOption: "nochange",
                options: [
                    ["nochange", option => option.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))],
                ].values().include(Enums_2.default.values(Enums_1.TerrainType)
                    .map(terrain => [Enums_1.TerrainType[terrain], Translation_1.default.ofObjectName(Terrains_1.terrainDescriptions[terrain], Enums_1.SentenceCaseStyle.Title, false)])
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => [id, option => option.setText(t)])),
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeTerrain))
                .appendTo(this);
            this.tilledCheckButton = new CheckButton_1.CheckButton(api)
                .hide()
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleTilled))
                .appendTo(this);
        }
        getTilePaintData() {
            return this.terrain === undefined ? undefined : {
                terrain: {
                    type: this.terrain,
                    tilled: this.tilledCheckButton.checked,
                },
            };
        }
        isChanging() {
            return this.terrain !== undefined;
        }
        reset() {
            this.dropdown.select("nochange");
        }
        changeTerrain(_, terrain) {
            this.terrain = terrain === "nochange" ? undefined : Enums_1.TerrainType[terrain];
            const tillable = terrain !== "nochange" && Terrains_1.terrainDescriptions[Enums_1.TerrainType[terrain]].tillable === true;
            this.tilledCheckButton.toggle(tillable);
            if (!tillable)
                this.tilledCheckButton.setChecked(false);
        }
    }
    __decorate([
        Objects_1.Bound
    ], TerrainPaint.prototype, "changeTerrain", null);
    exports.default = TerrainPaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYWludC9UZXJyYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWlCQSxNQUFxQixZQUFhLFNBQVEsbUJBQVM7UUFLbEQsWUFBbUIsR0FBVTtZQUM1QixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFWCxJQUFJLHlCQUFXLENBQUMsR0FBRyxDQUFDO2lCQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO2lCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHdCQUFXLENBQUMsbUNBQXFCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztpQkFDakYsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxrQkFBUSxDQUF3QyxHQUFHLENBQUM7aUJBQzlFLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLGFBQWEsRUFBRSxVQUFVO2dCQUN6QixPQUFPLEVBQUc7b0JBQ1QsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHdCQUFXLENBQUMsbUNBQXFCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztpQkFDM0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxtQkFBVyxDQUFDO3FCQUN2RyxHQUFHLENBQW1ELE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxtQkFBVyxDQUFDLE9BQU8sQ0FBNkIsRUFBRSxxQkFBVyxDQUFDLFlBQVksQ0FBQyw4QkFBbUIsQ0FBQyxPQUFPLENBQUUsRUFBRSx5QkFBaUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztxQkFDN00sT0FBTyxDQUFDLG9CQUFVLENBQUMsT0FBTyxDQUFDO3FCQUMzQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQzVFLE1BQU0sRUFBRTtxQkFDUixHQUFHLENBQXlELENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDOUcsQ0FBQyxDQUFDO2lCQUNGLEVBQUUsQ0FBQyx3QkFBYSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQ2pELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSx5QkFBVyxDQUFDLEdBQUcsQ0FBQztpQkFDM0MsSUFBSSxFQUFFO2lCQUNOLE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUM7aUJBQzlELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBRU0sZ0JBQWdCO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLE9BQU8sRUFBRTtvQkFDUixJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87b0JBQ2xCLE1BQU0sRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTztpQkFDdEM7YUFDRCxDQUFDO1FBQ0gsQ0FBQztRQUVNLFVBQVU7WUFDaEIsT0FBTyxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQztRQUNuQyxDQUFDO1FBRU0sS0FBSztZQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFHTyxhQUFhLENBQUMsQ0FBTSxFQUFFLE9BQThDO1lBQzNFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxtQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXpFLE1BQU0sUUFBUSxHQUFHLE9BQU8sS0FBSyxVQUFVLElBQUksOEJBQW1CLENBQUMsbUJBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBRSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUM7WUFDeEcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsUUFBUTtnQkFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pELENBQUM7S0FDRDtJQVBBO1FBREMsZUFBSztxREFPTDtJQXhERiwrQkF5REMifQ==
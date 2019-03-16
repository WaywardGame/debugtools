var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "language/Dictionaries", "language/Translation", "newui/component/CheckButton", "newui/component/Component", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "tile/ITerrain", "tile/Terrains", "utilities/Arrays", "utilities/enum/Enums", "utilities/Objects", "utilities/stream/Stream", "../../IDebugTools"], function (require, exports, Dictionaries_1, Translation_1, CheckButton_1, Component_1, Dropdown_1, LabelledRow_1, Text_1, ITerrain_1, Terrains_1, Arrays_1, Enums_1, Objects_1, Stream_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TerrainPaint extends Component_1.default {
        constructor() {
            super();
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTerrain)))
                .append(this.dropdown = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: "nochange",
                options: Stream_1.default.of(["nochange", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))])
                    .merge(Enums_1.default.values(ITerrain_1.TerrainType)
                    .map(terrain => Arrays_1.tuple(ITerrain_1.TerrainType[terrain], new Translation_1.default(Dictionaries_1.Dictionary.Terrain, terrain).inContext(3)))
                    .sorted(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t)))),
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeTerrain))
                .appendTo(this);
            this.tilledCheckButton = new CheckButton_1.CheckButton()
                .hide()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleTilled))
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
            this.terrain = terrain === "nochange" ? undefined : ITerrain_1.TerrainType[terrain];
            const tillable = terrain !== "nochange" && Terrains_1.terrainDescriptions[ITerrain_1.TerrainType[terrain]].tillable === true;
            this.tilledCheckButton.toggle(tillable);
            if (!tillable)
                this.tilledCheckButton.setChecked(false);
            this.emit("change");
        }
    }
    __decorate([
        Objects_1.Bound
    ], TerrainPaint.prototype, "changeTerrain", null);
    exports.default = TerrainPaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYWludC9UZXJyYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWlCQSxNQUFxQixZQUFhLFNBQVEsbUJBQVM7UUFLbEQ7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUVSLElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO2lCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztpQkFDakYsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxrQkFBUSxFQUF5QztpQkFDM0UsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsYUFBYSxFQUFFLFVBQVU7Z0JBQ3pCLE9BQU8sRUFBRSxnQkFBTSxDQUFDLEVBQUUsQ0FDakIsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUN4RjtxQkFDQyxLQUFLLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxzQkFBVyxDQUFDO3FCQUM5QixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxjQUFLLENBQ3BCLHNCQUFXLENBQUMsT0FBTyxDQUE2QixFQUNoRCxJQUFJLHFCQUFXLENBQUMseUJBQVUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxHQUFtQixDQUN6RSxDQUFDO3FCQUNELE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDOUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RFLENBQUMsQ0FBQztpQkFDRixFQUFFLENBQUMsd0JBQWEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUNqRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDeEMsSUFBSSxFQUFFO2lCQUNOLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUM7aUJBQzlELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBRU0sZ0JBQWdCO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLE9BQU8sRUFBRTtvQkFDUixJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87b0JBQ2xCLE1BQU0sRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTztpQkFDdEM7YUFDRCxDQUFDO1FBQ0gsQ0FBQztRQUVNLFVBQVU7WUFDaEIsT0FBTyxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQztRQUNuQyxDQUFDO1FBRU0sS0FBSztZQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFHTyxhQUFhLENBQUMsQ0FBTSxFQUFFLE9BQThDO1lBQzNFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXpFLE1BQU0sUUFBUSxHQUFHLE9BQU8sS0FBSyxVQUFVLElBQUksOEJBQW1CLENBQUMsc0JBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBRSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUM7WUFDeEcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsUUFBUTtnQkFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXhELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckIsQ0FBQztLQUNEO0lBVEE7UUFEQyxlQUFLO3FEQVNMO0lBNURGLCtCQTZEQyJ9
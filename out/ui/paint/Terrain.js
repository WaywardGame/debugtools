var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "language/Dictionaries", "language/Translation", "newui/component/CheckButton", "newui/component/Component", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "tile/ITerrain", "tile/Terrains", "utilities/Arrays", "utilities/enum/Enums", "utilities/stream/Stream", "../../IDebugTools"], function (require, exports, Dictionaries_1, Translation_1, CheckButton_1, Component_1, Dropdown_1, LabelledRow_1, Text_1, ITerrain_1, Terrains_1, Arrays_1, Enums_1, Stream_1, IDebugTools_1) {
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
                    .map(terrain => Arrays_1.Tuple(ITerrain_1.TerrainType[terrain], new Translation_1.default(Dictionaries_1.Dictionary.Terrain, terrain).inContext(Translation_1.TextContext.Title)))
                    .sorted(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => Arrays_1.Tuple(id, (option) => option.setText(t)))),
            }))
                .event.subscribe("selection", this.changeTerrain))
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
            this.event.emit("change");
        }
    }
    __decorate([
        Override
    ], TerrainPaint.prototype, "event", void 0);
    __decorate([
        Bound
    ], TerrainPaint.prototype, "changeTerrain", null);
    exports.default = TerrainPaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYWludC9UZXJyYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQW1CQSxNQUFxQixZQUFhLFNBQVEsbUJBQVM7UUFPbEQ7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUVSLElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO2lCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztpQkFDakYsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxrQkFBUSxFQUF5QztpQkFDM0UsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsYUFBYSxFQUFFLFVBQVU7Z0JBQ3pCLE9BQU8sRUFBRSxnQkFBTSxDQUFDLEVBQUUsQ0FDakIsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUN4RjtxQkFDQyxLQUFLLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxzQkFBVyxDQUFDO3FCQUM5QixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxjQUFLLENBQ3BCLHNCQUFXLENBQUMsT0FBTyxDQUE2QixFQUNoRCxJQUFJLHFCQUFXLENBQUMseUJBQVUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLHlCQUFXLENBQUMsS0FBSyxDQUFDLENBQ3pFLENBQUM7cUJBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUM5RSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdEUsQ0FBQyxDQUFDO2lCQUNGLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDbEQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLHlCQUFXLEVBQUU7aUJBQ3hDLElBQUksRUFBRTtpQkFDTixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2lCQUM5RCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQztRQUVNLGdCQUFnQjtZQUN0QixPQUFPLElBQUksQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxPQUFPLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO29CQUNsQixNQUFNLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU87aUJBQ3RDO2FBQ0QsQ0FBQztRQUNILENBQUM7UUFFTSxVQUFVO1lBQ2hCLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUM7UUFDbkMsQ0FBQztRQUVNLEtBQUs7WUFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBR08sYUFBYSxDQUFDLENBQU0sRUFBRSxPQUE4QztZQUMzRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV6RSxNQUFNLFFBQVEsR0FBRyxPQUFPLEtBQUssVUFBVSxJQUFJLDhCQUFtQixDQUFDLHNCQUFXLENBQUMsT0FBTyxDQUFDLENBQUUsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDO1lBQ3hHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLFFBQVE7Z0JBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV4RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQixDQUFDO0tBQ0Q7SUE5RFU7UUFBVCxRQUFROytDQUEwRDtJQXFEbkU7UUFEQyxLQUFLO3FEQVNMO0lBOURGLCtCQStEQyJ9
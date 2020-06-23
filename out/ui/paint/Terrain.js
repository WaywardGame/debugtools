var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/CheckButton", "newui/component/Component", "newui/component/dropdown/TerrainDropdown", "newui/component/LabelledRow", "tile/Terrains", "../../IDebugTools"], function (require, exports, CheckButton_1, Component_1, TerrainDropdown_1, LabelledRow_1, Terrains_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TerrainPaint extends Component_1.default {
        constructor() {
            super();
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTerrain)))
                .append(this.dropdown = new TerrainDropdown_1.default("nochange", [
                ["nochange", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))],
            ])
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
            this.terrain = terrain === "nochange" ? undefined : terrain;
            const tillable = terrain !== "nochange" && Terrains_1.default[terrain].tillable === true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYWludC9UZXJyYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQVVBLE1BQXFCLFlBQWEsU0FBUSxtQkFBUztRQU9sRDtZQUNDLEtBQUssRUFBRSxDQUFDO1lBRVIsSUFBSSx5QkFBVyxFQUFFO2lCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUNqRixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLHlCQUFlLENBQUMsVUFBVSxFQUFFO2dCQUN2RCxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2FBQ3hGLENBQUM7aUJBQ0EsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUNsRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDeEMsSUFBSSxFQUFFO2lCQUNOLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUM7aUJBQzlELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBRU0sZ0JBQWdCO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLE9BQU8sRUFBRTtvQkFDUixJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87b0JBQ2xCLE1BQU0sRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTztpQkFDdEM7YUFDRCxDQUFDO1FBQ0gsQ0FBQztRQUVNLFVBQVU7WUFDaEIsT0FBTyxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQztRQUNuQyxDQUFDO1FBRU0sS0FBSztZQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFHTyxhQUFhLENBQUMsQ0FBTSxFQUFFLE9BQWlDO1lBQzlELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFFNUQsTUFBTSxRQUFRLEdBQUcsT0FBTyxLQUFLLFVBQVUsSUFBSSxrQkFBbUIsQ0FBQyxPQUFPLENBQUUsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDO1lBQzNGLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLFFBQVE7Z0JBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV4RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQixDQUFDO0tBQ0Q7SUFuRFU7UUFBVCxRQUFROytDQUEwRDtJQTBDbkU7UUFEQyxLQUFLO3FEQVNMO0lBbkRGLCtCQW9EQyJ9
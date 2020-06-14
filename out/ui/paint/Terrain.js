var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/CheckButton", "newui/component/Component", "newui/component/dropdown/TerrainDropdown", "newui/component/LabelledRow", "tile/Terrains", "../../IDebugTools"], function (require, exports, CheckButton_1, Component_1, TerrainDropdown_1, LabelledRow_1, Terrains_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let TerrainPaint = (() => {
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
        return TerrainPaint;
    })();
    exports.default = TerrainPaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYWludC9UZXJyYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQVVBO1FBQUEsTUFBcUIsWUFBYSxTQUFRLG1CQUFTO1lBT2xEO2dCQUNDLEtBQUssRUFBRSxDQUFDO2dCQUVSLElBQUkseUJBQVcsRUFBRTtxQkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO3FCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztxQkFDakYsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSx5QkFBZSxDQUFDLFVBQVUsRUFBRTtvQkFDdkQsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztpQkFDeEYsQ0FBQztxQkFDQSxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7cUJBQ2xELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFakIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUkseUJBQVcsRUFBRTtxQkFDeEMsSUFBSSxFQUFFO3FCQUNOLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUM7cUJBQzlELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixDQUFDO1lBRU0sZ0JBQWdCO2dCQUN0QixPQUFPLElBQUksQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUMvQyxPQUFPLEVBQUU7d0JBQ1IsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO3dCQUNsQixNQUFNLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU87cUJBQ3RDO2lCQUNELENBQUM7WUFDSCxDQUFDO1lBRU0sVUFBVTtnQkFDaEIsT0FBTyxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQztZQUNuQyxDQUFDO1lBRU0sS0FBSztnQkFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBR08sYUFBYSxDQUFDLENBQU0sRUFBRSxPQUFpQztnQkFDOUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFFNUQsTUFBTSxRQUFRLEdBQUcsT0FBTyxLQUFLLFVBQVUsSUFBSSxrQkFBbUIsQ0FBQyxPQUFPLENBQUUsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDO2dCQUMzRixJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLENBQUMsUUFBUTtvQkFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUV4RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQixDQUFDO1NBQ0Q7UUFuRFU7WUFBVCxRQUFRO21EQUEwRDtRQTBDbkU7WUFEQyxLQUFLO3lEQVNMO1FBQ0YsbUJBQUM7U0FBQTtzQkFwRG9CLFlBQVkifQ==
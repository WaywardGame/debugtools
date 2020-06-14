var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/Component", "newui/component/dropdown/DoodadDropdown", "newui/component/LabelledRow", "../../IDebugTools"], function (require, exports, Component_1, DoodadDropdown_1, LabelledRow_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let DoodadPaint = (() => {
        class DoodadPaint extends Component_1.default {
            constructor() {
                super();
                new LabelledRow_1.LabelledRow()
                    .classes.add("dropdown-label")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelDoodad)))
                    .append(this.dropdown = new DoodadDropdown_1.DoodadDropdown("nochange", [
                    ["nochange", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))],
                    ["remove", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRemove))],
                ])
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
                this.doodad = doodad === "nochange" ? undefined : doodad === "remove" ? "remove" : doodad;
                this.event.emit("change");
            }
        }
        __decorate([
            Override
        ], DoodadPaint.prototype, "event", void 0);
        __decorate([
            Bound
        ], DoodadPaint.prototype, "changeDoodad", null);
        return DoodadPaint;
    })();
    exports.default = DoodadPaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9vZGFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhaW50L0Rvb2RhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFTQTtRQUFBLE1BQXFCLFdBQVksU0FBUSxtQkFBUztZQU9qRDtnQkFDQyxLQUFLLEVBQUUsQ0FBQztnQkFFUixJQUFJLHlCQUFXLEVBQUU7cUJBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztxQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7cUJBQ2hGLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksK0JBQWMsQ0FBd0IsVUFBVSxFQUFFO29CQUM3RSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUN4RixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2lCQUNwRixDQUFDO3FCQUNBLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztxQkFDakQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLENBQUM7WUFFTSxnQkFBZ0I7Z0JBQ3RCLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQzlDLE1BQU0sRUFBRTt3QkFDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU07cUJBQ2pCO2lCQUNELENBQUM7WUFDSCxDQUFDO1lBRU0sVUFBVTtnQkFDaEIsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQztZQUNsQyxDQUFDO1lBRU0sS0FBSztnQkFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBR08sWUFBWSxDQUFDLENBQU0sRUFBRSxNQUEwQztnQkFDdEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUUxRixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQixDQUFDO1NBQ0Q7UUExQ1U7WUFBVCxRQUFRO2tEQUEwRDtRQXFDbkU7WUFEQyxLQUFLO3VEQUtMO1FBQ0Ysa0JBQUM7U0FBQTtzQkEzQ29CLFdBQVcifQ==
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/Component", "newui/component/dropdown/NPCDropdown", "newui/component/LabelledRow", "../../IDebugTools"], function (require, exports, Component_1, NPCDropdown_1, LabelledRow_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let NPCPaint = (() => {
        class NPCPaint extends Component_1.default {
            constructor() {
                super();
                new LabelledRow_1.LabelledRow()
                    .classes.add("dropdown-label")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelNPC)))
                    .append(this.dropdown = new NPCDropdown_1.default("nochange", [
                    ["nochange", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))],
                    ["remove", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRemove))],
                ])
                    .event.subscribe("selection", this.changeNPC))
                    .appendTo(this);
            }
            getTilePaintData() {
                return this.npc === undefined ? undefined : {
                    npc: {
                        type: this.npc,
                    },
                };
            }
            isChanging() {
                return this.npc !== undefined;
            }
            reset() {
                this.dropdown.select("nochange");
            }
            changeNPC(_, npc) {
                this.npc = npc === "nochange" ? undefined : npc === "remove" ? "remove" : npc;
                this.event.emit("change");
            }
        }
        __decorate([
            Override
        ], NPCPaint.prototype, "event", void 0);
        __decorate([
            Bound
        ], NPCPaint.prototype, "changeNPC", null);
        return NPCPaint;
    })();
    exports.default = NPCPaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTlBDLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhaW50L05QQy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFRQTtRQUFBLE1BQXFCLFFBQVMsU0FBUSxtQkFBUztZQU85QztnQkFDQyxLQUFLLEVBQUUsQ0FBQztnQkFFUixJQUFJLHlCQUFXLEVBQUU7cUJBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztxQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7cUJBQzdFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUkscUJBQVcsQ0FBQyxVQUFVLEVBQUU7b0JBQ25ELENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ3hGLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ3BGLENBQUM7cUJBQ0EsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3FCQUM5QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsQ0FBQztZQUVNLGdCQUFnQjtnQkFDdEIsT0FBTyxJQUFJLENBQUMsR0FBRyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsR0FBRyxFQUFFO3dCQUNKLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRztxQkFDZDtpQkFDRCxDQUFDO1lBQ0gsQ0FBQztZQUVNLFVBQVU7Z0JBQ2hCLE9BQU8sSUFBSSxDQUFDLEdBQUcsS0FBSyxTQUFTLENBQUM7WUFDL0IsQ0FBQztZQUVNLEtBQUs7Z0JBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEMsQ0FBQztZQUdPLFNBQVMsQ0FBQyxDQUFNLEVBQUUsR0FBb0M7Z0JBQzdELElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFFOUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0IsQ0FBQztTQUNEO1FBMUNVO1lBQVQsUUFBUTsrQ0FBMEQ7UUFxQ25FO1lBREMsS0FBSztpREFLTDtRQUNGLGVBQUM7U0FBQTtzQkEzQ29CLFFBQVEifQ==
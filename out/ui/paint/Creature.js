var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/CheckButton", "newui/component/Component", "newui/component/dropdown/CreatureDropdown", "newui/component/LabelledRow", "../../IDebugTools"], function (require, exports, CheckButton_1, Component_1, CreatureDropdown_1, LabelledRow_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let CreaturePaint = (() => {
        class CreaturePaint extends Component_1.default {
            constructor() {
                super();
                new LabelledRow_1.LabelledRow()
                    .classes.add("dropdown-label")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelCreature)))
                    .append(this.dropdown = new CreatureDropdown_1.default("nochange", [
                    ["nochange", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))],
                    ["remove", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRemove))],
                ])
                    .event.subscribe("selection", this.changeCreature))
                    .appendTo(this);
                this.aberrantCheckButton = new CheckButton_1.CheckButton()
                    .hide()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleAberrant))
                    .appendTo(this);
            }
            getTilePaintData() {
                return this.creature === undefined ? undefined : {
                    creature: {
                        type: this.creature,
                        aberrant: this.aberrantCheckButton.checked,
                    },
                };
            }
            isChanging() {
                return this.creature !== undefined;
            }
            reset() {
                this.dropdown.select("nochange");
            }
            changeCreature(_, creature) {
                this.creature = creature === "nochange" ? undefined : creature === "remove" ? "remove" : creature;
                this.aberrantCheckButton.toggle(this.creature !== undefined && this.creature !== "remove");
                this.event.emit("change");
            }
        }
        __decorate([
            Override
        ], CreaturePaint.prototype, "event", void 0);
        __decorate([
            Bound
        ], CreaturePaint.prototype, "changeCreature", null);
        return CreaturePaint;
    })();
    exports.default = CreaturePaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvcGFpbnQvQ3JlYXR1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBV0E7UUFBQSxNQUFxQixhQUFjLFNBQVEsbUJBQVM7WUFRbkQ7Z0JBQ0MsS0FBSyxFQUFFLENBQUM7Z0JBRVIsSUFBSSx5QkFBVyxFQUFFO3FCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7cUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO3FCQUNsRixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLDBCQUFnQixDQUFDLFVBQVUsRUFBRTtvQkFDeEQsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDeEYsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztpQkFDcEYsQ0FBQztxQkFDQSxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7cUJBQ25ELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFakIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUkseUJBQVcsRUFBRTtxQkFDMUMsSUFBSSxFQUFFO3FCQUNOLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLG9CQUFvQixDQUFDLENBQUM7cUJBQ2hFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixDQUFDO1lBRU0sZ0JBQWdCO2dCQUN0QixPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNoRCxRQUFRLEVBQUU7d0JBQ1QsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRO3dCQUNuQixRQUFRLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU87cUJBQzFDO2lCQUNELENBQUM7WUFDSCxDQUFDO1lBRU0sVUFBVTtnQkFDaEIsT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQztZQUNwQyxDQUFDO1lBRU0sS0FBSztnQkFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBR08sY0FBYyxDQUFDLENBQU0sRUFBRSxRQUE4QztnQkFDNUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUNsRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUM7Z0JBRTNGLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNCLENBQUM7U0FDRDtRQWxEVTtZQUFULFFBQVE7b0RBQTBEO1FBNENuRTtZQURDLEtBQUs7MkRBTUw7UUFDRixvQkFBQztTQUFBO3NCQW5Eb0IsYUFBYSJ9
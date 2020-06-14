var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/CheckButton", "newui/component/Component", "newui/component/dropdown/CorpseDropdown", "newui/component/LabelledRow", "../../IDebugTools"], function (require, exports, CheckButton_1, Component_1, CorpseDropdown_1, LabelledRow_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let CorpsePaint = (() => {
        class CorpsePaint extends Component_1.default {
            constructor() {
                super();
                new LabelledRow_1.LabelledRow()
                    .classes.add("dropdown-label")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelCorpse)))
                    .append(this.dropdown = new CorpseDropdown_1.default("nochange", [
                    ["nochange", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))],
                    ["remove", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRemove))],
                ])
                    .event.subscribe("selection", this.changeCorpse))
                    .appendTo(this);
                this.replaceExisting = new CheckButton_1.CheckButton()
                    .hide()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonReplaceExisting))
                    .appendTo(this);
                this.aberrantCheckButton = new CheckButton_1.CheckButton()
                    .hide()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleAberrant))
                    .appendTo(this);
            }
            getTilePaintData() {
                return {
                    corpse: {
                        type: this.corpse,
                        aberrant: this.aberrantCheckButton.checked,
                        replaceExisting: this.replaceExisting.checked,
                    },
                };
            }
            isChanging() {
                return this.corpse !== undefined || this.replaceExisting.checked;
            }
            reset() {
                this.dropdown.select("nochange");
            }
            changeCorpse(_, corpse) {
                this.corpse = corpse === "nochange" ? undefined : corpse === "remove" ? "remove" : corpse;
                const isReplaceable = this.corpse !== undefined && this.corpse !== "remove";
                this.aberrantCheckButton.toggle(isReplaceable);
                this.replaceExisting.toggle(isReplaceable);
                if (!isReplaceable)
                    this.replaceExisting.setChecked(false);
                this.event.emit("change");
            }
        }
        __decorate([
            Override
        ], CorpsePaint.prototype, "event", void 0);
        __decorate([
            Bound
        ], CorpsePaint.prototype, "changeCorpse", null);
        return CorpsePaint;
    })();
    exports.default = CorpsePaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ycHNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhaW50L0NvcnBzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFXQTtRQUFBLE1BQXFCLFdBQVksU0FBUSxtQkFBUztZQVNqRDtnQkFDQyxLQUFLLEVBQUUsQ0FBQztnQkFFUixJQUFJLHlCQUFXLEVBQUU7cUJBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztxQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7cUJBQ2hGLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksd0JBQWMsQ0FBQyxVQUFVLEVBQUU7b0JBQ3RELENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ3hGLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ3BGLENBQUM7cUJBQ0EsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO3FCQUNqRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRWpCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSx5QkFBVyxFQUFFO3FCQUN0QyxJQUFJLEVBQUU7cUJBQ04sT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMscUJBQXFCLENBQUMsQ0FBQztxQkFDakUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVqQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSx5QkFBVyxFQUFFO3FCQUMxQyxJQUFJLEVBQUU7cUJBQ04sT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztxQkFDaEUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLENBQUM7WUFFTSxnQkFBZ0I7Z0JBQ3RCLE9BQU87b0JBQ04sTUFBTSxFQUFFO3dCQUNQLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTTt3QkFDakIsUUFBUSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPO3dCQUMxQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPO3FCQUM3QztpQkFDRCxDQUFDO1lBQ0gsQ0FBQztZQUVNLFVBQVU7Z0JBQ2hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUM7WUFDbEUsQ0FBQztZQUVNLEtBQUs7Z0JBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEMsQ0FBQztZQUdPLFlBQVksQ0FBQyxDQUFNLEVBQUUsTUFBNEM7Z0JBQ3hFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFFMUYsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUM7Z0JBQzVFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQy9DLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsYUFBYTtvQkFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFM0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0IsQ0FBQztTQUNEO1FBN0RVO1lBQVQsUUFBUTtrREFBMEQ7UUFtRG5FO1lBREMsS0FBSzt1REFVTDtRQUNGLGtCQUFDO1NBQUE7c0JBOURvQixXQUFXIn0=
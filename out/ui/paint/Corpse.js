var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/CheckButton", "newui/component/Component", "newui/component/dropdown/CorpseDropdown", "newui/component/LabelledRow", "../../IDebugTools"], function (require, exports, CheckButton_1, Component_1, CorpseDropdown_1, LabelledRow_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.default = CorpsePaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ycHNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhaW50L0NvcnBzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFXQSxNQUFxQixXQUFZLFNBQVEsbUJBQVM7UUFTakQ7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUVSLElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO2lCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztpQkFDaEYsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSx3QkFBYyxDQUFDLFVBQVUsRUFBRTtnQkFDdEQsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDeEYsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzthQUNwRixDQUFDO2lCQUNBLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDakQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSx5QkFBVyxFQUFFO2lCQUN0QyxJQUFJLEVBQUU7aUJBQ04sT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMscUJBQXFCLENBQUMsQ0FBQztpQkFDakUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLHlCQUFXLEVBQUU7aUJBQzFDLElBQUksRUFBRTtpQkFDTixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2lCQUNoRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQztRQUVNLGdCQUFnQjtZQUN0QixPQUFPO2dCQUNOLE1BQU0sRUFBRTtvQkFDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU07b0JBQ2pCLFFBQVEsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTztvQkFDMUMsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTztpQkFDN0M7YUFDRCxDQUFDO1FBQ0gsQ0FBQztRQUVNLFVBQVU7WUFDaEIsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQztRQUNsRSxDQUFDO1FBRU0sS0FBSztZQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFHTyxZQUFZLENBQUMsQ0FBTSxFQUFFLE1BQTRDO1lBQ3hFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUUxRixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQztZQUM1RSxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxhQUFhO2dCQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTNELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNCLENBQUM7S0FDRDtJQTdEVTtRQUFULFFBQVE7OENBQTBEO0lBbURuRTtRQURDLEtBQUs7bURBVUw7SUE3REYsOEJBOERDIn0=
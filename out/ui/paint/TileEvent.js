var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "ui/component/CheckButton", "ui/component/Component", "ui/component/dropdown/TileEventDropdown", "ui/component/LabelledRow", "utilities/Decorators", "../../IDebugTools"], function (require, exports, CheckButton_1, Component_1, TileEventDropdown_1, LabelledRow_1, Decorators_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TileEventPaint extends Component_1.default {
        constructor() {
            super();
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelTileEvent)))
                .append(this.dropdown = new TileEventDropdown_1.default("nochange", [
                ["nochange", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.PaintNoChange))],
                ["remove", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.PaintRemove))],
            ])
                .event.subscribe("selection", this.changeEvent))
                .appendTo(this);
            this.replaceExisting = new CheckButton_1.CheckButton()
                .hide()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonReplaceExisting))
                .appendTo(this);
        }
        getTilePaintData() {
            return {
                tileEvent: {
                    type: this.tileEvent,
                    replaceExisting: this.replaceExisting.checked,
                },
            };
        }
        isChanging() {
            return this.tileEvent !== undefined;
        }
        reset() {
            this.dropdown.select("nochange");
        }
        changeEvent(_, event) {
            this.tileEvent = event === "nochange" ? undefined : event === "remove" ? "remove" : event;
            const isReplaceable = this.tileEvent !== undefined && this.tileEvent !== "remove";
            this.replaceExisting.toggle(isReplaceable);
            if (!isReplaceable)
                this.replaceExisting.setChecked(false);
            this.event.emit("change");
        }
    }
    __decorate([
        Decorators_1.Bound
    ], TileEventPaint.prototype, "changeEvent", null);
    exports.default = TileEventPaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZUV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhaW50L1RpbGVFdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFXQSxNQUFxQixjQUFlLFNBQVEsbUJBQVM7UUFRcEQ7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUVSLElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO2lCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2lCQUNuRixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLDJCQUFpQixDQUFDLFVBQVUsRUFBRTtnQkFDekQsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUN4RixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7YUFDcEYsQ0FBQztpQkFDQSxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ2hELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDdEMsSUFBSSxFQUFFO2lCQUNOLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMscUJBQXFCLENBQUMsQ0FBQztpQkFDakUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFTSxnQkFBZ0I7WUFDdEIsT0FBTztnQkFDTixTQUFTLEVBQUU7b0JBQ1YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTO29CQUNwQixlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPO2lCQUM3QzthQUNELENBQUM7UUFDSCxDQUFDO1FBRU0sVUFBVTtZQUNoQixPQUFPLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDO1FBQ3JDLENBQUM7UUFFTSxLQUFLO1lBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUdPLFdBQVcsQ0FBQyxDQUFNLEVBQUUsS0FBNEM7WUFDdkUsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBRTFGLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssUUFBUSxDQUFDO1lBQ2xGLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxhQUFhO2dCQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTNELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNCLENBQUM7S0FDRDtJQVRBO1FBREMsa0JBQUs7cURBU0w7SUFyREYsaUNBc0RDIn0=
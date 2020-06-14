var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/CheckButton", "newui/component/Component", "newui/component/dropdown/TileEventDropdown", "newui/component/LabelledRow", "../../IDebugTools"], function (require, exports, CheckButton_1, Component_1, TileEventDropdown_1, LabelledRow_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let TileEventPaint = (() => {
        class TileEventPaint extends Component_1.default {
            constructor() {
                super();
                new LabelledRow_1.LabelledRow()
                    .classes.add("dropdown-label")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTileEvent)))
                    .append(this.dropdown = new TileEventDropdown_1.default("nochange", [
                    ["nochange", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))],
                    ["remove", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRemove))],
                ])
                    .event.subscribe("selection", this.changeEvent))
                    .appendTo(this);
                this.replaceExisting = new CheckButton_1.CheckButton()
                    .hide()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonReplaceExisting))
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
            Override
        ], TileEventPaint.prototype, "event", void 0);
        __decorate([
            Bound
        ], TileEventPaint.prototype, "changeEvent", null);
        return TileEventPaint;
    })();
    exports.default = TileEventPaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZUV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhaW50L1RpbGVFdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFXQTtRQUFBLE1BQXFCLGNBQWUsU0FBUSxtQkFBUztZQVFwRDtnQkFDQyxLQUFLLEVBQUUsQ0FBQztnQkFFUixJQUFJLHlCQUFXLEVBQUU7cUJBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztxQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7cUJBQ25GLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksMkJBQWlCLENBQUMsVUFBVSxFQUFFO29CQUN6RCxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUN4RixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2lCQUNwRixDQUFDO3FCQUNBLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztxQkFDaEQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVqQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUkseUJBQVcsRUFBRTtxQkFDdEMsSUFBSSxFQUFFO3FCQUNOLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLHFCQUFxQixDQUFDLENBQUM7cUJBQ2pFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixDQUFDO1lBRU0sZ0JBQWdCO2dCQUN0QixPQUFPO29CQUNOLFNBQVMsRUFBRTt3QkFDVixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVM7d0JBQ3BCLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU87cUJBQzdDO2lCQUNELENBQUM7WUFDSCxDQUFDO1lBRU0sVUFBVTtnQkFDaEIsT0FBTyxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQztZQUNyQyxDQUFDO1lBRU0sS0FBSztnQkFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBR08sV0FBVyxDQUFDLENBQU0sRUFBRSxLQUE0QztnQkFDdkUsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUUxRixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFFBQVEsQ0FBQztnQkFDbEYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxhQUFhO29CQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUUzRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQixDQUFDO1NBQ0Q7UUFyRFU7WUFBVCxRQUFRO3FEQUEwRDtRQTRDbkU7WUFEQyxLQUFLO3lEQVNMO1FBQ0YscUJBQUM7U0FBQTtzQkF0RG9CLGNBQWMifQ==
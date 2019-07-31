var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "language/Dictionaries", "language/Translation", "newui/component/CheckButton", "newui/component/Component", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "tile/ITileEvent", "utilities/Arrays", "utilities/enum/Enums", "utilities/stream/Stream", "../../IDebugTools"], function (require, exports, Dictionaries_1, Translation_1, CheckButton_1, Component_1, Dropdown_1, LabelledRow_1, Text_1, ITileEvent_1, Arrays_1, Enums_1, Stream_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TileEventPaint extends Component_1.default {
        constructor() {
            super();
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTileEvent)))
                .append(this.dropdown = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: "nochange",
                options: Stream_1.default.of(["nochange", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))], ["remove", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRemove))])
                    .merge(Enums_1.default.values(ITileEvent_1.TileEventType)
                    .filter(event => event !== ITileEvent_1.TileEventType.None)
                    .map(event => Arrays_1.Tuple(ITileEvent_1.TileEventType[event], Translation_1.default.nameOf(Dictionaries_1.Dictionary.TileEvent, event, false).inContext(Translation_1.TextContext.Title)))
                    .sorted(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => Arrays_1.Tuple(id, (option) => option.setText(t)))),
            }))
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
            this.tileEvent = event === "nochange" ? undefined : event === "remove" ? "remove" : ITileEvent_1.TileEventType[event];
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
    exports.default = TileEventPaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZUV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhaW50L1RpbGVFdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFrQkEsTUFBcUIsY0FBZSxTQUFRLG1CQUFTO1FBUXBEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7aUJBQ25GLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksa0JBQVEsRUFBc0Q7aUJBQ3hGLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLGFBQWEsRUFBRSxVQUFVO2dCQUN6QixPQUFPLEVBQUUsZ0JBQU0sQ0FBQyxFQUFFLENBQ2pCLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFDeEYsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUNwRjtxQkFDQyxLQUFLLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FBQywwQkFBYSxDQUFDO3FCQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEtBQUssMEJBQWEsQ0FBQyxJQUFJLENBQUM7cUJBQzdDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLGNBQUssQ0FDbEIsMEJBQWEsQ0FBQyxLQUFLLENBQStCLEVBQ2xELHFCQUFXLENBQUMsTUFBTSxDQUFDLHlCQUFVLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMseUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FDbkYsQ0FBQztxQkFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQzlFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxjQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBYyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0RSxDQUFDLENBQUM7aUJBQ0YsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLHlCQUFXLEVBQUU7aUJBQ3RDLElBQUksRUFBRTtpQkFDTixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2lCQUNqRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQztRQUVNLGdCQUFnQjtZQUN0QixPQUFPO2dCQUNOLFNBQVMsRUFBRTtvQkFDVixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVM7b0JBQ3BCLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU87aUJBQzdDO2FBQ0QsQ0FBQztRQUNILENBQUM7UUFFTSxVQUFVO1lBQ2hCLE9BQU8sSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUM7UUFDckMsQ0FBQztRQUVNLEtBQUs7WUFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBR08sV0FBVyxDQUFDLENBQU0sRUFBRSxLQUF5RDtZQUNwRixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQywwQkFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXpHLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssUUFBUSxDQUFDO1lBQ2xGLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxhQUFhO2dCQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTNELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNCLENBQUM7S0FDRDtJQWpFVTtRQUFULFFBQVE7aURBQTBEO0lBd0RuRTtRQURDLEtBQUs7cURBU0w7SUFqRUYsaUNBa0VDIn0=
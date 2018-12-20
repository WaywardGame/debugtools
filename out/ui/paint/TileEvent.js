var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "language/Dictionaries", "language/Translation", "newui/component/CheckButton", "newui/component/Component", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "tile/ITileEvent", "utilities/enum/Enums", "utilities/iterable/Collectors", "utilities/iterable/Generators", "utilities/Objects", "../../IDebugTools"], function (require, exports, Dictionaries_1, Translation_1, CheckButton_1, Component_1, Dropdown_1, LabelledRow_1, Text_1, ITileEvent_1, Enums_1, Collectors_1, Generators_1, Objects_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TileEventPaint extends Component_1.default {
        constructor(api) {
            super(api);
            new LabelledRow_1.LabelledRow(api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTileEvent)))
                .append(this.dropdown = new Dropdown_1.default(api)
                .setRefreshMethod(() => ({
                defaultOption: "nochange",
                options: [
                    ["nochange", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintNoChange))],
                    ["remove", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.PaintRemove))],
                ].values()
                    .include(Enums_1.default.values(ITileEvent_1.TileEventType)
                    .filter(event => event !== ITileEvent_1.TileEventType.None)
                    .map(event => Generators_1.tuple(ITileEvent_1.TileEventType[event], Translation_1.default.nameOf(Dictionaries_1.Dictionary.TileEvent, event, false).inContext(3)))
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => Generators_1.tuple(id, (option) => option.setText(t)))),
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeEvent))
                .appendTo(this);
            this.replaceExisting = new CheckButton_1.CheckButton(api)
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
            this.emit("change");
        }
    }
    __decorate([
        Objects_1.Bound
    ], TileEventPaint.prototype, "changeEvent", null);
    exports.default = TileEventPaint;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZUV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhaW50L1RpbGVFdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFpQkEsTUFBcUIsY0FBZSxTQUFRLG1CQUFTO1FBTXBELFlBQW1CLEdBQVU7WUFDNUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRVgsSUFBSSx5QkFBVyxDQUFDLEdBQUcsQ0FBQztpQkFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7aUJBQ25GLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBcUQsR0FBRyxDQUFDO2lCQUMzRixnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixhQUFhLEVBQUUsVUFBVTtnQkFDekIsT0FBTyxFQUFHO29CQUNULENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ3hGLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ1YsQ0FBQyxNQUFNLEVBQUU7cUJBQ2xGLE9BQU8sQ0FBQyxlQUFLLENBQUMsTUFBTSxDQUFDLDBCQUFhLENBQUM7cUJBQ2xDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssS0FBSywwQkFBYSxDQUFDLElBQUksQ0FBQztxQkFDN0MsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENB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
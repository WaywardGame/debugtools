var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "action/ActionExecutor", "language/Translation", "mapgen/MapGenHelpers", "mod/IHookHost", "mod/Mod", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/RangeRow", "newui/component/Text", "newui/screen/screens/menu/component/Spacer", "tile/ITerrain", "tile/TerrainTemplates", "utilities/Arrays", "utilities/enum/Enums", "utilities/iterable/Collectors", "utilities/math/Vector2", "utilities/math/Vector3", "utilities/Objects", "../../action/PlaceTemplate", "../../IDebugTools", "../../overlay/SelectionOverlay", "../../util/TilePosition", "../component/DebugToolsPanel"], function (require, exports, ActionExecutor_1, Translation_1, MapGenHelpers_1, IHookHost_1, Mod_1, CheckButton_1, Dropdown_1, LabelledRow_1, RangeRow_1, Text_1, Spacer_1, ITerrain_1, TerrainTemplates_1, Arrays_1, Enums_1, Collectors_1, Vector2_1, Vector3_1, Objects_1, PlaceTemplate_1, IDebugTools_1, SelectionOverlay_1, TilePosition_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TemplatePanel extends DebugToolsPanel_1.default {
        constructor(gsapi) {
            super(gsapi);
            this.previewTiles = [];
            this.selectHeld = false;
            new LabelledRow_1.LabelledRow(this.api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTemplateType)))
                .append(this.dropdownType = new Dropdown_1.default(this.api)
                .setRefreshMethod(() => ({
                defaultOption: ITerrain_1.TileTemplateType.House,
                options: Enums_1.default.values(ITerrain_1.TileTemplateType)
                    .map(type => Arrays_1.tuple(type, Translation_1.default.generator(ITerrain_1.TileTemplateType[type])))
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t))),
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeTemplateType))
                .appendTo(this);
            new LabelledRow_1.LabelledRow(this.api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTemplate)))
                .append(this.dropdownTemplate = new Dropdown_1.default(this.api)
                .setRefreshMethod(() => ({
                defaultOption: Objects_1.default.keys(TerrainTemplates_1.default[this.dropdownType.selection]).collect(Collectors_1.default.first()),
                options: Objects_1.default.keys(TerrainTemplates_1.default[this.dropdownType.selection])
                    .map(name => Arrays_1.tuple(name, Translation_1.default.generator(name)))
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t))),
            })))
                .appendTo(this);
            this.mirrorVertically = new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonMirrorVertically))
                .appendTo(this);
            this.mirrorHorizontally = new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonMirrorHorizontally))
                .appendTo(this);
            this.rotate = new RangeRow_1.RangeRow(this.api)
                .classes.add("no-button")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelRotate)))
                .editRange(range => range
                .setMax(270)
                .setStep(90))
                .setDisplayValue(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.RangeRotateDegrees).get)
                .appendTo(this);
            this.degrade = new RangeRow_1.RangeRow(this.api)
                .classes.add("no-button")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelDegrade)))
                .editRange(range => range
                .setMax(100))
                .setDisplayValue(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.RangeDegradeAmount).get)
                .appendTo(this);
            new Spacer_1.default(this.api).appendTo(this);
            this.place = new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPlace))
                .appendTo(this);
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo, this.onSwitchTo);
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway, this.onSwitchAway);
        }
        getTranslation() {
            return IDebugTools_1.DebugToolsTranslation.PanelTemplates;
        }
        canClientMove(api) {
            if (this.place.checked || this.selectHeld)
                return false;
            return undefined;
        }
        onBindLoop(bindPressed, api) {
            const wasPlacePressed = api.wasPressed(this.DEBUG_TOOLS.selector.bindableSelectLocation) && this.gsapi.isMouseWithin();
            const wasCancelPressed = api.wasPressed(this.DEBUG_TOOLS.selector.bindableCancelSelectLocation) && this.gsapi.isMouseWithin();
            this.clearPreview();
            if (this.place.checked) {
                const template = this.getTemplate();
                if (template) {
                    const [terrain] = template;
                    const center = renderer.screenToTile(api.mouseX, api.mouseY);
                    const width = terrain[0].length;
                    const height = terrain.length;
                    const topLeft = new Vector2_1.default(center)
                        .subtract({ x: Math.floor(width / 2), y: Math.floor(height / 2) });
                    if (wasPlacePressed) {
                        this.placeTemplate(topLeft);
                        this.selectHeld = true;
                        bindPressed = this.DEBUG_TOOLS.selector.bindableSelectLocation;
                    }
                    else if (wasCancelPressed) {
                        this.place.setChecked(false);
                        bindPressed = this.DEBUG_TOOLS.selector.bindableCancelSelectLocation;
                    }
                    else {
                        for (let x = 0; x < width; x++) {
                            for (let y = 0; y < height; y++) {
                                if (!this.templateHasTile(template, x, y))
                                    continue;
                                const position = new Vector2_1.default(topLeft).add({ x, y }).mod(game.mapSize);
                                SelectionOverlay_1.default.add(position);
                                this.previewTiles.push(TilePosition_1.getTileId(position.x, position.y, localPlayer.z));
                            }
                        }
                    }
                    game.updateView(false);
                }
            }
            if (api.wasReleased(this.DEBUG_TOOLS.selector.bindableSelectLocation) && this.selectHeld) {
                this.selectHeld = false;
            }
            return bindPressed;
        }
        getTemplate() {
            const template = TerrainTemplates_1.default[this.dropdownType.selection][this.dropdownTemplate.selection];
            if (!template)
                return undefined;
            return MapGenHelpers_1.manipulateTemplates(this.getTemplateOptions(), [...template.terrain], template.doodad && [...template.doodad]);
        }
        templateHasTile(templates, x, y) {
            return templates[0][y][x] !== " " || (templates[1] && templates[1][y][x] !== " ");
        }
        getTemplateOptions() {
            return {
                mirrorHorizontally: this.mirrorHorizontally.checked,
                mirrorVertically: this.mirrorVertically.checked,
                rotate: this.rotate.value,
                degrade: this.degrade.value / 100,
                which: this.dropdownTemplate.selection,
            };
        }
        onSwitchTo() {
            hookManager.register(this, "DebugToolsDialog:TemplatePanel")
                .until(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway);
        }
        onSwitchAway() {
            this.place.setChecked(false);
            this.clearPreview();
        }
        changeTemplateType() {
            this.dropdownTemplate.refresh();
        }
        placeTemplate(topLeft) {
            this.place.setChecked(false);
            ActionExecutor_1.default.get(PlaceTemplate_1.default).execute(localPlayer, this.dropdownType.selection, topLeft.raw(), this.getTemplateOptions());
        }
        clearPreview() {
            if (!this.previewTiles.length)
                return;
            for (const previewTile of this.previewTiles) {
                const tile = TilePosition_1.getTilePosition(previewTile);
                SelectionOverlay_1.default.remove(new Vector3_1.default(tile));
            }
            this.previewTiles.splice(0, Infinity);
            if (!this.place.checked)
                game.updateView(false);
        }
    }
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], TemplatePanel.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        IHookHost_1.HookMethod
    ], TemplatePanel.prototype, "canClientMove", null);
    __decorate([
        IHookHost_1.HookMethod
    ], TemplatePanel.prototype, "onBindLoop", null);
    __decorate([
        Objects_1.Bound
    ], TemplatePanel.prototype, "onSwitchTo", null);
    __decorate([
        Objects_1.Bound
    ], TemplatePanel.prototype, "onSwitchAway", null);
    __decorate([
        Objects_1.Bound
    ], TemplatePanel.prototype, "changeTemplateType", null);
    exports.default = TemplatePanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGxhdGVQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9UZW1wbGF0ZVBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQThCQSxNQUFxQixhQUFjLFNBQVEseUJBQWU7UUFnQnpELFlBQW1CLEtBQXFCO1lBQ3ZDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUpHLGlCQUFZLEdBQWEsRUFBRSxDQUFDO1lBQ3JDLGVBQVUsR0FBRyxLQUFLLENBQUM7WUFLMUIsSUFBSSx5QkFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7aUJBQ3RGLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksa0JBQVEsQ0FBbUIsSUFBSSxDQUFDLEdBQUcsQ0FBQztpQkFDbEUsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsYUFBYSxFQUFFLDJCQUFnQixDQUFDLEtBQUs7Z0JBQ3JDLE9BQU8sRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLDJCQUFnQixDQUFDO3FCQUNyQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFLLENBQUMsSUFBSSxFQUFFLHFCQUFXLENBQUMsU0FBUyxDQUFDLDJCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdkUsT0FBTyxDQUFDLG9CQUFVLENBQUMsT0FBTyxDQUFDO3FCQUMzQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxjQUFJLENBQUMsUUFBUSxD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
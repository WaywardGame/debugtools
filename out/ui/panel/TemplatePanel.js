var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventEmitter", "event/EventManager", "game/mapgen/MapGenHelpers", "game/tile/ITerrain", "game/tile/TerrainTemplates", "language/impl/TranslationImpl", "mod/Mod", "mod/ModRegistry", "renderer/IRenderer", "ui/component/CheckButton", "ui/component/Dropdown", "ui/component/LabelledRow", "ui/component/RangeRow", "ui/component/Text", "ui/input/Bind", "ui/input/InputManager", "ui/screen/screens/game/util/movement/MovementHandler", "ui/screen/screens/menu/component/Spacer", "utilities/collection/Arrays", "utilities/enum/Enums", "utilities/math/Vector2", "utilities/Decorators", "../../action/PlaceTemplate", "../../IDebugTools", "../../overlay/SelectionOverlay", "../component/DebugToolsPanel", "@wayward/goodstream/Stream"], function (require, exports, EventEmitter_1, EventManager_1, MapGenHelpers_1, ITerrain_1, TerrainTemplates_1, TranslationImpl_1, Mod_1, ModRegistry_1, IRenderer_1, CheckButton_1, Dropdown_1, LabelledRow_1, RangeRow_1, Text_1, Bind_1, InputManager_1, MovementHandler_1, Spacer_1, Arrays_1, Enums_1, Vector2_1, Decorators_1, PlaceTemplate_1, IDebugTools_1, SelectionOverlay_1, DebugToolsPanel_1, Stream_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TemplatePanel extends DebugToolsPanel_1.default {
        constructor() {
            super();
            this.previewTiles = [];
            this.selectHeld = false;
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelTemplateType)))
                .append(this.dropdownType = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: ITerrain_1.TileTemplateType.WoodenHouses,
                options: Enums_1.default.values(ITerrain_1.TileTemplateType)
                    .map(type => (0, Arrays_1.Tuple)(type, TranslationImpl_1.default.generator(ITerrain_1.TileTemplateType[type])))
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => (0, Arrays_1.Tuple)(id, (option) => option.setText(t))),
            }))
                .event.subscribe("selection", this.changeTemplateType))
                .appendTo(this);
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelTemplate)))
                .append(this.dropdownTemplate = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: Stream_1.default.keys(TerrainTemplates_1.default[this.dropdownType.selection]).first(),
                options: Stream_1.default.keys(TerrainTemplates_1.default[this.dropdownType.selection])
                    .map(name => (0, Arrays_1.Tuple)(name, TranslationImpl_1.default.generator(name)))
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => (0, Arrays_1.Tuple)(id, (option) => option.setText(t))),
            })))
                .appendTo(this);
            this.mirrorVertically = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonMirrorVertically))
                .appendTo(this);
            this.mirrorHorizontally = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonMirrorHorizontally))
                .appendTo(this);
            this.overlap = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonOverlap))
                .appendTo(this);
            this.rotate = new RangeRow_1.RangeRow()
                .classes.add("no-button")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelRotate)))
                .editRange(range => range
                .setMax(270)
                .setStep(90))
                .setDisplayValue((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.RangeRotateDegrees).get)
                .appendTo(this);
            this.degrade = new RangeRow_1.RangeRow()
                .classes.add("no-button")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelDegrade)))
                .editRange(range => range
                .setMax(100))
                .setDisplayValue((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.RangeDegradeAmount).get)
                .appendTo(this);
            new Spacer_1.default().appendTo(this);
            this.place = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonPlace))
                .event.subscribe("toggle", this.tick)
                .appendTo(this);
        }
        getTranslation() {
            return IDebugTools_1.DebugToolsTranslation.PanelTemplates;
        }
        canClientMove() {
            if (this.place.checked || this.selectHeld)
                return false;
            return undefined;
        }
        onStopSelectLocation() {
            this.selectHeld = false;
            return false;
        }
        tick() {
            let updateRender = false;
            const isMouseWithin = gameScreen?.isMouseWithin();
            if (!this.place.checked || !isMouseWithin)
                updateRender = this.clearPreview();
            if (this.place.checked) {
                setTimeout(this.tick, game.interval);
                if (isMouseWithin) {
                    const options = this.getTemplateOptions();
                    const template = this.getTemplate(options);
                    if (template)
                        updateRender = this.updateTemplate(template, options);
                }
            }
            if (updateRender) {
                localPlayer.updateView(IRenderer_1.RenderSource.Mod, false);
            }
        }
        updateTemplate([terrain, doodads], options) {
            const center = renderer.worldRenderer.screenToVector(...InputManager_1.default.mouse.position.xy);
            const width = terrain[0].length;
            const height = terrain.length;
            const topLeft = new Vector2_1.default(center)
                .subtract({ x: Math.floor(width / 2), y: Math.floor(height / 2) });
            if (InputManager_1.default.input.isHolding(this.DEBUG_TOOLS.selector.bindableSelectLocation)) {
                this.placeTemplate(topLeft);
                this.selectHeld = true;
                this.clearPreview();
                return true;
            }
            if (InputManager_1.default.input.isHolding(this.DEBUG_TOOLS.selector.bindableCancelSelectLocation)) {
                this.place.setChecked(false);
                this.clearPreview();
                return true;
            }
            if (center.equals(this.center) && !this.templateOptionsChanged(options))
                return false;
            this.center = center;
            this.templateOptions = options;
            this.clearPreview();
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    if (!this.templateHasTile([terrain, doodads], x, y)) {
                        continue;
                    }
                    const position = new Vector2_1.default(topLeft).add({ x, y }).mod(localIsland.mapSize);
                    const tile = localIsland.getTile(position.x, position.y, localPlayer.z);
                    SelectionOverlay_1.default.add(tile);
                    this.previewTiles.push(tile);
                }
            }
            return true;
        }
        getTemplate(options) {
            const template = TerrainTemplates_1.default[this.dropdownType.selection]?.[this.dropdownTemplate.selection];
            if (!template) {
                return undefined;
            }
            return MapGenHelpers_1.default.manipulateTemplates(localIsland, options, [...template.terrain], template.doodad && [...template.doodad]);
        }
        templateHasTile(templates, x, y) {
            return templates[0][y][x] !== " " || (templates[1] && templates[1][y][x] !== " ");
        }
        getTemplateOptions() {
            return {
                mirrorHorizontally: this.mirrorHorizontally.checked,
                mirrorVertically: this.mirrorVertically.checked,
                overlap: this.overlap.checked,
                rotate: this.rotate.value,
                degrade: this.degrade.value / 100,
                which: this.dropdownTemplate.selection,
            };
        }
        templateOptionsChanged(options) {
            return !this.templateOptions
                || this.templateOptions.which !== options.which
                || this.templateOptions.mirrorHorizontally !== options.mirrorHorizontally
                || this.templateOptions.mirrorHorizontally !== options.mirrorVertically
                || this.templateOptions.overlap !== options.overlap
                || this.templateOptions.rotate !== options.rotate;
        }
        onSwitchTo() {
            Bind_1.default.registerHandlers(this);
        }
        onSwitchAway() {
            Bind_1.default.deregisterHandlers(this);
            this.place.setChecked(false);
            this.clearPreview();
        }
        changeTemplateType() {
            this.dropdownTemplate.refresh();
        }
        placeTemplate(topLeft) {
            this.place.setChecked(false);
            PlaceTemplate_1.default.execute(localPlayer, this.dropdownType.selection, topLeft.raw(), this.getTemplateOptions());
        }
        clearPreview() {
            if (!this.previewTiles.length)
                return false;
            for (const previewTile of this.previewTiles) {
                SelectionOverlay_1.default.remove(previewTile);
            }
            this.previewTiles.splice(0, Infinity);
            if (!this.place.checked) {
                localPlayer.updateView(IRenderer_1.RenderSource.Mod, false);
            }
            return true;
        }
    }
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], TemplatePanel.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        (0, EventManager_1.EventHandler)(MovementHandler_1.default, "canMove")
    ], TemplatePanel.prototype, "canClientMove", null);
    __decorate([
        Bind_1.default.onUp((0, ModRegistry_1.Registry)(IDebugTools_1.DEBUG_TOOLS_ID).registry("selector").get("bindableSelectLocation"), EventEmitter_1.Priority.High + 1)
    ], TemplatePanel.prototype, "onStopSelectLocation", null);
    __decorate([
        Decorators_1.Bound
    ], TemplatePanel.prototype, "tick", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(TemplatePanel, "switchTo")
    ], TemplatePanel.prototype, "onSwitchTo", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(TemplatePanel, "switchAway")
    ], TemplatePanel.prototype, "onSwitchAway", null);
    __decorate([
        Decorators_1.Bound
    ], TemplatePanel.prototype, "changeTemplateType", null);
    exports.default = TemplatePanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGxhdGVQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9UZW1wbGF0ZVBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWdDQSxNQUFxQixhQUFjLFNBQVEseUJBQWU7UUFtQnpEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFOUSxpQkFBWSxHQUFXLEVBQUUsQ0FBQztZQUNuQyxlQUFVLEdBQUcsS0FBSyxDQUFDO1lBTzFCLElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO2lCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7aUJBQ3RGLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksa0JBQVEsRUFBb0I7aUJBQzFELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLGFBQWEsRUFBRSwyQkFBZ0IsQ0FBQyxZQUFZO2dCQUM1QyxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQywyQkFBZ0IsQ0FBQztxQkFDckMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBQSxjQUFLLEVBQUMsSUFBSSxFQUFFLHlCQUFlLENBQUMsU0FBUyxDQUFDLDJCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDM0UsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUM1RSxHQUFHLENBQUMsQ0FBQyxD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
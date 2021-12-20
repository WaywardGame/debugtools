var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventEmitter", "event/EventManager", "game/mapgen/MapGenHelpers", "game/tile/ITerrain", "game/tile/TerrainTemplates", "language/impl/TranslationImpl", "mod/Mod", "mod/ModRegistry", "renderer/IRenderer", "ui/component/CheckButton", "ui/component/Dropdown", "ui/component/LabelledRow", "ui/component/RangeRow", "ui/component/Text", "ui/input/Bind", "ui/input/InputManager", "ui/screen/screens/game/util/movement/MovementHandler", "ui/screen/screens/menu/component/Spacer", "utilities/collection/Arrays", "utilities/enum/Enums", "utilities/math/Vector2", "utilities/math/Vector3", "utilities/Decorators", "../../action/PlaceTemplate", "../../IDebugTools", "../../overlay/SelectionOverlay", "../../util/TilePosition", "../component/DebugToolsPanel", "@wayward/goodstream/Stream"], function (require, exports, EventEmitter_1, EventManager_1, MapGenHelpers_1, ITerrain_1, TerrainTemplates_1, TranslationImpl_1, Mod_1, ModRegistry_1, IRenderer_1, CheckButton_1, Dropdown_1, LabelledRow_1, RangeRow_1, Text_1, Bind_1, InputManager_1, MovementHandler_1, Spacer_1, Arrays_1, Enums_1, Vector2_1, Vector3_1, Decorators_1, PlaceTemplate_1, IDebugTools_1, SelectionOverlay_1, TilePosition_1, DebugToolsPanel_1, Stream_1) {
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
                defaultOption: ITerrain_1.TileTemplateType.House,
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
            const isMouseWithin = gameScreen === null || gameScreen === void 0 ? void 0 : gameScreen.isMouseWithin();
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
            if (updateRender)
                game.updateView(IRenderer_1.RenderSource.Mod, false);
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
                    if (!this.templateHasTile([terrain, doodads], x, y))
                        continue;
                    const position = new Vector2_1.default(topLeft).add({ x, y }).mod(game.mapSize);
                    SelectionOverlay_1.default.add(position);
                    this.previewTiles.push((0, TilePosition_1.getTileId)(position.x, position.y, localPlayer.z));
                }
            }
            return true;
        }
        getTemplate(options) {
            const template = TerrainTemplates_1.default[this.dropdownType.selection][this.dropdownTemplate.selection];
            if (!template)
                return undefined;
            return (0, MapGenHelpers_1.manipulateTemplates)(localIsland, options, [...template.terrain], template.doodad && [...template.doodad]);
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
                const tile = (0, TilePosition_1.getTilePosition)(previewTile);
                SelectionOverlay_1.default.remove(new Vector3_1.default(tile));
            }
            this.previewTiles.splice(0, Infinity);
            if (!this.place.checked)
                game.updateView(IRenderer_1.RenderSource.Mod, false);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGxhdGVQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9UZW1wbGF0ZVBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWlDQSxNQUFxQixhQUFjLFNBQVEseUJBQWU7UUFtQnpEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFOUSxpQkFBWSxHQUFhLEVBQUUsQ0FBQztZQUNyQyxlQUFVLEdBQUcsS0FBSyxDQUFDO1lBTzFCLElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO2lCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7aUJBQ3RGLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksa0JBQVEsRUFBb0I7aUJBQzFELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLGFBQWEsRUFBRSwyQkFBZ0IsQ0FBQyxLQUFLO2dCQUNyQyxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQywyQkFBZ0IsQ0FBQztxQkFDckMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBQSxjQUFLLEVBQUMsSUFBSSxFQUFFLHlCQUFlLENBQUMsU0FBUyxDQUFDLDJCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDM0UsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUM1RSxHQUFHLENBQUMsQ0FBQyxD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
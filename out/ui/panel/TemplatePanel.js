var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "event/EventEmitter", "event/EventManager", "game/IGame", "language/Translation", "mapgen/MapGenHelpers", "mod/Mod", "mod/ModRegistry", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/RangeRow", "newui/component/Text", "newui/input/Bind", "newui/input/InputManager", "newui/screen/screens/game/util/movement/MovementHandler", "newui/screen/screens/GameScreen", "newui/screen/screens/menu/component/Spacer", "tile/ITerrain", "tile/TerrainTemplates", "utilities/Arrays", "utilities/enum/Enums", "utilities/math/Vector2", "utilities/math/Vector3", "../../action/PlaceTemplate", "../../IDebugTools", "../../overlay/SelectionOverlay", "../../util/TilePosition", "../component/DebugToolsPanel"], function (require, exports, ActionExecutor_1, EventEmitter_1, EventManager_1, IGame_1, Translation_1, MapGenHelpers_1, Mod_1, ModRegistry_1, CheckButton_1, Dropdown_1, LabelledRow_1, RangeRow_1, Text_1, Bind_1, InputManager_1, MovementHandler_1, GameScreen_1, Spacer_1, ITerrain_1, TerrainTemplates_1, Arrays_1, Enums_1, Vector2_1, Vector3_1, PlaceTemplate_1, IDebugTools_1, SelectionOverlay_1, TilePosition_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let TemplatePanel = (() => {
        class TemplatePanel extends DebugToolsPanel_1.default {
            constructor() {
                super();
                this.previewTiles = [];
                this.selectHeld = false;
                new LabelledRow_1.LabelledRow()
                    .classes.add("dropdown-label")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTemplateType)))
                    .append(this.dropdownType = new Dropdown_1.default()
                    .setRefreshMethod(() => ({
                    defaultOption: ITerrain_1.TileTemplateType.House,
                    options: Enums_1.default.values(ITerrain_1.TileTemplateType)
                        .map(type => Arrays_1.Tuple(type, Translation_1.default.generator(ITerrain_1.TileTemplateType[type])))
                        .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                        .map(([id, t]) => Arrays_1.Tuple(id, (option) => option.setText(t))),
                }))
                    .event.subscribe("selection", this.changeTemplateType))
                    .appendTo(this);
                new LabelledRow_1.LabelledRow()
                    .classes.add("dropdown-label")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTemplate)))
                    .append(this.dropdownTemplate = new Dropdown_1.default()
                    .setRefreshMethod(() => ({
                    defaultOption: Stream.keys(TerrainTemplates_1.default[this.dropdownType.selection]).first(),
                    options: Stream.keys(TerrainTemplates_1.default[this.dropdownType.selection])
                        .map(name => Arrays_1.Tuple(name, Translation_1.default.generator(name)))
                        .sorted(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                        .map(([id, t]) => Arrays_1.Tuple(id, (option) => option.setText(t))),
                })))
                    .appendTo(this);
                this.mirrorVertically = new CheckButton_1.CheckButton()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonMirrorVertically))
                    .appendTo(this);
                this.mirrorHorizontally = new CheckButton_1.CheckButton()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonMirrorHorizontally))
                    .appendTo(this);
                this.rotate = new RangeRow_1.RangeRow()
                    .classes.add("no-button")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelRotate)))
                    .editRange(range => range
                    .setMax(270)
                    .setStep(90))
                    .setDisplayValue(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.RangeRotateDegrees).get)
                    .appendTo(this);
                this.degrade = new RangeRow_1.RangeRow()
                    .classes.add("no-button")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelDegrade)))
                    .editRange(range => range
                    .setMax(100))
                    .setDisplayValue(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.RangeDegradeAmount).get)
                    .appendTo(this);
                new Spacer_1.default().appendTo(this);
                this.place = new CheckButton_1.CheckButton()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPlace))
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
                const isMouseWithin = GameScreen_1.gameScreen === null || GameScreen_1.gameScreen === void 0 ? void 0 : GameScreen_1.gameScreen.isMouseWithin();
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
                    game.updateView(IGame_1.RenderSource.Mod, false);
            }
            updateTemplate([terrain, doodads], options) {
                const center = renderer.screenToVector(...InputManager_1.default.mouse.position.xy);
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
                        this.previewTiles.push(TilePosition_1.getTileId(position.x, position.y, localPlayer.z));
                    }
                }
                return true;
            }
            getTemplate(options) {
                const template = TerrainTemplates_1.default[this.dropdownType.selection][this.dropdownTemplate.selection];
                if (!template)
                    return undefined;
                return MapGenHelpers_1.manipulateTemplates(options, [...template.terrain], template.doodad && [...template.doodad]);
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
            templateOptionsChanged(options) {
                return !this.templateOptions
                    || this.templateOptions.which !== options.which
                    || this.templateOptions.mirrorHorizontally !== options.mirrorHorizontally
                    || this.templateOptions.mirrorHorizontally !== options.mirrorVertically
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
                ActionExecutor_1.default.get(PlaceTemplate_1.default).execute(localPlayer, this.dropdownType.selection, topLeft.raw(), this.getTemplateOptions());
            }
            clearPreview() {
                if (!this.previewTiles.length)
                    return false;
                for (const previewTile of this.previewTiles) {
                    const tile = TilePosition_1.getTilePosition(previewTile);
                    SelectionOverlay_1.default.remove(new Vector3_1.default(tile));
                }
                this.previewTiles.splice(0, Infinity);
                if (!this.place.checked)
                    game.updateView(IGame_1.RenderSource.Mod, false);
                return true;
            }
        }
        __decorate([
            Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
        ], TemplatePanel.prototype, "DEBUG_TOOLS", void 0);
        __decorate([
            Override
        ], TemplatePanel.prototype, "getTranslation", null);
        __decorate([
            EventManager_1.EventHandler(MovementHandler_1.default, "canMove")
        ], TemplatePanel.prototype, "canClientMove", null);
        __decorate([
            Bind_1.default.onUp(ModRegistry_1.Registry(IDebugTools_1.DEBUG_TOOLS_ID).registry("selector").get("bindableSelectLocation"), EventEmitter_1.Priority.High + 1)
        ], TemplatePanel.prototype, "onStopSelectLocation", null);
        __decorate([
            Bound
        ], TemplatePanel.prototype, "tick", null);
        __decorate([
            EventManager_1.OwnEventHandler(TemplatePanel, "switchTo")
        ], TemplatePanel.prototype, "onSwitchTo", null);
        __decorate([
            EventManager_1.OwnEventHandler(TemplatePanel, "switchAway")
        ], TemplatePanel.prototype, "onSwitchAway", null);
        __decorate([
            Bound
        ], TemplatePanel.prototype, "changeTemplateType", null);
        return TemplatePanel;
    })();
    exports.default = TemplatePanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGxhdGVQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9UZW1wbGF0ZVBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWdDQTtRQUFBLE1BQXFCLGFBQWMsU0FBUSx5QkFBZTtZQWtCekQ7Z0JBQ0MsS0FBSyxFQUFFLENBQUM7Z0JBTlEsaUJBQVksR0FBYSxFQUFFLENBQUM7Z0JBQ3JDLGVBQVUsR0FBRyxLQUFLLENBQUM7Z0JBTzFCLElBQUkseUJBQVcsRUFBRTtxQkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO3FCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO3FCQUN0RixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLGtCQUFRLEVBQW9CO3FCQUMxRCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO29CQUN4QixhQUFhLEVBQUUsMkJBQWdCLENBQUMsS0FBSztvQkFDckMsT0FBTyxFQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsMkJBQWdCLENBQUM7eUJBQ3JDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQUssQ0FBQyxJQUFJLEVBQUUscUJBQVcsQ0FBQyxTQUFTLENBQUMsMkJBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUN2RSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQzVFLEdBQUcsQ0FBQyxDQUFDLENB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
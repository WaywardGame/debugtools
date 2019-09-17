var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "event/EventManager", "game/IGame", "language/Translation", "mapgen/MapGenHelpers", "mod/IHookHost", "mod/Mod", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/RangeRow", "newui/component/Text", "newui/screen/screens/GameScreen", "newui/screen/screens/menu/component/Spacer", "tile/ITerrain", "tile/TerrainTemplates", "utilities/Arrays", "utilities/enum/Enums", "utilities/math/Vector2", "utilities/math/Vector3", "../../action/PlaceTemplate", "../../IDebugTools", "../../overlay/SelectionOverlay", "../../util/TilePosition", "../component/DebugToolsPanel"], function (require, exports, ActionExecutor_1, EventManager_1, IGame_1, Translation_1, MapGenHelpers_1, IHookHost_1, Mod_1, CheckButton_1, Dropdown_1, LabelledRow_1, RangeRow_1, Text_1, GameScreen_1, Spacer_1, ITerrain_1, TerrainTemplates_1, Arrays_1, Enums_1, Vector2_1, Vector3_1, PlaceTemplate_1, IDebugTools_1, SelectionOverlay_1, TilePosition_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                    .sorted(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
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
                .appendTo(this);
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
            const wasPlacePressed = api.wasPressed(this.DEBUG_TOOLS.selector.bindableSelectLocation) && GameScreen_1.gameScreen.isMouseWithin();
            const wasCancelPressed = api.wasPressed(this.DEBUG_TOOLS.selector.bindableCancelSelectLocation) && GameScreen_1.gameScreen.isMouseWithin();
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
                    game.updateView(IGame_1.RenderSource.Mod, false);
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
            this.registerHookHost("DebugToolsDialog:TemplatePanel");
        }
        onSwitchAway() {
            hookManager.deregister(this);
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
                game.updateView(IGame_1.RenderSource.Mod, false);
        }
    }
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], TemplatePanel.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        Override
    ], TemplatePanel.prototype, "getTranslation", null);
    __decorate([
        IHookHost_1.HookMethod
    ], TemplatePanel.prototype, "canClientMove", null);
    __decorate([
        Override, IHookHost_1.HookMethod
    ], TemplatePanel.prototype, "onBindLoop", null);
    __decorate([
        EventManager_1.EventHandler("self")("switchTo")
    ], TemplatePanel.prototype, "onSwitchTo", null);
    __decorate([
        EventManager_1.EventHandler("self")("switchAway")
    ], TemplatePanel.prototype, "onSwitchAway", null);
    __decorate([
        Bound
    ], TemplatePanel.prototype, "changeTemplateType", null);
    exports.default = TemplatePanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGxhdGVQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9UZW1wbGF0ZVBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTZCQSxNQUFxQixhQUFjLFNBQVEseUJBQWU7UUFnQnpEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFKUSxpQkFBWSxHQUFhLEVBQUUsQ0FBQztZQUNyQyxlQUFVLEdBQUcsS0FBSyxDQUFDO1lBSzFCLElBQUkseUJBQVcsRUFBRTtpQkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO2lCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2lCQUN0RixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLGtCQUFRLEVBQW9CO2lCQUMxRCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixhQUFhLEVBQUUsMkJBQWdCLENBQUMsS0FBSztnQkFDckMsT0FBTyxFQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsMkJBQWdCLENBQUM7cUJBQ3JDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQUssQ0FBQyxJQUFJLEVBQUUscUJBQVcsQ0FBQyxTQUFTLENBQUMsMkJBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2RSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQzlFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxF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
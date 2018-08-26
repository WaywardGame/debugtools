var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "language/Translation", "mapgen/MapGenHelpers", "mod/IHookHost", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/RangeRow", "newui/component/Text", "newui/screen/screens/menu/component/Spacer", "tile/ITerrain", "tile/TerrainTemplates", "utilities/Arrays", "utilities/Collectors", "utilities/enum/Enums", "utilities/math/Vector2", "utilities/math/Vector3", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools", "../../overlay/SelectionOverlay", "../../util/TilePosition", "../component/DebugToolsPanel"], function (require, exports, Translation_1, MapGenHelpers_1, IHookHost_1, CheckButton_1, Dropdown_1, LabelledRow_1, RangeRow_1, Text_1, Spacer_1, ITerrain_1, TerrainTemplates_1, Arrays_1, Collectors_1, Enums_1, Vector2_1, Vector3_1, Objects_1, Actions_1, DebugTools_1, IDebugTools_1, SelectionOverlay_1, TilePosition_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TemplatePanel extends DebugToolsPanel_1.default {
        constructor(gsapi) {
            super(gsapi);
            this.previewTiles = [];
            this.selectHeld = false;
            new LabelledRow_1.LabelledRow(this.api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTemplateType)))
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
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTemplate)))
                .append(this.dropdownTemplate = new Dropdown_1.default(this.api)
                .setRefreshMethod(() => ({
                defaultOption: Objects_1.default.keys(TerrainTemplates_1.default[this.dropdownType.selection]).first(),
                options: Objects_1.default.keys(TerrainTemplates_1.default[this.dropdownType.selection])
                    .map(name => Arrays_1.tuple(name, Translation_1.default.generator(name)))
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t))),
            })))
                .appendTo(this);
            this.mirrorVertically = new CheckButton_1.CheckButton(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonMirrorVertically))
                .appendTo(this);
            this.mirrorHorizontally = new CheckButton_1.CheckButton(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonMirrorHorizontally))
                .appendTo(this);
            this.rotate = new RangeRow_1.RangeRow(this.api)
                .classes.add("no-button")
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelRotate)))
                .editRange(range => range
                .setMax(270)
                .setStep(90))
                .setDisplayValue(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.RangeRotateDegrees).get)
                .appendTo(this);
            this.degrade = new RangeRow_1.RangeRow(this.api)
                .classes.add("no-button")
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelDegrade)))
                .editRange(range => range
                .setMax(100))
                .setDisplayValue(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.RangeDegradeAmount).get)
                .appendTo(this);
            new Spacer_1.default(this.api).appendTo(this);
            this.place = new CheckButton_1.CheckButton(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonPlace))
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
            const wasPlacePressed = api.wasPressed(DebugTools_1.default.INSTANCE.selector.bindableSelectLocation) && this.gsapi.isMouseWithin();
            const wasCancelPressed = api.wasPressed(DebugTools_1.default.INSTANCE.selector.bindableCancelSelectLocation) && this.gsapi.isMouseWithin();
            if (this.previewTiles.length) {
                for (const previewTile of this.previewTiles) {
                    const tile = TilePosition_1.getTilePosition(previewTile);
                    SelectionOverlay_1.default.remove(new Vector3_1.default(tile));
                }
                this.previewTiles.splice(0, Infinity);
                if (!this.place.checked)
                    game.updateView(false);
            }
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
                        bindPressed = DebugTools_1.default.INSTANCE.selector.bindableSelectLocation;
                    }
                    else if (wasCancelPressed) {
                        this.place.setChecked(false);
                        bindPressed = DebugTools_1.default.INSTANCE.selector.bindableCancelSelectLocation;
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
            if (api.wasReleased(DebugTools_1.default.INSTANCE.selector.bindableSelectLocation) && this.selectHeld) {
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
        }
        changeTemplateType() {
            this.dropdownTemplate.refresh();
        }
        placeTemplate(topLeft) {
            this.place.setChecked(false);
            Actions_1.default.get("placeTemplate").execute({ point: topLeft.raw(), object: [this.dropdownType.selection, this.getTemplateOptions()] });
        }
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVtcGxhdGVQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9wYW5lbC9UZW1wbGF0ZVBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTRCQSxNQUFxQixhQUFjLFNBQVEseUJBQWU7UUFZekQsWUFBbUIsS0FBcUI7WUFDdkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBSkcsaUJBQVksR0FBYSxFQUFFLENBQUM7WUFDckMsZUFBVSxHQUFHLEtBQUssQ0FBQztZQUsxQixJQUFJLHlCQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztpQkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztpQkFDdEYsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxrQkFBUSxDQUFtQixJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUNsRSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixhQUFhLEVBQUUsMkJBQWdCLENBQUMsS0FBSztnQkFDckMsT0FBTyxFQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsMkJBQWdCLENBQUM7cUJBQ3JDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQUssQ0FBQyxJQUFJLEVBQUUscUJBQVcsQ0FBQyxTQUFTLENBQUMsMkJBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2RSxPQUFPLENBQUMsb0JBQVUsQ0FBQyxPQUFPLENBQUM7cUJBQzNCLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUksQ0FBQyxRQUFRLENB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
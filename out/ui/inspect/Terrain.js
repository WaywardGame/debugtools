var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "language/Dictionaries", "language/Translation", "mod/Mod", "newui/component/Button", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "tile/ITerrain", "tile/Terrains", "utilities/Arrays", "utilities/enum/Enums", "utilities/math/Vector3", "utilities/TileHelpers", "../../action/ChangeTerrain", "../../action/ToggleTilled", "../../IDebugTools", "../component/InspectInformationSection", "newui/component/BlockRow", "game/IGame"], function (require, exports, ActionExecutor_1, Dictionaries_1, Translation_1, Mod_1, Button_1, CheckButton_1, Dropdown_1, LabelledRow_1, Text_1, ITerrain_1, Terrains_1, Arrays_1, Enums_1, Vector3_1, TileHelpers_1, ChangeTerrain_1, ToggleTilled_1, IDebugTools_1, InspectInformationSection_1, BlockRow_1, IGame_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let TerrainInformation = (() => {
        class TerrainInformation extends InspectInformationSection_1.default {
            constructor() {
                super();
                new LabelledRow_1.LabelledRow()
                    .classes.add("dropdown-label")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelChangeTerrain)))
                    .append(this.dropdownTerrainType = new Dropdown_1.default()
                    .setRefreshMethod(() => ({
                    defaultOption: this.tile ? TileHelpers_1.default.getType(this.tile) : ITerrain_1.TerrainType.Dirt,
                    options: Enums_1.default.values(ITerrain_1.TerrainType)
                        .filter(terrain => terrain)
                        .map(terrain => Arrays_1.Tuple(terrain, new Translation_1.default(Dictionaries_1.Dictionary.Terrain, terrain).inContext(Translation_1.TextContext.Title)))
                        .sorted(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                        .map(([id, t]) => Arrays_1.Tuple(id, (option) => option.setText(t))),
                }))
                    .event.subscribe("selection", this.changeTerrain))
                    .appendTo(this);
                this.checkButtonTilled = new CheckButton_1.CheckButton()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleTilled))
                    .setRefreshMethod(this.isTilled)
                    .event.subscribe("toggle", this.toggleTilled)
                    .appendTo(this);
                new BlockRow_1.BlockRow()
                    .append(new Button_1.default()
                    .setText(() => IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRefreshTile))
                    .event.subscribe("activate", this.refreshTile))
                    .append(this.checkButtonIncludeNeighbors = new CheckButton_1.CheckButton()
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonIncludeNeighbors)))
                    .appendTo(this);
                ;
            }
            getTabs() {
                return [
                    [0, this.getTabTranslation],
                ];
            }
            getTabTranslation() {
                return this.tile && IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectTerrain)
                    .get(new Translation_1.default(Dictionaries_1.Dictionary.Terrain, TileHelpers_1.default.getType(this.tile)).inContext(Translation_1.TextContext.Title));
            }
            update(position, tile) {
                this.position = new Vector3_1.default(position.x, position.y, localPlayer.z);
                this.tile = tile;
                const terrainType = ITerrain_1.TerrainType[TileHelpers_1.default.getType(this.tile)];
                const tillable = this.isTillable();
                if (terrainType === this.terrainType && (!tillable || this.checkButtonTilled.checked === this.isTilled()))
                    return;
                this.terrainType = terrainType;
                this.dropdownTerrainType.refresh();
                this.setShouldLog();
                this.checkButtonTilled.toggle(tillable)
                    .refresh();
                return this;
            }
            logUpdate() {
                this.LOG.info("Terrain:", this.terrainType, ...this.isTillable() ? ["Tilled:", this.isTilled()] : []);
            }
            toggleTilled(_, tilled) {
                if (this.isTilled() !== tilled) {
                    ActionExecutor_1.default.get(ToggleTilled_1.default).execute(localPlayer, this.position, tilled);
                }
            }
            isTillable() {
                var _a;
                return ((_a = Terrains_1.default[TileHelpers_1.default.getType(this.tile)]) === null || _a === void 0 ? void 0 : _a.tillable) === true;
            }
            isTilled() {
                return this.tile && TileHelpers_1.default.isTilled(this.tile);
            }
            changeTerrain(_, terrain) {
                if (terrain === TileHelpers_1.default.getType(this.tile)) {
                    return;
                }
                ActionExecutor_1.default.get(ChangeTerrain_1.default).execute(localPlayer, terrain, this.position);
                this.update(this.position, this.tile);
            }
            refreshTile() {
                world.layers[this.position.z].updateTile(this.position.x, this.position.y, this.tile, true, this.checkButtonIncludeNeighbors.checked, true, true);
                game.updateView(IGame_1.RenderSource.Mod, false);
            }
        }
        __decorate([
            Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
        ], TerrainInformation.prototype, "LOG", void 0);
        __decorate([
            Override
        ], TerrainInformation.prototype, "getTabs", null);
        __decorate([
            Bound
        ], TerrainInformation.prototype, "getTabTranslation", null);
        __decorate([
            Override
        ], TerrainInformation.prototype, "update", null);
        __decorate([
            Override
        ], TerrainInformation.prototype, "logUpdate", null);
        __decorate([
            Bound
        ], TerrainInformation.prototype, "toggleTilled", null);
        __decorate([
            Bound
        ], TerrainInformation.prototype, "isTilled", null);
        __decorate([
            Bound
        ], TerrainInformation.prototype, "changeTerrain", null);
        __decorate([
            Bound
        ], TerrainInformation.prototype, "refreshTile", null);
        return TerrainInformation;
    })();
    exports.default = TerrainInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L1RlcnJhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBeUJBO1FBQUEsTUFBcUIsa0JBQW1CLFNBQVEsbUNBQXlCO1lBYXhFO2dCQUNDLEtBQUssRUFBRSxDQUFDO2dCQUVSLElBQUkseUJBQVcsRUFBRTtxQkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO3FCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO3FCQUN2RixNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksa0JBQVEsRUFBZTtxQkFDNUQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFDeEIsYUFBYSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHFCQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQVcsQ0FBQyxJQUFJO29CQUM1RSxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxzQkFBVyxDQUFDO3lCQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUM7eUJBQzFCLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGNBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxxQkFBVyxDQUFDLHlCQUFVLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyx5QkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7eUJBQ3pHLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUks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
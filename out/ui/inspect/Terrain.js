var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/tile/ITerrain", "game/tile/Terrains", "language/Dictionary", "language/ITranslation", "language/Translation", "mod/Mod", "renderer/IRenderer", "ui/component/BlockRow", "ui/component/Button", "ui/component/CheckButton", "ui/component/Dropdown", "ui/component/LabelledRow", "ui/component/Text", "utilities/collection/Arrays", "utilities/Decorators", "utilities/enum/Enums", "../../action/ChangeTerrain", "../../action/ToggleTilled", "../../IDebugTools", "../component/InspectInformationSection"], function (require, exports, ITerrain_1, Terrains_1, Dictionary_1, ITranslation_1, Translation_1, Mod_1, IRenderer_1, BlockRow_1, Button_1, CheckButton_1, Dropdown_1, LabelledRow_1, Text_1, Arrays_1, Decorators_1, Enums_1, ChangeTerrain_1, ToggleTilled_1, IDebugTools_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TerrainInformation extends InspectInformationSection_1.default {
        constructor() {
            super();
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelChangeTerrain)))
                .append(this.dropdownTerrainType = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: this.tile ? this.tile.type : ITerrain_1.TerrainType.Dirt,
                options: Enums_1.default.values(ITerrain_1.TerrainType)
                    .filter(terrain => terrain)
                    .map(terrain => (0, Arrays_1.Tuple)(terrain, Translation_1.default.get(Dictionary_1.default.Terrain, terrain).inContext(ITranslation_1.TextContext.Title)))
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => (0, Arrays_1.Tuple)(id, (option) => option.setText(t))),
            }))
                .event.subscribe("selection", this.changeTerrain))
                .appendTo(this);
            this.checkButtonTilled = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonToggleTilled))
                .setRefreshMethod(this.isTilled)
                .event.subscribe("toggle", this.toggleTilled)
                .appendTo(this);
            new BlockRow_1.BlockRow()
                .append(new Button_1.default()
                .setText(() => (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonRefreshTile))
                .event.subscribe("activate", this.refreshTile))
                .append(this.checkButtonIncludeNeighbors = new CheckButton_1.CheckButton()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonIncludeNeighbors)))
                .appendTo(this);
            ;
        }
        getTabs() {
            return [
                [0, this.getTabTranslation],
            ];
        }
        getTabTranslation() {
            return this.tile && (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.InspectTerrain)
                .get(Translation_1.default.get(Dictionary_1.default.Terrain, this.tile.type).inContext(ITranslation_1.TextContext.Title));
        }
        update(tile) {
            this.tile = tile;
            const terrainType = ITerrain_1.TerrainType[this.tile.type];
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
                ToggleTilled_1.default.execute(localPlayer, this.tile, tilled);
            }
        }
        isTillable() {
            return Terrains_1.default[this.tile.type]?.tillable === true;
        }
        isTilled() {
            return this.tile && this.tile.isTilled;
        }
        changeTerrain(_, terrain) {
            if (terrain === this.tile.type) {
                return;
            }
            ChangeTerrain_1.default.execute(localPlayer, terrain, this.tile);
            this.update(this.tile);
        }
        refreshTile() {
            localIsland.world.layers[this.tile.z].updateTile(this.tile.x, this.tile.y, this.tile, true, this.checkButtonIncludeNeighbors.checked, true, undefined, true);
            localPlayer.updateView(IRenderer_1.RenderSource.Mod, false);
        }
    }
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], TerrainInformation.prototype, "LOG", void 0);
    __decorate([
        Decorators_1.Bound
    ], TerrainInformation.prototype, "getTabTranslation", null);
    __decorate([
        Decorators_1.Bound
    ], TerrainInformation.prototype, "toggleTilled", null);
    __decorate([
        Decorators_1.Bound
    ], TerrainInformation.prototype, "isTilled", null);
    __decorate([
        Decorators_1.Bound
    ], TerrainInformation.prototype, "changeTerrain", null);
    __decorate([
        Decorators_1.Bound
    ], TerrainInformation.prototype, "refreshTile", null);
    exports.default = TerrainInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L1RlcnJhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBdUJBLE1BQXFCLGtCQUFtQixTQUFRLG1DQUF5QjtRQVl4RTtZQUNDLEtBQUssRUFBRSxDQUFDO1lBRVIsSUFBSSx5QkFBVyxFQUFFO2lCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztpQkFDdkYsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLGtCQUFRLEVBQWU7aUJBQzVELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsc0JBQVcsQ0FBQyxJQUFJO2dCQUM1RCxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxzQkFBVyxDQUFDO3FCQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUM7cUJBQzFCLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUEsY0FBSyxFQUFDLE9BQU8sRUFBRSxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxvQkFBVSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsMEJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3FCQUN6RyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxjQUFJLENBQUMsUUFB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
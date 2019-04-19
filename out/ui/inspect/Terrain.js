var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "language/Dictionaries", "language/Translation", "mod/Mod", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "tile/ITerrain", "tile/Terrains", "utilities/Arrays", "utilities/enum/Enums", "utilities/math/Vector3", "utilities/TileHelpers", "../../action/ChangeTerrain", "../../action/ToggleTilled", "../../IDebugTools", "../component/InspectInformationSection"], function (require, exports, ActionExecutor_1, Dictionaries_1, Translation_1, Mod_1, CheckButton_1, Dropdown_1, LabelledRow_1, Text_1, ITerrain_1, Terrains_1, Arrays_1, Enums_1, Vector3_1, TileHelpers_1, ChangeTerrain_1, ToggleTilled_1, IDebugTools_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                    .map(terrain => Arrays_1.tuple(terrain, new Translation_1.default(Dictionaries_1.Dictionary.Terrain, terrain).inContext(3)))
                    .sorted(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t))),
            }))
                .event.subscribe("selection", this.changeTerrain))
                .appendTo(this);
            this.checkButtonTilled = new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleTilled))
                .setRefreshMethod(() => this.tile && TileHelpers_1.default.isTilled(this.tile))
                .event.subscribe("toggle", this.toggleTilled)
                .appendTo(this);
        }
        getTabs() {
            return [
                [0, this.getTabTranslation],
            ];
        }
        getTabTranslation() {
            return this.tile && IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectTerrain)
                .get(new Translation_1.default(Dictionaries_1.Dictionary.Terrain, TileHelpers_1.default.getType(this.tile)).inContext(3));
        }
        update(position, tile) {
            this.position = new Vector3_1.default(position.x, position.y, localPlayer.z);
            this.tile = tile;
            const terrainType = ITerrain_1.TerrainType[TileHelpers_1.default.getType(this.tile)];
            if (terrainType === this.terrainType)
                return;
            this.terrainType = terrainType;
            this.dropdownTerrainType.refresh();
            this.setShouldLog();
            this.checkButtonTilled.toggle(Terrains_1.default[TileHelpers_1.default.getType(tile)].tillable === true)
                .refresh();
            return this;
        }
        logUpdate() {
            this.LOG.info("Terrain:", this.terrainType);
        }
        toggleTilled(_, tilled) {
            ActionExecutor_1.default.get(ToggleTilled_1.default).execute(localPlayer, this.position, tilled);
        }
        changeTerrain(_, terrain) {
            if (terrain === TileHelpers_1.default.getType(this.tile)) {
                return;
            }
            ActionExecutor_1.default.get(ChangeTerrain_1.default).execute(localPlayer, terrain, this.position);
            this.update(this.position, this.tile);
        }
    }
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], TerrainInformation.prototype, "LOG", void 0);
    __decorate([
        Bound
    ], TerrainInformation.prototype, "getTabTranslation", null);
    __decorate([
        Bound
    ], TerrainInformation.prototype, "toggleTilled", null);
    __decorate([
        Bound
    ], TerrainInformation.prototype, "changeTerrain", null);
    exports.default = TerrainInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L1RlcnJhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBdUJBLE1BQXFCLGtCQUFtQixTQUFRLG1DQUF5QjtRQVl4RTtZQUNDLEtBQUssRUFBRSxDQUFDO1lBRVIsSUFBSSx5QkFBVyxFQUFFO2lCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZGLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxrQkFBUSxFQUFlO2lCQUM1RCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixhQUFhLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMscUJBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBVyxDQUFDLElBQUk7Z0JBQzVFLE9BQU8sRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLHNCQUFXLENBQUM7cUJBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQztxQkFDMUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsY0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLHFCQUFXLENBQUMseUJBQVUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxHQUFtQixDQUFDLENBQUM7cUJBQ3pHLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENB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
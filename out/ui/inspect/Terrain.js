var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "action/ActionExecutor", "Enums", "language/Dictionaries", "language/Translation", "mod/Mod", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/Text", "tile/Terrains", "utilities/Arrays", "utilities/enum/Enums", "utilities/iterable/Collectors", "utilities/math/Vector3", "utilities/Objects", "utilities/TileHelpers", "../../action/ChangeTerrain", "../../action/ToggleTilled", "../../IDebugTools", "../component/InspectInformationSection"], function (require, exports, ActionExecutor_1, Enums_1, Dictionaries_1, Translation_1, Mod_1, CheckButton_1, Dropdown_1, LabelledRow_1, Text_1, Terrains_1, Arrays_1, Enums_2, Collectors_1, Vector3_1, Objects_1, TileHelpers_1, ChangeTerrain_1, ToggleTilled_1, IDebugTools_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TerrainInformation extends InspectInformationSection_1.default {
        constructor(gsapi) {
            super(gsapi);
            new LabelledRow_1.LabelledRow(this.api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelChangeTerrain)))
                .append(this.dropdownTerrainType = new Dropdown_1.default(this.api)
                .setRefreshMethod(() => ({
                defaultOption: this.tile ? TileHelpers_1.default.getType(this.tile) : Enums_1.TerrainType.Dirt,
                options: Enums_2.default.values(Enums_1.TerrainType)
                    .filter(terrain => terrain)
                    .map(terrain => Arrays_1.tuple(terrain, new Translation_1.default(Dictionaries_1.Dictionary.Terrain, terrain).inContext(3)))
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t))),
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeTerrain))
                .appendTo(this);
            this.checkButtonTilled = new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleTilled))
                .setRefreshMethod(() => this.tile && TileHelpers_1.default.isTilled(this.tile))
                .on(CheckButton_1.CheckButtonEvent.Change, this.toggleTilled)
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
            const terrainType = Enums_1.TerrainType[TileHelpers_1.default.getType(this.tile)];
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
            ActionExecutor_1.default.get(ChangeTerrain_1.default).execute(localPlayer, terrain, this.position);
            this.update(this.position, this.tile);
        }
    }
    __decorate([
        Mod_1.default.log(IDebugTools_1.DEBUG_TOOLS_ID)
    ], TerrainInformation.prototype, "LOG", void 0);
    __decorate([
        Objects_1.Bound
    ], TerrainInformation.prototype, "getTabTranslation", null);
    __decorate([
        Objects_1.Bound
    ], TerrainInformation.prototype, "toggleTilled", null);
    __decorate([
        Objects_1.Bound
    ], TerrainInformation.prototype, "changeTerrain", null);
    exports.default = TerrainInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L1RlcnJhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBMEJBLE1BQXFCLGtCQUFtQixTQUFRLG1DQUF5QjtRQVl4RSxZQUFtQixLQUFxQjtZQUN2QyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFYixJQUFJLHlCQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztpQkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztpQkFDdkYsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLGtCQUFRLENBQWMsSUFBSSxDQUFDLEdBQUcsQ0FBQztpQkFDcEUsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsYUFBYSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHFCQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsbUJBQVcsQ0FBQyxJQUFJO2dCQUM1RSxPQUFPLEVBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxtQkFBVyxDQUFDO3FCQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUM7cUJBQzFCLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGNBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxxQkFBVyxDQUFDLHlCQUFVLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLFNBQVMsR0FBbUIsQ0FBQyxDQUFDO3FCQUN6RyxPQUFPLENBQUMsb0JBQVUsQ0FBQyxPQUFPLENBQUM7cUJBQzNCLElBQUks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
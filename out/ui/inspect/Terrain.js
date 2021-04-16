var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/IGame", "game/tile/ITerrain", "game/tile/Terrains", "language/Dictionaries", "language/Translation", "mod/Mod", "ui/component/BlockRow", "ui/component/Button", "ui/component/CheckButton", "ui/component/Dropdown", "ui/component/LabelledRow", "ui/component/Text", "utilities/collection/Arrays", "utilities/enum/Enums", "utilities/game/TileHelpers", "utilities/math/Vector3", "../../action/ChangeTerrain", "../../action/ToggleTilled", "../../IDebugTools", "../component/InspectInformationSection"], function (require, exports, IGame_1, ITerrain_1, Terrains_1, Dictionaries_1, Translation_1, Mod_1, BlockRow_1, Button_1, CheckButton_1, Dropdown_1, LabelledRow_1, Text_1, Arrays_1, Enums_1, TileHelpers_1, Vector3_1, ChangeTerrain_1, ToggleTilled_1, IDebugTools_1, InspectInformationSection_1) {
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
                    .map(terrain => Arrays_1.Tuple(terrain, new Translation_1.default(Dictionaries_1.Dictionary.Terrain, terrain).inContext(Translation_1.TextContext.Title)))
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
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
                ToggleTilled_1.default.execute(localPlayer, this.position, tilled);
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
            ChangeTerrain_1.default.execute(localPlayer, terrain, this.position);
            this.update(this.position, this.tile);
        }
        refreshTile() {
            world.layers[this.position.z].updateTile(this.position.x, this.position.y, this.tile, true, this.checkButtonIncludeNeighbors.checked, true, undefined, true);
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
    exports.default = TerrainInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L1RlcnJhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBdUJBLE1BQXFCLGtCQUFtQixTQUFRLG1DQUF5QjtRQWF4RTtZQUNDLEtBQUssRUFBRSxDQUFDO1lBRVIsSUFBSSx5QkFBVyxFQUFFO2lCQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZGLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxrQkFBUSxFQUFlO2lCQUM1RCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixhQUFhLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMscUJBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBVyxDQUFDLElBQUk7Z0JBQzVFLE9BQU8sRUFBRSxlQUFLLENBQUMsTUFBTSxDQUFDLHNCQUFXLENBQUM7cUJBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQztxQkFDMUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsY0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLHFCQUFXLENBQUMseUJBQVUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLHlCQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztxQkFDekcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUM1RSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3BFLENBQUMsQ0FBQztpQkFDRixLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQ2xELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSx5QkFBVyxFQUFFO2lCQUN4QyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2lCQUM5RCxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2lCQUMvQixLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDO2lCQUM1QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxtQkFBUSxFQUFFO2lCQUNaLE1BQU0sQ0FBQyxJQUFJLGdCQUFNLEVBQUU7aUJBQ2xCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGlCQUFpQixDQUFDLENBQUM7aUJBQ25FLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLHlCQUFXLEVBQUU7aUJBQzFELE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztpQkFDcEUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pCLENBQUM7UUFDRixDQUFDO1FBR00sT0FBTztZQUNiLE9BQU87Z0JBQ04sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDO2FBQzNCLENBQUM7UUFDSCxDQUFDO1FBR00saUJBQWlCO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDLElBQUksSUFBSSx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQztpQkFDbkUsR0FBRyxDQUFDLElBQUkscUJBQVcsQ0FBQyx5QkFBVSxDQUFDLE9BQU8sRUFBRSxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMseUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pHLENBQUM7UUFHTSxNQUFNLENBQUMsUUFBa0IsRUFBRSxJQUFXO1lBQzVDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxpQkFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFFakIsTUFBTSxXQUFXLEdBQUcsc0JBQVcsQ0FBQyxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNoRSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbkMsSUFBSSxXQUFXLEtBQUssSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN4RyxPQUFPO1lBRVIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7WUFDL0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ25DLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVwQixJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztpQkFDckMsT0FBTyxFQUFFLENBQUM7WUFFWixPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFHTSxTQUFTO1lBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2RyxDQUFDO1FBR08sWUFBWSxDQUFDLENBQU0sRUFBRSxNQUFlO1lBQzNDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLE1BQU0sRUFBRTtnQkFDL0Isc0JBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDekQ7UUFDRixDQUFDO1FBRU8sVUFBVTs7WUFDakIsT0FBTyxDQUFBLE1BQUEsa0JBQW1CLENBQUMscUJBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLDBDQUFFLFFBQVEsTUFBSyxJQUFJLENBQUM7UUFDL0UsQ0FBQztRQUdPLFFBQVE7WUFDZixPQUFPLElBQUksQ0FBQyxJQUFJLElBQUkscUJBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFHTyxhQUFhLENBQUMsQ0FBTSxFQUFFLE9BQW9CO1lBQ2pELElBQUksT0FBTyxLQUFLLHFCQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDL0MsT0FBTzthQUNQO1lBRUQsdUJBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBR00sV0FBVztZQUNqQixLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM3SixJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFDLENBQUM7S0FDRDtJQWpIQTtRQURDLGFBQUcsQ0FBQyxHQUFHLENBQUMsNEJBQWMsQ0FBQzttREFDQztJQTZDekI7UUFEQyxRQUFRO3FEQUtSO0lBR0Q7UUFEQyxLQUFLOytEQUlMO0lBR0Q7UUFEQyxRQUFRO29EQWtCUjtJQUdEO1FBREMsUUFBUTt1REFHUjtJQUdEO1FBREMsS0FBSzswREFLTDtJQU9EO1FBREMsS0FBSztzREFHTDtJQUdEO1FBREMsS0FBSzsyREFRTDtJQUdEO1FBREMsS0FBSzt5REFJTDtJQW5IRixxQ0FvSEMifQ==
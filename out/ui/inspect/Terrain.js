var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "language/Dictionaries", "language/Translation", "mod/Mod", "newui/BindingManager", "newui/component/Button", "newui/component/CheckButton", "newui/component/ContextMenu", "newui/component/Text", "tile/Terrains", "utilities/Arrays", "utilities/Collectors", "utilities/enum/Enums", "utilities/math/Vector3", "utilities/Objects", "utilities/TileHelpers", "../../Actions", "../../IDebugTools", "../component/InspectInformationSection"], function (require, exports, Enums_1, Dictionaries_1, Translation_1, Mod_1, BindingManager_1, Button_1, CheckButton_1, ContextMenu_1, Text_1, Terrains_1, Arrays_1, Collectors_1, Enums_2, Vector3_1, Objects_1, TileHelpers_1, Actions_1, IDebugTools_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TerrainInformation extends InspectInformationSection_1.default {
        constructor(gsapi) {
            super(gsapi);
            new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonChangeTerrain))
                .on(Button_1.ButtonEvent.Activate, this.showTerrainContextMenu)
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
            this.setShouldLog();
            this.checkButtonTilled.toggle(Terrains_1.default[TileHelpers_1.default.getType(tile)].tillable === true)
                .refresh();
            return this;
        }
        logUpdate() {
            this.LOG.info("Terrain:", this.terrainType);
        }
        toggleTilled(_, tilled) {
            Actions_1.default.get("toggleTilled").execute({ position: this.position, object: tilled });
        }
        showTerrainContextMenu() {
            const screen = this.api.getVisibleScreen();
            if (!screen) {
                return;
            }
            const mouse = BindingManager_1.bindingManager.getMouse();
            Enums_2.default.values(Enums_1.TerrainType)
                .map(terrain => Arrays_1.tuple(Enums_1.TerrainType[terrain], {
                translation: new Translation_1.default(Dictionaries_1.Dictionary.Terrain, terrain).inContext(3),
                onActivate: this.changeTerrain(terrain),
            }))
                .collect(Collectors_1.default.toArray)
                .sort(([, t1], [, t2]) => Text_1.default.toString(t1.translation).localeCompare(Text_1.default.toString(t2.translation)))
                .values()
                .collect(Collectors_1.default.passTo(ContextMenu_1.default.bind(null, this.api), Collectors_1.PassStrategy.Splat))
                .addAllDescribedOptions()
                .setPosition(mouse.x, mouse.y)
                .schedule(screen.setContextMenu);
        }
        changeTerrain(terrain) {
            return () => {
                Actions_1.default.get("changeTerrain").execute({ position: this.position, object: terrain });
                this.update(this.position, this.tile);
            };
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
    ], TerrainInformation.prototype, "showTerrainContextMenu", null);
    exports.default = TerrainInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L1RlcnJhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBd0JBLE1BQXFCLGtCQUFtQixTQUFRLG1DQUF5QjtRQVd4RSxZQUFtQixLQUFxQjtZQUN2QyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFYixJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztpQkFDbEIsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztpQkFDL0QsRUFBRSxDQUFDLG9CQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztpQkFDckQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLHlCQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztpQkFDaEQsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztpQkFDOUQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxxQkFBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3BFLEVBQUUsQ0FBQyw4QkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztpQkFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFTSxPQUFPO1lBQ2IsT0FBTztnQkFDTixDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUM7YUFDM0IsQ0FBQztRQUNILENBQUM7UUFHTSxpQkFBaUI7WUFDdkIsT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsY0FBYyxDQUFDO2lCQUNuRSxHQUFHLENBQUMs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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "language/Translation", "newui/BindingManager", "newui/component/Button", "newui/component/CheckButton", "newui/component/ContextMenu", "newui/component/Text", "tile/Terrains", "utilities/Collectors", "utilities/enum/Enums", "utilities/math/Vector3", "utilities/Objects", "utilities/TileHelpers", "../../Actions", "../../DebugTools", "../../IDebugTools", "../component/InspectInformationSection"], function (require, exports, Enums_1, Translation_1, BindingManager_1, Button_1, CheckButton_1, ContextMenu_1, Text_1, Terrains_1, Collectors_1, Enums_2, Vector3_1, Objects_1, TileHelpers_1, Actions_1, DebugTools_1, IDebugTools_1, InspectInformationSection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TerrainInformation extends InspectInformationSection_1.default {
        constructor(api) {
            super(api);
            new Button_1.default(api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonChangeTerrain))
                .on(Button_1.ButtonEvent.Activate, this.showTerrainContextMenu)
                .appendTo(this);
            this.checkButtonTilled = new CheckButton_1.CheckButton(api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonToggleTilled))
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
            return this.tile && DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectTerrain)
                .get(Terrains_1.default[TileHelpers_1.default.getType(this.tile)].name);
        }
        update(position, tile) {
            this.position = new Vector3_1.default(position.x, position.y, localPlayer.z);
            this.tile = tile;
            const terrainType = Enums_1.TerrainType[TileHelpers_1.default.getType(this.tile)];
            if (terrainType !== this.terrainType) {
                this.terrainType = terrainType;
                DebugTools_1.default.LOG.info("Terrain:", this.terrainType);
            }
            this.checkButtonTilled.toggle(Terrains_1.default[TileHelpers_1.default.getType(tile)].tillable === true)
                .refresh();
            return this;
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
                .map(terrain => [Enums_1.TerrainType[terrain], {
                    translation: Translation_1.default.ofObjectName(Terrains_1.default[terrain], Enums_1.SentenceCaseStyle.Title, false),
                    onActivate: this.changeTerrain(terrain),
                }])
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L1RlcnJhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBcUJBLE1BQXFCLGtCQUFtQixTQUFRLG1DQUF5QjtRQU94RSxZQUFtQixHQUFVO1lBQzVCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVYLElBQUksZ0JBQU0sQ0FBQyxHQUFHLENBQUM7aUJBQ2IsT0FBTyxDQUFDLHdCQUFXLENBQUMsbUNBQXFCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztpQkFDL0QsRUFBRSxDQUFDLG9CQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztpQkFDckQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLHlCQUFXLENBQUMsR0FBRyxDQUFDO2lCQUMzQyxPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2lCQUM5RCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLHFCQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDcEUsRUFBRSxDQUFDLDhCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDO2lCQUM5QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQztRQUVNLE9BQU87WUFDYixPQUFPO2dCQUNOLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQzthQUMzQixDQUFDO1FBQ0gsQ0FBQztRQUdNLGlCQUFpQjtZQUN2QixPQUFPLElBQUksQ0FBQyxJQUFJLElBQUksd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxjQUFjLENBQUM7aUJBQ25FLEdBQUcsQ0FBQyxrQkFBbUIsQ0FBQyxxQkFBVyxDQUFD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
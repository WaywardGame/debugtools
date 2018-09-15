var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "language/Translation", "mod/Mod", "newui/BindingManager", "newui/component/Button", "newui/component/CheckButton", "newui/component/ContextMenu", "newui/component/Text", "tile/Terrains", "utilities/Arrays", "utilities/Collectors", "utilities/enum/Enums", "utilities/math/Vector3", "utilities/Objects", "utilities/TileHelpers", "../../Actions", "../../IDebugTools", "../component/InspectInformationSection"], function (require, exports, Enums_1, Translation_1, Mod_1, BindingManager_1, Button_1, CheckButton_1, ContextMenu_1, Text_1, Terrains_1, Arrays_1, Collectors_1, Enums_2, Vector3_1, Objects_1, TileHelpers_1, Actions_1, IDebugTools_1, InspectInformationSection_1) {
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
                .get(Terrains_1.default[TileHelpers_1.default.getType(this.tile)].name);
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
                translation: Translation_1.default.ofDescription(Terrains_1.default[terrain], Enums_1.SentenceCaseStyle.Title, false),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L1RlcnJhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBdUJBLE1BQXFCLGtCQUFtQixTQUFRLG1DQUF5QjtRQVd4RSxZQUFtQixLQUFxQjtZQUN2QyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFYixJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztpQkFDbEIsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztpQkFDL0QsRUFBRSxDQUFDLG9CQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztpQkFDckQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLHlCQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztpQkFDaEQsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztpQkFDOUQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxxQkFBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3BFLEVBQUUsQ0FBQyw4QkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztpQkFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFFTSxPQUFPO1lBQ2IsT0FBTztnQkFDTixDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUM7YUFDM0IsQ0FBQztRQUNILENBQUM7UUFHTSxpQkFBaUI7WUFDdkIsT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsY0FBYyxDQUFDO2lCQUNuRSxHQUFHLENBQUMsa0JBQW1CLENBQUMscUJBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEUsQ0FBQztRQUVNLE1BQU0sQ0FBQyxRQUFrQixFQUFFLElBQVc7WUFDNUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGlCQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUVqQixNQUFNLFdBQVcsR0FBRyxtQkFBVyxDQUFDLHFCQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2pFLElBQUksV0FBVyxLQUFLLElBQUksQ0FBQyxXQUFXO2dCQUFFLE9BQU87WUFFN0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7WUFDL0IsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRXBCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsa0JBQW1CLENBQUMscUJBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUUsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDO2lCQUM5RixPQUFPLEVBQUUsQ0FBQztZQUVaLE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUVNLFNBQVM7WUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFHTyxZQUFZLENBQUMsQ0FBTSxFQUFFLE1BQWU7WUFDM0MsaUJBQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDbEYsQ0FBQztRQUdPLHNCQUFzQjtZQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDM0MsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDWixPQUFPO2FBQ1A7WUFFRCxNQUFNLEtBQUssR0FBRywrQkFBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBR3hDLGVBQUssQ0FBQyxNQUFNLENBQUMsbUJBQVcsQ0FBQztpQkFDdkIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsY0FBSyxDQUFDLG1CQUFXLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQzNDLFdBQVcsRUFBRSxxQkFBVyxDQUFDLGFBQWEsQ0FBQyxrQkFBbUIsQ0FBQyxPQUFPLENBQUUsRUFBRSx5QkFBaUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO2dCQUNyRyxVQUFVLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7YUFDdkMsQ0FBQyxDQUFDO2lCQUNGLE9BQU8sQ0FBQyxvQkFBVSxDQUFDLE9BQU8sQ0FBQztpQkFDM0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ3BHLE1BQU0sRUFBRTtpQkFFUixPQUFPLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUMscUJBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSx5QkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNoRixzQkFBc0IsRUFBRTtpQkFDeEIsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQyxDQUFDO1FBRU8sYUFBYSxDQUFDLE9BQW9CO1lBQ3pDLE9BQU8sR0FBRyxFQUFFO2dCQUNYLGlCQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQztRQUNILENBQUM7S0FDRDtJQTNGQTtRQURDLGFBQUcsQ0FBQyxHQUFHLENBQUMsNEJBQWMsQ0FBQzttREFDQztJQThCekI7UUFEQyxlQUFLOytEQUlMO0lBdUJEO1FBREMsZUFBSzswREFHTDtJQUdEO1FBREMsZUFBSztvRUF1Qkw7SUF0RkYscUNBOEZDIn0=
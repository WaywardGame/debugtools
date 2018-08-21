var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "Enums", "language/Translation", "newui/BindingManager", "newui/component/Button", "newui/component/CheckButton", "newui/component/Component", "newui/component/ContextMenu", "newui/component/Text", "tile/Terrains", "utilities/Collectors", "utilities/enum/Enums", "utilities/Objects", "utilities/TileHelpers", "../../Actions", "../../DebugTools", "../../IDebugTools"], function (require, exports, Enums_1, Translation_1, BindingManager_1, Button_1, CheckButton_1, Component_1, ContextMenu_1, Text_1, Terrains_1, Collectors_1, Enums_2, Objects_1, TileHelpers_1, Actions_1, DebugTools_1, IDebugTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TerrainInformation extends Component_1.default {
        constructor(api) {
            super(api);
            this.title = new Text_1.Paragraph(api)
                .setText(() => this.tile && DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectTerrain)
                .get(Terrains_1.default[TileHelpers_1.default.getType(this.tile)].name))
                .appendTo(this);
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
        update(position, tile) {
            this.position = position;
            this.tile = tile;
            const terrainType = Enums_1.TerrainType[TileHelpers_1.default.getType(this.tile)];
            if (terrainType !== this.terrainType) {
                this.terrainType = terrainType;
                DebugTools_1.default.LOG.info("Terrain:", this.terrainType);
            }
            this.title.refresh();
            this.checkButtonTilled.toggle(Terrains_1.default[TileHelpers_1.default.getType(tile)].tillable === true)
                .refresh();
            return this;
        }
        toggleTilled(_, tilled) {
            actionManager.execute(localPlayer, Actions_1.default.get("toggleTilled"), { point: this.position, object: tilled });
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
                actionManager.execute(localPlayer, Actions_1.default.get("changeTerrain"), { point: this.position, object: terrain });
                this.update(this.position, this.tile);
            };
        }
    }
    __decorate([
        Objects_1.Bound
    ], TerrainInformation.prototype, "toggleTilled", null);
    __decorate([
        Objects_1.Bound
    ], TerrainInformation.prototype, "showTerrainContextMenu", null);
    exports.default = TerrainInformation;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVycmFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9pbnNwZWN0L1RlcnJhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBcUJBLE1BQXFCLGtCQUFtQixTQUFRLG1CQUFTO1FBUXhELFlBQW1CLEdBQVU7WUFDNUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRVgsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGdCQUFTLENBQUMsR0FBRyxDQUFDO2lCQUM3QixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQztpQkFDM0UsR0FBRyxDQUFDLGtCQUFtQixDQUFDLHFCQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNoRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxnQkFBTSxDQUFDLEdBQUcsQ0FBQztpQkFDYixPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2lCQUMvRCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDO2lCQUNyRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUkseUJBQVcsQ0FBQyxHQUFHLENBQUM7aUJBQzNDLE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUM7aUJBQzlELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUkscUJBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNwRSxFQUFFLENBQUMsOEJBQWdCLENBQUMsTUFBTSxFQUFF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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/IHookHost", "newui/component/IComponent", "newui/component/Text", "newui/screen/screens/game/component/Dialog", "newui/screen/screens/game/Dialogs", "utilities/math/Vector3", "utilities/Objects", "../DebugTools", "../IDebugTools", "./inspect/Corpse", "./inspect/Doodad", "./inspect/Entity", "./inspect/Item", "./inspect/Terrain", "./inspect/TileEvent"], function (require, exports, IHookHost_1, IComponent_1, Text_1, Dialog_1, Dialogs_1, Vector3_1, Objects_1, DebugTools_1, IDebugTools_1, Corpse_1, Doodad_1, Entity_1, Item_1, Terrain_1, TileEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const informationSectionClasses = [
        Terrain_1.default,
        Entity_1.default,
        Corpse_1.default,
        Doodad_1.default,
        TileEvent_1.default,
        Item_1.default,
    ];
    class InspectDialog extends Dialog_1.default {
        constructor(gsapi, id) {
            super(gsapi, id);
            this.infoSections = [];
            const api = gsapi.uiApi;
            this.classes.add("debug-tools-inspect-dialog");
            this.addScrollableWrapper(wrapper => wrapper
                .append(this.title = new Text_1.Paragraph(api)
                .setText(() => this.tile && DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InspectTileTitle)
                .get(this.tilePosition.x, this.tilePosition.y, this.tilePosition.z)))
                .append(this.infoSections = informationSectionClasses.map(cls => new cls(api)
                .classes.add("debug-tools-inspect-dialog-inspect-section")
                .on("update", this.update))));
            hookManager.register(this, "DebugToolsInspectDialog")
                .until(IComponent_1.ComponentEvent.Remove);
        }
        getName() {
            return DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.DialogTitleInspect);
        }
        setInspectionTile(tilePosition) {
            this.tilePosition = new Vector3_1.default(tilePosition.x, tilePosition.y, localPlayer.z);
            this.tile = game.getTile(...this.tilePosition.xyz);
            DebugTools_1.default.LOG.info("Inspecting tile at", this.tilePosition.xyz);
            DebugTools_1.default.LOG.info("Tile:", this.tile);
            this.update();
            return this;
        }
        onGameTickEnd() {
            this.update();
        }
        update() {
            this.title.refresh();
            for (const section of this.infoSections) {
                section.update(this.tilePosition, this.tile);
            }
        }
    }
    InspectDialog.description = {
        minSize: {
            x: 25,
            y: 25,
        },
        size: {
            x: 25,
            y: 30,
        },
        maxSize: {
            x: 40,
            y: 70,
        },
        edges: [
            [Dialogs_1.Edge.Left, 50],
            [Dialogs_1.Edge.Bottom, 0],
        ],
        saveOpen: false,
    };
    __decorate([
        IHookHost_1.HookMethod
    ], InspectDialog.prototype, "onGameTickEnd", null);
    __decorate([
        Objects_1.Bound
    ], InspectDialog.prototype, "update", null);
    exports.default = InspectDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5zcGVjdERpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9JbnNwZWN0RGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTBCQSxNQUFNLHlCQUF5QixHQUEwRDtRQUN4RixpQkFBa0I7UUFDbEIsZ0JBQWlCO1FBQ2pCLGdCQUFpQjtRQUNqQixnQkFBaUI7UUFDakIsbUJBQW9CO1FBQ3BCLGNBQWU7S0FDZixDQUFDO0lBRUYsTUFBcUIsYUFBYyxTQUFRLGdCQUFNO1FBMkJoRCxZQUFtQixLQUFxQixFQUFFLEVBQVk7WUFDckQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQU5WLGlCQUFZLEdBQWlDLEVBQUUsQ0FBQztZQU92RCxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBRXhCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFFL0MsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTztpQkFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxnQkFBUyxDQUFDLEdBQUcsQ0FBQztpQkFDckMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0UsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFhLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxZQUFhLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxZQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFFekUsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcseUJBQXlCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDO2lCQUMzRSxPQUFPLENBQUMsR0FBRyxDQUFDLDRDQUE0QyxDQUFDO2lCQUN6RCxFQUFFLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVoQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSx5QkFBeUIsQ0FBQztpQkFDbkQsS0FBSyxDQUFDLDJCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUVNLE9BQU87WUFDYixPQUFPLHdCQUFXLENBQUMsbUNBQXFCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBRU0saUJBQWlCLENBQUMsWUFBcUI7WUFDN0MsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLGlCQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUvRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRW5ELG9CQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsWUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xFLG9CQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXhDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUVkLE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUdNLGFBQWE7WUFDbkIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2YsQ0FBQztRQUdPLE1BQU07WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRXJCLEtBQUssTUFBTSxPQUFPLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDeEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBYSxFQUFFLElBQUksQ0FBQyxJQUFLLENBQUMsQ0FBQzthQUMvQztRQUNGLENBQUM7O0lBMUVhLHlCQUFXLEdBQXVCO1FBQy9DLE9BQU8sRUFBRTtZQUNSLENBQUMsRUFBRSxFQUFFO1lBQ0wsQ0FBQyxFQUFFLEVBQUU7U0FDTDtRQUNELElBQUksRUFBRTtZQUNMLENBQUMsRUFBRSxFQUFFO1lBQ0wsQ0FBQyxFQUFFLEVBQUU7U0FDTDtRQUNELE9BQU8sRUFBRTtZQUNSLENBQUMsRUFBRSxFQUFFO1lBQ0wsQ0FBQyxFQUFFLEVBQUU7U0FDTDtRQUNELEtBQUssRUFBRTtZQUNOLENBQUMsY0FBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7WUFDZixDQUFDLGNBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQ2hCO1FBQ0QsUUFBUSxFQUFFLEtBQUs7S0FDZixDQUFDO0lBNkNGO1FBREMsc0JBQVU7c0RBR1Y7SUFHRDtRQURDLGVBQUs7K0NBT0w7SUEzRUYsZ0NBNEVDIn0=
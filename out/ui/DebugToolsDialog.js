var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "ui/screen/screens/game/Dialogs", "ui/screen/screens/game/component/TabDialog", "utilities/collection/Tuple", "utilities/math/Vector2", "utilities/promise/Async", "../IDebugTools", "./component/DebugToolsPanel", "./panel/DisplayPanel", "./panel/GeneralPanel", "./panel/PaintPanel", "./panel/SelectionPanel", "./panel/TemperaturePanel", "./panel/TemplatePanel"], function (require, exports, Mod_1, Dialogs_1, TabDialog_1, Tuple_1, Vector2_1, Async_1, IDebugTools_1, DebugToolsPanel_1, DisplayPanel_1, GeneralPanel_1, PaintPanel_1, SelectionPanel_1, TemperaturePanel_1, TemplatePanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const subpanelClasses = [
        GeneralPanel_1.default,
        DisplayPanel_1.default,
        PaintPanel_1.default,
        SelectionPanel_1.default,
        TemplatePanel_1.default,
        TemperaturePanel_1.default,
    ];
    class DebugToolsDialog extends TabDialog_1.default {
        constructor(id) {
            super(id);
            this.classes.add("debug-tools-dialog");
            if (!this.DEBUG_TOOLS.hasPermission()) {
                (0, Async_1.sleep)(1).then(() => gameScreen?.dialogs.close(id));
            }
        }
        getName() {
            return (0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.DialogTitleMain);
        }
        getBindable() {
            return this.DEBUG_TOOLS.bindableToggleDialog;
        }
        getSubpanels() {
            return subpanelClasses.stream()
                .merge(this.DEBUG_TOOLS.modRegistryMainDialogPanels.getRegistrations()
                .map(registration => registration.data(DebugToolsPanel_1.default)))
                .map(cls => new cls())
                .toArray();
        }
        getSubpanelInformation(subpanels) {
            return subpanels
                .map(subpanel => (0, Tuple_1.Tuple)((0, IDebugTools_1.translation)(subpanel.getTranslation()).getString(), (0, IDebugTools_1.translation)(subpanel.getTranslation()), this.onShowSubpanel(subpanel)));
        }
    }
    DebugToolsDialog.description = {
        minResolution: new Vector2_1.default(300, 200),
        size: new Vector2_1.default(29, 25),
        edges: [
            [Dialogs_1.Edge.Right, 50],
            [Dialogs_1.Edge.Bottom, 31],
        ],
    };
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], DebugToolsDialog.prototype, "DEBUG_TOOLS", void 0);
    exports.default = DebugToolsDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29sc0RpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9EZWJ1Z1Rvb2xzRGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXVCQSxNQUFNLGVBQWUsR0FBaUM7UUFDckQsc0JBQVk7UUFDWixzQkFBWTtRQUNaLG9CQUFVO1FBQ1Ysd0JBQWM7UUFDZCx1QkFBYTtRQUNiLDBCQUFnQjtLQUNoQixDQUFDO0lBRUYsTUFBcUIsZ0JBQWlCLFNBQVEsbUJBQTBCO1FBZ0J2RSxZQUFtQixFQUFZO1lBQzlCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFFdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQ3RDLElBQUEsYUFBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ25EO1FBQ0YsQ0FBQztRQUVlLE9BQU87WUFDdEIsT0FBTyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUVlLFdBQVc7WUFDMUIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDO1FBQzlDLENBQUM7UUFNa0IsWUFBWTtZQUM5QixPQUFPLGVBQWUsQ0FBQyxNQUFNLEVBQUU7aUJBQzdCLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLDJCQUEyQixDQUFDLGdCQUFnQixFQUFFO2lCQUNwRSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLHlCQUFlLENBQUMsQ0FBQyxDQUFDO2lCQUN6RCxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO2lCQUNyQixPQUFPLEVBQUUsQ0FBQztRQUNiLENBQUM7UUFVa0Isc0JBQXNCLENBQUMsU0FBNEI7WUFDckUsT0FBTyxTQUFTO2lCQUNkLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUEsYUFBSyxFQUNyQixJQUFBLHlCQUFXLEVBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQ2xELElBQUEseUJBQVcsRUFBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUMsRUFDdEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FDN0IsQ0FBQyxDQUFDO1FBQ0wsQ0FBQzs7SUF4RGEsNEJBQVcsR0FBdUI7UUFDL0MsYUFBYSxFQUFFLElBQUksaUJBQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO1FBQ3BDLElBQUksRUFBRSxJQUFJLGlCQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUN6QixLQUFLLEVBQUU7WUFDTixDQUFDLGNBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO1lBQ2hCLENBQUMsY0FBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7U0FDakI7S0FDRCxDQUFDO0lBR2M7UUFEZixhQUFHLENBQUMsUUFBUSxDQUFhLDRCQUFjLENBQUM7eURBQ0Q7c0JBZHBCLGdCQUFnQiJ9
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "ui/screen/screens/game/component/TabDialog", "ui/screen/screens/game/Dialogs", "utilities/collection/Arrays", "utilities/math/Vector2", "utilities/promise/Async", "../IDebugTools", "./component/DebugToolsPanel", "./panel/DisplayPanel", "./panel/GeneralPanel", "./panel/PaintPanel", "./panel/SelectionPanel", "./panel/TemplatePanel"], function (require, exports, Mod_1, TabDialog_1, Dialogs_1, Arrays_1, Vector2_1, Async_1, IDebugTools_1, DebugToolsPanel_1, DisplayPanel_1, GeneralPanel_1, PaintPanel_1, SelectionPanel_1, TemplatePanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const subpanelClasses = [
        GeneralPanel_1.default,
        DisplayPanel_1.default,
        PaintPanel_1.default,
        SelectionPanel_1.default,
        TemplatePanel_1.default,
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
        getSubpanels() {
            return subpanelClasses.stream()
                .merge(this.DEBUG_TOOLS.modRegistryMainDialogPanels.getRegistrations()
                .map(registration => registration.data(DebugToolsPanel_1.default)))
                .map(cls => new cls())
                .toArray();
        }
        getSubpanelInformation(subpanels) {
            return subpanels
                .map(subpanel => (0, Arrays_1.Tuple)((0, IDebugTools_1.translation)(subpanel.getTranslation()).getString(), (0, IDebugTools_1.translation)(subpanel.getTranslation()), this.onShowSubpanel(subpanel)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29sc0RpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9EZWJ1Z1Rvb2xzRGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXFCQSxNQUFNLGVBQWUsR0FBaUM7UUFDckQsc0JBQVk7UUFDWixzQkFBWTtRQUNaLG9CQUFVO1FBQ1Ysd0JBQWM7UUFDZCx1QkFBYTtLQUNiLENBQUM7SUFFRixNQUFxQixnQkFBaUIsU0FBUSxtQkFBMEI7UUFnQnZFLFlBQW1CLEVBQVk7WUFDOUIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUV2QyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsRUFBRTtnQkFDdEMsSUFBQSxhQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDbkQ7UUFDRixDQUFDO1FBRWUsT0FBTztZQUN0QixPQUFPLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBTWtCLFlBQVk7WUFDOUIsT0FBTyxlQUFlLENBQUMsTUFBTSxFQUFFO2lCQUM3QixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQywyQkFBMkIsQ0FBQyxnQkFBZ0IsRUFBRTtpQkFDcEUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyx5QkFBZSxDQUFDLENBQUMsQ0FBQztpQkFDekQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztpQkFDckIsT0FBTyxFQUFFLENBQUM7UUFDYixDQUFDO1FBVWtCLHNCQUFzQixDQUFDLFNBQTRCO1lBQ3JFLE9BQU8sU0FBUztpQkFDZCxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFBLGNBQUssRUFDckIsSUFBQSx5QkFBVyxFQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUNsRCxJQUFBLHlCQUFXLEVBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQ3RDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQzdCLENBQUMsQ0FBQztRQUNMLENBQUM7O0lBcERhLDRCQUFXLEdBQXVCO1FBQy9DLGFBQWEsRUFBRSxJQUFJLGlCQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztRQUNwQyxJQUFJLEVBQUUsSUFBSSxpQkFBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDekIsS0FBSyxFQUFFO1lBQ04sQ0FBQyxjQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztZQUNoQixDQUFDLGNBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO1NBQ2pCO0tBQ0QsQ0FBQztJQUdjO1FBRGYsYUFBRyxDQUFDLFFBQVEsQ0FBYSw0QkFBYyxDQUFDO3lEQUNEO3NCQWRwQixnQkFBZ0IifQ==
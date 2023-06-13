/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "ui/screen/screens/game/Dialogs", "ui/screen/screens/game/component/TabDialog", "utilities/collection/Tuple", "utilities/math/Vector2", "utilities/promise/Async", "../IDebugTools", "./component/DebugToolsPanel", "./panel/DisplayPanel", "./panel/GeneralPanel", "./panel/PaintPanel", "./panel/SelectionPanel", "./panel/TemperaturePanel", "./panel/TemplatePanel", "ui/IUi", "event/EventManager"], function (require, exports, Mod_1, Dialogs_1, TabDialog_1, Tuple_1, Vector2_1, Async_1, IDebugTools_1, DebugToolsPanel_1, DisplayPanel_1, GeneralPanel_1, PaintPanel_1, SelectionPanel_1, TemperaturePanel_1, TemplatePanel_1, IUi_1, EventManager_1) {
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
        getIcon() {
            return this.DEBUG_TOOLS.menuBarButton;
        }
        getDefaultSubpanelInformation() {
            return this.subpanelInformations.find(spi => spi[0] === this.current) ?? super.getDefaultSubpanelInformation();
        }
        onChangeSubpanel(activeSubpanel) {
            this.current = activeSubpanel[0];
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
    exports.default = DebugToolsDialog;
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], DebugToolsDialog.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        (0, IUi_1.Save)(IUi_1.SaveLocation.Local)
    ], DebugToolsDialog.prototype, "current", void 0);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(DebugToolsDialog, "changeSubpanel")
    ], DebugToolsDialog.prototype, "onChangeSubpanel", null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29sc0RpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9EZWJ1Z1Rvb2xzRGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7Ozs7OztJQTBCSCxNQUFNLGVBQWUsR0FBaUM7UUFDckQsc0JBQVk7UUFDWixzQkFBWTtRQUNaLG9CQUFVO1FBQ1Ysd0JBQWM7UUFDZCx1QkFBYTtRQUNiLDBCQUFnQjtLQUNoQixDQUFDO0lBRUYsTUFBcUIsZ0JBQWlCLFNBQVEsbUJBQTBCO1FBbUJ2RSxZQUFtQixFQUFZO1lBQzlCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFFdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQ3RDLElBQUEsYUFBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ25EO1FBQ0YsQ0FBQztRQUVlLE9BQU87WUFDdEIsT0FBTyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUVlLFdBQVc7WUFDMUIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDO1FBQzlDLENBQUM7UUFFUSxPQUFPO1lBQ2YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztRQUN2QyxDQUFDO1FBR2tCLDZCQUE2QjtZQUMvQyxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO1FBQ2hILENBQUM7UUFHUyxnQkFBZ0IsQ0FBQyxjQUFtQztZQUM3RCxJQUFJLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBTWtCLFlBQVk7WUFDOUIsT0FBTyxlQUFlLENBQUMsTUFBTSxFQUFFO2lCQUM3QixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQywyQkFBMkIsQ0FBQyxnQkFBZ0IsRUFBRTtpQkFDcEUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyx5QkFBZSxDQUFDLENBQUMsQ0FBQztpQkFDekQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztpQkFDckIsT0FBTyxFQUFFLENBQUM7UUFDYixDQUFDO1FBVWtCLHNCQUFzQixDQUFDLFNBQTRCO1lBQ3JFLE9BQU8sU0FBUztpQkFDZCxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFBLGFBQUssRUFDckIsSUFBQSx5QkFBVyxFQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUNsRCxJQUFBLHlCQUFXLEVBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQ3RDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQzdCLENBQUMsQ0FBQztRQUNMLENBQUM7O0lBekVhLDRCQUFXLEdBQXVCO1FBQy9DLGFBQWEsRUFBRSxJQUFJLGlCQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztRQUNwQyxJQUFJLEVBQUUsSUFBSSxpQkFBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDekIsS0FBSyxFQUFFO1lBQ04sQ0FBQyxjQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztZQUNoQixDQUFDLGNBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO1NBQ2pCO0tBQ0QsQ0FBQztzQkFYa0IsZ0JBQWdCO0lBY3BCO1FBRGYsYUFBRyxDQUFDLFFBQVEsQ0FBYSw0QkFBYyxDQUFDO3lEQUNEO0lBR2hDO1FBRFAsSUFBQSxVQUFJLEVBQUMsa0JBQVksQ0FBQyxLQUFLLENBQUM7cURBQ29CO0lBNkJuQztRQURULElBQUEsOEJBQWUsRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzs0REFHbkQifQ==
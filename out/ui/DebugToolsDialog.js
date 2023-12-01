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
define(["require", "exports", "@wayward/utilities/event/EventManager", "@wayward/game/mod/Mod", "@wayward/game/ui/IUi", "@wayward/game/ui/screen/screens/game/Dialogs", "@wayward/game/ui/screen/screens/game/component/TabDialog", "@wayward/utilities/collection/Tuple", "@wayward/game/utilities/math/Vector2", "@wayward/utilities/promise/Async", "../IDebugTools", "./component/DebugToolsPanel", "./panel/DisplayPanel", "./panel/GeneralPanel", "./panel/PaintPanel", "./panel/SelectionPanel", "./panel/TemperaturePanel", "./panel/TemplatePanel"], function (require, exports, EventManager_1, Mod_1, IUi_1, Dialogs_1, TabDialog_1, Tuple_1, Vector2_1, Async_1, IDebugTools_1, DebugToolsPanel_1, DisplayPanel_1, GeneralPanel_1, PaintPanel_1, SelectionPanel_1, TemperaturePanel_1, TemplatePanel_1) {
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
        size: new Vector2_1.default(29, 31),
        edges: [
            [Dialogs_1.Edge.Right, 50],
            [Dialogs_1.Edge.Top, 7],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29sc0RpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9EZWJ1Z1Rvb2xzRGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7Ozs7OztJQTRCSCxNQUFNLGVBQWUsR0FBaUM7UUFDckQsc0JBQVk7UUFDWixzQkFBWTtRQUNaLG9CQUFVO1FBQ1Ysd0JBQWM7UUFDZCx1QkFBYTtRQUNiLDBCQUFnQjtLQUNoQixDQUFDO0lBRUYsTUFBcUIsZ0JBQWlCLFNBQVEsbUJBQTBCO1FBbUJ2RSxZQUFtQixFQUFZO1lBQzlCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFFdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQztnQkFDdkMsSUFBQSxhQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDcEQsQ0FBQztRQUNGLENBQUM7UUFFZSxPQUFPO1lBQ3RCLE9BQU8sSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzNELENBQUM7UUFFZSxXQUFXO1lBQzFCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztRQUM5QyxDQUFDO1FBRVEsT0FBTztZQUNmLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7UUFDdkMsQ0FBQztRQUdrQiw2QkFBNkI7WUFDL0MsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsNkJBQTZCLEVBQUUsQ0FBQztRQUNoSCxDQUFDO1FBR1MsZ0JBQWdCLENBQUMsY0FBbUM7WUFDN0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQU1rQixZQUFZO1lBQzlCLE9BQU8sZUFBZSxDQUFDLE1BQU0sRUFBRTtpQkFDN0IsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsMkJBQTJCLENBQUMsZ0JBQWdCLEVBQUU7aUJBQ3BFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMseUJBQWUsQ0FBQyxDQUFDLENBQUM7aUJBQ3pELEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7aUJBQ3JCLE9BQU8sRUFBRSxDQUFDO1FBQ2IsQ0FBQztRQVVrQixzQkFBc0IsQ0FBQyxTQUE0QjtZQUNyRSxPQUFPLFNBQVM7aUJBQ2QsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBQSxhQUFLLEVBQ3JCLElBQUEseUJBQVcsRUFBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFDbEQsSUFBQSx5QkFBVyxFQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUN0QyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUM3QixDQUFDLENBQUM7UUFDTCxDQUFDOztJQXpFYSw0QkFBVyxHQUF1QjtRQUMvQyxhQUFhLEVBQUUsSUFBSSxpQkFBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7UUFDcEMsSUFBSSxFQUFFLElBQUksaUJBQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQ3pCLEtBQUssRUFBRTtZQUNOLENBQUMsY0FBSSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7WUFDaEIsQ0FBQyxjQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztTQUNiO0tBQ0QsQ0FBQztzQkFYa0IsZ0JBQWdCO0lBY3BCO1FBRGYsYUFBRyxDQUFDLFFBQVEsQ0FBYSw0QkFBYyxDQUFDO3lEQUNEO0lBR2hDO1FBRFAsSUFBQSxVQUFJLEVBQUMsa0JBQVksQ0FBQyxLQUFLLENBQUM7cURBQ29CO0lBNkJuQztRQURULElBQUEsOEJBQWUsRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzs0REFHbkQifQ==
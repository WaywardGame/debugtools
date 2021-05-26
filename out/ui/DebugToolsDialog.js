var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "ui/screen/screens/game/Dialogs", "ui/screen/screens/GameScreen", "utilities/collection/Arrays", "utilities/math/Vector2", "utilities/promise/Async", "../IDebugTools", "./component/DebugToolsPanel", "./panel/DisplayPanel", "./panel/GeneralPanel", "./panel/PaintPanel", "./panel/SelectionPanel", "./panel/TemplatePanel", "./TabDialog"], function (require, exports, Mod_1, Dialogs_1, GameScreen_1, Arrays_1, Vector2_1, Async_1, IDebugTools_1, DebugToolsPanel_1, DisplayPanel_1, GeneralPanel_1, PaintPanel_1, SelectionPanel_1, TemplatePanel_1, TabDialog_1) {
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
            this.storePanels = true;
            this.classes.add("debug-tools-dialog");
            this.event.subscribe("willRemove", () => {
                this.storePanels = false;
                for (const subpanel of this.subpanels) {
                    subpanel.event.emit("switchAway");
                    subpanel.remove();
                }
            });
            if (!this.DEBUG_TOOLS.hasPermission()) {
                Async_1.sleep(1).then(() => GameScreen_1.gameScreen.closeDialog(id));
            }
        }
        getName() {
            return IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.DialogTitleMain);
        }
        getSubpanels() {
            if (!this.subpanels) {
                this.subpanels = subpanelClasses.stream()
                    .merge(this.DEBUG_TOOLS.modRegistryMainDialogPanels.getRegistrations()
                    .map(registration => registration.data(DebugToolsPanel_1.default)))
                    .map(cls => new cls()
                    .event.until(this, "close")
                    .subscribe("willRemove", panel => {
                    if (panel.isVisible()) {
                        panel.event.emit("switchAway");
                    }
                    if (this.storePanels) {
                        panel.store();
                        return false;
                    }
                    return undefined;
                }))
                    .toArray();
            }
            return this.subpanels
                .map(subpanel => Arrays_1.Tuple(IDebugTools_1.translation(subpanel.getTranslation()).getString(), IDebugTools_1.translation(subpanel.getTranslation()), this.onShowSubpanel(subpanel)));
        }
        onShowSubpanel(showPanel) {
            return (component) => {
                this.activePanel = showPanel.appendTo(component);
                this.activePanel.event.emit("switchTo");
            };
        }
    }
    DebugToolsDialog.description = {
        minSize: new Vector2_1.default(20, 25),
        size: new Vector2_1.default(25, 27),
        maxSize: new Vector2_1.default(40, 70),
        edges: [
            [Dialogs_1.Edge.Left, 25],
            [Dialogs_1.Edge.Bottom, 33],
        ],
    };
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], DebugToolsDialog.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        Override
    ], DebugToolsDialog.prototype, "getName", null);
    __decorate([
        Override
    ], DebugToolsDialog.prototype, "getSubpanels", null);
    exports.default = DebugToolsDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29sc0RpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9EZWJ1Z1Rvb2xzRGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXVCQSxNQUFNLGVBQWUsR0FBaUM7UUFDckQsc0JBQVk7UUFDWixzQkFBWTtRQUNaLG9CQUFVO1FBQ1Ysd0JBQWM7UUFDZCx1QkFBYTtLQUNiLENBQUM7SUFFRixNQUFxQixnQkFBaUIsU0FBUSxtQkFBUztRQXNCdEQsWUFBbUIsRUFBWTtZQUM5QixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7WUFISCxnQkFBVyxHQUFHLElBQUksQ0FBQztZQUkxQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBR3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO2dCQUN6QixLQUFLLE1BQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ3RDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUNsQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ2xCO1lBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsRUFBRTtnQkFDdEMsYUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyx1QkFBVyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2pEO1FBQ0YsQ0FBQztRQUVnQixPQUFPO1lBQ3ZCLE9BQU8seUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBVWdCLFlBQVk7WUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRTtxQkFDdkMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsMkJBQTJCLENBQUMsZ0JBQWdCLEVBQUU7cUJBQ3BFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMseUJBQWUsQ0FBQyxDQUFDLENBQUM7cUJBQ3pELEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxFQUFFO3FCQUNuQixLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7cUJBQzFCLFNBQVMsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLEVBQUU7b0JBQ2hDLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFFO3dCQUN0QixLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztxQkFDL0I7b0JBRUQsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO3dCQUNyQixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ2QsT0FBTyxLQUFLLENBQUM7cUJBQ2I7b0JBRUQsT0FBTyxTQUFTLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQyxDQUFDO3FCQUNILE9BQU8sRUFBRSxDQUFDO2FBQ1o7WUFFRCxPQUFPLElBQUksQ0FBQyxTQUFTO2lCQUNuQixHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxjQUFLLENBQ3JCLHlCQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQ2xELHlCQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQ3RDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQzdCLENBQUMsQ0FBQztRQUNMLENBQUM7UUFRTyxjQUFjLENBQUMsU0FBMEI7WUFDaEQsT0FBTyxDQUFDLFNBQW9CLEVBQUUsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNqRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUFDO1FBQ0gsQ0FBQzs7SUF6RmEsNEJBQVcsR0FBdUI7UUFDL0MsT0FBTyxFQUFFLElBQUksaUJBQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQzVCLElBQUksRUFBRSxJQUFJLGlCQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUN6QixPQUFPLEVBQUUsSUFBSSxpQkFBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDNUIsS0FBSyxFQUFFO1lBQ04sQ0FBQyxjQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUNmLENBQUMsY0FBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7U0FDakI7S0FDRCxDQUFDO0lBR0Y7UUFEQyxhQUFHLENBQUMsUUFBUSxDQUFhLDRCQUFjLENBQUM7eURBQ0Q7SUF5QjlCO1FBQVQsUUFBUTttREFFUjtJQVVTO1FBQVQsUUFBUTt3REE0QlI7SUFoRkYsbUNBK0ZDIn0=
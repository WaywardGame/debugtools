var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "newui/screen/screens/game/Dialogs", "newui/screen/screens/GameScreen", "utilities/Arrays", "utilities/Async", "utilities/math/Vector2", "../IDebugTools", "./component/DebugToolsPanel", "./panel/DisplayPanel", "./panel/GeneralPanel", "./panel/PaintPanel", "./panel/SelectionPanel", "./panel/TemplatePanel", "./TabDialog"], function (require, exports, Mod_1, Dialogs_1, GameScreen_1, Arrays_1, Async_1, Vector2_1, IDebugTools_1, DebugToolsPanel_1, DisplayPanel_1, GeneralPanel_1, PaintPanel_1, SelectionPanel_1, TemplatePanel_1, TabDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const subpanelClasses = [
        GeneralPanel_1.default,
        DisplayPanel_1.default,
        PaintPanel_1.default,
        SelectionPanel_1.default,
        TemplatePanel_1.default,
    ];
    let DebugToolsDialog = (() => {
        class DebugToolsDialog extends TabDialog_1.default {
            constructor(id) {
                super(id);
                this.storePanels = true;
                this.classes.add("debug-tools-dialog");
                this.registerHookHost("DebugToolsDialog");
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
                        .event.subscribe("willRemove", panel => {
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
        return DebugToolsDialog;
    })();
    exports.default = DebugToolsDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29sc0RpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9EZWJ1Z1Rvb2xzRGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXVCQSxNQUFNLGVBQWUsR0FBaUM7UUFDckQsc0JBQVk7UUFDWixzQkFBWTtRQUNaLG9CQUFVO1FBQ1Ysd0JBQWM7UUFDZCx1QkFBYTtLQUNiLENBQUM7SUFFRjtRQUFBLE1BQXFCLGdCQUFpQixTQUFRLG1CQUFTO1lBc0J0RCxZQUFtQixFQUFZO2dCQUM5QixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBSEgsZ0JBQVcsR0FBRyxJQUFJLENBQUM7Z0JBSTFCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7Z0JBR3ZDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUcxQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO29CQUN2QyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztvQkFDekIsS0FBSyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO3dCQUN0QyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzt3QkFDbEMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO3FCQUNsQjtnQkFDRixDQUFDLENBQUMsQ0FBQztnQkFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsRUFBRTtvQkFDdEMsYUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyx1QkFBVyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUNqRDtZQUNGLENBQUM7WUFFZ0IsT0FBTztnQkFDdkIsT0FBTyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzNELENBQUM7WUFVZ0IsWUFBWTtnQkFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRTt5QkFDdkMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsMkJBQTJCLENBQUMsZ0JBQWdCLEVBQUU7eUJBQ3BFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMseUJBQWUsQ0FBQyxDQUFDLENBQUM7eUJBQ3pELEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxFQUFFO3lCQUNuQixLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsRUFBRTt3QkFDdEMsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUU7NEJBQ3RCLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO3lCQUMvQjt3QkFFRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7NEJBQ3JCLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQzs0QkFDZCxPQUFPLEtBQUssQ0FBQzt5QkFDYjt3QkFFRCxPQUFPLFNBQVMsQ0FBQztvQkFDbEIsQ0FBQyxDQUFDLENBQUM7eUJBQ0gsT0FBTyxFQUFFLENBQUM7aUJBQ1o7Z0JBRUQsT0FBTyxJQUFJLENBQUMsU0FBUztxQkFDbkIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsY0FBSyxDQUNyQix5QkFBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUNsRCx5QkFBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUN0QyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUM3QixDQUFDLENBQUM7WUFDTCxDQUFDO1lBUU8sY0FBYyxDQUFDLFNBQTBCO2dCQUNoRCxPQUFPLENBQUMsU0FBb0IsRUFBRSxFQUFFO29CQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2pELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDekMsQ0FBQyxDQUFDO1lBQ0gsQ0FBQzs7UUEzRmEsNEJBQVcsR0FBdUI7WUFDL0MsT0FBTyxFQUFFLElBQUksaUJBQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQzVCLElBQUksRUFBRSxJQUFJLGlCQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN6QixPQUFPLEVBQUUsSUFBSSxpQkFBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDNUIsS0FBSyxFQUFFO2dCQUNOLENBQUMsY0FBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7Z0JBQ2YsQ0FBQyxjQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQzthQUNqQjtTQUNELENBQUM7UUFHRjtZQURDLGFBQUcsQ0FBQyxRQUFRLENBQWEsNEJBQWMsQ0FBQzs2REFDRDtRQTRCOUI7WUFBVCxRQUFRO3VEQUVSO1FBVVM7WUFBVCxRQUFROzREQTJCUjtRQWVGLHVCQUFDO1NBQUE7c0JBakdvQixnQkFBZ0IifQ==
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "newui/screen/screens/game/Dialogs", "utilities/Arrays", "utilities/Async", "../IDebugTools", "./component/DebugToolsPanel", "./panel/DisplayPanel", "./panel/GeneralPanel", "./panel/PaintPanel", "./panel/SelectionPanel", "./panel/TemplatePanel", "./TabDialog"], function (require, exports, Mod_1, Dialogs_1, Arrays_1, Async_1, IDebugTools_1, DebugToolsPanel_1, DisplayPanel_1, GeneralPanel_1, PaintPanel_1, SelectionPanel_1, TemplatePanel_1, TabDialog_1) {
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
            hookManager.register(this, "DebugToolsDialog")
                .until("Remove");
            this.on("WillRemove", () => {
                this.storePanels = false;
                for (const subpanel of this.subpanels) {
                    subpanel.emit(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway);
                    subpanel.remove();
                }
            });
            if (!this.DEBUG_TOOLS.hasPermission()) {
                Async_1.sleep(1).then(() => gameScreen.closeDialog(id));
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
                    .on("WillRemove", panel => {
                    if (panel.isVisible()) {
                        panel.emit(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway);
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
                .map(subpanel => Arrays_1.tuple(IDebugTools_1.translation(subpanel.getTranslation()).getString(), IDebugTools_1.translation(subpanel.getTranslation()), this.onShowSubpanel(subpanel)));
        }
        onShowSubpanel(showPanel) {
            return (component) => {
                this.activePanel = showPanel.appendTo(component);
                this.activePanel.emit(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo);
            };
        }
    }
    DebugToolsDialog.description = {
        minSize: {
            x: 20,
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
            [Dialogs_1.Edge.Left, 25],
            [Dialogs_1.Edge.Bottom, 0],
        ],
    };
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], DebugToolsDialog.prototype, "DEBUG_TOOLS", void 0);
    exports.default = DebugToolsDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29sc0RpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9EZWJ1Z1Rvb2xzRGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXVCQSxNQUFNLGVBQWUsR0FBaUM7UUFDckQsc0JBQVk7UUFDWixzQkFBWTtRQUNaLG9CQUFVO1FBQ1Ysd0JBQWM7UUFDZCx1QkFBYTtLQUNiLENBQUM7SUFFRixNQUFxQixnQkFBaUIsU0FBUSxtQkFBUztRQStCdEQsWUFBbUIsRUFBWTtZQUM5QixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7WUFISCxnQkFBVyxHQUFHLElBQUksQ0FBQztZQUkxQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBR3ZDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGtCQUFrQixDQUFDO2lCQUU1QyxLQUFLLFVBQXVCLENBQUM7WUFHL0IsSUFBSSxDQUFDLEVBQUUsZUFBNEIsR0FBRyxFQUFFO2dCQUN2QyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztnQkFDekIsS0FBSyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO29CQUN0QyxRQUFRLENBQUMsSUFBSSxDQUFDLHNDQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUMvQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ2xCO1lBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsRUFBRTtnQkFDdEMsYUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFXLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDakQ7UUFDRixDQUFDO1FBRU0sT0FBTztZQUNiLE9BQU8seUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBVU0sWUFBWTtZQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFO3FCQUN2QyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQywyQkFBMkIsQ0FBQyxnQkFBZ0IsRUFBRTtxQkFDcEUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyx5QkFBZSxDQUFDLENBQUMsQ0FBQztxQkFDekQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUU7cUJBQ25CLEVBQUUsZUFBNEIsS0FBSyxDQUFDLEVBQUU7b0JBQ3RDLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFFO3dCQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLHNDQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO3FCQUM1QztvQkFFRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7d0JBQ3JCLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDZCxPQUFPLEtBQUssQ0FBQztxQkFDYjtvQkFFRCxPQUFPLFNBQVMsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLENBQUM7cUJBQ0gsT0FBTyxFQUFFLENBQUM7YUFDWjtZQUVELE9BQU8sSUFBSSxDQUFDLFNBQVM7aUJBQ25CLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGNBQUssQ0FDckIseUJBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFDbEQseUJBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUMsRUFDdEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FDN0IsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQVFPLGNBQWMsQ0FBQyxTQUEwQjtZQUNoRCxPQUFPLENBQUMsU0FBb0IsRUFBRSxFQUFFO2dCQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2pELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLHNDQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RELENBQUMsQ0FBQztRQUNILENBQUM7O0lBdEdhLDRCQUFXLEdBQXVCO1FBQy9DLE9BQU8sRUFBRTtZQUNSLENBQUMsRUFBRSxFQUFFO1lBQ0wsQ0FBQyxFQUFFLEVBQUU7U0FDTDtRQUNELElBQUksRUFBRTtZQUNMLENBQUMsRUFBRSxFQUFFO1lBQ0wsQ0FBQyxFQUFFLEVBQUU7U0FDTDtRQUNELE9BQU8sRUFBRTtZQUNSLENBQUMsRUFBRSxFQUFFO1lBQ0wsQ0FBQyxFQUFFLEVBQUU7U0FDTDtRQUNELEtBQUssRUFBRTtZQUNOLENBQUMsY0FBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7WUFDZixDQUFDLGNBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQ2hCO0tBQ0QsQ0FBQztJQUdGO1FBREMsYUFBRyxDQUFDLFFBQVEsQ0FBYSw0QkFBYyxDQUFDO3lEQUNEO0lBeEJ6QyxtQ0E0R0MifQ==
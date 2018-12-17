var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "newui/screen/screens/game/Dialogs", "utilities/Async", "utilities/iterable/Collectors", "utilities/iterable/Generators", "../IDebugTools", "./component/DebugToolsPanel", "./panel/DisplayPanel", "./panel/GeneralPanel", "./panel/PaintPanel", "./panel/SelectionPanel", "./panel/TemplatePanel", "./TabDialog"], function (require, exports, Mod_1, Dialogs_1, Async_1, Collectors_1, Generators_1, IDebugTools_1, DebugToolsPanel_1, DisplayPanel_1, GeneralPanel_1, PaintPanel_1, SelectionPanel_1, TemplatePanel_1, TabDialog_1) {
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
        constructor(gsapi, id) {
            super(gsapi, id);
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
                Async_1.sleep(1).then(() => this.gsapi.closeDialog(id));
            }
        }
        getName() {
            return IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.DialogTitleMain);
        }
        getSubpanels() {
            if (!this.subpanels) {
                this.subpanels = subpanelClasses.values()
                    .include(this.DEBUG_TOOLS.modRegistryMainDialogPanels.getRegistrations()
                    .map(registration => registration.data(DebugToolsPanel_1.default)))
                    .map(cls => new cls(this.gsapi)
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
                    .collect(Collectors_1.default.toArray);
            }
            return this.subpanels
                .map(subpanel => Generators_1.tuple(IDebugTools_1.translation(subpanel.getTranslation()).getString(), IDebugTools_1.translation(subpanel.getTranslation()), this.onShowSubpanel(subpanel)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29sc0RpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9EZWJ1Z1Rvb2xzRGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXlCQSxNQUFNLGVBQWUsR0FBaUM7UUFDckQsc0JBQVk7UUFDWixzQkFBWTtRQUNaLG9CQUFVO1FBQ1Ysd0JBQWM7UUFDZCx1QkFBYTtLQUNiLENBQUM7SUFFRixNQUFxQixnQkFBaUIsU0FBUSxtQkFBUztRQStCdEQsWUFBbUIsS0FBcUIsRUFBRSxFQUFZO1lBQ3JELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFIVixnQkFBVyxHQUFHLElBQUksQ0FBQztZQUkxQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBR3ZDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGtCQUFrQixDQUFDO2lCQUU1QyxLQUFLLFVBQXVCLENBQUM7WUFHL0IsSUFBSSxDQUFDLEVBQUUsZUFBNEIsR0FBRyxFQUFFO2dCQUN2QyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztnQkFDekIsS0FBSyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO29CQUN0QyxRQUFRLENBQUMsSUFBSSxDQUFDLHNDQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUMvQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ2xCO1lBQ0YsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsRUFBRTtnQkFDdEMsYUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2hEO1FBQ0YsQ0FBQztRQUVNLE9BQU87WUFDYixPQUFPLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQVVNLFlBQVk7WUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRTtxQkFDdkMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsMkJBQTJCLENBQUMsZ0JBQWdCLEVBQUU7cUJBQ3RFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMseUJBQWUsQ0FBQyxDQUFDLENBQUM7cUJBQ3pELEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7cUJBQzdCLEVBQUUsZUFBNEIsS0FBSyxDQUFDLEVBQUU7b0JBQ3RDLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFFO3dCQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLHNDQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO3FCQUM1QztvQkFFRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7d0JBQ3JCLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDZCxPQUFPLEtBQUssQ0FBQztxQkFDYjtvQkFFRCxPQUFPLFNBQVMsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLENBQUM7cUJBQ0gsT0FBTyxDQUFDLG9CQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDOUI7WUFFRCxPQUFPLElBQUksQ0FBQyxTQUFTO2lCQUNuQixHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxrQkFBSyxDQUNyQix5QkFBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUNsRCx5QkFBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUN0QyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUM3QixDQUFDLENBQUM7UUFDTCxDQUFDO1FBUU8sY0FBYyxDQUFDLFNBQTBCO1lBQ2hELE9BQU8sQ0FBQyxTQUFvQixFQUFFLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDakQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsc0NBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDO1FBQ0gsQ0FBQzs7SUF0R2EsNEJBQVcsR0FBdUI7UUFDL0MsT0FBTyxFQUFFO1lBQ1IsQ0FBQyxFQUFFLEVBQUU7WUFDTCxDQUFDLEVBQUUsRUFBRTtTQUNMO1FBQ0QsSUFBSSxFQUFFO1lBQ0wsQ0FBQyxFQUFFLEVBQUU7WUFDTCxDQUFDLEVBQUUsRUFBRTtTQUNMO1FBQ0QsT0FBTyxFQUFFO1lBQ1IsQ0FBQyxFQUFFLEVBQUU7WUFDTCxDQUFDLEVBQUUsRUFBRTtTQUNMO1FBQ0QsS0FBSyxFQUFFO1lBQ04sQ0FBQyxjQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUNmLENBQUMsY0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDaEI7S0FDRCxDQUFDO0lBR0Y7UUFEQyxhQUFHLENBQUMsUUFBUSxDQUFhLDRCQUFjLENBQUM7eURBQ0Q7SUF4QnpDLG1DQTRHQyJ9
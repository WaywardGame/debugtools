var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "newui/component/IComponent", "newui/screen/screens/game/Dialogs", "utilities/Arrays", "utilities/Async", "utilities/iterable/Collectors", "../IDebugTools", "./component/DebugToolsPanel", "./panel/DisplayPanel", "./panel/GeneralPanel", "./panel/PaintPanel", "./panel/SelectionPanel", "./panel/TemplatePanel", "./TabDialog"], function (require, exports, Mod_1, IComponent_1, Dialogs_1, Arrays_1, Async_1, Collectors_1, IDebugTools_1, DebugToolsPanel_1, DisplayPanel_1, GeneralPanel_1, PaintPanel_1, SelectionPanel_1, TemplatePanel_1, TabDialog_1) {
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
                .until(IComponent_1.ComponentEvent.Remove);
            this.on(IComponent_1.ComponentEvent.WillRemove, () => {
                this.storePanels = false;
                for (const subpanel of this.subpanels) {
                    subpanel.trigger(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway);
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
                    .on(IComponent_1.ComponentEvent.WillRemove, panel => {
                    if (panel.isVisible()) {
                        panel.trigger(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway);
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
                .map(subpanel => Arrays_1.tuple(IDebugTools_1.translation(subpanel.getTranslation()).getString(), IDebugTools_1.translation(subpanel.getTranslation()), this.onShowSubpanel(subpanel)));
        }
        onShowSubpanel(showPanel) {
            return (component) => {
                this.activePanel = showPanel.appendTo(component);
                this.activePanel.trigger(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdUb29sc0RpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91aS9EZWJ1Z1Rvb2xzRGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXlCQSxNQUFNLGVBQWUsR0FBaUM7UUFDckQsc0JBQVk7UUFDWixzQkFBWTtRQUNaLG9CQUFVO1FBQ1Ysd0JBQWM7UUFDZCx1QkFBYTtLQUNiLENBQUM7SUFFRixNQUFxQixnQkFBaUIsU0FBUSxtQkFBUztRQStCdEQsWUFBbUIsS0FBcUIsRUFBRSxFQUFZO1lBQ3JELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFIVixnQkFBVyxHQUFHLElBQUksQ0FBQztZQUkxQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBR3ZDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGtCQUFrQixDQUFDO2lCQUU1QyxLQUFLLENBQUMsMkJBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUcvQixJQUFJLENBQUMsRUFBRSxDQUFDLDJCQUFjLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtnQkFDdkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQ3pCLEtBQUssTUFBTSxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtvQkFDdEMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxzQ0FBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDbEQsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUNsQjtZQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQ3RDLGFBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMs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
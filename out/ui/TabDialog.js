var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventManager", "newui/component/Button", "newui/component/Component", "newui/NewUi", "newui/screen/screens/game/component/Dialog", "newui/screen/screens/game/Dialogs"], function (require, exports, EventManager_1, Button_1, Component_1, NewUi_1, Dialog_1, Dialogs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let TabDialog = (() => {
        class TabDialog extends Dialog_1.default {
            constructor(id) {
                super(id);
                this.classes.add("debug-tools-tab-dialog");
                new Component_1.default()
                    .classes.add("debug-tools-tab-dialog-subpanel-link-wrapper")
                    .append(this.subpanelLinkWrapper = this.addScrollableWrapper())
                    .appendTo(this.body);
                this.panelWrapper = this.addScrollableWrapper()
                    .appendTo(new Component_1.default()
                    .classes.add("debug-tools-tab-dialog-subpanel-wrapper")
                    .appendTo(this.body));
                this.updateSubpanelList();
                this.showFirstSubpanel();
                this.onResize();
            }
            updateSubpanelList() {
                this.subpanelInformations = this.getSubpanels();
                this.subpanelLinkWrapper.dump()
                    .append(this.subpanelInformations.map(subpanel => new Button_1.default()
                    .classes.add("debug-tools-tab-dialog-subpanel-link")
                    .setText(subpanel[1])
                    .event.subscribe("activate", this.showSubPanel(subpanel[0]))
                    .schedule(subpanelButton => subpanel[4] = subpanelButton)
                    .schedule(subpanel[3])));
                if (!this.activeSubpanel)
                    return;
                let found = false;
                for (const [id, , , , button] of this.subpanelInformations) {
                    if (id === this.activeSubpanel[0]) {
                        this.setActiveButton(button);
                        found = true;
                        break;
                    }
                }
                if (!found)
                    this.showFirstSubpanel();
            }
            showSubPanel(idOrButton) {
                if (idOrButton instanceof Button_1.default) {
                    const subpanel = this.subpanelInformations.find(([, , , , button]) => button === idOrButton);
                    if (!subpanel)
                        return;
                    this.switchSubpanel(subpanel);
                }
                return (link) => {
                    const subpanel = this.subpanelInformations.find(([id2]) => idOrButton === id2);
                    if (!subpanel)
                        return;
                    this.switchSubpanel(subpanel);
                };
            }
            showFirstSubpanel() {
                const [subpanelId, , , , button] = this.subpanelInformations[0];
                this.showSubPanel(subpanelId)(button);
            }
            switchSubpanel(subpanel) {
                this.activeSubpanel = subpanel;
                this.setActiveButton(subpanel[4]);
                subpanel[2](this.panelWrapper.dump());
                this.event.emit("changeSubpanel");
            }
            setActiveButton(button) {
                for (const element of this.subpanelLinkWrapper.findDescendants(".debug-tools-tab-dialog-subpanel-link.active")) {
                    element.classList.remove("active");
                }
                button.classes.add("active");
            }
            onResize() {
                const dialogWidth = NewUi_1.default.windowWidth * (this.edges[Dialogs_1.Edge.Right] - this.edges[Dialogs_1.Edge.Left]) / 100;
                this.classes.toggle(dialogWidth < 440, "tabs-drawer");
            }
        }
        __decorate([
            Override
        ], TabDialog.prototype, "event", void 0);
        __decorate([
            EventManager_1.OwnEventHandler(TabDialog, "resize")
        ], TabDialog.prototype, "onResize", null);
        return TabDialog;
    })();
    exports.default = TabDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFiRGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3VpL1RhYkRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFlQTtRQUFBLE1BQThCLFNBQVUsU0FBUSxnQkFBTTtZQVNyRCxZQUFtQixFQUFZO2dCQUM5QixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFFM0MsSUFBSSxtQkFBUyxFQUFFO3FCQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUM7cUJBQzNELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7cUJBQzlELFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRXRCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFO3FCQUM3QyxRQUFRLENBQUMsSUFBSSxtQkFBUyxFQUFFO3FCQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxDQUFDO3FCQUN0RCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBRXhCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUMxQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQkFFekIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pCLENBQUM7WUFJUyxrQkFBa0I7Z0JBQzNCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBRWhELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUU7cUJBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxnQkFBTSxFQUFFO3FCQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDO3FCQUNuRCxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNwQixLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMzRCxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDO3FCQUN4RCxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUUzQixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWM7b0JBQUUsT0FBTztnQkFFakMsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUNsQixLQUFLLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQUFBRCxFQUFHLEFBQUQsRUFBRyxBQUFELEVBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO29CQUMzRCxJQUFJLEVBQUUsS0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUNsQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU8sQ0FBQyxDQUFDO3dCQUM5QixLQUFLLEdBQUcsSUFBSSxDQUFDO3dCQUNiLE1BQU07cUJBQ047aUJBQ0Q7Z0JBRUQsSUFBSSxDQUFDLEtBQUs7b0JBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDdEMsQ0FBQztZQUlTLFlBQVksQ0FBQyxVQUFvQztnQkFDMUQsSUFBSSxVQUFVLFlBQVksZ0JBQU0sRUFBRTtvQkFDakMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxBQUFELEVBQUcsQUFBRCxFQUFHLEFBQUQsRUFBRyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxDQUFDO29CQUM3RixJQUFJLENBQUMsUUFBUTt3QkFBRSxPQUFPO29CQUV0QixJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUM5QjtnQkFFRCxPQUFPLENBQUMsSUFBWSxFQUFFLEVBQUU7b0JBQ3ZCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEtBQUssR0FBRyxDQUFDLENBQUM7b0JBQy9FLElBQUksQ0FBQyxRQUFRO3dCQUFFLE9BQU87b0JBRXRCLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQy9CLENBQUMsQ0FBQztZQUNILENBQUM7WUFFTyxpQkFBaUI7Z0JBQ3hCLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQUFBRCxFQUFHLEFBQUQsRUFBRyxBQUFELEVBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU8sQ0FBQyxDQUFDO1lBQ3hDLENBQUM7WUFFTyxjQUFjLENBQUMsUUFBNkI7Z0JBQ25ELElBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDO2dCQUUvQixJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDO2dCQUVuQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUV0QyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFFTyxlQUFlLENBQUMsTUFBYztnQkFDckMsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUFDLDhDQUE4QyxDQUFDLEVBQUU7b0JBQy9HLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUNuQztnQkFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5QixDQUFDO1lBR08sUUFBUTtnQkFDZixNQUFNLFdBQVcsR0FBRyxlQUFLLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQy9GLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDdkQsQ0FBQztTQUNEO1FBckdVO1lBQVQsUUFBUTtnREFBcUQ7UUFpRzlEO1lBREMsOEJBQWUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDO2lEQUlwQztRQUNGLGdCQUFDO1NBQUE7c0JBdEc2QixTQUFTIn0=
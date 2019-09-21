var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventManager", "newui/component/Button", "newui/component/Component", "newui/NewUi", "newui/screen/screens/game/component/Dialog", "newui/screen/screens/game/Dialogs"], function (require, exports, EventManager_1, Button_1, Component_1, NewUi_1, Dialog_1, Dialogs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.default = TabDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFiRGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3VpL1RhYkRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFnQkEsTUFBOEIsU0FBVSxTQUFRLGdCQUFNO1FBU3JELFlBQW1CLEVBQVk7WUFDOUIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUUzQyxJQUFJLG1CQUFTLEVBQUU7aUJBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4Q0FBOEMsQ0FBQztpQkFDM0QsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztpQkFDOUQsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV0QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtpQkFDN0MsUUFBUSxDQUFDLElBQUksbUJBQVMsRUFBRTtpQkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQztpQkFDdEQsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRXhCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBRXpCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNqQixDQUFDO1FBSVMsa0JBQWtCO1lBQzNCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFaEQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRTtpQkFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLGdCQUFNLEVBQUU7aUJBQzVELE9BQU8sQ0FBQyxH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
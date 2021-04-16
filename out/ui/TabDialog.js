var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "event/EventManager", "ui/component/Button", "ui/component/Component", "ui/screen/screens/game/component/Dialog", "ui/screen/screens/game/Dialogs"], function (require, exports, EventManager_1, Button_1, Component_1, Dialog_1, Dialogs_1) {
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
            const dialogWidth = ui.windowWidth * (this.edges[Dialogs_1.Edge.Right] - this.edges[Dialogs_1.Edge.Left]) / 100;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFiRGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3VpL1RhYkRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFjQSxNQUE4QixTQUFVLFNBQVEsZ0JBQU07UUFTckQsWUFBbUIsRUFBWTtZQUM5QixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBRTNDLElBQUksbUJBQVMsRUFBRTtpQkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLDhDQUE4QyxDQUFDO2lCQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO2lCQUM5RCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXRCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFO2lCQUM3QyxRQUFRLENBQUMsSUFBSSxtQkFBUyxFQUFFO2lCQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxDQUFDO2lCQUN0RCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFFekIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2pCLENBQUM7UUFJUyxrQkFBa0I7WUFDM0IsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVoRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFO2lCQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksZ0JBQU0sRUFBRTtpQkFDNUQsT0FBTyxDQUFDLEdB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
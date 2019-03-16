var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/Button", "newui/component/Component", "newui/screen/screens/game/component/Dialog", "newui/screen/screens/game/Dialogs", "utilities/Objects"], function (require, exports, Button_1, Component_1, Dialog_1, Dialogs_1, Objects_1) {
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
            this.on(Dialog_1.DialogEvent.Resize, this.onResize);
            this.onResize();
        }
        updateSubpanelList() {
            this.subpanelInformations = this.getSubpanels();
            this.subpanelLinkWrapper.dump()
                .append(this.subpanelInformations.map(subpanel => new Button_1.default()
                .classes.add("debug-tools-tab-dialog-subpanel-link")
                .setText(subpanel[1])
                .on(Button_1.ButtonEvent.Activate, this.showSubPanel(subpanel[0]))
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
            this.emit("change-subpanel");
        }
        setActiveButton(button) {
            for (const element of this.subpanelLinkWrapper.findDescendants(".debug-tools-tab-dialog-subpanel-link.active")) {
                element.classList.remove("active");
            }
            button.classes.add("active");
        }
        onResize() {
            const dialogWidth = newui.windowWidth * (this.edges[Dialogs_1.Edge.Right] - this.edges[Dialogs_1.Edge.Left]) / 100;
            this.classes.toggle(dialogWidth < 440, "tabs-drawer");
        }
    }
    __decorate([
        Objects_1.Bound
    ], TabDialog.prototype, "onResize", null);
    exports.default = TabDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFiRGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3VpL1RhYkRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFTQSxNQUE4QixTQUFVLFNBQVEsZ0JBQU07UUFPckQsWUFBbUIsRUFBWTtZQUM5QixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBRTNDLElBQUksbUJBQVMsRUFBRTtpQkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLDhDQUE4QyxDQUFDO2lCQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO2lCQUM5RCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXRCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFO2lCQUM3QyxRQUFRLENBQUMsSUFBSSxtQkFBUyxFQUFFO2lCQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxDQUFDO2lCQUN0RCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFFekIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2pCLENBQUM7UUFJUyxrQkFBa0I7WUFDM0IsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVoRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFO2lCQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFv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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/Button", "newui/component/Component", "newui/screen/screens/game/component/Dialog", "newui/screen/screens/game/Dialogs", "utilities/iterable/Collectors", "utilities/Objects"], function (require, exports, Button_1, Component_1, Dialog_1, Dialogs_1, Collectors_1, Objects_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TabDialog extends Dialog_1.default {
        constructor(gsapi, id) {
            super(gsapi, id);
            this.classes.add("debug-tools-tab-dialog");
            const api = gsapi.uiApi;
            new Component_1.default(api)
                .classes.add("debug-tools-tab-dialog-subpanel-link-wrapper")
                .append(this.subpanelLinkWrapper = this.addScrollableWrapper())
                .appendTo(this.body);
            this.panelWrapper = this.addScrollableWrapper()
                .appendTo(new Component_1.default(api)
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
                .append(this.subpanelInformations.map(subpanel => new Button_1.default(this.api)
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
            const [subpanelId, , , , button] = this.subpanelInformations.collect(Collectors_1.default.first());
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
            const dialogWidth = this.api.windowWidth * (this.edges[Dialogs_1.Edge.Right] - this.edges[Dialogs_1.Edge.Left]) / 100;
            this.classes.toggle(dialogWidth < 440, "tabs-drawer");
        }
    }
    __decorate([
        Objects_1.Bound
    ], TabDialog.prototype, "onResize", null);
    exports.default = TabDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFiRGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3VpL1RhYkRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFXQSxNQUE4QixTQUFVLFNBQVEsZ0JBQU07UUFPckQsWUFBbUIsS0FBcUIsRUFBRSxFQUFZO1lBQ3JELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUUzQyxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBRXhCLElBQUksbUJBQVMsQ0FBQyxHQUFHLENBQUM7aUJBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUM7aUJBQzNELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7aUJBQzlELFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFdEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7aUJBQzdDLFFBQVEsQ0FBQyxJQUFJLG1CQUFTLENBQUMsR0FBRyxDQUFDO2lCQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxDQUFDO2lCQUN0RCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFFekIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2pCLENBQUM7UUFJUyxrQkFBa0I7WUFDM0IsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxZ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
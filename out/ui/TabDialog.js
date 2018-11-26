var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/Button", "newui/component/Component", "newui/screen/screens/game/component/Dialog", "utilities/iterable/Collectors", "utilities/Objects"], function (require, exports, Button_1, Component_1, Dialog_1, Collectors_1, Objects_1) {
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
            this.classes.toggle(this.getBox().width < 440, "tabs-drawer");
        }
    }
    __decorate([
        Objects_1.Bound
    ], TabDialog.prototype, "onResize", null);
    exports.default = TabDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFiRGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3VpL1RhYkRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFXQSxNQUE4QixTQUFVLFNBQVEsZ0JBQU07UUFPckQsWUFBbUIsS0FBcUIsRUFBRSxFQUFZO1lBQ3JELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUUzQyxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBRXhCLElBQUksbUJBQVMsQ0FBQyxHQUFHLENBQUM7aUJBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUM7aUJBQzNELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7aUJBQzlELFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFdEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7aUJBQzdDLFFBQVEsQ0FBQyxJQUFJLG1CQUFTLENBQUMsR0FBRyxDQUFDO2lCQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxDQUFDO2lCQUN0RCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFFekIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUlTLGtCQUFrQjtZQUMzQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRWhELElBQUksQ0FBQyxt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
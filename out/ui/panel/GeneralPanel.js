var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/IHookHost", "newui/component/Button", "newui/component/CheckButton", "newui/component/RangeInput", "newui/component/RangeRow", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, IHookHost_1, Button_1, CheckButton_1, RangeInput_1, RangeRow_1, Objects_1, Actions_1, DebugTools_1, IDebugTools_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GeneralPanel extends DebugToolsPanel_1.default {
        constructor(gsapi) {
            super(gsapi);
            this.timeRange = new RangeRow_1.RangeRow(this.api)
                .classes.add("debug-tools-range-row-no-default-button")
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTime)))
                .editRange(range => range
                .setStep(0.001)
                .setMin(0)
                .setMax(1)
                .setRefreshMethod(() => game.time.getTime()))
                .setDisplayValue(time => game.time.getTranslation(time))
                .on(RangeInput_1.RangeInputEvent.Change, (_, time) => {
                Actions_1.default.get("setTime").execute({ object: time });
            })
                .appendTo(this);
            this.inspectButton = new CheckButton_1.CheckButton(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonInspect))
                .setRefreshMethod(() => !!this.selectionPromise)
                .on(CheckButton_1.CheckButtonEvent.Change, (_, checked) => {
                if (!!this.selectionPromise !== checked) {
                    if (checked && DebugTools_1.default.INSTANCE.selector.selecting)
                        return false;
                    if (!checked) {
                        if (this.selectionPromise && !this.selectionPromise.isResolved) {
                            this.selectionPromise.cancel();
                        }
                        delete this.selectionPromise;
                    }
                    else {
                        this.selectionPromise = DebugTools_1.default.INSTANCE.selector.select();
                        this.selectionPromise.then(this.inspectTile);
                    }
                }
                return true;
            })
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonInspectLocalPlayer))
                .on(Button_1.ButtonEvent.Activate, this.inspectLocalPlayer)
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonUnlockRecipes))
                .on(Button_1.ButtonEvent.Activate, this.unlockRecipes)
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRemoveAllCreatures))
                .on(Button_1.ButtonEvent.Activate, this.removeAllCreatures)
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonRemoveAllNPCs))
                .on(Button_1.ButtonEvent.Activate, this.removeAllNPCs)
                .appendTo(this);
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo, this.onSwitchTo);
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway, this.onSwitchAway);
        }
        getTranslation() {
            return IDebugTools_1.DebugToolsTranslation.PanelGeneral;
        }
        canClientMove(api) {
            if (this.selectionPromise)
                return false;
            return undefined;
        }
        onGameTickEnd() {
            if (this.timeRange) {
                this.timeRange.refresh();
            }
        }
        onSwitchTo() {
            this.timeRange.refresh();
            hookManager.register(this, "DebugToolsDialog:GeneralPanel")
                .until(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway);
        }
        onSwitchAway() {
            if (this.selectionPromise) {
                this.selectionPromise.cancel();
                delete this.selectionPromise;
            }
        }
        inspectLocalPlayer() {
            DebugTools_1.default.INSTANCE.inspect(localPlayer);
        }
        inspectTile(tilePosition) {
            delete this.selectionPromise;
            this.inspectButton.refresh();
            if (!tilePosition)
                return;
            DebugTools_1.default.INSTANCE.inspect(tilePosition);
        }
        async unlockRecipes() {
            const confirm = await this.api.interrupt(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InterruptConfirmationUnlockRecipes))
                .withDescription(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InterruptConfirmationUnlockRecipesDescription))
                .withConfirmation();
            if (!confirm)
                return;
            Actions_1.default.get("unlockRecipes").execute();
        }
        removeAllCreatures() {
            Actions_1.default.get("removeAllCreatures").execute();
        }
        removeAllNPCs() {
            Actions_1.default.get("removeAllNPCs").execute();
        }
    }
    __decorate([
        IHookHost_1.HookMethod
    ], GeneralPanel.prototype, "canClientMove", null);
    __decorate([
        IHookHost_1.HookMethod
    ], GeneralPanel.prototype, "onGameTickEnd", null);
    __decorate([
        Objects_1.Bound
    ], GeneralPanel.prototype, "onSwitchTo", null);
    __decorate([
        Objects_1.Bound
    ], GeneralPanel.prototype, "onSwitchAway", null);
    __decorate([
        Objects_1.Bound
    ], GeneralPanel.prototype, "inspectLocalPlayer", null);
    __decorate([
        Objects_1.Bound
    ], GeneralPanel.prototype, "inspectTile", null);
    __decorate([
        Objects_1.Bound
    ], GeneralPanel.prototype, "unlockRecipes", null);
    __decorate([
        Objects_1.Bound
    ], GeneralPanel.prototype, "removeAllCreatures", null);
    __decorate([
        Objects_1.Bound
    ], GeneralPanel.prototype, "removeAllNPCs", null);
    exports.default = GeneralPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhbFBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0dlbmVyYWxQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFlQSxNQUFxQixZQUFhLFNBQVEseUJBQWU7UUFNeEQsWUFBbUIsS0FBcUI7WUFDdkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLG1CQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztpQkFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQztpQkFDdEQsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7aUJBQzlFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUs7aUJBQ3ZCLE9BQU8sQ0FBQyxLQUFLLENBQUM7aUJBQ2QsTUFBTSxDQUFDLENBQUMsQ0FBQztpQkFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDO2lCQUNULGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztpQkFDN0MsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3ZELEVBQUUsQ0FBQyw0QkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFZLEVBQUUsRUFBRTtnQkFDL0MsaUJBQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDO2lCQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkseUJBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUM1QyxPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDekQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDL0MsRUFBRSxDQUFDLDhCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFnQixFQUFFLEVBQUU7Z0JBQ3BELElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxPQUFPLEVBQUU7b0JBQ3hDLElBQUksT0FBTyxJQUFJLG9CQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTO3dCQUFFLE9BQU8sS0FBSyxDQUFDO29CQUVwRSxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUNiLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRTs0QkFDL0QsSUFBSSxDQUFDLGdCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDO3lCQUNoQzt3QkFFRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztxQkFFN0I7eUJBQU07d0JBQ04sSUFBSSxDQUFDLGdCQUFnQixHQUFHLG9CQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQzt3QkFDOUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7cUJBQzdDO2lCQUNEO2dCQUVELE9BQU8sSUFBSSxDQUFDO1lBQ2IsQ0FBQyxDQUFDO2lCQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztpQkFDbEIsT0FBTyxDQUFDLHdCQUFXLENBQUMsbUNBQXFCLENBQUMsd0JBQXdCLENBQUMsQ0FBQztpQkFDcEUsRUFBRSxDQUFDLG9CQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztpQkFDakQsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUNsQixPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2lCQUMvRCxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQztpQkFDNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUNsQixPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2lCQUNwRSxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDO2lCQUNqRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ2xCLE9BQU8sQ0FBQyx3QkFBVyxDQUFDLG1DQUFxQixDQUFDLG1CQUFtQixDQUFDLENBQUM7aUJBQy9ELEVBQUUsQ0FBQyxvQkFBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDO2lCQUM1QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxzQ0FBb0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxFQUFFLENBQUMsc0NBQW9CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBRU0sY0FBYztZQUNwQixPQUFPLG1DQUFxQixDQUFDLFlBQVksQ0FBQztRQUMzQyxDQUFDO1FBR00sYUFBYSxDQUFDLEdBQW1CO1lBQ3ZDLElBQUksSUFBSSxDQUFDLGdCQUFnQjtnQkFBRSxPQUFPLEtBQUssQ0FBQztZQUV4QyxPQUFPLFNBQVMsQ0FBQztRQUNsQixDQUFDO1FBR00sYUFBYTtZQUNuQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDekI7UUFDRixDQUFDO1FBR08sVUFBVTtZQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRXpCLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLCtCQUErQixDQUFDO2lCQUN6RCxLQUFLLENBQUMsc0NBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUdPLFlBQVk7WUFDbkIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDL0IsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7YUFDN0I7UUFDRixDQUFDO1FBR08sa0JBQWtCO1lBQ3pCLG9CQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMxQyxDQUFDO1FBR08sV0FBVyxDQUFDLFlBQXNCO1lBQ3pDLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO1lBQzdCLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFN0IsSUFBSSxDQUFDLFlBQVk7Z0JBQUUsT0FBTztZQUUxQixvQkFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUdPLEtBQUssQ0FBQyxhQUFhO1lBQzFCLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO2lCQUM3RyxlQUFlLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO2lCQUNqRyxnQkFBZ0IsRUFBRSxDQUFDO1lBRXJCLElBQUksQ0FBQyxPQUFPO2dCQUFFLE9BQU87WUFFckIsaUJBQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDeEMsQ0FBQztRQUdPLGtCQUFrQjtZQUN6QixpQkFBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzdDLENBQUM7UUFHTyxhQUFhO1lBQ3BCLGlCQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hDLENBQUM7S0FDRDtJQWhFQTtRQURDLHNCQUFVO3FEQUtWO0lBR0Q7UUFEQyxzQkFBVTtxREFLVjtJQUdEO1FBREMsZUFBSztrREFNTDtJQUdEO1FBREMsZUFBSztvREFNTDtJQUdEO1FBREMsZUFBSzswREFHTDtJQUdEO1FBREMsZUFBSzttREFRTDtJQUdEO1FBREMsZUFBSztxREFTTDtJQUdEO1FBREMsZUFBSzswREFHTDtJQUdEO1FBREMsZUFBSztxREFHTDtJQTNJRiwrQkE0SUMifQ==
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "audio/IAudio", "entity/action/ActionExecutor", "entity/action/IAction", "language/dictionary/InterruptChoice", "language/Translation", "mod/IHookHost", "mod/IHookManager", "mod/Mod", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/RangeInput", "newui/component/RangeRow", "newui/component/Text", "renderer/particle/IParticle", "renderer/particle/Particles", "utilities/Arrays", "utilities/enum/Enums", "utilities/Objects", "../../action/SetTime", "../../action/UnlockRecipes", "../../DebugTools", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, IAudio_1, ActionExecutor_1, IAction_1, InterruptChoice_1, Translation_1, IHookHost_1, IHookManager_1, Mod_1, BlockRow_1, Button_1, CheckButton_1, Dropdown_1, RangeInput_1, RangeRow_1, Text_1, IParticle_1, Particles_1, Arrays_1, Enums_1, Objects_1, SetTime_1, UnlockRecipes_1, DebugTools_1, IDebugTools_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GeneralPanel extends DebugToolsPanel_1.default {
        constructor() {
            super();
            this.timeRange = new RangeRow_1.RangeRow()
                .classes.add("debug-tools-range-row-no-default-button")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelTime)))
                .editRange(range => range
                .setStep(0.001)
                .setMin(0)
                .setMax(1)
                .setRefreshMethod(() => game.time.getTime()))
                .setDisplayValue(time => game.time.getTranslation(time))
                .on(RangeInput_1.RangeInputEvent.Change, (_, time) => {
                ActionExecutor_1.default.get(SetTime_1.default).execute(localPlayer, time);
            })
                .appendTo(this);
            this.inspectButton = new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonInspect))
                .setRefreshMethod(() => !!this.selectionPromise)
                .on(CheckButton_1.CheckButtonEvent.Change, (_, checked) => {
                if (!!this.selectionPromise !== checked) {
                    if (checked && this.DEBUG_TOOLS.selector.selecting)
                        return false;
                    if (!checked) {
                        if (this.selectionPromise && !this.selectionPromise.isResolved) {
                            this.selectionPromise.cancel();
                        }
                        delete this.selectionPromise;
                    }
                    else {
                        this.selectionPromise = this.DEBUG_TOOLS.selector.select();
                        this.selectionPromise.then(this.inspectTile);
                    }
                }
                return true;
            })
                .appendTo(this);
            new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonInspectLocalPlayer))
                .on(Button_1.ButtonEvent.Activate, () => this.DEBUG_TOOLS.inspect(localPlayer))
                .appendTo(this);
            new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonUnlockRecipes))
                .on(Button_1.ButtonEvent.Activate, this.unlockRecipes)
                .appendTo(this);
            new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonTravelAway))
                .on(Button_1.ButtonEvent.Activate, this.travelAway)
                .appendTo(this);
            new BlockRow_1.BlockRow()
                .classes.add("debug-tools-dialog-checkbutton-dropdown-row")
                .append(this.checkButtonAudio = new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonAudio)))
                .append(this.dropdownAudio = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: IAudio_1.SfxType.Click,
                options: Enums_1.default.values(IAudio_1.SfxType)
                    .map(sfx => Arrays_1.tuple(sfx, Translation_1.default.generator(IAudio_1.SfxType[sfx])))
                    .sorted(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t))),
            })))
                .appendTo(this);
            new BlockRow_1.BlockRow()
                .classes.add("debug-tools-dialog-checkbutton-dropdown-row")
                .append(this.checkButtonParticle = new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonParticle)))
                .append(this.dropdownParticle = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: IParticle_1.ParticleType.Blood,
                options: Enums_1.default.values(IParticle_1.ParticleType)
                    .map(particle => Arrays_1.tuple(particle, Translation_1.default.generator(IParticle_1.ParticleType[particle])))
                    .sorted(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => Arrays_1.tuple(id, (option) => option.setText(t))),
            })))
                .appendTo(this);
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchTo, this.onSwitchTo);
            this.on(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway, this.onSwitchAway);
        }
        getTranslation() {
            return IDebugTools_1.DebugToolsTranslation.PanelGeneral;
        }
        canClientMove(api) {
            if (this.selectionPromise || this.checkButtonAudio.checked || this.checkButtonParticle.checked)
                return false;
            return undefined;
        }
        onGameTickEnd() {
            if (this.timeRange) {
                this.timeRange.refresh();
            }
        }
        onBindLoop(bindPressed, api) {
            if (api.wasPressed(this.DEBUG_TOOLS.selector.bindableSelectLocation) && !bindPressed) {
                if (this.checkButtonAudio.checked) {
                    const position = renderer.screenToTile(api.mouseX, api.mouseY);
                    audio.queueEffect(this.dropdownAudio.selection, position.x, position.y, localPlayer.z);
                    bindPressed = this.DEBUG_TOOLS.selector.bindableSelectLocation;
                }
                if (this.checkButtonParticle.checked) {
                    const position = renderer.screenToTile(api.mouseX, api.mouseY);
                    game.particle.create(position.x, position.y, localPlayer.z, Particles_1.particles[this.dropdownParticle.selection]);
                    bindPressed = this.DEBUG_TOOLS.selector.bindableSelectLocation;
                }
            }
            return bindPressed;
        }
        onSwitchTo() {
            this.timeRange.refresh();
            hookManager.register(this, "DebugToolsDialog:GeneralPanel")
                .until(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway);
            this.until(DebugToolsPanel_1.DebugToolsPanelEvent.SwitchAway)
                .bind(this.DEBUG_TOOLS, DebugTools_1.DebugToolsEvent.Inspect, () => {
                if (this.selectionPromise)
                    this.selectionPromise.cancel();
            });
        }
        onSwitchAway() {
            if (this.selectionPromise) {
                this.selectionPromise.cancel();
                delete this.selectionPromise;
            }
        }
        inspectTile(tilePosition) {
            delete this.selectionPromise;
            this.inspectButton.refresh();
            if (!tilePosition)
                return;
            this.DEBUG_TOOLS.inspect(tilePosition);
        }
        async unlockRecipes() {
            const confirm = await newui.interrupt(this.DEBUG_TOOLS.interruptUnlockRecipes)
                .withConfirmation();
            if (!confirm)
                return;
            ActionExecutor_1.default.get(UnlockRecipes_1.default).execute(localPlayer);
        }
        async travelAway() {
            if (multiplayer.isConnected() && !game.isChallenge)
                return;
            let action;
            if (!game.isChallenge) {
                const choice = await newui.interrupt(this.DEBUG_TOOLS.interruptTravelAway)
                    .withChoice(InterruptChoice_1.default.Cancel, this.DEBUG_TOOLS.choiceTravelAway, this.DEBUG_TOOLS.choiceSailToCivilization);
                if (choice === InterruptChoice_1.default.Cancel)
                    return;
                action = choice === this.DEBUG_TOOLS.choiceSailToCivilization ? IAction_1.ActionType.SailToCivilization : IAction_1.ActionType.TraverseTheSea;
            }
            else {
                action = IAction_1.ActionType.SailToCivilization;
            }
            const anyExecutor = ActionExecutor_1.default.get(action);
            anyExecutor.execute(localPlayer, undefined, true, true, true);
        }
    }
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], GeneralPanel.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        IHookHost_1.HookMethod
    ], GeneralPanel.prototype, "canClientMove", null);
    __decorate([
        IHookHost_1.HookMethod
    ], GeneralPanel.prototype, "onGameTickEnd", null);
    __decorate([
        IHookHost_1.HookMethod(IHookManager_1.HookPriority.High)
    ], GeneralPanel.prototype, "onBindLoop", null);
    __decorate([
        Objects_1.Bound
    ], GeneralPanel.prototype, "onSwitchTo", null);
    __decorate([
        Objects_1.Bound
    ], GeneralPanel.prototype, "onSwitchAway", null);
    __decorate([
        Objects_1.Bound
    ], GeneralPanel.prototype, "inspectTile", null);
    __decorate([
        Objects_1.Bound
    ], GeneralPanel.prototype, "unlockRecipes", null);
    __decorate([
        Objects_1.Bound
    ], GeneralPanel.prototype, "travelAway", null);
    exports.default = GeneralPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhbFBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0dlbmVyYWxQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUE2QkEsTUFBcUIsWUFBYSxTQUFRLHlCQUFlO1FBY3hEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsRUFBRTtpQkFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQztpQkFDdEQsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7aUJBQzlFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUs7aUJBQ3ZCLE9BQU8sQ0FBQyxLQUFLLENBQUM7aUJBQ2QsTUFBTSxDQUFDLENBQUMsQ0FBQztpQkFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDO2lCQUNULGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztpQkFDN0MsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3ZELEVBQUUsQ0FBQyw0QkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFZLEVBQUUsRUFBRTtnQkFDL0Msd0JBQWMsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEQsQ0FBQyxDQUFDO2lCQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDcEMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQ3pELGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7aUJBQy9DLEVBQUUsQ0FBQyw4QkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBZ0IsRUFBRSxFQUFFO2dCQUNwRCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEtBQUssT0FBTyxFQUFFO29CQUN4QyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTO3dCQUFFLE9BQU8sS0FBSyxDQUFDO29CQUVqRSxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUNiLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRTs0QkFDL0QsSUFBSSxDQUFDLGdCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDO3lCQUNoQzt3QkFFRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztxQkFFN0I7eUJBQU07d0JBQ04sSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO3dCQUMzRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztxQkFDN0M7aUJBQ0Q7Z0JBRUQsT0FBTyxJQUFJLENBQUM7WUFDYixDQUFDLENBQUM7aUJBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksZ0JBQU0sRUFBRTtpQkFDVixPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2lCQUNwRSxFQUFFLENBQUMsb0JBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ3JFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLGdCQUFNLEVBQUU7aUJBQ1YsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztpQkFDL0QsRUFBRSxDQUFDLG9CQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUM7aUJBQzVDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLGdCQUFNLEVBQUU7aUJBQ1YsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDNUQsRUFBRSxDQUFDLG9CQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUM7aUJBQ3pDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLG1CQUFRLEVBQUU7aUJBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyw2Q0FBNkMsQ0FBQztpQkFDMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLHlCQUFXLEVBQUU7aUJBQy9DLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksa0JBQVEsRUFBVztpQkFDbEQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsYUFBYSxFQUFFLGdCQUFPLENBQUMsS0FBSztnQkFDNUIsT0FBTyxFQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQU8sQ0FBQztxQkFDNUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsY0FBSyxDQUFDLEdBQUcsRUFBRSxxQkFBVyxDQUFDLFNBQVMsQ0FBQyxnQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDM0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUM5RSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3BFLENBQUMsQ0FBQyxDQUFDO2lCQUNKLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLG1CQUFRLEVBQUU7aUJBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyw2Q0FBNkMsQ0FBQztpQkFDMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLHlCQUFXLEVBQUU7aUJBQ2xELE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7aUJBQzVELE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxrQkFBUSxFQUFnQjtpQkFDMUQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsYUFBYSxFQUFFLHdCQUFZLENBQUMsS0FBSztnQkFDakMsT0FBTyxFQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsd0JBQVksQ0FBQztxQkFDakMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsY0FBSyxDQUFDLFFBQVEsRUFBRSxxQkFBVyxDQUFDLFNBQVMsQ0FBQyx3QkFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDL0UsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUM5RSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3BFLENBQUMsQ0FBQyxDQUFDO2lCQUNKLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsRUFBRSxDQUFDLHNDQUFvQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxzQ0FBb0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzdELENBQUM7UUFFTSxjQUFjO1lBQ3BCLE9BQU8sbUNBQXFCLENBQUMsWUFBWSxDQUFDO1FBQzNDLENBQUM7UUFHTSxhQUFhLENBQUMsR0FBbUI7WUFDdkMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTztnQkFBRSxPQUFPLEtBQUssQ0FBQztZQUU3RyxPQUFPLFNBQVMsQ0FBQztRQUNsQixDQUFDO1FBR00sYUFBYTtZQUNuQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDekI7UUFDRixDQUFDO1FBR00sVUFBVSxDQUFDLFdBQXFCLEVBQUUsR0FBbUI7WUFDM0QsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3JGLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRTtvQkFDbEMsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDL0QsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2RixXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUM7aUJBQy9EO2dCQUVELElBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRTtvQkFDckMsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDL0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLEVBQUUscUJBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDeEcsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDO2lCQUMvRDthQUNEO1lBRUQsT0FBTyxXQUFXLENBQUM7UUFDcEIsQ0FBQztRQUdPLFVBQVU7WUFDakIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUV6QixXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSwrQkFBK0IsQ0FBQztpQkFDekQsS0FBSyxDQUFDLHNDQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRXpDLElBQUksQ0FBQyxLQUFLLENBQUMsc0NBQW9CLENBQUMsVUFBVSxDQUFDO2lCQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSw0QkFBZSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQ3JELElBQUksSUFBSSxDQUFDLGdCQUFnQjtvQkFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDM0QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBR08sWUFBWTtZQUNuQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUMvQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQzthQUM3QjtRQUNGLENBQUM7UUFHTyxXQUFXLENBQUMsWUFBc0I7WUFDekMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7WUFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUU3QixJQUFJLENBQUMsWUFBWTtnQkFBRSxPQUFPO1lBRTFCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFHTyxLQUFLLENBQUMsYUFBYTtZQUMxQixNQUFNLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQztpQkFDNUUsZ0JBQWdCLEVBQUUsQ0FBQztZQUVyQixJQUFJLENBQUMsT0FBTztnQkFBRSxPQUFPO1lBRXJCLHdCQUFjLENBQUMsR0FBRyxDQUFDLHVCQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQVFPLEtBQUssQ0FBQyxVQUFVO1lBQ3ZCLElBQUksV0FBVyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQUUsT0FBTztZQUUzRCxJQUFJLE1BQWtCLENBQUM7WUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3RCLE1BQU0sTUFBTSxHQUFHLE1BQU0sS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDO3FCQUN4RSxVQUFVLENBQUMseUJBQWUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBRW5ILElBQUksTUFBTSxLQUFLLHlCQUFlLENBQUMsTUFBTTtvQkFBRSxPQUFPO2dCQUM5QyxNQUFNLEdBQUcsTUFBTSxLQUFLLElBQUksQ0FBQyxXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLG9CQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLG9CQUFVLENBQUMsY0FBYyxDQUFDO2FBRTFIO2lCQUFNO2dCQUNOLE1BQU0sR0FBRyxvQkFBVSxDQUFDLGtCQUFrQixDQUFDO2FBQ3ZDO1lBRUQsTUFBTSxXQUFXLEdBQUksd0JBQXNCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELFdBQVcsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9ELENBQUM7S0FDRDtJQXpNQTtRQURDLGFBQUcsQ0FBQyxRQUFRLENBQWEsNEJBQWMsQ0FBQztxREFDRDtJQXdHeEM7UUFEQyxzQkFBVTtxREFLVjtJQUdEO1FBREMsc0JBQVU7cURBS1Y7SUFHRDtRQURDLHNCQUFVLENBQUMsMkJBQVksQ0FBQyxJQUFJLENBQUM7a0RBaUI3QjtJQUdEO1FBREMsZUFBSztrREFXTDtJQUdEO1FBREMsZUFBSztvREFNTDtJQUdEO1FBREMsZUFBSzttREFRTDtJQUdEO1FBREMsZUFBSztxREFRTDtJQVFEO1FBREMsZUFBSztrREFrQkw7SUEzTUYsK0JBNE1DIn0=
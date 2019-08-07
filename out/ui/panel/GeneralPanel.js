var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "audio/IAudio", "entity/action/ActionExecutor", "entity/action/IAction", "event/EventManager", "language/dictionary/InterruptChoice", "language/Translation", "mod/IHookHost", "mod/IHookManager", "mod/Mod", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/RangeRow", "newui/component/Text", "newui/NewUi", "renderer/particle/IParticle", "renderer/particle/Particles", "utilities/Arrays", "utilities/enum/Enums", "../../action/SetTime", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, IAudio_1, ActionExecutor_1, IAction_1, EventManager_1, InterruptChoice_1, Translation_1, IHookHost_1, IHookManager_1, Mod_1, BlockRow_1, Button_1, CheckButton_1, Dropdown_1, RangeRow_1, Text_1, NewUi_1, IParticle_1, Particles_1, Arrays_1, Enums_1, SetTime_1, IDebugTools_1, DebugToolsPanel_1) {
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
                .event.subscribe("change", (_, time) => {
                ActionExecutor_1.default.get(SetTime_1.default).execute(localPlayer, time);
            })
                .appendTo(this);
            this.inspectButton = new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonInspect))
                .setRefreshMethod(() => !!this.selectionPromise)
                .event.subscribe("willToggle", (_, checked) => {
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
                .event.subscribe("activate", () => this.DEBUG_TOOLS.inspect(localPlayer))
                .appendTo(this);
            new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonTravelAway))
                .event.subscribe("activate", this.travelAway)
                .appendTo(this);
            new BlockRow_1.BlockRow()
                .classes.add("debug-tools-dialog-checkbutton-dropdown-row")
                .append(this.checkButtonAudio = new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonAudio)))
                .append(this.dropdownAudio = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: IAudio_1.SfxType.Click,
                options: Enums_1.default.values(IAudio_1.SfxType)
                    .map(sfx => Arrays_1.Tuple(sfx, Translation_1.default.generator(IAudio_1.SfxType[sfx])))
                    .sorted(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => Arrays_1.Tuple(id, (option) => option.setText(t))),
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
                    .map(particle => Arrays_1.Tuple(particle, Translation_1.default.generator(IParticle_1.ParticleType[particle])))
                    .sorted(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .map(([id, t]) => Arrays_1.Tuple(id, (option) => option.setText(t))),
            })))
                .appendTo(this);
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
            this.registerHookHost("DebugToolsDialog:GeneralPanel");
            this.DEBUG_TOOLS.event.until(this, "switchAway")
                .subscribe("inspect", () => {
                if (this.selectionPromise)
                    this.selectionPromise.cancel();
            });
        }
        onSwitchAway() {
            hookManager.deregister(this);
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
        async travelAway() {
            if (multiplayer.isConnected() && !game.isChallenge)
                return;
            let action;
            if (!game.isChallenge) {
                const choice = await NewUi_1.default.interrupt(this.DEBUG_TOOLS.interruptTravelAway)
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
        Override
    ], GeneralPanel.prototype, "getTranslation", null);
    __decorate([
        IHookHost_1.HookMethod
    ], GeneralPanel.prototype, "canClientMove", null);
    __decorate([
        IHookHost_1.HookMethod
    ], GeneralPanel.prototype, "onGameTickEnd", null);
    __decorate([
        Override, IHookHost_1.HookMethod(IHookManager_1.HookPriority.High)
    ], GeneralPanel.prototype, "onBindLoop", null);
    __decorate([
        EventManager_1.EventHandler("self")("switchTo")
    ], GeneralPanel.prototype, "onSwitchTo", null);
    __decorate([
        EventManager_1.EventHandler("self")("switchAway")
    ], GeneralPanel.prototype, "onSwitchAway", null);
    __decorate([
        Bound
    ], GeneralPanel.prototype, "inspectTile", null);
    __decorate([
        Bound
    ], GeneralPanel.prototype, "travelAway", null);
    exports.default = GeneralPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhbFBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0dlbmVyYWxQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUE2QkEsTUFBcUIsWUFBYSxTQUFRLHlCQUFlO1FBY3hEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsRUFBRTtpQkFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQztpQkFDdEQsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7aUJBQzlFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUs7aUJBQ3ZCLE9BQU8sQ0FBQyxLQUFLLENBQUM7aUJBQ2QsTUFBTSxDQUFDLENBQUMsQ0FBQztpQkFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDO2lCQUNULGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztpQkFDN0MsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3ZELEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFO2dCQUN0Qyx3QkFBYyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4RCxDQUFDLENBQUM7aUJBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSx5QkFBVyxFQUFFO2lCQUNwQyxPQUFPLENBQUMs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
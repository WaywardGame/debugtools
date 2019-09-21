var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "audio/IAudio", "entity/action/ActionExecutor", "entity/action/IAction", "event/EventManager", "language/dictionary/InterruptChoice", "language/Translation", "mod/IHookHost", "mod/IHookManager", "mod/Mod", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/RangeRow", "newui/component/Text", "newui/NewUi", "newui/screen/screens/game/util/movement/MovementHandler", "renderer/particle/IParticle", "renderer/particle/Particles", "utilities/Arrays", "utilities/enum/Enums", "../../action/SetTime", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, IAudio_1, ActionExecutor_1, IAction_1, EventManager_1, InterruptChoice_1, Translation_1, IHookHost_1, IHookManager_1, Mod_1, BlockRow_1, Button_1, CheckButton_1, Dropdown_1, RangeRow_1, Text_1, NewUi_1, MovementHandler_1, IParticle_1, Particles_1, Arrays_1, Enums_1, SetTime_1, IDebugTools_1, DebugToolsPanel_1) {
    "use strict";
    var GeneralPanel_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    let GeneralPanel = GeneralPanel_1 = class GeneralPanel extends DebugToolsPanel_1.default {
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
        canClientMove() {
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
    };
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], GeneralPanel.prototype, "DEBUG_TOOLS", void 0);
    __decorate([
        Override
    ], GeneralPanel.prototype, "getTranslation", null);
    __decorate([
        EventManager_1.EventHandler(MovementHandler_1.default, "canMove")
    ], GeneralPanel.prototype, "canClientMove", null);
    __decorate([
        IHookHost_1.HookMethod
    ], GeneralPanel.prototype, "onGameTickEnd", null);
    __decorate([
        Override, IHookHost_1.HookMethod(IHookManager_1.HookPriority.High)
    ], GeneralPanel.prototype, "onBindLoop", null);
    __decorate([
        EventManager_1.OwnEventHandler(GeneralPanel_1, "switchTo")
    ], GeneralPanel.prototype, "onSwitchTo", null);
    __decorate([
        EventManager_1.OwnEventHandler(GeneralPanel_1, "switchAway")
    ], GeneralPanel.prototype, "onSwitchAway", null);
    __decorate([
        Bound
    ], GeneralPanel.prototype, "inspectTile", null);
    __decorate([
        Bound
    ], GeneralPanel.prototype, "travelAway", null);
    GeneralPanel = GeneralPanel_1 = __decorate([
        EventManager_1.EventSubscriber
    ], GeneralPanel);
    exports.default = GeneralPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhbFBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0dlbmVyYWxQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBOEJBLElBQXFCLFlBQVksb0JBQWpDLE1BQXFCLFlBQWEsU0FBUSx5QkFBZTtRQWN4RDtZQUNDLEtBQUssRUFBRSxDQUFDO1lBRVIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLG1CQUFRLEVBQUU7aUJBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMseUNBQXlDLENBQUM7aUJBQ3RELFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2lCQUM5RSxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLO2lCQUN2QixPQUFPLENBQUMsS0FBSyxDQUFDO2lCQUNkLE1BQU0sQ0FBQyxDQUFDLENBQUM7aUJBQ1QsTUFBTSxDQUFDLENBQUMsQ0FBQztpQkFDVCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7aUJBQzdDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN2RCxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDdEMsd0JBQWMsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEQsQ0FBQyxDQUFDO2lCQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkseUJBQVcsRUFB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
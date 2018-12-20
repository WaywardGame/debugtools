var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "action/ActionExecutor", "action/IAction", "Enums", "language/dictionary/InterruptChoice", "language/Translation", "mod/IHookHost", "mod/IHookManager", "mod/Mod", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/RangeInput", "newui/component/RangeRow", "newui/component/Text", "renderer/particle/IParticle", "renderer/particle/Particles", "utilities/enum/Enums", "utilities/iterable/Collectors", "utilities/iterable/Generators", "utilities/Objects", "../../action/SetTime", "../../action/UnlockRecipes", "../../DebugTools", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, ActionExecutor_1, IAction_1, Enums_1, InterruptChoice_1, Translation_1, IHookHost_1, IHookManager_1, Mod_1, BlockRow_1, Button_1, CheckButton_1, Dropdown_1, RangeInput_1, RangeRow_1, Text_1, IParticle_1, Particles_1, Enums_2, Collectors_1, Generators_1, Objects_1, SetTime_1, UnlockRecipes_1, DebugTools_1, IDebugTools_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GeneralPanel extends DebugToolsPanel_1.default {
        constructor(gsapi) {
            super(gsapi);
            this.timeRange = new RangeRow_1.RangeRow(this.api)
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
            this.inspectButton = new CheckButton_1.CheckButton(this.api)
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
            new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonInspectLocalPlayer))
                .on(Button_1.ButtonEvent.Activate, () => this.DEBUG_TOOLS.inspect(localPlayer))
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonUnlockRecipes))
                .on(Button_1.ButtonEvent.Activate, this.unlockRecipes)
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonTravelAway))
                .on(Button_1.ButtonEvent.Activate, this.travelAway)
                .appendTo(this);
            new BlockRow_1.BlockRow(this.api)
                .classes.add("debug-tools-dialog-checkbutton-dropdown-row")
                .append(this.checkButtonAudio = new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonAudio)))
                .append(this.dropdownAudio = new Dropdown_1.default(this.api)
                .setRefreshMethod(() => ({
                defaultOption: Enums_1.SfxType.Click,
                options: Enums_2.default.values(Enums_1.SfxType)
                    .map(sfx => Generators_1.tuple(sfx, Translation_1.default.generator(Enums_1.SfxType[sfx])))
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => Generators_1.tuple(id, (option) => option.setText(t))),
            })))
                .appendTo(this);
            new BlockRow_1.BlockRow(this.api)
                .classes.add("debug-tools-dialog-checkbutton-dropdown-row")
                .append(this.checkButtonParticle = new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonParticle)))
                .append(this.dropdownParticle = new Dropdown_1.default(this.api)
                .setRefreshMethod(() => ({
                defaultOption: IParticle_1.ParticleType.Blood,
                options: Enums_2.default.values(IParticle_1.ParticleType)
                    .map(particle => Generators_1.tuple(particle, Translation_1.default.generator(IParticle_1.ParticleType[particle])))
                    .collect(Collectors_1.default.toArray)
                    .sort(([, t1], [, t2]) => Text_1.default.toString(t1).localeCompare(Text_1.default.toString(t2)))
                    .values()
                    .map(([id, t]) => Generators_1.tuple(id, (option) => option.setText(t))),
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
            const confirm = await this.api.interrupt(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InterruptConfirmationUnlockRecipes))
                .withDescription(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InterruptConfirmationUnlockRecipesDescription))
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
                const choice = await this.api.interrupt(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.InterruptChoiceTravelAway))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhbFBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3VpL3BhbmVsL0dlbmVyYWxQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUErQkEsTUFBcUIsWUFBYSxTQUFRLHlCQUFlO1FBY3hELFlBQW1CLEtBQXFCO1lBQ3ZDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUViLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMseUNBQXlDLENBQUM7aUJBQ3RELFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2lCQUM5RSxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLO2lCQUN2QixPQUFPLENBQUMsS0FBSyxDQUFDO2lCQUNkLE1BQU0sQ0FBQyxDQUFDLENBQUM7aUJBQ1QsTUFBTSxDQUFDLENBQUMsQ0FBQztpQkFDVCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7aUJBQzdDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN2RCxFQUFFLENBQUMsNEJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBWSxFQUFFLEVBQUU7Z0JBQy9DLHdCQUFjLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hELENBQUMsQ0FBQztpQkFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakIsSUFBSSxDQUFD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
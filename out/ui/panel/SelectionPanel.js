var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "newui/component/Button", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/RangeRow", "utilities/Arrays", "utilities/Collectors", "utilities/IterableIterator", "utilities/math/Vector2", "utilities/Objects", "../../Actions", "../../DebugTools", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, Button_1, CheckButton_1, Dropdown_1, LabelledRow_1, RangeRow_1, Arrays_1, Collectors_1, IterableIterator_1, Vector2_1, Objects_1, Actions_1, DebugTools_1, IDebugTools_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SelectionPanel extends DebugToolsPanel_1.default {
        constructor(gsapi) {
            super(gsapi);
            this.creatures = false;
            this.npcs = false;
            new LabelledRow_1.LabelledRow(this.api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionMethod)))
                .append(this.dropdownMethod = new Dropdown_1.default(this.api)
                .setRefreshMethod(() => ({
                defaultOption: IDebugTools_1.DebugToolsTranslation.MethodAll,
                options: [
                    [IDebugTools_1.DebugToolsTranslation.MethodAll, option => option.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.MethodAll))],
                    [IDebugTools_1.DebugToolsTranslation.MethodNearest, option => option.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.MethodNearest))],
                    [IDebugTools_1.DebugToolsTranslation.MethodRandom, option => option.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.MethodRandom))],
                ],
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeMethod))
                .append(this.rangeQuantity = new RangeRow_1.RangeRow(this.api)
                .classes.add("debug-tools-dialog-selection-quantity")
                .setLabel(label => label.hide())
                .editRange(range => range
                .setMax(55)
                .setStep(0.01))
                .setDisplayValue(value => [{ content: `${Math.floor(1.2 ** value)}` }]))
                .appendTo(this);
            this.changeMethod(null, IDebugTools_1.DebugToolsTranslation.MethodAll);
            new CheckButton_1.CheckButton(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.FilterCreatures))
                .on(CheckButton_1.CheckButtonEvent.Change, (_, creatures) => { this.creatures = creatures; })
                .appendTo(this);
            new CheckButton_1.CheckButton(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.FilterNPCs))
                .on(CheckButton_1.CheckButtonEvent.Change, (_, npcs) => { this.npcs = npcs; })
                .appendTo(this);
            new LabelledRow_1.LabelledRow(this.api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAction)))
                .append(this.dropdownAction = new Dropdown_1.default(this.api)
                .on(Dropdown_1.DropdownEvent.Selection, (_, action) => this.action = action)
                .setRefreshMethod(() => ({
                defaultOption: IDebugTools_1.DebugToolsTranslation.ActionRemove,
                options: [
                    [IDebugTools_1.DebugToolsTranslation.ActionRemove, option => option.setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))],
                ],
            })))
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(DebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonExecute))
                .on(Button_1.ButtonEvent.Activate, this.execute)
                .appendTo(this);
        }
        getTranslation() {
            return IDebugTools_1.DebugToolsTranslation.PanelSelection;
        }
        execute() {
            if (!this.creatures && !this.npcs)
                return;
            let quantity = Math.floor(1.2 ** this.rangeQuantity.value);
            const targets = IterableIterator_1.pipe(this.creatures && game.creatures, this.npcs && game.npcs)
                .flat()
                .filter(entity => entity)
                .collect(Collectors_1.default.toArray);
            switch (this.method) {
                case IDebugTools_1.DebugToolsTranslation.MethodAll:
                    quantity = targets.length;
                    break;
                case IDebugTools_1.DebugToolsTranslation.MethodRandom:
                    Arrays_1.default.shuffle(targets);
                    break;
                case IDebugTools_1.DebugToolsTranslation.MethodNearest:
                    targets.sort((a, b) => Vector2_1.default.squaredDistance(a, localPlayer) - Vector2_1.default.squaredDistance(b, localPlayer));
                    break;
            }
            Actions_1.default.get("executeOnSelection").execute({
                object: [
                    this.action,
                    targets.slice(0, quantity)
                        .map(target => Arrays_1.tuple(target.entityType, target.id)),
                ],
            });
        }
        changeMethod(_, method) {
            this.method = method;
            this.rangeQuantity.toggle(method !== IDebugTools_1.DebugToolsTranslation.MethodAll);
        }
    }
    __decorate([
        Objects_1.Bound
    ], SelectionPanel.prototype, "execute", null);
    __decorate([
        Objects_1.Bound
    ], SelectionPanel.prototype, "changeMethod", null);
    exports.default = SelectionPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uUGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvcGFuZWwvU2VsZWN0aW9uUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBa0JBLE1BQXFCLGNBQWUsU0FBUSx5QkFBZTtRQVUxRCxZQUFtQixLQUFxQjtZQUN2QyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFOTixjQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ2xCLFNBQUksR0FBRyxLQUFLLENBQUM7WUFPcEIsSUFBSSx5QkFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2lCQUNwRixNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGtCQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztpQkFDbEQsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsYUFBYSxFQUFFLG1DQUFxQixDQUFDLFNBQVM7Z0JBQzlDLE9BQU8sRUFBRTtvQkFDUixDQUFDLG1DQUFxQixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUN6RyxDQUFDLG1DQUFxQixDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsd0JBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNqSCxDQUFDLG1DQUFxQixDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFD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
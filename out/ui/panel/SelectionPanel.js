var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/action/ActionExecutor", "entity/IEntity", "newui/component/Button", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/RangeRow", "utilities/Arrays", "utilities/math/Vector2", "utilities/Objects", "utilities/stream/Stream", "../../action/SelectionExecute", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, ActionExecutor_1, IEntity_1, Button_1, CheckButton_1, Dropdown_1, LabelledRow_1, RangeRow_1, Arrays_1, Vector2_1, Objects_1, Stream_1, SelectionExecute_1, IDebugTools_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectionType;
    (function (SelectionType) {
        SelectionType[SelectionType["Creature"] = 0] = "Creature";
        SelectionType[SelectionType["NPC"] = 1] = "NPC";
        SelectionType[SelectionType["TileEvent"] = 2] = "TileEvent";
    })(SelectionType = exports.SelectionType || (exports.SelectionType = {}));
    const entityTypeToSelectionTypeMap = {
        [IEntity_1.EntityType.Creature]: SelectionType.Creature,
        [IEntity_1.EntityType.NPC]: SelectionType.NPC,
    };
    function getSelectionType(target) {
        return "entityType" in target ? entityTypeToSelectionTypeMap[target.entityType] : SelectionType.TileEvent;
    }
    class SelectionPanel extends DebugToolsPanel_1.default {
        constructor() {
            super();
            this.creatures = false;
            this.npcs = false;
            this.tileEvents = false;
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionMethod)))
                .append(new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: IDebugTools_1.DebugToolsTranslation.MethodAll,
                options: [
                    [IDebugTools_1.DebugToolsTranslation.MethodAll, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.MethodAll))],
                    [IDebugTools_1.DebugToolsTranslation.MethodNearest, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.MethodNearest))],
                    [IDebugTools_1.DebugToolsTranslation.MethodRandom, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.MethodRandom))],
                ],
            }))
                .on(Dropdown_1.DropdownEvent.Selection, this.changeMethod))
                .append(this.rangeQuantity = new RangeRow_1.RangeRow()
                .classes.add("debug-tools-dialog-selection-quantity")
                .setLabel(label => label.hide())
                .editRange(range => range
                .setMax(55)
                .setStep(0.01))
                .setDisplayValue(value => [{ content: `${Math.floor(1.2 ** value)}` }]))
                .appendTo(this);
            this.changeMethod(null, IDebugTools_1.DebugToolsTranslation.MethodAll);
            new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.FilterCreatures))
                .on(CheckButton_1.CheckButtonEvent.Change, (_, enabled) => { this.creatures = enabled; })
                .appendTo(this);
            new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.FilterNPCs))
                .on(CheckButton_1.CheckButtonEvent.Change, (_, enabled) => { this.npcs = enabled; })
                .appendTo(this);
            new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.FilterTileEvents))
                .on(CheckButton_1.CheckButtonEvent.Change, (_, enabled) => { this.tileEvents = enabled; })
                .appendTo(this);
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAction)))
                .append(new Dropdown_1.default()
                .on(Dropdown_1.DropdownEvent.Selection, (_, action) => this.action = action)
                .setRefreshMethod(() => ({
                defaultOption: IDebugTools_1.DebugToolsTranslation.ActionRemove,
                options: [
                    [IDebugTools_1.DebugToolsTranslation.ActionRemove, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))],
                ],
            })))
                .appendTo(this);
            new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonExecute))
                .on(Button_1.ButtonEvent.Activate, this.execute)
                .appendTo(this);
        }
        getTranslation() {
            return IDebugTools_1.DebugToolsTranslation.PanelSelection;
        }
        execute() {
            const targets = Stream_1.default.of(this.creatures && game.creatures, this.npcs && game.npcs, this.tileEvents && game.tileEvents)
                .flatMap(value => Array.isArray(value) ? value : value ? [value] : [])
                .filter(entity => !!entity)
                .toArray();
            if (!targets.length)
                return;
            let quantity = Math.floor(1.2 ** this.rangeQuantity.value);
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
            ActionExecutor_1.default.get(SelectionExecute_1.default).execute(localPlayer, this.action, targets.slice(0, quantity)
                .map(target => Arrays_1.tuple(getSelectionType(target), target.id)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uUGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvcGFuZWwvU2VsZWN0aW9uUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBa0JBLElBQVksYUFJWDtJQUpELFdBQVksYUFBYTtRQUN4Qix5REFBUSxDQUFBO1FBQ1IsK0NBQUcsQ0FBQTtRQUNILDJEQUFTLENBQUE7SUFDVixDQUFDLEVBSlcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFJeEI7SUFFRCxNQUFNLDRCQUE0QixHQUFHO1FBQ3BDLENBQUMsb0JBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxhQUFhLENBQUMsUUFBUTtRQUM3QyxDQUFDLG9CQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsYUFBYSxDQUFDLEdBQUc7S0FDbkMsQ0FBQztJQUVGLFNBQVMsZ0JBQWdCLENBQUMsTUFBcUM7UUFDOUQsT0FBTyxZQUFZLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDM0csQ0FBQztJQUVELE1BQXFCLGNBQWUsU0FBUSx5QkFBZTtRQVMxRDtZQUNDLEtBQUssRUFBRSxDQUFDO1lBUEQsY0FBUyxHQUFHLEtBQUssQ0FBQztZQUNsQixTQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ2IsZUFBVSxHQUFHLEtBQUssQ0FBQztZQU8xQixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7aUJBQ3BGLE1BQU0sQ0FBQyxJQUFJLGtCQUFRLEVBQUU7aUJBQ3BCLGdCQUFnQixDQUFDLEdBQUcs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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "entity/IEntity", "newui/component/Button", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/LabelledRow", "newui/component/RangeRow", "utilities/Arrays", "utilities/Collectors", "utilities/IterableIterator", "utilities/math/Vector2", "utilities/Objects", "../../Actions", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, IEntity_1, Button_1, CheckButton_1, Dropdown_1, LabelledRow_1, RangeRow_1, Arrays_1, Collectors_1, IterableIterator_1, Vector2_1, Objects_1, Actions_1, IDebugTools_1, DebugToolsPanel_1) {
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
        constructor(gsapi) {
            super(gsapi);
            this.creatures = false;
            this.npcs = false;
            this.tileEvents = false;
            new LabelledRow_1.LabelledRow(this.api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionMethod)))
                .append(this.dropdownMethod = new Dropdown_1.default(this.api)
                .setRefreshMethod(() => ({
                defaultOption: IDebugTools_1.DebugToolsTranslation.MethodAll,
                options: [
                    [IDebugTools_1.DebugToolsTranslation.MethodAll, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.MethodAll))],
                    [IDebugTools_1.DebugToolsTranslation.MethodNearest, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.MethodNearest))],
                    [IDebugTools_1.DebugToolsTranslation.MethodRandom, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.MethodRandom))],
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
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.FilterCreatures))
                .on(CheckButton_1.CheckButtonEvent.Change, (_, enabled) => { this.creatures = enabled; })
                .appendTo(this);
            new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.FilterNPCs))
                .on(CheckButton_1.CheckButtonEvent.Change, (_, enabled) => { this.npcs = enabled; })
                .appendTo(this);
            new CheckButton_1.CheckButton(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.FilterTileEvents))
                .on(CheckButton_1.CheckButtonEvent.Change, (_, enabled) => { this.tileEvents = enabled; })
                .appendTo(this);
            new LabelledRow_1.LabelledRow(this.api)
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAction)))
                .append(this.dropdownAction = new Dropdown_1.default(this.api)
                .on(Dropdown_1.DropdownEvent.Selection, (_, action) => this.action = action)
                .setRefreshMethod(() => ({
                defaultOption: IDebugTools_1.DebugToolsTranslation.ActionRemove,
                options: [
                    [IDebugTools_1.DebugToolsTranslation.ActionRemove, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))],
                ],
            })))
                .appendTo(this);
            new Button_1.default(this.api)
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonExecute))
                .on(Button_1.ButtonEvent.Activate, this.execute)
                .appendTo(this);
        }
        getTranslation() {
            return IDebugTools_1.DebugToolsTranslation.PanelSelection;
        }
        execute() {
            const targets = IterableIterator_1.pipe(this.creatures && game.creatures, this.npcs && game.npcs, this.tileEvents && game.tileEvents)
                .flat()
                .filter(entity => !!entity)
                .collect(Collectors_1.default.toArray);
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
            Actions_1.default.get("executeOnSelection").execute({
                object: [
                    this.action,
                    targets.slice(0, quantity)
                        .map(target => Arrays_1.tuple(getSelectionType(target), target.id)),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uUGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvcGFuZWwvU2VsZWN0aW9uUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBbUJBLElBQVksYUFJWDtJQUpELFdBQVksYUFBYTtRQUN4Qix5REFBUSxDQUFBO1FBQ1IsK0NBQUcsQ0FBQTtRQUNILDJEQUFTLENBQUE7SUFDVixDQUFDLEVBSlcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFJeEI7SUFFRCxNQUFNLDRCQUE0QixHQUFHO1FBQ3BDLENBQUMsb0JBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxhQUFhLENBQUMsUUFBUTtRQUM3QyxDQUFDLG9CQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsYUFBYSxDQUFDLEdBQUc7S0FDbkMsQ0FBQztJQUVGLFNBQVMsZ0JBQWdCLENBQUMsTUFBcUM7UUFDOUQsT0FBTyxZQUFZLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDM0csQ0FBQztJQUVELE1BQXFCLGNBQWUsU0FBUSx5QkFBZTtRQVcxRCxZQUFtQixLQUFxQjtZQUN2QyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFQTixjQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ2xCLFNBQUksR0FBRyxLQUFLLENBQUM7WUFDYixlQUFVLEdBQUcsS0FBSyxDQUFDO1lBTzFCLElBQUkseUJBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO2lCQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztpQkFDcEYsTUFBTSxD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
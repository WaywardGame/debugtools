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
                .event.subscribe("selection", this.changeMethod))
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
                .event.subscribe("toggle", (_, enabled) => this.creatures = enabled)
                .appendTo(this);
            new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.FilterNPCs))
                .event.subscribe("toggle", (_, enabled) => this.npcs = enabled)
                .appendTo(this);
            new CheckButton_1.CheckButton()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.FilterTileEvents))
                .event.subscribe("toggle", (_, enabled) => this.tileEvents = enabled)
                .appendTo(this);
            new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAction)))
                .append(new Dropdown_1.default()
                .event.subscribe("selection", (_, action) => this.action = action)
                .setRefreshMethod(() => ({
                defaultOption: IDebugTools_1.DebugToolsTranslation.ActionRemove,
                options: [
                    [IDebugTools_1.DebugToolsTranslation.ActionRemove, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))],
                ],
            })))
                .appendTo(this);
            new Button_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonExecute))
                .event.subscribe("activate", this.execute)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uUGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvcGFuZWwvU2VsZWN0aW9uUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBbUJBLElBQVksYUFJWDtJQUpELFdBQVksYUFBYTtRQUN4Qix5REFBUSxDQUFBO1FBQ1IsK0NBQUcsQ0FBQTtRQUNILDJEQUFTLENBQUE7SUFDVixDQUFDLEVBSlcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFJeEI7SUFFRCxNQUFNLDRCQUE0QixHQUFHO1FBQ3BDLENBQUMsb0JBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxhQUFhLENBQUMsUUFBUTtRQUM3QyxDQUFDLG9CQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsYUFBYSxDQUFDLEdBQUc7S0FDbkMsQ0FBQztJQUVGLFNBQVMsZ0JBQWdCLENBQUMsTUFBcUM7UUFDOUQsT0FBTyxZQUFZLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDM0csQ0FBQztJQUVELE1BQXFCLGNBQWUsU0FBUSx5QkFBZTtRQVMxRDtZQUNDLEtBQUssRUFBRSxDQUFDO1lBUEQsY0FBUyxHQUFHLEtBQUssQ0FBQztZQUNsQixTQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ2IsZUFBVSxHQUFHLEtBQUssQ0FBQztZQU8xQixJQUFJLHlCQUFXLEVBQUU7aUJBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7aUJBQ3BGLE1BQU0sQ0FBQyxJQUFJLGtCQUFRLEVBQXlCO2lCQUMzQyxnQkFBZ0IsQ0FBQyxHQUFH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
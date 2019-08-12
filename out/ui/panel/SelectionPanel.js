var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "doodad/Doodad", "doodad/IDoodad", "entity/action/ActionExecutor", "entity/creature/ICreature", "entity/IEntity", "entity/npc/NPCS", "entity/player/Player", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/dropdown/CorpseDropdown", "newui/component/dropdown/CreatureDropdown", "newui/component/dropdown/DoodadDropdown", "newui/component/dropdown/NPCDropdown", "newui/component/dropdown/TileEventDropdown", "newui/component/LabelledRow", "newui/component/RangeRow", "tile/ITileEvent", "utilities/Arrays", "utilities/math/Vector2", "utilities/stream/Stream", "../../action/SelectionExecute", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, Doodad_1, IDoodad_1, ActionExecutor_1, ICreature_1, IEntity_1, NPCS_1, Player_1, BlockRow_1, Button_1, CheckButton_1, Dropdown_1, CorpseDropdown_1, CreatureDropdown_1, DoodadDropdown_1, NPCDropdown_1, TileEventDropdown_1, LabelledRow_1, RangeRow_1, ITileEvent_1, Arrays_1, Vector2_1, Stream_1, SelectionExecute_1, IDebugTools_1, DebugToolsPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const entityTypeToSelectionTypeMap = {
        [IEntity_1.EntityType.Creature]: SelectionExecute_1.SelectionType.Creature,
        [IEntity_1.EntityType.NPC]: SelectionExecute_1.SelectionType.NPC,
        [IEntity_1.EntityType.Player]: SelectionExecute_1.SelectionType.Player,
    };
    function getSelectionType(target) {
        return "entityType" in target ? entityTypeToSelectionTypeMap[target.entityType]
            : target instanceof Doodad_1.default ? SelectionExecute_1.SelectionType.Doodad
                : SelectionExecute_1.SelectionType.TileEvent;
    }
    class SelectionPanel extends DebugToolsPanel_1.default {
        constructor() {
            super();
            this.creatures = new SelectionSource(game.creatures, IDebugTools_1.DebugToolsTranslation.FilterCreatures, new CreatureDropdown_1.default("all", [["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (creature, filter) => filter === "all" || (creature && creature.type === ICreature_1.CreatureType[filter]));
            this.npcs = new SelectionSource(game.npcs, IDebugTools_1.DebugToolsTranslation.FilterNPCs, new NPCDropdown_1.default("all", [["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (npc, filter) => filter === "all" || (npc && npc.type === NPCS_1.NPCType[filter]));
            this.tileEvents = new SelectionSource(game.tileEvents, IDebugTools_1.DebugToolsTranslation.FilterTileEvents, new TileEventDropdown_1.default("all", [["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (tileEvent, filter) => filter === "all" || (tileEvent && tileEvent.type === ITileEvent_1.TileEventType[filter]));
            this.doodads = new SelectionSource(game.doodads, IDebugTools_1.DebugToolsTranslation.FilterDoodads, new DoodadDropdown_1.DoodadDropdown("all", [["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (doodad, filter) => filter === "all" || (doodad && doodad.type === IDoodad_1.DoodadType[filter]));
            this.corpses = new SelectionSource(game.corpses, IDebugTools_1.DebugToolsTranslation.FilterCorpses, new CorpseDropdown_1.default("all", [["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (corpse, filter) => filter === "all" || (corpse && corpse.type === ICreature_1.CreatureType[filter]));
            this.players = new SelectionSource(players, IDebugTools_1.DebugToolsTranslation.FilterPlayers, new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: "all",
                options: Stream_1.default.of(["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))])
                    .merge(players.map(player => Arrays_1.Tuple(player.identifier, option => option.setText(player.getName())))),
            })), (player, filter) => player.identifier !== this.dropdownAlternativeTarget.selection
                && (filter === "all" || (player && player.identifier === filter)));
            this.rangeQuantity = new RangeRow_1.RangeRow()
                .classes.add("debug-tools-dialog-selection-quantity")
                .setLabel(label => label.hide())
                .editRange(range => range
                .setMax(55)
                .setStep(0.01))
                .setDisplayValue(value => [{ content: `${Math.floor(1.2 ** value)}` }]);
            this.dropdownMethod = new Dropdown_1.default()
                .event.subscribe("selection", (_, method) => this.rangeQuantity.toggle(method !== IDebugTools_1.DebugToolsTranslation.MethodAll))
                .setRefreshMethod(() => ({
                defaultOption: IDebugTools_1.DebugToolsTranslation.MethodAll,
                options: [
                    [IDebugTools_1.DebugToolsTranslation.MethodAll, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.MethodAll))],
                    [IDebugTools_1.DebugToolsTranslation.MethodNearest, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.MethodNearest))],
                    [IDebugTools_1.DebugToolsTranslation.MethodRandom, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.MethodRandom))],
                ],
            }));
            this.dropdownMethodWrapper = new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionMethod)))
                .append(this.dropdownMethod, this.rangeQuantity)
                .appendTo(this);
            this.dropdownAlternativeTarget = new Dropdown_1.default().hide();
            this.dropdownAction = new Dropdown_1.default()
                .event.subscribe("selection", this.onActionChange)
                .setRefreshMethod(() => ({
                defaultOption: IDebugTools_1.DebugToolsTranslation.ActionRemove,
                options: [
                    [IDebugTools_1.DebugToolsTranslation.ActionRemove, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))],
                    [IDebugTools_1.DebugToolsTranslation.ActionTeleportTo, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionTeleportTo))],
                ],
            }));
            this.append(this.creatures, this.npcs, this.tileEvents, this.doodads, this.corpses, this.players);
            new BlockRow_1.BlockRow()
                .append(this.dropdownAlternativeTarget)
                .append(new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAction)))
                .append(this.dropdownAction))
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
            const targets = Stream_1.default.of(this.creatures.getTargetable(), this.npcs.getTargetable(), this.tileEvents.getTargetable(), this.doodads.getTargetable(), this.corpses.getTargetable(), this.players.getTargetable())
                .flatMap(value => Array.isArray(value) ? value : value ? [value] : [])
                .filter(entity => !!entity)
                .toArray();
            if (!targets.length)
                return;
            let quantity = Math.floor(1.2 ** this.rangeQuantity.value);
            switch (this.dropdownMethod.selection) {
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
            ActionExecutor_1.default.get(SelectionExecute_1.default).execute(localPlayer, this.dropdownAction.selection, targets.slice(0, quantity)
                .map(target => Arrays_1.Tuple(getSelectionType(target), target instanceof Player_1.default ? target.identifier : target.id)), this.dropdownAlternativeTarget.selection);
        }
        onActionChange(_, action) {
            switch (action) {
                case IDebugTools_1.DebugToolsTranslation.ActionTeleportTo:
                    this.dropdownMethod.select(IDebugTools_1.DebugToolsTranslation.MethodNearest);
                    this.dropdownAlternativeTarget
                        .setRefreshMethod(() => ({
                        defaultOption: localPlayer.identifier,
                        options: players.map(player => Arrays_1.Tuple(player.identifier, option => option.setText(player.getName()))),
                    }))
                        .selectDefault();
                    break;
                case IDebugTools_1.DebugToolsTranslation.ActionRemove:
                    this.players.checkButton.setChecked(false);
                    break;
            }
            this.players.checkButton.setDisabled(action === IDebugTools_1.DebugToolsTranslation.ActionRemove);
            this.dropdownMethodWrapper.classes.toggle(action === IDebugTools_1.DebugToolsTranslation.ActionTeleportTo, "disabled");
            this.dropdownAlternativeTarget.toggle(action === IDebugTools_1.DebugToolsTranslation.ActionTeleportTo);
        }
    }
    __decorate([
        Override
    ], SelectionPanel.prototype, "getTranslation", null);
    __decorate([
        Bound
    ], SelectionPanel.prototype, "execute", null);
    __decorate([
        Bound
    ], SelectionPanel.prototype, "onActionChange", null);
    exports.default = SelectionPanel;
    class SelectionSource extends BlockRow_1.BlockRow {
        constructor(objectArray, dTranslation, dropdown, filterPredicate) {
            super();
            this.objectArray = objectArray;
            this.dropdown = dropdown;
            this.filterPredicate = filterPredicate;
            this.checkButton = new CheckButton_1.CheckButton()
                .event.subscribe("toggle", (_, checked) => this.filter.toggle(checked))
                .appendTo(this);
            this.filter = new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionFilter)))
                .hide()
                .appendTo(this);
            this.checkButton.setText(IDebugTools_1.translation(dTranslation));
            this.filter.append(dropdown);
        }
        getTargetable() {
            if (!this.checkButton.checked)
                return [];
            return this.objectArray.filter(value => this.filterPredicate(value, this.dropdown.selection));
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uUGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvcGFuZWwvU2VsZWN0aW9uUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBOEJBLE1BQU0sNEJBQTRCLEdBQUc7UUFDcEMsQ0FBQyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGdDQUFhLENBQUMsUUFBUTtRQUM3QyxDQUFDLG9CQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsZ0NBQWEsQ0FBQyxHQUFHO1FBQ25DLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxnQ0FBYSxDQUFDLE1BQU07S0FDekMsQ0FBQztJQUVGLFNBQVMsZ0JBQWdCLENBQUMsTUFBK0Q7UUFDeEYsT0FBTyxZQUFZLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQzlFLENBQUMsQ0FBQyxNQUFNLFlBQVksZ0JBQU0sQ0FBQyxDQUFDLENBQUMsZ0NBQWEsQ0FBQyxNQUFNO2dCQUNoRCxDQUFDLENBQUMsZ0NBQWEsQ0FBQyxTQUFTLENBQUM7SUFDN0IsQ0FBQztJQUVELE1BQXFCLGNBQWUsU0FBUSx5QkFBZTtRQXFFMUQ7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQXBFUSxjQUFTLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxtQ0FBcUIsQ0FBQyxlQUFlLEVBQ3JHLElBQUksMEJBQWdCLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHlCQUFXLENBQUMsbUNBQXFCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDakgsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEtBQUssS0FBSyxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FB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
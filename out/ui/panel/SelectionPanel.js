var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "doodad/Doodad", "entity/action/ActionExecutor", "entity/IEntity", "entity/player/Player", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/Dropdown", "newui/component/dropdown/CorpseDropdown", "newui/component/dropdown/CreatureDropdown", "newui/component/dropdown/DoodadDropdown", "newui/component/dropdown/NPCDropdown", "newui/component/dropdown/TileEventDropdown", "newui/component/LabelledRow", "newui/component/RangeRow", "newui/component/Text", "utilities/Arrays", "utilities/math/Vector2", "../../action/SelectionExecute", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, Doodad_1, ActionExecutor_1, IEntity_1, Player_1, BlockRow_1, Button_1, CheckButton_1, Dropdown_1, CorpseDropdown_1, CreatureDropdown_1, DoodadDropdown_1, NPCDropdown_1, TileEventDropdown_1, LabelledRow_1, RangeRow_1, Text_1, Arrays_1, Vector2_1, SelectionExecute_1, IDebugTools_1, DebugToolsPanel_1) {
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
    let SelectionPanel = (() => {
        class SelectionPanel extends DebugToolsPanel_1.default {
            constructor() {
                super();
                this.textPreposition = new Text_1.default().setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.To)).hide();
                this.creatures = new SelectionSource(island.creatures, IDebugTools_1.DebugToolsTranslation.FilterCreatures, new CreatureDropdown_1.default("all", [["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (creature, filter) => filter === "all" || (creature && creature.type === filter));
                this.npcs = new SelectionSource(island.npcs, IDebugTools_1.DebugToolsTranslation.FilterNPCs, new NPCDropdown_1.default("all", [["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (npc, filter) => filter === "all" || (npc && npc.type === filter));
                this.tileEvents = new SelectionSource(island.tileEvents, IDebugTools_1.DebugToolsTranslation.FilterTileEvents, new TileEventDropdown_1.default("all", [["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (tileEvent, filter) => filter === "all" || (tileEvent && tileEvent.type === filter));
                this.doodads = new SelectionSource(island.doodads, IDebugTools_1.DebugToolsTranslation.FilterDoodads, new DoodadDropdown_1.DoodadDropdown("all", [["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (doodad, filter) => filter === "all" || (doodad && doodad.type === filter));
                this.corpses = new SelectionSource(island.corpses, IDebugTools_1.DebugToolsTranslation.FilterCorpses, new CorpseDropdown_1.default("all", [["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (corpse, filter) => filter === "all" || (corpse && corpse.type === filter));
                this.players = new SelectionSource(players, IDebugTools_1.DebugToolsTranslation.FilterPlayers, new Dropdown_1.default()
                    .setRefreshMethod(() => ({
                    defaultOption: "all",
                    options: Stream.of(["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))])
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
                this.dropdownAlternativeTarget = new Dropdown_1.default().hide();
                this.dropdownAction = new Dropdown_1.default()
                    .event.subscribe("selection", this.onActionChange)
                    .setRefreshMethod(() => ({
                    defaultOption: IDebugTools_1.DebugToolsTranslation.ActionRemove,
                    options: [
                        [IDebugTools_1.DebugToolsTranslation.ActionRemove, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))],
                        [IDebugTools_1.DebugToolsTranslation.ActionTeleport, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionTeleport))],
                    ],
                }));
                new BlockRow_1.BlockRow()
                    .classes.add("debug-tools-selection-action")
                    .append(new LabelledRow_1.LabelledRow()
                    .classes.add("dropdown-label")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAction)))
                    .append(this.dropdownAction))
                    .append(this.dropdownAlternativeTarget)
                    .append(this.textPreposition)
                    .appendTo(this);
                new LabelledRow_1.LabelledRow()
                    .classes.add("dropdown-label")
                    .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionMethod)))
                    .append(this.dropdownMethod, this.rangeQuantity)
                    .appendTo(this);
                this.append(this.creatures, this.npcs, this.tileEvents, this.doodads, this.corpses, this.players);
                new Button_1.default()
                    .classes.add("has-icon-before", "icon-arrow-right", "icon-no-scale")
                    .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonExecute))
                    .event.subscribe("activate", this.execute)
                    .appendTo(this);
            }
            getTranslation() {
                return IDebugTools_1.DebugToolsTranslation.PanelSelection;
            }
            execute() {
                const targets = Stream.of(this.creatures.getTargetable(), this.npcs.getTargetable(), this.tileEvents.getTargetable(), this.doodads.getTargetable(), this.corpses.getTargetable(), this.players.getTargetable())
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
                    case IDebugTools_1.DebugToolsTranslation.ActionTeleport:
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
                this.dropdownMethod.options.get(IDebugTools_1.DebugToolsTranslation.MethodAll).setDisabled(action === IDebugTools_1.DebugToolsTranslation.ActionTeleport);
                this.rangeQuantity.setDisabled(action === IDebugTools_1.DebugToolsTranslation.ActionTeleport);
                this.dropdownAlternativeTarget.toggle(action === IDebugTools_1.DebugToolsTranslation.ActionTeleport);
                this.textPreposition.toggle(action === IDebugTools_1.DebugToolsTranslation.ActionTeleport);
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
        return SelectionPanel;
    })();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uUGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvcGFuZWwvU2VsZWN0aW9uUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBMEJBLE1BQU0sNEJBQTRCLEdBQUc7UUFDcEMsQ0FBQyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGdDQUFhLENBQUMsUUFBUTtRQUM3QyxDQUFDLG9CQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsZ0NBQWEsQ0FBQyxHQUFHO1FBQ25DLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxnQ0FBYSxDQUFDLE1BQU07S0FDekMsQ0FBQztJQUVGLFNBQVMsZ0JBQWdCLENBQUMsTUFBOEQ7UUFDdkYsT0FBTyxZQUFZLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQzlFLENBQUMsQ0FBQyxNQUFNLFlBQVksZ0JBQU0sQ0FBQyxDQUFDLENBQUMsZ0NBQWEsQ0FBQyxNQUFNO2dCQUNoRCxDQUFDLENBQUMsZ0NBQWEsQ0FBQyxTQUFTLENBQUM7SUFDN0IsQ0FBQztJQUVEO1FBQUEsTUFBcUIsY0FBZSxTQUFRLHlCQUFlO1lBaUUxRDtnQkFDQyxLQUFLLEVBQUUsQ0FBQztnQkFoRVEsb0JBQWUsR0FBRyxJQUFJLGNBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBRW5GLGNBQVMsR0FBRyxJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLG1DQUFxQixDQUFDLGVBQWUsRUFDdkcsSUFBSSwwQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxtQ0FBcUIsQ0FBQyxZ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
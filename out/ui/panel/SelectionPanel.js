var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "doodad/Doodad", "entity/action/ActionExecutor", "entity/IEntity", "entity/player/Player", "event/EventManager", "mod/Mod", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/Component", "newui/component/Dropdown", "newui/component/dropdown/CorpseDropdown", "newui/component/dropdown/CreatureDropdown", "newui/component/dropdown/DoodadDropdown", "newui/component/dropdown/NPCDropdown", "newui/component/dropdown/TileEventDropdown", "newui/component/LabelledRow", "newui/component/RangeRow", "newui/component/Text", "newui/screen/screens/menu/component/Spacer", "utilities/Arrays", "utilities/math/Vector2", "../../action/SelectionExecute", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, Doodad_1, ActionExecutor_1, IEntity_1, Player_1, EventManager_1, Mod_1, BlockRow_1, Button_1, CheckButton_1, Component_1, Dropdown_1, CorpseDropdown_1, CreatureDropdown_1, DoodadDropdown_1, NPCDropdown_1, TileEventDropdown_1, LabelledRow_1, RangeRow_1, Text_1, Spacer_1, Arrays_1, Vector2_1, SelectionExecute_1, IDebugTools_1, DebugToolsPanel_1) {
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
            this.targets = [];
            this.textPreposition = new Text_1.default().setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.To)).hide();
            this.countRow = new LabelledRow_1.LabelledRow()
                .setLabel(label => label.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.LabelSelectionCount)));
            this.buttonExecute = new Button_1.default()
                .classes.add("has-icon-before", "icon-arrow-right", "icon-no-scale")
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ButtonExecute))
                .event.subscribe("activate", this.execute)
                .hide();
            this.creatures = new SelectionSource(island.creatures, IDebugTools_1.DebugToolsTranslation.FilterCreatures, new CreatureDropdown_1.default("all", [["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (creature, filter) => filter === "all" || (creature && creature.type === filter));
            this.npcs = new SelectionSource(island.npcs, IDebugTools_1.DebugToolsTranslation.FilterNPCs, new NPCDropdown_1.default("all", [["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (npc, filter) => filter === "all" || (npc && npc.type === filter));
            this.tileEvents = new SelectionSource(island.tileEvents, IDebugTools_1.DebugToolsTranslation.FilterTileEvents, new TileEventDropdown_1.default("all", [["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (tileEvent, filter) => filter === "all" || (tileEvent && tileEvent.type === filter));
            this.doodads = new SelectionSource(island.doodads, IDebugTools_1.DebugToolsTranslation.FilterDoodads, new DoodadDropdown_1.DoodadDropdown("all", [["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (doodad, filter) => filter === "all" || (doodad && doodad.type === filter));
            this.corpses = new SelectionSource(island.corpses, IDebugTools_1.DebugToolsTranslation.FilterCorpses, new CorpseDropdown_1.default("all", [["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (corpse, filter) => filter === "all" || (corpse && corpse.type === filter));
            this.players = new SelectionSource(players, IDebugTools_1.DebugToolsTranslation.FilterPlayers, new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: "all",
                options: Stream.of(["all", option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionAllPlayers))])
                    .merge(players.map(player => Arrays_1.Tuple(player.identifier, option => option.setText(player.getName())))),
            })), (player, filter) => player.identifier !== this.dropdownAlternativeTarget.selection
                && (filter === "all" || (player && player.identifier === filter)), IDebugTools_1.DebugToolsTranslation.SelectionFilterNamed);
            this.rangeQuantity = new RangeRow_1.RangeRow()
                .classes.add("debug-tools-dialog-selection-quantity")
                .setLabel(label => label.hide())
                .editRange(range => range
                .setMax(55)
                .setStep(0.01))
                .setDisplayValue(value => [{ content: `${Math.floor(1.2 ** value)}` }])
                .event.subscribe("change", this.updateTargets)
                .hide();
            this.dropdownMethod = new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: IDebugTools_1.DebugToolsTranslation.MethodAll,
                options: [
                    [IDebugTools_1.DebugToolsTranslation.MethodAll, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.MethodAll))],
                    [IDebugTools_1.DebugToolsTranslation.MethodNearest, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.MethodNearest))],
                    [IDebugTools_1.DebugToolsTranslation.MethodRandom, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.MethodRandom))],
                ],
            }))
                .event.subscribe("selection", this.onMethodChange);
            this.dropdownAlternativeTarget = new Dropdown_1.default().hide();
            this.dropdownAction = new Dropdown_1.default()
                .event.subscribe("selection", this.onActionChange)
                .setRefreshMethod(() => ({
                defaultOption: IDebugTools_1.DebugToolsTranslation.ActionSelect,
                options: [
                    [IDebugTools_1.DebugToolsTranslation.ActionSelect, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionSelect))],
                    [IDebugTools_1.DebugToolsTranslation.ActionRemove, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionRemove))],
                    [IDebugTools_1.DebugToolsTranslation.ActionTeleport, option => option.setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.ActionTeleport))],
                ],
            }));
            new BlockRow_1.BlockRow()
                .classes.add("debug-tools-selection-action")
                .append(new Component_1.default()
                .append(this.dropdownAction))
                .append(this.dropdownAlternativeTarget)
                .append(this.textPreposition)
                .appendTo(this);
            new BlockRow_1.BlockRow()
                .append(this.dropdownMethod, this.rangeQuantity)
                .appendTo(this);
            [this.creatures, this.npcs, this.tileEvents, this.doodads, this.corpses, this.players]
                .map(selectionSource => selectionSource.event.subscribe("change", this.updateTargets))
                .collect(this.append);
            this.append(new Spacer_1.default(), this.countRow, this.buttonExecute);
            this.updateTargets();
        }
        getTranslation() {
            return IDebugTools_1.DebugToolsTranslation.PanelSelection;
        }
        execute() {
            if (!this.targets.length)
                return;
            ActionExecutor_1.default.get(SelectionExecute_1.default).execute(localPlayer, this.dropdownAction.selection, this.targets
                .map(target => Arrays_1.Tuple(getSelectionType(target), target instanceof Player_1.default ? target.identifier : target.id)), this.dropdownAlternativeTarget.selection);
            this.updateTargets();
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
            this.buttonExecute.toggle(action !== IDebugTools_1.DebugToolsTranslation.ActionSelect);
            this.updateTargets();
        }
        onMethodChange(_, method) {
            this.rangeQuantity.toggle(method !== IDebugTools_1.DebugToolsTranslation.MethodAll);
            this.updateTargets();
        }
        updateTargets() {
            const targets = Stream.of(this.creatures.getTargetable(), this.npcs.getTargetable(), this.tileEvents.getTargetable(), this.doodads.getTargetable(), this.corpses.getTargetable(), this.players.getTargetable())
                .flatMap(value => Arrays_1.default.arrayOr(value))
                .filter(entity => !!entity)
                .toArray();
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
            this.targets.splice(0, Infinity);
            this.targets.push(...targets.slice(0, quantity));
            SelectionPanel.DEBUG_TOOLS.getLog().info("Targets:", this.targets);
            this.countRow.dump()
                .append(new Text_1.default()
                .setText(IDebugTools_1.translation(IDebugTools_1.DebugToolsTranslation.SelectionCount)
                .addArgs(this.targets.length)));
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
    __decorate([
        Bound
    ], SelectionPanel.prototype, "onMethodChange", null);
    __decorate([
        EventManager_1.OwnEventHandler(DebugToolsPanel_1.default, "switchTo"),
        Bound
    ], SelectionPanel.prototype, "updateTargets", null);
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], SelectionPanel, "DEBUG_TOOLS", void 0);
    exports.default = SelectionPanel;
    class SelectionSource extends BlockRow_1.BlockRow {
        constructor(objectArray, dTranslation, dropdown, filterPredicate, filterLabel = IDebugTools_1.DebugToolsTranslation.SelectionFilter) {
            super();
            this.objectArray = objectArray;
            this.dropdown = dropdown;
            this.filterPredicate = filterPredicate;
            this.filterLabel = filterLabel;
            this.checkButton = new CheckButton_1.CheckButton()
                .event.subscribe("toggle", (_, checked) => { this.filter.toggle(checked); this.event.emit("change"); })
                .appendTo(this);
            this.filter = new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText(() => IDebugTools_1.translation(this.dropdown.selection === "all" ? IDebugTools_1.DebugToolsTranslation.SelectionFilterAll : this.filterLabel)))
                .hide()
                .appendTo(this);
            this.classes.add("debug-tools-dialog-selection-source");
            this.checkButton.setText(IDebugTools_1.translation(dTranslation));
            this.filter.append(dropdown);
            dropdown.event.subscribe("selection", () => {
                this.event.emit("change");
                this.filter.refresh();
            });
        }
        getTargetable() {
            if (!this.checkButton.checked)
                return [];
            return this.objectArray.filter(value => this.filterPredicate(value, this.dropdown.selection));
        }
    }
    __decorate([
        Override
    ], SelectionSource.prototype, "event", void 0);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uUGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvcGFuZWwvU2VsZWN0aW9uUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBZ0NBLE1BQU0sNEJBQTRCLEdBQUc7UUFDcEMsQ0FBQyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGdDQUFhLENBQUMsUUFBUTtRQUM3QyxDQUFDLG9CQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsZ0NBQWEsQ0FBQyxHQUFHO1FBQ25DLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxnQ0FBYSxDQUFDLE1BQU07S0FDekMsQ0FBQztJQUlGLFNBQVMsZ0JBQWdCLENBQUMsTUFBYztRQUN2QyxPQUFPLFlBQVksSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLDRCQUE0QixDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDOUUsQ0FBQyxDQUFDLE1BQU0sWUFBWSxnQkFBTSxDQUFDLENBQUMsQ0FBQyxnQ0FBYSxDQUFDLE1BQU07Z0JBQ2hELENBQUMsQ0FBQyxnQ0FBYSxDQUFDLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRUQsTUFBcUIsY0FBZSxTQUFRLHlCQUFlO1FBbUYxRDtZQUNDLEtBQUssRUFBRSxDQUFDO1lBL0VRLFlBQU8sR0FBYSxFQUFFLENBQUM7WUFFdkIsb0JBQWUsR0FBRyxJQUFJLGNBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFbkYsYUFBUSxHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDM0MsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTFFLGtCQUFhLEdBQUcsSUFBSSxnQkFBTSxF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
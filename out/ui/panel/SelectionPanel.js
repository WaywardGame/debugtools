var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "doodad/Doodad", "entity/IEntity", "entity/player/Player", "event/EventManager", "mod/Mod", "newui/component/BlockRow", "newui/component/Button", "newui/component/CheckButton", "newui/component/Component", "newui/component/Dropdown", "newui/component/dropdown/CorpseDropdown", "newui/component/dropdown/CreatureDropdown", "newui/component/dropdown/DoodadDropdown", "newui/component/dropdown/NPCDropdown", "newui/component/dropdown/TileEventDropdown", "newui/component/LabelledRow", "newui/component/RangeRow", "newui/component/Text", "newui/screen/screens/menu/component/Spacer", "utilities/Arrays", "utilities/math/Vector2", "../../action/SelectionExecute", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, Doodad_1, IEntity_1, Player_1, EventManager_1, Mod_1, BlockRow_1, Button_1, CheckButton_1, Component_1, Dropdown_1, CorpseDropdown_1, CreatureDropdown_1, DoodadDropdown_1, NPCDropdown_1, TileEventDropdown_1, LabelledRow_1, RangeRow_1, Text_1, Spacer_1, Arrays_1, Vector2_1, SelectionExecute_1, IDebugTools_1, DebugToolsPanel_1) {
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
            SelectionExecute_1.default.execute(localPlayer, this.dropdownAction.selection, this.targets
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uUGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvcGFuZWwvU2VsZWN0aW9uUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBK0JBLE1BQU0sNEJBQTRCLEdBQUc7UUFDcEMsQ0FBQyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGdDQUFhLENBQUMsUUFBUTtRQUM3QyxDQUFDLG9CQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsZ0NBQWEsQ0FBQyxHQUFHO1FBQ25DLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxnQ0FBYSxDQUFDLE1BQU07S0FDekMsQ0FBQztJQUlGLFNBQVMsZ0JBQWdCLENBQUMsTUFBYztRQUN2QyxPQUFPLFlBQVksSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLDRCQUE0QixDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDOUUsQ0FBQyxDQUFDLE1BQU0sWUFBWSxnQkFBTSxDQUFDLENBQUMsQ0FBQyxnQ0FBYSxDQUFDLE1BQU07Z0JBQ2hELENBQUMsQ0FBQyxnQ0FBYSxDQUFDLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRUQsTUFBcUIsY0FBZSxTQUFRLHlCQUFlO1FBbUYxRDtZQUNDLEtBQUssRUFBRSxDQUFDO1lBL0VRLFlBQU8sR0FBYSxFQUFFLENBQUM7WUFFdkIsb0JBQWUsR0FBRyxJQUFJLGNBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFbkYsYUFBUSxHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDM0MsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5QkFBVyxDQUFDLG1DQUFxQixDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTFFLGtCQUFhLEdBQUcsSUFBSSxnQkFBTSxF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
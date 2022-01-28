var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@wayward/goodstream/Stream", "event/EventManager", "game/doodad/Doodad", "game/entity/IEntity", "game/entity/player/Player", "language/ITranslation", "mod/Mod", "renderer/context/RendererOrigin", "renderer/IRenderer", "renderer/Renderer", "ui/component/BlockRow", "ui/component/Button", "ui/component/CheckButton", "ui/component/Component", "ui/component/Dropdown", "ui/component/dropdown/CorpseDropdown", "ui/component/dropdown/CreatureDropdown", "ui/component/dropdown/DoodadDropdown", "ui/component/dropdown/NPCDropdown", "ui/component/dropdown/TileEventDropdown", "ui/component/LabelledRow", "ui/component/RangeRow", "ui/component/Text", "ui/screen/screens/menu/component/Spacer", "utilities/collection/Arrays", "utilities/Decorators", "utilities/math/Math2", "utilities/math/Vector2", "utilities/random/Random", "../../action/SelectionExecute", "../../IDebugTools", "../component/DebugToolsPanel"], function (require, exports, Stream_1, EventManager_1, Doodad_1, IEntity_1, Player_1, ITranslation_1, Mod_1, RendererOrigin_1, IRenderer_1, Renderer_1, BlockRow_1, Button_1, CheckButton_1, Component_1, Dropdown_1, CorpseDropdown_1, CreatureDropdown_1, DoodadDropdown_1, NPCDropdown_1, TileEventDropdown_1, LabelledRow_1, RangeRow_1, Text_1, Spacer_1, Arrays_1, Decorators_1, Math2_1, Vector2_1, Random_1, SelectionExecute_1, IDebugTools_1, DebugToolsPanel_1) {
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
            this.disposed = false;
            this.targets = [];
            this.textPreposition = new Text_1.default().setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.To)).hide();
            this.countRow = new LabelledRow_1.LabelledRow()
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelSelectionPreview)));
            this.buttonPreviewPrevious = new Button_1.default()
                .classes.add("button-icon", "has-icon-before", "icon-center", "icon-left")
                .event.subscribe("activate", () => { this.previewCursor--; this.updatePreview(); });
            this.buttonPreviewNext = new Button_1.default()
                .classes.add("button-icon", "has-icon-before", "icon-center", "icon-right")
                .event.subscribe("activate", () => { this.previewCursor++; this.updatePreview(); });
            this.buttonExecute = new Button_1.default()
                .classes.add("has-icon-before", "icon-arrow-right", "icon-no-scale")
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonExecute))
                .event.subscribe("activate", this.execute)
                .hide();
            this.creatures = new SelectionSource(localIsland.creatures.getObjects(), IDebugTools_1.DebugToolsTranslation.FilterCreatures, new CreatureDropdown_1.default("all", [["all", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (creature, filter) => filter === "all" || (creature && creature.type === filter));
            this.npcs = new SelectionSource(localIsland.npcs.getObjects(), IDebugTools_1.DebugToolsTranslation.FilterNPCs, new NPCDropdown_1.default("all", [["all", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (npc, filter) => filter === "all" || (npc && npc.type === filter));
            this.tileEvents = new SelectionSource(localIsland.tileEvents.getObjects(), IDebugTools_1.DebugToolsTranslation.FilterTileEvents, new TileEventDropdown_1.default("all", [["all", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (tileEvent, filter) => filter === "all" || (tileEvent && tileEvent.type === filter));
            this.doodads = new SelectionSource(localIsland.doodads.getObjects(), IDebugTools_1.DebugToolsTranslation.FilterDoodads, new DoodadDropdown_1.default("all", [["all", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (doodad, filter) => filter === "all" || (doodad && doodad.type === filter));
            this.corpses = new SelectionSource(localIsland.corpses.getObjects(), IDebugTools_1.DebugToolsTranslation.FilterCorpses, new CorpseDropdown_1.default("all", [["all", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (corpse, filter) => filter === "all" || (corpse && corpse.type === filter));
            this.players = new SelectionSource(players, IDebugTools_1.DebugToolsTranslation.FilterPlayers, new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: "all",
                options: Stream_1.default.of(["all", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.SelectionAllPlayers))])
                    .merge(players.map(player => (0, Arrays_1.Tuple)(player.identifier, option => option.setText(player.getName())))),
            })), (player, filter) => (this.dropdownAlternativeTarget.classes.has("hidden") || player.identifier !== this.dropdownAlternativeTarget.selection)
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
                    [IDebugTools_1.DebugToolsTranslation.MethodAll, option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.MethodAll))],
                    [IDebugTools_1.DebugToolsTranslation.MethodNearest, option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.MethodNearest))],
                    [IDebugTools_1.DebugToolsTranslation.MethodRandom, option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.MethodRandom))],
                ],
            }))
                .event.subscribe("selection", this.onMethodChange);
            this.buttonReroll = new Button_1.default()
                .classes.add("has-icon-before", "icon-dice", "icon-no-scale")
                .event.subscribe("activate", this.updateTargets)
                .hide();
            this.dropdownAlternativeTarget = new Dropdown_1.default().hide();
            this.dropdownAction = new Dropdown_1.default()
                .event.subscribe("selection", this.onActionChange)
                .setRefreshMethod(() => ({
                defaultOption: IDebugTools_1.DebugToolsTranslation.ActionSelect,
                options: [
                    [IDebugTools_1.DebugToolsTranslation.ActionSelect, option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionSelect))],
                    [IDebugTools_1.DebugToolsTranslation.ActionRemove, option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionRemove))],
                    [IDebugTools_1.DebugToolsTranslation.ActionTeleport, option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionTeleport))],
                ],
            }));
            this.previewCursor = 0;
            new BlockRow_1.BlockRow()
                .classes.add("debug-tools-selection-action")
                .append(new Component_1.default()
                .append(this.dropdownAction))
                .append(this.dropdownAlternativeTarget)
                .append(this.textPreposition)
                .appendTo(this);
            new BlockRow_1.BlockRow()
                .classes.add("debug-tools-selection-method")
                .append(this.dropdownMethod, this.rangeQuantity, this.buttonReroll)
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
                .map(target => (0, Arrays_1.Tuple)(getSelectionType(target), target instanceof Player_1.default ? target.identifier : target.id)), this.dropdownAlternativeTarget.selection);
            this.updateTargets();
        }
        onAppend() {
            this.getDialog()?.event.until(this, "remove").subscribe("resize", this.resize);
            this.disposeCanvas();
            this.canvas = new Component_1.default("canvas")
                .attributes.set("width", "300")
                .attributes.set("height", "200")
                .classes.add("debug-tools-selection-preview")
                .appendTo(new Component_1.default()
                .classes.add("debug-tools-selection-preview-wrapper")
                .append(this.buttonPreviewPrevious, this.buttonPreviewNext));
            this.append(this.canvas.getParent());
            Renderer_1.default.createWebGlContext(this.canvas.element).then(async (context) => {
                if (this.disposed) {
                    context.delete();
                    return;
                }
                await context.load(true);
                if (this.disposed) {
                    context.delete();
                    return;
                }
                this.webGlContext = context;
                const entity = localPlayer;
                this.renderer = new Renderer_1.default(context, entity);
                this.renderer.setViewport(new Vector2_1.default(300, 200));
                this.renderer.fieldOfView.disabled = true;
                this.renderer.event.subscribe("getZoomLevel", () => 2);
                this.resize();
            });
        }
        onDispose() {
            this.disposed = true;
            this.disposeCanvas();
        }
        disposeCanvas() {
            this.renderer?.delete();
            this.renderer = undefined;
            this.webGlContext?.delete();
            this.webGlContext = undefined;
            this.canvas?.remove();
            this.canvas = undefined;
        }
        onActionChange(_, action) {
            switch (action) {
                case IDebugTools_1.DebugToolsTranslation.ActionTeleport:
                    this.dropdownMethod.select(IDebugTools_1.DebugToolsTranslation.MethodNearest);
                    this.dropdownAlternativeTarget
                        .setRefreshMethod(() => ({
                        defaultOption: localPlayer.identifier,
                        options: players.map(player => (0, Arrays_1.Tuple)(player.identifier, option => option.setText(player.getName()))),
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
            this.buttonReroll.toggle(method === IDebugTools_1.DebugToolsTranslation.MethodRandom);
            this.updateTargets();
        }
        updateTargets() {
            const targets = Stream_1.default.of(this.creatures.getTargetable(), this.npcs.getTargetable(), this.tileEvents.getTargetable(), this.doodads.getTargetable(), this.corpses.getTargetable(), this.players.getTargetable())
                .flatMap(value => Arrays_1.default.arrayOr(value))
                .filter(entity => !!entity)
                .toArray();
            let quantity = Math.floor(1.2 ** this.rangeQuantity.value);
            switch (this.dropdownMethod.selection) {
                case IDebugTools_1.DebugToolsTranslation.MethodAll:
                    quantity = targets.length;
                    break;
                case IDebugTools_1.DebugToolsTranslation.MethodRandom:
                    Random_1.generalRandom.shuffle(targets);
                    break;
                case IDebugTools_1.DebugToolsTranslation.MethodNearest:
                    targets.sort((a, b) => Vector2_1.default.squaredDistance(a, localPlayer) - Vector2_1.default.squaredDistance(b, localPlayer));
                    break;
            }
            this.targets.splice(0, Infinity);
            this.targets.push(...targets.slice(0, quantity));
            SelectionPanel.DEBUG_TOOLS.getLog().info("Targets:", this.targets);
            this.canvas?.classes.toggle(!!this.targets.length, "has-targets");
            this.buttonPreviewPrevious.toggle(this.targets.length > 1);
            this.buttonPreviewNext.toggle(this.targets.length > 1);
            this.previewCursor = 0;
            this.updatePreview();
        }
        resize() {
            if (!this.canvas) {
                return;
            }
            const box = this.canvas.getBox(true, true);
            const width = this.canvas.element.width = box.width || 300;
            const height = this.canvas.element.height = box.height || 200;
            this.renderer?.setViewport(new Vector2_1.default(width, height));
            this.rerender(IRenderer_1.RenderSource.Resize);
        }
        updatePreview() {
            const which = Math2_1.default.mod(this.previewCursor, (this.targets.length || 1));
            const target = this.targets[which];
            if (!target) {
                this.countRow.dump()
                    .append(new Text_1.default()
                    .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.SelectionPreview)
                    .addArgs(0)));
                return;
            }
            this.countRow.dump()
                .append(new Text_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.SelectionPreview)
                .addArgs(which + 1, this.targets.length, target.getName().inContext(ITranslation_1.TextContext.Title))));
            this.renderer?.setOrigin(RendererOrigin_1.RendererOrigin.fromVector(target.island, target));
            this.rerender();
        }
        rerender(reason = IRenderer_1.RenderSource.Mod) {
            this.renderer?.updateView(reason, true, true);
        }
    }
    __decorate([
        Decorators_1.Bound
    ], SelectionPanel.prototype, "execute", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(SelectionPanel, "append")
    ], SelectionPanel.prototype, "onAppend", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(SelectionPanel, "remove")
    ], SelectionPanel.prototype, "onDispose", null);
    __decorate([
        Decorators_1.Bound
    ], SelectionPanel.prototype, "onActionChange", null);
    __decorate([
        Decorators_1.Bound
    ], SelectionPanel.prototype, "onMethodChange", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(DebugToolsPanel_1.default, "switchTo"),
        Decorators_1.Bound
    ], SelectionPanel.prototype, "updateTargets", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(SelectionPanel, "switchTo"),
        Decorators_1.Bound
    ], SelectionPanel.prototype, "resize", null);
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
                .setLabel(label => label.setText(() => (0, IDebugTools_1.translation)(this.dropdown.selection === "all" ? IDebugTools_1.DebugToolsTranslation.SelectionFilterAll : this.filterLabel)))
                .hide()
                .appendTo(this);
            this.classes.add("debug-tools-dialog-selection-source");
            this.checkButton.setText((0, IDebugTools_1.translation)(dTranslation));
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uUGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvcGFuZWwvU2VsZWN0aW9uUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBd0NBLE1BQU0sNEJBQTRCLEdBQUc7UUFDcEMsQ0FBQyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGdDQUFhLENBQUMsUUFBUTtRQUM3QyxDQUFDLG9CQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsZ0NBQWEsQ0FBQyxHQUFHO1FBQ25DLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxnQ0FBYSxDQUFDLE1BQU07S0FDekMsQ0FBQztJQUlGLFNBQVMsZ0JBQWdCLENBQUMsTUFBYztRQUN2QyxPQUFPLFlBQVksSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLDRCQUE0QixDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDOUUsQ0FBQyxDQUFDLE1BQU0sWUFBWSxnQkFBTSxDQUFDLENBQUMsQ0FBQyxnQ0FBYSxDQUFDLE1BQU07Z0JBQ2hELENBQUMsQ0FBQyxnQ0FBYSxDQUFDLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRUQsTUFBcUIsY0FBZSxTQUFRLHlCQUFlO1FBd0cxRDtZQUNDLEtBQUssRUFBRSxDQUFDO1lBcEdELGFBQVEsR0FBRyxLQUFLLENBQUM7WUFFUixZQUFPLEdBQWEsRUFBRSxDQUFDO1lBRXZCLG9CQUFlLEdBQUcsSUFBSSxjQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFbkYsYUFBUSxHQUFHLElBQUkseUJBQVcsRUFBRTtpQkFDM0MsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFBLHlCQUFXLEVBQUMsbUNBQXFCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFD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
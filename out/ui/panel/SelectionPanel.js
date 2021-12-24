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
            var _a;
            (_a = this.getDialog()) === null || _a === void 0 ? void 0 : _a.event.until(this, "remove").subscribe("resize", this.resize);
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
            var _a, _b, _c;
            (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.delete();
            this.renderer = undefined;
            (_b = this.webGlContext) === null || _b === void 0 ? void 0 : _b.delete();
            this.webGlContext = undefined;
            (_c = this.canvas) === null || _c === void 0 ? void 0 : _c.remove();
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
            var _a;
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
            (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.classes.toggle(!!this.targets.length, "has-targets");
            this.buttonPreviewPrevious.toggle(this.targets.length > 1);
            this.buttonPreviewNext.toggle(this.targets.length > 1);
            this.previewCursor = 0;
            this.updatePreview();
        }
        resize() {
            var _a;
            if (!this.canvas) {
                return;
            }
            const box = this.canvas.getBox(true, true);
            const width = this.canvas.element.width = box.width || 300;
            const height = this.canvas.element.height = box.height || 200;
            (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.setViewport(new Vector2_1.default(width, height));
            this.rerender(IRenderer_1.RenderSource.Resize);
        }
        updatePreview() {
            var _a;
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
            (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.setOrigin(RendererOrigin_1.RendererOrigin.fromVector(target.island, target));
            this.rerender();
        }
        rerender(reason = IRenderer_1.RenderSource.Mod) {
            var _a;
            (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.updateView(reason, true, true);
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
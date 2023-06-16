/*!
 * Copyright 2011-2023 Unlok
 * https://www.unlok.ca
 *
 * Credits & Thanks:
 * https://www.unlok.ca/credits-thanks/
 *
 * Wayward is a copyrighted and licensed work. Modification and/or distribution of any source files is prohibited. If you wish to modify the game in any way, please refer to the modding guide:
 * https://github.com/WaywardGame/types/wiki
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@wayward/goodstream/Stream", "event/EventBuses", "event/EventEmitter", "event/EventManager", "game/entity/IEntity", "game/entity/player/Player", "language/ITranslation", "mod/Mod", "renderer/IRenderer", "renderer/Renderer", "renderer/context/RendererOrigin", "ui/component/BlockRow", "ui/component/Button", "ui/component/CheckButton", "ui/component/Component", "ui/component/Dropdown", "ui/component/LabelledRow", "ui/component/RangeRow", "ui/component/Text", "ui/component/dropdown/CorpseDropdown", "ui/component/dropdown/CreatureDropdown", "ui/component/dropdown/DoodadDropdown", "ui/component/dropdown/NPCTypeDropdown", "ui/component/dropdown/TileEventDropdown", "ui/screen/screens/menu/component/Spacer", "utilities/Decorators", "utilities/collection/Arrays", "utilities/collection/Tuple", "utilities/math/Math2", "utilities/math/Vector2", "utilities/math/Vector3", "utilities/random/RandomUtilities", "../../IDebugTools", "../../action/SelectionExecute", "../component/DebugToolsPanel", "ui/input/Bind", "ui/input/Bindable"], function (require, exports, Stream_1, EventBuses_1, EventEmitter_1, EventManager_1, IEntity_1, Player_1, ITranslation_1, Mod_1, IRenderer_1, Renderer_1, RendererOrigin_1, BlockRow_1, Button_1, CheckButton_1, Component_1, Dropdown_1, LabelledRow_1, RangeRow_1, Text_1, CorpseDropdown_1, CreatureDropdown_1, DoodadDropdown_1, NPCTypeDropdown_1, TileEventDropdown_1, Spacer_1, Decorators_1, Arrays_1, Tuple_1, Math2_1, Vector2_1, Vector3_1, RandomUtilities_1, IDebugTools_1, SelectionExecute_1, DebugToolsPanel_1, Bind_1, Bindable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const entityTypeToSelectionTypeMap = {
        [IEntity_1.EntityType.Corpse]: SelectionExecute_1.SelectionType.Corpse,
        [IEntity_1.EntityType.Creature]: SelectionExecute_1.SelectionType.Creature,
        [IEntity_1.EntityType.Doodad]: SelectionExecute_1.SelectionType.Doodad,
        [IEntity_1.EntityType.NPC]: SelectionExecute_1.SelectionType.NPC,
        [IEntity_1.EntityType.Player]: SelectionExecute_1.SelectionType.Player,
        [IEntity_1.EntityType.TileEvent]: SelectionExecute_1.SelectionType.TileEvent,
    };
    function getSelectionType(target) {
        return "entityType" in target ? entityTypeToSelectionTypeMap[target.entityType]
            : "z" in target ? SelectionExecute_1.SelectionType.Location
                : undefined;
    }
    class SelectionPanel extends DebugToolsPanel_1.default {
        constructor() {
            super();
            this.targets = [];
            this.selectionContainer = new Component_1.default();
            this.textPreposition = new Text_1.default().setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.To)).hide();
            this.countRow = new LabelledRow_1.LabelledRow()
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelSelectionPreview)));
            this.buttonPreviewPrevious = new Button_1.default()
                .setDisplayMode(Button_1.ButtonClasses.DisplayModeIcon)
                .classes.add("has-icon-before", "icon-center", "icon-left")
                .event.subscribe("activate", () => { this.previewCursor--; this.updatePreview(); });
            this.buttonPreviewNext = new Button_1.default()
                .setDisplayMode(Button_1.ButtonClasses.DisplayModeIcon)
                .classes.add("has-icon-before", "icon-center", "icon-right")
                .event.subscribe("activate", () => { this.previewCursor++; this.updatePreview(); });
            this.previewWrapper = new Component_1.default()
                .classes.add("debug-tools-selection-preview-wrapper")
                .append(this.buttonPreviewPrevious, this.buttonPreviewNext);
            this.zoomLevel = 2;
            this.buttonExecute = new Button_1.default()
                .classes.add("has-icon-before", "icon-arrow-right", "icon-no-scale")
                .style.set("--icon-zoom", 2)
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonExecute))
                .event.subscribe("activate", this.execute)
                .hide();
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
            this.selectionContainer
                .appendTo(this);
            this.append(new Spacer_1.default(), this.countRow, this.buttonExecute, this.previewWrapper);
            this.updateTargets();
        }
        getTranslation() {
            return IDebugTools_1.DebugToolsTranslation.PanelSelection;
        }
        setupSelectionSources() {
            [this.creatures, this.npcs, this.tileEvents, this.doodads, this.corpses, this.players].forEach(a => a?.remove());
            this.creatures = new SelectionSource(localIsland.creatures.getObjects(), IDebugTools_1.DebugToolsTranslation.FilterCreatures, new CreatureDropdown_1.default("all", [["all", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (creature, filter) => filter === "all" || (creature && creature.type === filter));
            this.npcs = new SelectionSource(localIsland.npcs.getObjects(), IDebugTools_1.DebugToolsTranslation.FilterNPCs, new NPCTypeDropdown_1.default("all", [["all", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (npc, filter) => filter === "all" || (npc && npc.type === filter));
            this.tileEvents = new SelectionSource(localIsland.tileEvents.getObjects(), IDebugTools_1.DebugToolsTranslation.FilterTileEvents, new TileEventDropdown_1.default("all", [["all", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (tileEvent, filter) => filter === "all" || (tileEvent && tileEvent.type === filter));
            this.doodads = new SelectionSource(localIsland.doodads.getObjects(), IDebugTools_1.DebugToolsTranslation.FilterDoodads, new DoodadDropdown_1.default("all", [["all", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (doodad, filter) => filter === "all" || (doodad && doodad.type === filter));
            this.corpses = new SelectionSource(localIsland.corpses.getObjects(), IDebugTools_1.DebugToolsTranslation.FilterCorpses, new CorpseDropdown_1.default("all", [["all", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.SelectionAll))]]), (corpse, filter) => filter === "all" || (corpse && corpse.type === filter));
            this.players = new SelectionSource(game.playerManager.getAll(true, true), IDebugTools_1.DebugToolsTranslation.FilterPlayers, new Dropdown_1.default()
                .setRefreshMethod(() => ({
                defaultOption: "all",
                options: Stream_1.default.of(["all", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.SelectionAllPlayers))])
                    .merge(game.playerManager.getAll(true, true).map(player => (0, Tuple_1.Tuple)(player.identifier, option => option.setText(player.getName())))),
            })), (player, filter) => (this.dropdownAlternativeTarget.classes.has("hidden") || player.identifier !== this.dropdownAlternativeTarget.selection)
                && (filter === "all" || (player && player.identifier === filter)), IDebugTools_1.DebugToolsTranslation.SelectionFilterNamed);
            this.treasure = new SelectionSource(localIsland.treasureMaps
                .flatMap(map => map.getTreasure()
                .map(treasure => new Vector3_1.default(treasure, map.position.z))), IDebugTools_1.DebugToolsTranslation.FilterTreasure);
            [this.creatures, this.npcs, this.tileEvents, this.doodads, this.corpses, this.players, this.treasure]
                .map(selectionSource => selectionSource.event.subscribe("change", this.updateTargets))
                .collect(this.selectionContainer.append);
        }
        execute() {
            if (!this.targets.length)
                return;
            SelectionExecute_1.default.execute(localPlayer, this.dropdownAction.selection, this.targets.map(target => (0, Tuple_1.Tuple)(getSelectionType(target), target instanceof Player_1.default ? target.identifier
                : "entityType" in target ? target.id
                    : `${target.x},${target.y},${target.z}`)), this.dropdownAlternativeTarget.selection);
            this.updateTargets();
        }
        onAppend() {
            this.getDialog()?.event.until(this, "switchAway", "remove")
                .subscribe("resize", () => this.resize());
            this.disposeRendererAndCanvas();
            this.canvas = new Component_1.default("canvas")
                .attributes.set("width", "300")
                .attributes.set("height", "200")
                .classes.add("debug-tools-selection-preview")
                .appendTo(this.previewWrapper);
            this.renderer = new Renderer_1.default(this.canvas.element);
            this.renderer.fieldOfView.disabled = true;
            this.renderer.event.subscribe("getZoomLevel", () => this.zoomLevel);
            this.renderer.setOrigin(localPlayer);
            this.resize();
        }
        onSwitchTo() {
            this.resize();
            Bind_1.default.registerHandlers(this);
        }
        onSwitchAway() {
            Bind_1.default.deregisterHandlers(this);
        }
        onDispose() {
            this.disposeRendererAndCanvas();
        }
        disposeRenderer() {
            this.renderer?.delete();
            this.renderer = undefined;
        }
        disposeRendererAndCanvas() {
            this.disposeRenderer();
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
                        options: game.playerManager.getAll(true, true).map(player => (0, Tuple_1.Tuple)(player.identifier, option => option.setText(player.getName()))),
                    }))
                        .selectDefault();
                    break;
                case IDebugTools_1.DebugToolsTranslation.ActionRemove:
                    this.players?.checkButton.setChecked(false);
                    break;
            }
            this.players?.checkButton.setDisabled(action === IDebugTools_1.DebugToolsTranslation.ActionRemove);
            this.treasure?.checkButton.setDisabled(action === IDebugTools_1.DebugToolsTranslation.ActionRemove);
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
            if (this.targetIslandId !== localPlayer.islandId) {
                this.targetIslandId = localPlayer.islandId;
                this.setupSelectionSources();
            }
            let targets = Stream_1.default.of(this.creatures?.getTargetable() ?? [], this.npcs?.getTargetable() ?? [], this.tileEvents?.getTargetable() ?? [], this.doodads?.getTargetable() ?? [], this.corpses?.getTargetable() ?? [], this.players?.getTargetable() ?? [], this.treasure?.getTargetable() ?? [])
                .flatMap(value => Arrays_1.default.arrayOr(value))
                .filter(entity => !!entity)
                .toArray();
            let quantity = Math.floor(1.2 ** this.rangeQuantity.value);
            switch (this.dropdownMethod.selection) {
                case IDebugTools_1.DebugToolsTranslation.MethodAll:
                    quantity = targets.length;
                    break;
                case IDebugTools_1.DebugToolsTranslation.MethodRandom:
                    targets = RandomUtilities_1.generalRandom.shuffle(targets);
                    break;
                case IDebugTools_1.DebugToolsTranslation.MethodNearest:
                    targets.sort((a, b) => Vector2_1.default.squaredDistance(a, localPlayer) - Vector2_1.default.squaredDistance(b, localPlayer));
                    break;
            }
            this.targets.splice(0, Infinity);
            this.targets.push(...targets.slice(0, quantity));
            SelectionPanel.DEBUG_TOOLS.log.info("Targets:", this.targets);
            this.canvas?.classes.toggle(!!this.targets.length, "has-targets");
            this.buttonPreviewPrevious.toggle(this.targets.length > 1);
            this.buttonPreviewNext.toggle(this.targets.length > 1);
            this.previewCursor = 0;
            this.updatePreview();
        }
        resize() {
            if (!this.canvas || !this.renderer) {
                return;
            }
            const box = this.canvas.getBox(true, true);
            if (box.width === 0 && box.height === 0) {
                return;
            }
            this.canvas.element.width = box.width;
            this.canvas.element.height = box.height;
            this.renderer.setViewportSize(this.canvas.element.width, this.canvas.element.height);
            this.rerender(IRenderer_1.RenderSource.Resize);
        }
        onZoomIn(api) {
            if (api.mouse.isWithin(this.canvas)) {
                this.zoomLevel = Math.max(Math.min(this.zoomLevel + (api.bindable === Bindable_1.default.GameZoomIn ? 1 : -1), IRenderer_1.ZOOM_LEVEL_MAX), IRenderer_1.ZOOM_LEVEL_MIN);
                this.renderer?.updateZoomLevel();
                return true;
            }
            return false;
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
                .addArgs(which + 1, this.targets.length, "entityType" in target ? target.getName().inContext(ITranslation_1.TextContext.Title) : `${target.x}, ${target.y}, ${target.z}`)));
            this.renderer?.setOrigin("entityType" in target ? RendererOrigin_1.RendererOrigin.fromEntity(target) : new RendererOrigin_1.RendererOrigin(localIsland.id, target.x, target.y, target.z));
            this.rerender();
        }
        rerender(reason = IRenderer_1.RenderSource.Mod) {
            this.renderer?.updateView(reason, true);
        }
        onTickEnd() {
            this.rerender();
        }
    }
    exports.default = SelectionPanel;
    __decorate([
        Decorators_1.Bound
    ], SelectionPanel.prototype, "execute", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(SelectionPanel, "append")
    ], SelectionPanel.prototype, "onAppend", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(SelectionPanel, "switchTo")
    ], SelectionPanel.prototype, "onSwitchTo", null);
    __decorate([
        (0, EventManager_1.OwnEventHandler)(SelectionPanel, "switchAway"),
        (0, EventManager_1.OwnEventHandler)(SelectionPanel, "remove")
    ], SelectionPanel.prototype, "onSwitchAway", null);
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
        (0, EventManager_1.OwnEventHandler)(SelectionPanel, "switchTo"),
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "loadedOnIsland"),
        Decorators_1.Bound
    ], SelectionPanel.prototype, "updateTargets", null);
    __decorate([
        (0, Decorators_1.Debounce)(250)
    ], SelectionPanel.prototype, "resize", null);
    __decorate([
        Bind_1.default.onDown(Bindable_1.default.GameZoomIn, EventEmitter_1.Priority.High),
        Bind_1.default.onDown(Bindable_1.default.GameZoomOut, EventEmitter_1.Priority.High)
    ], SelectionPanel.prototype, "onZoomIn", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Game, "tickEnd")
    ], SelectionPanel.prototype, "onTickEnd", null);
    __decorate([
        Mod_1.default.instance(IDebugTools_1.DEBUG_TOOLS_ID)
    ], SelectionPanel, "DEBUG_TOOLS", void 0);
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
                .setLabel(label => label.setText(() => (0, IDebugTools_1.translation)(this.dropdown?.selection === "all" ? IDebugTools_1.DebugToolsTranslation.SelectionFilterAll : this.filterLabel)))
                .hide();
            this.classes.add("debug-tools-dialog-selection-source");
            this.checkButton.setText((0, IDebugTools_1.translation)(dTranslation));
            if (dropdown) {
                this.filter.appendTo(this);
            }
            this.filter.append(dropdown);
            dropdown?.event.subscribe("selection", () => {
                this.event.emit("change");
                this.filter.refresh();
            });
        }
        getTargetable() {
            if (!this.checkButton.checked)
                return [];
            return this.objectArray.filter(value => this.filterPredicate?.(value, this.dropdown?.selection) ?? true);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uUGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvcGFuZWwvU2VsZWN0aW9uUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztHQVNHOzs7Ozs7Ozs7O0lBZ0RILE1BQU0sNEJBQTRCLEdBQUc7UUFDcEMsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLGdDQUFhLENBQUMsTUFBTTtRQUN6QyxDQUFDLG9CQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsZ0NBQWEsQ0FBQyxRQUFRO1FBQzdDLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxnQ0FBYSxDQUFDLE1BQU07UUFDekMsQ0FBQyxvQkFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLGdDQUFhLENBQUMsR0FBRztRQUNuQyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsZ0NBQWEsQ0FBQyxNQUFNO1FBQ3pDLENBQUMsb0JBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxnQ0FBYSxDQUFDLFNBQVM7S0FDL0MsQ0FBQztJQUlGLFNBQVMsZ0JBQWdCLENBQUMsTUFBYztRQUN2QyxPQUFPLFlBQVksSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLDRCQUE0QixDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDOUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLGdDQUFhLENBQUMsUUFBUTtnQkFDdkMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNmLENBQUM7SUFFRCxNQUFxQixjQUFlLFNBQVEseUJBQWU7UUEyRjFEO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUF2RlEsWUFBTyxHQUFhLEVBQUUsQ0FBQztZQUV2Qix1QkFBa0IsR0FBRyxJQUFJLG1CQUFTLEVBQUUsQ0FBQztZQUVyQyxvQkFBZSxHQUFHLElBQUksY0FBSSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUEseUJBQVcsRUFBQyxtQ0FBcUIs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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@wayward/game/game/magic/MagicalPropertyManager", "@wayward/game/game/magic/MagicalPropertyType", "@wayward/game/language/ITranslation", "@wayward/game/language/dictionary/UiTranslation", "@wayward/game/ui/component/Button", "@wayward/game/ui/component/Component", "@wayward/game/ui/component/Details", "@wayward/game/ui/component/LabelledRow", "@wayward/game/ui/component/RangeRow", "@wayward/game/ui/component/dropdown/MagicalPropertyDropdown", "@wayward/utilities/Decorators", "../../IDebugTools", "../../action/MagicalPropertyActions", "./SingletonEditor"], function (require, exports, MagicalPropertyManager_1, MagicalPropertyType_1, ITranslation_1, UiTranslation_1, Button_1, Component_1, Details_1, LabelledRow_1, RangeRow_1, MagicalPropertyDropdown_1, Decorators_1, IDebugTools_1, MagicalPropertyActions_1, SingletonEditor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MagicalPropertiesEditorClasses = void 0;
    var MagicalPropertiesEditorClasses;
    (function (MagicalPropertiesEditorClasses) {
        MagicalPropertiesEditorClasses["Main"] = "debug-tools-magical-properties-editor";
        MagicalPropertiesEditorClasses["Details"] = "debug-tools-magical-properties-editor-details";
        MagicalPropertiesEditorClasses["PropertyList"] = "debug-tools-magical-properties-editor-property-list";
        MagicalPropertiesEditorClasses["Property"] = "debug-tools-magical-properties-editor-property";
        MagicalPropertiesEditorClasses["PropertyNormal"] = "debug-tools-magical-properties-editor-property-normal";
        MagicalPropertiesEditorClasses["PropertySub"] = "debug-tools-magical-properties-editor-property-sub";
        MagicalPropertiesEditorClasses["AddWrapper"] = "debug-tools-magical-properties-editor-add-wrapper";
    })(MagicalPropertiesEditorClasses || (exports.MagicalPropertiesEditorClasses = MagicalPropertiesEditorClasses = {}));
    class MagicalPropertiesEditor extends SingletonEditor_1.default {
        get itemOrDoodad() {
            return this.itemOrDoodadRef?.deref();
        }
        get item() {
            return this.itemOrDoodadRef?.deref()?.asItem;
        }
        get doodad() {
            return this.itemOrDoodadRef?.deref()?.asDoodad;
        }
        constructor() {
            super();
            this.addMagicalPropertyLabelRow = new LabelledRow_1.LabelledRow()
                .classes.add("dropdown-label")
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelMagicalPropertyAdd)))
                .appendTo(this);
            this.addMagicalPropertyDropdown = new MagicalPropertyDropdown_1.default("none", [
                ["none", option => option.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.None))],
            ], true)
                .event.subscribe("selection", this.onChooseMagicalProperty)
                .appendTo(this.addMagicalPropertyLabelRow);
            this.addMagicalPropertyWrapper = new Component_1.default()
                .classes.add(MagicalPropertiesEditorClasses.AddWrapper)
                .hide()
                .appendTo(this);
            this.addMagicalPropertyValue = new RangeRow_1.RangeRow()
                .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelValue)))
                .setDisplayValue(true)
                .appendTo(this.addMagicalPropertyWrapper);
            this.addMagicalPropertyButton = new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonApply))
                .event.subscribe("activate", this.onAddMagicalProperty)
                .appendTo(this.addMagicalPropertyWrapper);
            this.propertyList = new Component_1.default()
                .classes.add(MagicalPropertiesEditorClasses.PropertyList)
                .appendTo(this);
            this.clearMagicalPropertiesButton = new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ButtonRemoveAllMagicalProperties))
                .event.subscribe("activate", this.onClearMagicalProperties)
                .appendTo(this);
            this.classes.add(MagicalPropertiesEditorClasses.Main);
        }
        apply(itemOrDoodad) {
            if (itemOrDoodad === this.itemOrDoodad)
                return;
            this.itemOrDoodadRef = new WeakRef(itemOrDoodad);
            this.refresh();
            const addEventHandlers = () => {
                const untilEvents = this.itemOrDoodad?.magic?.event.until(this, "remove", "unclaim", "claim");
                untilEvents?.subscribe(["add", "remove", "clear", "inherit"], this.refresh);
            };
            if (itemOrDoodad.magic) {
                addEventHandlers();
                return;
            }
            const untilEvents = itemOrDoodad.event.until(this, "remove", "unclaim", "claim");
            untilEvents.subscribe("addMagic", addEventHandlers);
        }
        refresh() {
            const validMagicalProperties = this.itemOrDoodad?.asItem?.getValidMagicalProperties() ?? [];
            const currentMagicalProperties = new Array()
                .concat(this.itemOrDoodad?.magic?.types() ?? [])
                .concat(this.itemOrDoodad?.magic?.identities().map(identity => MagicalPropertyManager_1.MagicalPropertyIdentity.hash(...identity)) ?? []);
            this.addMagicalPropertyDropdown["filterAll"] = id => id === "none"
                || (!currentMagicalProperties.includes(id) && (false
                    || validMagicalProperties.includes(id)
                    || validMagicalProperties.includes(MagicalPropertyManager_1.MagicalPropertyIdentity.unhash(`${id}`)?.[0])));
            this.addMagicalPropertyDropdown.refresh();
            this.propertyList.dump();
            if (!this.itemOrDoodadRef)
                return;
            for (const identity of this.itemOrDoodad?.magic?.identities() ?? []) {
                new MagicalPropertyEditor(identity, this.itemOrDoodadRef)
                    .appendTo(this.propertyList);
            }
        }
        onChooseMagicalProperty(_, id) {
            this.addMagicalPropertyWrapper.toggle(id !== "none");
            if (id === "none")
                return;
            const hash = `${id}`;
            const identity = MagicalPropertyManager_1.MagicalPropertyIdentity.unhash(hash);
            if (!identity)
                throw new Error(`Unable to choose magical property: ${id}`);
            if (!this.item?.description)
                return;
            const info = MagicalPropertyType_1.magicalPropertyDescriptions[identity[0]]?.getInfo(this.item, this.item.description);
            if (!info)
                return;
            this.addMagicalPropertyValue.editRange(range => range
                .setMin(info.min)
                .setMax(info.max)
                .setStep(info.roundToNearestTenthPlace ? 0.1 : 1)
                .schedule(range => range.value = info.min));
        }
        onAddMagicalProperty() {
            const selected = this.addMagicalPropertyDropdown.selectedOption;
            this.addMagicalPropertyDropdown.select("none");
            if (selected === "none" || !this.itemOrDoodad)
                return;
            const hash = `${selected}`;
            const identity = MagicalPropertyManager_1.MagicalPropertyIdentity.unhash(hash);
            if (!identity)
                throw new Error(`Unable to choose magical property: ${selected}`);
            MagicalPropertyActions_1.default.Change.execute(localPlayer, this.itemOrDoodad, identity, this.addMagicalPropertyValue.value);
        }
        onClearMagicalProperties() {
            if (!this.itemOrDoodad)
                return;
            MagicalPropertyActions_1.default.Clear.execute(localPlayer, this.itemOrDoodad);
        }
    }
    __decorate([
        Decorators_1.Bound
    ], MagicalPropertiesEditor.prototype, "refresh", null);
    __decorate([
        Decorators_1.Bound
    ], MagicalPropertiesEditor.prototype, "onChooseMagicalProperty", null);
    __decorate([
        Decorators_1.Bound
    ], MagicalPropertiesEditor.prototype, "onAddMagicalProperty", null);
    __decorate([
        Decorators_1.Bound
    ], MagicalPropertiesEditor.prototype, "onClearMagicalProperties", null);
    class MagicalPropertyEditor extends Details_1.default {
        get item() {
            return this.on.deref()?.asItem;
        }
        get doodad() {
            return this.on.deref()?.asDoodad;
        }
        get itemOrDoodad() {
            return this.on.deref();
        }
        constructor(identity, on) {
            super();
            this.identity = identity;
            this.on = on;
            this.classes.add(MagicalPropertiesEditorClasses.Property)
                .classes.add(MagicalPropertyManager_1.MagicalPropertyIdentity.isNormalProperty(identity) ? MagicalPropertiesEditorClasses.PropertyNormal : MagicalPropertiesEditorClasses.PropertySub);
            this.setSummary(summary => summary
                .setText(this.translate)
                .setInheritTextTooltip());
            const item = this.item;
            if (item?.description) {
                const [property] = identity;
                const description = MagicalPropertyType_1.magicalPropertyDescriptions[property];
                const info = description?.getInfo(item, item.description);
                if (info) {
                    new RangeRow_1.RangeRow()
                        .setLabel(label => label.setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.LabelValue)))
                        .editRange(range => range
                        .setMin(info.min)
                        .setMax(info.max)
                        .setStep(info.roundToNearestTenthPlace ? 0.1 : 1)
                        .setRefreshMethod(() => item.magic?.get(...identity) ?? info.min))
                        .setDisplayValue(true)
                        .event.subscribe("finish", this.onChangeValue)
                        .appendTo(this);
                }
            }
            new Button_1.default()
                .setText((0, IDebugTools_1.translation)(IDebugTools_1.DebugToolsTranslation.ActionRemove).addArgs(this.translate, on.deref()?.getName().inContext(ITranslation_1.TextContext.Title)))
                .event.subscribe("activate", this.onRemove)
                .appendTo(this);
            on.deref()?.magic?.event.until(this, "remove").subscribeNext("remove", this.remove);
        }
        onRemove() {
            if (!this.itemOrDoodad)
                return;
            MagicalPropertyActions_1.default.Remove.execute(localPlayer, this.itemOrDoodad, this.identity);
        }
        onChangeValue(_, value) {
            if (!this.itemOrDoodad)
                return;
            MagicalPropertyActions_1.default.Change.execute(localPlayer, this.itemOrDoodad, this.identity, value);
        }
        translate() {
            return MagicalPropertyDropdown_1.default.getDeveloperMagicalPropertyTranslation(this.identity);
        }
    }
    __decorate([
        Decorators_1.Bound
    ], MagicalPropertyEditor.prototype, "onRemove", null);
    __decorate([
        Decorators_1.Bound
    ], MagicalPropertyEditor.prototype, "onChangeValue", null);
    __decorate([
        Decorators_1.Bound
    ], MagicalPropertyEditor.prototype, "translate", null);
    class MagicalPropertiesEditorDetails extends SingletonEditor_1.default.Details {
        constructor(itemOrDoodad) {
            super();
            this.itemOrDoodad = itemOrDoodad;
            this.classes.add(MagicalPropertiesEditorClasses.Details);
            this.setSummary(summary => summary.setText(UiTranslation_1.default.GameTooltipMagicalLabel));
        }
        createEditor() {
            return new MagicalPropertiesEditor();
        }
        getArgs() {
            return [this.itemOrDoodad];
        }
    }
    exports.default = MagicalPropertiesEditorDetails;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFnaWNhbFByb3BlcnRpZXNFZGl0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdWkvY29tcG9uZW50L01hZ2ljYWxQcm9wZXJ0aWVzRWRpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFpQkEsSUFBWSw4QkFRWDtJQVJELFdBQVksOEJBQThCO1FBQ3pDLGdGQUE4QyxDQUFBO1FBQzlDLDJGQUF5RCxDQUFBO1FBQ3pELHNHQUFvRSxDQUFBO1FBQ3BFLDZGQUEyRCxDQUFBO1FBQzNELDBHQUF3RSxDQUFBO1FBQ3hFLG9HQUFrRSxDQUFBO1FBQ2xFLGtHQUFnRSxDQUFBO0lBQ2pFLENBQUMsRUFSVyw4QkFBOEIsOENBQTlCLDhCQUE4QixRQVF6QztJQUVELE1BQU0sdUJBQXdCLFNBQVEseUJBQWdDO1FBd0NyRSxJQUFXLFlBQVk7WUFDdEIsT0FBTyxJQUFJLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQ3RDLENBQUM7UUFFRCxJQUFXLElBQUk7WUFDZCxPQUFPLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxDQUFDO1FBQzlDLENBQUM7UUFFRCxJQUFXLE1BQU07WUFDaEIsT0FBTyxJQUFJLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsQ0FBQztRQUNoRCxDQUFDO1FBRUQ7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQW5ETywrQkFBMEIsR0FBRyxJQUFJLHlCQUFXLEVBQUU7aUJBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7aUJBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBQSx5QkFBVyxFQUFDLG1DQUFxQixDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztpQkFDNUYsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRUQsK0JBQTBCLEdBQUcsSUFBSSxpQ0FBdUIs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
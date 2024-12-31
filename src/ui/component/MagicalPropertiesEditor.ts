import type Doodad from "@wayward/game/game/doodad/Doodad";
import type Item from "@wayward/game/game/item/Item";
import type MagicalPropertyType from "@wayward/game/game/magic/MagicalPropertyType";
import { magicalPropertyDescriptions } from "@wayward/game/game/magic/MagicalPropertyType";
import { TextContext } from "@wayward/game/language/ITranslation";
import UiTranslation from "@wayward/game/language/dictionary/UiTranslation";
import Button from "@wayward/game/ui/component/Button";
import Component from "@wayward/game/ui/component/Component";
import Details from "@wayward/game/ui/component/Details";
import { LabelledRow } from "@wayward/game/ui/component/LabelledRow";
import { RangeRow } from "@wayward/game/ui/component/RangeRow";
import MagicalPropertyDropdown from "@wayward/game/ui/component/dropdown/MagicalPropertyDropdown";
import { Bound } from "@wayward/utilities/Decorators";
import { DebugToolsTranslation, translation } from "../../IDebugTools";
import MagicalPropertyActions from "../../action/MagicalPropertyActions";
import SingletonEditor from "./SingletonEditor";
import type { MagicalPropertyIdentityHash } from "@wayward/game/game/magic/IMagicalProperty";
import { MagicalPropertyIdentity } from "@wayward/game/game/magic/IMagicalProperty";

export enum MagicalPropertiesEditorClasses {
	Main = "debug-tools-magical-properties-editor",
	Details = "debug-tools-magical-properties-editor-details",
	PropertyList = "debug-tools-magical-properties-editor-property-list",
	Property = "debug-tools-magical-properties-editor-property",
	PropertyNormal = "debug-tools-magical-properties-editor-property-normal",
	PropertySub = "debug-tools-magical-properties-editor-property-sub",
	AddWrapper = "debug-tools-magical-properties-editor-add-wrapper",
}

class MagicalPropertiesEditor extends SingletonEditor<[Item | Doodad]> {

	public readonly addMagicalPropertyLabelRow = new LabelledRow()
		.classes.add("dropdown-label")
		.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelMagicalPropertyAdd)))
		.appendTo(this);

	public readonly addMagicalPropertyDropdown = new MagicalPropertyDropdown("none", [
		["none", option => option.setText(translation(DebugToolsTranslation.None))],
		// ["all", option => option.setText(translation(DebugToolsTranslation.MethodAll))],
	], true)
		.event.subscribe("selection", this.onChooseMagicalProperty)
		.appendTo(this.addMagicalPropertyLabelRow);

	public readonly addMagicalPropertyWrapper = new Component()
		.classes.add(MagicalPropertiesEditorClasses.AddWrapper)
		.hide()
		.appendTo(this);

	public readonly addMagicalPropertyValue = new RangeRow()
		.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelValue)))
		.setDisplayValue(true)
		.appendTo(this.addMagicalPropertyWrapper);

	public readonly addMagicalPropertyButton = new Button()
		.setText(translation(DebugToolsTranslation.ButtonApply))
		.event.subscribe("activate", this.onAddMagicalProperty)
		.appendTo(this.addMagicalPropertyWrapper);

	public readonly propertyList = new Component()
		.classes.add(MagicalPropertiesEditorClasses.PropertyList)
		.appendTo(this);

	public readonly clearMagicalPropertiesButton = new Button()
		.setText(translation(DebugToolsTranslation.ButtonRemoveAllMagicalProperties))
		.event.subscribe("activate", this.onClearMagicalProperties)
		.appendTo(this);

	private itemOrDoodadRef?: WeakRef<Item | Doodad>;

	public get itemOrDoodad() {
		return this.itemOrDoodadRef?.deref();
	}

	public get item() {
		return this.itemOrDoodadRef?.deref()?.asItem;
	}

	public get doodad() {
		return this.itemOrDoodadRef?.deref()?.asDoodad;
	}

	public constructor() {
		super();
		this.classes.add(MagicalPropertiesEditorClasses.Main);
	}

	public override apply(itemOrDoodad: Item | Doodad) {
		if (itemOrDoodad === this.itemOrDoodad) {
			return;
		}

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

		const untilEvents = (itemOrDoodad as Item).event.until(this, "remove", "unclaim", "claim");
		untilEvents.subscribe("addMagic", addEventHandlers);
	}

	@Bound private refresh() {
		const validMagicalProperties = this.itemOrDoodad?.asItem?.getValidMagicalProperties() ?? [];
		const currentMagicalProperties = new Array<MagicalPropertyType | MagicalPropertyIdentityHash>()
			.concat(this.itemOrDoodad?.magic?.types() ?? [])
			.concat(this.itemOrDoodad?.magic?.identities().map(identity => MagicalPropertyIdentity.hash(...identity)) ?? []);

		this.addMagicalPropertyDropdown["filterAll"] = id => id === "none"
			|| (!currentMagicalProperties.includes(id) && (false
				|| validMagicalProperties.includes(id as MagicalPropertyType)
				|| validMagicalProperties.includes(MagicalPropertyIdentity.unhash(`${id}` as MagicalPropertyIdentityHash)?.[0]!)));

		this.addMagicalPropertyDropdown.refresh();

		this.propertyList.dump();

		if (!this.itemOrDoodadRef) {
			return;
		}

		for (const identity of this.itemOrDoodad?.magic?.identities() ?? []) {
			new MagicalPropertyEditor(identity, this.itemOrDoodadRef)
				.appendTo(this.propertyList);
		}
	}

	@Bound private onChooseMagicalProperty(_: any, id: MagicalPropertyType | MagicalPropertyIdentityHash | "none") {
		this.addMagicalPropertyWrapper.toggle(id !== "none");
		if (id === "none") {
			return;
		}

		const hash = `${id}` as MagicalPropertyIdentityHash;
		const identity = MagicalPropertyIdentity.unhash(hash);
		if (!identity) {
			throw new Error(`Unable to choose magical property: ${id}`);
		}

		if (!this.item?.description) {
			return;
		}

		const info = magicalPropertyDescriptions[identity[0]]?.getInfo(this.item, this.item.description);
		if (!info) {
			return;
		}

		this.addMagicalPropertyValue.editRange(range => range
			.setMin(info.min)
			.setMax(info.max)
			.setStep(info.roundToNearestTenthPlace ? 0.1 : 1)
			.schedule(range => range.value = info.min));
	}

	@Bound private onAddMagicalProperty() {
		const selected = this.addMagicalPropertyDropdown.selectedOption;
		this.addMagicalPropertyDropdown.select("none");

		if (selected === "none" || !this.itemOrDoodad) {
			return;
		}

		const hash = `${selected}` as MagicalPropertyIdentityHash;
		const identity = MagicalPropertyIdentity.unhash(hash);
		if (!identity) {
			throw new Error(`Unable to choose magical property: ${selected}`);
		}

		void MagicalPropertyActions.Change.execute(localPlayer, this.itemOrDoodad, identity, this.addMagicalPropertyValue.value);
	}

	@Bound private onClearMagicalProperties() {
		if (!this.itemOrDoodad) {
			return;
		}

		void MagicalPropertyActions.Clear.execute(localPlayer, this.itemOrDoodad);
	}
}

class MagicalPropertyEditor extends Details {

	public get item() {
		return this.on.deref()?.asItem;
	}

	public get doodad() {
		return this.on.deref()?.asDoodad;
	}

	public get itemOrDoodad() {
		return this.on.deref();
	}

	public constructor(public readonly identity: MagicalPropertyIdentity, private readonly on: WeakRef<Item | Doodad>) {
		super();
		this.classes.add(MagicalPropertiesEditorClasses.Property)
			.classes.add(MagicalPropertyIdentity.isNormalProperty(identity) ? MagicalPropertiesEditorClasses.PropertyNormal : MagicalPropertiesEditorClasses.PropertySub);

		this.setSummary(summary => summary
			.setText(this.translate)
			.setInheritTextTooltip());

		const item = this.item;
		if (item?.description) {
			const [property] = identity;
			const description = magicalPropertyDescriptions[property];
			const info = description?.getInfo(item, item.description);
			if (info) {
				new RangeRow()
					.setLabel(label => label.setText(translation(DebugToolsTranslation.LabelValue)))
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

		new Button()
			.setText(translation(DebugToolsTranslation.ActionRemove).addArgs(this.translate, on.deref()?.getName().inContext(TextContext.Title)))
			.event.subscribe("activate", this.onRemove)
			.appendTo(this);

		on.deref()?.magic?.event.until(this, "remove").subscribeNext("remove", this.remove);
	}

	@Bound private onRemove() {
		if (!this.itemOrDoodad) {
			return;
		}

		void MagicalPropertyActions.Remove.execute(localPlayer, this.itemOrDoodad, this.identity);
	}

	@Bound private onChangeValue(_: any, value: number) {
		if (!this.itemOrDoodad) {
			return;
		}

		void MagicalPropertyActions.Change.execute(localPlayer, this.itemOrDoodad, this.identity, value);
	}

	@Bound private translate() {
		return MagicalPropertyDropdown.getDeveloperMagicalPropertyTranslation(this.identity);
	}
}

export default class MagicalPropertiesEditorDetails extends SingletonEditor.Details<[Item | Doodad]> {

	public constructor(public readonly itemOrDoodad: Item | Doodad) {
		super();
		this.classes.add(MagicalPropertiesEditorClasses.Details);
		this.setSummary(summary => summary.setText(UiTranslation.GameTooltipMagicalLabel));
	}

	public override createEditor(): SingletonEditor<[Item | Doodad]> {
		return new MagicalPropertiesEditor();
	}

	public override getArgs(): [Item | Doodad] {
		return [this.itemOrDoodad];
	}
}

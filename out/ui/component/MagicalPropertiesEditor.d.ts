import Doodad from "@wayward/game/game/doodad/Doodad";
import Item from "@wayward/game/game/item/Item";
import SingletonEditor from "./SingletonEditor";
export declare enum MagicalPropertiesEditorClasses {
    Main = "debug-tools-magical-properties-editor",
    Details = "debug-tools-magical-properties-editor-details",
    PropertyList = "debug-tools-magical-properties-editor-property-list",
    Property = "debug-tools-magical-properties-editor-property",
    PropertyNormal = "debug-tools-magical-properties-editor-property-normal",
    PropertySub = "debug-tools-magical-properties-editor-property-sub",
    AddWrapper = "debug-tools-magical-properties-editor-add-wrapper"
}
export default class MagicalPropertiesEditorDetails extends SingletonEditor.Details<[Item | Doodad]> {
    readonly itemOrDoodad: Item | Doodad;
    constructor(itemOrDoodad: Item | Doodad);
    createEditor(): SingletonEditor<[Item | Doodad]>;
    getArgs(): [Item | Doodad];
}

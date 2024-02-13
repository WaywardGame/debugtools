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
